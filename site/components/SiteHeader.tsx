'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BrandMark } from './BrandMark';
import { MobileMenu } from './MobileMenu';
import { SunIcon, MoonIcon } from './Icons';

const NAV = [
  { href: '/writing', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/cv', label: 'CV' },
];

export function SiteHeader() {
  const pathname = usePathname();
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
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      threshold: 1,
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

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
        <div className="wrap flex min-h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-semibold tracking-tight"
            aria-label="pomegranate, home"
          >
            <BrandMark
              size={21}
              className="transition-transform duration-300 group-hover:-rotate-6"
            />
            <span className="transition-colors group-hover:text-[var(--accent)]">pomegranate</span>
          </Link>

          {/* desktop navigation */}
          <nav aria-label="Sections" className="hidden gap-6 md:flex">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="border-b py-1 text-[14.5px] transition-colors"
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
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
