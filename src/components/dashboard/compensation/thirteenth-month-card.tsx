import { IconGift } from '@tabler/icons-react'
import type { ThirteenthMonthData } from './types'
import { cn } from '@/lib/utils'

interface ThirteenthMonthCardProps {
  data: ThirteenthMonthData
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ThirteenthMonthCard({ data }: ThirteenthMonthCardProps) {
  const {
    currentAccrual,
    targetAmount,
    percentage,
    monthsRemaining,
    monthlyAccrualRate,
  } = data

  // Status based on whether we're on track
  const isOnTrack = percentage >= ((12 - monthsRemaining) / 12) * 100 - 5
  const statusColor = isOnTrack
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-amber-600 dark:text-amber-400'
  const statusBgColor = isOnTrack ? 'bg-emerald-500/10' : 'bg-amber-500/10'
  const statusLabel = isOnTrack ? 'On Track' : 'Behind'

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              13th Month Accrual
            </p>
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium',
                statusBgColor,
                statusColor,
              )}
            >
              {statusLabel}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <p className="font-display text-4xl tabular-nums tracking-tight">
              {percentage}
            </p>
            <span className="text-xl text-muted-foreground">%</span>
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {formatCurrency(currentAccrual)}
            </span>{' '}
            of {formatCurrency(targetAmount)} accrued
          </p>

          {/* Progress bar */}
          <div className="space-y-2 pt-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isOnTrack ? 'bg-emerald-500' : 'bg-amber-500',
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(monthlyAccrualRate)}/month</span>
              <span>
                {monthsRemaining} {monthsRemaining === 1 ? 'month' : 'months'}{' '}
                remaining
              </span>
            </div>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="relative h-16 w-16">
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
                isOnTrack ? 'stroke-emerald-500' : 'stroke-amber-500',
              )}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${percentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <IconGift className={cn('h-5 w-5', statusColor)} />
          </div>
        </div>
      </div>
    </div>
  )
}
