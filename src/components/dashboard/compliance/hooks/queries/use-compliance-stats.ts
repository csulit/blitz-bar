import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { dashboardKeys } from '../../../hooks/keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type {
  AgencyCompliance,
  ComplianceDeadline,
  ComplianceStats,
  ComplianceStatus,
} from '../../types'
import { assertCan } from '@/lib/casl/server'

function generateMockComplianceStats(): ComplianceStats {
  const totalEmployees = 148

  // Philippine government agency data with realistic compliance scenarios
  const agencies: Array<AgencyCompliance> = [
    {
      agency: 'SSS',
      agencyFullName: 'Social Security System',
      status: 'compliant',
      contributionRate: '13%',
      totalContributions: 485000,
      employeesCompliant: 142,
      employeesAtRisk: 4,
      employeesNonCompliant: 2,
      lastRemittanceDate: '2024-12-10',
      nextDueDate: '2025-01-15',
      daysUntilDue: 27,
    },
    {
      agency: 'PhilHealth',
      agencyFullName: 'Philippine Health Insurance Corporation',
      status: 'compliant',
      contributionRate: '5%',
      totalContributions: 185000,
      employeesCompliant: 145,
      employeesAtRisk: 2,
      employeesNonCompliant: 1,
      lastRemittanceDate: '2024-12-10',
      nextDueDate: '2025-01-10',
      daysUntilDue: 22,
    },
    {
      agency: 'Pag-IBIG',
      agencyFullName: 'Home Development Mutual Fund',
      status: 'at-risk',
      contributionRate: '2%',
      totalContributions: 74000,
      employeesCompliant: 138,
      employeesAtRisk: 8,
      employeesNonCompliant: 2,
      lastRemittanceDate: '2024-12-12',
      nextDueDate: '2025-01-10',
      daysUntilDue: 22,
    },
    {
      agency: 'BIR',
      agencyFullName: 'Bureau of Internal Revenue',
      status: 'compliant',
      contributionRate: 'Varies',
      totalContributions: 892000,
      employeesCompliant: 146,
      employeesAtRisk: 1,
      employeesNonCompliant: 1,
      lastRemittanceDate: '2024-12-10',
      nextDueDate: '2025-01-10',
      daysUntilDue: 22,
    },
  ]

  const deadlines: Array<ComplianceDeadline> = [
    {
      id: '1',
      agency: 'PhilHealth',
      title: 'Monthly Contribution Remittance',
      dueDate: '2025-01-10',
      daysUntilDue: 22,
      status: 'compliant',
      description: 'January 2025 PhilHealth contributions',
    },
    {
      id: '2',
      agency: 'Pag-IBIG',
      title: 'Monthly Contribution Remittance',
      dueDate: '2025-01-10',
      daysUntilDue: 22,
      status: 'at-risk',
      description: 'January 2025 HDMF contributions',
    },
    {
      id: '3',
      agency: 'BIR',
      title: 'Form 1601-C Submission',
      dueDate: '2025-01-10',
      daysUntilDue: 22,
      status: 'compliant',
      description: 'Monthly withholding tax remittance',
    },
    {
      id: '4',
      agency: 'SSS',
      title: 'Monthly Contribution Remittance',
      dueDate: '2025-01-15',
      daysUntilDue: 27,
      status: 'compliant',
      description: 'January 2025 SSS contributions',
    },
    {
      id: '5',
      agency: 'BIR',
      title: 'Form 2316 Annual',
      dueDate: '2025-01-31',
      daysUntilDue: 43,
      status: 'compliant',
      description: 'Annual information return for employees',
    },
  ]

  // Calculate overall score
  // Weight: compliant = 100%, at-risk = 50%, non-compliant = 0%
  const compliantTotal = agencies.reduce(
    (sum, a) => sum + a.employeesCompliant,
    0,
  )
  const atRiskTotal = agencies.reduce((sum, a) => sum + a.employeesAtRisk, 0)
  const nonCompliantTotal = agencies.reduce(
    (sum, a) => sum + a.employeesNonCompliant,
    0,
  )

  const maxPossible = totalEmployees * agencies.length
  const overallScore = Math.round(
    (compliantTotal * 100 + atRiskTotal * 50) / maxPossible,
  )

  const overallStatus: ComplianceStatus =
    overallScore >= 90
      ? 'compliant'
      : overallScore >= 70
        ? 'at-risk'
        : 'non-compliant'

  return {
    agencies,
    deadlines: deadlines.sort((a, b) => a.daysUntilDue - b.daysUntilDue),
    overallScore,
    overallStatus,
    totalMonthlyContributions: agencies.reduce(
      (sum, a) => sum + a.totalContributions,
      0,
    ),
    complianceBreakdown: {
      compliant: Math.round((compliantTotal / maxPossible) * 100),
      atRisk: Math.round((atRiskTotal / maxPossible) * 100),
      nonCompliant: Math.round((nonCompliantTotal / maxPossible) * 100),
    },
  }
}

export const getComplianceStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    await assertCan('read', 'Dashboard')

    // Simulate network delay for loading state demonstration
    await new Promise((resolve) => setTimeout(resolve, 400))

    // Return mock data (will be replaced with real DB queries later)
    return generateMockComplianceStats()
  },
)

type ComplianceStatsResult = Awaited<ReturnType<typeof getComplianceStats>>

export function useComplianceStats(
  options?: Omit<
    UseQueryOptions<ComplianceStatsResult, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: dashboardKeys.complianceStats(),
    queryFn: () => getComplianceStats(),
    refetchInterval: 30000,
    ...options,
  })
}
