/**
 * Single source of truth for site-level SEO facts.
 *
 * The URL lives here rather than being repeated across layout, sitemap and
 * robots. Change it in one place when you move to a custom domain, and every
 * canonical URL, sitemap entry and share preview follows.
 */
export const SITE = {
  /** No trailing slash. Used for metadataBase, canonicals and the sitemap. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://victrudoh.vercel.app',
  name: 'pomegranate',
  title: 'pomegranate · Victory Udoh writes about systems',
  description:
    'Writing about web systems, from the database down to the pixel. Notes from building fintech, property and government platforms.',
  locale: 'en_GB',
  author: {
    name: 'Victory Andrew Udoh',
    role: 'Software engineer',
    location: 'Uyo, Nigeria',
    github: 'https://github.com/victrudoh',
    linkedin: 'https://linkedin.com/in/victory-udoh-71ba6b20a',
    email: 'victrudoh@gmail.com',
  },
} as const;

/** Absolute URL for a site-relative path. Required by OG tags and canonicals. */
export function absolute(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${clean}`;
}
