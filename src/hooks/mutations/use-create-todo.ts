import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { queryKeys } from '../keys'
import { db } from '@/db'
import { todos } from '@/db/schema'

interface CreateTodoInput {
  title: string
}

/**
 * Server function for creating a todo
 */
export const createTodo = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateTodoInput) => data)
  .handler(async ({ data }) => {
    const [newTodo] = await db
      .insert(todos)
      .values({ title: data.title })
      .returning()
    return newTodo
  })

/**
 * Hook for creating a new todo
 *
 * @example
 * const { mutate, mutateAsync, isPending } = useCreateTodo()
 *
 * // Fire and forget
 * mutate({ title: 'New todo' })
 *
 * // Await the result
 * const newTodo = await mutateAsync({ title: 'New todo' })
 */
export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.all })
    },
  })
}
