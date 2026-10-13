'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BrandMark } from './BrandMark';
import { SunIcon, MoonIcon } from './Icons';

const NAV = [
  { href: '/writing', label: 'Writing', index: '01', note: 'Long-form on systems' },
  { href: '/projects', label: 'Projects', index: '02', note: 'Eight shipped platforms' },
  { href: '/about', label: 'About', index: '03', note: 'Background and timeline' },
  { href: '/cv', label: 'CV', index: '04', note: 'Frontend and backend PDFs' },
];

/**
 * The mobile menu.
 *
 * A full-screen panel rather than a dropdown, because a dropdown of four links
 * is the generic solution and it wastes the one moment where the site has the
 * whole screen. Construction notes:
 *
 *  - The trigger morphs: two rules rotate into a cross. No icon swap, so there
 *    is no flash between two different SVGs.
 *  - Items stagger in with a per-item animation-delay set from the index.
 *  - Both the scrim fade and the panel slide are transform/opacity only.
 *  - Under prefers-reduced-motion the panel appears instantly and the rules
 *    stay put; the menu is still fully usable.
 *  - Escape closes it, the body scroll is locked while open, and focus moves
 *    into the panel so keyboard users are not stranded behind it.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') setTheme(current);
  }, []);

  // close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // while open: lock body scroll, close on Escape, move focus into the panel
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);

    const first = panelRef.current?.querySelector<HTMLAnchorElement>('a');
    first?.focus();

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

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
      {/* trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="relative grid h-[38px] w-[38px] place-items-center rounded-[11px] border transition-colors md:hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="sr-only">Menu</span>
        <span aria-hidden="true" className="mm-bars" data-open={open ? '1' : '0'}>
          <span />
          <span />
        </span>
      </button>

      {/* scrim */}
      <div
        className="mm-scrim md:hidden"
        data-open={open ? '1' : '0'}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className="mm-panel md:hidden"
        data-open={open ? '1' : '0'}
        aria-hidden={!open}
        // React 19 renders inert as a real attribute. It keeps the closed panel
        // out of the tab order and away from screen readers, which aria-hidden
        // alone does not do.
        inert={!open}
      >
        <div className="mm-head">
          <span className="mono-meta">MENU</span>
          <button
            onClick={toggleTheme}
            className="mm-theme"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <MoonIcon size={15} /> : <SunIcon size={15} />}
            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </div>

        <nav aria-label="Sections">
          {NAV.map((item, i) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className="mm-item"
                data-active={active ? '1' : undefined}
                style={{ animationDelay: open ? `${80 + i * 55}ms` : '0ms' }}
              >
                <span className="mm-index">{item.index}</span>
                <span className="mm-text">
                  <span className="mm-label">{item.label}</span>
                  <span className="mm-note">{item.note}</span>
                </span>
                <span className="mm-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mm-foot">
          <a href="mailto:victrudoh@gmail.com" className="mm-cta">
            victrudoh@gmail.com
          </a>
          <div className="mm-mark">
            <BrandMark size={22} tone="tile" />
            <span className="mono-meta">pomegranate</span>
          </div>
        </div>
      </div>
    </>
  );
}
