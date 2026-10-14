import { getAllPosts } from '@/lib/posts';
import { SITE, absolute } from '@/lib/site';

/**
 * RSS feed at /writing/rss.xml.
 *
 * Declared as plain text rather than application/rss+xml so it renders in a
 * browser instead of downloading. Feed readers do not care.
 *
 * Why bother when the site is small: it gives feed readers and crawlers a
 * single stable document that lists every post with a real timestamp, and it is
 * the cheapest way to make the writing syndicatable. Adding a post requires no
 * change here.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = absolute(`/writing/${post.slug}`);
      const pubDate = new Date(`${post.date}T00:00:00Z`).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.summary)}</description>
      <author>${escapeXml(SITE.author.email)} (${escapeXml(SITE.author.name)})</author>
${post.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join('\n')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <link>${SITE.url}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absolute('/writing/rss.xml')}" rel="self" type="application/rss+xml"/>
    <managingEditor>${escapeXml(SITE.author.email)} (${escapeXml(SITE.author.name)})</managingEditor>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
