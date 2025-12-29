import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { dashboardKeys } from '../../../hooks/keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { CompensationStats, DepartmentSalary } from '../../types'
import { assertCan } from '@/lib/casl/server'

function generateMockCompensationStats(): CompensationStats {
  const departments: Array<DepartmentSalary> = [
    {
      department: 'Engineering',
      totalSalary: 2475000,
      employeeCount: 45,
      color: 'hsl(217, 91%, 60%)',
    },
    {
      department: 'Sales',
      totalSalary: 1260000,
      employeeCount: 28,
      color: 'hsl(25, 95%, 53%)',
    },
    {
      department: 'Operations',
      totalSalary: 880000,
      employeeCount: 22,
      color: 'hsl(215, 14%, 45%)',
    },
    {
      department: 'Marketing',
      totalSalary: 810000,
      employeeCount: 18,
      color: 'hsl(330, 81%, 60%)',
    },
    {
      department: 'Finance',
      totalSalary: 750000,
      employeeCount: 15,
      color: 'hsl(142, 71%, 45%)',
    },
    {
      department: 'Design',
      totalSalary: 540000,
      employeeCount: 12,
      color: 'hsl(271, 91%, 65%)',
    },
    {
      department: 'HR',
      totalSalary: 320000,
      employeeCount: 8,
      color: 'hsl(173, 80%, 40%)',
    },
  ]

  const totalPayroll = departments.reduce((sum, d) => sum + d.totalSalary, 0)
  const totalEmployees = departments.reduce(
    (sum, d) => sum + d.employeeCount,
    0,
  )
  const previousPayroll = totalPayroll * 0.97 // Simulate 3% increase
  const payrollChange =
    ((totalPayroll - previousPayroll) / previousPayroll) * 100

  // 13th month calculation (Philippine labor law)
  // Typically accrued monthly at 1/12 of monthly salary
  const currentMonth = new Date().getMonth() + 1 // 1-12
  const targetThirteenthMonth = totalPayroll // Full month's salary as target
  const monthlyAccrualRate = targetThirteenthMonth / 12
  const currentAccrual = monthlyAccrualRate * currentMonth
  const monthsRemaining = 12 - currentMonth

  // Overtime costs
  const currentOTCosts = 485000
  const previousOTCosts = 520000
  const otChange = ((currentOTCosts - previousOTCosts) / previousOTCosts) * 100

  return {
    totalPayroll,
    previousPayroll,
    payrollChange,
    thirteenthMonth: {
      currentAccrual,
      targetAmount: targetThirteenthMonth,
      percentage: Math.round((currentAccrual / targetThirteenthMonth) * 100),
      monthsRemaining,
      monthlyAccrualRate,
    },
    overtimeCosts: {
      currentPeriod: currentOTCosts,
      previousPeriod: previousOTCosts,
      change: otChange,
      totalHours: 1275,
      averageRate: Math.round(currentOTCosts / 1275),
    },
    departmentBreakdown: departments,
    totalEmployees,
    averageSalary: Math.round(totalPayroll / totalEmployees),
  }
}

export const getCompensationStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    await assertCan('read', 'Dashboard')

    // Simulate network delay for loading state demonstration
    await new Promise((resolve) => setTimeout(resolve, 400))

    // Return mock data (will be replaced with real DB queries later)
    return generateMockCompensationStats()
  },
)

type CompensationStatsResult = Awaited<ReturnType<typeof getCompensationStats>>

export function useCompensationStats(
  options?: Omit<
    UseQueryOptions<CompensationStatsResult, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: dashboardKeys.compensationStats(),
    queryFn: () => getCompensationStats(),
    refetchInterval: 30000,
    ...options,
  })
}
