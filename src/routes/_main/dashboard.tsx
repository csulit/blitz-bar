import { createFileRoute } from '@tanstack/react-router'
import { AttendanceTracker } from '@/components/dashboard/attendance'
import { ComplianceTracker } from '@/components/dashboard/compliance'
import { DashboardPageSkeleton } from '@/components/dashboard/dashboard-page-skeleton'
import { WorkforceStatsCards } from '@/components/dashboard/workforce-stats-cards'

export const Route = createFileRoute('/_main/dashboard')({
  component: DashboardPage,
  pendingComponent: DashboardPageSkeleton,
})

function DashboardPage() {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl">Workforce Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor your team's headcount and trends at a glance.
        </p>
      </div>

      <WorkforceStatsCards />

      {/* Government Compliance Tracker */}
      <div className="mb-6 mt-10">
        <h2 className="font-display text-2xl">Government Compliance</h2>
        <p className="mt-1 text-muted-foreground">
          Track mandatory contributions and remittance deadlines.
        </p>
      </div>

      <ComplianceTracker />

      {/* Attendance Summary */}
      <div className="mb-6 mt-10">
        <h2 className="font-display text-2xl">Attendance Summary</h2>
        <p className="mt-1 text-muted-foreground">
          Track daily attendance, leaves, and overtime at a glance.
        </p>
      </div>

      <AttendanceTracker />
    </div>
  )
}
