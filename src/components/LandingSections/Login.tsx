import { useEffect, useMemo, useState } from 'react'
import {
  Clock3,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  Star,
  Bot,
} from 'lucide-react'
import logo from '../../assets/logo.png'
import googleImage from '../../assets/google.png'
import avatar from '../../assets/avatar.png'
import mapsImage from '../../assets/maps.png'

type AuthMode = 'login' | 'signup'

type FormErrors = Record<string, string>

type LoginForm = {
  email: string
  password: string
}

type SignupForm = {
  fullName: string
  email: string
  phone: string
  password: string
}

const LOGIN_INITIAL: LoginForm = {
  email: '',
  password: '',
}

const SIGNUP_INITIAL: SignupForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
}

const CONTENT = {
  login: {
    title: 'مرحباً بك في بريق',
    submit: 'تسجيل الدخول',
    switchPrompt: 'ليس لديك حساب؟',
    switchAction: 'إنشاء حساب',
    google: 'المتابعة مع جوجل',
  },
  signup: {
    title: 'إنشاء حسابك',
    submit: 'إنشاء حسابك',
    switchPrompt: 'لديك حساب بالفعل؟',
    switchAction: 'تسجيل الدخول',
    google: 'المتابعة مع جوجل',
  },
  shared: {
    divider: 'أو',
    forgotPassword: 'نسيت كلمة المرور؟',
    heroTitle: 'خلّي فهد يتولى تقييماتك',
    heroBullets: [
      'ردود تلقائية 24/7 باللهجة السعودية',
      'جاهز خلال 5 دقائق',
      '+50 نشاط تجاري يثق بنا',
      'تشعُر بمستوى البنوك',
    ],
    heroFooter: 'انضم +50 نشاط تجاري في السعودية',
    passwordHint: 'يجب أن تكون 8 أحرف على الأقل',
    reviewTitle: 'تقييم جديد في خرائط جوجل',
    reviewName: "محمد الريحاني",
    reviewText: 'الأكل لذيذ جداً والخدمة ممتازة 👏',
    replyAuthor: 'فهد',
    reviewReply:
      'يا هلا فيك يا محمد، تسلم والله على كلماتك الطيبة 🙏 يسعدنا إن التجربة عجبتك وإن شاء الله دايم عند حسن ظنك. شكراً لثقتك فينا، ونسعد بخدمتك دائماً.',
  },
} as const

