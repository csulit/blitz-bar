import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import type { ChangePasswordFormData } from '@/lib/schemas/change-password'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { changePasswordSchema } from '@/lib/schemas/change-password'
import { authClient } from '@/lib/auth-client'

interface ChangePasswordFormProps extends React.ComponentProps<'div'> {
  token: string
}

export function ChangePasswordForm({
  className,
  token,
  ...props
}: ChangePasswordFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  useEffect(() => {
    const firstError = Object.keys(errors)[0] as
      | keyof ChangePasswordFormData
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

  useEffect(() => {
    if (!isSuccess) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate({ to: '/login' })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isSuccess, navigate])

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true)

    const { error } = await authClient.resetPassword({
      newPassword: data.newPassword,
      token,
    })

    setIsLoading(false)

    if (error) {
      setError(error.message ?? 'Failed to update password')
    } else {
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
              <Check className="h-8 w-8 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-xl font-display">Password updated</h2>
              <p className="text-sm text-muted-foreground max-w-64">
                Your password has been successfully updated. Redirecting to
                login in {countdown} seconds...
              </p>
            </div>
            <Link
              to="/login"
              className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Go to login now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-display text-2xl font-bold">
                  Change password
                </h1>
                <p className="text-muted-foreground text-balance">
                  Enter your new password below
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
              <Field data-invalid={!!errors.newPassword}>
                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className={cn(
                    errors.newPassword &&
                      'border-red-400/60 ring-2 ring-red-400/20 focus-visible:ring-red-400/30',
                  )}
                  {...register('newPassword')}
                />
                <FieldError>{errors.newPassword?.message}</FieldError>
              </Field>
              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className={cn(
                    errors.confirmPassword &&
                      'border-red-400/60 ring-2 ring-red-400/20 focus-visible:ring-red-400/30',
                  )}
                  {...register('confirmPassword')}
                />
                <FieldError>{errors.confirmPassword?.message}</FieldError>
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update password'}
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
