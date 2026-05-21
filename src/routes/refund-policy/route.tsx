import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'

export const Route = createFileRoute('/refund-policy')({
  component: RefundPolicyPage,
})

const sections = [
  {
    title: '1. مقدمة',
    body: 'توضح هذه السياسة شروط الإلغاء والاسترجاع الخاصة بخدمات واشتراكات بريق AI.',
  },
  {
    title: '2. الاشتراكات',
    body: 'قد تعتمد خدمات بريق AI على نظام اشتراكات شهرية أو دورية يتم تجديدها وفقًا للخطة المختارة.',
  },
  {
    title: '3. سياسة الاسترجاع',
    body: 'يمكن طلب استرجاع المبلغ خلال الفترة التي يسمح بها النظام أو حسب ما تقرره بريق AI بعد مراجعة الحالة.',
  },
  {
    title: '4. الخدمات المستخدمة',
    body: 'قد لا تكون بعض المبالغ المدفوعة قابلة للاسترجاع بعد استخدام الخدمة أو استهلاك الموارد المرتبطة بها.',
  },
  {
    title: '5. الإلغاء',
    body: 'يمكن للمستخدم إلغاء الاشتراك قبل موعد التجديد لتجنب أي رسوم مستقبلية.',
  },
  {
    title: '6. المدفوعات',
    body: 'تتم معالجة المدفوعات والاسترجاعات عبر مزودي خدمات دفع خارجيين مثل Tap Payments وقد تستغرق عملية الاسترجاع عدة أيام عمل حسب مزود الدفع والبنك.',
  },
  {
    title: '7. إساءة الاستخدام',
    body: 'يحق لبريق AI رفض طلبات الاسترجاع في حالات إساءة الاستخدام أو الاحتيال أو مخالفة شروط الاستخدام.',
  },
  {
    title: '8. التواصل',
    body: 'لأي استفسار متعلق بالإلغاء أو الاسترجاع يمكن التواصل عبر: rah@bariqai.io',
  },
]

function RefundPolicyPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-3xl font-extrabold">
            سياسة الاسترجاع والاسترداد
          </h1>

          <p className="mb-10 text-slate-500">
            آخر تحديث: 21 مايو 2026
          </p>

          <div className="space-y-8">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="mb-3 text-xl font-bold">
                  {section.title}
                </h2>

                <p className="leading-8 text-slate-600">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}