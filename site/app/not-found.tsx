import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="wrap py-24 md:py-32">
      <span className="mono-meta">404</span>
      <h1 className="mt-3 text-[clamp(28px,3.6vw,42px)] leading-tight tracking-[-0.024em]">
        That page is not here.
      </h1>
      <p className="mt-5 max-w-[52ch] text-[17px]" style={{ color: 'var(--muted)' }}>
        The link may be old, or the post may have moved. The writing index has everything currently
        published.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/writing"
          className="inline-flex items-center rounded-full px-5 py-2.5 text-[15px] font-medium whitespace-nowrap"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          Read the writing
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border px-5 py-2.5 text-[15px] font-medium whitespace-nowrap transition-colors hover:text-[var(--accent)]"
          style={{ borderColor: 'var(--border-btn)' }}
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
