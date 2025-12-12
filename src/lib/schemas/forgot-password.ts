import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? 'Email is required' : 'Invalid email address',
  }),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
