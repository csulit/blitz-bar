import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl">Coming Soon</h1>
        <p className="text-muted-foreground mt-2">
          We're working on something great. Stay tuned!
        </p>
      </div>
    </div>
  )
}
