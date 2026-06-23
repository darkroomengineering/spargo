import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://spargo.darkroom.engineering',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
