import { IconClipboardCheck } from '@tabler/icons-react'
import type { AttendanceStats } from './types'
import { cn } from '@/lib/utils'

interface AttendanceRateCardProps {
  rate: number
  status: AttendanceStats['attendanceStatus']
  presentCount: number
  totalCount: number
  onLeaveCount: number
  periodLabel: string
}

const statusConfig: Record<
  AttendanceStats['attendanceStatus'],
  { label: string; color: string; bgColor: string }
> = {
  excellent: {
    label: 'Excellent',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  good: {
    label: 'Good',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  'needs-attention': {
    label: 'Needs Attention',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-500/10',
  },
}

export function AttendanceRateCard({
  rate,
  status,
  presentCount,
  totalCount,
  onLeaveCount,
  periodLabel,
}: AttendanceRateCardProps) {
  const config = statusConfig[status]
  const workingEmployees = totalCount - onLeaveCount

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              Attendance Rate
            </p>
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium',
                config.bgColor,
                config.color,
              )}
            >
              {config.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <p className="font-display text-5xl tabular-nums tracking-tight">
              {rate}
            </p>
            <span className="text-2xl text-muted-foreground">%</span>
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{presentCount}</span>{' '}
            of {workingEmployees} working employees present{' '}
            {periodLabel.toLowerCase()}
          </p>

          {/* Breakdown */}
          <div className="flex gap-4 pt-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">
                {presentCount} present
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-xs text-muted-foreground">
                {totalCount - presentCount - onLeaveCount} absent
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground">
                {onLeaveCount} on leave
              </span>
            </div>
          </div>
        </div>

        {/* Score Circle */}
        <div className="relative h-20 w-20">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="stroke-muted"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress circle */}
            <path
              className={cn(
                'transition-all duration-500',
                status === 'excellent' && 'stroke-emerald-500',
                status === 'good' && 'stroke-amber-500',
                status === 'needs-attention' && 'stroke-rose-500',
              )}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${rate}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <IconClipboardCheck className={cn('h-6 w-6', config.color)} />
          </div>
        </div>
      </div>
    </div>
  )
}
