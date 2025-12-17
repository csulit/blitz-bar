/**
 * Query Key Factory
 *
 * Provides type-safe, consistent query keys for TanStack Query.
 * Use these keys for all queries and cache invalidations.
 *
 * @example
 * // In a query hook
 * useQuery({ queryKey: queryKeys.todos.all, queryFn: fetchTodos })
 *
 * // In a mutation
 * queryClient.invalidateQueries({ queryKey: queryKeys.todos.all })
 */
export const queryKeys = {
  todos: {
    all: ['todos'] as const,
    lists: () => [...queryKeys.todos.all, 'list'] as const,
    list: (filters?: { status?: string; search?: string }) =>
      [...queryKeys.todos.lists(), filters] as const,
    details: () => [...queryKeys.todos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.todos.details(), id] as const,
  },
  deviceSessions: {
    all: ['deviceSessions'] as const,
  },
} as const

// Type helpers for query keys
export type QueryKeys = typeof queryKeys
export type TodosQueryKey = ReturnType<(typeof queryKeys.todos)[keyof typeof queryKeys.todos]>
