import { createRouter, Link } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { IconArrowLeft } from '@tabler/icons-react'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import { Button } from '@/components/ui/button'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

function NotFoundComponent() {
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

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: 'intent',
    defaultNotFoundComponent: NotFoundComponent,
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          {props.children}
        </TanstackQuery.Provider>
      )
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
