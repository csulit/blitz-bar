import { createFileRoute } from '@tanstack/react-router'
import {
  AccountDetailsCard,
  AccountPageSkeleton,
  EducationCard,
  JobHistoryCard,
  PersonalInfoCard,
  ProfileHeader,
} from '@/components/account'
import { accountKeys } from '@/components/account/hooks/keys'
import {
  getAccountData,
  useAccount,
} from '@/components/account/hooks/queries/use-account'

export const Route = createFileRoute('/_main/account')({
  component: AccountPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: accountKeys.detail(),
      queryFn: () => getAccountData(),
    })
  },
  pendingComponent: AccountPageSkeleton,
})

function AccountPage() {
  const { data: account } = useAccount()

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
      <ProfileHeader account={account} />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PersonalInfoCard account={account} />
        <AccountDetailsCard account={account} />
        <EducationCard education={account.education} />
        <JobHistoryCard jobHistory={account.jobHistory} />
      </div>
    </div>
  )
}
