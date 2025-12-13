import { createFileRoute } from '@tanstack/react-router'
import { VerificationDocumentsCard } from '@/components/verification-documents-card'

export const Route = createFileRoute('/_pending_verification/verification-documents')({
  component: VerificationDocumentsPage,
})

function VerificationDocumentsPage() {
  return <VerificationDocumentsCard />
}
