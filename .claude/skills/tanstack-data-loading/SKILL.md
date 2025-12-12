---
name: tanstack-data-loading
description: Configure TanStack Start/Router data loading patterns. Use when implementing beforeLoad guards, route loaders, deferred loading, TanStack Query integration, or cache configuration.
---

# TanStack Data Loading Patterns

This skill provides comprehensive guidelines for implementing data loading in TanStack Start/Router applications.

## Data Loading Lifecycle

The router executes this sequence on each URL/history update:

1. **Route Matching** (Top-Down): Parses params and validates search
2. **Route Pre-Loading** (Serial): Runs `beforeLoad`, handles errors/redirects
3. **Route Loading** (Parallel): Executes `loader`, displays pending component if needed

```
URL Change
    │
    ▼
┌─────────────────┐
│  Route Matching │  (top-down, sequential)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   beforeLoad    │  (sequential, blocks downstream)
│  - Auth checks  │
│  - Redirects    │
│  - Add context  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     loader      │  (parallel across routes)
│  - Fetch data   │
│  - Cached       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Render       │
└─────────────────┘
```

## beforeLoad Pattern

Runs **before** the loader. Executes sequentially from parent to child routes. Use for:

- Authentication/authorization checks
- Redirects
- Injecting data into route context

### Auth Guard

```typescript
// src/routes/_protected.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
})
```

### Context Injection

```typescript
// src/routes/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    // Fetch data needed by all child routes
    const permissions = await fetchUserPermissions(context.auth.user.id)

    // Return value merges into context for downstream routes
    return { permissions }
  },
  component: DashboardLayout,
})

// Child route can access:
// src/routes/dashboard/settings.tsx
export const Route = createFileRoute('/dashboard/settings')({
  beforeLoad: ({ context }) => {
    // context.permissions is available here
    if (!context.permissions.canAccessSettings) {
      throw redirect({ to: '/dashboard' })
    }
  },
})
```

### Role-Based Access

```typescript
export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context }) => {
    const user = context.auth.user

    if (!user) {
      throw redirect({ to: '/login' })
    }

    if (user.role !== 'admin') {
      throw redirect({ to: '/unauthorized' })
    }

    // Optionally add admin-specific context
    return {
      adminConfig: await fetchAdminConfig(),
    }
  },
})
```

## loader Pattern

Main data fetching function. Runs in **parallel** across matched routes.

### Basic Loader

```typescript
// src/routes/posts.tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { posts } from '@/db/schema'

const getPosts = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(posts).orderBy(posts.createdAt)
})

export const Route = createFileRoute('/posts')({
  loader: () => getPosts(),
  component: PostsPage,
})

function PostsPage() {
  const posts = Route.useLoaderData()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Loader with Parameters

```typescript
// src/routes/posts.$postId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getPost = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, id),
    })
    if (!post) throw notFound()
    return post
  })

export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params }) => getPost({ data: params.postId }),
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()
  const { postId } = Route.useParams()

  return <article>{post.content}</article>
}
```

### Loader Parameters Reference

```typescript
loader: async ({
  params, // URL path parameters
  context, // Router context + beforeLoad additions
  deps, // Values from loaderDeps
  abortController, // For fetch cancellation
  cause, // "enter" | "preload" | "stay"
  preload, // Boolean: is this a preload?
  location, // Current location object
  route, // Route object reference
}) => {
  // Pass signal for cancellation support
  const data = await fetch('/api/data', {
    signal: abortController.signal,
  })
  return data.json()
}
```

## loaderDeps Pattern

Declares dependencies that trigger loader re-execution when changed. **Essential for search params**.

### Search Params Dependency

```typescript
// src/routes/search.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().optional().default(''),
  page: z.number().optional().default(1),
  sort: z.enum(['asc', 'desc']).optional().default('desc'),
})

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,

  // Declare what search params affect the loader
  loaderDeps: ({ search }) => ({
    q: search.q,
    page: search.page,
    sort: search.sort,
  }),

  // Loader re-runs when deps change
  loader: async ({ deps }) => {
    return await searchItems({
      query: deps.q,
      page: deps.page,
      sortOrder: deps.sort,
    })
  },

  component: SearchPage,
})

function SearchPage() {
  const { q, page, sort } = Route.useSearch()
  const results = Route.useLoaderData()

  return <SearchResults results={results} />
}
```

### Filtering Pattern

```typescript
// src/routes/products.tsx
const filterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional().default(false),
})

