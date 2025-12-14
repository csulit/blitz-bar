import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { personalInfoKeys } from '../keys'
import { db } from '@/db'
import { user, profile } from '@/db/schema'
import type { PersonalInfoFormData } from '@/lib/schemas/personal-info'

type UpdatePersonalInfoInput = Partial<PersonalInfoFormData>

/**
 * Server function for updating personal info
 * Splits data between user table (name fields) and profile table (other fields)
 */
export const updatePersonalInfo = createServerFn({ method: 'POST' }).handler(
  async (ctx: { data: UpdatePersonalInfoInput }) => {
    const data = ctx.data
    const request = getRequest()
    const { auth } = await import('@/lib/auth')

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const userId = session.user.id

    // Split data into user fields and profile fields
    const userFields: Record<string, string | undefined> = {}
    const profileFields: Record<string, string | Date | undefined> = {}

    // User table fields
    if (data.firstName !== undefined) userFields.firstName = data.firstName
    if (data.middleInitial !== undefined)
      userFields.middleInitial = data.middleInitial
    if (data.lastName !== undefined) userFields.lastName = data.lastName

    // Profile table fields
    if (data.age !== undefined) profileFields.age = String(data.age)
    if (data.birthday !== undefined)
      profileFields.birthday = new Date(data.birthday)
    if (data.gender !== undefined) profileFields.gender = data.gender
    if (data.maritalStatus !== undefined)
      profileFields.maritalStatus = data.maritalStatus
    if (data.phoneNumber !== undefined)
      profileFields.phoneNumber = data.phoneNumber

    // Update user table if there are user fields
    if (Object.keys(userFields).length > 0) {
      await db.update(user).set(userFields).where(eq(user.id, userId))
    }

    // Upsert profile table if there are profile fields
    if (Object.keys(profileFields).length > 0) {
      await db
        .insert(profile)
        .values({
          userId,
          ...profileFields,
        })
        .onConflictDoUpdate({
          target: profile.userId,
          set: profileFields,
        })
    }

    return { success: true }
  },
)

/**
 * Hook for updating personal info
 * Designed for debounced auto-save - invalidates cache on success
 *
 * @example
 * const { mutate, mutateAsync, isPending } = useUpdatePersonalInfo()
 *
 * // Fire and forget (for debounced saves)
 * mutate({ firstName: 'John' })
 */
export function useUpdatePersonalInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdatePersonalInfoInput) =>
      updatePersonalInfo({ data: input }),
    onSuccess: () => {
      // Invalidate to keep cache in sync (optional for auto-save)
      queryClient.invalidateQueries({ queryKey: personalInfoKeys.all })
    },
    onError: (error) => {
      // Silent failure for auto-save - just log to console
      console.error('Failed to save personal info:', error)
    },
  })
}
