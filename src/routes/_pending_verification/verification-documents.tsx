import { createFileRoute } from '@tanstack/react-router'
import { IdentityVerificationWizard } from '@/components/user-verification'

export const Route = createFileRoute(
  '/_pending_verification/verification-documents',
)({
  component: VerificationDocumentsPage,
})

function VerificationDocumentsPage() {
  return <IdentityVerificationWizard />
}
