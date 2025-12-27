import {
  IconCalendarEvent,
  IconClockHour4,
  IconUserCheck,
  IconUserX,
} from '@tabler/icons-react'
import type { OvertimeSummary } from './types'
import { cn } from '@/lib/utils'

interface AttendanceMetricCardsProps {
  presentToday: number
  absentToday: number
  onLeave: number
  overtime: OvertimeSummary
}

interface MetricCardData {
  key: string
  title: string
  value: string | number
  description: string
  icon: typeof IconUserCheck
  accentColor: string
  iconColor: string
}

export function AttendanceMetricCards({
  presentToday,
  absentToday,
  onLeave,
  overtime,
}: AttendanceMetricCardsProps) {
  const cards: Array<MetricCardData> = [
    {
      key: 'present',
      title: 'Present',
      value: presentToday,
      description: 'Employees at work',
      icon: IconUserCheck,
      accentColor: 'bg-emerald-500',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      key: 'absent',
      title: 'Absent',
      value: absentToday,
      description: 'Unexcused absences',
      icon: IconUserX,
      accentColor: 'bg-rose-500',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      key: 'on-leave',
      title: 'On Leave',
      value: onLeave,
      description: 'Approved leaves',
      icon: IconCalendarEvent,
      accentColor: 'bg-blue-500',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'overtime',
      title: 'Overtime',
      value: `${overtime.totalHours}h`,
      description: `${overtime.employeesWithOT} employees with OT`,
      icon: IconClockHour4,
      accentColor: 'bg-amber-500',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div
            key={card.key}
            className={cn(
              'group relative rounded-xl border border-border/60 bg-card p-5',
              'transition-all duration-200 hover:border-border hover:shadow-sm',
            )}
          >
            {/* Accent line */}
            <div
              className={cn(
                'absolute bottom-4 left-0 top-4 w-0.75 rounded-r-full',
                card.accentColor,
              )}
            />

            <div className="flex items-start justify-between pl-3">
              <div className="space-y-1">
                <p className="text-[13px] font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="font-display text-4xl tabular-nums tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {card.description}
                </p>
              </div>
              <div
                className={cn(
                  'rounded-lg bg-muted/50 p-2 transition-colors',
                  'group-hover:bg-muted',
                )}
              >
                <Icon className={cn('h-4 w-4', card.iconColor)} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
