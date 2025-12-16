import { useState } from 'react'
import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react'
import { ApproveDialog } from './action-modals/approve-dialog'
import { RejectDialog } from './action-modals/reject-dialog'
import { RequestInfoDialog } from './action-modals/request-info-dialog'
import { useBulkActions } from './hooks/mutations/use-bulk-actions'
import { Button } from '@/components/ui/button'

interface BulkActionsBarProps {
  selectedCount: number
  selectedIds: Array<string>
  onClear: () => void
}

export function BulkActionsBar({
  selectedCount,
  selectedIds,
  onClear,
}: BulkActionsBarProps) {
  const bulkMutation = useBulkActions()
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showRequestInfoDialog, setShowRequestInfoDialog] = useState(false)

  async function handleBulkApprove() {
    await bulkMutation.mutateAsync({
      verificationIds: selectedIds,
      action: 'approve',
    })
    setShowApproveDialog(false)
    onClear()
  }

  async function handleBulkReject(reason: string) {
    await bulkMutation.mutateAsync({
      verificationIds: selectedIds,
      action: 'reject',
      reason,
    })
    setShowRejectDialog(false)
    onClear()
  }

  async function handleBulkRequestInfo(reason: string) {
    await bulkMutation.mutateAsync({
      verificationIds: selectedIds,
      action: 'request_info',
      reason,
    })
    setShowRequestInfoDialog(false)
    onClear()
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/80">
          <span className="text-sm font-medium">
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <div className="h-4 w-px bg-border" />
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowApproveDialog(true)}
          >
            <IconCheck className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowRejectDialog(true)}
          >
            <IconX className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowRequestInfoDialog(true)}
          >
            <IconInfoCircle className="mr-2 h-4 w-4" />
            Request Info
          </Button>
          <div className="h-4 w-px bg-border" />
          <Button size="sm" variant="ghost" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>

      <ApproveDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        onConfirm={handleBulkApprove}
        isLoading={bulkMutation.isPending}
        isBulk
        count={selectedCount}
      />

      <RejectDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={handleBulkReject}
        isLoading={bulkMutation.isPending}
        isBulk
        count={selectedCount}
      />

      <RequestInfoDialog
        open={showRequestInfoDialog}
        onOpenChange={setShowRequestInfoDialog}
        onConfirm={handleBulkRequestInfo}
        isLoading={bulkMutation.isPending}
        isBulk
        count={selectedCount}
      />
    </>
  )
}
