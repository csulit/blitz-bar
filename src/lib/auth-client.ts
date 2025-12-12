import { createAuthClient } from 'better-auth/client'
import {
  organizationClient,
  twoFactorClient,
  adminClient,
} from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [twoFactorClient(), organizationClient(), adminClient()],
})
