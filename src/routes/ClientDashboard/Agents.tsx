import { createFileRoute } from '@tanstack/react-router'
import { MapPin, Plus, UsersRound } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'

export const Route = createFileRoute('/ClientDashboard/Agents')({
  component: AgentsPage,
})

function AgentsPage({ hasAgents = false }: { hasAgents?: boolean }) {
  const { t, dir, isRTL } = useLocale()
  const textAlign = isRTL ? 'text-right' : 'text-left'
  const headerRow = isRTL ? 'flex-row' : 'flex-row-reverse'

  return (
    <section dir={dir} className="min-h-[calc(100vh-80px)] bg-white">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className={`flex items-center justify-between gap-4 ${headerRow}`}>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-600 transition hover:bg-teal-100"
          >
            <Plus className="h-4 w-4" />
            <span>{t.clientPages.agents.addLocation}</span>
            <MapPin className="h-4 w-4" />
          </button>

          <div className={`min-w-0 ${textAlign}`}>
            <h2 className="text-lg font-extrabold text-slate-900">{t.clientPages.agents.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{t.clientPages.agents.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!hasAgents ? (
          <div className="rounded-3xl border border-dashed border-teal-200 bg-[#F5FBFA] px-6 py-16 sm:px-10">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100">
                <UsersRound className="h-11 w-11 text-teal-600" strokeWidth={2.2} />
              </div>
              <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {t.clientPages.agents.emptyTitle}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                {t.clientPages.agents.emptySubtitle}
              </p>
              <button
                type="button"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-50 px-5 py-3 text-sm font-bold text-teal-600 transition hover:bg-teal-100"
              >
                <Plus className="h-4 w-4" />
                <span>{t.clientPages.agents.addLocation}</span>
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${textAlign}`}>
            <h3 className="text-lg font-extrabold text-slate-900">{t.clientPages.agents.agentList}</h3>
            <p className="mt-2 text-sm text-slate-500">{t.clientPages.agents.agentListSubtitle}</p>
          </div>
        )}
      </div>
    </section>
  )
}
