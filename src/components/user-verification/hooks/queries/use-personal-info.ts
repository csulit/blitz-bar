import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { format } from 'date-fns'
import { eq } from 'drizzle-orm'
import { personalInfoKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { PersonalInfoFormData } from '@/lib/schemas/personal-info'
import { db } from '@/db'
import { user } from '@/db/schema'

/**
 * Server function for fetching personal info
 * Combines data from user table (name fields) and profile table (other fields)
 */
export const getPersonalInfo = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    // Fetch user with profile
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      with: {
        profile: true,
      },
    })

    if (!userData) {
      return null
    }

    // Combine user and profile data into PersonalInfoFormData shape
    const personalInfo: Partial<PersonalInfoFormData> = {}

    // User table fields
    if (userData.firstName) personalInfo.firstName = userData.firstName
    if (userData.middleInitial)
      personalInfo.middleInitial = userData.middleInitial
    if (userData.lastName) personalInfo.lastName = userData.lastName

    // Profile table fields
    if (userData.profile) {
      if (userData.profile.age) personalInfo.age = Number(userData.profile.age)
      if (userData.profile.birthday) {
        personalInfo.birthday = format(userData.profile.birthday, 'yyyy-MM-dd')
      }
      if (userData.profile.gender) {
        personalInfo.gender = userData.profile.gender as
          | 'male'
          | 'female'
          | 'other'
      }
      if (userData.profile.maritalStatus) {
        personalInfo.maritalStatus = userData.profile.maritalStatus as
          | 'single'
          | 'married'
          | 'divorced'
          | 'widowed'
      }
      if (userData.profile.phoneNumber) {
        personalInfo.phoneNumber = userData.profile.phoneNumber
      }
    }

    return Object.keys(personalInfo).length > 0 ? personalInfo : null
  },
)

// Infer the return type from the server function
type PersonalInfoData = Awaited<ReturnType<typeof getPersonalInfo>>

/**
 * Hook for fetching current user's personal info
 *
 * @example
 * const { data: personalInfo, isLoading, error } = usePersonalInfo()
 */
export function usePersonalInfo(
  options?: Omit<
    UseQueryOptions<PersonalInfoData, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: personalInfoKeys.detail(),
    queryFn: () => getPersonalInfo(),
    ...options,
  })
}
