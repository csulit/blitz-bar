import { useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import {
  IconBriefcase,
  IconCheck,
  IconDownload,
  IconExternalLink,
  IconHistory,
  IconId,
  IconInfoCircle,
  IconSchool,
  IconUser,
  IconX,
} from '@tabler/icons-react'
import { ApproveDialog } from './action-modals/approve-dialog'
import { RejectDialog } from './action-modals/reject-dialog'
import { RequestInfoDialog } from './action-modals/request-info-dialog'
import { useApproveVerification } from './hooks/mutations/use-approve-verification'
import { useRejectVerification } from './hooks/mutations/use-reject-verification'
import { useRequestInfo } from './hooks/mutations/use-request-info'
import { useVerificationDetail } from './hooks/queries/use-verification-detail'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

interface VerificationDetailSheetProps {
  id: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'submitted':
      return <Badge className="bg-amber-500">Pending</Badge>
    case 'verified':
      return <Badge className="bg-green-500">Approved</Badge>
    case 'rejected':
      return <Badge className="bg-red-500">Rejected</Badge>
    case 'info_requested':
      return <Badge className="bg-blue-500">Info Requested</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDocumentType(type: string) {
  switch (type) {
    case 'identity_card':
      return 'Identity Card'
    case 'driver_license':
      return "Driver's License"
    case 'passport':
      return 'Passport'
    default:
      return type
  }
}

function formatEducationLevel(level: string) {
  const levels: Record<string, string> = {
    elementary: 'Elementary',
    junior_high: 'Junior High School',
    senior_high: 'Senior High School',
    vocational: 'Vocational/Technical',
    college: 'College/University',
    postgraduate: 'Post-Graduate',
  }
  return levels[level] || level
}

export function VerificationDetailSheet({
  id,
  open,
  onOpenChange,
}: VerificationDetailSheetProps) {
  const { data: detail, isLoading, isError, error } = useVerificationDetail(id)
  const approveMutation = useApproveVerification()
  const rejectMutation = useRejectVerification()
  const requestInfoMutation = useRequestInfo()

  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showRequestInfoDialog, setShowRequestInfoDialog] = useState(false)

  async function handleApprove() {
    if (!id) return
    await approveMutation.mutateAsync({ verificationId: id })
    setShowApproveDialog(false)
    onOpenChange(false)
  }

  async function handleReject(reason: string) {
    if (!id) return
    await rejectMutation.mutateAsync({ verificationId: id, reason })
    setShowRejectDialog(false)
    onOpenChange(false)
  }

  async function handleRequestInfo(reason: string) {
    if (!id) return
    await requestInfoMutation.mutateAsync({ verificationId: id, reason })
    setShowRequestInfoDialog(false)
    onOpenChange(false)
  }

  const userName = detail
    ? detail.user.firstName && detail.user.lastName
      ? `${detail.user.firstName} ${detail.user.lastName}`
      : detail.user.name
    : ''

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SheetHeader className="mb-4">
                <SheetTitle>Error Loading Details</SheetTitle>
                <SheetDescription>
                  {error?.message || 'Failed to load verification details'}
                </SheetDescription>
              </SheetHeader>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          ) : !detail ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SheetHeader className="mb-4">
                <SheetTitle>Not Found</SheetTitle>
                <SheetDescription>
                  Verification details could not be found
                </SheetDescription>
              </SheetHeader>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          ) : (
            <div className="p-6">
              <SheetHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={detail.user.image ?? undefined} />
                      <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle className="text-left">{userName}</SheetTitle>
                      <SheetDescription className="text-left">
                        {detail.user.email}
                      </SheetDescription>
                    </div>
                  </div>
                  {getStatusBadge(detail.status)}
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  {detail.submittedAt && (
                    <span>
                      Submitted{' '}
                      {formatDistanceToNow(new Date(detail.submittedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </SheetHeader>

              <Separator />

              <Accordion
                type="multiple"
                defaultValue={[
                  'personal',
                  'education',
                  'documents',
                  'jobs',
                  'history',
                ]}
                className="w-full"
              >
                {/* Personal Information */}
                <AccordionItem value="personal">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <IconUser className="h-4 w-4" />
                      Personal Information
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {detail.profile ? (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Age</p>
                          <p className="font-medium">
                            {detail.profile.age || '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Birthday</p>
                          <p className="font-medium">
                            {detail.profile.birthday
                              ? format(new Date(detail.profile.birthday), 'PPP')
                              : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Gender</p>
                          <p className="font-medium capitalize">
                            {detail.profile.gender || '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Marital Status
                          </p>
                          <p className="font-medium capitalize">
                            {detail.profile.maritalStatus || '-'}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Phone Number</p>
                          <p className="font-medium">
                            {detail.profile.phoneNumber || '-'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No personal information provided
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Education */}
                <AccordionItem value="education">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <IconSchool className="h-4 w-4" />
                      Education ({detail.education.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {detail.education.length > 0 ? (
                      <div className="space-y-4">
                        {detail.education.map((edu) => (
                          <div
                            key={edu.id}
                            className="rounded-md border p-3 text-sm"
                          >
                            <p className="font-medium">
                              {formatEducationLevel(edu.level)}
                            </p>
                            <p className="text-muted-foreground">
                              {edu.schoolName}
                            </p>
                            {edu.degree && (
                              <p className="text-muted-foreground">
                                {edu.degree}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {edu.yearStarted} -{' '}
                              {edu.yearGraduated || 'Present'}
                              {edu.honors && ` | ${edu.honors}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No education information provided
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Identity Documents */}
                <AccordionItem value="documents">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <IconId className="h-4 w-4" />
                      Identity Documents ({detail.identityDocuments.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {detail.identityDocuments.length > 0 ? (
                      <div className="space-y-4">
                        {detail.identityDocuments.map((doc) => (
                          <div key={doc.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {formatDocumentType(doc.documentType)}
                              </span>
                              {getStatusBadge(doc.status)}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button className="relative aspect-3/2 overflow-hidden rounded-md border bg-muted hover:opacity-80 transition-opacity">
                                    <img
                                      src={doc.frontImageUrl}
                                      alt="Front of document"
                                      className="h-full w-full object-cover"
                                    />
                                    <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded">
                                      Front
                                    </span>
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogTitle>Document - Front</DialogTitle>
                                  <img
                                    src={doc.frontImageUrl}
                                    alt="Front of document"
                                    className="w-full rounded-md"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                      <a
                                        href={doc.frontImageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <IconExternalLink className="mr-2 h-4 w-4" />
                                        Open in new tab
                                      </a>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={doc.frontImageUrl} download>
                                        <IconDownload className="mr-2 h-4 w-4" />
                                        Download
                                      </a>
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {doc.backImageUrl && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <button className="relative aspect-3/2 overflow-hidden rounded-md border bg-muted hover:opacity-80 transition-opacity">
                                      <img
                                        src={doc.backImageUrl}
                                        alt="Back of document"
                                        className="h-full w-full object-cover"
                                      />
                                      <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded">
                                        Back
                                      </span>
                                    </button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogTitle>Document - Back</DialogTitle>
                                    <img
                                      src={doc.backImageUrl}
                                      alt="Back of document"
                                      className="w-full rounded-md"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                      >
                                        <a
                                          href={doc.backImageUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <IconExternalLink className="mr-2 h-4 w-4" />
                                          Open in new tab
                                        </a>
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                      >
                                        <a href={doc.backImageUrl} download>
                                          <IconDownload className="mr-2 h-4 w-4" />
                                          Download
                                        </a>
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No identity documents uploaded
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Job History */}
                <AccordionItem value="jobs">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <IconBriefcase className="h-4 w-4" />
                      Job History ({detail.jobHistory.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {detail.jobHistory.length > 0 ? (
                      <div className="space-y-4">
                        {detail.jobHistory.map((job) => (
                          <div
                            key={job.id}
                            className="rounded-md border p-3 text-sm"
                          >
                            <p className="font-medium">{job.position}</p>
                            <p className="text-muted-foreground">
                              {job.companyName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {job.startMonth} - {job.endMonth || 'Present'}
                              {job.isCurrentJob && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  Current
                                </Badge>
                              )}
                            </p>
                            {job.summary && (
                              <p className="text-xs text-muted-foreground mt-2">
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

                {/* Admin Activity */}
                <AccordionItem value="history">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <IconHistory className="h-4 w-4" />
                      Admin Activity ({detail.auditLogs.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {detail.auditLogs.length > 0 ? (
                      <div className="space-y-3">
                        {detail.auditLogs.map((log) => (
                          <div
                            key={log.id}
                            className="flex items-start gap-3 text-sm"
                          >
                            <div
                              className={`mt-0.5 rounded-full p-1 ${
                                log.action === 'approved'
                                  ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
                                  : log.action === 'rejected'
                                    ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                              }`}
                            >
                              {log.action === 'approved' ? (
                                <IconCheck className="h-3 w-3" />
                              ) : log.action === 'rejected' ? (
                                <IconX className="h-3 w-3" />
                              ) : (
                                <IconInfoCircle className="h-3 w-3" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p>
                                <span className="font-medium">
                                  {log.admin.name}
                                </span>{' '}
                                {log.action === 'approved'
                                  ? 'approved'
                                  : log.action === 'rejected'
                                    ? 'rejected'
                                    : 'requested additional info'}
                              </p>
                              {log.reason && (
                                <p className="text-muted-foreground mt-1">
                                  "{log.reason}"
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(log.createdAt), 'PPp')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No previous admin activity
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Action Buttons - Only show for pending submissions */}
              {detail.status === 'submitted' && (
                <div className="sticky bottom-0 mt-6 flex gap-2 border-t bg-background py-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => setShowApproveDialog(true)}
                  >
                    <IconCheck className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <IconX className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowRequestInfoDialog(true)}
                  >
                    <IconInfoCircle className="mr-2 h-4 w-4" />
                    Request Info
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <ApproveDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        onConfirm={handleApprove}
        userName={userName}
        isLoading={approveMutation.isPending}
      />

      <RejectDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={handleReject}
        userName={userName}
        isLoading={rejectMutation.isPending}
      />

      <RequestInfoDialog
        open={showRequestInfoDialog}
        onOpenChange={setShowRequestInfoDialog}
        onConfirm={handleRequestInfo}
        userName={userName}
        isLoading={requestInfoMutation.isPending}
      />
    </>
  )
}
