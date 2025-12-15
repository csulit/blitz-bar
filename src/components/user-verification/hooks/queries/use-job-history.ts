import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { jobHistoryKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type {
  JobHistoryEntry,
  JobHistoryFormData,
} from '@/lib/schemas/job-history'
import { db } from '@/db'
import { jobHistory } from '@/db/schema'

/**
 * Server function for fetching job history data
 * Fetches all job history records for the current user
 */
export const getJobHistory = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    // Fetch all job history records for this user
    const jobHistoryData = await db.query.jobHistory.findMany({
      where: eq(jobHistory.userId, session.user.id),
      orderBy: (jh, { desc }) => [desc(jh.startMonth)],
    })

    if (jobHistoryData.length === 0) {
      return null
    }

    // Map database records to JobHistoryEntry shape
    const jobs: JobHistoryEntry[] = jobHistoryData.map((job) => ({
      id: job.id,
      companyName: job.companyName,
      position: job.position,
      startMonth: job.startMonth,
      endMonth: job.endMonth ?? undefined,
      isCurrentJob: job.isCurrentJob ?? false,
      summary: job.summary,
    }))

    return { jobs } as JobHistoryFormData
  },
)

// Infer the return type from the server function
type JobHistoryData = Awaited<ReturnType<typeof getJobHistory>>

/**
 * Hook for fetching current user's job history data
 *
 * @example
 * const { data: jobHistory, isLoading, error } = useJobHistory()
 */
export function useJobHistory(
  options?: Omit<
    UseQueryOptions<JobHistoryData, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: jobHistoryKeys.detail(),
    queryFn: () => getJobHistory(),
    ...options,
  })
}
