import { useEffect, useMemo, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Clock3, Eye, EyeOff, Shield, Sparkles, Star, Bot } from 'lucide-react'
import logo from '../../assets/logo.png'
import googleImage from '../../assets/google.png'
import avatar from '../../assets/avatar.png'
import mapsImage from '../../assets/maps.png'
import { loginUser, signupUser } from '../../services/authServices'
import { API_URL } from '../../services/apiConfig'
import { useLocale } from '../../contexts/LocaleContext'
import LocaleToggle from '../UI/LocaleToggle'
import { getSafeRedirect } from '../../utils/safeRedirect'

/** Only allow same-origin paths — reject absolute and protocol-relative URLs. */
const handleGoogleAuth = () => {
  window.location.href = `${API_URL}/auth/google`
}

type AuthMode = 'login' | 'signup'
type FormErrors = Record<string, string>
type LoginForm = { email: string; password: string }
type SignupForm = { fullName: string; email: string; phone: string; password: string }

const LOGIN_INITIAL: LoginForm = { email: '', password: '' }
const SIGNUP_INITIAL: SignupForm = { fullName: '', email: '', phone: '', password: '' }

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validatePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return /^5\d{8}$/.test(digits)
}

function validatePassword(value: string) {
  return value.length >= 8
}

function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let index = 0
    setDisplayed('')
    const interval = window.setInterval(() => {
      index += 1
      setDisplayed(text.slice(0, index))
      if (index >= text.length) window.clearInterval(interval)
    }, speed)
    return () => window.clearInterval(interval)
  }, [text, speed])

  return displayed
}

