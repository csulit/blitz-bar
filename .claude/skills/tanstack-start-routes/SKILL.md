---
name: tanstack-start-routes
description: Create and configure TanStack Start routes with file-based routing. Use when creating new pages, API endpoints, layouts, dynamic routes, or configuring SSR data loading with loaders and server functions.
---

# TanStack Start Routes Best Practices

This skill provides comprehensive guidelines for creating routes in TanStack Start applications using file-based routing.

## Directory Structure

Routes are organized in `src/routes/` with the following patterns:

```
src/routes/
├── __root.tsx              # Root layout (required)
├── index.tsx               # Home page (/)
├── about.tsx               # Static route (/about)
├── user.$id.tsx            # Dynamic route (/user/:id)
├── posts/                  # Directory-based nesting
│   ├── index.tsx           # /posts
│   ├── $postId.tsx         # /posts/:postId
│   └── $postId.edit.tsx    # /posts/:postId/edit
├── _auth/                  # Pathless layout group
│   ├── route.tsx           # Layout wrapper (no URL path)
│   ├── login.tsx           # /login
│   └── register.tsx        # /register
├── (marketing)/            # Route group (no URL impact)
│   ├── pricing.tsx         # /pricing
│   └── features.tsx        # /features
└── api/                    # API routes
    └── users.ts            # /api/users
```

## File Naming Conventions

| Pattern         | Example Filename    | URL Path         | Purpose                     |
| --------------- | ------------------- | ---------------- | --------------------------- |
| Static          | `about.tsx`         | `/about`         | Fixed path segment          |
| Index           | `index.tsx`         | `/` (parent)     | Matches parent path exactly |
| Dynamic         | `$paramName.tsx`    | `/:paramName`    | URL parameter extraction    |
| Catch-all       | `$.tsx`             | `/*`             | Wildcard matching           |
| Nested (flat)   | `posts.$postId.tsx` | `/posts/:postId` | Flat file nesting with `.`  |
| Pathless layout | `_layoutName.tsx`   | (none)           | Layout wrapper without URL  |
| Non-nested      | `posts_.tsx`        | `/posts`         | Escape parent nesting       |
| Route group     | `(groupName)/`      | (none)           | Organization without URL    |
| Ignored         | `-filename.tsx`     | (none)           | Co-located non-route files  |
| Escaped char    | `file[.]json.tsx`   | `/file.json`     | Literal special characters  |
| Layout file     | `route.tsx`         | (directory path) | Directory route definition  |

## Basic Route Patterns

### Simple Page Route

```typescript
// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our application.</p>
    </div>
  )
}
```

### Index Route

```typescript
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return <h1>Welcome Home</h1>
}
```

### Dynamic Route with Parameters

```typescript
// src/routes/user.$id.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/$id')({
  component: UserPage,
  loader: async ({ params }) => {
    // params.id is type-safe
    return { userId: params.id }
  },
})

function UserPage() {
  const { id } = Route.useParams()
  const loaderData = Route.useLoaderData()

  return <div>User: {id}</div>
}
```

### Catch-All/Wildcard Route

```typescript
// src/routes/docs/$.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/docs/$')({
  component: DocsPage,
})

function DocsPage() {
  // Access splat with params._splat
  const params = Route.useParams()
  const path = params._splat // e.g., "getting-started/installation"

  return <div>Docs path: {path}</div>
}
```

## Data Loading Patterns

> **Note:** For comprehensive data loading patterns including `beforeLoad`, `loaderDeps`, deferred loading, and TanStack Query integration, see `.claude/skills/tanstack-data-loading/SKILL.md`

### Route Loader (SSR)

```typescript
// src/routes/products.tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { products } from '@/db/schema'

// Server function for SSR-safe data fetching
const getProducts = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(products)
})

export const Route = createFileRoute('/products')({
  component: ProductsPage,
  loader: async () => await getProducts(),
})

function ProductsPage() {
  const products = Route.useLoaderData()

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

### Loader with Search Params

```typescript
// src/routes/search.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().optional(),
  page: z.number().optional().default(1),
  sort: z.enum(['asc', 'desc']).optional().default('asc'),
})

export const Route = createFileRoute('/search')({
  component: SearchPage,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    return fetchSearchResults(search.q, search.page, search.sort)
  },
})

function SearchPage() {
  const { q, page, sort } = Route.useSearch()
  const results = Route.useLoaderData()

  return <div>Search results for: {q}</div>
}
```

### Loader with Context (TanStack Query)

```typescript
// src/routes/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
  loader: async ({ context }) => {
    // Access queryClient from router context
    const { queryClient } = context

    // Prefetch or ensure query data
    await queryClient.ensureQueryData({
      queryKey: ['dashboard-stats'],
      queryFn: fetchDashboardStats,
    })

    return {}
  },
})
```

## Layout Patterns

### Pathless Layout Route

```typescript
// src/routes/_auth.tsx (or _auth/route.tsx)
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <Outlet /> {/* Child routes render here */}
      </div>
    </div>
  )
}

// src/routes/_auth/login.tsx -> /login
// src/routes/_auth/register.tsx -> /register
```

### Nested Layout with Path

```typescript
// src/routes/dashboard.tsx (layout)
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

