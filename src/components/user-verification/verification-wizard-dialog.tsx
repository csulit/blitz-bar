'use client'

import { useState } from 'react'
import { HorizontalStepper } from './horizontal-stepper'
import { DocumentTypeSelector } from './document-type-selector'
import { FileUploadZone } from './file-upload-zone'
import { PersonalInfoForm } from './personal-info-form'
import { EducationForm } from './education-form'
import { JobHistoryForm } from './job-history-form'
import { useWizardStateLocal } from './hooks/use-wizard-state'
import { useReviewData } from './hooks/queries/use-review-data'
import { useSubmitIdentityDocument } from './hooks/mutations/use-submit-identity-document'
import { requiresEducationAndJobHistory } from './constants'
import type { UserType } from '@/lib/schemas/signup'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

interface VerificationWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitSuccess?: () => void
  userType: UserType
}

export function VerificationWizardDialog({
  open,
  onOpenChange,
  onSubmitSuccess,
  userType,
}: VerificationWizardDialogProps) {
  const isMobile = useIsMobile()

  // Only render the wizard content when open to reset state on close
  if (!open) {
    return null
  }

  return isMobile ? (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[96vh]">
        <div className="overflow-y-auto">
          <WizardContent
            onClose={() => onOpenChange(false)}
            onSubmitSuccess={onSubmitSuccess}
            userType={userType}
          />
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-4xl sm:max-w-4xl overflow-y-auto p-0"
      >
        <WizardContent
          onClose={() => onOpenChange(false)}
          onSubmitSuccess={onSubmitSuccess}
          userType={userType}
        />
      </SheetContent>
    </Sheet>
  )
}

interface WizardContentProps {
  onClose: () => void
  onSubmitSuccess?: () => void
  userType: UserType
}

