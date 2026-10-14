import type { Post } from './posts';
import { getAllPosts } from './posts';

/**
 * Tag helpers.
 *
 * Tags are derived from the posts themselves rather than maintained by hand, so
 * a new tag on a markdown file immediately produces a working page. That is the
 * point: internal linking should not depend on someone remembering to update a
 * registry.
 */

/** URL segment for a tag. `Open source` becomes `open-source`. */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function tagHref(tag: string): string {
  return `/writing/tagged/${slugifyTag(tag)}`;
}

export type TagCount = { tag: string; slug: string; count: number };

/**
 * Every tag with how many posts carry it, ordered by frequency then
 * alphabetically. Ordering by frequency keeps a one-post tag from outranking the
 * ones that actually describe the body of work.
 */
export function getAllTags(): TagCount[] {
  const counts = new Map<string, { tag: string; count: number }>();

  for (const post of getAllPosts()) {
    // a post listing the same tag twice should not count twice
    for (const tag of new Set(post.tags)) {
      const slug = slugifyTag(tag);
      const existing = counts.get(slug);
      if (existing) existing.count += 1;
      else counts.set(slug, { tag, count: 1 });
    }
  }

  return [...counts.entries()]
    .map(([slug, { tag, count }]) => ({ tag, slug, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(slug: string): Post[] {
  return getAllPosts().filter((post) => post.tags.some((t) => slugifyTag(t) === slug));
}

/** The canonical display form of a tag, given its slug. */
export function tagFromSlug(slug: string): string | undefined {
  return getAllTags().find((t) => t.slug === slug)?.tag;
}
