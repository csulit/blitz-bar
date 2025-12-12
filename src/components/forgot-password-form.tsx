import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/lib/schemas/forgot-password'
import { authClient } from '@/lib/auth-client'

interface ForgotPasswordFormProps extends React.ComponentProps<'div'> {}

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string>('')

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  useEffect(() => {
    const firstError = Object.keys(errors)[0] as
      | keyof ForgotPasswordFormData
      | undefined
    if (firstError) {
      setFocus(firstError)
    }
  }, [errors, setFocus])

  useEffect(() => {
    if (!error) return

    const timer = setTimeout(() => {
      setError(null)
    }, 5000)

    return () => clearTimeout(timer)
  }, [error])

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)

    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: '/reset-password',
    })

    setIsLoading(false)

    if (error) {
      setError(error.message ?? 'Failed to send reset link')
    } else {
      setSubmittedEmail(data.email)
      setIsSuccess(true)
    }
  }

  return (
    <Card
      className={cn('w-full max-w-sm overflow-hidden p-0', className)}
      {...props}
    >
      <CardContent className="p-6 md:p-8">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <Mail className="h-8 w-8 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-xl font-display">Check your email</h2>
              <p className="text-sm text-muted-foreground max-w-64">
                We sent a password reset link to{' '}
                <span className="font-medium text-foreground">
                  {submittedEmail}
                </span>
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSuccess(false)
                  setSubmittedEmail('')
                }}
              >
                Try another email
              </Button>
              <Link
                to="/login"
                className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold font-display">
                  Forgot password?
                </h1>
                <p className="text-muted-foreground text-balance">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>
              <div
                className={cn(
                  'grid transition-all duration-200',
                  error
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="overflow-hidden">
                  <div className="rounded-md bg-red-50 dark:bg-red-950/50 p-3 text-sm text-red-600 dark:text-red-400">
                    {error || 'Placeholder'}
                  </div>
                </div>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className={cn(
                    errors.email &&
                      'border-red-400/60 ring-2 ring-red-400/20 focus-visible:ring-red-400/30',
                  )}
                  {...register('email')}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Remember your password?{' '}
                <Link to="/login" className="underline underline-offset-2">
                  Back to login
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
