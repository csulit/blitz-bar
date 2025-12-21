import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { dashboardKeys } from '../../../hooks/keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type {
  AttendancePeriod,
  AttendanceStats,
  EmployeeAttendance,
} from '../../types'
import { assertCan } from '@/lib/casl/server'

function generateMockAttendanceStats(
  period: AttendancePeriod,
): AttendanceStats {
  const totalEmployees = 148

  // Filipino employee names for mock data
  const filipinoNames = [
    'Juan dela Cruz',
    'Maria Santos',
    'Jose Reyes',
    'Ana Garcia',
    'Pedro Ramos',
    'Carmen Mendoza',
    'Miguel Torres',
    'Rosa Villanueva',
    'Antonio Cruz',
    'Lourdes Bautista',
    'Roberto Gonzales',
    'Teresa Fernandez',
    'Eduardo Castillo',
    'Patricia Morales',
    'Ricardo Aquino',
  ]

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Customer Support',
  ]

  // Generate absent employees
  const absentEmployees: Array<EmployeeAttendance> = [
    {
      id: 'abs-1',
      employeeName: filipinoNames[0],
      department: departments[0],
      status: 'absent',
    },
    {
      id: 'abs-2',
      employeeName: filipinoNames[1],
      department: departments[2],
      status: 'absent',
    },
    {
      id: 'abs-3',
      employeeName: filipinoNames[2],
      department: departments[4],
      status: 'absent',
    },
  ]

  // Generate late employees
  const lateEmployees: Array<EmployeeAttendance> = [
    {
      id: 'late-1',
      employeeName: filipinoNames[3],
      department: departments[1],
      status: 'late',
      checkInTime: '09:15 AM',
      lateMinutes: 15,
    },
    {
      id: 'late-2',
      employeeName: filipinoNames[4],
      department: departments[3],
      status: 'late',
      checkInTime: '09:32 AM',
      lateMinutes: 32,
    },
    {
      id: 'late-3',
      employeeName: filipinoNames[5],
      department: departments[0],
      status: 'late',
      checkInTime: '09:08 AM',
      lateMinutes: 8,
    },
    {
      id: 'late-4',
      employeeName: filipinoNames[6],
      department: departments[5],
      status: 'late',
      checkInTime: '09:45 AM',
      lateMinutes: 45,
    },
  ]

  // Generate on-leave employees
  const onLeaveEmployees: Array<EmployeeAttendance> = [
    {
      id: 'leave-1',
      employeeName: filipinoNames[7],
      department: departments[2],
      status: 'on-leave',
      leaveType: 'vacation',
    },
    {
      id: 'leave-2',
      employeeName: filipinoNames[8],
      department: departments[0],
      status: 'on-leave',
      leaveType: 'sick',
    },
    {
      id: 'leave-3',
      employeeName: filipinoNames[9],
      department: departments[6],
      status: 'on-leave',
      leaveType: 'emergency',
    },
    {
      id: 'leave-4',
      employeeName: filipinoNames[10],
      department: departments[1],
      status: 'on-leave',
      leaveType: 'vacation',
    },
    {
      id: 'leave-5',
      employeeName: filipinoNames[11],
      department: departments[4],
      status: 'on-leave',
      leaveType: 'sick',
    },
  ]

  const absentToday = absentEmployees.length
  const onLeave = onLeaveEmployees.length
  const lateCount = lateEmployees.length
  const presentToday = totalEmployees - absentToday - onLeave

  // Calculate attendance rate (excluding on-leave as they're approved)
  const workingEmployees = totalEmployees - onLeave
  const attendanceRate = Math.round((presentToday / workingEmployees) * 100)

  // Determine status based on rate
  const attendanceStatus: AttendanceStats['attendanceStatus'] =
    attendanceRate >= 95
      ? 'excellent'
      : attendanceRate >= 85
        ? 'good'
        : 'needs-attention'

  // Period labels
  const periodLabels: Record<AttendancePeriod, string> = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
  }

  return {
    attendanceRate,
    attendanceStatus,
    totalEmployees,
    presentToday,
    absentToday,
    onLeave,
    overtime: {
      totalHours: 127.5,
      employeesWithOT: 24,
    },
    lateArrivals: {
      count: lateCount,
      avgMinutes: Math.round(
        lateEmployees.reduce((sum, e) => sum + (e.lateMinutes || 0), 0) /
          lateCount,
      ),
    },
    absentEmployees,
    lateEmployees,
    onLeaveEmployees,
    period,
    periodLabel: periodLabels[period],
  }
}

export const getAttendanceStats = createServerFn({ method: 'GET' })
  .inputValidator((period: AttendancePeriod) => period)
  .handler(async ({ data: period }) => {
    await assertCan('read', 'Dashboard')

    // Simulate network delay for loading state demonstration
    await new Promise((resolve) => setTimeout(resolve, 400))

    // Return mock data (will be replaced with real DB queries later)
    return generateMockAttendanceStats(period)
  })

type AttendanceStatsResult = Awaited<ReturnType<typeof getAttendanceStats>>

export function useAttendanceStats(
  period: AttendancePeriod = 'day',
  options?: Omit<
    UseQueryOptions<AttendanceStatsResult, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: dashboardKeys.attendanceStats(period),
    queryFn: () => getAttendanceStats({ data: period }),
    refetchInterval: 30000,
    ...options,
  })
}
