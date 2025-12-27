import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { ThemeProvider } from '../components/theme-provider'
import { AbilityProvider } from '../components/ability-provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { AppAbilityRules } from '@/lib/casl'

const themeScript = `
  (function() {
    const storageKey = 'blitz-bar-theme';
    const theme = localStorage.getItem(storageKey);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = theme === 'dark' || (theme !== 'light' && systemDark) ? 'dark' : 'light';
    document.documentElement.classList.add(resolved);
  })();
`

type SerializableRules = Array<Record<string, any>>

export type SessionUserData = {
  id: string
  email: string
  name: string
  userType: string
  role: string
  userVerified: boolean
  firstName?: string | null
  lastName?: string | null
  middleInitial?: string | null
  image?: string | null
} | null

const getAbilityRulesServerFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ rules: SerializableRules; user: SessionUserData }> => {
    const { getAbilityRules } = await import('@/lib/casl/server')
    const { rules, user } = await getAbilityRules()
    return { rules: rules as SerializableRules, user: user as SessionUserData }
  },
)

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const { rules, user } = await getAbilityRulesServerFn()
    return { abilityRules: rules, sessionUser: user }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => <div>404... This page could not be found.</div>,
  shellComponent: RootDocument,
})

function RootComponent() {
  const { abilityRules } = Route.useRouteContext()

  return (
    <AbilityProvider rules={abilityRules as AppAbilityRules}>
      <Outlet />
    </AbilityProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <ThemeProvider defaultTheme="system" storageKey="blitz-bar-theme">
          {children}
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