const STYLES = {
  page: 'min-h-screen bg-[#F4FAF8] px-4 py-8 sm:px-6 lg:px-8',
  topLogoWrap: 'mb-8 flex justify-center',
topLogo: 'w-[80px] sm:w-[160px] lg:w-[180px] h-auto object-contain',
  shell: 'mx-auto flex w-full max-w-[1180px] items-center justify-center',
  layout:
    'flex w-full flex-col items-center justify-center gap-10 lg:flex-row lg:items-start lg:gap-14',
  heroWrap: 'hidden w-full max-w-[520px] lg:block',
  formWrap: 'w-full max-w-[430px]',

  heroTitle:
    'text-right text-[34px] font-bold leading-[1.25] tracking-[-0.02em] text-slate-900',
  heroBulletList: 'mt-5 flex flex-col gap-3',
  heroBullet:
    'flex items-center justify-start gap-3 text-right text-[16px] font-medium text-slate-700',
  heroBulletIcon:
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9F3EA] text-[#0FA08E]',
  heroFooter:
    'mt-8 flex items-center justify-end gap-3 text-right text-[15px] text-slate-500',
  heroFooterBadges: 'flex items-center gap-2',
  heroFooterBadge:
    'flex h-8 w-8 items-center justify-center rounded-full bg-[#A7EFE0] text-[13px] font-bold text-[#0E8E81]',

  card:
    'rounded-[22px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8',
  formTitle:
    'text-right text-[34px] font-bold leading-none text-slate-900',
  googleButton:
    'mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-[10px] border border-slate-200 bg-white px-4 text-[15px] font-medium text-slate-800 transition hover:bg-slate-50',
  googleIcon: 'h-5 w-5 object-contain',
  dividerWrap: 'my-4 flex items-center gap-4',
  dividerLine: 'h-px flex-1 bg-slate-200',
  dividerText: 'text-[13px] text-slate-400',

  form: 'space-y-4',
  fieldWrap: 'space-y-1.5',
  label: 'block text-right text-[14px] font-bold text-slate-900',
  inputWrap: 'relative',
  input:
    'h-11 w-full rounded-[10px] border border-slate-200 bg-white px-4 text-right text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#12A594] focus:ring-4 focus:ring-[#12A594]/10',
  inputWithIcon: 'pl-11 pr-4',
  prefixInput: 'pr-16 pl-4',
  prefix:
    'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[14px] text-slate-500',
  leadingIcon:
    'absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400',
  errorText: 'text-right text-[12px] text-red-500',
  helperText: 'text-right text-[12px] text-slate-400',
  forgotWrap: 'flex justify-start',
  forgotButton:
    'text-[13px] font-medium text-[#14A595] transition hover:text-[#0E8E81]',
  submit:
    'mt-2 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#159A8C] text-[15px] font-bold text-white transition hover:bg-[#13897d] disabled:cursor-not-allowed disabled:opacity-60',
  secondaryAction:
    'mt-4 flex flex-col items-center gap-3 text-center',
  switchPrompt: 'text-[14px] text-slate-400',
  switchButton:
    'flex h-11 w-full items-center justify-center rounded-[10px] border border-slate-200 bg-white text-[15px] font-medium text-slate-800 transition hover:bg-slate-50',

  previewCard:
    'mt-8 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)]',
  previewHeader:
    'flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3',
  previewHeaderTitle:
    'flex items-center gap-2 text-[13px] font-bold text-slate-700',
  previewMapIcon: 'h-4 w-4 object-contain',
  previewLive:
    'flex items-center gap-1 text-[12px] font-medium text-emerald-600',
  previewBody: 'space-y-4 p-4',
  stars: 'flex items-center gap-1 text-[#F4B400]',
  reviewName: 'text-right text-[15px] font-bold text-slate-900',
  reviewText: 'text-right text-[14px] leading-7 text-slate-600',
  replyBox:
    'rounded-[14px] bg-[#F8FCFB] p-3 text-right ring-1 ring-[#DDF4EF] min-h-[180px]',
replyMeta: 'mb-3 flex items-start justify-between gap-2',
  replyIdentity: 'flex items-center gap-2',
  avatar: 'h-9 w-9 rounded-full object-cover ring-2 ring-white',
  replyAuthor: 'text-[13px] font-bold text-slate-900',
  aiBadge:
    'rounded-md bg-[#C9F3EA] px-2 py-0.5 text-[11px] font-bold text-[#0E8E81]',
  replyText: 'text-[14px] leading-7 text-slate-700 min-h-[112px]',
} as const

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

      if (index >= text.length) {
        window.clearInterval(interval)
      }
    }, speed)

    return () => window.clearInterval(interval)
  }, [text, speed])

  return displayed
}

