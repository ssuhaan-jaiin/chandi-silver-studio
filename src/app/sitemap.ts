import { MetadataRoute } from 'next'
import { shopifyClient } from '@/lib/shopify'
import { sanityClient } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chandisilverstudio.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                         priority: 1.0, changeFrequency: 'weekly'  },
    { url: `${baseUrl}/shop`,               priority: 0.9, changeFrequency: 'daily'   },
    { url: `${baseUrl}/meditations`,        priority: 0.7, changeFrequency: 'weekly'  },
    { url: `${baseUrl}/about`,              priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/blog`,               priority: 0.7, changeFrequency: 'weekly'  },
    { url: `${baseUrl}/readings`,           priority: 0.5, changeFrequency: 'monthly' },
    { url: `${baseUrl}/contact`,            priority: 0.5, changeFrequency: 'monthly' },
  ]

  let productUrls: MetadataRoute.Sitemap = []
  try {
    const { data } = await shopifyClient.request(`
      query { products(first: 250) {
        edges { node { handle updatedAt } }
      }}
    `) as { data: { products: { edges: Array<{ node: { handle: string; updatedAt: string } }> } } }
    productUrls = (data?.products?.edges ?? []).map(({ node }) => ({
      url: `${baseUrl}/shop/${node.handle}`,
      lastModified: new Date(node.updatedAt),
      priority: 0.8,
      changeFrequency: 'daily' as const,
    }))
  } catch { /* Shopify unavailable — skip */ }

  let blogUrls: MetadataRoute.Sitemap = []
  try {
    const posts = await sanityClient.fetch<Array<{ slug: string; _updatedAt: string }>>(
      `*[_type == "blogPost"] { "slug": slug.current, _updatedAt }`
    )
    blogUrls = (posts ?? []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    }))
  } catch { /* Sanity unavailable — skip */ }

  return [...staticPages, ...productUrls, ...blogUrls]
}
