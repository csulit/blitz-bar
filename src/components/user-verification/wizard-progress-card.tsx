import type { ReviewData } from './hooks/queries/use-review-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface WizardProgressCardProps {
  reviewData: ReviewData
  onContinue: () => void
  className?: string
}

const wizardSteps = [
  { id: 'personal', label: 'Personal Info', key: 'personalInfo' as const },
  { id: 'education', label: 'Education', key: 'education' as const },
  { id: 'documents', label: 'Documents', key: 'document' as const },
  { id: 'job', label: 'Job History', key: 'jobHistory' as const },
]

export function WizardProgressCard({
  reviewData,
  onContinue,
  className,
}: WizardProgressCardProps) {
  const completedSteps = wizardSteps.filter(
    (step) => reviewData[step.key].isComplete,
  ).length
  const totalSteps = wizardSteps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left side - Content */}
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl md:text-2xl text-foreground">
                Complete Your Verification
              </h2>
              <p className="mt-1 text-muted-foreground text-balance">
                Fill out your information to get verified and access all
                features.
              </p>
            </div>

            {/* Mini progress indicator */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium">
                  {completedSteps} of {totalSteps} sections complete
                </span>
              </div>

              {/* Step indicators */}
              <div className="flex flex-wrap gap-2">
                {wizardSteps.map((step) => {
                  const isComplete = reviewData[step.key].isComplete
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                        isComplete
                          ? 'bg-green-500/10 text-green-600 dark:text-green-500'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {isComplete ? (
                        <svg
                          className="h-3 w-3"
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
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                      )}
                      {step.label}
                    </div>
                  )
                })}
              </div>

              {/* Progress bar */}
              <div className="relative h-1 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right side - Action */}
          <div className="shrink-0">
            <Button size="lg" onClick={onContinue} className="w-full md:w-auto">
              {completedSteps === 0 ? 'Start Verification' : 'Continue'}
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
