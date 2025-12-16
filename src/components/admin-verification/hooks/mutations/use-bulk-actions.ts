import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { adminVerificationKeys } from '../keys'
import { db } from '@/db'
import { user, userVerification, verificationAuditLog } from '@/db/schema'

type BulkAction = 'approve' | 'reject' | 'request_info'

interface BulkActionInput {
  verificationIds: Array<string>
  action: BulkAction
  reason?: string
}

interface BulkActionResult {
  succeeded: number
  failed: number
  total: number
  errors: Array<{ id: string; error: string }>
}

export const bulkAction = createServerFn({ method: 'POST' })
  .inputValidator((data: BulkActionInput) => data)
  .handler(async ({ data }) => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const sessionUser = session.user as typeof session.user & { role?: string }
    if (sessionUser.role !== 'admin') {
      throw new Error('Forbidden: Admin access required')
    }

    if (
      data.action !== 'approve' &&
      (!data.reason || data.reason.trim().length === 0)
    ) {
      throw new Error('Reason is required for rejection and info requests')
    }

    const adminId = session.user.id
    const now = new Date()

    const results: BulkActionResult = {
      succeeded: 0,
      failed: 0,
      total: data.verificationIds.length,
      errors: [],
    }

    for (const verificationId of data.verificationIds) {
      try {
        // Get current verification
        const current = await db.query.userVerification.findFirst({
          where: eq(userVerification.id, verificationId),
        })

        if (!current) {
          results.failed++
          results.errors.push({
            id: verificationId,
            error: 'Verification not found',
          })
          continue
        }

        let newStatus: string
        let auditAction: string

        switch (data.action) {
          case 'approve':
            newStatus = 'verified'
            auditAction = 'approved'

            await db
              .update(userVerification)
              .set({
                status: 'verified',
                verifiedAt: now,
                verifiedBy: adminId,
                rejectionReason: null,
              })
              .where(eq(userVerification.id, verificationId))

            // Update user's verified status
            await db
              .update(user)
              .set({ userVerified: true })
              .where(eq(user.id, current.userId))
            break

          case 'reject':
            newStatus = 'rejected'
            auditAction = 'rejected'

            await db
              .update(userVerification)
              .set({
                status: 'rejected',
                verifiedAt: now,
                verifiedBy: adminId,
                rejectionReason: data.reason!,
              })
              .where(eq(userVerification.id, verificationId))
            break

          case 'request_info':
            newStatus = 'info_requested'
            auditAction = 'info_requested'

            await db
              .update(userVerification)
              .set({
                status: 'info_requested',
                rejectionReason: data.reason!,
              })
              .where(eq(userVerification.id, verificationId))
            break

          default:
            throw new Error('Invalid action')
        }

        // Create audit log
        await db.insert(verificationAuditLog).values({
          verificationId,
          adminUserId: adminId,
          action: auditAction,
          reason: data.reason || null,
          previousStatus: current.status,
          newStatus,
        })

        results.succeeded++
      } catch (error) {
        results.failed++
        results.errors.push({
          id: verificationId,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return results
  })

export function useBulkActions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: BulkActionInput) => bulkAction({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminVerificationKeys.all })
    },
  })
}