function WizardContent({
  onClose,
  onSubmitSuccess,
  userType,
}: WizardContentProps) {
  const {
    state,
    actions,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    canContinue,
    applicableSteps,
    isLoadingPersonalInfo,
    isLoadingEducation,
    isLoadingIdentityDocument,
    isLoadingJobHistory,
    savedPersonalInfo,
    savedEducation,
    savedJobHistory,
    handlePersonalInfoValidChange,
    handlePersonalInfoDataChange,
    handleEducationValidChange,
    handleEducationDataChange,
    handleJobHistoryValidChange,
    handleJobHistoryDataChange,
  } = useWizardStateLocal('personal_info', userType)

  const { mutateAsync: submitDocument, isPending: isSubmitting } =
    useSubmitIdentityDocument()

  const reviewData = useReviewData(userType)

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleSubmit = async () => {
    if (!state.frontFile?.url) {
      console.error('Front file URL is required')
      return
    }

    try {
      await submitDocument({
        documentType: state.selectedDocType,
        frontImageUrl: state.frontFile.url,
        backImageUrl: state.backFile?.url,
      })
      onSubmitSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to submit identity document:', error)
    }
  }

  const handleContinue = () => {
    if (isLastStep) {
      setShowConfirmDialog(true)
    } else {
      actions.goNext()
    }
  }

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false)
    await handleSubmit()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header with stepper */}
      <div className="border-b bg-muted/20 px-6 py-6">
        <HorizontalStepper
          currentStepIndex={currentStepIndex}
          steps={applicableSteps}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        {/* Step 1: Personal Info */}
        {state.currentStep === 'personal_info' && (
          <>
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl text-foreground">
                Personal Information
              </h1>
              <p className="mt-2 text-muted-foreground text-balance">
                Please provide your personal details. This information helps us
                verify your identity.
              </p>
            </div>

            {isLoadingPersonalInfo ? (
              <LoadingSpinner message="Loading your information..." />
            ) : (
              <PersonalInfoForm
                key={savedPersonalInfo ? 'loaded' : 'empty'}
                defaultValues={savedPersonalInfo ?? state.personalInfo.data}
                onValidChange={handlePersonalInfoValidChange}
                onDataChange={handlePersonalInfoDataChange}
              />
            )}
          </>
        )}

        {/* Step 2: Education */}
        {state.currentStep === 'education' && (
          <>
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl text-foreground">
                Educational Background
              </h1>
              <p className="mt-2 text-muted-foreground text-balance">
                Please provide your highest educational attainment. This helps
                us understand your background.
              </p>
            </div>

            {isLoadingEducation ? (
              <LoadingSpinner message="Loading your information..." />
            ) : (
              <EducationForm
                key={savedEducation ? 'loaded' : 'empty'}
                defaultValues={savedEducation ?? state.education.data}
                onValidChange={handleEducationValidChange}
                onDataChange={handleEducationDataChange}
              />
            )}
          </>
        )}

        {/* Step 3: Upload */}
        {state.currentStep === 'upload' && (
          <>
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl text-foreground">
                Verify your identity
              </h1>
              <p className="mt-2 text-muted-foreground text-balance">
                Select your document type and upload clear photos of both sides.
                This helps us verify your identity securely.
              </p>
            </div>

            {isLoadingIdentityDocument ? (
              <LoadingSpinner message="Loading your documents..." />
            ) : (
              <>
                <div className="mb-8">
                  <label className="mb-3 block text-sm font-medium text-foreground">
                    Verify my identity using
                  </label>
                  <DocumentTypeSelector
                    selected={state.selectedDocType}
                    onSelect={actions.setDocType}
                  />
                </div>

                <div className="space-y-6">
                  <FileUploadZone
                    label="Front side"
                    file={state.frontFile}
                    onUploadProgress={actions.setFrontFile}
                    onUploadComplete={actions.setFrontFile}
                    onUploadError={actions.setFrontFile}
                    onRemove={() => actions.setFrontFile(null)}
                  />

                  <FileUploadZone
                    label="Back side"
                    file={state.backFile}
                    onUploadProgress={actions.setBackFile}
                    onUploadComplete={actions.setBackFile}
                    onUploadError={actions.setBackFile}
                    onRemove={() => actions.setBackFile(null)}
                  />
                </div>

                <UploadTipsBox />
              </>
            )}
          </>
        )}

        {/* Step 4: Job History */}
        {state.currentStep === 'job_history' && (
          <>
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl text-foreground">
                Work Experience
              </h1>
              <p className="mt-2 text-muted-foreground text-balance">
                Please provide your recent job history. This helps us understand
                your professional background.
              </p>
            </div>

            {isLoadingJobHistory ? (
              <LoadingSpinner message="Loading your job history..." />
            ) : (
              <JobHistoryForm
                key={savedJobHistory ? 'loaded' : 'empty'}
                defaultValues={savedJobHistory ?? state.jobHistory.data}
                onValidChange={handleJobHistoryValidChange}
                onDataChange={handleJobHistoryDataChange}
              />
            )}
          </>
        )}

        {/* Step 5: Review */}
        {state.currentStep === 'review' && (
          <>
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl text-foreground">
                Review & Submit
              </h1>
              <p className="mt-2 text-muted-foreground text-balance">
                Please review your information before submitting.
              </p>
            </div>

            <div className="space-y-4">
              <ReviewCard
                title="Personal Info"
                isComplete={reviewData.personalInfo.isComplete}
                summary={reviewData.personalInfo.summary}
              />
              {requiresEducationAndJobHistory(userType) && (
                <ReviewCard
                  title="Education Info"
                  isComplete={reviewData.education.isComplete}
                  summary={reviewData.education.summary}
                />
              )}
              <ReviewCard
                title="Documents Uploaded"
                isComplete={reviewData.document.isComplete}
                summary={reviewData.document.summary}
              />
              {requiresEducationAndJobHistory(userType) && (
                <ReviewCard
                  title="Job History"
                  isComplete={reviewData.jobHistory.isComplete}
                  summary={reviewData.jobHistory.summary}
                />
              )}

              <WhatHappensNextBox />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t bg-muted/20 px-6 py-4 md:px-8">
        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={actions.goBack}
            disabled={isFirstStep || isSubmitting}
          >
            Back
          </Button>
          <Button
            disabled={!canContinue || isSubmitting}
            onClick={handleContinue}
            className="min-w-30"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
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
                Submitting...
              </>
            ) : isLastStep ? (
              'Submit'
            ) : (
              <>
                Continue
                <svg
                  className="ml-1 h-4 w-4"
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
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Submit Verification
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your verification? Once submitted,
              you won&apos;t be able to make changes until the review is
              complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
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
                  Submitting...
                </>
              ) : (
                'Yes, Submit'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function LoadingSpinner({ message }: { message: string }) {
  return (
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
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

function ReviewCard({
  title,
  isComplete,
  summary,
}: {
  title: string
  isComplete: boolean
  summary: string
}) {
  return (
    <div className="rounded-xl border border-dashed p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            isComplete ? 'bg-green-500/10' : 'bg-muted',
          )}
        >
          <svg
            className={cn(
              'h-5 w-5',
              isComplete
                ? 'text-green-600 dark:text-green-500'
                : 'text-muted-foreground',
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
      </div>
    </div>
  )
}

function UploadTipsBox() {
  return (
    <div className="mt-8 rounded-xl border border-dashed p-4">
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-4 w-4 text-primary"
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
        <div className="text-sm">
          <p className="font-medium text-foreground">
            Tips for a successful upload
          </p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
              Make sure all four corners are visible
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
              Ensure the document is not expired
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
              Avoid glare and shadows on the document
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function WhatHappensNextBox() {
  return (
    <div className="rounded-xl border border-dashed p-4 mt-6">
      <div className="flex gap-3">
        <svg
          className="h-5 w-5 shrink-0 text-primary mt-0.5"
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
        <div className="text-sm">
          <p className="font-medium text-foreground">What happens next?</p>
          <p className="text-muted-foreground mt-1">
            After submission, our team will review your documents. You&apos;ll
            receive a notification once verification is complete.
          </p>
        </div>
      </div>
    </div>
  )
}
