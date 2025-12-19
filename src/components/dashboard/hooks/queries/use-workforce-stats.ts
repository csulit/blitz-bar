import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { dashboardKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { WorkforceStats } from '../../types'
import { assertCan } from '@/lib/casl/server'

function generateMockWorkforceStats(): WorkforceStats {
  const departments = [
    { department: 'Engineering', count: 45, color: 'hsl(217, 91%, 60%)' },
    { department: 'Sales', count: 28, color: 'hsl(25, 95%, 53%)' },
    { department: 'Operations', count: 22, color: 'hsl(215, 14%, 45%)' },
    { department: 'Marketing', count: 18, color: 'hsl(330, 81%, 60%)' },
    { department: 'Finance', count: 15, color: 'hsl(142, 71%, 45%)' },
    { department: 'Design', count: 12, color: 'hsl(271, 91%, 65%)' },
    { department: 'HR', count: 8, color: 'hsl(173, 80%, 40%)' },
  ]

  const totalHeadcount = departments.reduce((sum, d) => sum + d.count, 0)
  const activeEmployees = Math.floor(totalHeadcount * 0.92)
  const onLeave = totalHeadcount - activeEmployees

  return {
    totalHeadcount,
    activeEmployees,
    onLeave,
    newHires: 8,
    newHiresChange: 15,
    separations: 3,
    separationsChange: -25,
    turnoverRate: 2.1,
    turnoverRatePrevious: 2.8,
    departmentBreakdown: departments,
  }
}

export const getWorkforceStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    await assertCan('read', 'Dashboard')

    // Simulate network delay for loading state demonstration
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return mock data (will be replaced with real DB queries later)
    return generateMockWorkforceStats()
  },
)

type WorkforceStatsResult = Awaited<ReturnType<typeof getWorkforceStats>>

export function useWorkforceStats(
  options?: Omit<
    UseQueryOptions<WorkforceStatsResult, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: dashboardKeys.workforceStats(),
    queryFn: () => getWorkforceStats(),
    refetchInterval: 30000,
    ...options,
  })
}
