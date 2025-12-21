import { IconCalendarDue } from '@tabler/icons-react'
import type { AgencyCode, ComplianceDeadline, ComplianceStatus } from './types'
import { cn } from '@/lib/utils'

interface ComplianceDeadlineListProps {
  deadlines: ComplianceDeadline[]
}

const agencyColors: Record<AgencyCode, { bg: string; text: string }> = {
  SSS: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-700 dark:text-blue-400',
  },
  PhilHealth: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  'Pag-IBIG': {
    bg: 'bg-orange-500/10',
    text: 'text-orange-700 dark:text-orange-400',
  },
  BIR: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-700 dark:text-purple-400',
  },
}

const statusColors: Record<ComplianceStatus, string> = {
  compliant: 'text-emerald-600 dark:text-emerald-400',
  'at-risk': 'text-amber-600 dark:text-amber-400',
  'non-compliant': 'text-rose-600 dark:text-rose-400',
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getDaysLabel(days: number): string {
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days < 0) return `${Math.abs(days)} days overdue`
  return `${days} days`
}

export function ComplianceDeadlineList({
  deadlines,
}: ComplianceDeadlineListProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <IconCalendarDue className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">
          Upcoming Deadlines
        </h3>
      </div>

      <div className="divide-y divide-border/50">
        {deadlines.map((deadline) => {
          const colors = agencyColors[deadline.agency]
          const statusColor = statusColors[deadline.status]

          return (
            <div
              key={deadline.id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium',
                    colors.bg,
                    colors.text,
                  )}
                >
                  {deadline.agency}
                </span>
                <div>
                  <p className="text-sm font-medium">{deadline.title}</p>
                  {deadline.description && (
                    <p className="text-xs text-muted-foreground">
                      {deadline.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className={cn('text-sm font-medium', statusColor)}>
                  {getDaysLabel(deadline.daysUntilDue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(deadline.dueDate)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
