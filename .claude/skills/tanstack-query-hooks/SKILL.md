---
name: tanstack-query-hooks
description: Create reusable TanStack Query hooks for data fetching and mutations. Use when creating query hooks, mutation hooks, implementing optimistic updates, or setting up SSR-compatible data fetching with server functions.
---

# TanStack Query Hooks Best Practices

This skill provides guidelines for creating reusable, maintainable TanStack Query hooks in this codebase.

## Directory Structure

Organize hooks in `src/hooks/` with the following structure:

```
src/hooks/
├── queries/           # Query hooks (data fetching)
│   ├── use-todos.ts
│   └── use-user.ts
├── mutations/         # Mutation hooks (data modification)
│   ├── use-create-todo.ts
│   └── use-delete-todo.ts
└── keys/              # Query key factories
    └── index.ts
```

## Query Key Factory Pattern

Always use a query key factory for type-safe, consistent keys:

```typescript
// src/hooks/keys/index.ts
export const queryKeys = {
  todos: {
    all: ['todos'] as const,
    lists: () => [...queryKeys.todos.all, 'list'] as const,
    list: (filters: TodoFilters) =>
      [...queryKeys.todos.lists(), filters] as const,
    details: () => [...queryKeys.todos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.todos.details(), id] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: string) => [...queryKeys.users.all, id] as const,
  },
} as const
```

## Query Hook Pattern

### Basic Query Hook

```typescript
// src/hooks/queries/use-todos.ts
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { queryKeys } from '../keys'

interface Todo {
  id: number
  title: string
  createdAt: Date
}

async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('/api/todos')
  if (!response.ok) throw new Error('Failed to fetch todos')
  return response.json()
}

export function useTodos(
  options?: Omit<UseQueryOptions<Todo[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.todos.all,
    queryFn: fetchTodos,
    ...options,
  })
}
```

### Query Hook with Parameters

```typescript
// src/hooks/queries/use-todo.ts
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { queryKeys } from '../keys'

interface Todo {
  id: number
  title: string
  createdAt: Date
}

async function fetchTodo(id: number): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}`)
  if (!response.ok) throw new Error('Failed to fetch todo')
  return response.json()
}

export function useTodo(
  id: number,
  options?: Omit<UseQueryOptions<Todo, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.todos.detail(id),
    queryFn: () => fetchTodo(id),
    enabled: id > 0,
    ...options,
  })
}
```

## Mutation Hook Pattern

### Basic Mutation Hook

```typescript
// src/hooks/mutations/use-create-todo.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../keys'

interface CreateTodoInput {
  title: string
}

interface Todo {
  id: number
  title: string
  createdAt: Date
}

async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new Error('Failed to create todo')
  return response.json()
}

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.all })
    },
  })
}
```

### Mutation with Optimistic Updates

```typescript
// src/hooks/mutations/use-delete-todo.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../keys'

interface Todo {
  id: number
  title: string
  createdAt: Date
}

async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete todo')
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.todos.all })
      const previousTodos = queryClient.getQueryData<Todo[]>(
        queryKeys.todos.all,
      )

      queryClient.setQueryData<Todo[]>(queryKeys.todos.all, (old) =>
        old?.filter((todo) => todo.id !== deletedId),
      )

      return { previousTodos }
    },
    onError: (_err, _id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(queryKeys.todos.all, context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.all })
    },
  })
}
```

## Server Function Pattern (TanStack Start)

For SSR-compatible data fetching, use server functions:

### Server Function with Query Hook

```typescript
// src/hooks/queries/use-todos-ssr.ts
import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { todos } from '@/db/schema'
import { queryKeys } from '../keys'

// Server function runs on the server
const getTodos = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.query.todos.findMany({
    orderBy: (todos, { desc }) => [desc(todos.createdAt)],
  })
})

// Type inference from server function
type TodosResult = Awaited<ReturnType<typeof getTodos>>

export function useTodosSSR() {
  return useQuery({
    queryKey: queryKeys.todos.all,
    queryFn: () => getTodos(),
  })
}

// Export for route loader usage
export { getTodos }
```

### Route Loader Pattern

```typescript
// src/routes/todos.tsx
import { createFileRoute } from '@tanstack/react-router'
import { getTodos, useTodosSSR } from '@/hooks/queries/use-todos-ssr'

export const Route = createFileRoute('/todos')({
  component: TodosPage,
  loader: () => getTodos(),
})

function TodosPage() {
  // Use loader data for initial render (SSR)
  const initialData = Route.useLoaderData()

  // Use query hook for client-side updates
  const { data: todos } = useTodosSSR()

  return <TodoList todos={todos ?? initialData} />
}
```

## Infinite Query Pattern

```typescript
// src/hooks/queries/use-todos-infinite.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '../keys'

interface TodosPage {
  todos: Todo[]
  nextCursor: number | null
}

async function fetchTodosPage({ pageParam = 0 }): Promise<TodosPage> {
  const response = await fetch(`/api/todos?cursor=${pageParam}&limit=20`)
  if (!response.ok) throw new Error('Failed to fetch todos')
  return response.json()
}

export function useTodosInfinite() {
  return useInfiniteQuery({
    queryKey: queryKeys.todos.lists(),
    queryFn: fetchTodosPage,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
```

## Best Practices

### 1. Separation of Concerns

- Keep fetch functions separate from hooks
- Export fetch functions for testing and reuse
- Use query key factory for all keys

### 2. Type Safety

- Define explicit types for query data
- Use `Awaited<ReturnType<>>` for server function types
- Pass generic types to `UseQueryOptions`

### 3. Error Handling

- Throw errors in fetch functions for proper error states
- Use `onError` callbacks in mutations
- Provide error boundaries in components

### 4. Cache Management

- Use `staleTime` for data that doesn't change often
- Use `gcTime` (formerly cacheTime) for memory management
- Prefer `invalidateQueries` over `refetch` after mutations

### 5. SSR Considerations

- Use server functions for initial data loading
- Combine route loaders with query hooks
- Use `initialData` option when hydrating

### 6. Naming Conventions

- Prefix hooks with `use`: `useTodos`, `useCreateTodo`
- Use descriptive names: `useTodoById` not `useTodo2`
- Group related hooks in the same file when small

### 7. Testing

- Export fetch functions for unit testing
- Mock `useQuery` and `useMutation` in component tests
- Test optimistic update rollback scenarios

## Common Patterns

### Dependent Queries

```typescript
export function useUserTodos(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.todos.list({ userId }),
    queryFn: () => fetchUserTodos(userId!),
    enabled: !!userId,
  })
}
```

### Parallel Queries

```typescript
import { useQueries } from '@tanstack/react-query'

export function useTodoDetails(ids: number[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.todos.detail(id),
      queryFn: () => fetchTodo(id),
    })),
  })
}
```

### Prefetching

```typescript
export function usePrefetchTodo() {
  const queryClient = useQueryClient()

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.todos.detail(id),
      queryFn: () => fetchTodo(id),
    })
  }
}
```
