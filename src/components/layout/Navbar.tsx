"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect, useContext } from "react"
import type { LucideIcon } from "lucide-react"
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CartContext } from "@/context/CartContext"
import { useLogoContext } from "@/context/LogoContext"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Meditations", href: "/meditations" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

// light = white logo on gold navbar; dark = dark logo on white sheet
function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <Image
      src="/images/logo1.png"
      alt="Chandi Silver Studio"
      width={68}
      height={68}
      style={{
        width: 68,
        height: "auto",
        display: "block",
        filter: variant === "light" ? "brightness(10)" : "brightness(0)",
      }}
    />
  )
}

type IconEntry = { Icon: LucideIcon; href: string; badge?: number }

function IconButton({ Icon, href, badge, light = true }: IconEntry & { light?: boolean }) {
  const iconColor = light ? "var(--color-white)" : "var(--color-text)"
  const badgeBg = light ? "var(--color-white)" : "var(--color-gold)"
  const badgeText = light ? "var(--color-gold-dark)" : "var(--color-white)"

  return (
    <Link href={href} className="nav-icon" style={{ position: "relative", color: iconColor }}>
      <Icon size={20} strokeWidth={1.5} />
      {badge != null && badge > 0 && (
        <span
          style={{
            position: "absolute",
            top: -6,
            right: -8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: badgeBg,
            color: badgeText,
            fontSize: 10,
            fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const { cartCount } = useContext(CartContext)
  const { navLogoRef, navLogoVisible } = useLogoContext()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wishlist")
      if (raw) setWishlistCount((JSON.parse(raw) as unknown[]).length)
    } catch {
      // ignore malformed localStorage
    }
  }, [])

  const icons: IconEntry[] = [
    { Icon: Search, href: "/search" },
    { Icon: Heart, href: "/wishlist", badge: wishlistCount },
    { Icon: ShoppingBag, href: "/cart", badge: cartCount },
    { Icon: User, href: "/account" },
  ]

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 72,
        background: "var(--color-gold-dark)",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.20)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Logo — invisible until HeroSection animation completes; revealed via LogoContext */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <div
            ref={navLogoRef}
            style={{
              opacity: navLogoVisible ? 1 : 0,
              visibility: navLogoVisible ? "visible" : "hidden",
            }}
          >
            <Logo variant="light" />
          </div>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center" style={{ gap: 32, marginLeft: 48 }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("nav-link", pathname === link.href && "active")}
              style={{ color: "var(--color-white)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Icons — desktop */}
        <div className="hidden md:flex items-center" style={{ gap: 20 }}>
          {icons.map(({ Icon, href, badge }) => (
            <IconButton key={href} Icon={Icon} href={href} badge={badge} light={true} />
          ))}
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  color: "var(--color-white)",
                }}
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={true}
              className="bg-white flex flex-col p-0 w-[85vw] sm:max-w-xs"
              style={{ background: "var(--color-white)" }}
            >
              {/* Dark logo on white sheet */}
              <div style={{ padding: "48px 24px 20px" }}>
                <Link
                  href="/"
                  style={{ textDecoration: "none" }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Logo variant="dark" />
                </Link>
              </div>

              <div style={{ height: 1, background: "var(--color-border)", margin: "0 24px" }} />

              <nav style={{ padding: "4px 24px" }}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn("nav-link", pathname === link.href && "active")}
                    style={{ display: "block", fontSize: 15, padding: "16px 0" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div style={{ height: 1, background: "var(--color-border)", margin: "0 24px" }} />

              <div style={{ display: "flex", justifyContent: "center", gap: 24, padding: "24px 24px" }}>
                {icons.map(({ Icon, href, badge }) => (
                  <IconButton key={href} Icon={Icon} href={href} badge={badge} light={false} />
                ))}
              </div>

              <div style={{ marginTop: "auto", padding: "16px 24px 24px", textAlign: "center" }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--color-muted)",
                    fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
                  }}
                >
                  © Chandi Silver Studio
                </span>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
