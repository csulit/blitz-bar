import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { ModeToggle } from '@/components/mode-toggle'
import { FieldDescription } from '@/components/ui/field'
import { withSessionMiddleware } from '@/middleware/with-session'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  server: {
    middleware: [withSessionMiddleware],
  },
})

function AuthLayout() {
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
      <div className="absolute top-6 right-6 z-20">
        <ModeToggle />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
        <Outlet />
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{' '}
          <Link
            to="/terms"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            to="/privacy"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </FieldDescription>
      </div>
    </div>
  )
}
