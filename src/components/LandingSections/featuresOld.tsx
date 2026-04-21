import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BellOff,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  MapPinned,
  TrendingDown,
  TrendingUp,
  Wallet,
  ArrowLeft,
  BarChart3,
  Activity,
  TriangleAlert,
  FileText,
  BrainCircuit,
  Tags,
  Target,
  SlidersHorizontal,
PenLine,
MessageSquareMore,
} from 'lucide-react'
import avatar from '../../assets/avatar.png'
import {Link} from '@tanstack/react-router'

type FeatureCard = {
  id: string
  title: string
  description: string
  highlight: string
  icon: typeof BellOff
  iconColor: string
  iconBg: string
  highlightTextColor: string
  highlightBg: string
}

type SmartReplyCard = {
  id: string
  title: string
  description: string
  icon: typeof MapPin
  iconColor: string
  iconBg: string
  size: 'large' | 'small'
}

type AnalyticsPoint = {
  id: string
  title: string
  description: string
  icon: typeof Activity
}
type SentimentPoint = {
  id: string
  title: string
  description: string
  icon: typeof Activity
}
type CustomizationPoint = {
  id: string
  title: string
  description: string
  icon: typeof Activity
}
const CONTENT = {
  lostReviews: {
    sectionTitle: 'التقييمات بدون رد فرص ضائعة',
    sectionSubtitle:
      '93% من العملاء يقرؤون التقييمات قبل ما يتجاوزون. كل تقييم بدون رد = فرصة ضائعة.',
    cards: [
      {
        id: 'no-replies',
        title: 'تقييمات بدون أي رد',
        description:
          'أغلب الأعمال تترك التقييمات بدون رد. العملاء يشوفون هالشي — ويروحون للمنافس اللي يرد. جوجل يكافئ الأعمال النشطة بترتيب أعلى.',
        highlight: '93% يقرؤون التقييمات أولًا',
        icon: BellOff,
        iconColor: 'text-rose-500',
        iconBg: 'bg-rose-50',
        highlightTextColor: 'text-rose-500',
        highlightBg: 'bg-rose-50',
      },
      {
        id: 'lower-ranking',
        title: 'ترتيبك في جوجل ينزل',
        description:
          'جوجل يعطي أولوية للأعمال اللي ترد باستمرار — حتى على تقييمات النجمة الواحدة. بدون ردود = ظهور أقل وعملاء أقل لمنافسيك.',
        highlight: 'ترتيب أقل = عملاء أقل',
        icon: TrendingDown,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-50',
        highlightTextColor: 'text-amber-600',
        highlightBg: 'bg-amber-50',
      },
      {
        id: 'expensive-agencies',
        title: 'الوكالات غالية وغير منتظمة',
        description:
          'توظيف وكالة يكلّف 1,000–3,000 ريال شهريًا — وبرضو يوقفون تقييمات، بدون متابعة أو يستخدمون ردود نسخ-لصق عامة ما فيها روح.',
        highlight: '1,000–3,000 ريال شهريًا',
        icon: Wallet,
        iconColor: 'text-pink-600',
        iconBg: 'bg-pink-50',
        highlightTextColor: 'text-pink-600',
        highlightBg: 'bg-pink-50',
      },
    ] satisfies FeatureCard[],
  },

  smartReplies: {
    sectionTitle: 'نظام ذكي يرد على تقييماتك تلقائيًا',
    sectionSubtitle: 'ميزات مميزة فعلًا تفرق',
    ctaLabel: 'ابدأ الآن',
    cards: [
      {
        id: 'every-review',
        title: 'كل تقييم ياخذ رد',
        description:
          'ما تشيل هم تقييمات بدون رد. كل عميل يكتب تقييم ياخذ رد — تلقائيًا خلال ساعات. سمعتك محمية.',
        icon: MapPinned,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        size: 'large',
      },
      {
        id: 'saudi-tone',
        title: 'لهجة سعودية أصيلة، مو ترجمة جوجل',
        description:
          'ردودك طبيعية ودافئة وأصيلة فعلًا، زي ما يكتبها سعودي حقيقي. مو عربي رسمي العملاء يعرفون إنه آلي. يشعرون إنك تهتم فيهم لأنك تتكلم بطريقتهم.',
        icon: BriefcaseBusiness,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        size: 'large',
      },
      {
        id: 'all-branches',
        title: 'كل فروعك في مكان واحد',
        description:
          'يشوف تقييمات كل فروعك ويقدر يرد من مكان واحد. أضفت فرع جديد؟ ينشاف في أي وقت. سواء عندك مطعم واحد أو عشرة، كل شيء منظم.',
        icon: MapPin,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50',
        size: 'small',
      },
      {
        id: 'runs-alone',
        title: 'يشتغل لوحده',
        description:
          'فعلناه مرة وبعدين يصير يشتغل. ما تحتاج تراجعه يوميًا أو تحدثيات. أنت ركز على مطعمك، احنا نتولى التقييمات.',
        icon: BriefcaseBusiness,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50',
        size: 'small',
      },
      {
        id: 'know-customers',
        title: 'اعرف ايش يحبون العملاء',
        description:
          'يشوف مواضيع تعجب العملاء بتقييماتك؟ الخدمة؟ الأسعار؟ اعرف بالضبط ايش تتابع وايش تحتاج تصلح.',
        icon: TrendingUp,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50',
        size: 'small',
      },
      {
        id: 'ready-fast',
        title: 'جاهز خلال 5 دقائق',
        description:
          'ربط بسيط مع جوجل، وخلصنا. ما تحتاج خطوات معقدة أو انتظار. ابدأ تحمي تقييماتك اليوم.',
        icon: Clock3,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50',
        size: 'small',
      },
    ] satisfies SmartReplyCard[],
  },

  analytics: {
    badge: 'رؤى وتحليلات',
    sectionTitle: 'سمعتك في نظرة واحدة',
    sectionSubtitle:
      'تابع الأداء، اكتشف الاتجاهات، واتخذ قرارات مبنية على بيانات — كل شي من لوحة تحكم واحدة.',
    points: [
      {
        id: 'health-score',
        title: 'مؤشر الصحة',
        description:
          'رقم واحد يختصر لك بالضبط كيف حال نشاطك التجاري على جوجل — من 0 إلى 100.',
        icon: Activity,
      },
      {
        id: 'trends',
        title: 'الاتجاهات والأنماط',
        description:
          'شوف كيف تتغير تقييماتك ومشاعر العملاء وحجم التقييمات مع الوقت برسوم بيانية واضحة.',
        icon: BarChart3,
      },
      {
        id: 'complaints',
        title: 'تحليل الشكاوى الذكي',
        description:
          'الذكاء الاصطناعي يحدد المواضيع المتكررة في التقييمات السلبية عشان تعرف بالضبط إيش تصلح أولًا.',
        icon: TriangleAlert,
      },
      {
        id: 'pdf-reports',
        title: 'تقارير PDF',
        description:
          'حمّل تقارير احترافية تشاركها مع فريقك أو أصحاب القرار.',
        icon: FileText,
      },
    ] satisfies AnalyticsPoint[],
  },

  sentiment: {
    badge: 'تحليل المشاعر',
    sectionTitle: 'افهم كيف يشعر عملاؤك فعلاً',
    sectionSubtitle:
      'تجاوز النجوم. الذكاء الاصطناعي يحلل الكلمات الفعلية في كل تقييم ليكشف إيش يحبون العملاء — وإيش يحتاج اهتمام.',
    points: [
      {
        id: 'ai-sentiment',
        title: 'تحليل بالذكاء الاصطناعي',
        description:
          'كل تقييم يتم تحليله للمشاعر — مو بس النجوم، لكن المعنى الحقيقي وراء الكلمات.',
        icon: BrainCircuit,
      },
      {
        id: 'topic-detection',
        title: 'اكتشاف المواضيع',
        description:
          'يحدد تلقائيًا مواضيع مثل جودة الطعام، سرعة الخدمة، النظافة، وسلوك الموظفين عبر كل التقييمات.',
        icon: Tags,
      },
      {
        id: 'fix-priority',
        title: 'أولويات قابلة للتنفيذ',
        description:
          'اعرف بالضبط إيش تحسن أولًا بناءً على ما يؤثر أكثر على رضا العملاء.',
        icon: Target,
      },
    ] satisfies SentimentPoint[],
  },
  customization: {
  badge: 'خصصه على كيفك',
  sectionTitle: 'اضبط موظفك، بطريقتك',
  sectionSubtitle:
    'من نبرة الصوت إلى قواعد الردود — اضبط بالضبط كيف يمثل موظفك الرقمي علامتك التجارية.',
  points: [
    {
      id: 'tone',
      title: 'نبرة الرد',
      description:
        'اختر نبرة احترافية، أو عاطفية — أو اكتب تعليمات مخصصة بكلماتك الخاصة.',
      icon: MessageSquareMore,
    },
    {
      id: 'rules',
      title: 'قواعد ذكية',
      description:
        'حدد سطور تضمن دائمًا، ومواضيع لا تذكر أبدًا، وتفضيلات الإيموجي، وطول الرد.',
      icon: PenLine,
    },
    {
      id: 'signature',
      title: 'التوقيع والعلامة التجارية',
      description:
        'خصص التوقيع الختامي برقم هاتفك واسم الفرع والعنوان — بالعربي والإنجليزي.',
      icon: SlidersHorizontal,
    },
    {
      id: 'timing',
      title: 'توقيت الرد',
      description:
        'حدد أوقات الرد الأدنى والأقصى لنمط رد طبيعي ويشبه البشر.',
      icon: Clock3,
    },
  ] satisfies CustomizationPoint[],
},
} as const

