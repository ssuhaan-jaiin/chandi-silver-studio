export default {
  name: 'aboutContent',
  title: 'About Page',
  type: 'document',
  fields: [
    { name: 'founderName', type: 'string' },
    { name: 'founderTitle', type: 'string' },
    { name: 'founderPhoto', type: 'image', options: { hotspot: true } },
    {
      name: 'story',
      type: 'array',
      of: [{ type: 'block' }],
      title: 'Founder story (rich text)',
    },
    {
      name: 'sourcingPhotos',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'photo', type: 'image', options: { hotspot: true } },
          { name: 'caption', type: 'string' },
          { name: 'location', type: 'string' },
          { name: 'year', type: 'string' },
        ],
      }],
    },
  ],
}
