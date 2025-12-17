import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { adminVerificationKeys } from '../keys'
import { db } from '@/db'
import { userVerification, verificationAuditLog } from '@/db/schema'
import { assertCan } from '@/lib/casl/server'

interface RejectInput {
  verificationId: string
  reason: string
}

export const rejectVerification = createServerFn({ method: 'POST' })
  .inputValidator((data: RejectInput) => data)
  .handler(async ({ data }) => {
    const sessionUser = await assertCan('reject', 'UserVerification')

    if (!data.reason || data.reason.trim().length === 0) {
      throw new Error('Rejection reason is required')
    }

    const adminId = sessionUser.id

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
