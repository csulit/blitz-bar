import { useMemo } from 'react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { useVerificationSubmissions } from './hooks/queries/use-verification-submissions'
import type { ColumnDef } from '@tanstack/react-table'
import type { VerificationFilters, VerificationSubmission } from './types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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

function getStatusBadge(status: string) {
  switch (status) {
    case 'submitted':
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800"
        >
          Pending
        </Badge>
      )
    case 'verified':
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800"
        >
          Approved
        </Badge>
      )
    case 'rejected':
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800"
        >
          Rejected
        </Badge>
      )
    case 'info_requested':
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800"
        >
          Info Requested
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
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

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.totalPages ?? 0,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (!data?.data.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="font-semibold text-lg">All caught up!</h3>
        <p className="text-muted-foreground text-sm">
          {filters.status === 'submitted'
            ? 'No pending verifications to review.'
            : 'No verifications match your filters.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={selectedIds.includes(row.original.id) && 'selected'}
                className="cursor-pointer"
                onClick={() => onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, data.total)} of {data.total}
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              onPageSizeChange(Number(value))
              onPageChange(1)
            }}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <IconChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page + 1)}
            disabled={page === data.totalPages}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(data.totalPages)}
            disabled={page === data.totalPages}
          >
            <IconChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
