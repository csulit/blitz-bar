import {
  IconCalendarEvent,
  IconClockExclamation,
  IconUserX,
} from '@tabler/icons-react'
import type { EmployeeAttendance, LeaveType } from './types'
import { cn } from '@/lib/utils'

interface AttendanceEmployeeListProps {
  title: string
  employees: Array<EmployeeAttendance>
  emptyMessage: string
  type: 'absent' | 'late' | 'on-leave'
}

const typeConfig: Record<
  'absent' | 'late' | 'on-leave',
  { icon: typeof IconUserX; iconColor: string }
> = {
  absent: {
    icon: IconUserX,
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  late: {
    icon: IconClockExclamation,
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  'on-leave': {
    icon: IconCalendarEvent,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
}

const leaveTypeLabels: Record<LeaveType, string> = {
  vacation: 'Vacation Leave',
  sick: 'Sick Leave',
  emergency: 'Emergency Leave',
  other: 'Other Leave',
}

const leaveTypeColors: Record<LeaveType, { bg: string; text: string }> = {
  vacation: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-700 dark:text-blue-400',
  },
  sick: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-700 dark:text-rose-400',
  },
  emergency: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
  },
  other: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-700 dark:text-gray-400',
  },
}

export function AttendanceEmployeeList({
  title,
  employees,
  emptyMessage,
  type,
}: AttendanceEmployeeListProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className={cn('h-5 w-5', config.iconColor)} />
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {employees.length}
        </span>
      </div>

      {employees.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="max-h-64 divide-y divide-border/50 overflow-y-auto">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium">{employee.employeeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {employee.department}
                  </p>
                </div>
              </div>

              <div className="text-right">
                {type === 'late' && employee.lateMinutes && (
                  <>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      {employee.lateMinutes} min late
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Arrived {employee.checkInTime}
                    </p>
                  </>
                )}

                {type === 'on-leave' && employee.leaveType && (
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium',
                      leaveTypeColors[employee.leaveType].bg,
                      leaveTypeColors[employee.leaveType].text,
                    )}
                  >
                    {leaveTypeLabels[employee.leaveType]}
                  </span>
                )}

                {type === 'absent' && (
                  <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400">
                    No show
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
