import { z } from 'zod'

export const genderOptions = ['male', 'female', 'other'] as const
export const maritalStatusOptions = [
  'single',
  'married',
  'divorced',
  'widowed',
] as const

export const personalInfoSchema = z.object({
  firstName: z.string({ error: 'First name is required' }).min(1, {
    error: 'First name is required',
  }),
  middleInitial: z.string().max(1, { error: 'Must be a single character' }),
  lastName: z.string({ error: 'Last name is required' }).min(1, {
    error: 'Last name is required',
  }),
  age: z
    .number({ error: 'Age is required' })
    .min(1, { error: 'Age must be at least 1' })
    .max(150, { error: 'Age must be less than 150' }),
  birthday: z.string({ error: 'Birthday is required' }).min(1, {
    error: 'Birthday is required',
  }),
  gender: z.enum(genderOptions, {
    error: 'Please select a gender',
  }),
  maritalStatus: z.enum(maritalStatusOptions, {
    error: 'Please select a marital status',
  }),
  phoneNumber: z
    .string({ error: 'Phone number is required' })
    .length(10, { error: 'Phone number must be 10 digits' })
    .regex(/^\d+$/, { error: 'Phone number must contain only digits' }),
})

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
