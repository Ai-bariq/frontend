import { createFileRoute } from '@tanstack/react-router'
import {
  CalendarDays,
  Link2,
  Mail,
  PlugZap,
  Unplug,
} from 'lucide-react'

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
  return (
    <section dir="rtl" className="min-h-[calc(100vh-80px)] bg-white">
      <div className="px-6 py-8">
        <AccountsPageHeader />
        <AccountsList accounts={connectedAccounts} />
      </div>
    </section>
  )
}

function AccountsPageHeader() {
  return (
    <header className="mb-8 text-right">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        الحسابات المتصلة
      </h1>
      <p className="mt-2 text-base text-slate-500">
        إدارة المنصات والتكاملات المتصلة
      </p>
    </header>
  )
}

function AccountsList({ accounts }: { accounts: ConnectedAccount[] }) {
  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <ConnectedAccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}

function ConnectedAccountCard({
  account,
}: {
  account: ConnectedAccount
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-start lg:justify-between">
        <div className="flex flex-1 items-start justify-between gap-4 text-right">
          <ProviderLogo provider={account.provider} />

          <div className="flex min-w-0 flex-col items-end">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                  account.status === 'active'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <PlugZap className="h-3.5 w-3.5" />
                {account.status === 'active' ? 'نشط' : 'غير نشط'}
              </span>

              <h2 className="text-lg font-extrabold text-slate-900">
                {account.accountName}
              </h2>
            </div>

            <p className="mt-4 text-right text-xl font-extrabold text-slate-900">
              ملف تعريف النشاط التجاري على جوجل
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <AccountInfoRow
                icon={<Link2 className="h-4 w-4" />}
                label={`${account.syncedLocationsCount} مواقع تم استيرادها`}
              />
              <AccountInfoRow
                icon={<CalendarDays className="h-4 w-4" />}
                label={`متصل: ${account.connectedAt}`}
              />
              <AccountInfoRow
                icon={<CalendarDays className="h-4 w-4" />}
                label={`آخر مزامنة: ${account.lastSyncAt}`}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <DisconnectButton />
        </div>
      </div>
    </article>
  )
}

function AccountInfoRow({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <span>{label}</span>
      <span className="text-slate-400">{icon}</span>
    </div>
  )
}

function DisconnectButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
    >
      <Unplug className="h-4 w-4" />
      <span>قطع الاتصال</span>
    </button>
  )
}

function ProviderLogo({ provider }: { provider: ConnectedAccount['provider'] }) {
  if (provider === 'google') {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
        <Mail className="h-6 w-6 text-slate-700" />
      </div>
    )
  }

  return null
}