const STYLES = {
  shared: {
    container:
      'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
   sectionHeader: 'mx-auto max-w-2xl text-center',
sectionTitle:
  'text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[3rem] ',
sectionSubtitle:
  'mt-2 text-sm leading-7 text-slate-500 sm:text-base'}
  ,

  lostReviews: {
    wrapper: 'bg-[#f8fafc]',
    container: 'py-16 sm:py-20 lg:py-24',
    grid:
      'mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',
    card: {
      base:
        'group rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300',
      hover:
        'hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]',
      entrance: 'transition-all duration-500 ease-out',
      hidden: 'translate-x-6 opacity-0',
      visible: 'translate-x-0 opacity-100',
    },
    icon: {
      wrapper:
        'mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
      icon:
        'h-7 w-7 transition-transform duration-300 group-hover:scale-110',
    },
    text: {
      title: 'text-xl font-extrabold text-slate-900',
      description: 'mt-4 text-[15px] leading-8 text-slate-500',
      highlight:
        'mt-6 rounded-2xl px-4 py-3 text-center text-base font-extrabold',
    },
  },

  smartReplies: {
  wrapper: 'bg-[#eef7f5]',
  container: 'py-16 sm:py-20 lg:py-24',
  grid: 'mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-12',
  card: {
    base:
      'group rounded-[20px] border border-emerald-100 bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition-all duration-500 sm:p-5',
    hover:
      'hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(16,185,129,0.08)]',
    hidden: 'translate-y-8 opacity-0',
    visible: 'translate-y-0 opacity-100',
    large: 'lg:col-span-6 min-h-[160px] sm:min-h-[170px]',
    small: 'lg:col-span-3 min-h-[150px] sm:min-h-[160px]',
  },
  icon: {
    wrapper:
      'mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11',
    icon:
      'h-5 w-5 transition-transform duration-300 group-hover:scale-110 sm:h-5.5 sm:w-5.5',
  },
  text: {
    title: 'text-lg font-extrabold leading-7 text-slate-900 sm:text-[1.15rem]',
    description: 'mt-2 text-[14px] leading-7 text-slate-500',
  },
  ctaWrap: 'mt-10 flex justify-center',
},
  button: {
    gradient:
      'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-8 py-3 text-base font-extrabold text-white shadow-[0_14px_30px_rgba(13,148,136,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(13,148,136,0.28)]',
    icon: 'h-4 w-4',
  },
 analytics: {
  wrapper: 'bg-[#f8fafc]',
container: 'pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20',
  layout:
    'mx-auto mt-8 grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12',
  reveal: {
    base: 'transition-all duration-700 ease-out',
    rightHidden: 'translate-x-10 opacity-0',
    leftHidden: '-translate-x-10 opacity-0',
    visible: 'translate-x-0 opacity-100',
  },

  badge:
    'inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-extrabold text-teal-700 sm:text-sm',
  badgeIcon: 'ml-2 h-4 w-4',

textWrap: 'text-right',
dashboardWrap: '',  

 title:
  'mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem]',
subtitle:
  'mt-3 max-w-xl text-[17px] leading-8 text-slate-600 sm:text-[18px]',
pointsList: 'mt-6 space-y-4',
pointRow: 'flex items-start gap-2.5',
pointTitle: 'text-[1.05rem] font-extrabold text-slate-900',
pointDescription:
  'mt-1 text-[15px] leading-7 text-slate-600',
  pointIconWrap:
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600',
dashboardOuter:
  'relative mx-auto w-full max-w-[400px] sm:max-w-[430px] lg:max-w-[470px] min-h-[300px]',
   dashboardShadow:
  'absolute inset-x-6 bottom-[-18px] h-14 rounded-full bg-teal-100/70 blur-2xl',
dashboardCard:
  'relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]',
 dashboardTopBar:
  'flex items-center justify-between border-b border-slate-200 bg-[#f4f8f8] px-3 py-2 sm:px-3.5 sm:py-2.5',
  dashboardTopTabs: 'flex items-center gap-2',
dashboardTopTitle: 'flex items-center gap-1.5 text-xs font-bold text-slate-800 sm:text-sm',
  statusDot: 'h-2.5 w-2.5 rounded-full bg-emerald-500',

  periodPillBase:
    'rounded-md px-2 py-1 text-[10px] font-medium leading-none sm:px-2.5 sm:text-[11px]',
  periodPillMuted: 'bg-transparent text-slate-400',
  periodPillActive: 'bg-emerald-100 text-teal-700',

dashboardBody: 'p-4 text-right sm:p-4.5',
dashboardHero:
  'flex items-center justify-between',
 dashboardHeroText:
  'flex w-full flex-col items-end text-right leading-none',
 scoreRingWrap:
  'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14',
  dashboardHeroTitle: 'text-sm font-extrabold text-slate-900 sm:text-base',
 dashboardHeroSub:
  'mt-0.5 w-full text-right text-[11px] font-bold text-emerald-600 sm:text-xs',

 
  scoreRing: 'absolute inset-0 rounded-full',
  scoreRingCenter:
  'absolute inset-[5px] rounded-full bg-white sm:inset-[6px]',
  scoreValue:
  'relative z-10 text-sm font-extrabold text-slate-900 sm:text-lg',
  scoreGroup: 'flex items-center justify-end gap-2',
statsGrid: 'mt-4 grid grid-cols-3 gap-2',
  statCard:
  'rounded-xl bg-[#f5f7f9] px-2 py-2.5 text-center sm:px-2.5 sm:py-3',
  statValue: 'text-base font-extrabold text-slate-900 sm:text-xl',
  statLabel: 'mt-0.5 text-[9px] text-slate-500 sm:text-[10px]',
  statTrend: 'mt-0.5 text-[9px] font-bold text-emerald-600 sm:text-[10px]',
  chartCard:
  'mt-4 rounded-xl bg-[#f5f7f9] px-5 py-3',
  chartTitle: 'text-right text-[11px] font-bold text-slate-500 sm:text-xs',
  chartBars:
  'mt-2 flex h-12 flex-row-reverse items-end justify-between gap-1',
  chartBar:
    'flex-1 rounded-t-md bg-gradient-to-t from-[#40c9b3] to-[#5fd6c3]',
},
sentiment: {
  wrapper: 'bg-white',
  container: 'py-16 sm:py-20 lg:py-20',
  layout:
    'mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16',
  reveal: {
    base: 'transition-all duration-700 ease-out',
    leftHidden: '-translate-x-10 opacity-0',
    rightHidden: 'translate-x-10 opacity-0',
    visible: 'translate-x-0 opacity-100',
  },

  badge:
    'inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-extrabold text-teal-700 sm:text-sm',
  badgeIcon: 'ml-2 h-4 w-4',

  textWrap: 'text-right',
dashboardWrap: '',

  title:
    'mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.85rem]',
  subtitle:
    'mt-3 max-w-xl text-[17px] leading-8 text-slate-600 sm:text-[18px]',

  pointsList: 'mt-8 space-y-5',
  pointRow: 'flex items-start gap-3',
  pointIconWrap:
    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600',
  pointIcon: 'h-4 w-4',
  pointTitle: 'text-[1.05rem] font-extrabold text-slate-900',
  pointDescription: 'mt-1 text-[15px] leading-7 text-slate-600',

  dashboardOuter:
    'relative mx-auto w-full max-w-[360px] sm:max-w-[390px] lg:max-w-[430px]',
  dashboardShadow:
    'absolute inset-x-6 bottom-[-18px] h-14 rounded-full bg-teal-100/70 blur-2xl',
  dashboardCard:
    'relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]',

  dashboardTopBar:
  'flex items-center justify-start border-b border-slate-200 bg-[#f4f8f8] px-3 py-2 sm:px-3.5 sm:py-2.5',
  topBarGroup: 'flex items-center gap-2',
  dashboardTopTitle:
    'flex items-center gap-1.5 text-xs font-bold text-slate-800 sm:text-sm',
  dashboardTopAction: 'h-4 w-4 text-teal-600',

  dashboardBody: 'p-4 text-right sm:p-4.5',

  sentimentHeader:
    'flex items-start justify-between gap-4',
  donutWrap:
  'relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full sm:h-[72px] sm:w-[72px]',
donutCenter:
  'absolute inset-[8px] rounded-full bg-white',
donutValue:
  'relative z-10 text-[17px] font-extrabold text-slate-900',
donutLabel:
  'mt-0.5 text-[9px] font-bold text-emerald-600',
  donutRing: 'absolute inset-0 rounded-full',

  legend: 'space-y-1.5 text-[11px] text-slate-500',
  legendRow: 'flex items-center justify-end gap-2',
  legendDot: 'h-2.5 w-2.5 rounded-full',

  topicsWrap: 'mt-5',
  topicsTitle: 'text-[11px] font-bold text-slate-500',
  topicsGrid: 'mt-3 flex flex-wrap justify-start gap-2',
  topicChip:
  'rounded-full px-3 py-1.5 text-[12px] font-bold',
  topicChipPositive: 'bg-emerald-50 text-emerald-600',
  topicChipNeutral: 'bg-teal-50 text-teal-600',
  topicChipNegative: 'bg-rose-50 text-rose-500',
  topicChipWarning: 'bg-amber-50 text-amber-600',

  chartCard:
    'mt-4 rounded-xl bg-[#f5f7f9] px-3 py-3.5',
  chartTitle: 
  'text-right text-[11px] font-bold text-slate-500',
  lineChartWrap:
  'mt-3 h-12 rounded-lg  px-3 py-2.5',
  lineChartSvg: 'h-full w-full',
},
customization: {
  wrapper: 'bg-[#f8fafc]',
  container: 'py-16 sm:py-20 lg:py-24',
 layout:
  'mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 [direction:rtl]',
  reveal: {
    base: 'transition-all duration-700 ease-out',
    leftHidden: '-translate-x-10 opacity-0',
    rightHidden: 'translate-x-10 opacity-0',
    visible: 'translate-x-0 opacity-100',
  },

  badge:
    'inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-extrabold text-teal-700 sm:text-sm',
  badgeIcon: 'ml-2 h-4 w-4',

  textWrap: 'text-right',
  dashboardWrap: '',

  title:
    'mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.85rem]',
  subtitle:
    'mt-3 max-w-xl text-[17px] leading-8 text-slate-600 sm:text-[18px]',

  pointsList: 'mt-8 space-y-5',
  pointRow: 'flex items-start gap-3',
  pointIconWrap:
    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600',
  pointIcon: 'h-4 w-4',
  pointTitle: 'text-[1.05rem] font-extrabold text-slate-900',
  pointDescription: 'mt-1 text-[15px] leading-7 text-slate-600',

  dashboardOuter:
    'relative mx-auto w-full max-w-[360px] sm:max-w-[390px] lg:max-w-[430px]',
  dashboardShadow:
    'absolute inset-x-6 bottom-[-18px] h-14 rounded-full bg-teal-100/70 blur-2xl',
  dashboardCard:
    'relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]',

 dashboardTopBar:
  'flex items-center justify-start border-b border-slate-200 bg-[#f4f8f8] px-3 py-2 sm:px-3.5 sm:py-2.5',
  topBarGroup: 'flex items-center gap-2',
  dashboardTopTitle:
    'flex items-center gap-1.5 text-xs font-bold text-slate-800 sm:text-sm',
  dashboardTopAction: 'h-4 w-4 text-teal-600',

  dashboardBody: 'p-4 text-right sm:p-4.5',

profileRow: 'flex items-center justify-start border-b border-slate-200 pb-4',
profileGroup: 'flex items-center gap-3',
  profileInfo: 'flex items-center gap-3',
  avatarWrap:
  'flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-teal-200 bg-white',
    avatarImage: 'h-full w-full rounded-full object-cover',
  avatarEmoji: 'text-lg',
  profileTextWrap: 'text-right',
  profileName: 'text-sm font-extrabold text-slate-900',
  profileStatusRow: 'mt-0.5 flex items-center justify-end gap-1.5',
  profileStatusDot: 'h-2 w-2 rounded-full bg-emerald-500',
  profileStatusText: 'text-[10px] font-medium text-slate-500',

  fieldGroup: 'mt-4',
  fieldLabel: 'mb-2 block text-[11px] font-bold text-slate-500',

segmentedControl: 'grid grid-cols-3 gap-2 [direction:rtl]',
  segmentedButtonBase:
    'rounded-xl px-3 py-2 text-[11px] font-bold transition-colors',
  segmentedButtonMuted:
    'bg-slate-100 text-slate-500',
  segmentedButtonActive:
    'bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-[0_8px_20px_rgba(13,148,136,0.18)]',

  textarea:
    'min-h-[30px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] leading-5 text-slate-500 outline-none placeholder:text-slate-400',

  settingsList: 'mt-4 space-y-3',
  settingRow: 'grid grid-cols-[1fr_auto] items-center gap-3',
settingBadge: 'justify-self-start rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-teal-700',
settingLabel: 'text-right text-[11px] font-medium text-slate-500',

  signatureCard:
    'mt-4 rounded-xl border border-teal-100 bg-gradient-to-br from-[#edf9f6] to-[#e8f6f3] px-4 py-3',
  signatureTitle: 'text-[11px] font-bold text-teal-700',
  signatureLine: 'mt-1 text-[11px] text-slate-500',
},
} as const

