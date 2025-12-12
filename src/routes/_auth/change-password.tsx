import { createFileRoute } from '@tanstack/react-router'
import { ChangePasswordForm } from '@/components/change-password-form'

export const Route = createFileRoute('/_auth/change-password')({
  component: ChangePasswordPage,
})

function ChangePasswordPage() {
  return <ChangePasswordForm />
}
