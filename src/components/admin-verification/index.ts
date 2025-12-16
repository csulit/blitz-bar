// Main page component
export { VerificationReviewPage } from './verification-review-page'

// Sub-components
export { VerificationStatsCards } from './verification-stats-cards'
export { VerificationFilters } from './verification-filters'
export { VerificationTable } from './verification-table'
export { VerificationDetailSheet } from './verification-detail-sheet'
export { BulkActionsBar } from './bulk-actions-bar'

// Action modals
export { ApproveDialog } from './action-modals/approve-dialog'
export { RejectDialog } from './action-modals/reject-dialog'
export { RequestInfoDialog } from './action-modals/request-info-dialog'

// Types
export type {
  VerificationStatus,
  AuditAction,
  VerificationSubmission,
  VerificationStats,
  VerificationDetail,
  VerificationFilters as VerificationFiltersType,
  PaginatedResponse,
} from './types'

// Hooks - Queries
export { useVerificationSubmissions } from './hooks/queries/use-verification-submissions'
export { useVerificationStats } from './hooks/queries/use-verification-stats'
export { useVerificationDetail } from './hooks/queries/use-verification-detail'

// Hooks - Mutations
export { useApproveVerification } from './hooks/mutations/use-approve-verification'
export { useRejectVerification } from './hooks/mutations/use-reject-verification'
export { useRequestInfo } from './hooks/mutations/use-request-info'
export { useBulkActions } from './hooks/mutations/use-bulk-actions'

// Query keys
export { adminVerificationKeys } from './hooks/keys'
