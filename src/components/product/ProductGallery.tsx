'use client'

import { useState } from 'react'
import Image from 'next/image'
import WishlistButton from './WishlistButton'

interface GalleryImage {
  url: string
  altText: string
}

interface ProductGalleryProps {
  images: GalleryImage[]
  productId: string
}

export default function ProductGallery({ images, productId }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [opacity, setOpacity] = useState(1)

  const list = images.length > 0 ? images : [{ url: '/images/back.png', altText: '' }]

  function selectImage(idx: number) {
    if (idx === activeIdx) return
    setOpacity(0)
    setTimeout(() => {
      setActiveIdx(idx)
      setOpacity(1)
    }, 180)
  }

  return (
    <>
      <style>{`
        .gallery-container { display: flex; flex-direction: row; gap: 12px; }
        .gallery-thumbs {
          width: 72px; flex-shrink: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .gallery-thumb { width: 72px; height: 80px; }
        .gallery-main { flex: 1; position: relative; }
        .gallery-img-wrap {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .gallery-main-container:hover .gallery-img-wrap { transform: scale(1.06); }
        @media (max-width: 640px) {
          .gallery-container { flex-direction: column-reverse; gap: 10px; }
          .gallery-thumbs {
            width: 100%; flex-direction: row;
            overflow-x: auto; scrollbar-width: none;
          }
          .gallery-thumbs::-webkit-scrollbar { display: none; }
          .gallery-thumb { width: 60px !important; height: 68px !important; flex-shrink: 0; }
        }
      `}</style>

      <div className="gallery-container">
        {/* Thumbnail strip */}
        <div className="gallery-thumbs">
          {list.map((img, idx) => (
            <button
              key={idx}
              className="gallery-thumb"
              onClick={() => selectImage(idx)}
              aria-label={img.altText || `View product image ${idx + 1}`}
              aria-pressed={activeIdx === idx}
              style={{
                position: 'relative', overflow: 'hidden',
                cursor: 'pointer', borderRadius: 0, flexShrink: 0,
                border: `1px solid ${activeIdx === idx ? 'var(--color-gold)' : 'transparent'}`,
                opacity: activeIdx === idx ? 1 : 0.65,
                transition: 'opacity 0.2s ease, border-color 0.2s ease',
                background: 'none', padding: 0,
              }}
              onMouseEnter={(e) => {
                if (activeIdx !== idx) e.currentTarget.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                if (activeIdx !== idx) e.currentTarget.style.opacity = '0.65'
              }}
            >
              <Image
                src={img.url}
                alt={img.altText || `Product image ${idx + 1}`}
                fill
                sizes="72px"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="gallery-main">
          <div
            className="gallery-main-container"
            style={{
              aspectRatio: '4 / 5',
              position: 'relative',
              overflow: 'hidden',
              background: 'var(--color-blush)',
              cursor: 'zoom-in',
            }}
          >
            <div
              className="gallery-img-wrap"
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src={list[activeIdx].url}
                alt={list[activeIdx].altText || 'Product image'}
                fill
                priority={activeIdx === 0}
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  opacity: opacity,
                  transition: 'opacity 0.2s ease',
                }}
              />
            </div>

            {/* Wishlist button overlay */}
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
              <WishlistButton id={productId} variant="icon" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
