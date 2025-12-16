import type { VerificationFilters } from '../../types'

export const adminVerificationKeys = {
  all: ['adminVerification'] as const,
  submissions: () => [...adminVerificationKeys.all, 'submissions'] as const,
  submissionsList: (
    filters: VerificationFilters,
    page: number,
    pageSize: number,
  ) =>
    [
      ...adminVerificationKeys.submissions(),
      { filters, page, pageSize },
    ] as const,
  stats: () => [...adminVerificationKeys.all, 'stats'] as const,
  detail: (id: string) => [...adminVerificationKeys.all, 'detail', id] as const,
}
