import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
  userName?: string
  isLoading?: boolean
  isBulk?: boolean
  count?: number
}

const REJECTION_TEMPLATES = [
  'Documents are unclear or unreadable',
  'Information does not match the documents',
  'Documents appear to be expired',
  'Incomplete submission - missing required documents',
]

export function RejectDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  isLoading,
  isBulk,
  count,
}: RejectDialogProps) {
  const [reason, setReason] = useState('')

  function handleConfirm() {
    if (reason.trim()) {
      onConfirm(reason)
      setReason('')
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setReason('')
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isBulk
              ? `Reject ${count} verification${count !== 1 ? 's' : ''}?`
              : 'Reject verification'}
          </DialogTitle>
          <DialogDescription>
            {isBulk ? (
              <>
                Please provide a reason for rejecting these {count} verification
                {count !== 1 ? 's' : ''}. The user
                {count !== 1 ? 's' : ''} will be notified with this message.
              </>
            ) : (
              <>
                Please provide a reason for rejecting the verification for{' '}
                <span className="font-medium text-foreground">
                  {userName || 'this user'}
                </span>
                . The user will be notified with this message.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for rejection</Label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-25"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Quick templates
            </Label>
            <div className="flex flex-wrap gap-2">
              {REJECTION_TEMPLATES.map((template) => (
                <Button
                  key={template}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setReason(template)}
                >
                  {template}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
