import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface VerificationStatusCardProps extends React.ComponentProps<'div'> {}

const verificationSteps = [
  {
    id: 'email',
    title: 'Email Verification',
    description: 'Confirm your email address',
    status: 'completed' as const,
  },
  {
    id: 'profile',
    title: 'Profile Information',
    description: 'Complete your profile details',
    status: 'completed' as const,
  },
  {
    id: 'documents',
    title: 'Document Submission',
    description: 'Submit required identification documents',
    status: 'pending' as const,
  },
  {
    id: 'review',
    title: 'Admin Review',
    description: 'Awaiting administrator verification',
    status: 'waiting' as const,
  },
]

function StatusIcon({
  status,
}: {
  status: 'completed' | 'pending' | 'waiting'
}) {
  if (status === 'completed') {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10">
        <svg
          className="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
        <svg
          className="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background">
      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
    </div>
  )
}

function StatusText({
  status,
}: {
  status: 'completed' | 'pending' | 'waiting'
}) {
  if (status === 'completed') {
    return <span className="text-xs text-muted-foreground">Completed</span>
  }

  if (status === 'pending') {
    return (
      <span className="text-xs font-medium text-primary">Action needed</span>
    )
  }

  return <span className="text-xs text-muted-foreground">Waiting</span>
}

export function VerificationStatusCard({
  className,
  ...props
}: VerificationStatusCardProps) {
  const completedCount = verificationSteps.filter(
    (step) => step.status === 'completed',
  ).length
  const totalSteps = verificationSteps.length
  const progressPercentage = (completedCount / totalSteps) * 100

  return (
    <Card
      className={cn('w-full max-w-3xl overflow-hidden p-0', className)}
      {...props}
    >
      <CardContent className="grid p-0 md:grid-cols-2">
        {/* Left Panel - Content */}
        <div className="p-6 md:p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="font-display text-2xl mb-2">
              Verification Pending
            </CardTitle>
            <CardDescription className="text-balance">
              Your account is being verified. Complete the remaining steps to
              gain full access.
            </CardDescription>
          </CardHeader>

          {/* Progress Indicator */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium tabular-nums">
                  {completedCount}/{totalSteps} completed
                </span>
              </div>
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Verification Steps */}
            <div className="space-y-3">
              {verificationSteps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-4 transition-all',
                    step.status === 'pending' &&
                      'border-primary/30 bg-primary/5 shadow-sm',
                    step.status === 'completed' && 'border-border',
                    step.status === 'waiting' && 'border-border/50',
                  )}
                >
                  <div className="pt-0.5">
                    <StatusIcon status={step.status} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'font-medium text-sm',
                          step.status === 'waiting' && 'text-muted-foreground',
                        )}
                      >
                        {step.title}
                      </span>
                      <StatusText status={step.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="rounded-lg border border-border/50 p-4 bg-muted/30">
              <div className="flex gap-3">
                <svg
                  className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm space-y-1">
                  <p className="font-medium">What happens next?</p>
                  <p className="text-muted-foreground">
                    Once all steps are complete, an administrator will review
                    your account. You&apos;ll receive an email notification when
                    your account is verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Decorative */}
        <div className="bg-muted relative hidden md:block overflow-hidden">
          {/* Layered Shield Motif - Represents layers of security/trust */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10" />

            {/* Concentric circles representing verification layers */}
            <div className="relative">
              {/* Outer circle - subtle pulse animation */}
              <div className="absolute inset-0 -m-32 rounded-full border border-primary/10 animate-pulse" />
              <div className="absolute inset-0 -m-24 rounded-full border border-primary/15" />
              <div className="absolute inset-0 -m-16 rounded-full border border-primary/20" />

              {/* Central shield icon */}
              <div className="relative flex items-center justify-center w-32 h-32">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 backdrop-blur-sm" />
                <svg
                  className="relative w-16 h-16 text-primary/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>

              {/* Progress indicator dots around the circle */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2">
                <div className="w-2 h-2 rounded-full bg-primary/30" />
              </div>
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">
                <div className="w-2 h-2 rounded-full bg-primary/20" />
              </div>
              <div className="absolute top-1/2 -left-20 -translate-y-1/2">
                <div className="w-2 h-2 rounded-full bg-primary/25" />
              </div>
              <div className="absolute top-1/2 -right-20 -translate-y-1/2">
                <div className="w-2 h-2 rounded-full bg-primary/15" />
              </div>
            </div>

            {/* Subtle geometric pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px)`,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
