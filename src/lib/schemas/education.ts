import { z } from 'zod'

export const educationLevelOptions = [
  'elementary',
  'junior_high',
  'senior_high',
  'vocational',
  'college',
  'postgraduate',
] as const

export const educationLevelLabels: Record<
  (typeof educationLevelOptions)[number],
  string
> = {
  elementary: 'Elementary (Grades 1-6)',
  junior_high: 'Junior High School (Grades 7-10)',
  senior_high: 'Senior High School (Grades 11-12)',
  vocational: 'Vocational/Technical (TESDA)',
  college: 'College/University',
  postgraduate: 'Post-Graduate',
}

export const seniorHighTrackOptions = [
  'academic',
  'tvl',
  'sports',
  'arts_design',
] as const

export const seniorHighTrackLabels: Record<
  (typeof seniorHighTrackOptions)[number],
  string
> = {
  academic: 'Academic',
  tvl: 'Technical-Vocational-Livelihood (TVL)',
  sports: 'Sports',
  arts_design: 'Arts and Design',
}

export const seniorHighStrandOptions = [
  'stem',
  'abm',
  'humss',
  'gas',
  'he',
  'ict',
  'ia',
  'afa',
] as const

export const seniorHighStrandLabels: Record<
  (typeof seniorHighStrandOptions)[number],
  string
> = {
  stem: 'STEM',
  abm: 'ABM',
  humss: 'HUMSS',
  gas: 'GAS',
  he: 'Home Economics',
  ict: 'ICT',
  ia: 'Industrial Arts',
  afa: 'Agri-Fishery Arts',
}

export const honorsOptions = [
  'none',
  'with_honors',
  'with_high_honors',
  'with_highest_honors',
  'cum_laude',
  'magna_cum_laude',
  'summa_cum_laude',
] as const

export const honorsLabels: Record<(typeof honorsOptions)[number], string> = {
  none: 'None',
  with_honors: 'With Honors',
  with_high_honors: 'With High Honors',
  with_highest_honors: 'With Highest Honors',
  cum_laude: 'Cum Laude',
  magna_cum_laude: 'Magna Cum Laude',
  summa_cum_laude: 'Summa Cum Laude',
}

export const educationSchema = z.object({
  level: z.enum(educationLevelOptions, {
    error: 'Please select your education level',
  }),
  schoolName: z
    .string({ error: 'School name is required' })
    .min(1, { error: 'School name is required' }),
  schoolAddress: z.string().optional(),
  degree: z.string().optional(), // For college/postgraduate
  course: z.string().optional(), // For vocational
  track: z.enum(seniorHighTrackOptions).optional(), // For senior high
  strand: z.enum(seniorHighStrandOptions).optional(), // For senior high
  yearStarted: z
    .string({ error: 'Year started is required' })
    .min(1, { error: 'Year started is required' }),
  yearGraduated: z.string().optional(),
  isCurrentlyEnrolled: z.boolean(),
  honors: z.enum(honorsOptions).optional(),
})

export type EducationFormData = z.infer<typeof educationSchema>
