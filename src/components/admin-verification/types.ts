export type VerificationStatus =
  | 'draft'
  | 'submitted'
  | 'verified'
  | 'rejected'
  | 'info_requested'

export type AuditAction = 'approved' | 'rejected' | 'info_requested'

export interface VerificationSubmission {
  id: string
  userId: string
  status: VerificationStatus
  submittedAt: Date | null
  verifiedAt: Date | null
  rejectionReason: string | null
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string
    email: string
    firstName: string | null
    lastName: string | null
    image: string | null
  }
}

export interface VerificationStats {
  pending: number
  approvedToday: number
  approvedThisWeek: number
  rejectedToday: number
  rejectedThisWeek: number
  awaitingResponse: number
}

export interface VerificationDetail extends VerificationSubmission {
  profile: {
    age: string | null
    birthday: Date | null
    gender: string | null
    maritalStatus: string | null
    phoneNumber: string | null
  } | null
  education: Array<{
    id: string
    level: string
    schoolName: string
    schoolAddress: string | null
    degree: string | null
    course: string | null
    track: string | null
    strand: string | null
    yearStarted: string | null
    yearGraduated: string | null
    isCurrentlyEnrolled: boolean | null
    honors: string | null
  }>
  identityDocuments: Array<{
    id: string
    documentType: string
    frontImageUrl: string
    backImageUrl: string | null
    status: string
    rejectionReason: string | null
    submittedAt: Date
  }>
  jobHistory: Array<{
    id: string
    companyName: string
    position: string
    startMonth: string
    endMonth: string | null
    isCurrentJob: boolean | null
    summary: string
  }>
  auditLogs: Array<{
    id: string
    action: AuditAction
    reason: string | null
    previousStatus: string
    newStatus: string
    createdAt: Date
    admin: {
      name: string
      email: string
    }
  }>
}

export interface VerificationFilters {
  search: string
  status: VerificationStatus | 'all'
  dateFrom: Date | null
  dateTo: Date | null
  sortBy: 'submittedAt' | 'createdAt' | 'name'
  sortOrder: 'asc' | 'desc'
}

export interface PaginatedResponse<TData> {
  data: Array<TData>
  total: number
  page: number
  pageSize: number
  totalPages: number
}
