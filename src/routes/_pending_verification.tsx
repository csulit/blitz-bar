import { Link, Outlet, createFileRoute, useRouter } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
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
import { withSessionMiddleware } from '@/middleware/with-session'

export const Route = createFileRoute('/_pending_verification')({
  component: PendingVerificationLayout,
  server: {
    middleware: [withSessionMiddleware],
  },
})

function PendingVerificationLayout() {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.navigate({ to: '/login' })
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Dashed Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 0',
          maskImage: `
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            )
          `,
          WebkitMaskImage: `
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            )
          `,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      />

      {/* Floating Navigation */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center gap-1 rounded-full border border-border/50 bg-background/95 backdrop-blur-md px-2 py-1.5 shadow-lg shadow-black/5">
          <Link
            to="/verification-status"
            className="min-w-25 text-center px-4 py-1.5 text-sm rounded-full transition-colors text-muted-foreground hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
            activeProps={{
              'data-status': 'active',
              className:
                'min-w-[100px] text-center px-4 py-1.5 text-sm rounded-full bg-primary text-primary-foreground font-medium',
            }}
          >
            Status
          </Link>
          <Link
            to="/verification-documents"
            className="min-w-25 text-center px-4 py-1.5 text-sm rounded-full transition-colors text-muted-foreground hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
            activeProps={{
              'data-status': 'active',
              className:
                'min-w-[100px] text-center px-4 py-1.5 text-sm rounded-full bg-primary text-primary-foreground font-medium',
            }}
          >
            Documents
          </Link>
        </nav>
      </div>

      {/* Brand & Mode Toggle */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          to="/"
          className="font-display text-lg tracking-tight hover:text-primary transition-colors"
        >
          My Home Support
        </Link>
      </div>
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <ModeToggle />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
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

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 p-6 pt-24 md:p-10 md:pt-24">
        <Outlet />
      </div>
    </div>
  )
}
