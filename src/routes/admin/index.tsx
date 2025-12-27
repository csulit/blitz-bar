import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { VerificationReviewPage } from '@/components/admin-verification'

const verificationSearchSchema = z.object({
  search: z.string().optional().catch(''),
  status: z
    .enum([
      'all',
      'draft',
      'submitted',
      'verified',
      'rejected',
      'info_requested',
    ])
    .optional()
    .catch(undefined),
  sortBy: z
    .enum(['submittedAt', 'createdAt', 'name'])
    .optional()
    .catch(undefined),
  sortOrder: z.enum(['asc', 'desc']).optional().catch(undefined),
  page: z.number().optional().catch(undefined),
  pageSize: z.number().optional().catch(undefined),
})

export type VerificationSearchParams = z.infer<typeof verificationSearchSchema>

export const Route = createFileRoute('/admin/')({
  validateSearch: verificationSearchSchema,
  component: VerificationReviewPage,
})