function HeroPanel() {
  const bulletIcons = [Bot, Clock3, Sparkles, Shield]
  const typedReply = useTypewriter(CONTENT.shared.reviewReply, 24)

  return (
    <div className={STYLES.heroWrap}>
      <h1 className={STYLES.heroTitle}>{CONTENT.shared.heroTitle}</h1>

      <div className={STYLES.heroBulletList}>
        {CONTENT.shared.heroBullets.map((item, index) => {
          const Icon = bulletIcons[index]
          return (
            <div key={item} className={STYLES.heroBullet}>
                <span className={STYLES.heroBulletIcon}>
                <Icon className="h-4 w-4" />
              </span>
              <span>{item}</span>
              
            </div>
          )
        })}
      </div>

      <div className={STYLES.previewCard}>
        <div className={STYLES.previewHeader}>
          <div className={STYLES.previewHeaderTitle}>
            <span>{CONTENT.shared.reviewTitle}</span>
            <img src={mapsImage} alt="Google Maps" className={STYLES.previewMapIcon} />
          </div>

          <div className={STYLES.previewLive}>
            <span>مباشر</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        <div className={STYLES.previewBody}>
          <div className="flex items-start justify-between gap-4">
            <div className="text-right">
              <div className={STYLES.reviewName}>{CONTENT.shared.reviewName}</div>
              <div className={STYLES.reviewText}>{CONTENT.shared.reviewText}</div>
            </div>

            <div className={STYLES.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>

          <div className={STYLES.replyBox}>
            <div className={STYLES.replyMeta}>
              <div className={STYLES.replyIdentity}>
                <img src={avatar} alt="Fahd" className={STYLES.avatar} />
                <div className="text-right">
                  <div className={STYLES.replyAuthor}>{CONTENT.shared.replyAuthor}</div>
                </div>
              </div>

              <span className={STYLES.aiBadge}>AI</span>
            </div>

            <p className={STYLES.replyText}>{typedReply}</p>
          </div>
        </div>
      </div>

      <div className={STYLES.heroFooter}>
        <div className={STYLES.heroFooterBadges}>
          {['خ', 'ل', 'ي', 'ك'].map((char) => (
            <span key={char} className={STYLES.heroFooterBadge}>
              {char}
            </span>
          ))}
        </div>
        <span>{CONTENT.shared.heroFooter}</span>
      </div>
    </div>
  )
}

function GoogleButton({ text }: { text: string }) {
  return (
    <button type="button" className={STYLES.googleButton}>
      <img src={googleImage} alt="Google" className={STYLES.googleIcon} />
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
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
}) {
  const [show, setShow] = useState(false)

  return (
    <div className={STYLES.fieldWrap}>
      <label className={STYLES.label}>{label}</label>

      <div className={STYLES.inputWrap}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${STYLES.input} ${STYLES.inputWithIcon} ${
            error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''
          }`}
          dir="ltr"
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className={STYLES.leadingIcon}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error ? (
        <p className={STYLES.errorText}>{error}</p>
      ) : hint ? (
        <p className={STYLES.helperText}>{hint}</p>
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
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  type?: 'text' | 'email'
}) {
  return (
    <div className={STYLES.fieldWrap}>
      <label className={STYLES.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${STYLES.input} ${
          error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''
        }`}
        dir={type === 'email' ? 'ltr' : 'rtl'}
      />
      {error ? <p className={STYLES.errorText}>{error}</p> : null}
    </div>
  )
}

