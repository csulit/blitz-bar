import { z } from 'zod'

export const signupSchema = z
  .object({
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? 'Email is required'
          : 'Invalid email address',
    }),
    firstName: z.string().min(1, { error: 'First name is required' }),
    middleInitial: z
      .string()
      .max(1, { error: 'Middle initial must be a single character' })
      .optional()
      .or(z.literal('')),
    lastName: z.string().min(1, { error: 'Last name is required' }),
    password: z
      .string()
      .min(1, { error: 'Password is required' })
      .min(8, { error: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(1, { error: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupFormData = z.infer<typeof signupSchema>
