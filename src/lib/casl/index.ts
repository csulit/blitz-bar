// Core ability exports
export { defineAbilityFor, createAbilityFromRules } from './ability'
export type {
  AppAbility,
  AppAbilityRules,
  SessionUser,
  Role,
  UserType,
} from './ability'

// Actions and subjects
export { Actions } from './actions'
export type { Action } from './actions'
export type { Subjects } from './subjects'

// Re-export client components for convenience
export {
  Can,
  AbilityProvider,
  useAbilityContext,
} from '@/components/ability-provider'
export { useAbility } from '@/hooks/use-ability'
