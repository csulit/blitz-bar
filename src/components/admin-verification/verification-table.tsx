import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useVerificationSubmissions } from './hooks/queries/use-verification-submissions'
import type { ColumnDef } from '@tanstack/react-table'
import type { VerificationFilters, VerificationSubmission } from './types'
import type { SkeletonType } from '@/components/ui/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/ui/data-table'

interface VerificationTableProps {
  filters: VerificationFilters
  page: number
  pageSize: number
  selectedIds: Array<string>
  onSelectionChange: (ids: Array<string>) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onRowClick: (submission: VerificationSubmission) => void
}

function getUserTypeBadge(userType: string | null) {
  if (!userType) return <span className="text-muted-foreground">-</span>

  switch (userType.toLowerCase()) {
    case 'employee':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800"
        >
          Employee
        </Badge>
      )
    case 'employer':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800"
        >
          Employer
        </Badge>
      )
    case 'agency':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800"
        >
          Agency
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="rounded-sm! capitalize">
          {userType}
        </Badge>
      )
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'submitted':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800"
        >
          Pending
        </Badge>
      )
    case 'verified':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800"
        >
          Approved
        </Badge>
      )
    case 'rejected':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800"
        >
          Rejected
        </Badge>
      )
    case 'info_requested':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800"
        >
          Info Requested
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="rounded-sm!">
          {status}
        </Badge>
      )
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

export function VerificationTable({
  filters,
  page,
  pageSize,
  selectedIds,
  onSelectionChange,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: VerificationTableProps) {
  const { data, isLoading } = useVerificationSubmissions(
    filters,
    page,
    pageSize,
  )

  const columns = useMemo<Array<ColumnDef<VerificationSubmission>>>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
              if (value) {
                onSelectionChange(data?.data.map((d) => d.id) ?? [])
              } else {
                onSelectionChange([])
              }
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.includes(row.original.id)}
            onCheckedChange={(value) => {
              if (value) {
                onSelectionChange([...selectedIds, row.original.id])
              } else {
                onSelectionChange(
                  selectedIds.filter((id) => id !== row.original.id),
                )
              }
            }}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'user',
        header: () => <span className="font-display">User</span>,
        cell: ({ row }) => {
          const user = row.original.user
          const displayName =
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.name
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image ?? undefined} alt={displayName} />
                <AvatarFallback className="text-xs">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'userType',
        header: () => <span className="font-display">User Type</span>,
        cell: ({ row }) => getUserTypeBadge(row.original.user.userType),
      },
      {
        accessorKey: 'submittedAt',
        header: () => <span className="font-display">Submitted</span>,
        cell: ({ row }) => {
          const date = row.original.submittedAt
          if (!date) return <span className="text-muted-foreground">-</span>
          return (
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </span>
          )
        },
      },
      {
        accessorKey: 'status',
        header: () => <span className="font-display">Status</span>,
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
    ],
    [selectedIds, onSelectionChange, data?.data],
  )

  const skeletonConfig: Array<SkeletonType> = [
    'text-sm', // Checkbox column
    'avatar-with-text', // User column
    'badge', // User Type column
    'text-sm', // Submitted column
    'badge', // Status column
  ]

  const emptyState = (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
      <div className="text-4xl mb-4">🎉</div>
      <h3 className="font-display text-lg">All caught up!</h3>
      <p className="text-muted-foreground text-sm mt-1">
        {filters.status === 'submitted'
          ? 'No pending verifications to review.'
          : 'No verifications match your filters.'}
      </p>
    </div>
  )

  return (
    <DataTable
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      pageSize={pageSize}
      onPageSizeChange={(size) => {
        onPageSizeChange(size)
        onPageChange(1)
      }}
      currentPage={page}
      onPageChange={onPageChange}
      totalRows={data?.total ?? 0}
      manualPagination
      skeletonConfig={skeletonConfig}
      onRowClick={onRowClick}
      emptyState={emptyState}
    />
  )
}
