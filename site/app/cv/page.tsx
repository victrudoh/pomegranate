import type { Metadata } from 'next';
import { CvDownloads } from '@/components/CvDownloads';
import { ContactLinks } from '@/components/ContactLinks';

export const metadata: Metadata = {
  title: 'CV',
  description:
    'Download Victory Andrew Udoh\u2019s CV: frontend focused and backend focused versions, both current for 2026.',
};

const HIGHLIGHTS = [
  ['EXPERIENCE', '5+ years across fintech, property, booking and public sector platforms'],
  ['CURRENT ROLE', 'Senior Backend Developer on Talmow at Getstac Org'],
  ['CORE STACK', 'TypeScript, React, Next.js, NestJS, PostgreSQL'],
  ['EDUCATION', 'B.Sc. Computer Science, University of Uyo; MIT in progress at MIVA'],
];

/**
 * A dedicated CV page. The home page links here and the header carries a direct
 * link, so a reader looking for the CV never has to scroll to find it. Both
 * files are static assets in public/cv, so the downloads need no JavaScript.
 */
export default function CvPage() {
  return (
    <section className="wrap py-14 md:py-20">
      <header className="grid items-end gap-4 md:grid-cols-2 md:gap-8">
        <h1 className="text-[clamp(30px,4vw,48px)] leading-tight tracking-[-0.024em]">CV</h1>
        <p
          className="max-w-[60ch] text-[clamp(17px,1.5vw,19px)] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          Two versions, because they lead with different work. The frontend one covers the interface
          and product side. The backend one leads with architecture, APIs and data. Take whichever
          matches the role.
        </p>
      </header>

      <CvDownloads />

      <div className="mt-14 grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))] md:mt-20">
        {HIGHLIGHTS.map(([label, value]) => (
          <div
            key={label}
            className="tile-lift rounded-xl border px-4 py-3.5"
            style={{ background: 'var(--surface)' }}
          >
            <span className="mono-meta block">{label}</span>
            <span className="text-[15px]">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-[clamp(22px,2.6vw,32px)] tracking-[-0.02em]">Prefer to talk first?</h2>
          <p className="mt-5 max-w-[60ch] text-[17px]" style={{ color: 'var(--muted)' }}>
            If the CV raises a question, or you want detail on something it only summarises, email
            me. I would rather answer directly than have you guess from a bullet point.
          </p>
          <a
            href="mailto:victrudoh@gmail.com"
            className="btn-lift btn-glow mt-6 inline-flex items-center rounded-full px-5 py-2.5 text-[15px] font-medium whitespace-nowrap"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            victrudoh@gmail.com
          </a>
        </div>
        <ContactLinks />
      </div>
    </section>
  );
}
