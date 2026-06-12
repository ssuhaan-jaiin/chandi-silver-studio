"use client"

import Link from "next/link"
import { Star, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"

function FooterLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontWeight: 400,
          fontSize: 22,
          letterSpacing: "0.08em",
          color: "var(--color-text)",
          lineHeight: 1,
        }}
      >
        Chandi
      </span>
      <span
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontStyle: "italic",
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "var(--color-muted)",
          marginTop: 2,
          lineHeight: 1,
        }}
      >
        Silver Studio
      </span>
    </div>
  )
}

const COLUMN_HEADING_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
  fontSize: 11,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--color-muted)",
  marginBottom: 16,
  display: "block",
}

const LINK_STYLE: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
  fontSize: 13,
  color: "var(--color-text)",
  textDecoration: "none",
  marginBottom: 10,
  transition: "color 0.2s ease",
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={LINK_STYLE}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text)")}
    >
      {children}
    </Link>
  )
}

export default function Footer() {
  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault()
  }

  return (
    <footer>
      {/* Trust bar */}
      <div
        style={{
          background: "var(--color-blush)",
          padding: "14px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                fill="var(--color-gold)"
                stroke="none"
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
              fontSize: 13,
              color: "var(--color-text)",
            }}
          >
            Trusted by 7,000+ customers
          </span>
        </div>
      </div>

      {/* Main footer */}
      <div
        style={{
          background: "var(--color-footer)",
          borderTop: "1px solid var(--color-gold)",
          padding: "64px 0 40px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Column 1 — Brand */}
          <div>
            <FooterLogo />
            <p
              style={{
                fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
                fontSize: 13,
                color: "var(--color-muted)",
                marginTop: 16,
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              Intentional gemstone jewellery, thoughtfully sourced.
            </p>
            <a
              href="https://instagram.com/chandisilverstudio"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--color-text)",
                transition: "color 0.2s ease",
                display: "inline-flex",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text)")}
              aria-label="Instagram"
            >
              {/* Instagram SVG — lucide-react does not include this icon */}
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
          </div>

          {/* Column 2 — Shop */}
          <div>
            <span style={COLUMN_HEADING_STYLE}>Shop</span>
            <FooterLink href="/shop">All Jewellery</FooterLink>
            <FooterLink href="/shop/rings">Rings</FooterLink>
            <FooterLink href="/shop/necklaces">Necklaces</FooterLink>
            <FooterLink href="/shop/bracelets">Bracelets</FooterLink>
            <FooterLink href="/shop/earrings">Earrings</FooterLink>
            <FooterLink href="/shop/crystals">Crystals</FooterLink>
            <FooterLink href="/shop/bestsellers">Bestsellers</FooterLink>
            <FooterLink href="/shop/new">New Arrivals</FooterLink>
          </div>

          {/* Column 3 — Help */}
          <div>
            <span style={COLUMN_HEADING_STYLE}>Help</span>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/returns">Returns & Exchanges</FooterLink>
            <FooterLink href="/shipping">Shipping Info</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
          </div>

          {/* Column 4 — Connect */}
          <div>
            <span style={COLUMN_HEADING_STYLE}>Connect</span>

            {/* WhatsApp */}
            <a
              href="https://wa.me/PHONENUMBER"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                width: "100%",
                border: "1px solid var(--color-gold)",
                background: "transparent",
                fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
                fontSize: 13,
                color: "var(--color-text)",
                padding: "10px 16px",
                textDecoration: "none",
                textAlign: "center",
                marginBottom: 12,
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-gold)"
                e.currentTarget.style.color = "var(--color-white)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "var(--color-text)"
              }}
            >
              Chat on WhatsApp
            </a>

            {/* Email */}
            <p
              style={{
                fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
                fontSize: 13,
                color: "var(--color-muted)",
                marginBottom: 20,
              }}
            >
              hello@chandisilverstudio.com
            </p>

            {/* Newsletter */}
            <form onSubmit={handleNewsletterSubmit}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-muted)",
                  marginBottom: 8,
                }}
              >
                Join our community
              </label>
              <div style={{ display: "flex", gap: 0 }}>
                <Input
                  type="email"
                  placeholder="Your email"
                  required
                  style={{
                    borderRadius: "2px 0 0 2px",
                    borderRight: "none",
                    fontSize: 13,
                    height: 36,
                    borderColor: "var(--color-border)",
                    background: "var(--color-white)",
                  }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  style={{
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    background: "var(--color-gold)",
                    border: "none",
                    borderRadius: "0 2px 2px 0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-white)",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-gold-dark)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-gold)")}
                >
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          background: "var(--color-footer)",
          borderTop: "1px solid var(--color-border)",
          padding: "24px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
          className="flex-col sm:flex-row text-center sm:text-left"
        >
          <span
            style={{
              fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
              fontSize: 12,
              color: "var(--color-muted)",
            }}
          >
            © 2025 Chandi Silver Studio. Made with intention.
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
              fontSize: 11,
              color: "var(--color-muted)",
            }}
          >
            Visa · Mastercard · Klarna · Apple Pay · Google Pay
          </span>
        </div>
      </div>
    </footer>
  )
}
