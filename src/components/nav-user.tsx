import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  IconCheck,
  IconCreditCard,
  IconDotsVertical,
  IconLoader2,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconUserPlus,
  IconX,
} from '@tabler/icons-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { authClient } from '@/lib/auth-client'
import { useDeviceSessions, queryKeys, type DeviceSession } from '@/hooks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(' ')
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return initials || '??'
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [switchingSessionToken, setSwitchingSessionToken] = useState<
    string | null
  >(null)
  const [removingSessionToken, setRemovingSessionToken] = useState<
    string | null
  >(null)

  const { data: deviceSessions } = useDeviceSessions()

  // Filter out the current active session to show other accounts
  const otherSessions =
    deviceSessions?.filter(
      (session: DeviceSession) => session.user.email !== user.email,
    ) ?? []

  async function handleLogout() {
    await authClient.signOut()
    router.navigate({ to: '/login' })
  }

  async function handleSwitchAccount(sessionToken: string) {
    setSwitchingSessionToken(sessionToken)
    try {
      await authClient.multiSession.setActive({ sessionToken })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.deviceSessions.all,
      })
      router.invalidate()
    } catch (error) {
      console.error('Failed to switch account:', error)
    } finally {
      setSwitchingSessionToken(null)
    }
  }

  async function handleRemoveSession(
    e: React.MouseEvent,
    sessionToken: string,
  ) {
    e.stopPropagation()
    setRemovingSessionToken(sessionToken)
    try {
      await authClient.multiSession.revoke({ sessionToken })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.deviceSessions.all,
      })
    } catch (error) {
      console.error('Failed to remove session:', error)
    } finally {
      setRemovingSessionToken(null)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
                <IconCheck className="text-muted-foreground size-4" />
              </div>
            </DropdownMenuLabel>

            {otherSessions.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                    Switch account
                  </DropdownMenuLabel>
                  {otherSessions.map((session: DeviceSession) => (
                    <DropdownMenuItem
                      key={session.session.token}
                      onSelect={() =>
                        handleSwitchAccount(session.session.token)
                      }
                      disabled={
                        switchingSessionToken === session.session.token ||
                        removingSessionToken === session.session.token
                      }
                      className="group"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={session.user.image ?? undefined}
                          alt={session.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {getInitials(session.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {session.user.name}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {session.user.email}
                        </span>
                      </div>
                      {switchingSessionToken === session.session.token ? (
                        <IconLoader2 className="text-muted-foreground size-4 animate-spin" />
                      ) : removingSessionToken === session.session.token ? (
                        <IconLoader2 className="text-muted-foreground size-4 animate-spin" />
                      ) : (
                        <button
                          type="button"
                          onClick={(e) =>
                            handleRemoveSession(e, session.session.token)
                          }
                          className="hover:bg-destructive/10 hover:text-destructive hidden size-6 items-center justify-center rounded group-hover:flex"
                        >
                          <IconX className="size-4" />
                        </button>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/login">
                <IconUserPlus />
                Add another account
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/account">
                  <IconUserCircle />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setShowLogoutDialog(true)}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to sign out? You will need to sign in
                again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Sign out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
