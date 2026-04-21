import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/AdminDashboard/Content')({
  component: ContentPage,
})

function ContentPage() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold">Content</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Content management goes here.
      </p>
    </section>
  )
}