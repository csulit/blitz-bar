import type { Action, Subjects } from '@/lib/casl'
import { useAbilityContext } from '@/components/ability-provider'

/**
 * Hook for checking abilities in components
 *
 * @example
 * const { can, cannot } = useAbility()
 *
 * if (can('approve', 'UserVerification')) {
 *   // Show approve button
 * }
 */
export function useAbility() {
  const ability = useAbilityContext()

  return {
    ability,
    can: (action: Action, subject: Subjects, field?: string) =>
      ability.can(action, subject, field),
    cannot: (action: Action, subject: Subjects, field?: string) =>
      ability.cannot(action, subject, field),
  }
}
