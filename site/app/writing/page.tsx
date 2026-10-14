import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { PostRow } from '@/components/PostRow';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Long-form notes on web systems: payments, Postgres, frontend state, performance and AI product constraints.',
  alternates: { canonical: '/writing' },
  openGraph: {
    type: 'website',
    url: '/writing',
    title: 'Writing',
    description:
      'Long-form notes on web systems: payments, Postgres, frontend state, performance and AI product constraints.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing',
    description:
      'Long-form notes on web systems: payments, Postgres, frontend state, performance and AI product constraints.',
  },
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <section className="wrap py-14 md:py-20">
      <header className="mb-10 grid items-end gap-4 md:mb-14 md:grid-cols-2 md:gap-8">
        <h1 className="text-[clamp(30px,4vw,48px)] leading-tight tracking-[-0.024em]">Writing</h1>
        <p
          className="max-w-[60ch] text-[clamp(17px,1.5vw,19px)] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          {posts.length} posts on the infrastructure and the interface, newest first. Everything here
          comes out of production work rather than a tutorial.
        </p>
      </header>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>
          No posts yet. Add a markdown file to content/writing and it appears here.
        </p>
      ) : (
        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
          {posts.map((p) => (
            <PostRow key={p.slug} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}
