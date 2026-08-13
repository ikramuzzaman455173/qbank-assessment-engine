import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/question-banks/$bankId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/question-banks/$bankId"!</div>
}
