import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'

const verifyEmailSearchSchema = z.object({
  token: z.string().catch(''),
})

const verifyEmailToken = createServerFn({ method: 'POST' })
  .inputValidator((token: string) => token)
  .handler(async ({ data: token }) => {
    const { auth } = await import('@/lib/auth')

    try {
      const result = await auth.api.verifyEmail({ query: { token } })
      return { success: result?.status ?? true, error: null }
    } catch (e) {
      const error = e as Error
      return { success: false, error: error.message || 'Verification failed' }
    }
  })

export const Route = createFileRoute('/_auth/verify-email')({
  validateSearch: verifyEmailSearchSchema,
  beforeLoad: async ({ search }) => {
    if (!search.token) {
      throw redirect({ to: '/login' })
    }

    const verificationResult = await verifyEmailToken({ data: search.token })
    return { verificationResult }
  },
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const { verificationResult } = Route.useRouteContext()

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl">
          {verificationResult.success
            ? 'Email verified!'
            : 'Verification failed'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {verificationResult.success ? (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-center text-muted-foreground">
              Your email has been verified successfully. You can now sign in to
              your account.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Continue to login</Link>
            </Button>
          </>
        ) : (
          <>
            <XCircle className="h-12 w-12 text-destructive" />
            <p className="text-center text-muted-foreground">
              {verificationResult.error}
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Back to login</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
