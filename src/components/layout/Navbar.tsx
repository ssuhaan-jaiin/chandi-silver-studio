"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import type { LucideIcon } from "lucide-react"
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCartContext } from "@/context/CartContext"
import { useLogoContext } from "@/context/LogoContext"
import CartDrawer from "@/components/layout/CartDrawer"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Meditations", href: "/meditations" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

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

type IconEntry = { Icon: LucideIcon; href?: string; badge?: number; onClick?: () => void; ariaLabel?: string }

function IconButton({ Icon, href, badge, onClick, ariaLabel, light = true, animate = false }: IconEntry & { light?: boolean; animate?: boolean }) {
  const iconColor = light ? "var(--color-white)" : "var(--color-text)"
  const badgeBg = light ? "var(--color-white)" : "var(--color-gold)"
  const badgeText = light ? "var(--color-gold-dark)" : "var(--color-white)"

  const inner = (
    <>
      <Icon size={20} strokeWidth={1.5} />
      {badge != null && badge > 0 && (
        <span
          className={animate ? "cart-bounce" : ""}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -6, right: -8,
            width: 16, height: 16,
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
    </>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        className="nav-icon"
        style={{ position: "relative", color: iconColor, background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        {inner}
      </button>
    )
  }

  return (
    <Link href={href!} aria-label={ariaLabel} className="nav-icon" style={{ position: "relative", color: iconColor }}>
      {inner}
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [badgeAnimate, setBadgeAnimate] = useState(false)
  const { cartCount, openCart } = useCartContext()
  const { navLogoRef, navLogoVisible } = useLogoContext()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("chandi-wishlist")
      if (raw) setWishlistCount((JSON.parse(raw) as unknown[]).length)
    } catch { /* ignore */ }
  }, [])

  // Badge bounce animation on cart count increase
  useEffect(() => {
    if (cartCount > 0) {
      setBadgeAnimate(true)
      const t = setTimeout(() => setBadgeAnimate(false), 400)
      return () => clearTimeout(t)
    }
  }, [cartCount])

  return (
    <>
      <style>{`
        @keyframes cartBounce {
          0%, 100% { transform: scale(1); }
          30%       { transform: scale(1.5); }
          60%       { transform: scale(0.9); }
        }
        .cart-bounce { animation: cartBounce 0.4s ease; }
        .nav-shop-wrapper { position: relative; }
        .nav-shop-dropdown {
          position: absolute; top: 100%; left: 0;
          background: var(--color-white);
          border: 1px solid var(--color-border);
          min-width: 200px; padding: 8px 0; z-index: 100;
          box-shadow: 0 8px 24px rgba(44,44,44,0.08);
          opacity: 0; pointer-events: none;
          transform: translateY(-4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .nav-shop-wrapper:hover .nav-shop-dropdown {
          opacity: 1; pointer-events: auto; transform: translateY(0);
        }
        .nav-shop-wrapper::after {
          content: ''; position: absolute;
          top: 100%; left: 0; right: 0; height: 10px;
        }
        .nav-shop-dropdown a {
          display: block;
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          font-size: 13px; padding: 10px 20px;
          color: var(--color-text); text-decoration: none;
          transition: all 0.15s ease;
        }
        .nav-shop-dropdown a:hover {
          color: var(--color-gold); background: var(--color-bg);
        }
        .nav-shop-sep { height: 1px; background: var(--color-border); margin: 4px 0; }
      `}</style>

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
          {/* Logo */}
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
            {NAV_LINKS.map((link) =>
              link.href === "/shop" ? (
                <div key={link.href} className="nav-shop-wrapper">
                  <Link
                    href={link.href}
                    className={cn("nav-link", pathname.startsWith("/shop") && "active")}
                    style={{ color: "var(--color-white)" }}
                  >
                    {link.label}
                  </Link>
                  <div className="nav-shop-dropdown">
                    <Link href="/shop">All Jewellery</Link>
                    <Link href="/shop?type=rings">Rings</Link>
                    <Link href="/shop?type=necklaces">Necklaces</Link>
                    <Link href="/shop?type=bracelets">Bracelets</Link>
                    <Link href="/shop?type=earrings">Earrings</Link>
                    <div className="nav-shop-sep" />
                    <Link href="/shop#intention">Shop by Intention</Link>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn("nav-link", pathname === link.href && "active")}
                  style={{ color: "var(--color-white)" }}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div style={{ flex: 1 }} />

          {/* Icons — desktop */}
          <div className="hidden md:flex items-center" style={{ gap: 20 }}>
            <IconButton Icon={Search} href="/search" ariaLabel="Search" light={true} />
            <IconButton Icon={Heart} href="/wishlist" badge={wishlistCount} ariaLabel={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`} light={true} />
            <IconButton
              Icon={ShoppingBag}
              onClick={openCart}
              badge={cartCount}
              ariaLabel={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              light={true}
              animate={badgeAnimate}
            />
            <IconButton Icon={User} href="/account" ariaLabel="Account" light={true} />
          </div>

          {/* Mobile: hamburger */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 4, display: "flex", alignItems: "center",
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
                <div style={{ padding: "48px 24px 20px" }}>
                  <Link href="/" style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
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
                  <IconButton Icon={Search} href="/search" ariaLabel="Search" light={false} />
                  <IconButton Icon={Heart} href="/wishlist" badge={wishlistCount} ariaLabel={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`} light={false} />
                  <IconButton Icon={ShoppingBag} onClick={() => { setMobileOpen(false); openCart() }} badge={cartCount} ariaLabel={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ''}`} light={false} animate={badgeAnimate} />
                  <IconButton Icon={User} href="/account" ariaLabel="Account" light={false} />
                </div>

                <div style={{ marginTop: "auto", padding: "16px 24px 24px", textAlign: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--color-muted)", fontFamily: "var(--font-sans, 'DM Sans', sans-serif)" }}>
                    © Chandi Silver Studio
                  </span>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Cart drawer rendered here so it's always mounted */}
      <CartDrawer />
    </>
  )
}
