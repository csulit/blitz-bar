import { useEffect, useState } from 'react'
import { IconFilter, IconSearch, IconSortAscending } from '@tabler/icons-react'
import type { VerificationFilters as FilterType } from './types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface VerificationFiltersProps {
  filters: FilterType
  onFiltersChange: (filters: FilterType) => void
}

export function VerificationFilters({
  filters,
  onFiltersChange,
}: VerificationFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search)

  // Sync local state when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    setSearchValue(filters.search)
  }, [filters.search])

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue })
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchValue, filters, onFiltersChange])

  function updateFilter<TKey extends keyof FilterType>(
    key: TKey,
    value: FilterType[TKey],
  ) {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) =>
            updateFilter('status', value as FilterType['status'])
          }
        >
          <SelectTrigger className="w-52">
            <IconFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="submitted">Pending Review</SelectItem>
            <SelectItem value="verified">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="info_requested">Info Requested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            updateFilter('sortBy', value as FilterType['sortBy'])
          }
        >
          <SelectTrigger className="w-37.5">
            <IconSortAscending className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submittedAt">Submitted Date</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            updateFilter(
              'sortOrder',
              filters.sortOrder === 'asc' ? 'desc' : 'asc',
            )
          }
          title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        >
          <IconSortAscending
            className={`h-4 w-4 transition-transform ${
              filters.sortOrder === 'desc' ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </div>
    </div>
  )
}
