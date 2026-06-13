export default {
  name: 'meditationTrack',
  title: 'Meditation Track',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    {
      name: 'intention', type: 'string', title: 'Intention',
      options: { list: ['Love', 'Anxiety', 'Protection', 'Grounding', 'Sleep', 'Clarity', 'Abundance'] },
    },
    { name: 'description', type: 'text', title: 'Description' },
    { name: 'videoUrl', type: 'url', title: 'Video URL (YouTube or direct)' },
    { name: 'previewClip', type: 'url', title: 'Preview clip URL (30s teaser)' },
    { name: 'duration', type: 'string', title: 'Duration (e.g. 12 min)' },
    { name: 'isPremium', type: 'boolean', title: 'Premium content?', initialValue: false },
    { name: 'coverImage', type: 'image', title: 'Cover image', options: { hotspot: true } },
  ],
}
