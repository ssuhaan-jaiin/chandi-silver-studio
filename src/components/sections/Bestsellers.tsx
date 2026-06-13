'use client'

import Link from 'next/link'
import ProductCard from '@/components/shop/ProductCard'

const MOCK_PRODUCTS = [
  { id: '1', title: 'Rose Quartz Ring',          handle: 'rose-quartz-ring',          price: '68.00',  currencyCode: 'GBP', intention: 'Love',         totalInventory: 1, imageUrl: '/images/back.png' },
  { id: '2', title: 'Amethyst Pendant Necklace', handle: 'amethyst-pendant-necklace', price: '120.00', currencyCode: 'GBP', intention: 'Anxiety Relief', totalInventory: 3, imageUrl: '/images/back2.png' },
  { id: '3', title: 'Moonstone Bracelet',         handle: 'moonstone-bracelet',         price: '95.00',  currencyCode: 'GBP', intention: 'Clarity',       totalInventory: 1, imageUrl: '/images/back3.png' },
  { id: '4', title: 'Labradorite Drop Earrings',  handle: 'labradorite-drop-earrings',  price: '84.00',  currencyCode: 'GBP', intention: 'Protection',    totalInventory: 2, imageUrl: '/images/back4.png' },
]

export default function Bestsellers() {
  return (
    <>
      <style>{`
        .bs-section  { padding: 100px 24px; }
        .bs-heading  { font-size: 48px; }
        .bs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .bs-view-all {
          display: inline-block;
          border: 1px solid var(--color-text);
          color: var(--color-text);
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 400;
          padding: 14px 48px;
          border-radius: 0;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .bs-view-all:hover {
          background: var(--color-text);
          color: var(--color-white);
        }
        @media (max-width: 768px) {
          .bs-section { padding: 64px 24px; }
          .bs-heading  { font-size: 32px; }
          .bs-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
      `}</style>

      <section className="bs-section" style={{ background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <h2
            className="bs-heading"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, textAlign: 'center',
              color: 'var(--color-text)', margin: '0 0 8px',
            }}
          >
            Our Bestsellers
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 14, fontWeight: 300, color: 'var(--color-muted)',
              textAlign: 'center', margin: '0 0 56px',
            }}
          >
            The pieces our community loves most
          </p>

          <div className="bs-grid">
            {MOCK_PRODUCTS.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>

          <div style={{ marginTop: 52, textAlign: 'center' }}>
            <Link href="/shop" className="bs-view-all">View All Jewellery</Link>
          </div>

        </div>
      </section>
    </>
  )
}
