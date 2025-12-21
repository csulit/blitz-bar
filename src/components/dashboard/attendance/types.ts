export type AttendancePeriod = 'day' | 'week' | 'month'

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'on-leave'

export type LeaveType = 'vacation' | 'sick' | 'emergency' | 'other'

export interface EmployeeAttendance {
  id: string
  employeeName: string
  department: string
  status: AttendanceStatus
  checkInTime?: string
  lateMinutes?: number
  leaveType?: LeaveType
}

export interface OvertimeSummary {
  totalHours: number
  employeesWithOT: number
}

export interface LateArrivalsSummary {
  count: number
  avgMinutes: number
}

export interface AttendanceStats {
  attendanceRate: number
  attendanceStatus: 'excellent' | 'good' | 'needs-attention'
  totalEmployees: number
  presentToday: number
  absentToday: number
  onLeave: number
  overtime: OvertimeSummary
  lateArrivals: LateArrivalsSummary
  absentEmployees: EmployeeAttendance[]
  lateEmployees: EmployeeAttendance[]
  onLeaveEmployees: EmployeeAttendance[]
  period: AttendancePeriod
  periodLabel: string
}
