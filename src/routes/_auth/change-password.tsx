import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { ChangePasswordForm } from '@/components/change-password-form'

const changePasswordSearchSchema = z.object({
  token: z.string().catch(''),
})

export const Route = createFileRoute('/_auth/change-password')({
  validateSearch: changePasswordSearchSchema,
  beforeLoad: ({ search }) => {
    if (!search.token) {
      throw redirect({ to: '/forgot-password' })
    }
  },
  component: ChangePasswordPage,
})

function ChangePasswordPage() {
  const { token } = Route.useSearch()
  return <ChangePasswordForm token={token} />
}
