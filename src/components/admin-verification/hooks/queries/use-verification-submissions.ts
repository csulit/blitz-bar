import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, asc, desc, eq, gte, lte, ne, sql } from 'drizzle-orm'
import { adminVerificationKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type {
  PaginatedResponse,
  VerificationFilters,
  VerificationSubmission,
} from '../../types'
import { db } from '@/db'
import { user, userVerification } from '@/db/schema'

interface GetSubmissionsInput {
  page: number
  pageSize: number
  filters: VerificationFilters
}

export const getVerificationSubmissions = createServerFn({ method: 'POST' })
  .inputValidator((data: GetSubmissionsInput) => data)
  .handler(async ({ data }) => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const sessionUser = session.user as typeof session.user & { role?: string }
    if (sessionUser.role !== 'admin') {
      throw new Error('Forbidden: Admin access required')
    }

    const { page, pageSize, filters } = data
    const offset = (page - 1) * pageSize

    // Build where conditions
    const conditions = []

    // Only show non-draft verifications (submitted, verified, rejected, info_requested)
    if (filters.status === 'all') {
      conditions.push(ne(userVerification.status, 'draft'))
    } else {
      conditions.push(eq(userVerification.status, filters.status))
    }

    // Date range filters
    if (filters.dateFrom) {
      conditions.push(gte(userVerification.submittedAt, filters.dateFrom))
    }
    if (filters.dateTo) {
      conditions.push(lte(userVerification.submittedAt, filters.dateTo))
    }

    // Build order by
    const orderByColumn =
      filters.sortBy === 'name' ? user.name : userVerification[filters.sortBy]
    const orderByDirection =
      filters.sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn)

    // Query with joins
    const submissions = await db.query.userVerification.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
      orderBy: [orderByDirection],
      limit: pageSize,
      offset,
    })

    // Filter by search (name or email) after join
    let filteredSubmissions = submissions
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredSubmissions = submissions.filter(
        (s) =>
          s.user.name.toLowerCase().includes(searchLower) ||
          s.user.email.toLowerCase().includes(searchLower) ||
          s.user.firstName?.toLowerCase().includes(searchLower) ||
          s.user.lastName?.toLowerCase().includes(searchLower),
      )
    }

    // Get total count for pagination
    const countConditions = [...conditions]
    const totalResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVerification)
      .where(countConditions.length > 0 ? and(...countConditions) : undefined)

    const total = totalResult[0]?.count ?? 0

    return {
      data: filteredSubmissions as Array<VerificationSubmission>,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    } as PaginatedResponse<VerificationSubmission>
  })

type VerificationSubmissionsResult = Awaited<
  ReturnType<typeof getVerificationSubmissions>
>

export function useVerificationSubmissions(
  filters: VerificationFilters,
  page: number,
  pageSize: number,
  options?: Omit<
    UseQueryOptions<VerificationSubmissionsResult, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: adminVerificationKeys.submissionsList(filters, page, pageSize),
    queryFn: () =>
      getVerificationSubmissions({ data: { page, pageSize, filters } }),
    ...options,
  })
}
