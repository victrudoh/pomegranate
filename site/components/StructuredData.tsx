import { SITE, absolute } from '@/lib/site';

/**
 * JSON-LD for the site itself.
 *
 * This is what lets a search engine understand the site as a person who writes,
 * rather than as an anonymous pile of pages. A Person entity plus a WebSite
 * entity is the standard shape for a personal publication, and it is what
 * enables a knowledge panel for the name.
 *
 * The sameAs links are the important part: they are how a search engine
 * confirms that this site, the GitHub account and the LinkedIn profile are all
 * the same human. Without them the profiles are unrelated islands.
 *
 * Rendered server-side as a plain script tag, so it is present in the HTML that
 * crawlers receive without executing anything.
 */
export function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE.url}/#person`,
        name: SITE.author.name,
        jobTitle: SITE.author.role,
        description: `${SITE.author.role} based in ${SITE.author.location}, writing about web systems and building them.`,
        url: SITE.url,
        email: `mailto:${SITE.author.email}`,
        sameAs: [SITE.author.github, SITE.author.linkedin],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Uyo',
          addressRegion: 'Akwa Ibom',
          addressCountry: 'NG',
        },
        knowsAbout: [
          'Web development',
          'Full stack engineering',
          'TypeScript',
          'React',
          'Next.js',
          'NestJS',
          'PostgreSQL',
          'API design',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: 'en-GB',
        publisher: { '@id': `${SITE.url}/#person` },
        author: { '@id': `${SITE.url}/#person` },
      },
      {
        // declares the RSS feed so readers and crawlers can find it
        '@type': 'Blog',
        '@id': `${SITE.url}/writing#blog`,
        url: absolute('/writing'),
        name: `Writing · ${SITE.name}`,
        description:
          'Long-form notes on web systems: payments, Postgres, frontend state, performance and AI product constraints.',
        inLanguage: 'en-GB',
        author: { '@id': `${SITE.url}/#person` },
        publisher: { '@id': `${SITE.url}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // The payload is built from constants in this repo, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
