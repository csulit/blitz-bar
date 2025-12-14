import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { educationKeys } from '../keys'
import type { EducationFormData } from '@/lib/schemas/education'
import { db } from '@/db'
import { education } from '@/db/schema'

type UpdateEducationInput = Partial<EducationFormData>

/**
 * Server function for updating education info
 * Uses upsert pattern - creates if not exists, updates if exists
 */
export const updateEducation = createServerFn({ method: 'POST' })
  .inputValidator((data: UpdateEducationInput) => data)
  .handler(async ({ data }) => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const userId = session.user.id

    // Build fields object, only including defined values
    const educationFields: Record<string, string | boolean | undefined> = {}

    if (data.level !== undefined) educationFields.level = data.level
    if (data.schoolName !== undefined)
      educationFields.schoolName = data.schoolName
    if (data.schoolAddress !== undefined)
      educationFields.schoolAddress = data.schoolAddress
    if (data.degree !== undefined) educationFields.degree = data.degree
    if (data.course !== undefined) educationFields.course = data.course
    if (data.track !== undefined) educationFields.track = data.track
    if (data.strand !== undefined) educationFields.strand = data.strand
    if (data.yearStarted !== undefined)
      educationFields.yearStarted = data.yearStarted
    if (data.yearGraduated !== undefined)
      educationFields.yearGraduated = data.yearGraduated
    if (data.isCurrentlyEnrolled !== undefined)
      educationFields.isCurrentlyEnrolled = data.isCurrentlyEnrolled
    if (data.honors !== undefined) educationFields.honors = data.honors

    // Only proceed if there are fields to update
    if (Object.keys(educationFields).length > 0) {
      // Check if user already has an education record
      const existing = await db.query.education.findFirst({
        where: eq(education.userId, userId),
      })

      if (existing) {
        // Update existing record
        await db
          .update(education)
          .set(educationFields)
          .where(eq(education.id, existing.id))
      } else {
        // Create new record (requires at least level and schoolName for insert)
        await db.insert(education).values({
          userId,
          level: educationFields.level as string,
          schoolName: (educationFields.schoolName as string) || '',
          ...educationFields,
        })
      }
    }

    return { success: true }
  })

/**
 * Hook for updating education info
 * Designed for debounced auto-save - invalidates cache on success
 *
 * @example
 * const { mutate, mutateAsync, isPending } = useUpdateEducation()
 *
 * // Fire and forget (for debounced saves)
 * mutate({ schoolName: 'MIT' })
 */
export function useUpdateEducation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateEducationInput) =>
      updateEducation({ data: input }),
    onSuccess: () => {
      // Invalidate to keep cache in sync (optional for auto-save)
      queryClient.invalidateQueries({ queryKey: educationKeys.all })
    },
    onError: (error) => {
      // Silent failure for auto-save - just log to console
      console.error('Failed to save education info:', error)
    },
  })
}
