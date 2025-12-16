import { createFileRoute } from '@tanstack/react-router'
import { VerificationUnifiedPage } from '@/components/user-verification/verification-unified-page'

export const Route = createFileRoute(
  '/_pending_verification/verification-status',
)({
  component: VerificationStatusPage,
})

function VerificationStatusPage() {
  return <VerificationUnifiedPage />
}
