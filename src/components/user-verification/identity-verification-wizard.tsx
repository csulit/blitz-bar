import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { steps } from './constants'
import { HorizontalStepper } from './horizontal-stepper'
import { DocumentTypeSelector } from './document-type-selector'
import { FileUploadZone } from './file-upload-zone'
import { PersonalInfoForm } from './personal-info-form'
import { EducationForm } from './education-form'
import type { VerificationStep, DocumentType, UploadedFile } from './types'
import type { PersonalInfoFormData } from '@/lib/schemas/personal-info'
import type { EducationFormData } from '@/lib/schemas/education'

interface IdentityVerificationWizardProps extends React.ComponentProps<'div'> {}

export function IdentityVerificationWizard({
  className,
  ...props
}: IdentityVerificationWizardProps) {
  const [currentStep, setCurrentStep] =
    useState<VerificationStep>('personal_info')
  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false)
  const [personalInfoData, setPersonalInfoData] = useState<
    Partial<PersonalInfoFormData>
  >({})
  const [isEducationValid, setIsEducationValid] = useState(false)
  const [educationData, setEducationData] = useState<
    Partial<EducationFormData>
  >({})
  const [selectedDocType, setSelectedDocType] =
    useState<DocumentType>('identity_card')
  const [frontFile, setFrontFile] = useState<UploadedFile | null>(null)
  const [backFile, setBackFile] = useState<UploadedFile | null>(null)

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }

  const handleContinue = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const simulateUpload = (
    file: File,
    setter: React.Dispatch<React.SetStateAction<UploadedFile | null>>,
  ) => {
    setter({
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
    })

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setter((prev) =>
          prev ? { ...prev, progress: 100, status: 'success' } : null,
        )
      } else {
        setter((prev) =>
          prev ? { ...prev, progress: Math.round(progress) } : null,
        )
      }
    }, 200)
  }

  const handlePersonalInfoValidChange = useCallback((isValid: boolean) => {
    setIsPersonalInfoValid(isValid)
  }, [])

  const handlePersonalInfoDataChange = useCallback(
    (data: Partial<PersonalInfoFormData>) => {
      setPersonalInfoData(data)
    },
    [],
  )

  const handleEducationValidChange = useCallback((isValid: boolean) => {
    setIsEducationValid(isValid)
  }, [])

  const handleEducationDataChange = useCallback(
    (data: Partial<EducationFormData>) => {
      setEducationData(data)
    },
    [],
  )

  const canContinue = (() => {
    switch (currentStep) {
      case 'personal_info':
        return isPersonalInfoValid
      case 'education':
        return isEducationValid
      case 'setup':
        return frontFile?.status === 'success' && backFile?.status === 'success'
      case 'verification':
      case 'review':
        return true
      default:
        return false
    }
  })()

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
        <HorizontalStepper currentStepIndex={currentStepIndex} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <div className="flex-1 p-6 md:p-8">
          {/* Step 1: Personal Info */}
          {currentStep === 'personal_info' && (
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
              <PersonalInfoForm
                defaultValues={personalInfoData}
                onValidChange={handlePersonalInfoValidChange}
                onDataChange={handlePersonalInfoDataChange}
              />
            </>
          )}

          {/* Step 2: Education */}
          {currentStep === 'education' && (
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
              <EducationForm
                defaultValues={educationData}
                onValidChange={handleEducationValidChange}
                onDataChange={handleEducationDataChange}
              />
            </>
          )}

          {/* Step 3: Upload */}
          {currentStep === 'setup' && (
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

              {/* Document Type Selection */}
              <div className="mb-8">
                <label className="mb-3 block text-sm font-medium text-foreground">
                  Verify my identity using
                </label>
                <DocumentTypeSelector
                  selected={selectedDocType}
                  onSelect={setSelectedDocType}
                />
              </div>

              {/* File Upload Zones */}
              <div className="space-y-6">
                <FileUploadZone
                  label="Front side"
                  file={frontFile}
                  onFileSelect={(file) => simulateUpload(file, setFrontFile)}
                  onRemove={() => setFrontFile(null)}
                />

                <FileUploadZone
                  label="Back side"
                  file={backFile}
                  onFileSelect={(file) => simulateUpload(file, setBackFile)}
                  onRemove={() => setBackFile(null)}
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

          {/* Step 4: Verification */}
          {currentStep === 'verification' && (
            <>
              <div className="mb-8">
                <h1 className="font-display text-2xl md:text-3xl text-foreground">
                  Verification in Progress
                </h1>
                <p className="mt-2 text-muted-foreground text-balance">
                  We're verifying your documents. This usually takes a few
                  moments.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
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
                </div>
                <p className="text-muted-foreground text-center">
                  Please wait while we verify your identity...
                </p>
              </div>
            </>
          )}

          {/* Step 5: Review */}
          {currentStep === 'review' && (
            <>
              <div className="mb-8">
                <h1 className="font-display text-2xl md:text-3xl text-foreground">
                  Review & Submit
                </h1>
                <p className="mt-2 text-muted-foreground text-balance">
                  Please review your information before submitting.
                </p>
              </div>

              <div className="space-y-6">
                {/* Summary Card */}
                <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                      <svg
                        className="h-5 w-5 text-green-600 dark:text-green-500"
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
                        {selectedDocType.replace('_', ' ')} - Front & Back
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
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
        <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-4 md:px-8">
          <Button variant="ghost" className="text-muted-foreground">
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirstStep}
            >
              Back
            </Button>
            <Button
              disabled={!canContinue}
              onClick={handleContinue}
              className="min-w-30"
            >
              {isLastStep ? 'Submit' : 'Continue'}
              {!isLastStep && (
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
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
