import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ReadingProgress } from '@/components/ReadingProgress';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'pomegranate · Victory Udoh writes about systems',
    template: '%s · pomegranate',
  },
  description:
    'Writing about web systems, from the database down to the pixel. Notes from building fintech, property and government platforms.',
  openGraph: {
    title: 'pomegranate',
    description: 'Writing about web systems, from the database down to the pixel.',
    type: 'website',
  },
  // The CVs are the strongest thing a hiring reader wants, so they are
  // discoverable from the head as well as linked in the nav.
  alternates: {
    types: {
      'application/pdf': [
        { url: '/cv/victory-udoh-cv-frontend-2026.pdf', title: 'CV, frontend focused' },
        { url: '/cv/victory-udoh-cv-backend-2026.pdf', title: 'CV, backend focused' },
      ],
    },
  },
};

/**
 * Dark is the default theme. The inline script reads the stored preference and
 * applies it before first paint, so a light-theme visitor never sees a dark
 * flash. It is intentionally tiny and failure-tolerant.
 */
const themeScript = `
try {
  var t = localStorage.getItem('pg-theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <ReadingProgress />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
