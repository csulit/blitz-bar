import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const user = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    firstName: text('first_name'),
    middleInitial: text('middle_initial'),
    lastName: text('last_name'),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    twoFactorEnabled: boolean('two_factor_enabled').default(false),
    role: text('role').default('user'),
    userType: text('user_type').default('Employee'),
    userVerified: boolean('user_verified').default(false),
    banned: boolean('banned').default(false),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires'),
  },
  (table) => [index('user_email_idx').on(table.email)],
)

export const session = pgTable(
  'session',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    activeOrganizationId: uuid('active_organization_id'),
    impersonatedBy: uuid('impersonated_by'),
  },
  (table) => [
    index('session_userId_idx').on(table.userId),
    index('session_token_idx').on(table.token),
  ],
)

export const account = pgTable(
  'account',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
)

export const verification = pgTable(
  'verification',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

export const twoFactor = pgTable(
  'two_factor',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('twoFactor_secret_idx').on(table.secret),
    index('twoFactor_userId_idx').on(table.userId),
  ],
)

export const organization = pgTable('organization', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull(),
  metadata: text('metadata'),
})

export const member = pgTable(
  'member',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: text('role').default('member').notNull(),
    createdAt: timestamp('created_at').notNull(),
  },
  (table) => [
    index('member_organizationId_idx').on(table.organizationId),
    index('member_userId_idx').on(table.userId),
  ],
)

export const invitation = pgTable(
  'invitation',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: text('role'),
    status: text('status').default('pending').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    inviterId: uuid('inviter_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('invitation_organizationId_idx').on(table.organizationId),
    index('invitation_email_idx').on(table.email),
  ],
)

export const profile = pgTable(
  'profile',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: 'cascade' }),
    age: text('age'),
    birthday: timestamp('birthday'),
    gender: text('gender'),
    maritalStatus: text('marital_status'),
    phoneNumber: text('phone_number'),
    // Address fields for job matching
    city: text('city'),
    province: text('province'),
    // Employment preferences
    expectedSalary: text('expected_salary'), // Stored as text to handle ranges like "25000-30000"
    employmentStatus: text('employment_status'), // 'full-time' | 'part-time' | 'contractual' | 'freelance'
    availabilityDate: timestamp('availability_date'), // When they can start work
  },
  (table) => [index('profile_userId_idx').on(table.userId)],
)

export const identityDocument = pgTable(
  'identity_document',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    documentType: text('document_type').notNull(), // 'identity_card' | 'driver_license' | 'passport'
    frontImageUrl: text('front_image_url').notNull(),
    backImageUrl: text('back_image_url'),
    status: text('status').default('pending').notNull(), // 'pending' | 'verified' | 'rejected'
    rejectionReason: text('rejection_reason'),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
    verifiedAt: timestamp('verified_at'),
    verifiedBy: uuid('verified_by').references(() => user.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('identity_document_userId_idx').on(table.userId),
    index('identity_document_status_idx').on(table.status),
  ],
)

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  twoFactors: many(twoFactor),
  members: many(member),
  invitations: many(invitation),
  profile: one(profile),
  identityDocuments: many(identityDocument, { relationName: 'documentOwner' }),
  educations: many(education),
  jobHistories: many(jobHistory),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}))

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}))

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}))

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}))

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
}))

export const identityDocumentRelations = relations(
  identityDocument,
  ({ one }) => ({
    user: one(user, {
      fields: [identityDocument.userId],
      references: [user.id],
      relationName: 'documentOwner',
    }),
    verifier: one(user, {
      fields: [identityDocument.verifiedBy],
      references: [user.id],
      relationName: 'documentVerifier',
    }),
  }),
)

