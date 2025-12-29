import {
  IconBuildingBank,
  IconClockDollar,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react'
import type { DepartmentSalary, OvertimeCosts } from './types'
import { cn } from '@/lib/utils'

interface CompensationMetricCardsProps {
  overtimeCosts: OvertimeCosts
  departmentCount: number
  topDepartment: DepartmentSalary | undefined
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

interface MetricCardData {
  key: string
  title: string
  value: string
  description: string
  icon: typeof IconClockDollar
  accentColor: string
  iconColor: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function CompensationMetricCards({
  overtimeCosts,
  departmentCount,
  topDepartment,
  averageSalary,
}: CompensationMetricCardsProps) {
  const otIsDecreasing = overtimeCosts.change < 0

  const cards: Array<MetricCardData> = [
    {
      key: 'overtime',
      title: 'Overtime Costs',
      value: formatCompact(overtimeCosts.currentPeriod),
      description: `${overtimeCosts.totalHours.toLocaleString()} hours this period`,
      icon: IconClockDollar,
      accentColor: 'bg-amber-500',
      iconColor: 'text-amber-600 dark:text-amber-400',
      trend: {
        value: Math.abs(overtimeCosts.change),
        isPositive: otIsDecreasing, // Decreasing OT is positive for cost management
      },
    },
    {
      key: 'departments',
      title: 'Departments',
      value: departmentCount.toString(),
      description: topDepartment
        ? `${topDepartment.department} is highest cost`
        : 'No department data',
      icon: IconBuildingBank,
      accentColor: 'bg-blue-500',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'average',
      title: 'Avg. Salary',
      value: formatCompact(averageSalary),
      description: formatCurrency(averageSalary),
      icon: IconUsers,
      accentColor: 'bg-violet-500',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      key: 'ot-rate',
      title: 'Avg. OT Rate',
      value: formatCurrency(overtimeCosts.averageRate),
      description: 'Per hour',
      icon: IconClockDollar,
      accentColor: 'bg-teal-500',
      iconColor: 'text-teal-600 dark:text-teal-400',
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
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  {card.trend && (
                    <span
                      className={cn(
                        'flex items-center gap-0.5 text-[11px] font-medium',
                        card.trend.isPositive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400',
                      )}
                    >
                      {card.trend.isPositive ? (
                        <IconTrendingDown className="h-3 w-3" />
                      ) : (
                        <IconTrendingUp className="h-3 w-3" />
                      )}
                      {card.trend.value.toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="font-display text-3xl tabular-nums tracking-tight">
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
