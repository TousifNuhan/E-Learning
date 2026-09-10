'use client'

import { useMemo, useState } from 'react'
import {
  GraduationCap,
  Presentation,
  ShieldCheck,
  CreditCard,
  Minus,
  Plus,
  LifeBuoy,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = [
  {
    id: 'students',
    label: 'For students',
    blurb: 'Enrolling, assignments & evaluation reports',
    icon: GraduationCap,
  },
  {
    id: 'teachers',
    label: 'For teachers',
    blurb: 'Applying to teach, adding classes & progress',
    icon: Presentation,
  },
  {
    id: 'payments',
    label: 'Payments',
    blurb: 'Checkout, invoices & enrollment records',
    icon: CreditCard,
  },
  {
    id: 'admin',
    label: 'Accounts & admin',
    blurb: 'Roles, approvals, sessions & security',
    icon: ShieldCheck,
  },
]

const faqs = [
  {
    id: 's1',
    category: 'students',
    tag: 'Enrollment',
    question: 'How do I enroll in a class on EduManage?',
    answer:
      'Open All Courses, pick a course card and press Enroll. That takes you to the class details page where you can review the teacher, price, description and total enrollment before you commit. Pressing Pay sends you to the secure checkout, and once payment succeeds you land straight on your My Enroll Class page in the student dashboard.',
  },
  {
    id: 's2',
    category: 'students',
    tag: 'Assignments',
    question: 'Where do I find and submit the assignments for a class?',
    answer:
      'From My Enroll Class press Continue on any class to open its detail view. Every assignment your teacher has created appears there in a table with its title, description and deadline, plus a Submit button beside each one. Submitting instantly bumps that day’s submission counter on the teacher’s progress cards, so they can see participation in real time.',
  },
  {
    id: 's3',
    category: 'students',
    tag: 'Feedback',
    question: 'What is the Teaching Evaluation Report (TER)?',
    answer:
      'TER is how you review a class you are enrolled in. The button sits right under the navbar on your enrolled class detail page and opens a short modal with a description field and a star rating. Once sent, your review is stored against that class, shown in the homepage feedback carousel, and visible to admins on the class progress page.',
  },
  {
    id: 's4',
    category: 'students',
    tag: 'Catalogue',
    question: 'Why can I not see a class that a teacher told me about?',
    answer:
      'Every class starts life as pending after a teacher adds it. It only appears in All Courses once an admin approves it, and rejected classes never get listed. If the class is brand new, give the review a little time — the teacher can see its live status on their My Class page.',
  },
  {
    id: 't1',
    category: 'teachers',
    tag: 'Applications',
    question: 'How do I become a teacher on EduManage?',
    answer:
      'Head to the Teach on EduManage page while logged in and fill in the application: your name, a title, your experience level (beginner, mid-level or experienced) and a category such as web development or digital marketing. Press Submit for Review and your request lands in the admin’s Teacher Request queue.',
  },
  {
    id: 't2',
    category: 'teachers',
    tag: 'Applications',
    question: 'My teaching request was rejected. Can I apply again?',
    answer:
      'Yes. When a request is rejected the page swaps the Submit for Review button for a Request to Another button, so you can strengthen your title, category or experience and reapply. Once a request is approved, your role becomes teacher, the form disappears and the teacher dashboard unlocks.',
  },
  {
    id: 't3',
    category: 'teachers',
    tag: 'Classes',
    question: 'What happens after I add a class?',
    answer:
      'The class is saved with a pending status, you are redirected to My Class, and the class simultaneously appears in the admin’s All Courses review table. You can update or delete it at any point — deletion always asks for confirmation first — and the status on the card changes to accepted or rejected once an admin decides.',
  },
  {
    id: 't4',
    category: 'teachers',
    tag: 'Progress',
    question: 'Why is the See Details button on my class disabled?',
    answer:
      'See Details only unlocks after an admin approves the class. Inside, the class progress section shows three live cards — total enrollment, total assignments and per-day assignment submissions — and the Create button opens a modal for adding an assignment title, deadline and description, which increments your total assignment card immediately.',
  },
  {
    id: 'p1',
    category: 'payments',
    tag: 'Checkout',
    question: 'Is payment required before I can access a class?',
    answer:
      'Yes. Access is granted after a successful payment. Your payment and the related class information are written to a dedicated collection, which is what powers your My Enroll Class list and the enrollment counters shown across the site.',
  },
  {
    id: 'p2',
    category: 'payments',
    tag: 'Invoices',
    question: 'Can I download a receipt for a class I paid for?',
    answer:
      'Your student dashboard has a My Order page listing every purchase with the class title, price, transaction id, your email and the teacher’s email. The Invoice button on each row generates a downloadable PDF receipt you can keep for reimbursement or records.',
  },
  {
    id: 'p3',
    category: 'payments',
    tag: 'Counters',
    question: 'How are the enrollment numbers on the homepage calculated?',
    answer:
      'They are live figures, not estimates. The statistics section adds up total registered users, total classes published from teacher dashboards and total enrollments across the platform, and each class card carries its own enrollment count that increases the moment someone completes payment.',
  },
  {
    id: 'a1',
    category: 'admin',
    tag: 'Roles',
    question: 'What role do I get when I sign up?',
    answer:
      'Every new account — whether created with email and password or through Google sign-in — starts as a student. From there an admin can promote a user to admin from the Users table, and an approved teaching request upgrades a student to teacher automatically.',
  },
  {
    id: 'a2',
    category: 'admin',
    tag: 'Sessions',
    question: 'Will I be logged out if I refresh a dashboard page?',
    answer:
      'No. A JWT is issued on login and stored in local storage, and the app restores your session while it loads, so refreshing a private route keeps you exactly where you were instead of bouncing you to the login page.',
  },
  {
    id: 'a3',
    category: 'admin',
    tag: 'Moderation',
    question: 'How do admins review teachers and classes?',
    answer:
      'The admin dashboard has a Teacher Request table with approve and reject actions that disable once a decision is made, a Users table with server-side search by name or email plus a Make Admin action, and an All Courses table where approving a class enables See Progress to inspect its student feedback.',
  },
  {
    id: 'a4',
    category: 'admin',
    tag: 'Profile',
    question: 'Where can I update my profile information?',
    answer:
      'Click your photo in the navbar and choose Dashboard, then Profile. Students, teachers and admins all get the same view showing name, role, image, email and phone, so you can confirm at a glance which permissions your account currently has.',
  },
]

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('students')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState('s1')

  const visibleFaqs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length > 0) {
      return faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q) ||
          faq.tag.toLowerCase().includes(q),
      )
    }
    return faqs.filter((faq) => faq.category === activeCategory)
  }, [activeCategory, query])

  const isSearching = query.trim().length > 0

  return (
    <section
      aria-labelledby="faq-heading"
      className="w-full bg-[#051315] py-16 md:py-24 text-white select-none"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 md:px-6 lg:flex-row lg:gap-14">
        
        <div className="flex flex-col gap-6 lg:w-[19rem] lg:shrink-0">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#162e31] bg-[#091b1d] px-3 py-1 text-xs font-medium tracking-wide text-[#889c9e] uppercase">
              <LifeBuoy className="size-3.5 text-[#4ebcb0]" aria-hidden="true" />
              Help center
            </span>
            <h2
              id="faq-heading"
              className="font-display text-3xl leading-tight font-bold tracking-tight text-white md:text-4xl"
            >
              Questions, answered by role
            </h2>
            <p className="text-pretty text-[#889c9e] text-sm leading-relaxed">
              EduManage works a little differently depending on whether you are
              learning, teaching or moderating. Pick your role below, or search
              across every answer at once.
            </p>
          </div>

          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#889c9e]/60"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setOpenId(null)
              }}
              placeholder="Search all questions"
              aria-label="Search frequently asked questions"
              className="h-11 w-full rounded-lg border border-[#162e31] bg-[#091b1d] pr-3 pl-9 text-sm text-white outline-none placeholder:text-[#889c9e]/40 focus:border-[#4ebcb0]/50 transition-all"
            />
          </div>

          <div
            role="tablist"
            aria-label="FAQ categories"
            aria-orientation="vertical"
            className="flex flex-col gap-2"
          >
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = !isSearching && activeCategory === category.id

              return (
                <button
                  key={category.id}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => {
                    setQuery('')
                    setActiveCategory(category.id)
                    const first = faqs.find((f) => f.category === category.id)
                    setOpenId(first ? first.id : null)
                  }}
                  className={cn(
                    'group flex items-start gap-3 rounded-lg border px-3 py-3 text-left transition-all',
                    isActive
                      ? 'border-[#4ebcb0] bg-[#4ebcb0] text-[#051315] font-bold'
                      : 'border-[#162e31] bg-[#091b1d]/40 text-[#889c9e] hover:border-[#162e31] hover:bg-[#091b1d]',
                  )}
                >
                  <Icon
                    className={cn(
                      'mt-0.5 size-5 shrink-0',
                      isActive ? 'text-[#051315]' : 'text-[#4ebcb0]',
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">
                      {category.label}
                    </span>
                    <span
                      className={cn(
                        'text-xs leading-relaxed',
                        isActive ? 'text-[#051315]/80' : 'text-[#889c9e]/80',
                      )}
                    >
                      {category.blurb}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p
            aria-live="polite"
            className="mb-4 text-xs font-semibold tracking-wide text-[#889c9e] uppercase"
          >
            {isSearching
              ? `Results for "${query.trim()}"`
              : `FOR ${activeCategory.toUpperCase()}`}
          </p>

          {visibleFaqs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#162e31] bg-[#091b1d]/40 p-8 text-center">
              <p className="font-medium text-slate-300">
                No answers matched that search.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {visibleFaqs.map((faq, index) => {
                const isOpen = openId === faq.id
                const panelId = `faq-panel-${faq.id}`
                const buttonId = `faq-button-${faq.id}`

                return (
                  <li
                    key={faq.id}
                    className={cn(
                      'overflow-hidden rounded-xl border transition-all duration-200',
                      isOpen
                        ? 'border-[#4ebcb0]/40 bg-[#091b1d]'
                        : 'border-[#162e31] bg-[#091b1d]/30 hover:border-[#162e31]/80',
                    )}
                  >
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className="flex w-full items-start gap-4 px-4 py-4 text-left md:px-5"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'mt-0.5 font-mono text-xs font-bold tabular-nums',
                            isOpen ? 'text-[#4ebcb0]' : 'text-[#4ebcb0]/70',
                          )}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-2">
                          <span className="font-display text-base font-semibold text-white md:text-lg tracking-tight">
                            {faq.question}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded bg-[#051315] border border-[#162e31] px-2 py-0.5 text-[0.6875rem] font-medium tracking-wide text-[#889c9e] uppercase">
                              {faq.tag}
                            </span>
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border transition-all',
                            isOpen
                              ? 'border-[#4ebcb0] bg-[#4ebcb0] text-[#051315]'
                              : 'border-[#162e31] bg-[#051315] text-[#e8f0ef]',
                          )}
                        >
                          {isOpen ? (
                            <Minus className="size-4" />
                          ) : (
                            <Plus className="size-4" />
                          )}
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className="px-4 pb-5 md:px-5"
                    >
                      <div className="border-l-2 border-[#a16207] pl-4 md:ml-8">
                        <p className="text-pretty text-sm leading-relaxed text-[#889c9e] md:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}