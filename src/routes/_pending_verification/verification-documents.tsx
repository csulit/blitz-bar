import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod/v4'
import { IdentityVerificationWizard } from '@/components/user-verification'
import { getVerificationStatus } from '@/components/user-verification/hooks/queries/use-verification-status'

const verificationStepSchema = z.enum([
  'personal_info',
  'education',
  'upload',
  'job_history',
  'review',
])

export const Route = createFileRoute(
  '/_pending_verification/verification-documents',
)({
  component: VerificationDocumentsPage,
  validateSearch: z.object({
    step: verificationStepSchema.optional().catch('personal_info'),
  }),
  beforeLoad: async ({ search }) => {
    const verificationStatus = await getVerificationStatus()

    const isLocked =
      verificationStatus.status === 'submitted' ||
      verificationStatus.status === 'verified'

    if (isLocked && search.step !== 'review') {
      throw redirect({
        to: '/verification-documents',
        search: { step: 'review' },
      })
    }

    return { verificationStatus }
  },
})

function VerificationDocumentsPage() {
  const { verificationStatus } = Route.useRouteContext()
  return <IdentityVerificationWizard initialStatus={verificationStatus} />
}
