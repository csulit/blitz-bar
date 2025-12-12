import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
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

interface ForgotPasswordFormProps extends Omit<
  React.ComponentProps<'div'>,
  'onSubmit'
> {
  onSubmit?: (data: ForgotPasswordFormData) => void | Promise<void>
  isLoading?: boolean
}

export function ForgotPasswordForm({
  className,
  onSubmit,
  isLoading = false,
  ...props
}: ForgotPasswordFormProps) {
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

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    await onSubmit?.(data)
  }

  return (
    <Card
      className={cn('w-full max-w-sm overflow-hidden p-0', className)}
      {...props}
    >
      <CardContent className="p-6 md:p-8">
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
      </CardContent>
    </Card>
  )
}
