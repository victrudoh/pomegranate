import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllTags, getPostsByTag, tagFromSlug } from '@/lib/tags';
import { PostRow } from '@/components/PostRow';
import { ArrowRight } from '@/components/Icons';

type Params = { params: Promise<{ tag: string }> };

/**
 * One page per tag, generated from the tags that actually exist on posts.
 *
 * These pages are the internal linking the site was missing: a reader who
 * finishes a Postgres post can now reach the other two, and search engines get
 * a topical clustering signal instead of eight orphaned articles.
 */
export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params;
  const label = tagFromSlug(tag);
  if (!label) return { title: 'Not found' };

  const posts = getPostsByTag(tag);
  const description = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} tagged ${label}, on web systems and how they actually behave in production.`;

  return {
    title: `Posts tagged ${label}`,
    description,
    alternates: { canonical: `/writing/tagged/${tag}` },
    openGraph: {
      type: 'website',
      url: `/writing/tagged/${tag}`,
      title: `Posts tagged ${label}`,
      description,
    },
    twitter: { card: 'summary', title: `Posts tagged ${label}`, description },
  };
}

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const label = tagFromSlug(tag);
  const posts = getPostsByTag(tag);
  if (!label || posts.length === 0) notFound();

  const allTags = getAllTags();

  return (
    <section className="wrap py-14 md:py-20">
      <nav aria-label="Breadcrumb" className="mono-meta mb-6 flex items-center gap-2">
        <Link href="/writing" className="transition-colors hover:text-[var(--accent)]">
          WRITING
        </Link>
        <span aria-hidden="true">/</span>
        <span style={{ color: 'var(--fg)' }}>{label.toUpperCase()}</span>
      </nav>

      <header className="mb-10 grid items-end gap-4 md:mb-14 md:grid-cols-2 md:gap-8">
        <h1 className="text-[clamp(30px,4vw,48px)] leading-tight tracking-[-0.024em]">
          {label}
        </h1>
        <p
          className="max-w-[60ch] text-[clamp(17px,1.5vw,19px)] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged {label}, newest first.
        </p>
      </header>

      <div className="border-t" style={{ borderColor: 'var(--border)' }}>
        {posts.map((p) => (
          <PostRow key={p.slug} post={p} />
        ))}
      </div>

      {/* Cross-links to the other tags, so a tag page is not a dead end. */}
      {allTags.length > 1 && (
        <div className="mt-12">
          <span className="mono-meta">OTHER TAGS</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {allTags
              .filter((t) => t.slug !== tag)
              .map((t) => (
                <Link
                  key={t.slug}
                  href={`/writing/tagged/${t.slug}`}
                  className="tag-link rounded-full border px-3 py-1 text-[12.5px]"
                  style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
                >
                  {t.tag}
                  <span style={{ color: 'var(--faint)' }}> {t.count}</span>
                </Link>
              ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <Link
          href="/writing"
          className="group inline-flex items-center gap-2 text-[15px] transition-colors hover:text-[var(--accent)]"
          style={{ color: 'var(--muted)' }}
        >
          All writing
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
