import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { adminVerificationKeys } from '../keys'
import { db } from '@/db'
import { userVerification, verificationAuditLog } from '@/db/schema'

interface RejectInput {
  verificationId: string
  reason: string
}

export const rejectVerification = createServerFn({ method: 'POST' })
  .inputValidator((data: RejectInput) => data)
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

    if (!data.reason || data.reason.trim().length === 0) {
      throw new Error('Rejection reason is required')
    }

    const adminId = session.user.id

    // Get current verification
    const current = await db.query.userVerification.findFirst({
      where: eq(userVerification.id, data.verificationId),
    })

    if (!current) {
      throw new Error('Verification not found')
    }

    const now = new Date()

    // Update verification status
    await db
      .update(userVerification)
      .set({
        status: 'rejected',
        verifiedAt: now,
        verifiedBy: adminId,
        rejectionReason: data.reason,
      })
      .where(eq(userVerification.id, data.verificationId))

    // Create audit log
    await db.insert(verificationAuditLog).values({
      verificationId: data.verificationId,
      adminUserId: adminId,
      action: 'rejected',
      reason: data.reason,
      previousStatus: current.status,
      newStatus: 'rejected',
    })

    return { success: true }
  })

export function useRejectVerification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RejectInput) => rejectVerification({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminVerificationKeys.all })
    },
  })
}
