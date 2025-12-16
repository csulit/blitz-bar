import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { adminVerificationKeys } from '../keys'
import { db } from '@/db'
import { user, userVerification, verificationAuditLog } from '@/db/schema'

interface ApproveInput {
  verificationId: string
  note?: string
}

export const approveVerification = createServerFn({ method: 'POST' })
  .inputValidator((data: ApproveInput) => data)
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
        status: 'verified',
        verifiedAt: now,
        verifiedBy: adminId,
        rejectionReason: null,
      })
      .where(eq(userVerification.id, data.verificationId))

    // Update user's verified status
    await db
      .update(user)
      .set({ userVerified: true })
      .where(eq(user.id, current.userId))

    // Create audit log
    await db.insert(verificationAuditLog).values({
      verificationId: data.verificationId,
      adminUserId: adminId,
      action: 'approved',
      reason: data.note || null,
      previousStatus: current.status,
      newStatus: 'verified',
    })

    return { success: true }
  })

export function useApproveVerification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ApproveInput) => approveVerification({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminVerificationKeys.all })
    },
  })
}
