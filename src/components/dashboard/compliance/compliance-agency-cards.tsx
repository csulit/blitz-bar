import {
  IconHeartPlus,
  IconHome,
  IconReceiptTax,
  IconShieldCheck,
} from '@tabler/icons-react'
import type { AgencyCode, AgencyCompliance, ComplianceStatus } from './types'
import { cn } from '@/lib/utils'

interface ComplianceAgencyCardsProps {
  agencies: AgencyCompliance[]
}

const agencyIcons: Record<AgencyCode, typeof IconShieldCheck> = {
  SSS: IconShieldCheck,
  PhilHealth: IconHeartPlus,
  'Pag-IBIG': IconHome,
  BIR: IconReceiptTax,
}

const statusColors: Record<
  ComplianceStatus,
  { accent: string; icon: string; text: string }
> = {
  compliant: {
    accent: 'bg-emerald-500',
    icon: 'text-emerald-600 dark:text-emerald-400',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  'at-risk': {
    accent: 'bg-amber-500',
    icon: 'text-amber-600 dark:text-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
  },
  'non-compliant': {
    accent: 'bg-rose-500',
    icon: 'text-rose-600 dark:text-rose-400',
    text: 'text-rose-600 dark:text-rose-400',
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

export function ComplianceAgencyCards({
  agencies,
}: ComplianceAgencyCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {agencies.map((agency) => {
        const Icon = agencyIcons[agency.agency]
        const colors = statusColors[agency.status]
        const totalEmployees =
          agency.employeesCompliant +
          agency.employeesAtRisk +
          agency.employeesNonCompliant

        return (
          <div
            key={agency.agency}
            className={cn(
              'group relative rounded-xl border border-border/60 bg-card p-5',
              'transition-all duration-200 hover:border-border hover:shadow-sm',
            )}
          >
            {/* Accent line */}
            <div
              className={cn(
                'absolute bottom-4 left-0 top-4 w-0.75 rounded-r-full',
                colors.accent,
              )}
            />

            <div className="flex items-start justify-between pl-3">
              <div className="space-y-1">
                <p className="text-[13px] font-medium text-muted-foreground">
                  {agency.agency}
                </p>
                <p className="font-display text-2xl tabular-nums tracking-tight">
                  {formatCurrency(agency.totalContributions)}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {agency.employeesCompliant}/{totalEmployees} employees
                  compliant
                </p>
                <p className={cn('text-xs', colors.text)}>
                  Due in {agency.daysUntilDue} days
                </p>
              </div>
              <div
                className={cn(
                  'rounded-lg bg-muted/50 p-2 transition-colors',
                  'group-hover:bg-muted',
                )}
              >
                <Icon className={cn('h-4 w-4', colors.icon)} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
