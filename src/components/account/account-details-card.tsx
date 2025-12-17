import { format } from 'date-fns'
import { IconShieldCheck } from '@tabler/icons-react'
import { InfoField } from './info-field'
import type { AccountData } from './hooks/queries/use-account'

interface AccountDetailsCardProps {
  account: AccountData
}

export function AccountDetailsCard({ account }: AccountDetailsCardProps) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <IconShieldCheck className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Account Details</h2>
            <p className="text-xs text-muted-foreground">Settings & status</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <InfoField label="Email" value={account.email} />
        <InfoField
          label="Email Verified"
          value={
            account.emailVerified ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                Yes
              </span>
            ) : (
              'No'
            )
          }
        />
        <InfoField label="Role" value={account.role} capitalize />
        <InfoField label="User Type" value={account.userType} />
        <InfoField
          label="Account Verified"
          value={
            account.userVerified ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                Yes
              </span>
            ) : (
              'No'
            )
          }
        />
        <InfoField
          label="Member Since"
          value={
            account.createdAt
              ? format(new Date(account.createdAt), 'MMM d, yyyy')
              : null
          }
        />
      </div>
    </section>
  )
}
