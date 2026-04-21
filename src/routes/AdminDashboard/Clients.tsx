import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useFilteredSearch } from '../../hooks/UseFilteredSearch'

export const Route = createFileRoute('/AdminDashboard/Clients')({
  component: ClientsPage,
})

type Client = {
  id: string
  username: string
  email: string
  phone: string
  branchesCount: number
  businessType: string
}

const fakeClients: Client[] = [
  {
    id: 'CLI-1001',
    username: 'Taste Restaurant',
    email: 'taste@ksa.com',
    phone: '+966 50 123 4567',
    branchesCount: 2,
    businessType: 'Restaurant',
  },
  {
    id: 'CLI-1002',
    username: 'Almassa Hotel',
    email: 'almassa@ksa.com',
    phone: '+966 55 987 3321',
    branchesCount: 1,
    businessType: 'Hotel',
  },
  {
    id: 'CLI-1003',
    username: 'City Cafe',
    email: 'citycafe@ksa.com',
    phone: '+966 54 222 8899',
    branchesCount: 3,
    businessType: 'Cafe',
  },
  {
    id: 'CLI-1004',
    username: 'Alnoor Clinic',
    email: 'elnour@ksa.com',
    phone: '+966 53 444 7788',
    branchesCount: 1,
    businessType: 'Clinic',
  },
]

const CLIENT_SEARCH_FIELDS: (keyof Client)[] = [
  'id',
  'email',
  'username',
]

function ClientsPage() {
  const [search, setSearch] = useState('')

  const filteredClients = useFilteredSearch(
    fakeClients,
    search,
    CLIENT_SEARCH_FIELDS
  )

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto w-[90%] max-w-none space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-right">
              <h1 className="text-2xl font-extrabold text-slate-900">
                العملاء
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                جميع الحسابات المسجلة في النظام
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بـ ID أو البريد الإلكتروني أو كلمة..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-right text-sm outline-none focus:border-slate-400 lg:w-[320px]"
            />
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full table-fixed text-right text-base">
            <thead className="bg-slate-100">
              <tr className="text-sm font-semibold text-slate-700">
                <th className="w-[24%] px-2 py-3">اسم المستخدم</th>
                <th className="w-[24%] px-2 py-3">البريد الإلكتروني</th>
                <th className="w-[20%] px-2 py-3">رقم الهاتف</th>
                <th className="w-[16%] px-2 py-3">عدد الفروع</th>
                <th className="w-[16%] px-2 py-3">نوع النشاط</th>
              </tr>
            </thead>

            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-t border-slate-100 text-sm text-slate-700"
                  >
                    <td className="truncate px-2 py-3 font-medium text-slate-900">
                      {client.username}
                    </td>

                    <td className="truncate px-2 py-3 text-slate-600">
                      {client.email}
                    </td>

                    <td className="truncate px-2 py-3 text-slate-600">
                      {client.phone}
                    </td>

                    <td className="px-2 py-3">{client.branchesCount}</td>

                    <td className="truncate px-2 py-3">{client.businessType}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    لا توجد نتائج
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