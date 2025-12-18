import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { and, asc, desc, eq, gte, lte, ne, or, sql } from 'drizzle-orm'
import { adminVerificationKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type {
  PaginatedResponse,
  VerificationFilters,
  VerificationSubmission,
} from '../../types'
import { db } from '@/db'
import { user, userVerification } from '@/db/schema'
import { assertCan } from '@/lib/casl/server'

interface GetSubmissionsInput {
  page: number
  pageSize: number
  filters: VerificationFilters
}

export const getVerificationSubmissions = createServerFn({ method: 'POST' })
  .inputValidator((data: GetSubmissionsInput) => data)
  .handler(async ({ data }) => {
    // Check if user can manage verifications (admin only)
    await assertCan('manage', 'UserVerification')

    const { page, pageSize, filters } = data
    const offset = (page - 1) * pageSize

    // Build where conditions for verification table
    const verificationConditions = []

    // Only show non-draft verifications (submitted, verified, rejected, info_requested)
    if (filters.status === 'all') {
      verificationConditions.push(ne(userVerification.status, 'draft'))
    } else {
      verificationConditions.push(eq(userVerification.status, filters.status))
    }

    // Date range filters
    if (filters.dateFrom) {
      verificationConditions.push(
        gte(userVerification.submittedAt, filters.dateFrom),
      )
    }
    if (filters.dateTo) {
      verificationConditions.push(
        lte(userVerification.submittedAt, filters.dateTo),
      )
    }

    // Build search condition using pg_trgm similarity
    let searchCondition = undefined
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim()
      // Use pg_trgm similarity search across name, email, firstName, lastName
      // The % operator checks if similarity > 0.3 (default threshold)
      searchCondition = or(
        sql`${user.name} % ${searchTerm}`,
        sql`${user.email} % ${searchTerm}`,
        sql`${user.firstName} % ${searchTerm}`,
        sql`${user.lastName} % ${searchTerm}`,
        // Also include ILIKE for exact substring matches
        sql`${user.name} ILIKE ${'%' + searchTerm + '%'}`,
        sql`${user.email} ILIKE ${'%' + searchTerm + '%'}`,
      )
    }

    // Build order by
    const orderByColumn =
      filters.sortBy === 'name' ? user.name : userVerification[filters.sortBy]
    const orderByDirection =
      filters.sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn)

    // Query with explicit join for search functionality
    const submissions = await db
      .select({
        id: userVerification.id,
        userId: userVerification.userId,
        status: userVerification.status,
        submittedAt: userVerification.submittedAt,
        verifiedAt: userVerification.verifiedAt,
        rejectionReason: userVerification.rejectionReason,
        createdAt: userVerification.createdAt,
        updatedAt: userVerification.updatedAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          userType: user.userType,
        },
      })
      .from(userVerification)
      .innerJoin(user, eq(userVerification.userId, user.id))
      .where(
        and(
          ...verificationConditions,
          ...(searchCondition ? [searchCondition] : []),
        ),
      )
      .orderBy(orderByDirection)
      .limit(pageSize)
      .offset(offset)

    // Get total count for pagination (with same filters including search)
    const totalResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVerification)
      .innerJoin(user, eq(userVerification.userId, user.id))
      .where(
        and(
          ...verificationConditions,
          ...(searchCondition ? [searchCondition] : []),
        ),
      )

    const total = totalResult[0]?.count ?? 0

    return {
      data: submissions as Array<VerificationSubmission>,
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
