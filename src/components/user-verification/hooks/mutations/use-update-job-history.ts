import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { jobHistoryKeys } from '../keys'
import type { JobHistoryFormData } from '@/lib/schemas/job-history'
import { db } from '@/db'
import { jobHistory } from '@/db/schema'

type UpdateJobHistoryInput = JobHistoryFormData

/**
 * Server function for updating job history
 * Uses sync strategy - deletes all existing entries and inserts new ones
 * This is simpler for managing multiple entries with add/remove functionality
 */
export const updateJobHistory = createServerFn({ method: 'POST' })
  .inputValidator((data: UpdateJobHistoryInput) => data)
  .handler(async ({ data }) => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const userId = session.user.id

    // Skip if no jobs to save
    if (data.jobs.length === 0) {
      return { success: true }
    }

    // Delete all existing job history entries for this user
    await db.delete(jobHistory).where(eq(jobHistory.userId, userId))

    // Insert all new entries
    const jobEntries = data.jobs.map((job) => ({
      userId,
      companyName: job.companyName,
      position: job.position,
      startMonth: job.startMonth,
      endMonth: job.endMonth || null,
      isCurrentJob: job.isCurrentJob || false,
      summary: job.summary,
    }))

    if (jobEntries.length > 0) {
      await db.insert(jobHistory).values(jobEntries)
    }

    return { success: true }
  })

/**
 * Hook for updating job history
 * Designed for debounced auto-save - invalidates cache on success
 *
 * @example
 * const { mutate, mutateAsync, isPending } = useUpdateJobHistory()
 *
 * // Fire and forget (for debounced saves)
 * mutate({ jobs: [{ companyName: 'Acme', position: 'Developer', ... }] })
 */
export function useUpdateJobHistory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateJobHistoryInput) =>
      updateJobHistory({ data: input }),
    onSuccess: () => {
      // Invalidate to keep cache in sync
      queryClient.invalidateQueries({ queryKey: jobHistoryKeys.all })
    },
    onError: (error) => {
      // Silent failure for auto-save - just log to console
      console.error('Failed to save job history:', error)
    },
  })
}
