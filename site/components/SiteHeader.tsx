'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BrandMark } from './BrandMark';
import { MenuIcon, CloseIcon, SunIcon, MoonIcon } from './Icons';

const NAV = [
  { href: '/writing', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/cv', label: 'CV' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [stuck, setStuck] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') setTheme(current);
  }, []);

  // Raise the header once the page has scrolled. An IntersectionObserver
  // sentinel is used instead of a scroll listener so nothing runs per frame.
  useEffect(() => {
    const node = sentinel.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 1 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // close the mobile panel on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('pg-theme', next);
    } catch {
      /* private mode: the choice simply does not persist */
    }
  }

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-px w-px" />
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md transition-shadow"
        style={{
          background: 'color-mix(in oklab, var(--bg) 84%, transparent)',
          boxShadow: stuck ? '0 10px 30px rgb(0 0 0 / 0.22)' : 'none',
        }}
      >
      <div className="wrap flex items-center justify-between gap-6 min-h-16">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <BrandMark />
          <span className="transition-colors hover:text-[var(--accent)]">pomegranate</span>
        </Link>

        <nav
          aria-label="Sections"
          className={[
            'gap-6',
            open
              ? 'absolute left-0 right-0 top-full flex flex-col gap-1 border-b px-5 pb-4 pt-2'
              : 'hidden',
            'md:flex md:static md:flex-row md:border-0 md:p-0',
          ].join(' ')}
          style={open ? { background: 'var(--bg-deep)' } : undefined}
        >
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className="text-[14.5px] py-3 md:py-1 border-b border-transparent transition-colors md:border-b"
                style={{
                  color: active ? 'var(--fg)' : 'var(--muted)',
                  borderBottomColor: active ? 'var(--accent)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="grid h-[34px] w-[34px] place-items-center rounded-[9px] border transition-all hover:-translate-y-px hover:text-[var(--fg)] active:translate-y-0"
            style={{ color: 'var(--muted)' }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            className="grid h-[34px] w-[34px] place-items-center rounded-[9px] border transition-colors md:hidden"
            style={{ color: 'var(--muted)' }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      </header>
    </>
  );
}
