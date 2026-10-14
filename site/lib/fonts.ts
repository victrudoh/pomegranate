import localFont from 'next/font/local';

/**
 * Satoshi, self-hosted.
 *
 * These are real font files served from this deployment, not a CDN link. Two
 * reasons that matters:
 *
 *  1. No third-party request on first paint. A font hosted elsewhere costs a DNS
 *     lookup, a TLS handshake and a blocking request before text can render.
 *  2. `next/font` generates a preload tag and a size-adjusted fallback metric, so
 *     there is no layout shift when the real font swaps in.
 *
 * Satoshi is free for personal use from Fontshare (Indian Type Foundry). The
 * licence permits self-hosting for a personal site. If this ever becomes
 * commercial, either buy the licence or switch to an SIL Open Font License face
 * (Geist and Outfit are both OFL and available through next/font/google).
 *
 * The fallback chain is deliberately long: if these files ever fail to load, the
 * site falls back to a metric-similar sans rather than to a serif.
 */
export const satoshi = localFont({
  // resolved relative to THIS file, so ../app/fonts is correct from lib/
  src: [
    { path: '../app/fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../app/fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../app/fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans-loaded',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
  // Satoshi has no local equivalent, so skip the local() lookup entirely.
  preload: true,
});
