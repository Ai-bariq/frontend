import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/AdminDashboard/Analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Analytics content goes here.
      </p>
    </section>
  )
}