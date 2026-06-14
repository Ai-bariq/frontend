import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, CreditCard, Plus, Receipt } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'

export const Route = createFileRoute('/ClientDashboard/Billing')({
  component: BillingPage,
})

type PlanStatus = 'inactive' | 'active'
type BillingPlan = { name: string; renewalDate: string; status: PlanStatus }
type Invoice = { id: string; number: string; amount: string; date: string }

const currentPlan: BillingPlan = { name: 'none', renewalDate: 'April 18, 2026', status: 'inactive' }
const invoices: Invoice[] = []

function BillingPage() {
  const { t, dir, isRTL } = useLocale()
  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <section dir={dir} className="min-h-[calc(100vh-80px)] bg-white">
      <div className="px-6 py-8">
        <header className={`mb-6 ${textAlign}`}>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{t.clientPages.billing.title}</h1>
          <p className="mt-2 text-base text-slate-500">{t.clientPages.billing.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Active locations */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`flex items-start justify-between gap-4 ${isRTL ? '' : 'flex-row-reverse'}`}>
              <div className={textAlign}>
                <h2 className="text-xl font-extrabold text-slate-900">{t.clientPages.billing.activeLocations(0)}</h2>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="h-2 rounded-full bg-slate-100" />
              <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50">
                <Plus className="h-4 w-4" />
                <span>{t.clientPages.billing.addLocation}</span>
              </button>
            </div>
          </section>

          {/* Current plan */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`flex items-start justify-between gap-4 ${isRTL ? '' : 'flex-row-reverse'}`}>
              <div className={textAlign}>
                <h2 className="text-xl font-extrabold text-slate-900">{t.clientPages.billing.currentPlan}</h2>
              </div>
              <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-extrabold ${currentPlan.status === 'active' ? 'bg-teal-600 text-white' : 'bg-slate-500 text-white'}`}>
                {currentPlan.status === 'active' ? t.clientPages.billing.active : t.clientPages.billing.inactive}
              </span>
            </div>
            <div className={`mt-8 flex flex-col ${isRTL ? 'items-end' : 'items-start'} ${textAlign}`}>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-sm">{t.clientPages.billing.perPeriod}</span>
                <span className="text-base font-bold text-slate-900">{currentPlan.name}</span>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays className="h-4 w-4" />
                <span>{t.clientPages.billing.nextRenewal}: {currentPlan.renewalDate}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Invoices */}
        <div className="mt-4">
          <section className="min-h-[360px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`flex items-start justify-between gap-4 ${isRTL ? '' : 'flex-row-reverse'}`}>
              <div className={textAlign}>
                <h2 className="text-xl font-extrabold text-slate-900">{t.clientPages.billing.invoices}</h2>
                <p className="mt-1 text-sm text-slate-500">{t.clientPages.billing.invoicesSubtitle}</p>
              </div>
            </div>

            {invoices.length > 0 ? (
              <div className="mt-6 space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CreditCard className="h-4 w-4" />
                      <span>{invoice.amount}</span>
                    </div>
                    <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'} ${textAlign}`}>
                      <p className="text-sm font-extrabold text-slate-900">{t.clientPages.billing.invoiceLabel(invoice.number)}</p>
                      <p className="mt-1 text-sm text-slate-500">{invoice.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                  <Receipt className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-slate-700">{t.clientPages.billing.noInvoices}</h3>
                <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">{t.clientPages.billing.noInvoicesSubtitle}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  )
}
