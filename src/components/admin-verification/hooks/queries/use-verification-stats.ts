import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { and, eq, gte, sql } from 'drizzle-orm'
import { adminVerificationKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { VerificationStats } from '../../types'
import { db } from '@/db'
import { userVerification } from '@/db/schema'
import { assertCan } from '@/lib/casl/server'

export const getVerificationStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    // Check if user can manage verifications (admin only)
    await assertCan('manage', 'UserVerification')

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    // Count pending (submitted status)
    const pendingResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVerification)
      .where(eq(userVerification.status, 'submitted'))

    // Count approved today
    const approvedTodayResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVerification)
      .where(
        and(
          eq(userVerification.status, 'verified'),
          gte(userVerification.verifiedAt, today),
        ),
      )

    // Count approved this week
    const approvedThisWeekResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVerification)
      .where(
        and(
          eq(userVerification.status, 'verified'),
          gte(userVerification.verifiedAt, weekAgo),
        ),
      )

    // Count rejected today
    const rejectedTodayResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVerification)
      .where(
        and(
          eq(userVerification.status, 'rejected'),
          gte(userVerification.updatedAt, today),
        ),
      )

    // Count rejected this week
    const rejectedThisWeekResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVerification)
      .where(
        and(
          eq(userVerification.status, 'rejected'),
          gte(userVerification.updatedAt, weekAgo),
        ),
      )

    // Count awaiting response (info_requested status)
    const awaitingResponseResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVerification)
      .where(eq(userVerification.status, 'info_requested'))

    return {
      pending: pendingResult[0]?.count ?? 0,
      approvedToday: approvedTodayResult[0]?.count ?? 0,
      approvedThisWeek: approvedThisWeekResult[0]?.count ?? 0,
      rejectedToday: rejectedTodayResult[0]?.count ?? 0,
      rejectedThisWeek: rejectedThisWeekResult[0]?.count ?? 0,
      awaitingResponse: awaitingResponseResult[0]?.count ?? 0,
    } as VerificationStats
  },
)

type VerificationStatsResult = Awaited<ReturnType<typeof getVerificationStats>>

export function useVerificationStats(
  options?: Omit<
    UseQueryOptions<VerificationStatsResult, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: adminVerificationKeys.stats(),
    queryFn: () => getVerificationStats(),
    refetchInterval: 30000, // Refresh every 30 seconds
    ...options,
  })
}