export const Route = createFileRoute('/products')({
  validateSearch: filterSchema,

  loaderDeps: ({ search }) => ({ filters: search }),

  loader: async ({ deps: { filters } }) => {
    return await fetchProducts(filters)
  },

  component: ProductsPage,
})
```

## Deferred Data Loading

Render routes before all data loads by deferring non-critical promises.

### Basic Deferred Pattern

```typescript
// src/routes/dashboard.tsx
import { createFileRoute, Await } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    // Critical data - await (blocks render)
    const user = await fetchUser()

    // Non-critical - don't await (streams later)
    const activityPromise = fetchRecentActivity()
    const statsPromise = fetchDashboardStats()

    return {
      user,
      deferredActivity: activityPromise,
      deferredStats: statsPromise,
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { user, deferredActivity, deferredStats } = Route.useLoaderData()

  return (
    <div>
      {/* Renders immediately */}
      <UserHeader user={user} />

      {/* Streams when ready */}
      <Await promise={deferredStats} fallback={<StatsPlaceholder />}>
        {(stats) => <StatsPanel stats={stats} />}
      </Await>

      <Await promise={deferredActivity} fallback={<ActivityPlaceholder />}>
        {(activity) => <ActivityFeed items={activity} />}
      </Await>
    </div>
  )
}
```

### Deferred with Error Handling

```typescript
function DashboardPage() {
  const { deferredData } = Route.useLoaderData()

  return (
    <Await
      promise={deferredData}
      fallback={<Loading />}
    >
      {(data) => <DataDisplay data={data} />}
    </Await>
  )
}

// Errors bubble up to errorComponent
```

## TanStack Query Integration

For advanced caching, deduplication, and mutations.

### ensureQueryData Pattern (Blocking)

```typescript
// src/routes/posts.tsx
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions } from '@tanstack/react-query'

export const postsQueryOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: fetchPosts,
})

export const Route = createFileRoute('/posts')({
  loader: async ({ context: { queryClient } }) => {
    // Ensures data is in cache before render
    return await queryClient.ensureQueryData(postsQueryOptions)
  },
  component: PostsPage,
})

function PostsPage() {
  // Data already in cache - no loading state
  const { data: posts } = useSuspenseQuery(postsQueryOptions)

  return <PostList posts={posts} />
}
```

### prefetchQuery Pattern (Non-Blocking)

```typescript
// src/routes/dashboard.tsx
export const Route = createFileRoute('/dashboard')({
  loader: async ({ context: { queryClient } }) => {
    // Critical - must have before render
    await queryClient.ensureQueryData(userQueryOptions)

    // Secondary - prefetch in background (don't await)
    queryClient.prefetchQuery(notificationsQueryOptions)
    queryClient.prefetchQuery(activityQueryOptions)
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { data: user } = useSuspenseQuery(userQueryOptions)

  return (
    <div>
      <UserProfile user={user} />

      {/* These will show loading state briefly or instantly if prefetched in time */}
      <Suspense fallback={<NotificationsSkeleton />}>
        <Notifications />
      </Suspense>
    </div>
  )
}
```

### Combined Pattern

```typescript
// src/routes/product.$id.tsx
export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  })

export const reviewsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['product', id, 'reviews'],
    queryFn: () => fetchProductReviews(id),
  })

export const Route = createFileRoute('/product/$id')({
  loader: async ({ params, context: { queryClient } }) => {
    // Product is critical
    await queryClient.ensureQueryData(productQueryOptions(params.id))

    // Reviews can load after
    queryClient.prefetchQuery(reviewsQueryOptions(params.id))
  },
  component: ProductPage,
})
```

## Cache Configuration

Control data freshness and memory retention.

### Route-Level Configuration

```typescript
export const Route = createFileRoute('/posts')({
  // How long data stays "fresh" (no refetch on navigation)
  staleTime: 10_000, // 10 seconds

  // How long to keep data in memory after route unmounts
  gcTime: 5 * 60_000, // 5 minutes

  // Control reload behavior
  shouldReload: false, // Only on entry or deps change

  // Preload freshness duration
  preloadStaleTime: 30_000, // 30 seconds

  loader: () => fetchPosts(),
})
```

### Cache Strategies

```typescript
// Static content - cache indefinitely
export const Route = createFileRoute('/about')({
  staleTime: Infinity,
  loader: () => fetchAboutContent(),
})

