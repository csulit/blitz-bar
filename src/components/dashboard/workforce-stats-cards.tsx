import {
  IconTrendingDown,
  IconTrendingUp,
  IconUserMinus,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons-react'
import { DepartmentChart } from './department-chart'
import { useWorkforceStats } from './hooks/queries/use-workforce-stats'
import { WorkforceStatsSkeleton } from './workforce-stats-skeleton'
import { cn } from '@/lib/utils'

export function WorkforceStatsCards() {
  const { data: stats, isLoading } = useWorkforceStats()

  if (isLoading) {
    return <WorkforceStatsSkeleton />
  }

  const cards = [
    {
      title: 'Total Headcount',
      value: stats?.totalHeadcount ?? 0,
      description: `${stats?.activeEmployees ?? 0} active, ${stats?.onLeave ?? 0} on leave`,
      icon: IconUsers,
      accentColor: 'bg-emerald-500',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'New Hires',
      value: stats?.newHires ?? 0,
      description: `${(stats?.newHiresChange ?? 0) >= 0 ? '+' : ''}${stats?.newHiresChange ?? 0}% vs last month`,
      icon: IconUserPlus,
      accentColor: 'bg-blue-500',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: {
        value: stats?.newHiresChange ?? 0,
        isPositive: (stats?.newHiresChange ?? 0) >= 0,
      },
    },
    {
      title: 'Separations',
      value: stats?.separations ?? 0,
      description: `${(stats?.separationsChange ?? 0) >= 0 ? '+' : ''}${stats?.separationsChange ?? 0}% vs last month`,
      icon: IconUserMinus,
      accentColor: 'bg-rose-500',
      iconColor: 'text-rose-600 dark:text-rose-400',
      trend: {
        value: stats?.separationsChange ?? 0,
        // For separations, negative change is positive (fewer people leaving)
        isPositive: (stats?.separationsChange ?? 0) < 0,
      },
    },
    {
      title: 'Turnover Rate',
      value: `${stats?.turnoverRate ?? 0}%`,
      description: `was ${stats?.turnoverRatePrevious ?? 0}% last month`,
      icon:
        (stats?.turnoverRate ?? 0) < (stats?.turnoverRatePrevious ?? 0)
          ? IconTrendingDown
          : IconTrendingUp,
      accentColor: 'bg-amber-500',
      iconColor: 'text-amber-600 dark:text-amber-400',
      trend: {
        value: (stats?.turnoverRate ?? 0) - (stats?.turnoverRatePrevious ?? 0),
        // Lower turnover is positive
        isPositive:
          (stats?.turnoverRate ?? 0) < (stats?.turnoverRatePrevious ?? 0),
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
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
                <p
                  className={cn(
                    'text-xs',
                    card.trend
                      ? card.trend.isPositive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                      : 'text-muted-foreground/70',
                  )}
                >
                  {card.description}
                </p>
              </div>
              <div
                className={cn(
                  'rounded-lg bg-muted/50 p-2 transition-colors',
                  'group-hover:bg-muted',
                )}
              >
                <card.icon className={cn('h-4 w-4', card.iconColor)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Department Chart */}
      {stats?.departmentBreakdown && (
        <DepartmentChart data={stats.departmentBreakdown} />
      )}
    </div>
  )
}
