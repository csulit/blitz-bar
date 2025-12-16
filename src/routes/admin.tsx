import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { IconArrowLeft, IconLogout } from '@tabler/icons-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

const getAdminSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const { auth } = await import('@/lib/auth')
  const session = await auth.api.getSession({ headers: request.headers })
  return session
})

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const session = await getAdminSession()

    if (!session) {
      throw redirect({ to: '/login' })
    }

    // Check if user has admin role
    const user = session.user as typeof session.user & { role?: string }
    if (user.role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }

    return { session }
  },
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <h1 className="font-display text-4xl">404 - Not Found</h1>
      <p className="text-muted-foreground">
        The admin page you're looking for doesn't exist.
      </p>
      <Link to="/admin" className="text-primary underline hover:no-underline">
        Back to Admin Dashboard
      </Link>
    </div>
  ),
  component: UserVerificationLayout,
})

function UserVerificationLayout() {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.navigate({ to: '/login' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="font-display text-lg tracking-tight hover:text-primary transition-colors"
            >
              My Home Support
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Verification Review</span>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconLogout className="h-4 w-4" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </AlertDialogTrigger>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
