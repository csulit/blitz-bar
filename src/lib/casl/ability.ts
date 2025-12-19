import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
  type RawRuleOf,
} from '@casl/ability'
import type { Action } from './actions'
import type { Subjects } from './subjects'

// User roles from existing schema
export type Role = 'admin' | 'user' | 'partner'
export type UserType = 'Employee' | 'Employer' | 'Agency'

// Session user type (matches Better-Auth custom session)
export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
  userType: UserType
  userVerified: boolean
  firstName?: string | null
  lastName?: string | null
  middleInitial?: string | null
}

// CASL Ability type - use `any` for conditions since we use string-based subjects
export type AppAbility = MongoAbility<[Action, Subjects]>

// Raw rules type for serialization
export type AppAbilityRules = RawRuleOf<AppAbility>[]

/**
 * Defines abilities for a given user
 * Admin role has elevated permissions that supersede userType
 */
export function defineAbilityFor(user: SessionUser | null): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (!user) {
    // Unauthenticated users have no abilities
    return build()
  }

  // ============================================
  // ADMIN ROLE - Elevated permissions
  // ============================================
  if (user.role === 'admin') {
    // Admins can manage everything
    can('manage', 'all')
    return build()
  }

  // ============================================
  // BASE PERMISSIONS (all authenticated users)
  // ============================================

  // Users can read and update their own user record
  can('read', 'User')
  can('update', 'User')

  // Users can manage their own profile
  can('read', 'Profile')
  can('create', 'Profile')
  can('update', 'Profile')

  // Users can manage their own education records
  can('read', 'Education')
  can('create', 'Education')
  can('update', 'Education')
  can('delete', 'Education')

  // Users can manage their own job history
  can('read', 'JobHistory')
  can('create', 'JobHistory')
  can('update', 'JobHistory')
  can('delete', 'JobHistory')

  // Users can manage their own identity documents
  can('read', 'IdentityDocument')
  can('create', 'IdentityDocument')
  can('update', 'IdentityDocument')
  can('delete', 'IdentityDocument')

  // Users can read/submit their own verification
  can('read', 'UserVerification')
  can('submit', 'UserVerification')

  // ============================================
  // USERTYPE-SPECIFIC PERMISSIONS
  // ============================================

  switch (user.userType) {
    case 'Employee':
      // Employees have base permissions only
      // Can view job postings, apply for jobs, etc.
      break

    case 'Employer':
      // Employers can manage organizations they own
      can('create', 'Organization')
      can('read', 'Organization')
      can('update', 'Organization')

      // Employers can manage members in their organizations
      can('invite', 'Member')
      can('remove', 'Member')
      can('read', 'Member')

      // Employers can manage invitations
      can('create', 'Invitation')
      can('read', 'Invitation')
      can('delete', 'Invitation')

      // Employers can view the workforce dashboard
      can('read', 'Dashboard')
      break

    case 'Agency':
      // Agencies have broader organization management
      can('create', 'Organization')
      can('read', 'Organization')
      can('update', 'Organization')
      can('delete', 'Organization')

      // Full member management
      can('manage', 'Member')

      // Full invitation management
      can('manage', 'Invitation')

      // Agencies can view the workforce dashboard
      can('read', 'Dashboard')
      break
  }

  return build()
}

/**
 * Create ability from serialized rules (for client-side hydration)
 */
export function createAbilityFromRules(rules: AppAbilityRules): AppAbility {
  return createMongoAbility<[Action, Subjects]>(rules)
}
