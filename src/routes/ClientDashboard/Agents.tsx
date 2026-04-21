import { createFileRoute } from '@tanstack/react-router'
import { MapPin, Plus, UsersRound } from 'lucide-react'

export const Route = createFileRoute('/ClientDashboard/Agents')({
  component: AgentsPage,
})

type ClientAgentsPageProps = {
  hasAgents?: boolean
  onAddLocation?: () => void
}

type EmptyStateCardProps = {
  title: string
  description: string
  actionLabel: string
  onAction?: () => void
}

function AddLocationButton({
  onClick,
  className = '',
}: {
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-600 transition hover:bg-teal-100 ${className}`}
    >
      <Plus className="h-4 w-4" />
      <span>إضافة موقع</span>
      <MapPin className="h-4 w-4" />
    </button>
  )
}

function EmptyStateCard({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateCardProps) {
  return (
    <div className="rounded-3xl border border-dashed border-teal-200 bg-[#F5FBFA] px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100">
          <UsersRound className="h-11 w-11 text-teal-600" strokeWidth={2.2} />
        </div>

        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
          {description}
        </p>

        <button
          type="button"
          onClick={onAction}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-50 px-5 py-3 text-sm font-bold text-teal-600 transition hover:bg-teal-100"
        >
          <Plus className="h-4 w-4" />
          <span>{actionLabel}</span>
          <MapPin className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function AgentsContent({ onAddLocation }: { onAddLocation?: () => void }) {
  return (
    <EmptyStateCard
      title="لا يوجد موظفين بعد"
      description="يتم إنشاء الموظف تلقائيًا عند إضافة موقع. أضف موقعك الأول للبدء."
      actionLabel="إضافة موقع"
      onAction={onAddLocation}
    />
  )
}

function AgentsPage({
  hasAgents = false,
  onAddLocation,
}: ClientAgentsPageProps) {
  return (
    <section dir="rtl" className="min-h-[calc(100vh-80px)] bg-white">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <AddLocationButton onClick={onAddLocation} />

          <div className="min-w-0 text-right">
            <h2 className="text-lg font-extrabold text-slate-900">الموظفين</h2>
            <p className="mt-1 text-sm text-slate-500">
              إدارة موظفي المواقع ومتابعة بياناتهم
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!hasAgents ? (
          <AgentsContent onAddLocation={onAddLocation} />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-right text-lg font-extrabold text-slate-900">
              قائمة الموظفين
            </h3>
            <p className="mt-2 text-right text-sm text-slate-500">
              هنا سيتم عرض الموظفين بعد ربط المواقع وإضافة البيانات.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}