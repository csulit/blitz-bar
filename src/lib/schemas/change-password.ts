import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, { error: 'New password is required' })
      .min(8, { error: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(1, { error: 'Please confirm your password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
