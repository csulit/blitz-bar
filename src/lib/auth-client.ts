import { createAuthClient } from 'better-auth/client'
import {
  adminClient,
  inferAdditionalFields,
  multiSessionClient,
  organizationClient,
  twoFactorClient,
} from 'better-auth/client/plugins'
import type { auth } from './auth'

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    multiSessionClient(),
    twoFactorClient(),
    organizationClient(),
    adminClient(),
  ],
})
