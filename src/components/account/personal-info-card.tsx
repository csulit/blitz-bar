import { format } from 'date-fns'
import { IconCalendar, IconPhone, IconUser } from '@tabler/icons-react'
import { InfoField } from './info-field'
import type { AccountData } from './hooks/queries/use-account'

interface PersonalInfoCardProps {
  account: AccountData
}

export function PersonalInfoCard({ account }: PersonalInfoCardProps) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <IconUser className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Personal Information</h2>
            <p className="text-xs text-muted-foreground">Profile details</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <InfoField label="First Name" value={account.firstName} />
        <InfoField label="Middle Initial" value={account.middleInitial} />
        <InfoField label="Last Name" value={account.lastName} />
        <InfoField label="Age" value={account.profile?.age} />
        <InfoField
          label="Birthday"
          value={
            account.profile?.birthday
              ? format(new Date(account.profile.birthday), 'MMMM d, yyyy')
              : null
          }
          icon={<IconCalendar className="h-3.5 w-3.5" />}
        />
        <InfoField label="Gender" value={account.profile?.gender} capitalize />
        <InfoField
          label="Marital Status"
          value={account.profile?.maritalStatus}
          capitalize
        />
        <InfoField
          label="Phone Number"
          value={account.profile?.phoneNumber}
          icon={<IconPhone className="h-3.5 w-3.5" />}
        />
      </div>
    </section>
  )
}
