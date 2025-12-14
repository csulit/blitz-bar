import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type VerificationStep = 'delivery' | 'setup' | 'verification' | 'review'
type DocumentType = 'identity_card' | 'driver_license' | 'passport'
type UploadStatus = 'uploading' | 'success' | 'error'

interface UploadedFile {
  name: string
  size: number
  progress: number
  status: UploadStatus
}

interface IdentityVerificationWizardProps
  extends React.ComponentProps<'div'> {}

const steps: { id: VerificationStep; label: string; completed: boolean }[] = [
  { id: 'delivery', label: 'Delivery', completed: true },
  { id: 'setup', label: 'Setup Card', completed: true },
  { id: 'verification', label: 'Verification', completed: false },
  { id: 'review', label: 'Review', completed: false },
]

const documentTypes: {
  id: DocumentType
  label: string
  icon: React.ReactNode
}[] = [
  {
    id: 'identity_card',
    label: 'Identity Card',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
        />
      </svg>
    ),
  },
  {
    id: 'driver_license',
    label: 'Driver License',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
  },
  {
    id: 'passport',
    label: 'Passport',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
]

function HorizontalStepper({ currentStepIndex }: { currentStepIndex: number }) {
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

function DocumentTypeSelector({
  selected,
  onSelect,
}: {
  selected: DocumentType
  onSelect: (type: DocumentType) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {documentTypes.map((type) => {
        const isSelected = selected === type.id
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onSelect(type.id)}
            className={cn(
              'group relative flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all duration-200',
              'hover:border-primary/50 hover:bg-primary/5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              isSelected
                ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                : 'border-border bg-background text-muted-foreground',
            )}
          >
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md animate-in zoom-in-50 duration-200">
                <svg
                  className="h-3 w-3"
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
              </div>
            )}

            <div
              className={cn(
                'transition-colors duration-200',
                isSelected
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-foreground',
              )}
            >
              {type.icon}
            </div>
            <span>{type.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function FileUploadZone({
  label,
  file,
  onFileSelect,
  onRemove,
}: {
  label: string
  file: UploadedFile | null
  onFileSelect: (file: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect],
  )

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  if (file) {
    return (
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div
          className={cn(
            'relative flex items-center gap-3 rounded-xl border-2 bg-background p-4 transition-all duration-300',
            file.status === 'uploading' && 'border-primary/30',
            file.status === 'success' && 'border-green-500/30 bg-green-500/5',
            file.status === 'error' && 'border-red-500/30 bg-red-500/5',
          )}
        >
          {/* File icon */}
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              file.status === 'uploading' && 'bg-primary/10',
              file.status === 'success' && 'bg-green-500/10',
              file.status === 'error' && 'bg-red-500/10',
            )}
          >
            <svg
              className={cn(
                'h-5 w-5',
                file.status === 'uploading' && 'text-primary',
                file.status === 'success' && 'text-green-600 dark:text-green-500',
                file.status === 'error' && 'text-red-600 dark:text-red-500',
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
              {file.status === 'uploading' && ` • Uploading ${file.progress}%`}
              {file.status === 'success' && ' • Upload complete'}
              {file.status === 'error' && ' • Upload failed'}
            </p>
          </div>

          {/* Progress/Status indicator */}
          {file.status === 'uploading' && (
            <div className="flex h-8 w-8 items-center justify-center">
              <svg
                className="h-5 w-5 animate-spin text-primary"
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
          )}

          {file.status === 'success' && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
              <svg
                className="h-4 w-4 text-green-600 dark:text-green-500"
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
          )}

          {/* Remove button */}
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Progress bar */}
          {file.status === 'uploading' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-all duration-200',
          'hover:border-primary/50 hover:bg-primary/5',
          isDragging
            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
            : 'border-border bg-muted/30',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload icon with animated ring */}
        <div className="relative">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200',
              isDragging
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
            )}
          >
            <svg
              className={cn(
                'h-6 w-6 transition-transform duration-200',
                isDragging && 'scale-110',
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          {/* Animated rings on drag */}
          {isDragging && (
            <>
              <div className="absolute inset-0 animate-ping rounded-xl border border-primary/30" />
              <div
                className="absolute inset-0 animate-ping rounded-xl border border-primary/20"
                style={{ animationDelay: '150ms' }}
              />
            </>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm">
            <span className="font-medium text-primary">Click to upload</span>
            <span className="text-muted-foreground"> or drag and drop</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, JPG, JPEG, PNG less than 10MB
          </p>
          <p className="text-xs text-muted-foreground">
            Ensure your document is in good condition and readable
          </p>
        </div>
      </div>
    </div>
  )
}

export function IdentityVerificationWizard({
  className,
  ...props
}: IdentityVerificationWizardProps) {
  const [currentStep] = useState<VerificationStep>('verification')
  const [selectedDocType, setSelectedDocType] =
    useState<DocumentType>('identity_card')
  const [frontFile, setFrontFile] = useState<UploadedFile | null>(null)
  const [backFile, setBackFile] = useState<UploadedFile | null>(null)

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

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

  const canContinue =
    frontFile?.status === 'success' && backFile?.status === 'success'

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl text-foreground">
              Verify your identity
            </h1>
            <p className="mt-2 text-muted-foreground text-balance">
              Select your document type and upload clear photos of both sides.
              This helps us verify your identity securely.
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-4 md:px-8">
          <Button variant="ghost" className="text-muted-foreground">
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline">Back</Button>
            <Button disabled={!canContinue} className="min-w-[120px]">
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
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
