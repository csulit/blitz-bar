import { Link, createFileRoute } from '@tanstack/react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/$')({
  component: NotFound,
})

function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <span className="font-display text-8xl tracking-tight text-foreground sm:text-9xl">
        404
      </span>

      <div className="mt-6 flex max-w-md flex-col items-center text-center">
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div className="mt-8">
          <Button asChild>
            <Link to="/">
              <IconArrowLeft className="size-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