const MOTION = {
  staggerMs: 120,
  sectionThreshold: 0.2,
} as const

const ANALYTICS_DASHBOARD = {
  periods: ['7 أيام', '30 يوم', '90 يوم'],
  score: 75,
  scoreLabel: 'مؤشر الصحة',
  scoreStatus: 'جيد',
  stats: [
  { id: 'reviews', value: '24', label: 'تقييمات', trend: '+12%' },
  { id: 'rating', value: '4.5', label: 'متوسط التقييم', trend: '+0.3' },
  { id: 'sentiment', value: '82%', label: 'المشاعر', trend: '+5%' },
],
  bars: [28, 33, 25, 30, 27, 32, 23, 29, 20, 25, 18, 23],
} as const

function FeaturePointItem({
  point,
  styles,
}: {
  point: {
    title: string
    description: string
    icon: typeof Activity
  }
  styles: {
    pointRow: string
    pointIconWrap: string
    pointIcon: string
    pointTitle: string
    pointDescription: string
  }
}) {
  const Icon = point.icon

  return (
    <div className={styles.pointRow}>
      <div className={styles.pointIconWrap}>
        <Icon className={styles.pointIcon} />
      </div>

      <div>
        <h3 className={styles.pointTitle}>{point.title}</h3>
        <p className={styles.pointDescription}>{point.description}</p>
      </div>
    </div>
  )
}
function useRevealOnScroll() {
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: MOTION.sectionThreshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [isVisible])

  return { ref, isVisible }
}

