import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useFilteredSearch } from '../../hooks/UseFilteredSearch'
import { useLocale } from '../../contexts/LocaleContext'

export const Route = createFileRoute('/AdminDashboard/Clients')({
  component: ClientsPage,
})

type BillingPlan = 'monthly' | 'quarterly' | 'yearly' | null

type Client = {
  id: string
  username: string
  email: string
  phone: string
  branchesCount: number
  businessType: string
  isSubscribed: boolean
  plan: BillingPlan
}

const fakeClients: Client[] = [
  {
    id: 'CLI-1001',
    username: 'Taste Restaurant',
    email: 'taste@ksa.com',
    phone: '+966 50 123 4567',
    branchesCount: 2,
    businessType: 'Restaurant',
    isSubscribed: true,
    plan: 'monthly',
  },
  {
    id: 'CLI-1002',
    username: 'Almassa Hotel',
    email: 'almassa@ksa.com',
    phone: '+966 55 987 3321',
    branchesCount: 1,
    businessType: 'Hotel',
    isSubscribed: false,
    plan: null,
  },
  {
    id: 'CLI-1003',
    username: 'City Cafe',
    email: 'citycafe@ksa.com',
    phone: '+966 54 222 8899',
    branchesCount: 3,
    businessType: 'Cafe',
    isSubscribed: true,
    plan: 'quarterly',
  },
  {
    id: 'CLI-1004',
    username: 'Alnoor Clinic',
    email: 'elnour@ksa.com',
    phone: '+966 53 444 7788',
    branchesCount: 1,
    businessType: 'Clinic',
    isSubscribed: true,
    plan: 'yearly',
  },
]

const CLIENT_SEARCH_FIELDS: (keyof Client)[] = [
  'id',
  'email',
  'username',
  'businessType',
]

function ClientsPage() {
  const { t, dir, isRTL } = useLocale()
  const p = t.adminPages.clients
  const [search, setSearch] = useState('')

  const filteredClients = useFilteredSearch(fakeClients, search, CLIENT_SEARCH_FIELDS)

  const textAlign = isRTL ? 'text-right' : 'text-left'

  function getPlanLabel(plan: BillingPlan) {
    if (!plan) return '—'
    return p.plans[plan]
  }

  return (
    <section dir={dir} className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto w-[90%] max-w-none space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${isRTL ? '' : 'flex-row-reverse'}`}>
            <div className={textAlign}>
              <h1 className="text-2xl font-extrabold text-slate-900">{p.title}</h1>
              <p className="mt-1 text-sm text-slate-500">{p.subtitle}</p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={p.searchPlaceholder}
              className={`w-full rounded-xl border border-slate-200 px-4 py-2.5 ${textAlign} text-sm outline-none focus:border-slate-400 lg:w-[320px]`}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className={`w-full min-w-[1150px] table-fixed ${textAlign} text-base`}>
            <thead className="bg-slate-100">
              <tr className="text-sm font-semibold text-slate-700">
                <th className="w-[17%] px-2 py-3">{p.table.username}</th>
                <th className="w-[20%] px-2 py-3">{p.table.email}</th>
                <th className="w-[16%] px-2 py-3">{p.table.phone}</th>
                <th className="w-[10%] px-2 py-3">{p.table.branches}</th>
                <th className="w-[12%] px-2 py-3">{p.table.businessType}</th>
                <th className="w-[12%] px-2 py-3">{p.table.subscriptionStatus}</th>
                <th className="w-[13%] px-2 py-3">{p.table.plan}</th>
              </tr>
            </thead>

            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="border-t border-slate-100 text-sm text-slate-700">
                    <td className="truncate px-2 py-3 font-medium text-slate-900">{client.username}</td>
                    <td className="truncate px-2 py-3 text-slate-600">{client.email}</td>
                    <td className="truncate px-2 py-3 text-slate-600">{client.phone}</td>
                    <td className="px-2 py-3">{client.branchesCount}</td>
                    <td className="truncate px-2 py-3">{client.businessType}</td>
                    <td className="px-2 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${client.isSubscribed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {client.isSubscribed ? p.table.subscribed : p.table.notSubscribed}
                      </span>
                    </td>
                    <td className="truncate px-2 py-3 font-medium text-slate-700">{getPlanLabel(client.plan)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                    {p.table.noResults}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
