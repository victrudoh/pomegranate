'use client';

import { useState } from 'react';
import {
  MailIcon,
  GithubIcon,
  LinkedinIcon,
  ArrowRight,
} from './Icons';

type Link = {
  href: string;
  label: string;
  handle: string;
  Icon: typeof MailIcon;
};

const LINKS: Link[] = [
  { href: 'https://github.com/victrudoh', label: 'GitHub', handle: '/victrudoh', Icon: GithubIcon },
  {
    href: 'https://linkedin.com/in/victory-udoh-71ba6b20a',
    label: 'LinkedIn',
    handle: '/victory-udoh',
    Icon: LinkedinIcon,
  },
  {
    href: 'mailto:victrudoh@gmail.com',
    label: 'Email',
    handle: 'victrudoh@gmail.com',
    Icon: MailIcon,
  },
];

/**
 * Contact rows. Clicking copies the address so it can be pasted anywhere, and
 * briefly confirms in place. The href still points at the real destination, so
 * keyboard users and anyone without clipboard access fall through normally.
 */
export function ContactLinks() {
  const [copied, setCopied] = useState<string | null>(null);

  async function onCopy(e: React.MouseEvent<HTMLAnchorElement>, link: Link) {
    if (!navigator.clipboard) return; // let the browser handle it
    e.preventDefault();
    const value = link.href.replace(/^mailto:/, '');
    try {
      await navigator.clipboard.writeText(value);
      setCopied(link.href);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      window.location.href = link.href;
    }
  }

  return (
    <div className="flex flex-col border-t" style={{ borderColor: 'var(--border)' }}>
      {LINKS.map(({ href, label, handle, Icon }) => {
        const isCopied = copied === href;
        return (
          <a
            key={href}
            href={href}
            rel="me noopener"
            onClick={(e) => onCopy(e, { href, label, handle, Icon })}
            aria-label={`${label}, ${handle}. Click to copy.`}
            className="contact-row group flex items-center justify-between gap-4 border-b py-4"
            style={{
              borderColor: 'var(--border)',
              color: isCopied ? 'var(--accent)' : undefined,
            }}
          >
            <span className="flex items-center gap-3 text-[15.5px]">
              <Icon className="transition-colors group-hover:text-[var(--accent)]" />
              {label}
            </span>
            <span className="flex items-center gap-2">
              <span
                className="mono-meta"
                style={isCopied ? { color: 'var(--accent)' } : undefined}
              >
                {isCopied ? 'Copied' : handle}
              </span>
              <ArrowRight
                size={14}
                className="opacity-0 transition-opacity group-hover:opacity-100"
              />
            </span>
          </a>
        );
      })}
    </div>
  );
}
