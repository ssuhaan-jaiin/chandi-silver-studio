import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { sanityClient } from '@/lib/sanity'
import { buildMetadata, SITE_URL, SITE_NAME } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

interface BlogPost {
  _id: string
  title: string
  slug: string
  publishedAt: string
  excerpt: string
  seoDescription: string
  tags: string[]
  coverImageUrl: string
  body: unknown[]
  relatedPosts: Array<{
    _id: string
    title: string
    slug: string
    publishedAt: string
    excerpt: string
    tags: string[]
    coverImageUrl: string
  }>
}

const POST_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, "slug": slug.current,
  publishedAt, excerpt, seoDescription, tags,
  "coverImageUrl": coverImage.asset->url,
  body[]{
    ...,
    _type == "image" => {
      ...,
      "imageUrl": asset->url,
      "altText": alt
    }
  },
  "relatedPosts": *[_type == "blogPost" && slug.current != $slug && count(tags[@ in ^.tags]) > 0] | order(publishedAt desc)[0...3] {
    _id, title, "slug": slug.current,
    publishedAt, excerpt, tags,
    "coverImageUrl": coverImage.asset->url
  }
}`

const SLUGS_QUERY = `*[_type == "blogPost"] { "slug": slug.current }`

const MOCK_POSTS: Record<string, BlogPost> = {
  'rose-quartz-stone-of-love': {
    _id: '1',
    title: 'Rose Quartz: The Stone of Unconditional Love',
    slug: 'rose-quartz-stone-of-love',
    publishedAt: '2025-03-12T00:00:00Z',
    seoDescription: 'Discover the healing properties of rose quartz and how to work with this heart chakra crystal in your daily life.',
    excerpt: 'Rose quartz has been revered for centuries as the ultimate heart-healing crystal.',
    tags: ['Crystal Guide', 'Love'],
    coverImageUrl: '/images/back.png',
    body: [],
    relatedPosts: [],
  },
  'how-to-cleanse-charge-crystals': {
    _id: '2',
    title: 'How to Cleanse and Charge Your Crystals',
    slug: 'how-to-cleanse-charge-crystals',
    publishedAt: '2025-02-28T00:00:00Z',
    seoDescription: 'Learn how to cleanse and charge your crystals using moonlight, sound, sage, and intention.',
    excerpt: 'Before you wear or work with a new crystal, it\'s important to cleanse it of any energy it may have absorbed.',
    tags: ['Crystal Care', 'Ritual'],
    coverImageUrl: '/images/back2.png',
    body: [],
    relatedPosts: [],
  },
  'setting-intentions-new-moon-ritual': {
    _id: '3',
    title: 'Setting Intentions: A Morning Ritual for the New Moon',
    slug: 'setting-intentions-new-moon-ritual',
    publishedAt: '2025-02-10T00:00:00Z',
    seoDescription: 'A simple new moon ritual using crystals and journalling to set powerful intentions.',
    excerpt: 'The new moon is the perfect time to plant seeds of intention.',
    tags: ['Ritual', 'Moon'],
    coverImageUrl: '/images/back3.png',
    body: [],
    relatedPosts: [],
  },
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return iso
  }
}

async function fetchPost(slug: string): Promise<BlogPost | null> {
  try {
    const data = await sanityClient.fetch<BlogPost | null>(POST_QUERY, { slug })
    return data ?? null
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const data = await sanityClient.fetch<Array<{ slug: string }>>(SLUGS_QUERY)
    const sanityParams = (data ?? []).map(({ slug }) => ({ slug }))
    if (sanityParams.length > 0) return sanityParams
  } catch { /* fallback to mock */ }
  return Object.keys(MOCK_POSTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPost(slug) ?? MOCK_POSTS[slug] ?? null
  if (!post) return { title: `Post | ${SITE_NAME}` }
  return buildMetadata({
    title: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImageUrl || undefined,
  })
}

// ─── PortableText components ─────────────────────────────────────────────────

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ marginBottom: 24, fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 16, fontWeight: 300, lineHeight: 1.9, color: 'var(--color-text)' }}>
        {children}
      </p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 400, fontSize: 28, color: 'var(--color-text)', marginTop: 40, marginBottom: 16, lineHeight: 1.2 }}>
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 400, fontSize: 22, color: 'var(--color-text)', marginTop: 32, marginBottom: 12, lineHeight: 1.3 }}>
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote style={{ borderLeft: '2px solid var(--color-gold)', paddingLeft: 20, margin: '32px 0', fontFamily: "'Times New Roman', Times, serif", fontStyle: 'italic', fontSize: 20, color: 'var(--color-muted)', lineHeight: 1.6 }}>
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => (
      <a href={value?.href} style={{ color: 'var(--color-gold)', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}>
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: { imageUrl?: string; altText?: string; caption?: string } }) => (
      <figure style={{ margin: '40px 0' }}>
        {value.imageUrl && (
          <div style={{ width: '100%', aspectRatio: '16 / 9', position: 'relative' }}>
            <Image src={value.imageUrl} alt={value.altText ?? ''} fill sizes="700px" style={{ objectFit: 'cover' }} />
          </div>
        )}
        {value.caption && (
          <figcaption style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 12, color: 'var(--color-muted)', textAlign: 'center', marginTop: 10 }}>
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  let post = await fetchPost(slug)
  if (!post) {
    post = MOCK_POSTS[slug] ?? null
    if (!post) notFound()
  }

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.seoDescription || post.excerpt,
        image: post.coverImageUrl || undefined,
        datePublished: post.publishedAt,
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo1.png` },
        },
        url: `${SITE_URL}/blog/${post.slug}`,
        keywords: post.tags?.join(', '),
      }} />
      <style>{`
        .blog-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 32px;
        }
        @media (max-width: 700px) {
          .blog-related-grid { grid-template-columns: 1fr; }
        }
        .blog-back-link {
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          font-size: 12px; color: var(--color-muted); text-decoration: none;
          display: inline-block; margin-bottom: 40px;
          transition: color 0.2s ease;
        }
        .blog-back-link:hover { color: var(--color-gold); }
      `}</style>

      <main style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '60px 24px 0' }}>
          {/* Back link */}
          <Link href="/blog" className="blog-back-link">
            ← The Journal
          </Link>

          {/* Tags + date */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            {post.tags?.map((tag) => (
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
            <span
              style={{
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--color-muted)',
              }}
            >
              {formatDate(post.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, fontSize: 48, color: 'var(--color-text)',
              lineHeight: 1.1, marginBottom: 32,
            }}
          >
            {post.title}
          </h1>

          {/* Cover image */}
          {post.coverImageUrl && (
            <div style={{ width: '100%', aspectRatio: '16 / 9', position: 'relative', marginBottom: 48 }}>
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                sizes="700px"
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Body */}
          {post.body && post.body.length > 0 ? (
            <PortableText
              value={post.body as Parameters<typeof PortableText>[0]['value']}
              components={ptComponents as Parameters<typeof PortableText>[0]['components']}
            />
          ) : (
            <div>
              <p style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 16, fontWeight: 300, lineHeight: 1.9, color: 'var(--color-text)', marginBottom: 24 }}>
                {post.excerpt}
              </p>
              <p style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 16, fontWeight: 300, lineHeight: 1.9, color: 'var(--color-text)', marginBottom: 24 }}>
                Full article content will appear here once published in Sanity CMS.
              </p>
            </div>
          )}

          {/* Gold divider */}
          <div style={{ height: 1, background: 'var(--color-gold)', margin: '60px 0', opacity: 0.4 }} />
        </div>

        {/* Related posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <h2
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 400, fontSize: 32, color: 'var(--color-text)',
                textAlign: 'center', marginBottom: 0,
              }}
            >
              More from The Journal
            </h2>
            <div className="blog-related-grid">
              {post.relatedPosts.map((rp) => (
                <Link
                  key={rp._id}
                  href={`/blog/${rp.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div style={{ aspectRatio: '3 / 2', position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
                    <Image
                      src={rp.coverImageUrl ?? '/images/back.png'}
                      alt={rp.title}
                      fill
                      sizes="33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <p style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 400, fontSize: 18, color: 'var(--color-text)', marginBottom: 6, lineHeight: 1.3 }}>
                    {rp.title}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 12, color: 'var(--color-gold)' }}>
                    Read more →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
