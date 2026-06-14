import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, Link2, Mail, PlugZap, Unplug } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'

export const Route = createFileRoute('/ClientDashboard/Accounts')({
  component: AccountsPage,
})

type ConnectedAccount = {
  id: string
  provider: 'google'
  accountName: string
  status: 'active' | 'inactive'
  syncedLocationsCount: number
  connectedAt: string
  lastSyncAt: string
}

const connectedAccounts: ConnectedAccount[] = [
  {
    id: '1',
    provider: 'google',
    accountName: 'roby.mahmoud.rm@gmail.com',
    status: 'active',
    syncedLocationsCount: 0,
    connectedAt: '4/5/2026',
    lastSyncAt: '4/5/2026',
  },
]

function AccountsPage() {
  const { t, dir, isRTL } = useLocale()
  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <section dir={dir} className="min-h-[calc(100vh-80px)] bg-white">
      <div className="px-6 py-8">
        <header className={`mb-8 ${textAlign}`}>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{t.clientPages.accounts.title}</h1>
          <p className="mt-2 text-base text-slate-500">{t.clientPages.accounts.subtitle}</p>
        </header>

        <div className="space-y-4">
          {connectedAccounts.map((account) => (
            <article key={account.id} className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div className={`flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between ${isRTL ? '' : 'lg:flex-row-reverse'}`}>
                <div className={`flex flex-1 items-start justify-between gap-4 ${textAlign}`}>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                    <Mail className="h-6 w-6 text-slate-700" />
                  </div>

                  <div className={`flex min-w-0 flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                    <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${account.status === 'active' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <PlugZap className="h-3.5 w-3.5" />
                        {account.status === 'active' ? t.clientPages.accounts.active : t.clientPages.accounts.inactive}
                      </span>
                      <h2 className="text-lg font-extrabold text-slate-900">{account.accountName}</h2>
                    </div>

                    <p className={`mt-4 text-xl font-extrabold text-slate-900 ${textAlign}`}>{t.clientPages.accounts.googleProfile}</p>

                    <div className={`mt-4 space-y-2 text-sm text-slate-500 ${textAlign}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-slate-400"><Link2 className="h-4 w-4" /></span>
                        <span>{t.clientPages.accounts.locationsImported(account.syncedLocationsCount)}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-slate-400"><CalendarDays className="h-4 w-4" /></span>
                        <span>{t.clientPages.accounts.connected}: {account.connectedAt}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-slate-400"><CalendarDays className="h-4 w-4" /></span>
                        <span>{t.clientPages.accounts.lastSync}: {account.lastSyncAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Unplug className="h-4 w-4" />
                    <span>{t.clientPages.accounts.disconnect}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
