import { useSuspenseQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { accountKeys } from '../keys'
import type { UseSuspenseQueryOptions } from '@tanstack/react-query'
import { db } from '@/db'
import { user } from '@/db/schema'

/**
 * Server function for fetching account data
 * Combines user, profile, education, and job history data
 */
export const getAccountData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      with: {
        profile: true,
        educations: {
          orderBy: (edu, { desc }) => [desc(edu.createdAt)],
        },
        jobHistories: {
          orderBy: (job, { desc }) => [desc(job.createdAt)],
        },
      },
    })

    if (!userData) {
      throw new Error('User not found')
    }

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      emailVerified: userData.emailVerified,
      image: userData.image,
      firstName: userData.firstName,
      middleInitial: userData.middleInitial,
      lastName: userData.lastName,
      role: userData.role,
      userType: userData.userType,
      userVerified: userData.userVerified,
      createdAt: userData.createdAt,
      profile: userData.profile
        ? {
            age: userData.profile.age,
            birthday: userData.profile.birthday,
            gender: userData.profile.gender,
            maritalStatus: userData.profile.maritalStatus,
            phoneNumber: userData.profile.phoneNumber,
          }
        : null,
      education: userData.educations.map((edu) => ({
        id: edu.id,
        level: edu.level,
        schoolName: edu.schoolName,
        schoolAddress: edu.schoolAddress,
        degree: edu.degree,
        course: edu.course,
        track: edu.track,
        strand: edu.strand,
        yearStarted: edu.yearStarted,
        yearGraduated: edu.yearGraduated,
        isCurrentlyEnrolled: edu.isCurrentlyEnrolled,
        honors: edu.honors,
      })),
      jobHistory: userData.jobHistories.map((job) => ({
        id: job.id,
        companyName: job.companyName,
        position: job.position,
        startMonth: job.startMonth,
        endMonth: job.endMonth,
        isCurrentJob: job.isCurrentJob,
        summary: job.summary,
      })),
    }
  },
)

// Infer the return type from the server function
export type AccountData = Awaited<ReturnType<typeof getAccountData>>

/**
 * Hook for fetching current user's account data with SSR support
 *
 * @example
 * const { data: account } = useAccount()
 */
export function useAccount(
  options?: Omit<
    UseSuspenseQueryOptions<AccountData, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useSuspenseQuery({
    queryKey: accountKeys.detail(),
    queryFn: () => getAccountData(),
    ...options,
  })
}
