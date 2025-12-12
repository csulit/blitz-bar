import { createFileRoute } from '@tanstack/react-router'
import { SignupFormCard } from '@/components/signup-form-card'

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
})

function SignupPage() {
  return <SignupFormCard />
}
