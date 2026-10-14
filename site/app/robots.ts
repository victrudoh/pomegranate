import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * robots.txt, generated so the sitemap URL and the canonical host can never
 * drift from lib/site.ts. A static file previously pointed at example.com,
 * which quietly told crawlers to look for a sitemap on a domain that is not
 * this one.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // nothing here is private, but keeping crawl budget off asset folders
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
