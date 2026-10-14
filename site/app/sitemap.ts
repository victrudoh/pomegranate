import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/lib/site';

/**
 * The sitemap.
 *
 * Generated from the same post list the pages are built from, so a new markdown
 * file appears here automatically and cannot be forgotten. Each post carries its
 * real date as lastModified, which is a genuine freshness signal rather than a
 * build timestamp that changes on every deploy.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/writing`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/projects`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/cv`, changeFrequency: 'yearly', priority: 0.6 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/writing/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: 'yearly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
