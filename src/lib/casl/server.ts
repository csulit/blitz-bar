import { getRequest } from '@tanstack/react-start/server'
import { defineAbilityFor, type AppAbility, type SessionUser } from './ability'
import type { Action } from './actions'
import type { Subjects } from './subjects'

/**
 * Get ability instance for current request
 */
export async function getAbility(): Promise<{
  ability: AppAbility
  user: SessionUser | null
}> {
  const request = getRequest()
  const { auth } = await import('@/lib/auth')
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    return {
      ability: defineAbilityFor(null),
      user: null,
    }
  }

  const user = session.user as SessionUser
  const ability = defineAbilityFor(user)

  return { ability, user }
}

/**
 * Assert that the current user can perform an action
 * Throws if unauthorized
 */
export async function assertCan(
  action: Action,
  subject: Subjects,
  field?: string
): Promise<SessionUser> {
  const { ability, user } = await getAbility()

  if (!user) {
    throw new Error('Unauthorized: Not authenticated')
  }

  if (!ability.can(action, subject, field)) {
    throw new Error(`Forbidden: Cannot ${action} ${subject}`)
  }

  return user
}

/**
 * Check if current user can perform an action (non-throwing)
 */
export async function canDo(
  action: Action,
  subject: Subjects,
  field?: string
): Promise<boolean> {
  const { ability } = await getAbility()
  return ability.can(action, subject, field)
}

/**
 * Get ability rules for client-side hydration
 */
export async function getAbilityRules() {
  const { ability, user } = await getAbility()
  return {
    rules: ability.rules,
    user,
  }
}
