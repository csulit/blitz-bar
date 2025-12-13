import { createFileRoute } from '@tanstack/react-router'
import { VerificationStatusCard } from '@/components/verification-status-card'

export const Route = createFileRoute(
  '/_pending_verification/verification-status',
)({
  component: VerificationStatusPage,
})

function VerificationStatusPage() {
  return <VerificationStatusCard />
}
