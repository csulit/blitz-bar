import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface VerificationDocumentsCardProps extends React.ComponentProps<'div'> {}

type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'not_uploaded'

interface Document {
  id: string
  type: string
  name: string
  description: string
  required: boolean
  status: DocumentStatus
  fileName?: string
  uploadedAt?: string
  adminComment?: string
  commentedAt?: string
}

const mockDocuments: Array<Document> = [
  {
    id: '1',
    type: 'government_id',
    name: 'Government-Issued ID',
    description: "Passport, driver's license, or national ID card",
    required: true,
    status: 'approved',
    fileName: 'passport_scan.pdf',
    uploadedAt: '2024-01-15 10:30 AM',
    adminComment: 'Document verified successfully.',
    commentedAt: '2024-01-15 02:45 PM',
  },
  {
    id: '2',
    type: 'proof_of_address',
    name: 'Proof of Address',
    description: 'Utility bill or bank statement (dated within 3 months)',
    required: true,
    status: 'rejected',
    fileName: 'utility_bill.pdf',
    uploadedAt: '2024-01-15 10:35 AM',
    adminComment:
      'The document is older than 3 months. Please upload a more recent utility bill or bank statement.',
    commentedAt: '2024-01-15 03:00 PM',
  },
  {
    id: '3',
    type: 'employment_verification',
    name: 'Employment Verification',
    description: 'Letter from employer or recent pay stub',
    required: true,
    status: 'pending',
    fileName: 'employment_letter.pdf',
    uploadedAt: '2024-01-16 09:00 AM',
  },
  {
    id: '4',
    type: 'additional',
    name: 'Additional Documents',
    description: 'Any other supporting documents (optional)',
    required: false,
    status: 'not_uploaded',
  },
]

function StatusIndicator({ status }: { status: DocumentStatus }) {
  switch (status) {
    case 'approved':
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>Approved</span>
        </div>
      )
    case 'rejected':
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span>Reupload Required</span>
        </div>
      )
    case 'pending':
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Under Review</span>
        </div>
      )
    default:
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
          <span>Not Uploaded</span>
        </div>
      )
  }
}

function DocumentItem({ document }: { document: Document }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsUploading(false)
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const showUploadButton =
    document.status === 'not_uploaded' || document.status === 'rejected'

  return (
    <div className="rounded-lg border bg-card p-4 transition-colors hover:border-muted-foreground/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{document.name}</span>
            {document.required && (
              <span className="text-xs text-red-500">*</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {document.description}
          </p>
        </div>
        <StatusIndicator status={document.status} />
      </div>

      {/* Uploaded File Info */}
      {document.fileName && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
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
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          <span>{document.fileName}</span>
          <span>•</span>
          <span className="text-xs text-muted-foreground/60">
            {document.uploadedAt}
          </span>
        </div>
      )}

      {/* Admin Comment */}
      {document.adminComment && (
        <blockquote className="mt-3 border-l-2 border-muted-foreground/30 pl-4 text-sm text-muted-foreground italic">
          <div className="flex items-center gap-2 mb-1 not-italic">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="font-medium text-xs">Admin Feedback</span>
            {document.commentedAt && (
              <>
                <span>•</span>
                <span className="text-xs">{document.commentedAt}</span>
              </>
            )}
          </div>
          <p className="not-italic">{document.adminComment}</p>
        </blockquote>
      )}

      {/* Upload Button */}
      {showUploadButton && (
        <div className="mt-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant={document.status === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <svg
                  className="h-4 w-4 mr-2 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                {document.status === 'rejected'
                  ? 'Reupload Document'
                  : 'Upload Document'}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export function VerificationDocumentsCard({
  className,
  ...props
}: VerificationDocumentsCardProps) {
  const approvedCount = mockDocuments.filter(
    (d) => d.status === 'approved',
  ).length
  const requiredCount = mockDocuments.filter((d) => d.required).length
  const pendingReview = mockDocuments.filter(
    (d) => d.status === 'pending',
  ).length
  const needsReupload = mockDocuments.filter(
    (d) => d.status === 'rejected',
  ).length

  return (
    <Card
      className={cn('w-full max-w-4xl overflow-hidden p-0', className)}
      {...props}
    >
      <CardContent className="grid p-0 md:grid-cols-[1fr,320px]">
        {/* Left Panel - Content */}
        <div className="p-6 md:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-display">Document Verification</h1>
              <p className="text-muted-foreground text-balance mt-2">
                Upload the required documents for account verification. Our team
                will review and provide feedback.
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">
                  {approvedCount}/{requiredCount} Approved
                </span>
              </div>
              {pendingReview > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">
                    {pendingReview} Under Review
                  </span>
                </div>
              )}
              {needsReupload > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">
                    {needsReupload} Needs Reupload
                  </span>
                </div>
              )}
            </div>

            {/* Document List */}
            <div className="space-y-3">
              {mockDocuments.map((doc) => (
                <DocumentItem key={doc.id} document={doc} />
              ))}
            </div>

            {/* Accepted Formats Info */}
            <div className="flex items-start gap-3 text-sm text-muted-foreground pt-2">
              <svg
                className="h-5 w-5 shrink-0 mt-0.5"
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
              <div>
                <p className="font-medium text-foreground">Accepted formats</p>
                <p className="mt-0.5">
                  PDF, JPG, or PNG files up to 10MB. Ensure documents are
                  clearly readable and not expired.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Decorative */}
        <div className="bg-muted relative hidden md:block overflow-hidden">
          {/* Decorative Document/Filing Graphics */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Stacked Document Layers */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Document 1 - Back */}
                <div
                  className="absolute w-32 h-40 bg-background/40 rounded-lg shadow-lg"
                  style={{
                    transform:
                      'rotate(-12deg) translateX(-20px) translateY(10px)',
                  }}
                >
                  <div className="p-3 space-y-2">
                    <div className="h-1.5 bg-muted-foreground/20 rounded w-3/4" />
                    <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
                    <div className="h-1.5 bg-muted-foreground/20 rounded w-5/6" />
                  </div>
                </div>

                {/* Document 2 - Middle */}
                <div
                  className="absolute w-32 h-40 bg-background/60 rounded-lg shadow-lg"
                  style={{
                    transform: 'rotate(-6deg) translateY(-5px)',
                  }}
                >
                  <div className="p-3 space-y-2">
                    <div className="h-1.5 bg-muted-foreground/30 rounded w-2/3" />
                    <div className="h-1.5 bg-muted-foreground/30 rounded w-full" />
                    <div className="h-1.5 bg-muted-foreground/30 rounded w-4/5" />
                    <div className="mt-4 space-y-1.5">
                      <div className="h-1 bg-muted-foreground/20 rounded w-full" />
                      <div className="h-1 bg-muted-foreground/20 rounded w-5/6" />
                      <div className="h-1 bg-muted-foreground/20 rounded w-4/5" />
                    </div>
                  </div>
                </div>

                {/* Document 3 - Front (with checkmark) */}
                <div
                  className="absolute w-32 h-40 bg-background/90 rounded-lg shadow-xl border border-muted-foreground/10"
                  style={{
                    transform:
                      'rotate(4deg) translateX(15px) translateY(-15px)',
                  }}
                >
                  <div className="p-3 space-y-2">
                    <div className="h-1.5 bg-muted-foreground/40 rounded w-3/4" />
                    <div className="h-1.5 bg-muted-foreground/40 rounded w-full" />
                    <div className="h-1.5 bg-muted-foreground/40 rounded w-2/3" />
                    <div className="mt-6 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-green-600 dark:text-green-500"
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle Background Pattern */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-muted-foreground/5 to-transparent" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
