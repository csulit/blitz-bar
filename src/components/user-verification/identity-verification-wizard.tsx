import { useEffect, useState } from 'react'
import { HorizontalStepper } from './horizontal-stepper'
import { DocumentTypeSelector } from './document-type-selector'
import { FileUploadZone } from './file-upload-zone'
import { PersonalInfoForm } from './personal-info-form'
import { EducationForm } from './education-form'
import { JobHistoryForm } from './job-history-form'
import { useWizardState } from './hooks/use-wizard-state'
import { useReviewData } from './hooks/queries/use-review-data'
import {
  useVerificationStatus,
  type VerificationStatusData,
} from './hooks/queries/use-verification-status'
import { useSubmitIdentityDocument } from './hooks/mutations/use-submit-identity-document'
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
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface IdentityVerificationWizardProps extends React.ComponentProps<'div'> {
  /** Initial verification status from server-side beforeLoad (avoids client fetch flicker) */
  initialStatus?: VerificationStatusData
}

export function IdentityVerificationWizard({
  className,
  initialStatus,
  ...props
}: IdentityVerificationWizardProps) {
  const {
    state,
    actions,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    canContinue,
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
  } = useWizardState()

  const { mutateAsync: submitDocument, isPending: isSubmitting } =
    useSubmitIdentityDocument()

  const reviewData = useReviewData()
  const { data: verificationStatus } = useVerificationStatus({
    initialData: initialStatus,
  })

  // Check if verification is already submitted or verified (cannot edit)
  const isVerificationLocked =
    verificationStatus?.status === 'submitted' ||
    verificationStatus?.status === 'verified'

  // Force navigation to review step when verification is locked
  useEffect(() => {
    if (isVerificationLocked && state.currentStep !== 'review') {
      actions.setStep('review')
    }
  }, [isVerificationLocked, state.currentStep, actions])

  // Confirmation dialog state
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
      // TODO: Navigate to success page or show success message
      console.log('Identity document submitted successfully')
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
    <div
      className={cn(
        'w-full max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-xl shadow-black/5',
        className,
      )}
      {...props}
    >
      {/* Horizontal Stepper Header */}
      <div className="border-b bg-muted/20 px-6 py-6">
        <HorizontalStepper
          currentStepIndex={currentStepIndex}
          allCompleted={isVerificationLocked}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <div className="flex-1 p-6 md:p-8">
          {/* Step 1: Personal Info */}
          {state.currentStep === 'personal_info' && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="font-display text-2xl md:text-3xl text-foreground">
                  Personal Information
                </h1>
                <p className="mt-2 text-muted-foreground text-balance">
                  Please provide your personal details. This information helps
                  us verify your identity.
                </p>
              </div>

              {/* Personal Info Form */}
              {isLoadingPersonalInfo ? (
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
                      Loading your information...
                    </p>
                  </div>
                </div>
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
              {/* Header */}
              <div className="mb-8">
                <h1 className="font-display text-2xl md:text-3xl text-foreground">
                  Educational Background
                </h1>
                <p className="mt-2 text-muted-foreground text-balance">
                  Please provide your highest educational attainment. This helps
                  us understand your background.
                </p>
              </div>

              {/* Education Form */}
              {isLoadingEducation ? (
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
                      Loading your information...
                    </p>
                  </div>
                </div>
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
              {/* Header */}
              <div className="mb-8">
                <h1 className="font-display text-2xl md:text-3xl text-foreground">
                  Verify your identity
                </h1>
                <p className="mt-2 text-muted-foreground text-balance">
                  Select your document type and upload clear photos of both
                  sides. This helps us verify your identity securely.
                </p>
              </div>

              {isLoadingIdentityDocument ? (
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
                      Loading your documents...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Document Type Selection */}
                  <div className="mb-8">
                    <label className="mb-3 block text-sm font-medium text-foreground">
                      Verify my identity using
                    </label>
                    <DocumentTypeSelector
                      selected={state.selectedDocType}
                      onSelect={actions.setDocType}
                    />
                  </div>

                  {/* File Upload Zones */}
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

                  {/* Info box */}
                  <div className="mt-8 rounded-xl border bg-muted/30 p-4">
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
                </>
              )}
            </>
          )}

          {/* Step 4: Job History */}
          {state.currentStep === 'job_history' && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="font-display text-2xl md:text-3xl text-foreground">
                  Work Experience
                </h1>
                <p className="mt-2 text-muted-foreground text-balance">
                  Please provide your recent job history. This helps us
                  understand your professional background.
                </p>
              </div>

              {/* Job History Form */}
              {isLoadingJobHistory ? (
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
                      Loading your job history...
                    </p>
                  </div>
                </div>
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
                {/* Personal Info Card */}
                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        reviewData.personalInfo.isComplete
                          ? 'bg-green-500/10'
                          : 'bg-muted',
                      )}
                    >
                      <svg
                        className={cn(
                          'h-5 w-5',
                          reviewData.personalInfo.isComplete
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
                      <p className="font-medium text-foreground">
                        Personal Info
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reviewData.personalInfo.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Education Card */}
                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        reviewData.education.isComplete
                          ? 'bg-green-500/10'
                          : 'bg-muted',
                      )}
                    >
                      <svg
                        className={cn(
                          'h-5 w-5',
                          reviewData.education.isComplete
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
                      <p className="font-medium text-foreground">
                        Education Info
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reviewData.education.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents Card */}
                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        reviewData.document.isComplete
                          ? 'bg-green-500/10'
                          : 'bg-muted',
                      )}
                    >
                      <svg
                        className={cn(
                          'h-5 w-5',
                          reviewData.document.isComplete
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
                      <p className="font-medium text-foreground">
                        Documents Uploaded
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reviewData.document.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job History Card */}
                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        reviewData.jobHistory.isComplete
                          ? 'bg-green-500/10'
                          : 'bg-muted',
                      )}
                    >
                      <svg
                        className={cn(
                          'h-5 w-5',
                          reviewData.jobHistory.isComplete
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
                      <p className="font-medium text-foreground">Job History</p>
                      <p className="text-sm text-muted-foreground">
                        {reviewData.jobHistory.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* What happens next info box */}
                <div className="rounded-xl border bg-muted/30 p-4 mt-6">
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
                      <p className="font-medium text-foreground">
                        What happens next?
                      </p>
                      <p className="text-muted-foreground mt-1">
                        After submission, our team will review your documents.
                        You'll receive a notification once verification is
                        complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t bg-muted/20 px-6 py-4 md:px-8">
          {isVerificationLocked ? (
            <div className="flex items-center gap-2 text-sm">
              {verificationStatus?.status === 'submitted' ? (
                <>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10">
                    <svg
                      className="h-4 w-4 text-amber-600 dark:text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    Verification pending review
                  </span>
                </>
              ) : (
                <>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                    <svg
                      className="h-4 w-4 text-green-600 dark:text-green-500"
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
                  <span className="text-muted-foreground">
                    Verification complete
                  </span>
                </>
              )}
            </div>
          ) : (
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
          )}
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
              you won't be able to make changes until the review is complete.
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
