---
description: Add data loading to a TanStack Start route (beforeLoad, loader, deferred, TanStack Query)
argument-hint: /dashboard beforeLoad|loader|loaderDeps|deferred|tanstack-query - auth guard
---

# Add Data Loading to a Route

Add data loading configuration to a TanStack Start route following project best practices.

## Instructions

Based on the user's request "$ARGUMENTS", add or configure data loading by:

1. **Determine the loading pattern needed:**
   - `beforeLoad` → Auth guards, redirects, context injection
   - `loader` → Main data fetching (SSR)
   - `loaderDeps` → Search param dependencies
   - `deferred` → Non-blocking secondary data
   - `tanstack-query` → TanStack Query integration

2. **Follow the skill guidelines in `.claude/skills/tanstack-data-loading/SKILL.md`**

3. **Choose the appropriate pattern based on requirements**

4. **Include necessary imports:**
   ```typescript
   import { createFileRoute, redirect, notFound, Await } from '@tanstack/react-router'
   import { createServerFn } from '@tanstack/react-start'
   import { useSuspenseQuery, queryOptions } from '@tanstack/react-query'
   ```

## Loading Patterns

### beforeLoad (Auth Guard)

```typescript
export const Route = createFileRoute('/protected')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: '/login' })
    }
  },
  component: ProtectedPage,
})
```

### beforeLoad (Context Injection)

```typescript
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    const permissions = await fetchPermissions(context.auth.user.id)
    return { permissions } // Merged into context for child routes
  },
  component: DashboardLayout,
})
```

### loader (Basic SSR)

```typescript
const getData = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(items)
})

export const Route = createFileRoute('/items')({
  loader: () => getData(),
  component: ItemsPage,
})

function ItemsPage() {
  const items = Route.useLoaderData()
  return <ItemList items={items} />
}
```

### loader with Parameters

```typescript
const getItem = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const item = await db.query.items.findFirst({ where: eq(items.id, id) })
    if (!item) throw notFound()
    return item
  })

export const Route = createFileRoute('/items/$id')({
  loader: ({ params }) => getItem({ data: params.id }),
  component: ItemPage,
})
```

### loaderDeps (Search Params)

```typescript
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().optional().default(1),
  sort: z.enum(['asc', 'desc']).optional().default('desc'),
})

export const Route = createFileRoute('/items')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ page: search.page, sort: search.sort }),
  loader: ({ deps }) => fetchItems(deps.page, deps.sort),
  component: ItemsPage,
})
```

### Deferred Loading

```typescript
export const Route = createFileRoute('/dashboard')({
  loader: async () => ({
    user: await fetchUser(),           // Critical - blocks render
    activity: fetchActivity(),          // Deferred - streams later
    stats: fetchStats(),                // Deferred - streams later
  }),
  component: DashboardPage,
})

function DashboardPage() {
  const { user, activity, stats } = Route.useLoaderData()

  return (
    <div>
      <UserHeader user={user} />
      <Await promise={activity} fallback={<Skeleton />}>
        {(data) => <ActivityFeed items={data} />}
      </Await>
    </div>
  )
}
```

### TanStack Query Integration

```typescript
const itemsQueryOptions = queryOptions({
  queryKey: ['items'],
  queryFn: fetchItems,
})

export const Route = createFileRoute('/items')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(itemsQueryOptions)
  },
  component: ItemsPage,
})

function ItemsPage() {
  const { data: items } = useSuspenseQuery(itemsQueryOptions)
  return <ItemList items={items} />
}
```

### Cache Configuration

```typescript
export const Route = createFileRoute('/items')({
  staleTime: 30_000,      // Fresh for 30 seconds
  gcTime: 5 * 60_000,     // Keep in cache 5 minutes
  shouldReload: false,    // Only reload on entry or deps change
  loader: () => fetchItems(),
})
```

### Error & Pending States

```typescript
export const Route = createFileRoute('/items')({
  pendingMs: 1000,
  pendingMinMs: 500,
  pendingComponent: () => <LoadingSpinner />,
  errorComponent: ({ error, reset }) => (
    <ErrorDisplay error={error} onRetry={reset} />
  ),
  notFoundComponent: () => <NotFoundDisplay />,
  loader: () => fetchItems(),
})
```

## Example Commands

- `/new-loader /dashboard beforeLoad - add auth guard redirect to login`
- `/new-loader /products loader - fetch products from database with SSR`
- `/new-loader /search loaderDeps - add pagination and sort search params`
- `/new-loader /profile deferred - load user immediately, defer activity feed`
- `/new-loader /posts tanstack-query - use ensureQueryData with useSuspenseQuery`
- `/new-loader /items/$id loader - dynamic route with notFound handling`
- `/new-loader /_admin beforeLoad - context injection with admin permissions`

## Configuration Options Reference

| Option | Purpose | Default |
|--------|---------|---------|
| `beforeLoad` | Pre-loader checks, context | - |
| `loader` | Main data fetching | - |
| `loaderDeps` | Declare reload triggers | - |
| `staleTime` | Data freshness duration | 0 |
| `gcTime` | Cache retention time | 30min |
| `shouldReload` | Reload control | true |
| `pendingMs` | Delay before pending UI | 1000ms |
| `pendingMinMs` | Minimum pending display | 500ms |
| `pendingComponent` | Loading UI | - |
| `errorComponent` | Error UI | - |
| `notFoundComponent` | 404 UI | - |
