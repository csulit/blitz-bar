---
description: Create a new TanStack Query hook (query or mutation)
argument-hint: useProducts query|mutation - fetch paginated products
---

# Create a New TanStack Query Hook

Create a new TanStack Query hook following the project's best practices.

## Instructions

Based on the user's request "$ARGUMENTS", create a new hook by:

1. **Determine the hook type:**
   - Query hook (data fetching) → `src/hooks/queries/use-{name}.ts`
   - Mutation hook (data modification) → `src/hooks/mutations/use-{name}.ts`

2. **Follow the skill guidelines in `.claude/skills/tanstack-query-hooks/SKILL.md`**

3. **Add query keys** to `src/hooks/keys/index.ts` if needed

4. **Re-export** the new hook from `src/hooks/index.ts`

5. **Use server functions** with `createServerFn` for database operations

## Required Patterns

- Use the query key factory from `@/hooks/keys`
- Include proper TypeScript types
- Add JSDoc comments with examples
- Export server functions for route loader usage
- Use `useQueryClient` for cache invalidation in mutations

## Example Commands

- `/new-hook useUser query for fetching user by ID`
- `/new-hook useUpdateUser mutation for updating user profile`
- `/new-hook useProducts infinite query for paginated products`
