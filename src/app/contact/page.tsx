import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with Chandi Silver Studio — questions about crystals, bespoke orders, or wholesale enquiries. We respond within 24 hours.',
})
import { Clock, MessageCircle, Music } from 'lucide-react'
import { sanityClient } from '@/lib/sanity'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import ContactForm from '@/components/contact/ContactForm'
import InstagramFeed from '@/components/sections/InstagramFeed'

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

interface FaqItem {
  question: string
  answer: string
  category: string
}

const FAQ_QUERY = `*[_type == "faqItem"] | order(order asc) {
  question, answer, category
}`

const MOCK_FAQS: FaqItem[] = [
  { question: 'How long does shipping take?',           answer: 'UK orders arrive in 3–5 working days. International orders take 7–14 days.',                                          category: 'Shipping' },
  { question: 'What is your return policy?',            answer: 'We offer 14-day returns on all unworn items in original packaging.',                                                  category: 'Returns'  },
  { question: 'Are your crystals ethically sourced?',   answer: 'Yes — every gemstone is sourced directly from trusted suppliers in India and global gem shows.',                       category: 'Products' },
  { question: 'Can I request a specific crystal?',      answer: 'Yes! Send us a message via WhatsApp or email and we will do our best to source it for you.',                          category: 'Products' },
  { question: 'Do you offer gift packaging?',           answer: 'All orders come in our signature luxury packaging. We also offer a gift message option at checkout.',                  category: 'Orders'   },
  { question: 'Are the crystals natural or synthetic?', answer: 'All our crystals are 100% natural and untreated unless otherwise stated in the product description.',                  category: 'Crystals' },
]

async function fetchFaqs(): Promise<FaqItem[]> {
  try {
    const data = await sanityClient.fetch<FaqItem[]>(FAQ_QUERY)
    return data && data.length > 0 ? data : MOCK_FAQS
  } catch {
    return MOCK_FAQS
  }
}

export default async function ContactPage() {
  const faqs = await fetchFaqs()

  return (
    <>
      <style>{`
        .contact-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
        }
        .contact-social-row { display: flex; gap: 12px; margin-bottom: 28px; }
        .contact-social-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          border: 1px solid var(--color-border);
          background: transparent; cursor: pointer; padding: 12px 20px;
          font-family: var(--font-sans, "DM Sans", sans-serif);
          font-size: 13px; color: var(--color-text);
          text-decoration: none;
          transition: border-color 0.25s ease, color 0.25s ease;
        }
        .contact-social-btn:hover {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }
        @media (max-width: 768px) {
          .contact-main-grid { grid-template-columns: 1fr; }
          .contact-social-row { flex-direction: column; }
        }
      `}</style>

      <main style={{ paddingTop: 80 }}>
        {/* Header */}
        <div
          style={{
            background: 'var(--color-bg)',
            padding: '80px 24px 48px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, fontSize: 48, color: 'var(--color-text)',
              marginBottom: 8,
            }}
          >
            Get in touch
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 15, fontWeight: 300, color: 'var(--color-muted)',
              margin: 0,
            }}
          >
            We&rsquo;d love to hear from you
          </p>
        </div>

        {/* Main two-column section */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px' }}>
          <div className="contact-main-grid">
            {/* Left — form */}
            <ContactForm />

            {/* Right — contact info */}
            <div>
              <h2
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontWeight: 400, fontSize: 26, color: 'var(--color-text)',
                  marginBottom: 28,
                }}
              >
                Other ways to reach us
              </h2>

              {/* WhatsApp */}
              <Link
                href="https://wa.me/PHONENUMBER"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '16px 20px', width: '100%',
                  background: '#25D366', color: 'white',
                  border: 'none', borderRadius: 0,
                  marginBottom: 16, textDecoration: 'none',
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 14, fontWeight: 500,
                }}
              >
                <MessageCircle size={20} stroke="white" strokeWidth={1.5} />
                Chat on WhatsApp
              </Link>

              {/* Social buttons */}
              <div className="contact-social-row">
                <Link
                  href="https://instagram.com/chandisilverstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-btn"
                >
                  <InstagramIcon size={16} />
                  Instagram
                </Link>
                <Link
                  href="https://tiktok.com/@chandisilverstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-btn"
                >
                  <Music size={16} strokeWidth={1.5} />
                  TikTok
                </Link>
              </div>

              {/* Email */}
              <p
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--color-muted)', marginBottom: 6,
                }}
              >
                Email
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 14, color: 'var(--color-text)', marginBottom: 0,
                }}
              >
                hello@chandisilverstudio.com
              </p>

              <div style={{ height: 1, background: 'var(--color-border)', margin: '28px 0' }} />

              {/* Response time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={14} stroke="var(--color-gold)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                <p
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 13, fontWeight: 300, color: 'var(--color-muted)',
                    margin: 0,
                  }}
                >
                  We typically respond within 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* FAQ section */}
          <div
            style={{
              marginTop: 80, paddingTop: 80,
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <h2
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 400, fontSize: 36, color: 'var(--color-text)',
                textAlign: 'center', marginBottom: 40,
              }}
            >
              Frequently Asked Questions
            </h2>

            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <Accordion type="single" collapsible>
                {(() => {
                  let lastCategory = ''
                  return faqs.map((faq, i) => {
                    const showCategory = faq.category !== lastCategory
                    lastCategory = faq.category
                    return (
                      <div key={i}>
                        {showCategory && (
                          <p
                            style={{
                              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                              fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em',
                              color: 'var(--color-gold)', marginTop: i === 0 ? 0 : 8, marginBottom: 4,
                            }}
                          >
                            {faq.category}
                          </p>
                        )}
                        <AccordionItem value={`faq-${i}`} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <AccordionTrigger
                            className="!no-underline hover:!no-underline"
                            style={{
                              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                              fontSize: 15, color: 'var(--color-text)',
                              fontWeight: 400, padding: '20px 0',
                            }}
                          >
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent
                            style={{
                              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                              fontSize: 14, fontWeight: 300, lineHeight: 1.75,
                              color: 'var(--color-muted)', paddingBottom: 20,
                            }}
                          >
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      </div>
                    )
                  })
                })()}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Instagram feed */}
        <div style={{ marginTop: 80 }}>
          <p
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, fontSize: 28, color: 'var(--color-text)',
              textAlign: 'center', marginBottom: 0,
            }}
          >
            Follow our journey @chandisilverstudio
          </p>
          <InstagramFeed />
        </div>
      </main>
    </>
  )
}
