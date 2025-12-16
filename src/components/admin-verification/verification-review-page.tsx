import { useState } from 'react'
import { VerificationStatsCards } from './verification-stats-cards'
import { VerificationFilters } from './verification-filters'
import { VerificationTable } from './verification-table'
import { VerificationDetailSheet } from './verification-detail-sheet'
import { BulkActionsBar } from './bulk-actions-bar'
import type {
  VerificationFilters as FilterType,
  VerificationSubmission,
} from './types'

const defaultFilters: FilterType = {
  search: '',
  status: 'submitted', // Default to pending review
  dateFrom: null,
  dateTo: null,
  sortBy: 'submittedAt',
  sortOrder: 'desc',
}

export function VerificationReviewPage() {
  const [filters, setFilters] = useState<FilterType>(defaultFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState<Array<string>>([])
  const [detailId, setDetailId] = useState<string | null>(null)

  function handleRowClick(submission: VerificationSubmission) {
    setDetailId(submission.id)
  }

  function handleFiltersChange(newFilters: FilterType) {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
    setSelectedIds([]) // Clear selection when filters change
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
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
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
