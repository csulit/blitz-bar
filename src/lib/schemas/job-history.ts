import { z } from 'zod'

export const monthOptions = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
] as const

export const monthLabels: Record<(typeof monthOptions)[number], string> = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
}

// Generate year options (from 1970 to current year + 5)
const currentYear = new Date().getFullYear()
export const yearOptions = Array.from(
  { length: currentYear - 1970 + 6 },
  (_, i) => String(1970 + i),
).reverse()

export const jobHistoryEntrySchema = z
  .object({
    id: z.string().optional(),
    companyName: z
      .string({ error: 'Company name is required' })
      .min(1, { error: 'Company name is required' }),
    position: z
      .string({ error: 'Position is required' })
      .min(1, { error: 'Position is required' }),
    startMonth: z
      .string({ error: 'Start date is required' })
      .min(1, { error: 'Start date is required' }), // "YYYY-MM" format
    endMonth: z.string().optional(), // "YYYY-MM" format
    isCurrentJob: z.boolean(),
    summary: z
      .string({ error: 'Job summary is required' })
      .min(1, { error: 'Job summary is required' })
      .max(500, { error: 'Summary must be 500 characters or less' }),
  })
  .refine(
    (data) => data.isCurrentJob || (data.endMonth && data.endMonth.length > 0),
    {
      message: 'End date is required unless currently working here',
      path: ['endMonth'],
    },
  )

export const jobHistorySchema = z.object({
  jobs: z
    .array(jobHistoryEntrySchema)
    .min(1, { error: 'At least one job entry is required' }),
})

export type JobHistoryEntry = z.infer<typeof jobHistoryEntrySchema>
export type JobHistoryFormData = z.infer<typeof jobHistorySchema>
