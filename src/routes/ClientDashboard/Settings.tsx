import { createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  Eye,
  ExternalLink,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
  KeyRound,
} from 'lucide-react'

export const Route = createFileRoute('/ClientDashboard/Settings')({
  component: SettingsPage,
})

type ProfileSettings = {
  name: string
  email: string
  phone: string
  googleAccountEmail: string
  avatarUrl: string
  isVerified: boolean
}

const profile: ProfileSettings = {
  name: 'rehab mahmoud',
  email: 'roby.mahmoud.rm@gmail.com',
  phone: '5X XXX XXXX',
  googleAccountEmail: 'roby.mahmoud.rm@gmail.com',
  avatarUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
  isVerified: true,
}

function SettingsPage() {
  return (
    <section dir="rtl" className="min-h-[calc(100vh-80px)] bg-white">
      <div className="px-6 py-8">
        <PageHeader />
        <ProfileCard profile={profile} />
        <PasswordCard />
        <DangerZoneCard />
      </div>
    </section>
  )
}

function PageHeader() {
  return (
    <header className="mb-6 text-right">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        الإعدادات
      </h1>
      <p className="mt-2 text-base text-slate-500">
        إدارة معلومات ملفك الشخصي
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
      className={`mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
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
      <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  )
}

function ProfileCard({ profile }: { profile: ProfileSettings }) {
  return (
    <CardShell>
      <div className="bg-[#EAF5F4] px-6 py-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          </div>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
            {profile.name}
          </h2>
          <p className="mt-1 text-lg text-slate-500">{profile.email}</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-5">
          <LabeledInput
            label="الاسم"
            icon={<User className="h-4 w-4" />}
            value={profile.name}
          />

          <div>
            <LabeledInput
              label="البريد الإلكتروني"
              icon={<Mail className="h-4 w-4" />}
              value={profile.email}
              readOnly
            />

            {profile.isVerified ? (
              <div className="mt-3 flex justify-start">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>
            ) : null}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between flex-row-reverse">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <ExternalLink className="h-4 w-4" />
                <span>إدارة</span>
              </button>

              <div className="flex items-center gap-2 text-slate-900">
                <span className="font-extrabold">حساب Google</span>
                <span className="text-base font-extrabold text-[#4285F4]">G</span>
              </div>
            </div>

            <input
              type="text"
              value={profile.googleAccountEmail}
              readOnly
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-right text-sm text-slate-500 outline-none"
            />

            <p className="mt-3 text-right text-sm leading-7 text-slate-500">
              حسابك مرتبط بـ Google. يمكنك إدارة إعدادات حساب Google الخاص بك من خارجياً.
            </p>
          </div>

          <LabeledInput
            label="رقم الجوال"
            icon={<Phone className="h-4 w-4" />}
            value={profile.phone}
          />

          <div className="flex justify-end pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-teal-700"
            >
              <Save className="h-4 w-4" />
              <span>حفظ التغييرات</span>
            </button>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

function PasswordCard() {
  return (
    <CardShell>
      <div className="px-6 py-6">
        <SectionHeader title="كلمة المرور" description="تغيير كلمة المرور" />

        <div className="mt-6 space-y-5">
          <PasswordInput label="كلمة المرور الجديدة" helperText="على الأقل 8 أحرف، حرف كبير، رقم" />
          <PasswordInput label="تأكيد كلمة المرور" />

          <div className="flex justify-end pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-teal-700"
            >
              <KeyRound className="h-4 w-4" />
              <span>تغيير كلمة المرور</span>
            </button>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

function DangerZoneCard() {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-red-300 bg-white shadow-sm">
      <div className="px-6 py-6">
        <div className="text-right">
          <h2 className="text-2xl font-extrabold text-red-600">منطقة الخطر</h2>
          <p className="mt-1 text-sm text-slate-500">إجراءات لا رجعة فيها</p>
        </div>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-700"
            >
              <span>حذف الحساب</span>
            </button>

            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-xl font-extrabold">
                  سيؤدي هذا إلى حذف حسابك وجميع البيانات نهائيًا
                </p>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                بمجرد حذف حسابك، لا يمكن التراجع. سيتم حذف جميع موظفيك وتقييماتك وردودك نهائيًا.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LabeledInput({
  label,
  icon,
  value,
  readOnly = false,
}: {
  label: string
  icon: React.ReactNode
  value: string
  readOnly?: boolean
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-start gap-2 text-slate-900">
        <span className="text-slate-400">{icon}</span>
        <span className="font-extrabold">{label}</span>
      </div>

      <input
        type="text"
        defaultValue={value}
        readOnly={readOnly}
        className={`h-12 w-full rounded-xl border border-slate-200 px-4 text-right text-sm outline-none ${
          readOnly ? 'bg-slate-50 text-slate-500' : 'bg-white text-slate-900'
        }`}
      />
    </div>
  )
}

function PasswordInput({
  label,
  helperText,
}: {
  label: string
  helperText?: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-start gap-2 text-slate-900">
        <span className="font-extrabold">{label}</span>
      </div>

      <div className="relative">
        <input
          type="password"
          className="h-12 w-full rounded-xl border border-slate-200 px-12 text-right text-sm text-slate-900 outline-none"
        />
        <button
          type="button"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {helperText && (
        <p className="mt-2 text-right text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  )
}