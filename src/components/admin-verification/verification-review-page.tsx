import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { VerificationStatsCards } from './verification-stats-cards'
import { VerificationFilters } from './verification-filters'
import { VerificationTable } from './verification-table'
import { VerificationDetailSheet } from './verification-detail-sheet'
import { BulkActionsBar } from './bulk-actions-bar'
import type {
  VerificationFilters as FilterType,
  VerificationSubmission,
} from './types'

const routeApi = getRouteApi('/admin/')

export function VerificationReviewPage() {
  const searchParams = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const [selectedIds, setSelectedIds] = useState<Array<string>>([])
  const [detailId, setDetailId] = useState<string | null>(null)

  // Convert search params to filters format
  const filters: FilterType = {
    search: searchParams.search ?? '',
    status: searchParams.status ?? 'submitted',
    dateFrom: null,
    dateTo: null,
    sortBy: searchParams.sortBy ?? 'submittedAt',
    sortOrder: searchParams.sortOrder ?? 'desc',
  }

  const page = searchParams.page ?? 1
  const pageSize = searchParams.pageSize ?? 10

  function handleRowClick(submission: VerificationSubmission) {
    setDetailId(submission.id)
  }

  function handleFiltersChange(newFilters: FilterType) {
    setSelectedIds([]) // Clear selection when filters change
    navigate({
      search: (prev) => ({
        ...prev,
        search: newFilters.search || undefined,
        status: newFilters.status === 'submitted' ? undefined : newFilters.status,
        sortBy: newFilters.sortBy === 'submittedAt' ? undefined : newFilters.sortBy,
        sortOrder: newFilters.sortOrder === 'desc' ? undefined : newFilters.sortOrder,
        page: undefined, // Reset to first page when filters change
      }),
      replace: true,
    })
  }

  function handlePageChange(newPage: number) {
    navigate({
      search: (prev) => ({
        ...prev,
        page: newPage === 1 ? undefined : newPage,
      }),
      replace: true,
    })
  }

  function handlePageSizeChange(newPageSize: number) {
    setSelectedIds([])
    navigate({
      search: (prev) => ({
        ...prev,
        pageSize: newPageSize === 10 ? undefined : newPageSize,
        page: undefined, // Reset to first page when page size changes
      }),
      replace: true,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl">Verification Review</h1>
        <p className="text-muted-foreground">
          Review and manage user verification submissions
        </p>
      </div>

      {/* Stats Cards */}
      <VerificationStatsCards />

      {/* Filters */}
      <VerificationFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Data Table */}
      <VerificationTable
        filters={filters}
        page={page}
        pageSize={pageSize}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onRowClick={handleRowClick}
      />

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.length}
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
        />
      )}

      {/* Detail Sheet */}
      <VerificationDetailSheet
        id={detailId}
        open={!!detailId}
        onOpenChange={(open) => {
          if (!open) setDetailId(null)
        }}
      />
    </div>
  )
}
