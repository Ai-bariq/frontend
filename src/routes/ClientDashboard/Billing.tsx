import { createFileRoute } from '@tanstack/react-router'
import {
  CalendarDays,
  CreditCard,
  FileText,
  Plus,
  Receipt,
} from 'lucide-react'

export const Route = createFileRoute('/ClientDashboard/Billing')({
  component: BillingPage,
})

type PlanStatus = 'inactive' | 'active'

type BillingPlan = {
  name: string
  priceLabel: string
  renewalDate: string
  status: PlanStatus
}

type Invoice = {
  id: string
  number: string
  amount: string
  date: string
}

const currentPlan: BillingPlan = {
  name: 'none',
  priceLabel: 'شهريًا',
  renewalDate: 'April 18, 2026',
  status: 'inactive',
}

const invoices: Invoice[] = []

function BillingPage() {
  return (
    <section dir="rtl" className="min-h-[calc(100vh-80px)] bg-white">
      <div className="px-6 py-8">
        <PageHeader />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ActiveLocationsCard count={0} />
          <CurrentPlanCard plan={currentPlan} />
        </div>

        <div className="mt-4">
          <InvoicesCard invoices={invoices} />
        </div>
      </div>
    </section>
  )
}

function PageHeader() {
  return (
    <header className="mb-6 text-right">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        الاشتراك والفواتير
      </h1>
      <p className="mt-2 text-base text-slate-500">
        إدارة اشتراكك وطرق الدفع وسجل الفواتير
      </p>
    </header>
  )
}

function CardShell({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </section>
  )
}

function SectionHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="text-right">
      <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  )
}

function StatusBadge({ status }: { status: PlanStatus }) {
  const isActive = status === 'active'

  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-extrabold ${
        isActive ? 'bg-teal-600 text-white' : 'bg-slate-500 text-white'
      }`}
    >
      {isActive ? 'نشط' : 'غير مشترك'}
    </span>
  )
}

function ActiveLocationsCard({ count }: { count: number }) {
  return (
    <CardShell>
      <div className="flex items-start justify-between gap-4">
        <SectionHeader title={`المواقع النشطة (${count})`} />
      </div>

      <div className="mt-8 space-y-4">
        <div className="h-2 rounded-full bg-slate-100" />

        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة موقع</span>
        </button>
      </div>
    </CardShell>
  )
}

function CurrentPlanCard({ plan }: { plan: BillingPlan }) {
  return (
    <CardShell>
      <div className="flex items-start justify-between gap-4">
        <SectionHeader title="الخطة الحالية" />
        <StatusBadge status={plan.status} />
      </div>

      <div className="mt-8 flex flex-col items-end text-right">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-sm">{plan.priceLabel}</span>
          <span className="text-base font-bold text-slate-900">{plan.name}</span>
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays className="h-4 w-4" />
          <span>تاريخ الدورة التالية: {plan.renewalDate}</span>
        </div>
      </div>
    </CardShell>
  )
}

function InvoicesCard({ invoices }: { invoices: Invoice[] }) {
  const hasInvoices = invoices.length > 0

  return (
    <CardShell className="min-h-[360px]">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader
          title="الفواتير"
          description="سجل الفواتير والمدفوعات الخاصة بك"
        />
      </div>

      {hasInvoices ? (
        <div className="mt-6 space-y-3">
          {invoices.map((invoice) => (
            <InvoiceRow key={invoice.id} invoice={invoice} />
          ))}
        </div>
      ) : (
        <EmptyInvoicesState />
      )}
    </CardShell>
  )
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <CreditCard className="h-4 w-4" />
        <span>{invoice.amount}</span>
      </div>

      <div className="flex flex-col items-end text-right">
        <p className="text-sm font-extrabold text-slate-900">
          فاتورة #{invoice.number}
        </p>
        <p className="mt-1 text-sm text-slate-500">{invoice.date}</p>
      </div>
    </div>
  )
}

function EmptyInvoicesState() {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
        <Receipt className="h-8 w-8 text-slate-300" />
      </div>

      <h3 className="mt-5 text-xl font-extrabold text-slate-700">
        لا توجد فواتير بعد
      </h3>

      <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
        ستظهر الفواتير هنا بمجرد بدء اشتراكك
      </p>
    </div>
  )
}