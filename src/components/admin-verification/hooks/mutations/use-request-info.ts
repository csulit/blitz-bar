import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { adminVerificationKeys } from '../keys'
import { db } from '@/db'
import { userVerification, verificationAuditLog } from '@/db/schema'
import { assertCan } from '@/lib/casl/server'

interface RequestInfoInput {
  verificationId: string
  reason: string
}

export const requestAdditionalInfo = createServerFn({ method: 'POST' })
  .inputValidator((data: RequestInfoInput) => data)
  .handler(async ({ data }) => {
    const sessionUser = await assertCan('request_info', 'UserVerification')

    if (!data.reason || data.reason.trim().length === 0) {
      throw new Error('Please specify what additional information is needed')
    }

    const adminId = sessionUser.id

    // Get current verification
    const current = await db.query.userVerification.findFirst({
      where: eq(userVerification.id, data.verificationId),
    })

    if (!current) {
      throw new Error('Verification not found')
    }

    // Update verification status
    await db
      .update(userVerification)
      .set({
        status: 'info_requested',
        rejectionReason: data.reason, // Store the request message
      })
      .where(eq(userVerification.id, data.verificationId))

    // Create audit log
    await db.insert(verificationAuditLog).values({
      verificationId: data.verificationId,
      adminUserId: adminId,
      action: 'info_requested',
      reason: data.reason,
      previousStatus: current.status,
      newStatus: 'info_requested',
    })

    return { success: true }
  })

export function useRequestInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RequestInfoInput) =>
      requestAdditionalInfo({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminVerificationKeys.all })
    },
  })
}
