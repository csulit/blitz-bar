import { cn } from '@/lib/utils'
import { steps } from './constants'

interface HorizontalStepperProps {
  currentStepIndex: number
}

export function HorizontalStepper({
  currentStepIndex,
}: HorizontalStepperProps) {
  return (
    <div className="flex items-center justify-center">
      <nav className="flex items-center">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex
          const isPast = index < currentStepIndex || step.completed

          return (
            <div key={step.id} className="flex items-center">
              {/* Step */}
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    'relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isPast && !isActive && 'border-primary bg-primary',
                    isActive &&
                      'border-primary bg-primary shadow-lg shadow-primary/30',
                    !isPast &&
                      !isActive &&
                      'border-muted-foreground/30 bg-background',
                  )}
                >
                  {isPast && !isActive ? (
                    <svg
                      className="h-4 w-4 text-primary-foreground animate-in zoom-in-50 duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : isActive ? (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground animate-in zoom-in-50" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'mt-2 text-xs font-medium transition-colors duration-300 whitespace-nowrap',
                    isActive && 'text-foreground',
                    isPast && !isActive && 'text-primary',
                    !isPast && !isActive && 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-3 h-0.5 w-12 transition-colors duration-500 -mt-5',
                    isPast ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
