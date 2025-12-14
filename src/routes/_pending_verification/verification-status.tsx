import { createFileRoute } from '@tanstack/react-router'
import { VerificationStatusCard } from '@/components/user-verification'

export const Route = createFileRoute(
  '/_pending_verification/verification-status',
)({
  component: VerificationStatusPage,
})

function VerificationStatusPage() {
  return <VerificationStatusCard />
}
