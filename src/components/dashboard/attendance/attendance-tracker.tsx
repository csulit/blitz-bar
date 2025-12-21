import { useState } from 'react'
import { AttendanceEmployeeList } from './attendance-employee-list'
import { AttendanceMetricCards } from './attendance-metric-cards'
import { AttendanceRateCard } from './attendance-rate-card'
import { AttendanceTrackerSkeleton } from './attendance-tracker-skeleton'
import { PeriodSelector } from './period-selector'
import { useAttendanceStats } from './hooks/queries/use-attendance-stats'
import type { AttendancePeriod } from './types'

export function AttendanceTracker() {
  const [period, setPeriod] = useState<AttendancePeriod>('day')
  const { data: stats, isLoading } = useAttendanceStats(period)

  if (isLoading) {
    return <AttendanceTrackerSkeleton />
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <PeriodSelector value={period} onChange={setPeriod} />

      {/* Attendance Rate Card */}
      <AttendanceRateCard
        rate={stats.attendanceRate}
        status={stats.attendanceStatus}
        presentCount={stats.presentToday}
        totalCount={stats.totalEmployees}
        onLeaveCount={stats.onLeave}
        periodLabel={stats.periodLabel}
      />

      {/* Metric Cards */}
      <AttendanceMetricCards
        presentToday={stats.presentToday}
        absentToday={stats.absentToday}
        onLeave={stats.onLeave}
        overtime={stats.overtime}
        lateArrivals={stats.lateArrivals}
      />

      {/* Employee Lists */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AttendanceEmployeeList
          title="Absent Today"
          employees={stats.absentEmployees}
          emptyMessage="No absences recorded"
          type="absent"
        />
        <AttendanceEmployeeList
          title="On Leave"
          employees={stats.onLeaveEmployees}
          emptyMessage="No employees on leave"
          type="on-leave"
        />
      </div>
    </div>
  )
}
