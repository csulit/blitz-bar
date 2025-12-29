import type { AttendancePeriod } from '../../attendance/types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  workforceStats: () => [...dashboardKeys.all, 'workforceStats'] as const,
  complianceStats: () => [...dashboardKeys.all, 'complianceStats'] as const,
  attendanceStats: (period: AttendancePeriod = 'day') =>
    [...dashboardKeys.all, 'attendanceStats', { period }] as const,
  compensationStats: () => [...dashboardKeys.all, 'compensationStats'] as const,
}
