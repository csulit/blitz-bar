import { Outlet, createFileRoute, getRouteApi } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
// import { withSessionMiddleware } from '@/middleware/with-session'

export const Route = createFileRoute('/_main')({
  component: MainLayout,
  // server: {
  //   middleware: [withSessionMiddleware],
  // },
})

const rootRoute = getRouteApi('__root__')

function MainLayout() {
  const { sessionUser } = rootRoute.useRouteContext()

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" sessionUser={sessionUser} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