// Philippine Educational Levels:
// - elementary: Elementary (Grades 1-6)
// - junior_high: Junior High School (Grades 7-10)
// - senior_high: Senior High School (Grades 11-12)
// - vocational: Vocational/Technical (TESDA)
// - college: College/University (Bachelor's)
// - postgraduate: Post-Graduate (Master's, Doctorate)
export const education = pgTable(
  'education',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    level: text('level').notNull(), // 'elementary' | 'junior_high' | 'senior_high' | 'vocational' | 'college' | 'postgraduate'
    schoolName: text('school_name').notNull(),
    schoolAddress: text('school_address'), // City/Municipality, Province
    degree: text('degree'), // For college: Bachelor of Science in Computer Science
    course: text('course'), // For vocational: TESDA course name
    track: text('track'), // For senior high: Academic, TVL, Sports, Arts & Design
    strand: text('strand'), // For senior high: STEM, ABM, HUMSS, GAS, etc.
    yearStarted: text('year_started'),
    yearGraduated: text('year_graduated'), // Can be 'Present' or year
    isCurrentlyEnrolled: boolean('is_currently_enrolled').default(false),
    honors: text('honors'), // e.g., "With Honors", "Cum Laude", "Magna Cum Laude"
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('education_userId_idx').on(table.userId),
    index('education_level_idx').on(table.level),
  ],
)

export const educationRelations = relations(education, ({ one }) => ({
  user: one(user, {
    fields: [education.userId],
    references: [user.id],
  }),
}))

export const jobHistory = pgTable(
  'job_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    companyName: text('company_name').notNull(),
    position: text('position').notNull(),
    startMonth: text('start_month').notNull(), // "YYYY-MM" format
    endMonth: text('end_month'), // "YYYY-MM" format, null if current job
    isCurrentJob: boolean('is_current_job').default(false),
    summary: text('summary').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('job_history_userId_idx').on(table.userId)],
)

export const jobHistoryRelations = relations(jobHistory, ({ one }) => ({
  user: one(user, {
    fields: [jobHistory.userId],
    references: [user.id],
  }),
}))

// Tracks the overall user verification submission status
// This is separate from identityDocument.status which tracks document review
export const userVerification = pgTable(
  'user_verification',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: text('status').default('draft').notNull(), // 'draft' | 'submitted' | 'verified' | 'rejected' | 'info_requested'
    submittedAt: timestamp('submitted_at'),
    verifiedAt: timestamp('verified_at'),
    verifiedBy: uuid('verified_by').references(() => user.id),
    rejectionReason: text('rejection_reason'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('user_verification_userId_idx').on(table.userId),
    index('user_verification_status_idx').on(table.status),
  ],
)

export const userVerificationRelations = relations(
  userVerification,
  ({ one, many }) => ({
    user: one(user, {
      fields: [userVerification.userId],
      references: [user.id],
      relationName: 'verificationOwner',
    }),
    verifier: one(user, {
      fields: [userVerification.verifiedBy],
      references: [user.id],
      relationName: 'verificationVerifier',
    }),
    auditLogs: many(verificationAuditLog),
  }),
)

// Tracks all admin actions on verification submissions for audit trail
export const verificationAuditLog = pgTable(
  'verification_audit_log',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    verificationId: uuid('verification_id')
      .notNull()
      .references(() => userVerification.id, { onDelete: 'cascade' }),
    adminUserId: uuid('admin_user_id')
      .notNull()
      .references(() => user.id),
    action: text('action').notNull(), // 'approved' | 'rejected' | 'info_requested'
    reason: text('reason'),
    previousStatus: text('previous_status').notNull(),
    newStatus: text('new_status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('verification_audit_log_verificationId_idx').on(table.verificationId),
    index('verification_audit_log_adminUserId_idx').on(table.adminUserId),
  ],
)

export const verificationAuditLogRelations = relations(
  verificationAuditLog,
  ({ one }) => ({
    verification: one(userVerification, {
      fields: [verificationAuditLog.verificationId],
      references: [userVerification.id],
    }),
    admin: one(user, {
      fields: [verificationAuditLog.adminUserId],
      references: [user.id],
    }),
  }),
)
