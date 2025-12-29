import {
  IconCurrencyPeso,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface CompensationPayrollCardProps {
  totalPayroll: number
  payrollChange: number
  totalEmployees: number
  averageSalary: number
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCompact(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`
  }
  return amount.toString()
}

export function CompensationPayrollCard({
  totalPayroll,
  payrollChange,
  totalEmployees,
  averageSalary,
}: CompensationPayrollCardProps) {
  const isPositiveChange = payrollChange > 0
  const TrendIcon = isPositiveChange ? IconTrendingUp : IconTrendingDown

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              Total Monthly Payroll
            </p>
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                isPositiveChange
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {Math.abs(payrollChange).toFixed(1)}%
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-xl text-muted-foreground">PHP</span>
            <p className="font-display text-5xl tabular-nums tracking-tight">
              {formatCompact(totalPayroll)}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            {formatCurrency(totalPayroll)} for{' '}
            <span className="font-medium text-foreground">
              {totalEmployees}
            </span>{' '}
            employees
          </p>

          {/* Additional metrics */}
          <div className="flex gap-6 pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Avg. Salary</p>
              <p className="text-sm font-medium">
                {formatCurrency(averageSalary)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">vs Last Month</p>
              <p
                className={cn(
                  'text-sm font-medium',
                  isPositiveChange
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400',
                )}
              >
                {isPositiveChange ? '+' : ''}
                {payrollChange.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
          <IconCurrencyPeso className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  )
}
