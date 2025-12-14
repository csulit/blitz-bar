import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { educationKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { EducationFormData } from '@/lib/schemas/education'
import { db } from '@/db'
import { education } from '@/db/schema'

/**
 * Server function for fetching education data
 * Fetches the most recent education record for the current user
 */
export const getEducation = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    // Fetch the most recent education record for this user
    const educationData = await db.query.education.findFirst({
      where: eq(education.userId, session.user.id),
      orderBy: (edu, { desc }) => [desc(edu.updatedAt)],
    })

    if (!educationData) {
      return null
    }

    // Map database record to EducationFormData shape
    const educationInfo: Partial<EducationFormData> = {}

    if (educationData.level) {
      educationInfo.level = educationData.level as EducationFormData['level']
    }
    if (educationData.schoolName) {
      educationInfo.schoolName = educationData.schoolName
    }
    if (educationData.schoolAddress) {
      educationInfo.schoolAddress = educationData.schoolAddress
    }
    if (educationData.degree) {
      educationInfo.degree = educationData.degree
    }
    if (educationData.course) {
      educationInfo.course = educationData.course
    }
    if (educationData.track) {
      educationInfo.track = educationData.track as EducationFormData['track']
    }
    if (educationData.strand) {
      educationInfo.strand = educationData.strand as EducationFormData['strand']
    }
    if (educationData.yearStarted) {
      educationInfo.yearStarted = educationData.yearStarted
    }
    if (educationData.yearGraduated) {
      educationInfo.yearGraduated = educationData.yearGraduated
    }
    educationInfo.isCurrentlyEnrolled =
      educationData.isCurrentlyEnrolled ?? false
    if (educationData.honors) {
      educationInfo.honors = educationData.honors as EducationFormData['honors']
    }

    return Object.keys(educationInfo).length > 0 ? educationInfo : null
  },
)

// Infer the return type from the server function
type EducationData = Awaited<ReturnType<typeof getEducation>>

/**
 * Hook for fetching current user's education data
 *
 * @example
 * const { data: education, isLoading, error } = useEducation()
 */
export function useEducation(
  options?: Omit<UseQueryOptions<EducationData, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: educationKeys.detail(),
    queryFn: () => getEducation(),
    ...options,
  })
}
