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
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/lib/schemas/change-password'

interface ChangePasswordFormProps extends Omit<
  React.ComponentProps<'div'>,
  'onSubmit'
> {
  onSubmit?: (data: ChangePasswordFormData) => void | Promise<void>
  isLoading?: boolean
}

export function ChangePasswordForm({
  className,
  onSubmit,
  isLoading = false,
  ...props
}: ChangePasswordFormProps) {
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

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
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
              <h1 className="font-display text-2xl font-bold">
                Change password
              </h1>
              <p className="text-muted-foreground text-balance">
                Enter your new password below
              </p>
            </div>
            <Field>
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
            </Field>
            <Field>
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
      </CardContent>
    </Card>
  )
}