// src/routes/dashboard/index.tsx -> /dashboard
// src/routes/dashboard/settings.tsx -> /dashboard/settings
```

### Route Groups (Organization Only)

```typescript
// src/routes/(admin)/users.tsx -> /users
// src/routes/(admin)/settings.tsx -> /settings
// Both share a directory but URLs don't include "(admin)"
```

## Server Routes (API Endpoints)

### Basic API Route

```typescript
// src/routes/api/users.ts
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const users = await fetchUsers()
        return json(users)
      },
      POST: async ({ request }) => {
        const body = await request.json()
        const user = await createUser(body)
        return json(user, { status: 201 })
      },
    },
  },
})
```

### API Route with Parameters

```typescript
// src/routes/api/users.$id.ts
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/users/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const user = await fetchUser(params.id)
        if (!user) {
          return new Response('Not found', { status: 404 })
        }
        return json(user)
      },
      PUT: async ({ params, request }) => {
        const body = await request.json()
        const user = await updateUser(params.id, body)
        return json(user)
      },
      DELETE: async ({ params }) => {
        await deleteUser(params.id)
        return new Response(null, { status: 204 })
      },
    },
  },
})
```

### Combined Page and API Route

```typescript
// src/routes/contact.tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const formData = await request.formData()
        await sendContactEmail(formData)
        return json({ success: true })
      },
    },
  },
})

function ContactPage() {
  return (
    <form method="POST">
      <input name="email" type="email" />
      <textarea name="message" />
      <button type="submit">Send</button>
    </form>
  )
}
```

## Server Functions Pattern

### Creating Server Functions

```typescript
// src/routes/todos.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { todos } from '@/db/schema'

// GET server function
const getTodos = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(todos)
})

// POST server function with input validation
const createTodo = createServerFn({ method: 'POST' })
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    const [todo] = await db.insert(todos).values(data).returning()
    return todo
  })

// DELETE server function
const deleteTodo = createServerFn({ method: 'POST' })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    await db.delete(todos).where(eq(todos.id, id))
  })

export const Route = createFileRoute('/todos')({
  component: TodosPage,
  loader: () => getTodos(),
})

function TodosPage() {
  const router = useRouter()
  const todos = Route.useLoaderData()

  const handleCreate = async (title: string) => {
    await createTodo({ data: { title } })
    router.invalidate() // Refresh loader data
  }

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}
```

## Route Configuration Options

### Full Route Configuration

```typescript
export const Route = createFileRoute('/example')({
  // Component to render
  component: ExamplePage,

  // Data loading
  loader: async ({ params, context, deps }) => {},
  loaderDeps: ({ search }) => ({ search }),

  // Error handling
  errorComponent: ErrorBoundary,
  pendingComponent: LoadingSpinner,
  notFoundComponent: NotFound,

  // Search params validation
  validateSearch: searchSchema,

  // Head/meta configuration
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData.title },
      { name: 'description', content: loaderData.description },
    ],
  }),

  // Before load hook
  beforeLoad: async ({ context }) => {
    // Auth check, redirects, etc.
    if (!context.auth.isLoggedIn) {
      throw redirect({ to: '/login' })
    }
  },

  // SSR options
  ssr: true, // or false for client-only

  // Stale time for caching
  staleTime: 30_000,

  // Server handlers (API routes)
  server: {
    handlers: {
      GET: async () => {},
      POST: async () => {},
    },
  },
})
```

## Route Hooks

### Available Route Hooks

```typescript
function MyComponent() {
  // Get route params
  const params = Route.useParams()

  // Get search params
  const search = Route.useSearch()

  // Get loader data
  const data = Route.useLoaderData()

  // Get route context
  const context = Route.useRouteContext()

  // Get match info
  const match = Route.useMatch()

  // Navigate programmatically
  const navigate = Route.useNavigate()
}
```

## Best Practices

### 1. File Organization

- Use flat routing (`.` separator) for shallow nesting
- Use directory routing for deep or complex hierarchies
- Co-locate related files with `-` prefix (ignored by router)
- Group routes logically with `(groupName)` folders

### 2. Type Safety

- Always use `createFileRoute` with the correct path string
- Let the router CLI auto-update path strings
- Use Zod for search param validation
- Leverage TypeScript inference from loaders

### 3. Data Loading

- Prefer server functions for database operations
- Use `loaderDeps` when loader depends on search params
- Use `staleTime` for caching frequently-accessed data
- Access `queryClient` from context for TanStack Query integration

### 4. Error Handling

- Provide `errorComponent` for graceful error display
- Provide `pendingComponent` for loading states
- Provide `notFoundComponent` for missing resources
- Use `beforeLoad` for auth guards and redirects

### 5. Performance

- Use route-based code splitting (automatic with file-based routing)
- Prefetch routes on hover with `<Link preload="intent">`
- Use `staleTime` to prevent unnecessary refetches
- Leverage SSR for initial page loads

### 6. SSR Considerations

- Use server functions (`createServerFn`) for secure server-side operations
- Keep secrets on the server (never in client bundles)
- Use `ssr: false` for client-only routes when needed
- Place `<Scripts />` at bottom of `<body>` in root route

## Common Patterns

### Auth Guard

```typescript
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/login',
        search: { redirect: '/dashboard' },
      })
    }
  },
})
```

### Dynamic Meta Tags

```typescript
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    return await fetchPost(params.slug)
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData.title },
      { name: 'description', content: loaderData.excerpt },
      { property: 'og:title', content: loaderData.title },
      { property: 'og:image', content: loaderData.image },
    ],
  }),
})
```

### Prefetching

```typescript
import { Link } from '@tanstack/react-router'

function NavLink() {
  return (
    <Link to="/products" preload="intent">
      Products
    </Link>
  )
}
```

### Route Context Extension

```typescript
// src/routes/__root.tsx
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  auth: AuthContext
}>()({
  // ...
})

// Child routes can access context
export const Route = createFileRoute('/protected')({
  beforeLoad: ({ context }) => {
    // context.auth and context.queryClient available
  },
})
```

## After Implementation

Use the `dev-ops` subagent to validate new routes:

```
Use the dev-ops subagent to run pnpm check and pnpm test
```
