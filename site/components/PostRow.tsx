import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { formatDate } from '@/lib/posts';

/**
 * The writing index row. Editorial rather than boxed: border on top, never
 * around, so a list of twenty still reads as a publication and not a card wall.
 */
export function PostRow({ post }: { post: Post }) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="post-row group grid gap-3 border-b py-6 transition-colors md:grid-cols-[132px_minmax(0,1fr)_190px] md:gap-7"
      style={{ borderColor: 'var(--border)' }}
    >
      <span className="mono-meta md:whitespace-pre-line">
        {formatDate(post.date)}
        {'\n'}
        {post.readingMinutes} min
      </span>

      <div>
        <h3
          className="post-title text-[clamp(19px,2vw,23px)] leading-snug font-semibold tracking-tight group-hover:text-[var(--accent)]"
          style={{ marginBottom: 7 }}
        >
          {post.title}
        </h3>
        <p className="text-[15.5px] max-w-[62ch]" style={{ color: 'var(--muted)' }}>
          {post.summary}
        </p>
      </div>

      <span className="flex flex-wrap items-start gap-2 md:flex-col md:items-end">
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
    </Link>
  );
}
