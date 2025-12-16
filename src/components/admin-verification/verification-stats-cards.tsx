import {
  IconCheck,
  IconClock,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react'
import { useVerificationStats } from './hooks/queries/use-verification-stats'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function VerificationStatsCards() {
  const { data: stats, isLoading } = useVerificationStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardHeader>
          </Card>
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
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    },
    {
      title: 'Approved',
      value: stats?.approvedThisWeek ?? 0,
      description: `${stats?.approvedToday ?? 0} today`,
      icon: IconCheck,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Rejected',
      value: stats?.rejectedThisWeek ?? 0,
      description: `${stats?.rejectedToday ?? 0} today`,
      icon: IconX,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
    },
    {
      title: 'Awaiting Response',
      value: stats?.awaitingResponse ?? 0,
      description: 'Info requested from user',
      icon: IconInfoCircle,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className={card.bgColor}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription className="font-medium">
                {card.title}
              </CardDescription>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              {card.value}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