function HeroPanel() {
  const { t, isRTL } = useLocale()
  const bulletIcons = [Bot, Clock3, Sparkles, Shield]
  const typedReply = useTypewriter(t.login.shared.reviewReply, 24)
  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <div className="hidden w-full max-w-[520px] lg:block">
      <h1 className={`${textAlign} text-[34px] font-bold leading-[1.25] tracking-[-0.02em] text-slate-900`}>
        {t.login.shared.heroTitle}
      </h1>

      <div className="mt-5 flex flex-col gap-3">
        {t.login.shared.heroBullets.map((item, index) => {
          const Icon = bulletIcons[index]
          return (
            <div
              key={item}
              className={`flex items-center justify-start gap-3 ${textAlign} text-[16px] font-medium text-slate-700`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9F3EA] text-[#0FA08E]">
                <Icon className="h-4 w-4" />
              </span>
              <span>{item}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-8 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
            <span>{t.login.shared.reviewTitle}</span>
            <img src={mapsImage} alt="Google Maps" className="h-4 w-4 object-contain" />
          </div>
          <div className="flex items-center gap-1 text-[12px] font-medium text-emerald-600">
            <span>{t.login.shared.live}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className={`flex items-start ${isRTL ? 'justify-between' : 'justify-between'} gap-4`}>
            <div className={textAlign}>
              <div className="text-[15px] font-bold text-slate-900">{t.login.shared.reviewName}</div>
              <div className={`${textAlign} text-[14px] leading-7 text-slate-600`}>{t.login.shared.reviewText}</div>
            </div>
            <div className="flex items-center gap-1 text-[#F4B400]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>

          <div className={`rounded-[14px] bg-[#F8FCFB] p-3 ${textAlign} ring-1 ring-[#DDF4EF] min-h-[180px]`}>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src={avatar} alt="AI" className="h-9 w-9 rounded-full object-cover ring-2 ring-white" />
                <div className={textAlign}>
                  <div className="text-[13px] font-bold text-slate-900">{t.login.shared.replyAuthor}</div>
                </div>
              </div>
              <span className="rounded-md bg-[#C9F3EA] px-2 py-0.5 text-[11px] font-bold text-[#0E8E81]">AI</span>
            </div>
            <p className={`text-[14px] leading-7 text-slate-700 min-h-[112px] ${textAlign}`}>{typedReply}</p>
          </div>
        </div>
      </div>

      <div className={`mt-8 flex items-center ${isRTL ? 'justify-end' : 'justify-start'} gap-3 ${textAlign} text-[15px] text-slate-500`}>
        <div className="flex items-center gap-2">
          {['B', 'A', 'R', 'Q'].map((char) => (
            <span
              key={char}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A7EFE0] text-[13px] font-bold text-[#0E8E81]"
            >
              {char}
            </span>
          ))}
        </div>
        <span>{t.login.shared.heroFooter}</span>
      </div>
    </div>
  )
}

function GoogleButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-[10px] border border-slate-200 bg-white px-4 text-[15px] font-medium text-slate-800 transition hover:bg-slate-50"
      onClick={onClick}
    >
      <img src={googleImage} alt="Google" className="h-5 w-5 object-contain" />
      <span>{text}</span>
    </button>
  )
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  hint,
  isRTL,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  isRTL: boolean
}) {
  const [show, setShow] = useState(false)
  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <div className="space-y-1.5">
      <label className={`block ${textAlign} text-[14px] font-bold text-slate-900`}>{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-11 w-full rounded-[10px] border border-slate-200 bg-white px-4 ${isRTL ? 'pl-11' : 'pr-11'} text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#12A594] focus:ring-4 focus:ring-[#12A594]/10 ${
            error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''
          }`}
          dir="ltr"
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-slate-400`}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? (
        <p className={`${textAlign} text-[12px] text-red-500`}>{error}</p>
      ) : hint ? (
        <p className={`${textAlign} text-[12px] text-slate-400`}>{hint}</p>
      ) : null}
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  isRTL,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  type?: 'text' | 'email'
  isRTL: boolean
}) {
  const textAlign = isRTL ? 'text-right' : 'text-left'
  return (
    <div className="space-y-1.5">
      <label className={`block ${textAlign} text-[14px] font-bold text-slate-900`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-[10px] border border-slate-200 bg-white px-4 text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#12A594] focus:ring-4 focus:ring-[#12A594]/10 ${
          error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''
        }`}
        dir={type === 'email' ? 'ltr' : undefined}
        style={{ textAlign: type === 'email' ? 'left' : isRTL ? 'right' : 'left' }}
      />
      {error ? <p className={`${textAlign} text-[12px] text-red-500`}>{error}</p> : null}
    </div>
  )
}

function PhoneField({
  label,
  value,
  onChange,
  error,
  isRTL,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  isRTL: boolean
}) {
  const normalized = value.replace(/\D/g, '').slice(0, 9)
  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <div className="space-y-1.5">
      <label className={`block ${textAlign} text-[14px] font-bold text-slate-900`}>{label}</label>
      <div className="relative">
        <span className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center text-[14px] text-slate-500`}>
          +966
        </span>
        <input
          type="tel"
          value={normalized}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 9))}
          placeholder="5X XXX XXXX"
          className={`h-11 w-full rounded-[10px] border border-slate-200 bg-white text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#12A594] focus:ring-4 focus:ring-[#12A594]/10 ${
            isRTL ? 'pr-16 pl-4' : 'pl-16 pr-4'
          } ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
          dir="ltr"
        />
      </div>
      {error ? <p className={`${textAlign} text-[12px] text-red-500`}>{error}</p> : null}
    </div>
  )
}

type LoginPageProps = {
  initialMode?: AuthMode
  redirectTo?: string
}

export default function LoginPage({
  initialMode = 'login',
  redirectTo,
}: LoginPageProps) {
  const { t, dir, isRTL } = useLocale()
  const router = useRouter()
  const mode = initialMode
  const [loginForm, setLoginForm] = useState<LoginForm>(LOGIN_INITIAL)
  const [signupForm, setSignupForm] = useState<SignupForm>(SIGNUP_INITIAL)
  const [loginErrors, setLoginErrors] = useState<FormErrors>({})
  const [signupErrors, setSignupErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const activeContent = useMemo(
    () => (mode === 'login' ? t.login.modes.login : t.login.modes.signup),
    [mode, t]
  )

  const textAlign = isRTL ? 'text-right' : 'text-left'

  const validateLogin = () => {
    const errors: FormErrors = {}
    if (!loginForm.email.trim()) errors.email = t.login.errors.emailRequired
    else if (!validateEmail(loginForm.email)) errors.email = t.login.errors.emailInvalid
    if (!loginForm.password.trim()) errors.password = t.login.errors.passwordRequired
    else if (!validatePassword(loginForm.password)) errors.password = t.login.errors.passwordMinLength
    setLoginErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateSignup = () => {
    const errors: FormErrors = {}
    if (!signupForm.fullName.trim()) errors.fullName = t.login.errors.fullNameRequired
    else if (signupForm.fullName.trim().length < 3) errors.fullName = t.login.errors.fullNameShort
    if (!signupForm.email.trim()) errors.email = t.login.errors.emailRequired
    else if (!validateEmail(signupForm.email)) errors.email = t.login.errors.emailInvalid
    if (!signupForm.phone.trim()) errors.phone = t.login.errors.phoneRequired
    else if (!validatePhone(signupForm.phone)) errors.phone = t.login.errors.phoneInvalid
    if (!signupForm.password.trim()) errors.password = t.login.errors.passwordRequired
    else if (!validatePassword(signupForm.password)) errors.password = t.login.errors.passwordMinLength
    setSignupErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateLogin()) return
    try {
      setIsSubmitting(true)
      setServerError('')
      const response: any = await loginUser(loginForm)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      const role = response.data.user?.role
      if (role === 'admin' || role === 'superAdmin') {
        router.navigate({ to: '/AdminDashboard', replace: true })
      } else {
        const target = getSafeRedirect(redirectTo)
        router.navigate({ href: target, replace: true })
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : t.login.errors.loginFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateSignup()) return
    try {
      setIsSubmitting(true)
      setServerError('')
      const payload = {
        name: signupForm.fullName,
        email: signupForm.email,
        phone: `+966${signupForm.phone.replace(/\D/g, '')}`,
        password: signupForm.password,
      }
      await signupUser(payload)
      const query = new URLSearchParams({ email: payload.email })
      if (redirectTo) query.set('redirect', redirectTo)
      window.location.assign(`/VerifyEmail?${query.toString()}`)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : t.login.errors.signupFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchPath = mode === 'login' ? '/Register' : '/Login'
  const switchHref = redirectTo
    ? `${switchPath}?redirect=${encodeURIComponent(redirectTo)}`
    : switchPath

  return (
    <section dir={dir} className="min-h-screen bg-[#F4FAF8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-center gap-4">
        <img src={logo} alt="Bariq AI" className="w-[80px] sm:w-[160px] lg:w-[180px] h-auto object-contain" />
        <LocaleToggle />
      </div>

      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-center">
        <div
          className={`flex w-full flex-col items-center justify-center gap-10 lg:flex-row lg:items-start lg:gap-14 ${
            mode === 'login' ? 'lg:justify-center' : 'lg:justify-between'
          }`}
        >
          {/* Form */}
          <div className="w-full max-w-[430px]">
            <div className="rounded-[22px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
              <h2 className={`${textAlign} text-[34px] font-bold leading-none text-slate-900`}>
                {activeContent.title}
              </h2>

              <GoogleButton text={activeContent.google} onClick={handleGoogleAuth} />

              <div className="my-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[13px] text-slate-400">{t.login.shared.divider}</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {serverError ? (
                <p className={`mb-4 rounded-lg bg-red-50 px-4 py-3 ${textAlign} text-sm text-red-600`}>
                  {serverError}
                </p>
              ) : null}

              {mode === 'login' ? (
                <form className="space-y-4" onSubmit={handleLoginSubmit} noValidate>
                  <TextField
                    label={t.login.fields.email}
                    type="email"
                    value={loginForm.email}
                    onChange={(value) => setLoginForm((prev) => ({ ...prev, email: value }))}
                    placeholder={t.login.fields.emailPlaceholder}
                    error={loginErrors.email}
                    isRTL={isRTL}
                  />
                  <PasswordField
                    label={t.login.fields.password}
                    value={loginForm.password}
                    onChange={(value) => setLoginForm((prev) => ({ ...prev, password: value }))}
                    error={loginErrors.password}
                    isRTL={isRTL}
                  />
                  <button
                    type="submit"
                    className="mt-2 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#159A8C] text-[15px] font-bold text-white transition hover:bg-[#13897d] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.login.shared.submitting : activeContent.submit}
                  </button>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleSignupSubmit} noValidate>
                  <TextField
                    label={t.login.fields.fullName}
                    value={signupForm.fullName}
                    onChange={(value) => setSignupForm((prev) => ({ ...prev, fullName: value }))}
                    placeholder={t.login.fields.namePlaceholder}
                    error={signupErrors.fullName}
                    isRTL={isRTL}
                  />
                  <TextField
                    label={t.login.fields.email}
                    type="email"
                    value={signupForm.email}
                    onChange={(value) => setSignupForm((prev) => ({ ...prev, email: value }))}
                    placeholder={t.login.fields.emailPlaceholder}
                    error={signupErrors.email}
                    isRTL={isRTL}
                  />
                  <PhoneField
                    label={t.login.fields.phone}
                    value={signupForm.phone}
                    onChange={(value) => setSignupForm((prev) => ({ ...prev, phone: value }))}
                    error={signupErrors.phone}
                    isRTL={isRTL}
                  />
                  <PasswordField
                    label={t.login.fields.password}
                    value={signupForm.password}
                    onChange={(value) => setSignupForm((prev) => ({ ...prev, password: value }))}
                    error={signupErrors.password}
                    hint={t.login.shared.passwordHint}
                    isRTL={isRTL}
                  />
                  <button
                    type="submit"
                    className="mt-2 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#159A8C] text-[15px] font-bold text-white transition hover:bg-[#13897d] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.login.shared.submitting : activeContent.submit}
                  </button>
                </form>
              )}

              <div className="mt-4 flex flex-col items-center gap-3 text-center">
                <p className="text-[14px] text-slate-400">{activeContent.switchPrompt}</p>
                <a
                  href={switchHref}
                  className="flex h-11 w-full items-center justify-center rounded-[10px] border border-slate-200 bg-white text-[15px] font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  {activeContent.switchAction}
                </a>
              </div>
            </div>
          </div>

          {mode === 'signup' && <HeroPanel />}
        </div>
      </div>
    </section>
  )
}
