import { ComplianceAgencyCards } from './compliance-agency-cards'
import { ComplianceDeadlineList } from './compliance-deadline-list'
import { ComplianceScoreCard } from './compliance-score-card'
import { ComplianceTrackerSkeleton } from './compliance-tracker-skeleton'
import { useComplianceStats } from './hooks/queries/use-compliance-stats'

export function ComplianceTracker() {
  const { data: stats, isLoading } = useComplianceStats()

  if (isLoading) {
    return <ComplianceTrackerSkeleton />
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Overall Compliance Score */}
      <ComplianceScoreCard
        score={stats.overallScore}
        status={stats.overallStatus}
        totalContributions={stats.totalMonthlyContributions}
        breakdown={stats.complianceBreakdown}
      />

      {/* Agency Cards */}
      <ComplianceAgencyCards agencies={stats.agencies} />

      {/* Deadline List */}
      <ComplianceDeadlineList deadlines={stats.deadlines} />
    </div>
  )
}
