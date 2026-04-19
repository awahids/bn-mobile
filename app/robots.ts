import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://belajar-ngaji.online';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/auth/', '/auth/callback'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