// Dynamic content - always fresh
export const Route = createFileRoute('/notifications')({
  staleTime: 0,
  gcTime: 0,
  loader: () => fetchNotifications(),
})

// Balanced - fresh for 30s, keep for 5min
export const Route = createFileRoute('/products')({
  staleTime: 30_000,
  gcTime: 5 * 60_000,
  loader: () => fetchProducts(),
})
```

### shouldReload Options

```typescript
// Never reload unless deps change
shouldReload: false

// Always reload on navigation
shouldReload: true

// Conditional reload
shouldReload: ({ cause }) => cause === 'enter'
```

## Error & Pending States

### Pending Component

```typescript
export const Route = createFileRoute('/posts')({
  // Show after 1 second of loading
  pendingMs: 1000,

  // Keep showing for at least 500ms (prevents flash)
  pendingMinMs: 500,

  pendingComponent: () => (
    <div className="flex items-center justify-center p-8">
      <Spinner />
      <span>Loading posts...</span>
    </div>
  ),

  loader: () => fetchPosts(),
})
```

### Error Component

```typescript
export const Route = createFileRoute('/posts/$postId')({
  errorComponent: ({ error, reset }) => (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  ),

  // Called when error occurs (for logging, etc.)
  onError: ({ error }) => {
    console.error('Route error:', error)
    reportError(error)
  },

  loader: ({ params }) => fetchPost(params.postId),
})
```

### Not Found Component

```typescript
import { notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  notFoundComponent: () => (
    <div>
      <h2>Post not found</h2>
      <Link to="/posts">Back to posts</Link>
    </div>
  ),

  loader: async ({ params }) => {
    const post = await fetchPost(params.postId)
    if (!post) throw notFound()
    return post
  },
})
```

## Best Practices

### 1. beforeLoad vs loader

| Use `beforeLoad` for | Use `loader` for |
| -------------------- | ---------------- |
| Auth checks          | Data fetching    |
| Redirects            | Parallel loading |
| Context injection    | Cached data      |
| Lightweight checks   | Heavy operations |

### 2. Keep beforeLoad Fast

```typescript
// GOOD - lightweight check
beforeLoad: ({ context }) => {
  if (!context.auth.user) throw redirect({ to: '/login' })
}

// BAD - slow operation blocks everything
beforeLoad: async ({ context }) => {
  const permissions = await fetchAllPermissions() // Slow!
  // ...
}
```

### 3. Use loaderDeps for Search Params

```typescript
// GOOD - explicit dependency
loaderDeps: ({ search }) => ({ page: search.page }),
loader: ({ deps }) => fetchItems(deps.page)

// BAD - loader won't re-run on search change
loader: ({ search }) => fetchItems(search.page)
```

### 4. Combine Server Functions with Loaders

```typescript
// Server function for SSR-safe database access
const getData = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.query.items.findMany()
})

// Route uses server function
export const Route = createFileRoute('/items')({
  loader: () => getData(),
})
```

### 5. Use Deferred Loading for Non-Critical Data

```typescript
loader: async () => ({
  // User needs this immediately
  product: await fetchProduct(id),

  // Can load after initial render
  reviews: fetchReviews(id), // No await
  recommendations: fetchRelated(id), // No await
})
```

### 6. Prefer ensureQueryData for TanStack Query

```typescript
// GOOD - data guaranteed in cache
await queryClient.ensureQueryData(options)

// LESS IDEAL - might not finish before render
queryClient.prefetchQuery(options)
```

## Common Patterns

### Protected Route Group

```typescript
// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }

    // Load user data for all child routes
    const user = await fetchCurrentUser()
    return { user }
  },
})

// All routes under _authenticated/ are protected
// src/routes/_authenticated/dashboard.tsx
// src/routes/_authenticated/settings.tsx
// src/routes/_authenticated/profile.tsx
```

### Parallel Data Loading

```typescript
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    // These run in parallel
    const [user, stats, notifications] = await Promise.all([
      fetchUser(),
      fetchStats(),
      fetchNotifications(),
    ])

    return { user, stats, notifications }
  },
})
```

### Conditional Loading

```typescript
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params, context }) => {
    const post = await fetchPost(params.postId)

    // Only fetch comments if user is logged in
    const comments = context.auth.user ? await fetchComments(params.postId) : []

    return { post, comments }
  },
})
```
