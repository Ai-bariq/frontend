import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/AdminDashboard/AdminSettings')({
  component: AdminSettingsPage,
})

type AdminProfile = {
  name: string
  email: string
}

const fakeAdmin: AdminProfile = {
  name: 'Admin User',
  email: 'admin@bareeq.ai',
}

function validateStrongPassword(password: string) {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('يجب أن تكون كلمة المرور 8 أحرف على الأقل')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف كبير واحد على الأقل')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف صغير واحد على الأقل')
  }

  if (!/\d/.test(password)) {
    errors.push('يجب أن تحتوي على رقم واحد على الأقل')
  }

  if (!/[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/.test(password)) {
    errors.push('يجب أن تحتوي على رمز خاص واحد على الأقل')
  }

  return errors
}

export default function AdminSettingsPage() {
  const [name, setName] = useState(fakeAdmin.name)
  const [email] = useState(fakeAdmin.email)

  const [showPasswordFields, setShowPasswordFields] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [nameMessage, setNameMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [deleteMessage, setDeleteMessage] = useState('')

  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [showDeleteBox, setShowDeleteBox] = useState(false)

  const handleSaveName = () => {
    if (!name.trim()) {
      setNameMessage('الاسم لا يمكن أن يكون فارغًا')
      return
    }

    setNameMessage('تم تحديث الاسم بنجاح')
  }

  const resetPasswordFields = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordMessage('')
    setPasswordErrors([])
  }

  const handleChangePassword = () => {
    setPasswordMessage('')
    setPasswordErrors([])

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('يرجى ملء جميع الحقول')
      return
    }

    const strongPasswordErrors = validateStrongPassword(newPassword)

    if (strongPasswordErrors.length > 0) {
      setPasswordErrors(strongPasswordErrors)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('تأكيد كلمة المرور غير متطابق')
      return
    }

    if (currentPassword === newPassword) {
      setPasswordMessage('يجب أن تكون كلمة المرور الجديدة مختلفة عن الحالية')
      return
    }

    setPasswordMessage('تم تحديث كلمة المرور بنجاح')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordErrors([])
    setShowPasswordFields(false)
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteMessage('اكتبي DELETE لتأكيد حذف الحساب')
      return
    }

    setDeleteMessage('تم حذف الحساب بنجاح')
  }

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-right">
            <h1 className="text-2xl font-extrabold text-slate-900">
              الإعدادات
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              إدارة بيانات الحساب وإعدادات الأمان
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-5 text-right">
            <h2 className="text-lg font-bold text-slate-900">
              بيانات الحساب
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              يمكنك تعديل اسم المسؤول فقط في هذه المرحلة
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-right">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                الاسم
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setNameMessage('')
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="text-right">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm text-slate-500 outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveName}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                حفظ التغييرات
              </button>
            </div>

            {nameMessage && (
              <p
                className={`text-right text-sm ${
                  nameMessage.includes('بنجاح')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {nameMessage}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-5 text-right">
            <h2 className="text-lg font-bold text-slate-900">
              كلمة المرور
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              يمكنك تغيير كلمة المرور عند الحاجة
            </p>
          </div>

          {!showPasswordFields ? (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowPasswordFields(true)
                  setPasswordMessage('')
                  setPasswordErrors([])
                }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                تغيير كلمة المرور
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-right">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value)
                    setPasswordMessage('')
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="text-right">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setPasswordMessage('')
                    setPasswordErrors([])
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-right">
                <p className="mb-2 text-sm font-medium text-slate-700">
                  يجب أن تحتوي كلمة المرور على:
                </p>
                <ul className="space-y-1 text-sm text-slate-500">
                  <li>• 8 أحرف على الأقل</li>
                  <li>• حرف كبير واحد على الأقل</li>
                  <li>• حرف صغير واحد على الأقل</li>
                  <li>• رقم واحد على الأقل</li>
                  <li>• رمز خاص واحد على الأقل</li>
                </ul>
              </div>

              <div className="text-right">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setPasswordMessage('')
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
                />
              </div>

              {passwordErrors.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-right">
                  <p className="mb-2 text-sm font-medium text-red-700">
                    كلمة المرور الجديدة غير قوية بما يكفي:
                  </p>
                  <ul className="space-y-1 text-sm text-red-600">
                    {passwordErrors.map((error) => (
                      <li key={error}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {passwordMessage && (
                <p
                  className={`text-right text-sm ${
                    passwordMessage.includes('بنجاح')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {passwordMessage}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowPasswordFields(false)
                    resetPasswordFields()
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  إلغاء
                </button>

                <button
                  onClick={handleChangePassword}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  تحديث كلمة المرور
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-red-200 bg-white p-5">
          <div className="mb-5 text-right">
            <h2 className="text-lg font-bold text-red-700">
              حذف الحساب
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              هذا الإجراء لا يمكن التراجع عنه
            </p>
          </div>

          {!showDeleteBox ? (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowDeleteBox(true)
                  setDeleteMessage('')
                }}
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
              >
                حذف الحساب
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-right">
                <p className="mb-2 text-sm text-slate-600">
                  لتأكيد الحذف، اكتبي:
                  <span className="mx-1 font-bold text-slate-900">DELETE</span>
                </p>

                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => {
                    setDeleteConfirmText(e.target.value)
                    setDeleteMessage('')
                  }}
                  className="w-full rounded-xl border border-red-200 px-4 py-3 text-right text-sm outline-none focus:border-red-400"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteBox(false)
                    setDeleteConfirmText('')
                    setDeleteMessage('')
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  إلغاء
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  تأكيد الحذف
                </button>
              </div>

              {deleteMessage && (
                <p
                  className={`text-right text-sm ${
                    deleteMessage.includes('بنجاح')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {deleteMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}