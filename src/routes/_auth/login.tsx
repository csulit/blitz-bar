import { createFileRoute } from '@tanstack/react-router'
import { LoginFormCard } from '@/components/login-form-card'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  return <LoginFormCard />
}
