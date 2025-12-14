# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev server on port 3000
pnpm build            # Production build
pnpm test             # Run tests with Vitest
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
pnpm check            # Format and lint with auto-fix

# Database (Drizzle + Neon PostgreSQL)
pnpm db:generate      # Generate migrations from schema
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema directly to database
pnpm db:studio        # Open Drizzle Studio
```

## Architecture

This is a TanStack Start application with full-stack SSR capabilities:

- **Framework**: TanStack Start (React 19 + Vite + Nitro for SSR)
- **Routing**: TanStack Router with file-based routing in `src/routes/`
- **Data Fetching**: TanStack Query integrated with SSR via `react-router-ssr-query`
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS v4 with shadcn/ui (new-york style)

### Key Files

- `src/routes/__root.tsx` - Root layout with router context and devtools
- `src/router.tsx` - Router instance with TanStack Query SSR integration
- `src/routeTree.gen.ts` - Auto-generated route tree (do not edit manually)
- `src/db/schema.ts` - Drizzle schema definitions
- `src/db/index.ts` - Database connection pool
- `src/env.ts` - Type-safe environment variables (T3Env)
- `src/integrations/tanstack-query/` - Query client setup

### Route File Conventions

Routes export a `Route` constant created with `createFileRoute()`. The router context includes `queryClient` for TanStack Query access.

### Adding shadcn Components

```bash
pnpm dlx shadcn@latest add <component>
```

### Path Aliases

`@/*` maps to `./src/*`

### Environment Variables

- Server variables: no prefix required
- Client variables: must use `VITE_` prefix
- Database URL: `DATABASE_URL` (server) / `VITE_DATABASE_URL` (client via Neon plugin)

### Demo Files

Files/routes prefixed with `demo` are examples and can be safely deleted.

### Font Convention

- **Inter** (`font-sans`): Default body font for all text, labels, paragraphs, and UI elements
- **Cal Sans** (`font-display`): Display font for headings, titles, and large text only. Automatically applies `font-weight: 600` (Cal Sans only has SemiBold weight).

```tsx
// Use font-display class for headings (weight 600 is automatic)
<h1 className="font-display text-4xl">Welcome back</h1>

// Body text uses Inter by default (no class needed)
<p>Login to your account</p>
```

Cal Sans is optimized for large point sizes. Do not use it for body copy or small UI text.

### Code Change Guidelines

**Only change what is explicitly requested.** Do not:

- Refactor or restructure code beyond the specific ask
- Change layouts, styling, or components that weren't mentioned
- "Improve" or "enhance" things the user didn't ask about
- Make assumptions about what else might need changing

If the user asks to "make the step indicator horizontal", only change the step indicator. Do not touch document selectors, layout structure, widths, alignments, or anything else.
