'use client';

import { useEffect, useState } from 'react';
import { ShareIcon, LinkIcon, CheckIcon } from './Icons';

/**
 * Share controls for a post.
 *
 * Uses the native share sheet when the platform has one, which on mobile is
 * what puts the post into WhatsApp, Signal or Messages in two taps. Where there
 * is no native sheet, it falls back to a WhatsApp link, a copy-link button, and
 * X, which covers the realistic routes people actually use.
 *
 * The canonical URL is read from the page's own <link rel="canonical"> rather
 * than window.location, so a share from a URL with tracking parameters or a
 * trailing slash still sends the clean address.
 */
export function ShareRow({ title }: { title: string }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    setUrl(canonical?.href ?? window.location.href);
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  async function nativeShare() {
    try {
      await navigator.share({ title, text: title, url });
    } catch {
      /* the user dismissed the sheet, which is not an error worth reporting */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the link is still visible in the address bar */
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
      <span className="mono-meta mr-1">SHARE</span>

      {canNativeShare && (
        <button onClick={nativeShare} className="share-btn" aria-label={`Share ${title}`}>
          <ShareIcon size={15} />
          Share
        </button>
      )}

      <a
        className="share-btn"
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener"
        aria-label="Share this post on WhatsApp"
      >
        WhatsApp
      </a>

      <a
        className="share-btn"
        href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener"
        aria-label="Share this post on X"
      >
        X
      </a>

      <a
        className="share-btn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener"
        aria-label="Share this post on LinkedIn"
      >
        LinkedIn
      </a>

      <button onClick={copyLink} className="share-btn" aria-live="polite">
        {copied ? <CheckIcon size={15} /> : <LinkIcon size={15} />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  );
}
