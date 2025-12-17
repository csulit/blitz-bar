import {
  IconCheck,
  IconClock,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react'
import { useVerificationStats } from './hooks/queries/use-verification-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function VerificationStatsCards() {
  const { data: stats, isLoading } = useVerificationStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card p-5"
          >
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-9 w-12 mb-2" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Pending Review',
      value: stats?.pending ?? 0,
      description: 'Awaiting admin review',
      icon: IconClock,
      accentColor: 'bg-amber-500',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Approved',
      value: stats?.approvedThisWeek ?? 0,
      description: `${stats?.approvedToday ?? 0} today`,
      icon: IconCheck,
      accentColor: 'bg-emerald-500',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Rejected',
      value: stats?.rejectedThisWeek ?? 0,
      description: `${stats?.rejectedToday ?? 0} today`,
      icon: IconX,
      accentColor: 'bg-rose-500',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Awaiting Response',
      value: stats?.awaitingResponse ?? 0,
      description: 'Info requested from user',
      icon: IconInfoCircle,
      accentColor: 'bg-sky-500',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
  ]

  return (
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
              'absolute left-0 top-4 bottom-4 w-0.75 rounded-r-full',
              card.accentColor,
            )}
          />

          <div className="flex items-start justify-between pl-3">
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-muted-foreground">
                {card.title}
              </p>
              <p className="font-display text-4xl tracking-tight tabular-nums">
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {card.description}
              </p>
            </div>
            <div
              className={cn(
                'rounded-lg p-2 bg-muted/50 transition-colors',
                'group-hover:bg-muted',
              )}
            >
              <card.icon className={cn('h-4 w-4', card.iconColor)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
