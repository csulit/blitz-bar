import { db } from '@/db'
import {
  twoFactor,
  lastLoginMethod,
  multiSession,
  organization,
  admin,
  customSession,
} from 'better-auth/plugins'
import { betterAuth } from 'better-auth'
import * as schema from '@/db/schema'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'partner',
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await Promise.resolve()
      console.log(
        `Send email to ${user.email} with reset password link: ${url}`,
      )
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  plugins: [
    tanstackStartCookies(),
    multiSession(),
    twoFactor(),
    lastLoginMethod(),
    organization(),
    admin(),
    customSession(async ({ user, session }) => {
      return {
        user: {
          ...user,
          role: 'query database to get the user role',
        },
        session,
      }
    }),
  ],
})
