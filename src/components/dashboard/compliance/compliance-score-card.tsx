import { IconGauge } from '@tabler/icons-react'
import type { ComplianceBreakdown, ComplianceStatus } from './types'
import { cn } from '@/lib/utils'

interface ComplianceScoreCardProps {
  score: number
  status: ComplianceStatus
  totalContributions: number
  breakdown: ComplianceBreakdown
}

const statusConfig: Record<
  ComplianceStatus,
  { label: string; color: string; bgColor: string }
> = {
  compliant: {
    label: 'Compliant',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  'at-risk': {
    label: 'At Risk',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  'non-compliant': {
    label: 'Non-Compliant',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-500/10',
  },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ComplianceScoreCard({
  score,
  status,
  totalContributions,
  breakdown,
}: ComplianceScoreCardProps) {
  const config = statusConfig[status]

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              Compliance Health
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
              {score}
            </p>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Total monthly contributions:{' '}
            <span className="font-medium text-foreground">
              {formatCurrency(totalContributions)}
            </span>
          </p>

          {/* Breakdown */}
          <div className="flex gap-4 pt-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">
                {breakdown.compliant}% compliant
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">
                {breakdown.atRisk}% at risk
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-xs text-muted-foreground">
                {breakdown.nonCompliant}% non-compliant
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
                status === 'compliant' && 'stroke-emerald-500',
                status === 'at-risk' && 'stroke-amber-500',
                status === 'non-compliant' && 'stroke-rose-500',
              )}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <IconGauge className={cn('h-6 w-6', config.color)} />
          </div>
        </div>
      </div>
    </div>
  )
}
