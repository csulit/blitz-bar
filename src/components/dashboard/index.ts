// Components
export { WorkforceStatsCards } from './workforce-stats-cards'
export { WorkforceStatsSkeleton } from './workforce-stats-skeleton'
export { DepartmentChart } from './department-chart'
export { DashboardPageSkeleton } from './dashboard-page-skeleton'

// Compliance Components
export {
  ComplianceTracker,
  ComplianceTrackerSkeleton,
  ComplianceScoreCard,
  ComplianceAgencyCards,
  ComplianceDeadlineList,
} from './compliance'

// Attendance Components
export {
  AttendanceTracker,
  AttendanceTrackerSkeleton,
  AttendanceRateCard,
  AttendanceMetricCards,
  AttendanceEmployeeList,
  PeriodSelector,
} from './attendance'

// Types
export type { DepartmentCount, WorkforceStats } from './types'
export type {
  AgencyCode,
  AgencyCompliance,
  ComplianceBreakdown,
  ComplianceDeadline,
  ComplianceStats,
  ComplianceStatus,
} from './compliance'
export type {
  AttendancePeriod,
  AttendanceStatus,
  AttendanceStats,
  EmployeeAttendance,
  LeaveType,
  OvertimeSummary,
  LateArrivalsSummary,
} from './attendance'

// Hooks - Queries
export { useWorkforceStats } from './hooks/queries/use-workforce-stats'
export { useComplianceStats } from './compliance'
export { useAttendanceStats } from './attendance'

// Query keys
export { dashboardKeys } from './hooks/keys'
