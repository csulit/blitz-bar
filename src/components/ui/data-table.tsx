import { useCallback, useMemo, useRef } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { ColumnDef, Table as TanstackTable } from '@tanstack/react-table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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
import { cn } from '@/lib/utils'

// Utility function to generate page numbers with ellipsis
function getPageNumbers(
  currentPage: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  const pages: Array<number | 'ellipsis'> = []
  const showPages = 5

  if (totalPages <= showPages + 2) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (currentPage > 3) {
      pages.push('ellipsis')
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
  }

  return pages
}

export interface DataTableProps<TData> {
  columns: Array<ColumnDef<TData, unknown>>
  data: Array<TData>
  isLoading?: boolean
  pageSize?: number
  pageSizeOptions?: Array<number>
  onPageSizeChange?: (size: number) => void
  totalRows?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  manualPagination?: boolean
  emptyState?: React.ReactNode
  onRowClick?: (row: TData) => void
  rowHeight?: number
  maxHeight?: number
  showPagination?: boolean
}

function DataTableSkeleton<TData>({
  columns,
  pageSize,
}: {
  columns: Array<ColumnDef<TData, unknown>>
  pageSize: number
}) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: Math.min(pageSize, 5) }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-4 w-full max-w-32" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function DataTablePagination<TData>({
  table,
  pageSizeOptions,
  onPageSizeChange,
  manualPagination,
  currentPage,
  onPageChange,
  totalPages,
}: {
  table: TanstackTable<TData>
  pageSizeOptions: Array<number>
  onPageSizeChange?: (size: number) => void
  manualPagination: boolean
  currentPage: number
  onPageChange?: (page: number) => void
  totalPages: number
}) {
  const handlePageChange = useCallback(
    (page: number) => {
      if (manualPagination && onPageChange) {
        onPageChange(page)
      } else {
        table.setPageIndex(page - 1)
      }
    },
    [manualPagination, onPageChange, table],
  )

  const handlePageSizeChange = useCallback(
    (value: string) => {
      const size = Number(value)
      if (manualPagination && onPageSizeChange) {
        onPageSizeChange(size)
      } else {
        table.setPageSize(size)
      }
    },
    [manualPagination, onPageSizeChange, table],
  )

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  )

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="h-8 w-17.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => canGoPrevious && handlePageChange(currentPage - 1)}
              className={cn(
                'cursor-pointer select-none',
                !canGoPrevious && 'pointer-events-none opacity-50',
              )}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                  className="cursor-pointer select-none"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => canGoNext && handlePageChange(currentPage + 1)}
              className={cn(
                'cursor-pointer select-none',
                !canGoNext && 'pointer-events-none opacity-50',
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 50],
  onPageSizeChange,
  totalRows,
  currentPage = 1,
  onPageChange,
  manualPagination = false,
  emptyState,
  onRowClick,
  rowHeight = 52,
  maxHeight = 600,
  showPagination = true,
}: DataTableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    manualPagination,
    pageCount: manualPagination
      ? Math.ceil((totalRows ?? data.length) / pageSize)
      : undefined,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
  })

  const { rows } = table.getRowModel()
  const totalPages = manualPagination
    ? Math.ceil((totalRows ?? data.length) / pageSize)
    : table.getPageCount()

  // Virtual row handling
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  // Calculate padding for virtualization
  const paddingTop = virtualRows.length > 0 ? (virtualRows[0]?.start ?? 0) : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end ?? 0)
      : 0

  if (isLoading) {
    return (
      <div className="space-y-4">
        <DataTableSkeleton columns={columns} pageSize={pageSize} />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="space-y-4">
        {emptyState ?? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="font-display text-lg">No data found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              There are no records to display.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border">
        <div
          ref={tableContainerRef}
          className="relative overflow-auto"
          style={{ maxHeight }}
        >
          <Table className="table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-display"
                      style={{
                        width:
                          header.column.getSize() !== 150
                            ? header.column.getSize()
                            : undefined,
                      }}
                    >
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
              {paddingTop > 0 && (
                <tr>
                  <td
                    style={{ height: `${paddingTop}px` }}
                    colSpan={columns.length}
                  />
                </tr>
              )}
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <TableRow
                    key={row.id}
                    data-index={virtualRow.index}
                    className={cn(onRowClick && 'cursor-pointer')}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
              {paddingBottom > 0 && (
                <tr>
                  <td
                    style={{ height: `${paddingBottom}px` }}
                    colSpan={columns.length}
                  />
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {showPagination && totalPages > 0 && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={onPageSizeChange}
          manualPagination={manualPagination}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      )}
    </div>
  )
}
