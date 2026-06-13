export default {
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    { name: 'question', type: 'string' },
    { name: 'answer', type: 'text' },
    {
      name: 'category', type: 'string',
      options: { list: ['Shipping', 'Returns', 'Products', 'Crystals', 'Orders'] },
    },
    { name: 'order', type: 'number' },
  ],
}
