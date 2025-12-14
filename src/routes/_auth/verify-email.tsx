import { useState } from 'react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { CheckCircle2, XCircle, Mail } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

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
  const [email, setEmail] = useState('')
  const [resendState, setResendState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [resendError, setResendError] = useState<string | null>(null)

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    setResendState('loading')
    setResendError(null)

    const { error } = await authClient.sendVerificationEmail({
      email: email.trim(),
      callbackURL: '/login',
    })

    if (error) {
      setResendState('error')
      setResendError(error.message ?? 'Failed to send verification email')
    } else {
      setResendState('success')
    }
  }

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

            {resendState === 'success' ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <Mail className="h-10 w-10 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">
                  Verification email sent! Check your inbox.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Back to login</Link>
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleResendVerification}
                className="flex flex-col gap-4 w-full"
              >
                <Field>
                  <FieldLabel htmlFor="resend-email">
                    Resend verification email
                  </FieldLabel>
                  <Input
                    id="resend-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={resendState === 'loading'}
                  />
                </Field>
                {resendState === 'error' && resendError && (
                  <p className="text-sm text-destructive text-center">
                    {resendError}
                  </p>
                )}
                <Button type="submit" disabled={resendState === 'loading'}>
                  {resendState === 'loading' ? 'Sending...' : 'Resend email'}
                </Button>
                <Button asChild variant="outline">
                  <Link to="/login">Back to login</Link>
                </Button>
              </form>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