function PhoneField({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const normalized = value.replace(/\D/g, '').slice(0, 9)

  return (
    <div className={STYLES.fieldWrap}>
      <label className={STYLES.label}>{label}</label>

      <div className={STYLES.inputWrap}>
        <span className={STYLES.prefix}>966+</span>
        <input
          type="tel"
          value={normalized}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 9))}
          placeholder="5X XXX XXXX"
          className={`${STYLES.input} ${STYLES.prefixInput} ${
            error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''
          }`}
          dir="ltr"
        />
      </div>

      {error ? <p className={STYLES.errorText}>{error}</p> : null}
    </div>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('signup')
  const [loginForm, setLoginForm] = useState<LoginForm>(LOGIN_INITIAL)
  const [signupForm, setSignupForm] = useState<SignupForm>(SIGNUP_INITIAL)
  const [loginErrors, setLoginErrors] = useState<FormErrors>({})
  const [signupErrors, setSignupErrors] = useState<FormErrors>({})

  const activeContent = useMemo(
    () => (mode === 'login' ? CONTENT.login : CONTENT.signup),
    [mode]
  )

  const validateLogin = () => {
    const errors: FormErrors = {}

    if (!loginForm.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب'
    } else if (!validateEmail(loginForm.email)) {
      errors.email = 'أدخل بريدًا إلكترونيًا صحيحًا'
    }

    if (!loginForm.password.trim()) {
      errors.password = 'كلمة المرور مطلوبة'
    } else if (!validatePassword(loginForm.password)) {
      errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    }

    setLoginErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateSignup = () => {
    const errors: FormErrors = {}

    if (!signupForm.fullName.trim()) {
      errors.fullName = 'الاسم الكامل مطلوب'
    } else if (signupForm.fullName.trim().length < 3) {
      errors.fullName = 'الاسم الكامل قصير جدًا'
    }

    if (!signupForm.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب'
    } else if (!validateEmail(signupForm.email)) {
      errors.email = 'أدخل بريدًا إلكترونيًا صحيحًا'
    }

    if (!signupForm.phone.trim()) {
      errors.phone = 'رقم الجوال مطلوب'
    } else if (!validatePhone(signupForm.phone)) {
      errors.phone = 'أدخل رقم جوال سعودي صحيح يبدأ بـ 5'
    }

    if (!signupForm.password.trim()) {
      errors.password = 'كلمة المرور مطلوبة'
    } else if (!validatePassword(signupForm.password)) {
      errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    }

    setSignupErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateLogin()) return

    console.log('login payload', loginForm)
  }

  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateSignup()) return

    console.log('signup payload', {
      ...signupForm,
      phone: `+966${signupForm.phone.replace(/\D/g, '')}`,
    })
  }

  return (
    <section dir="rtl" className={STYLES.page}>
      <div className={STYLES.topLogoWrap}>
        <img src={logo} alt="Repma" className={STYLES.topLogo} />
      </div>

      <div className={STYLES.shell}>
        <div
          className={`${STYLES.layout} ${
            mode === 'login' ? 'lg:justify-center' : 'lg:justify-between'
          }`}
        >
          <div className={STYLES.formWrap}>
            <div className={STYLES.card}>
              <h2 className={STYLES.formTitle}>{activeContent.title}</h2>

              <GoogleButton text={activeContent.google} />

              <div className={STYLES.dividerWrap}>
                <div className={STYLES.dividerLine} />
                <span className={STYLES.dividerText}>{CONTENT.shared.divider}</span>
                <div className={STYLES.dividerLine} />
              </div>

              {mode === 'login' ? (
                <form className={STYLES.form} onSubmit={handleLoginSubmit} noValidate>
                  <TextField
                    label="البريد الإلكتروني"
                    type="email"
                    value={loginForm.email}
                    onChange={(value) =>
                      setLoginForm((prev) => ({ ...prev, email: value }))
                    }
                    placeholder="you@example.com"
                    error={loginErrors.email}
                  />

                  <PasswordField
                    label="كلمة المرور"
                    value={loginForm.password}
                    onChange={(value) =>
                      setLoginForm((prev) => ({ ...prev, password: value }))
                    }
                    error={loginErrors.password}
                  />

                  <div className={STYLES.forgotWrap}>
                    <button type="button" className={STYLES.forgotButton}>
                      {CONTENT.shared.forgotPassword}
                    </button>
                  </div>

                  <button type="submit" className={STYLES.submit}>
                    {CONTENT.login.submit}
                  </button>
                </form>
              ) : (
                <form className={STYLES.form} onSubmit={handleSignupSubmit} noValidate>
                  <TextField
                    label="الاسم الكامل"
                    value={signupForm.fullName}
                    onChange={(value) =>
                      setSignupForm((prev) => ({ ...prev, fullName: value }))
                    }
                    placeholder="أدخل اسمك الكامل"
                    error={signupErrors.fullName}
                  />

                  <TextField
                    label="البريد الإلكتروني"
                    type="email"
                    value={signupForm.email}
                    onChange={(value) =>
                      setSignupForm((prev) => ({ ...prev, email: value }))
                    }
                    placeholder="you@example.com"
                    error={signupErrors.email}
                  />

                  <PhoneField
                    label="رقم الجوال"
                    value={signupForm.phone}
                    onChange={(value) =>
                      setSignupForm((prev) => ({ ...prev, phone: value }))
                    }
                    error={signupErrors.phone}
                  />

                  <PasswordField
                    label="كلمة المرور"
                    value={signupForm.password}
                    onChange={(value) =>
                      setSignupForm((prev) => ({ ...prev, password: value }))
                    }
                    error={signupErrors.password}
                    hint={CONTENT.shared.passwordHint}
                  />

                  <button type="submit" className={STYLES.submit}>
                    {CONTENT.signup.submit}
                  </button>
                </form>
              )}

              <div className={STYLES.secondaryAction}>
                <p className={STYLES.switchPrompt}>{activeContent.switchPrompt}</p>

                <button
                  type="button"
                  className={STYLES.switchButton}
                  onClick={() =>
                    setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
                  }
                >
                  {activeContent.switchAction}
                </button>
              </div>
            </div>
          </div>

          {mode === 'signup' && <HeroPanel />}
        </div>
      </div>
    </section>
  )
}