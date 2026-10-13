import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPost, formatDate } from '@/lib/posts';
import { Prose } from '@/components/Prose';
import { ArrowRight } from '@/components/Icons';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Not found' };
  return { title: post.title, description: post.summary };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const next = index > 0 ? posts[index - 1] : undefined;

  return (
    <article className="wrap py-14 md:py-20">
      <header className="wrap-narrow" style={{ paddingInline: 0 }}>
        <h1 className="text-[clamp(30px,4.2vw,50px)] leading-[1.1] tracking-[-0.026em]">
          {post.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="mono-meta">{formatDate(post.date).toUpperCase()}</span>
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

      <div className="wrap-narrow mt-10" style={{ paddingInline: 0 }}>
        <Prose>{post.body}</Prose>
      </div>

      {next && (
        <div className="wrap-narrow mt-16 border-t pt-8" style={{ paddingInline: 0 }}>
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
