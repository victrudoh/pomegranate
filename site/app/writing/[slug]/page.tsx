import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts, getPost, formatDate } from '@/lib/posts';
import { Prose } from '@/components/Prose';
import { ShareRow } from '@/components/ShareRow';
import { ArrowRight } from '@/components/Icons';
import { SITE, absolute } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Not found' };

  const url = absolute(`/writing/${post.slug}`);

  /**
   * Share preview image.
   *
   * Falls back to the site card when a post has no hero, so a shared link
   * always shows something. Every URL here has to be absolute: WhatsApp, Slack
   * and X do not resolve relative ones, and they fail silently by showing no
   * image at all.
   */
  const image = post.hero
    ? {
        url: absolute(post.hero),
        width: 1600,
        height: 800,
        alt: post.heroAlt ?? post.title,
      }
    : {
        url: absolute('/brand/og.png'),
        width: 1200,
        height: 630,
        alt: 'pomegranate, technical writing by Victory Andrew Udoh',
      };

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    alternates: { canonical: `/writing/${post.slug}` },
    authors: [{ name: SITE.author.name, url: SITE.author.github }],
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.summary,
      siteName: SITE.name,
      locale: SITE.locale,
      publishedTime: new Date(`${post.date}T00:00:00Z`).toISOString(),
      authors: [SITE.author.name],
      tags: post.tags,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [image.url],
    },
  };
}

/**
 * Per-post structured data: a BlogPosting with a real author entity and the
 * hero as its image. This is what earns an article rich result rather than a
 * plain blue link.
 */
function PostStructuredData({ slug, title, summary, date, tags, hero }: {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  hero?: string;
}) {
  const url = absolute(`/writing/${slug}`);
  const graph = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: title,
    description: summary,
    datePublished: new Date(`${date}T00:00:00Z`).toISOString(),
    dateModified: new Date(`${date}T00:00:00Z`).toISOString(),
    url,
    keywords: tags.join(', '),
    inLanguage: 'en-GB',
    image: hero ? [absolute(hero)] : [absolute('/brand/og.png')],
    author: {
      '@type': 'Person',
      '@id': `${SITE.url}/#person`,
      name: SITE.author.name,
      url: SITE.author.github,
    },
    publisher: { '@id': `${SITE.url}/#person` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const next = index > 0 ? posts[index - 1] : undefined;

  return (
    <article className="pb-14 pt-12 md:pb-20 md:pt-16">
      <PostStructuredData
        slug={post.slug}
        title={post.title}
        summary={post.summary}
        date={post.date}
        tags={post.tags}
        hero={post.hero}
      />

      {/* Title block. Narrow measure so the headline is readable, not a wall. */}
      <header className="wrap-narrow">
        <h1 className="text-[clamp(30px,4.2vw,50px)] leading-[1.1] tracking-[-0.026em]">
          {post.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <time className="mono-meta" dateTime={post.date}>
            {formatDate(post.date).toUpperCase()}
          </time>
          <span className="mono-meta">{post.readingMinutes} MIN READ</span>
          <span className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2.5 py-0.5 text-[11.5px]"
                style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
              >
                {t}
              </span>
            ))}
          </span>
        </div>
      </header>

      {/* Hero. Sits in the wide .wrap container rather than the text column, so
          it reads as a banner. The figure must NOT override its own margin:
          .wrap centres itself with margin-inline: auto, and an inline margin:0
          silently cancels that, which left the image pinned 130px off-centre at
          the left edge. Use the dedicated class instead. */}
      {post.hero && (
        <figure className="post-hero wrap">
          <Image
            src={post.hero}
            alt={post.heroAlt ?? ''}
            width={1600}
            height={800}
            priority
            className="w-full rounded-[16px] border object-cover"
            style={{ borderColor: 'var(--border)' }}
          />
          {post.heroCaption && (
            <figcaption className="post-hero-caption mono-meta">{post.heroCaption}</figcaption>
          )}
        </figure>
      )}

      <div className="wrap-narrow mt-10">
        <Prose>{post.body}</Prose>
        <ShareRow title={post.title} />
      </div>

      {next && (
        <div className="wrap-narrow mt-16 border-t pt-8">
          <span className="mono-meta">NEXT</span>
          <Link
            href={`/writing/${next.slug}`}
            className="group mt-2 flex items-center justify-between gap-4 text-[clamp(19px,2vw,23px)] font-semibold tracking-tight transition-colors hover:text-[var(--accent)]"
          >
            {next.title}
            <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </article>
  );
}
