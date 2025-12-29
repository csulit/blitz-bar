import { CompensationDepartmentChart } from './compensation-department-chart'
import { CompensationMetricCards } from './compensation-metric-cards'
import { CompensationPayrollCard } from './compensation-payroll-card'
import { CompensationTrackerSkeleton } from './compensation-tracker-skeleton'
import { ThirteenthMonthCard } from './thirteenth-month-card'
import { useCompensationStats } from './hooks/queries/use-compensation-stats'

export function CompensationTracker() {
  const { data: stats, isLoading } = useCompensationStats()

  if (isLoading) {
    return <CompensationTrackerSkeleton />
  }

  if (!stats) {
    return null
  }

  // Get top department by salary
  const topDepartment = [...stats.departmentBreakdown].sort(
    (a, b) => b.totalSalary - a.totalSalary,
  )[0]

  return (
    <div className="space-y-6">
      {/* Payroll and 13th Month Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CompensationPayrollCard
          totalPayroll={stats.totalPayroll}
          payrollChange={stats.payrollChange}
          totalEmployees={stats.totalEmployees}
          averageSalary={stats.averageSalary}
        />
        <ThirteenthMonthCard data={stats.thirteenthMonth} />
      </div>

      {/* Metric Cards */}
      <CompensationMetricCards
        overtimeCosts={stats.overtimeCosts}
        departmentCount={stats.departmentBreakdown.length}
        topDepartment={topDepartment}
        averageSalary={stats.averageSalary}
      />

      {/* Department Breakdown Chart */}
      <CompensationDepartmentChart
        data={stats.departmentBreakdown}
        totalPayroll={stats.totalPayroll}
      />
    </div>
  )
}
