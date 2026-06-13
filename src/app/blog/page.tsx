import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityClient } from '@/lib/sanity'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 1800

export const metadata: Metadata = buildMetadata({
  title: 'The Journal',
  description:
    'Crystal wisdom, intention-setting rituals, and gemstone guides from Chandi Silver Studio. Explore the stories behind the stones.',
})

interface BlogPost {
  _id: string
  title: string
  slug: string
  publishedAt: string
  excerpt: string
  tags: string[]
  coverImageUrl: string
}

const BLOG_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id, title, "slug": slug.current,
  publishedAt, excerpt, tags,
  "coverImageUrl": coverImage.asset->url
}`

const MOCK_POSTS: BlogPost[] = [
  {
    _id: '1',
    title: 'Rose Quartz: The Stone of Unconditional Love',
    slug: 'rose-quartz-stone-of-love',
    publishedAt: '2025-03-12T00:00:00Z',
    excerpt: 'Rose quartz has been revered for centuries as the ultimate heart-healing crystal. Discover how to work with its gentle energy in your daily life and why it belongs in every collection.',
    tags: ['Crystal Guide', 'Love'],
    coverImageUrl: '/images/back.png',
  },
  {
    _id: '2',
    title: 'How to Cleanse and Charge Your Crystals',
    slug: 'how-to-cleanse-charge-crystals',
    publishedAt: '2025-02-28T00:00:00Z',
    excerpt: 'Before you wear or work with a new crystal, it\'s important to cleanse it of any energy it may have absorbed on its journey to you. Here are our favourite methods.',
    tags: ['Crystal Care', 'Ritual'],
    coverImageUrl: '/images/back2.png',
  },
  {
    _id: '3',
    title: 'Setting Intentions: A Morning Ritual for the New Moon',
    slug: 'setting-intentions-new-moon-ritual',
    publishedAt: '2025-02-10T00:00:00Z',
    excerpt: 'The new moon is the perfect time to plant seeds of intention. This simple ritual using crystals and journalling will help you align with the lunar cycle and manifest with clarity.',
    tags: ['Ritual', 'Moon'],
    coverImageUrl: '/images/back3.png',
  },
]

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch {
    return iso
  }
}

async function fetchPosts(): Promise<BlogPost[]> {
  try {
    const data = await sanityClient.fetch<BlogPost[]>(BLOG_QUERY)
    return data && data.length > 0 ? data : MOCK_POSTS
  } catch {
    return MOCK_POSTS
  }
}

export default async function BlogPage() {
  const posts = await fetchPosts()

  return (
    <>
      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .blog-card-img { transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .blog-card:hover .blog-card-img { transform: scale(1.04); }
        .blog-card-title { transition: color 0.2s ease; }
        .blog-card:hover .blog-card-title { color: var(--color-gold) !important; }
        @media (max-width: 900px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) { .blog-grid { grid-template-columns: 1fr; } }
      `}</style>

      <main style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 0' }}>
          <h1
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, fontSize: 48, color: 'var(--color-text)',
              textAlign: 'center', marginBottom: 56,
            }}
          >
            The Journal
          </h1>

          <div className="blog-grid">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="blog-card"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                {/* Cover image */}
                <div style={{ aspectRatio: '3 / 2', position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
                  <div className="blog-card-img" style={{ position: 'absolute', inset: 0 }}>
                    <Image
                      src={post.coverImageUrl ?? '/images/back.png'}
                      alt={post.title}
                      fill
                      sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: 'var(--color-lavender)', color: 'var(--color-text)',
                          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                          fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em',
                          padding: '3px 10px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date */}
                <p
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: 'var(--color-muted)', marginBottom: 8,
                  }}
                >
                  {formatDate(post.publishedAt)}
                </p>

                {/* Title */}
                <p
                  className="blog-card-title"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontWeight: 400, fontSize: 22, color: 'var(--color-text)',
                    lineHeight: 1.3, marginBottom: 8,
                  }}
                >
                  {post.title}
                </p>

                {/* Excerpt */}
                <p
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 13, fontWeight: 300, color: 'var(--color-muted)',
                    lineHeight: 1.65, marginBottom: 14,
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  } as React.CSSProperties}
                >
                  {post.excerpt}
                </p>

                {/* Read more */}
                <span
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 12, color: 'var(--color-gold)',
                  }}
                >
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
