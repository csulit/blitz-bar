---
description: Create a new TanStack Start route (page, API, layout, or dynamic)
argument-hint: /products|/api/users|/$id - SSR page with data loading
---

# Create a New TanStack Start Route

Create a new TanStack Start route following the project's best practices.

## Instructions

Based on the user's request "$ARGUMENTS", create a new route by:

1. **Determine the route type:**
   - Page route → `src/routes/about.tsx` → `/about`
   - Dynamic route → `src/routes/products.$productId.tsx` → `/products/:productId`
   - Layout route → `src/routes/_dashboard.tsx` or `src/routes/dashboard/route.tsx`
   - API route → `src/routes/api/users.ts` → `/api/users`
   - Index route → `src/routes/dashboard/index.tsx` → `/dashboard`

2. **Follow the skill guidelines in `.claude/skills/tanstack-start-routes/SKILL.md`**

3. **Choose the appropriate pattern:**
   - Simple page: Just component, no data fetching
   - SSR page: Use `loader` with `createServerFn` for server-side data
   - Dynamic page: Use `$param` in filename with `Route.useParams()`
   - Protected page: Use `beforeLoad` for auth guards
   - API endpoint: Use `server.handlers` for REST APIs

4. **Include necessary imports:**

   ```typescript
   import { createFileRoute } from '@tanstack/react-router'
   import { createServerFn } from '@tanstack/react-start' // if using server functions
   import { json } from '@tanstack/react-start' // if using API routes
   ```

5. **Add proper TypeScript types and route configuration**

## Required Patterns

- Use `createFileRoute` with the correct path string
- Include `component` for page routes
- Add `loader` for SSR data fetching
- Use `createServerFn` for database operations
- Add `head` for dynamic meta tags when needed
- Include `errorComponent` and `pendingComponent` for UX

## Route Types

### Page Route (no data)

```typescript
// src/routes/about.tsx
export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return <div>About us</div>
}
```

### Page with SSR Data

```typescript
// src/routes/products.tsx
const getProducts = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(products)
})

export const Route = createFileRoute('/products')({
  component: ProductsPage,
  loader: () => getProducts(),
})

function ProductsPage() {
  const products = Route.useLoaderData()
  return <ProductList products={products} />
}
```

### Dynamic Route

```typescript
// src/routes/products.$productId.tsx
const getProduct = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const product = await db.query.products.findFirst({ where: eq(products.id, id) })
    if (!product) throw notFound()
    return product
  })

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
  loader: ({ params }) => getProduct({ data: params.productId }),
})

function ProductDetailPage() {
  const product = Route.useLoaderData()
  return <ProductDetail product={product} />
}
```

### API Route

```typescript
// src/routes/api/users.ts
export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: async () => {
        const users = await db.select().from(users)
        return json(users)
      },
      POST: async ({ request }) => {
        const body = await request.json()
        const [user] = await db.insert(users).values(body).returning()
        return json(user, { status: 201 })
      },
    },
  },
})
```

### Protected Route

```typescript
// src/routes/_authenticated/settings.tsx
export const Route = createFileRoute('/_authenticated/settings')({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
  },
  component: SettingsPage,
})

function SettingsPage() {
  return <UserSettings />
}
```

## Example Commands

- `/new-route /about - simple about page`
- `/new-route /products - page with SSR data loading from database`
- `/new-route /product/$id - dynamic product detail page`
- `/new-route /api/users - REST API endpoint for users CRUD`
- `/new-route /_dashboard layout with sidebar for dashboard pages`
- `/new-route /admin/settings - protected admin settings page`
- `/new-route /blog/$slug - blog post with dynamic meta tags`
