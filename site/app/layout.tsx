import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ReadingProgress } from '@/components/ReadingProgress';
import { StructuredData } from '@/components/StructuredData';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  // Every relative URL in metadata resolves against this, which is what makes
  // share previews work: WhatsApp, Slack and X all require absolute image URLs
  // and silently show no preview when given a relative one.
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: '%s · pomegranate',
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author.name, url: SITE.author.github }],
  creator: SITE.author.name,
  publisher: SITE.author.name,
  keywords: [
    'Victory Udoh',
    'software engineer',
    'technical writing',
    'full stack developer',
    'NestJS',
    'PostgreSQL',
    'React',
    'TypeScript',
    'Nigeria',
  ],
  // A canonical on every page. Without this, / and /index can be indexed as
  // two separate pages and split whatever ranking the site earns.
  alternates: {
    canonical: '/',
    types: {
      // The CVs are the strongest thing a hiring reader wants, so they are
      // declared as alternates as well as linked in the nav.
      'application/pdf': [
        { url: '/cv/victory-udoh-cv-frontend-2026.pdf', title: 'CV, frontend focused' },
        { url: '/cv/victory-udoh-cv-backend-2026.pdf', title: 'CV, backend focused' },
      ],
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: '/',
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: '/brand/og.png',
        width: 1200,
        height: 630,
        alt: 'pomegranate, technical writing by Victory Andrew Udoh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: ['/brand/og.png'],
  },
  // Icons are file-based conventions: app/icon.svg, app/icon.png,
  // app/apple-icon.png and app/favicon.ico are picked up automatically. This
  // entry only pins the order, so browsers get the crisp SVG first.
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // let Google use the full-size image and show a larger text snippet
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

/**
 * Light is the default theme. The inline script only overrides it when the
 * visitor has explicitly chosen dark before, so a first-time reader gets light
 * and a returning dark-mode reader gets dark with no flash of the wrong theme.
 */
const themeScript = `
try {
  var t = localStorage.getItem('pg-theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Feed discovery. Browsers and readers look for this to offer a
            subscribe option when someone lands on the site. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="pomegranate · writing"
          href="/writing/rss.xml"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <StructuredData />
        <ReadingProgress />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* Portal target for the mobile menu.

            The menu renders into this node instead of inside the header. The
            header uses backdrop-filter, and a filtered element becomes the
            containing block for its fixed-position descendants. That made the
            menu's `inset: 0` resolve against the 64px header box rather than
            the viewport, so the scrim covered almost nothing and the page
            underneath stayed clickable. Rendering at body level removes the
            containing block entirely. */}
        <div id="overlay-root" />
      </body>
    </html>
  );
}
