import { ChevronDown } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'

function FaqAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  isRTL,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  isRTL: boolean
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#F3F4F6] bg-white transition-shadow duration-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`flex w-full items-center justify-between gap-4 px-5 py-6 ${textAlign} sm:px-6`}
      >
        <span className="flex-1 text-[16px] font-black leading-[1.7] text-[#111827] sm:text-[17px]">
          {question}
        </span>
        <span className={`mt-1 shrink-0 text-[#111827] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className="h-5 w-5" strokeWidth={2.2} />
        </span>
      </button>

      <div
        id={panelId}
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight ?? 0}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="px-5 pb-6 sm:px-6">
          <p className={`max-w-[88%] text-[15px] leading-[2] text-[#667085] sm:text-[16px] ${textAlign}`}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { t, dir, isRTL } = useLocale()
  const [openIndex, setOpenIndex] = useState<number>(4)

  return (
    <section className="bg-white py-20 sm:py-24" dir={dir} id="faq">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-0">
        <div className="text-center">
          <h2 className="text-[38px] font-bold leading-[1.25] tracking-[-0.02em] text-[#0F172A] sm:text-[48px]">
            {t.faq.title}
          </h2>
          <p className="mt-3 text-[18px] leading-8 text-[#667085]">{t.faq.subtitle}</p>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          {t.faq.items.map((item, index) => (
            <FaqAccordionItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
              isRTL={isRTL}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-[18px] leading-8 text-[#667085]">
          {t.faq.contactPrefix}{' '}
          <a
            href={`mailto:${t.faq.contactEmail}`}
            className="font-semibold text-[#0EA5A4] transition-colors hover:text-[#0B8E8D]"
          >
            {t.faq.contactEmail}
          </a>
        </p>
      </div>
    </section>
  )
}
