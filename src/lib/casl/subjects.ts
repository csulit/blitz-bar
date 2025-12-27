import type { InferSelectModel } from 'drizzle-orm'
import type {
  education,
  identityDocument,
  invitation,
  jobHistory,
  member,
  organization,
  profile,
  user,
  userVerification,
  verificationAuditLog,
} from '@/db/schema'

// Infer types from Drizzle schema
export type User = InferSelectModel<typeof user>
export type Organization = InferSelectModel<typeof organization>
export type Member = InferSelectModel<typeof member>
export type UserVerification = InferSelectModel<typeof userVerification>
export type IdentityDocument = InferSelectModel<typeof identityDocument>
export type Education = InferSelectModel<typeof education>
export type JobHistory = InferSelectModel<typeof jobHistory>
export type Profile = InferSelectModel<typeof profile>
export type VerificationAuditLog = InferSelectModel<typeof verificationAuditLog>
export type Invitation = InferSelectModel<typeof invitation>

// Define subject types for CASL (string literals)
export type Subjects =
  | 'User'
  | 'Organization'
  | 'Member'
  | 'UserVerification'
  | 'IdentityDocument'
  | 'Education'
  | 'JobHistory'
  | 'Profile'
  | 'VerificationAuditLog'
  | 'Invitation'
  | 'Dashboard'
  | 'all'
