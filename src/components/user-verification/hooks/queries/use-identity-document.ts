import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { desc, eq } from 'drizzle-orm'
import { identityDocumentKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import { db } from '@/db'
import { identityDocument } from '@/db/schema'

/**
 * Server function for fetching the user's most recent identity document
 * Returns the latest pending or verified document if exists
 */
export const getIdentityDocument = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    // Fetch the most recent identity document for the user
    const document = await db.query.identityDocument.findFirst({
      where: eq(identityDocument.userId, session.user.id),
      orderBy: [desc(identityDocument.createdAt)],
    })

    if (!document) {
      return null
    }

    return {
      id: document.id,
      documentType: document.documentType as
        | 'identity_card'
        | 'driver_license'
        | 'passport',
      frontImageUrl: document.frontImageUrl,
      backImageUrl: document.backImageUrl,
      status: document.status as 'pending' | 'verified' | 'rejected',
      submittedAt: document.submittedAt.toISOString(),
    }
  },
)

// Infer the return type from the server function
type IdentityDocumentData = Awaited<ReturnType<typeof getIdentityDocument>>

/**
 * Hook for fetching current user's most recent identity document
 *
 * @example
 * const { data: document, isLoading, error } = useIdentityDocument()
 */
export function useIdentityDocument(
  options?: Omit<
    UseQueryOptions<IdentityDocumentData, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: identityDocumentKeys.detail(),
    queryFn: () => getIdentityDocument(),
    ...options,
  })
}
