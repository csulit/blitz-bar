import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { id } = params
    return { id }
  },
})

function RouteComponent() {
  const { id } = Route.useParams()

  return <div>Hello "/user/$id"! {id}</div>
}
