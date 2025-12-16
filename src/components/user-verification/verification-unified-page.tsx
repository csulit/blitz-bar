'use client'

import { useState } from 'react'
import { useVerificationStatus } from './hooks/queries/use-verification-status'
import { useReviewData } from './hooks/queries/use-review-data'
import { AdminProgressStepper } from './admin-progress-stepper'
import { WizardProgressCard } from './wizard-progress-card'
import { VerificationWizardDialog } from './verification-wizard-dialog'
import { VerificationSubmittedView } from './verification-submitted-view'
import { Card, CardContent } from '@/components/ui/card'

export function VerificationUnifiedPage() {
  const {
    data: verificationStatus,
    isLoading,
    refetch,
  } = useVerificationStatus()
  const reviewData = useReviewData()
  const [wizardOpen, setWizardOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="h-8 w-8 text-primary animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-sm text-muted-foreground">
                  Loading verification status...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const status = verificationStatus?.status ?? 'draft'

  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* Admin Progress Stepper - Always visible at top */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <AdminProgressStepper status={status} reviewData={reviewData} />
        </CardContent>
      </Card>

      {/* Content based on status */}
      {status === 'draft' && (
        <>
          <WizardProgressCard
            reviewData={reviewData}
            onContinue={() => setWizardOpen(true)}
          />
          <WhatHappensNextCard />
        </>
      )}

      {status === 'submitted' && verificationStatus && (
        <VerificationSubmittedView verificationStatus={verificationStatus} />
      )}

      {status === 'verified' && <VerificationVerifiedView />}

      {status === 'rejected' && verificationStatus && (
        <>
          <RejectionNoticeCard reason={verificationStatus.rejectionReason} />
          <WizardProgressCard
            reviewData={reviewData}
            onContinue={() => setWizardOpen(true)}
          />
        </>
      )}

      {/* Wizard Dialog */}
      <VerificationWizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onSubmitSuccess={() => {
          refetch()
        }}
      />
    </div>
  )
}

function WhatHappensNextCard() {
  return (
    <Card className="border-dashed">
      <CardContent className="p-6">
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
            <p className="font-medium text-foreground">What happens next?</p>
            <p className="text-muted-foreground">
              Once you complete all verification steps and submit, our team will
              review your documents. You&apos;ll receive an email notification
              when your account is verified.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function VerificationVerifiedView() {
  return (
    <Card className="border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-950/40">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-foreground mb-2">
            Verification Complete
          </h2>
          <p className="text-muted-foreground max-w-md">
            Congratulations! Your account has been verified. You now have full
            access to all features.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function RejectionNoticeCard({ reason }: { reason: string | null }) {
  return (
    <Card className="border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-950/40">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <svg
              className="h-5 w-5 text-red-600 dark:text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-lg text-foreground">
              Verification Rejected
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {reason ??
                'Your verification was rejected. Please review your information and submit again.'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please update your information and resubmit for review.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
