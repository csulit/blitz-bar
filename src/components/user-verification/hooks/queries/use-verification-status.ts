import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { verificationStatusKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import { db } from '@/db'
import { userVerification } from '@/db/schema'

export type VerificationStatus = 'draft' | 'submitted' | 'verified' | 'rejected'

export interface VerificationStatusData {
  status: VerificationStatus
  submittedAt: string | null
  verifiedAt: string | null
  rejectionReason: string | null
}

/**
 * Server function for fetching user's verification status
 * Returns the overall verification submission status
 */
export const getVerificationStatus = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const verification = await db.query.userVerification.findFirst({
      where: eq(userVerification.userId, session.user.id),
    })

    if (!verification) {
      // No verification record means user hasn't started or is in draft
      return {
        status: 'draft' as VerificationStatus,
        submittedAt: null,
        verifiedAt: null,
        rejectionReason: null,
      }
    }

    return {
      status: verification.status as VerificationStatus,
      submittedAt: verification.submittedAt?.toISOString() ?? null,
      verifiedAt: verification.verifiedAt?.toISOString() ?? null,
      rejectionReason: verification.rejectionReason,
    }
  },
)

// Infer the return type from the server function
type VerificationStatusResult = Awaited<
  ReturnType<typeof getVerificationStatus>
>

/**
 * Hook for fetching current user's verification status
 *
 * @example
 * const { data: status, isLoading } = useVerificationStatus()
 *
 * if (status?.status === 'submitted') {
 *   // Disable editing
 * }
 */
export function useVerificationStatus(
  options?: Omit<
    UseQueryOptions<VerificationStatusResult, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: verificationStatusKeys.detail(),
    queryFn: () => getVerificationStatus(),
    ...options,
  })
}
