import { createFileRoute } from '@tanstack/react-router'
import { VerificationReviewPage } from '@/components/admin-verification'

export const Route = createFileRoute('/admin/')({
  component: VerificationReviewPage,
})
