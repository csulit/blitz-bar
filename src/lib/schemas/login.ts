import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? 'Email is required' : 'Invalid email address',
  }),
  password: z.string({ error: 'Password is required' }).min(1, {
    error: 'Password is required',
  }),
})

export type LoginFormData = z.infer<typeof loginSchema>
