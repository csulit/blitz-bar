import type { VerificationStatus } from './hooks/queries/use-verification-status'
import type { ReviewData } from './hooks/queries/use-review-data'
import { cn } from '@/lib/utils'

interface AdminProgressStepperProps {
  status: VerificationStatus | undefined
  reviewData: ReviewData
  className?: string
}

interface AdminStep {
  id: string
  title: string
  description: string
  getStatus: (
    status: VerificationStatus | undefined,
    reviewData: ReviewData,
  ) => 'completed' | 'current' | 'pending'
}

const adminSteps: Array<AdminStep> = [
  {
    id: 'email',
    title: 'Email Verified',
    description: 'Email address confirmed',
    getStatus: () => 'completed', // Always completed (user is logged in)
  },
  {
    id: 'profile',
    title: 'Profile Information',
    description: 'Complete your verification forms',
    getStatus: (status, reviewData) => {
      if (status === 'submitted' || status === 'verified') return 'completed'
      // For info_requested or rejected, show as current since user needs to update
      if (status === 'info_requested' || status === 'rejected') return 'current'
      if (reviewData.isAllComplete) return 'completed'
      return 'current'
    },
  },
  {
    id: 'documents',
    title: 'Document Submission',
    description: 'Submit for admin review',
    getStatus: (status, reviewData) => {
      if (status === 'submitted' || status === 'verified') return 'completed'
      // For info_requested or rejected, show as pending (waiting for user to resubmit)
      if (status === 'info_requested' || status === 'rejected') {
        return reviewData.isAllComplete ? 'current' : 'pending'
      }
      return reviewData.isAllComplete ? 'current' : 'pending'
    },
  },
  {
    id: 'review',
    title: 'Admin Review',
    description: 'Awaiting administrator verification',
    getStatus: (status) => {
      if (status === 'verified') return 'completed'
      if (status === 'submitted') return 'current'
      // For info_requested or rejected, admin has already reviewed - waiting for user action
      return 'pending'
    },
  },
]

function StepIcon({
  status,
  stepNumber,
}: {
  status: 'completed' | 'current' | 'pending'
  stepNumber: number
}) {
  if (status === 'completed') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <svg
          className="h-4 w-4"
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

  if (status === 'current') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-muted/50">
      <span className="text-xs font-medium text-muted-foreground">
        {stepNumber}
      </span>
    </div>
  )
}

export function AdminProgressStepper({
  status,
  reviewData,
  className,
}: AdminProgressStepperProps) {
  const completedCount = adminSteps.filter(
    (step) => step.getStatus(status, reviewData) === 'completed',
  ).length
  const totalSteps = adminSteps.length
  const progressPercentage = (completedCount / totalSteps) * 100

  return (
    <div className={cn('w-full', className)}>
      {/* Progress bar */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Verification Progress</span>
          <span className="font-medium tabular-nums">
            {completedCount}/{totalSteps} completed
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connector line */}
        <div className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-border" />

        <div className="relative space-y-4">
          {adminSteps.map((step, index) => {
            const stepStatus = step.getStatus(status, reviewData)
            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Icon */}
                <div className="relative z-10 bg-background">
                  <StepIcon status={stepStatus} stepNumber={index + 1} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <p
                    className={cn(
                      'font-medium text-sm',
                      stepStatus === 'pending' && 'text-muted-foreground',
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Status badge */}
                <div className="shrink-0">
                  {stepStatus === 'completed' && (
                    <span className="text-xs text-muted-foreground">
                      Completed
                    </span>
                  )}
                  {stepStatus === 'current' && (
                    <span className="text-xs font-medium text-primary">
                      In Progress
                    </span>
                  )}
                  {stepStatus === 'pending' && (
                    <span className="text-xs text-muted-foreground/60">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
