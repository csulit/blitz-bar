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

interface ApproveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  userName?: string
  isLoading?: boolean
  isBulk?: boolean
  count?: number
}

export function ApproveDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  isLoading,
  isBulk,
  count,
}: ApproveDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBulk
              ? `Approve ${count} verification${count !== 1 ? 's' : ''}?`
              : 'Approve verification?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBulk ? (
              <>
                You are about to approve {count} verification
                {count !== 1 ? 's' : ''}. The user{count !== 1 ? 's' : ''} will
                be notified of the approval and will gain access to the
                platform.
              </>
            ) : (
              <>
                You are about to approve the verification for{' '}
                <span className="font-medium text-foreground">
                  {userName || 'this user'}
                </span>
                . The user will be notified of the approval and will gain access
                to the platform.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-600"
          >
            {isLoading ? 'Approving...' : 'Approve'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
