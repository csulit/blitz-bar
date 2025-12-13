import {
  admin,
  customSession,
  lastLoginMethod,
  multiSession,
  organization,
  twoFactor,
} from 'better-auth/plugins'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import * as schema from '@/db/schema'
import { db } from '@/db'
import { resend } from '@/lib/resend'
import { ForgotPasswordEmail } from '@/emails/forgot-password'
import { ChangePasswordSuccessEmail } from '@/emails/change-password-success'
import { env } from '@/env'

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
      userType: {
        type: 'string',
        required: false,
        defaultValue: 'Employee',
        input: true,
      },
      userVerified: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
      firstName: {
        type: 'string',
        required: false,
        input: true,
      },
      middleInitial: {
        type: 'string',
        required: false,
        input: true,
      },
      lastName: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    sendResetPassword: async ({
      user,
      url,
    }: {
      user: { email: string; firstName?: string }
      url: string
    }) => {
      await resend.emails.send({
        from: 'Acme Inc <noreply@acmeinc.com>',
        to: user.email,
        subject: 'Reset your password',
        react: ForgotPasswordEmail({
          resetLink: url,
          userFirstName: user.firstName,
        }),
      })
    },
    resetPasswordTokenExpiresIn: 3600,
    afterResetPassword: async ({
      user,
    }: {
      user: { email: string; firstName?: string }
    }) => {
      const loginUrl = `${env.VITE_APP_URL || 'http://localhost:3000'}/login`
      await resend.emails.send({
        from: 'Acme Inc <noreply@acmeinc.com>',
        to: user.email,
        subject: 'Your password has been changed',
        react: ChangePasswordSuccessEmail({
          userName: user.firstName,
          loginUrl,
        }),
      })
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          // Modify the user object before it is created

          if (ctx) {
            console.log(ctx.body)
          }

          return {
            data: {
              // Ensure to return Better-Auth named fields, not the original field names in your database.
              ...user,
              firstName: user?.name.split(' ')[0],
              lastName: user?.name.split(' ')[1],
            },
          }
        },
        after: async (user) => {
          // perform additional actions, like creating a stripe customer
          console.log('New user created:', user)
        },
      },
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
          userType: 'query database to get the user type',
          role: 'query database to get the user role',
        },
        session,
      }
    }),
  ],
})
