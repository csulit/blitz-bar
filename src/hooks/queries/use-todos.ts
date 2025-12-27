import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { queryKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import { db } from '@/db'

/**
 * Server function for fetching todos
 * Runs on the server for SSR and can be used in route loaders
 */
export const getTodos = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.query.todos.findMany({
    orderBy: (todos, { desc }) => [desc(todos.createdAt)],
  })
})

// Infer the return type from the server function
type TodosData = Awaited<ReturnType<typeof getTodos>>

/**
 * Hook for fetching all todos
 *
 * @example
 * // Basic usage
 * const { data: todos, isLoading, error } = useTodos()
 *
 * // With options
 * const { data: todos } = useTodos({ staleTime: 5 * 60 * 1000 })
 */
export function useTodos(
  options?: Omit<UseQueryOptions<TodosData, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.todos.all,
    queryFn: () => getTodos(),
    ...options,
  })
}
