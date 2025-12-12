import { z } from 'zod'

export const signupSchema = z
  .object({
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? 'Email is required'
          : 'Invalid email address',
    }),
    firstName: z.string().min(1, 'First name is required'),
    middleInitial: z
      .string()
      .max(1, 'Middle initial must be a single character')
      .optional()
      .or(z.literal('')),
    lastName: z.string().min(1, 'Last name is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupFormData = z.infer<typeof signupSchema>
