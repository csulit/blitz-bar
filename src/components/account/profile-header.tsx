import { format } from 'date-fns'
import { IconMail, IconShieldCheck } from '@tabler/icons-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { AccountData } from './hooks/queries/use-account'

interface ProfileHeaderProps {
  account: AccountData
}

export function ProfileHeader({ account }: ProfileHeaderProps) {
  const fullName =
    account.firstName && account.lastName
      ? `${account.firstName}${account.middleInitial ? ` ${account.middleInitial}.` : ''} ${account.lastName}`
      : account.name

  const initials = fullName
    .trim()
    .split(' ')
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="rounded-xl border bg-card p-6 md:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage src={account.image ?? undefined} alt={fullName} />
            <AvatarFallback className="bg-muted text-xl font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          {account.userVerified && (
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-emerald-500 text-white">
              <IconShieldCheck className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl">{fullName}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <IconMail className="h-4 w-4" />
              {account.email}
              {account.emailVerified && (
                <Badge
                  variant="outline"
                  className="ml-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                >
                  Verified
                </Badge>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{account.userType}</Badge>
            <Badge variant="outline" className="capitalize">
              {account.role}
            </Badge>
            {account.userVerified && (
              <Badge className="bg-emerald-600 hover:bg-emerald-600">
                <IconShieldCheck className="mr-1 h-3 w-3" />
                Account Verified
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Member since{' '}
            {account.createdAt
              ? format(new Date(account.createdAt), 'MMMM d, yyyy')
              : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
