import Link from 'next/link';

const LINKS = [
  { href: '/writing', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: 'https://github.com/victrudoh', label: 'GitHub', external: true },
  { href: 'https://linkedin.com/in/victory-udoh-71ba6b20a', label: 'LinkedIn', external: true },
];

export function SiteFooter() {
  return (
    <footer className="border-t py-11">
      <div className="wrap flex flex-wrap items-center justify-between gap-4">
        <span className="text-[15px]">pomegranate · Victory Andrew Udoh</span>
        <nav aria-label="Footer" className="flex flex-wrap gap-5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              rel={l.external ? 'me noopener' : undefined}
              className="text-sm transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--muted)' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