function GradientButton({ children }: { children: React.ReactNode }) {
  return (
    <Link to="/login" className={STYLES.button.gradient}>
      <ArrowLeft className={STYLES.button.icon} />
      <span>{children}</span>
    </Link>
  )
}

function LostReviewsCard({
  card,
  isVisible,
  delay,
}: {
  card: FeatureCard
  isVisible: boolean
  delay: number
}) {
  const Icon = card.icon

  return (
    <article
      className={[
        STYLES.lostReviews.card.base,
        STYLES.lostReviews.card.hover,
        STYLES.lostReviews.card.entrance,
        isVisible
          ? STYLES.lostReviews.card.visible
          : STYLES.lostReviews.card.hidden,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`${STYLES.lostReviews.icon.wrapper} ${card.iconBg}`}>
        <Icon className={`${STYLES.lostReviews.icon.icon} ${card.iconColor}`} />
      </div>

      <h3 className={STYLES.lostReviews.text.title}>{card.title}</h3>
      <p className={STYLES.lostReviews.text.description}>{card.description}</p>

      <div
        className={`${STYLES.lostReviews.text.highlight} ${card.highlightBg} ${card.highlightTextColor}`}
      >
        {card.highlight}
      </div>
    </article>
  )
}

function SmartRepliesCard({
  card,
  isVisible,
  delay,
}: {
  card: SmartReplyCard
  isVisible: boolean
  delay: number
}) {
  const Icon = card.icon
  const sizeClass =
    card.size === 'large'
      ? STYLES.smartReplies.card.large
      : STYLES.smartReplies.card.small

  return (
    <article
      className={[
        STYLES.smartReplies.card.base,
        STYLES.smartReplies.card.hover,
        sizeClass,
        isVisible
          ? STYLES.smartReplies.card.visible
          : STYLES.smartReplies.card.hidden,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`${STYLES.smartReplies.icon.wrapper} ${card.iconBg}`}>
        <Icon className={`${STYLES.smartReplies.icon.icon} ${card.iconColor}`} />
      </div>

      <h3 className={STYLES.smartReplies.text.title}>{card.title}</h3>
      <p className={STYLES.smartReplies.text.description}>{card.description}</p>
    </article>
  )
}

/* ===== PART 1 ===== */
function LostReviewsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section dir="rtl" className={STYLES.lostReviews.wrapper}>
      <div className={`${STYLES.shared.container} ${STYLES.lostReviews.container}`}>
        <div className={STYLES.shared.sectionHeader}>
          <h2 className={STYLES.shared.sectionTitle}>
            {CONTENT.lostReviews.sectionTitle}
          </h2>
          <p className={STYLES.shared.sectionSubtitle}>
            {CONTENT.lostReviews.sectionSubtitle}
          </p>
        </div>

        <div className={STYLES.lostReviews.grid}>
          {CONTENT.lostReviews.cards.map((card, index) => (
            <LostReviewsCard
              key={card.id}
              card={card}
              isVisible={isVisible}
              delay={index * MOTION.staggerMs}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===== PART 2 ===== */
function SmartRepliesSection() {
  const { ref, isVisible } = useRevealOnScroll()

  const largeCards = useMemo(
    () => CONTENT.smartReplies.cards.filter((card) => card.size === 'large'),
    []
  )
  const smallCards = useMemo(
    () => CONTENT.smartReplies.cards.filter((card) => card.size === 'small'),
    []
  )

  return (
    <section ref={ref} dir="rtl" className={STYLES.smartReplies.wrapper}>
      <div className={`${STYLES.shared.container} ${STYLES.smartReplies.container}`}>
        <div className={STYLES.shared.sectionHeader}>
          <h2 className={STYLES.shared.sectionTitle}>
            {CONTENT.smartReplies.sectionTitle}
          </h2>
          <p className={STYLES.shared.sectionSubtitle}>
            {CONTENT.smartReplies.sectionSubtitle}
          </p>
        </div>

        <div className={STYLES.smartReplies.grid}>
          {largeCards.map((card, index) => (
            <SmartRepliesCard
              key={card.id}
              card={card}
              isVisible={isVisible}
              delay={index * MOTION.staggerMs}
            />
          ))}

          {smallCards.map((card, index) => (
            <SmartRepliesCard
              key={card.id}
              card={card}
              isVisible={isVisible}
              delay={(largeCards.length + index) * MOTION.staggerMs}
            />
          ))}
        </div>

        <div className={STYLES.smartReplies.ctaWrap}>
          <GradientButton>{CONTENT.smartReplies.ctaLabel}</GradientButton>
        </div>
      </div>
    </section>
  )
}
/* ===== PART 3 ===== */
function AnalyticsDashboard() {
  return (
    <div className={STYLES.analytics.dashboardOuter}>
      <div className={STYLES.analytics.dashboardShadow} />

      <div className={STYLES.analytics.dashboardCard}>
        {/* TOP BAR */}
        <div className={STYLES.analytics.dashboardTopBar}>
          <div className={STYLES.analytics.dashboardTopTitle}>
            <span className={STYLES.analytics.statusDot} />
            لوحة التحكم
          </div>

          <div className={STYLES.analytics.dashboardTopTabs}>
            <span
              className={`${STYLES.analytics.periodPillBase} ${STYLES.analytics.periodPillActive}`}
            >
              {ANALYTICS_DASHBOARD.periods[0]}
            </span>
            <span
              className={`${STYLES.analytics.periodPillBase} ${STYLES.analytics.periodPillMuted}`}
            >
              {ANALYTICS_DASHBOARD.periods[1]}
            </span>
            <span
              className={`${STYLES.analytics.periodPillBase} ${STYLES.analytics.periodPillMuted}`}
            >
              {ANALYTICS_DASHBOARD.periods[2]}
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className={STYLES.analytics.dashboardBody}>
          <div className={STYLES.analytics.dashboardHero}>
            <div className={STYLES.analytics.scoreGroup}>
              <div className={STYLES.analytics.scoreRingWrap}>
                <div
                  className={STYLES.analytics.scoreRing}
                  style={{
                    background: `conic-gradient(#10b981 ${
                      ANALYTICS_DASHBOARD.score * 3.6
                    }deg, #e5eef0 0deg)`,
                  }}
                />
                <div className={STYLES.analytics.scoreRingCenter} />
                <span className={STYLES.analytics.scoreValue}>
                  {ANALYTICS_DASHBOARD.score}
                </span>
              </div>

              <div className={STYLES.analytics.dashboardHeroText}>
                <p className={STYLES.analytics.dashboardHeroTitle}>
                  {ANALYTICS_DASHBOARD.scoreLabel}
                </p>
                <p className={STYLES.analytics.dashboardHeroSub}>
                  {ANALYTICS_DASHBOARD.scoreStatus}
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className={STYLES.analytics.statsGrid}>
            {ANALYTICS_DASHBOARD.stats.map((stat) => (
              <div key={stat.id} className={STYLES.analytics.statCard}>
                <div className={STYLES.analytics.statValue}>{stat.value}</div>
                <div className={STYLES.analytics.statLabel}>{stat.label}</div>
                <div className={STYLES.analytics.statTrend}>{stat.trend}</div>
              </div>
            ))}
          </div>

          {/* CHART */}
          <div className={STYLES.analytics.chartCard}>
            <div className={STYLES.analytics.chartTitle}>اتجاه التقييمات</div>

            <div className={STYLES.analytics.chartBars}>
              {ANALYTICS_DASHBOARD.bars.map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className={STYLES.analytics.chartBar}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
/* ===== PART 4 ===== */
function SentimentDashboard() {
  return (
    <div className={STYLES.sentiment.dashboardOuter}>
      <div className={STYLES.sentiment.dashboardShadow} />

      <div className={STYLES.sentiment.dashboardCard}>
        <div className={STYLES.sentiment.dashboardTopBar}>
  <div className={STYLES.sentiment.topBarGroup}>
    <BrainCircuit className={STYLES.sentiment.dashboardTopAction} />
    <div className={STYLES.sentiment.dashboardTopTitle}>
      تحليل المشاعر
    </div>
  </div>
</div>

        <div className={STYLES.sentiment.dashboardBody}>
          <div className={STYLES.sentiment.sentimentHeader}>
            <div className="flex items-center gap-3">


  
  <div className={STYLES.sentiment.donutWrap}>
              <div
                className={STYLES.sentiment.donutRing}
                style={{
  background:
    'conic-gradient(#10b981 0deg 234deg, #f59e0b 234deg 306deg, #fb7185 306deg 360deg)',
}}
              />
              <div className={STYLES.sentiment.donutCenter} />
              <div className="relative z-10 flex flex-col items-center">
                <span className={STYLES.sentiment.donutValue}>82%</span>
                <span className={STYLES.sentiment.donutLabel}>إيجابي</span></div>
              </div>
              <div className={STYLES.sentiment.legend}>
              <div className={STYLES.sentiment.legendRow}>
                                <span className={`${STYLES.sentiment.legendDot} bg-emerald-500`} />
                <span>%65 — إيجابي</span>
              </div>
              <div className={STYLES.sentiment.legendRow}>
              <span className={`${STYLES.sentiment.legendDot} bg-amber-500`} />
                <span>%20 — محايد</span>
              </div>
              <div className={STYLES.sentiment.legendRow}>
                <span className={`${STYLES.sentiment.legendDot} bg-rose-400`} />
                <span>%15 — سلبي</span>
              </div>
            </div>
          </div>
            </div>

            

          <div className={STYLES.sentiment.topicsWrap}>
            <div className={STYLES.sentiment.topicsTitle}>المواضيع المكتشفة</div>

            <div className={STYLES.sentiment.topicsGrid}>
              <span className={`${STYLES.sentiment.topicChip} ${STYLES.sentiment.topicChipPositive}`}>
                جودة الطعام 88%
              </span>
              <span className={`${STYLES.sentiment.topicChip} ${STYLES.sentiment.topicChipNegative}`}>
                سرعة الخدمة 34%
              </span>
              <span className={`${STYLES.sentiment.topicChip} ${STYLES.sentiment.topicChipNeutral}`}>
                النظافة 92%
              </span>
              <span className={`${STYLES.sentiment.topicChip} ${STYLES.sentiment.topicChipPositive}`}>
                الموظفين 76%
              </span>
              <span className={`${STYLES.sentiment.topicChip} ${STYLES.sentiment.topicChipWarning}`}>
                الأسعار 58%
              </span>
            </div>
          </div>

          <div className={STYLES.sentiment.chartCard}>
            <div className={STYLES.sentiment.chartTitle}>اتجاه المشاعر</div>

            <div className={STYLES.sentiment.lineChartWrap}>
              <svg
                viewBox="0 0 220 36"
                preserveAspectRatio="none"
                className={STYLES.sentiment.lineChartSvg}
                aria-hidden="true"
              >
                <path
                  d="M8 26 C 34 26, 46 24, 64 24 S 98 20, 118 20 S 150 14, 172 16 S 198 10, 212 12"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  
                />
                <circle cx="212" cy="12" r="2" fill="#10b981" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== PART 5  ===== */
function CustomizationDashboard() {
  return (
    <div className={STYLES.customization.dashboardOuter}>
      <div className={STYLES.customization.dashboardShadow} />

      <div className={STYLES.customization.dashboardCard}>
        <div className={STYLES.customization.dashboardTopBar}>
  <div className={STYLES.customization.topBarGroup}>
    <SlidersHorizontal className={STYLES.customization.dashboardTopAction} />
    <div className={STYLES.customization.dashboardTopTitle}>
      إعدادات الموظف
    </div>
  </div>
</div>

        <div className={STYLES.customization.dashboardBody}>
          <div className={STYLES.customization.profileRow}>
  <div className={STYLES.customization.profileGroup}>
    <div className={STYLES.customization.avatarWrap}>
      <img
        src={avatar}
        alt="avatar"
        className={STYLES.customization.avatarImage}
      />
    </div>

    <div className={STYLES.customization.profileTextWrap}>
      <div className={STYLES.customization.profileName}>بدر</div>
      <div className={STYLES.customization.profileStatusRow}>
        <span className={STYLES.customization.profileStatusDot} />
        <span className={STYLES.customization.profileStatusText}>نشط</span>
      </div>
    </div>
  </div>
</div>

          <div className={STYLES.customization.fieldGroup}>
            <label className={STYLES.customization.fieldLabel}>نبرة الرد</label>

            <div className={STYLES.customization.segmentedControl}>
             
              
              <button
                type="button"
                className={`${STYLES.customization.segmentedButtonBase} ${STYLES.customization.segmentedButtonActive}`}
              >
                تلقائي
              </button>
               <button
                type="button"
                className={`${STYLES.customization.segmentedButtonBase} ${STYLES.customization.segmentedButtonMuted}`}
              >
                عاطفي
              </button>
              <button
                type="button"
                className={`${STYLES.customization.segmentedButtonBase} ${STYLES.customization.segmentedButtonMuted}`}
              >
                احترافي
              </button>
            </div>
          </div>

          <div className={STYLES.customization.fieldGroup}>
            <label className={STYLES.customization.fieldLabel}>تعليمات مخصصة</label>
            <textarea
              className={STYLES.customization.textarea}
              defaultValue="كن ودودًا جدًا، واذكر دائمًا أننا مطعم عائلي..."
            />
          </div>

          <div className={STYLES.customization.settingsList}>
            <div className={STYLES.customization.settingRow}>
              
              <span className={STYLES.customization.settingLabel}>الإيموجي</span>
              <span className={STYLES.customization.settingBadge}>قليل</span>
            </div>

            <div className={STYLES.customization.settingRow}>
              <span className={STYLES.customization.settingLabel}>طول الرد</span>
              <span className={STYLES.customization.settingBadge}>متوسط</span>
              
            </div>

            <div className={STYLES.customization.settingRow}>
              <span className={STYLES.customization.settingLabel}>التوقيت</span>
              <span className={STYLES.customization.settingBadge}>30-60 min</span>
              
            </div>
          </div>

          <div className={STYLES.customization.signatureCard}>
            <div className={STYLES.customization.signatureTitle}>التوقيع</div>
            <div className={STYLES.customization.signatureLine}>فريق خدمة العملاء</div>
            <div className={STYLES.customization.signatureLine}>966+ XXX XXXX</div>
          </div>
        </div>
      </div>
    </div>
  )
}
function AnalyticsPointItem({ point }: { point: AnalyticsPoint }) {
  const Icon = point.icon

  return (
    <div className={STYLES.analytics.pointRow}>
      <div className={STYLES.analytics.pointIconWrap}>
        <Icon className={STYLES.analytics.pointIcon} />
      </div>

      <div>
        <h3 className={STYLES.analytics.pointTitle}>{point.title}</h3>
        <p className={STYLES.analytics.pointDescription}>{point.description}</p>
      </div>
    </div>
  )
}
function AnalyticsSection() {
  const { ref, isVisible } = useRevealOnScroll()

  return (
    <section ref={ref} dir="rtl" className={STYLES.analytics.wrapper}>
      <div className={`${STYLES.shared.container} ${STYLES.analytics.container}`}>
        <div className={STYLES.analytics.layout}>
          <div
            className={[
              STYLES.analytics.textWrap,
              STYLES.analytics.reveal.base,
              isVisible
                ? STYLES.analytics.reveal.visible
                : STYLES.analytics.reveal.rightHidden,
            ].join(' ')}
          >
            <div className={STYLES.analytics.badge}>
              <BarChart3 className={STYLES.analytics.badgeIcon} />
              {CONTENT.analytics.badge}
            </div>

            <h2 className={STYLES.analytics.title}>
              {CONTENT.analytics.sectionTitle}
            </h2>

            <p className={STYLES.analytics.subtitle}>
              {CONTENT.analytics.sectionSubtitle}
            </p>

            <div className={STYLES.analytics.pointsList}>
              {CONTENT.analytics.points.map((point) => (
                <AnalyticsPointItem key={point.id} point={point} />
              ))}
            </div>
          </div>

          <div
            className={[
              STYLES.analytics.dashboardWrap,
              STYLES.analytics.reveal.base,
              isVisible
                ? STYLES.analytics.reveal.visible
                : STYLES.analytics.reveal.leftHidden,
            ].join(' ')}
          >
            <AnalyticsDashboard />
          </div>
        </div>
      </div>
    </section>
  )
}
function SentimentSection() {
  const { ref, isVisible } = useRevealOnScroll()

  return (
    <section ref={ref} dir="rtl" className={STYLES.sentiment.wrapper}>
      <div className={`${STYLES.shared.container} ${STYLES.sentiment.container}`}>
        <div className={STYLES.sentiment.layout}>
          <div
            className={[
              STYLES.sentiment.dashboardWrap,
              STYLES.sentiment.reveal.base,
              isVisible
                ? STYLES.sentiment.reveal.visible
                : STYLES.sentiment.reveal.rightHidden,
            ].join(' ')}
          >
            <SentimentDashboard />
          </div>

          <div
            className={[
              STYLES.sentiment.textWrap,
              STYLES.sentiment.reveal.base,
              isVisible
                ? STYLES.sentiment.reveal.visible
                : STYLES.sentiment.reveal.leftHidden,
            ].join(' ')}
          >
            <div className={STYLES.sentiment.badge}>
              <BrainCircuit className={STYLES.sentiment.badgeIcon} />
              {CONTENT.sentiment.badge}
            </div>

            <h2 className={STYLES.sentiment.title}>
              {CONTENT.sentiment.sectionTitle}
            </h2>

            <p className={STYLES.sentiment.subtitle}>
              {CONTENT.sentiment.sectionSubtitle}
            </p>

            <div className={STYLES.sentiment.pointsList}>
              {CONTENT.sentiment.points.map((point) => (
                <FeaturePointItem
                  key={point.id}
                  point={point}
                  styles={STYLES.sentiment}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
function CustomizationSection() {
  const { ref, isVisible } = useRevealOnScroll()

  return (
    <section ref={ref} dir="rtl" className={STYLES.customization.wrapper}>
      <div className={`${STYLES.shared.container} ${STYLES.customization.container}`}>
        <div className={STYLES.customization.layout}>
          
          {/* TEXT FIRST */}
          <div
            className={[
              STYLES.customization.textWrap,
              STYLES.customization.reveal.base,
              isVisible
                ? STYLES.customization.reveal.visible
                : STYLES.customization.reveal.rightHidden,
            ].join(' ')}
          >
            <div className={STYLES.customization.badge}>
              <SlidersHorizontal className={STYLES.customization.badgeIcon} />
              {CONTENT.customization.badge}
            </div>

            <h2 className={STYLES.customization.title}>
              {CONTENT.customization.sectionTitle}
            </h2>

            <p className={STYLES.customization.subtitle}>
              {CONTENT.customization.sectionSubtitle}
            </p>

            <div className={STYLES.customization.pointsList}>
              {CONTENT.customization.points.map((point) => (
                <FeaturePointItem
                  key={point.id}
                  point={point}
                  styles={STYLES.customization}
                />
              ))}
            </div>
          </div>

          {/* DASHBOARD SECOND */}
          <div
            className={[
              STYLES.customization.dashboardWrap,
              STYLES.customization.reveal.base,
              isVisible
                ? STYLES.customization.reveal.visible
                : STYLES.customization.reveal.leftHidden,
            ].join(' ')}
          >
            <CustomizationDashboard />
          </div>

        </div>
      </div>
    </section>
  )
}
/* ===== MAIN FEATURES EXPORT ===== */
export default function Features() {
  return (
    <>
      <LostReviewsSection />
      <SmartRepliesSection />

       <AnalyticsSection /> 
       <SentimentSection /> 
      <CustomizationSection />
    </>
  )
}
