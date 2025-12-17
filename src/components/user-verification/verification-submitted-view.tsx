import { usePersonalInfo } from './hooks/queries/use-personal-info'
import { useEducation } from './hooks/queries/use-education'
import { useIdentityDocument } from './hooks/queries/use-identity-document'
import { useJobHistory } from './hooks/queries/use-job-history'
import { requiresEducationAndJobHistory } from './constants'
import type { VerificationStatusData } from './hooks/queries/use-verification-status'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { UserType } from '@/lib/schemas/signup'

interface VerificationSubmittedViewProps {
  verificationStatus: VerificationStatusData
  userType: UserType
  className?: string
}

export function VerificationSubmittedView({
  verificationStatus,
  userType,
  className,
}: VerificationSubmittedViewProps) {
  const { data: personalInfo } = usePersonalInfo()
  const { data: education } = useEducation()
  const { data: identityDocument } = useIdentityDocument()
  const { data: jobHistory } = useJobHistory()

  // Check if education and job history should be shown
  const showEducationAndJobHistory = requiresEducationAndJobHistory(userType)

  const submittedDate = verificationStatus.submittedAt
    ? new Date(verificationStatus.submittedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className={cn('space-y-6', className)}>
      {/* Status Banner */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-950/40">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20">
              <svg
                className="h-5 w-5 text-amber-600 dark:text-amber-500"
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
            <div>
              <h3 className="font-display text-lg text-foreground">
                Verification Pending Review
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your verification was submitted{' '}
                {submittedDate && `on ${submittedDate}`}. Our team is reviewing
                your documents. You&apos;ll receive a notification once the
                review is complete.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submitted Information Accordion */}
      <Card>
        <CardContent className="p-0">
          <Accordion
            type="multiple"
            defaultValue={['personal-info']}
            className="w-full"
          >
            {/* Personal Information */}
            <AccordionItem value="personal-info" className="border-b">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
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
                  <span className="font-medium">Personal Information</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Full Name"
                    value={
                      personalInfo
                        ? `${personalInfo.firstName} ${personalInfo.middleInitial ? personalInfo.middleInitial + '. ' : ''}${personalInfo.lastName}`
                        : '-'
                    }
                  />
                  <InfoItem
                    label="Gender"
                    value={
                      personalInfo?.gender
                        ? capitalizeFirst(personalInfo.gender)
                        : '-'
                    }
                  />
                  <InfoItem
                    label="Age"
                    value={personalInfo?.age?.toString() ?? '-'}
                  />
                  <InfoItem
                    label="Birthday"
                    value={personalInfo?.birthday ?? '-'}
                  />
                  <InfoItem
                    label="Marital Status"
                    value={
                      personalInfo?.maritalStatus
                        ? capitalizeFirst(personalInfo.maritalStatus)
                        : '-'
                    }
                  />
                  <InfoItem
                    label="Phone Number"
                    value={personalInfo?.phoneNumber ?? '-'}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Education - Only shown for Employee userType */}
            {showEducationAndJobHistory && (
              <AccordionItem value="education" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
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
                    <span className="font-medium">Educational Background</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoItem
                      label="Education Level"
                      value={
                        education?.level
                          ? formatEducationLevel(education.level)
                          : '-'
                      }
                    />
                    <InfoItem
                      label="School Name"
                      value={education?.schoolName ?? '-'}
                    />
                    {education?.degree && (
                      <InfoItem label="Degree" value={education.degree} />
                    )}
                    {education?.course && (
                      <InfoItem label="Course" value={education.course} />
                    )}
                    <InfoItem
                      label="Year"
                      value={
                        education
                          ? `${education.yearStarted} - ${education.yearGraduated ?? 'Present'}`
                          : '-'
                      }
                    />
                    {education?.honors && (
                      <InfoItem label="Honors" value={education.honors} />
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Identity Document */}
            <AccordionItem value="document" className="border-b">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
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
                  <span className="font-medium">Identity Document</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  <InfoItem
                    label="Document Type"
                    value={
                      identityDocument?.documentType
                        ? formatDocumentType(identityDocument.documentType)
                        : '-'
                    }
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {identityDocument?.frontImageUrl && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Front Side
                        </p>
                        <div className="relative aspect-3/2 overflow-hidden rounded-lg border bg-muted">
                          <img
                            src={identityDocument.frontImageUrl}
                            alt="Document front"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {identityDocument?.backImageUrl && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Back Side
                        </p>
                        <div className="relative aspect-3/2 overflow-hidden rounded-lg border bg-muted">
                          <img
                            src={identityDocument.backImageUrl}
                            alt="Document back"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Job History - Only shown for Employee userType */}
            {showEducationAndJobHistory && (
              <AccordionItem value="job-history" className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
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
                    <span className="font-medium">Work Experience</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {jobHistory?.jobs && jobHistory.jobs.length > 0 ? (
                    <div className="space-y-4">
                      {jobHistory.jobs.map((job, index) => (
                        <div
                          key={index}
                          className="rounded-lg border bg-muted/30 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-foreground">
                                {job.position}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {job.companyName}
                              </p>
                            </div>
                            <p className="shrink-0 text-sm text-muted-foreground">
                              {formatDate(job.startMonth)} -{' '}
                              {job.isCurrentJob
                                ? 'Present'
                                : formatDate(job.endMonth)}
                            </p>
                          </div>
                          {job.summary && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {job.summary}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No job history provided
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>

      {/* What happens next */}
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
                Our team typically reviews submissions within 1-2 business days.
                You&apos;ll receive an email notification once your verification
                is approved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  )
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatEducationLevel(level: string): string {
  const levelMap: Record<string, string> = {
    elementary: 'Elementary',
    junior_high: 'Junior High School',
    senior_high: 'Senior High School',
    vocational: 'Vocational',
    college: 'College',
    postgraduate: 'Post-Graduate',
  }
  return levelMap[level] ?? level
}

function formatDocumentType(type: string): string {
  const typeMap: Record<string, string> = {
    identity_card: 'Identity Card',
    driver_license: "Driver's License",
    passport: 'Passport',
  }
  return typeMap[type] ?? type
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  const [year, month] = dateStr.split('-')
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const monthIndex = parseInt(month, 10) - 1
  return `${monthNames[monthIndex]} ${year}`
}
