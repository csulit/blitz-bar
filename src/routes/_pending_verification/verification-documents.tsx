import { createFileRoute } from '@tanstack/react-router'
import { IdentityVerificationWizard } from '@/components/identity-verification-wizard'

export const Route = createFileRoute(
  '/_pending_verification/verification-documents',
)({
  component: VerificationDocumentsPage,
})

function VerificationDocumentsPage() {
  return <IdentityVerificationWizard />
}
