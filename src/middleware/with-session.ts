import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { auth } from '@/lib/auth'

const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/change-password',
  '/verify-email',
]

export const withSessionMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    const currentPath = new URL(request.url).pathname

    const isPublicPath = PUBLIC_PATHS.some((path) =>
      currentPath.startsWith(path),
    )

    const isVerificationPath = currentPath.startsWith('/verification')

    // No session - redirect to login unless on public pages
    if (!session) {
      if (isPublicPath) {
        return await next()
      }
      throw redirect({ to: '/login' })
    }

    const user = session.user as typeof session.user & {
      userVerified?: boolean
    }

    // Logged in users shouldn't be on public auth pages
    if (isPublicPath) {
      throw redirect({
        to: user.userVerified ? '/dashboard-01' : '/verification-status',
      })
    }

    // Verified users shouldn't be on verification pages
    if (user.userVerified && isVerificationPath) {
      throw redirect({ to: '/dashboard-01' })
    }

    // Unverified users should only be on verification pages
    if (!user.userVerified && !isVerificationPath) {
      throw redirect({ to: '/verification-status' })
    }

    return await next()
  },
)
