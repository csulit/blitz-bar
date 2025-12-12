import { createAuthClient } from 'better-auth/client'
import {
  organizationClient,
  twoFactorClient,
  adminClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins'
import type { auth } from './auth'

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    twoFactorClient(),
    organizationClient(),
    adminClient(),
  ],
})
