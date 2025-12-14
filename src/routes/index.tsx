import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

const getSession = createServerFn().handler(async () => {
  const request = getRequest()
  const { auth } = await import('@/lib/auth')

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  return session
})

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession()

    if (!session) {
      throw redirect({ to: '/login' })
    }

    const user = session.user as typeof session.user & {
      userVerified?: boolean
    }

    throw redirect({
      to: user.userVerified ? '/dashboard-01' : '/verification-status',
    })
  },
})
