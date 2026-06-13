export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'excerpt', type: 'text', description: 'Short summary, max 200 chars' },
    { name: 'coverImage', type: 'image', options: { hotspot: true } },
    { name: 'tags', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    },
    { name: 'seoDescription', type: 'text' },
  ],
}
