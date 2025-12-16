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

interface RequestInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
  userName?: string
  isLoading?: boolean
  isBulk?: boolean
  count?: number
}

const INFO_REQUEST_TEMPLATES = [
  'Please upload clearer photos of your documents',
  'Please upload the back side of your ID',
  'Please provide a more recent proof of address',
  'Please verify your phone number',
  'Please complete your education information',
]

export function RequestInfoDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  isLoading,
  isBulk,
  count,
}: RequestInfoDialogProps) {
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
              ? `Request info from ${count} user${count !== 1 ? 's' : ''}`
              : 'Request additional information'}
          </DialogTitle>
          <DialogDescription>
            {isBulk ? (
              <>
                Please specify what additional information is needed from these{' '}
                {count} user{count !== 1 ? 's' : ''}. They will be notified and
                can update their submission.
              </>
            ) : (
              <>
                Please specify what additional information is needed from{' '}
                <span className="font-medium text-foreground">
                  {userName || 'this user'}
                </span>
                . They will be notified and can update their submission.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="info-request">What information is needed?</Label>
            <Textarea
              id="info-request"
              placeholder="Describe what information or documents are needed..."
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
              {INFO_REQUEST_TEMPLATES.map((template) => (
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
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
