import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactLinks } from '@/components/ContactLinks';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Victory Andrew Udoh, software engineer in Uyo, Nigeria. Five years across fintech, property, booking and public sector platforms.',
};

const TIMELINE = [
  {
    period: 'APR 2026 TO NOW',
    role: 'Senior Backend Developer, Talmow',
    org: 'Getstac Org',
    detail:
      'Backend architecture on NestJS and PostgreSQL. APIs, authentication, database integration and core business workflows, working directly with product and frontend.',
  },
  {
    period: 'JUN 2025 TO APR 2026',
    role: 'Backend Developer',
    org: 'Getstac Org',
    detail:
      'REST APIs and services on NestJS, including authentication, authorization and business logic delivered to production.',
  },
  {
    period: 'NOV 2022 TO NOW',
    role: 'Senior Frontend and Full Stack Developer',
    org: 'Global Impact IT Solutions and Consults',
    detail:
      'Lead implementation of enterprise platforms spanning fintech, booking, e-commerce, property management and administrative systems. Refactoring legacy applications for performance and maintainability.',
  },
  {
    period: 'JUN 2024 TO NOW',
    role: 'Frontend Developer',
    org: 'PXN Technologies',
    detail:
      'Frontend for the PXN e-commerce dashboard, wallet and POS management interfaces, plus administrative dashboards for merchant, user and transaction operations.',
  },
  {
    period: 'JAN 2026 TO APR 2026',
    role: 'Backend Developer',
    org: 'iBookam',
    detail:
      'Backend services and REST APIs on NestJS and PostgreSQL for booking and business management, with a focus on API performance and database operations.',
  },
  {
    period: 'DEC 2025 TO MAY 2026',
    role: 'Frontend Developer',
    org: 'Dwelliva',
    detail:
      'Responsive property management interfaces on Next.js and TypeScript, integrating APIs for listings, wallets, bookings and onboarding.',
  },
];

const FACTS = [
  ['BASED IN', 'Uyo, Akwa Ibom, Nigeria'],
  ['EXPERIENCE', '5+ years, fintech to public sector'],
  ['STUDYING', 'MIT, MIVA Open University'],
  ['DEGREE', 'B.Sc. Computer Science, University of Uyo'],
];

export default function AboutPage() {
  return (
    <section className="wrap py-14 md:py-20">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-16">
        <div>
          <h1 className="text-[clamp(30px,4vw,48px)] leading-tight tracking-[-0.024em]">About</h1>
          <div
            className="mt-6 space-y-4 text-[17.5px] leading-[1.72]"
            style={{ color: 'color-mix(in oklab, var(--fg) 84%, var(--muted))' }}
          >
            <p>
              I am Victory Andrew Udoh, a software engineer in Uyo, Nigeria. I have spent five years
              building web applications that people depend on for money, housing and government
              services, which is a good way to develop opinions about what actually holds up.
            </p>
            <p>
              I work across both ends. Most of my career has been frontend and full stack work, and
              I currently lead backend architecture on Talmow at Getstac, designing APIs and the data
              model underneath them. Working both sides means I stop being able to blame the other
              team.
            </p>
            <p>
              I write here to keep my own thinking honest. When I claim a pattern is better, I would
              rather have published the argument than have it live only in a pull request
              description.
            </p>
          </div>

          <div className="mt-7 grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
            {FACTS.map(([label, value]) => (
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
        </div>

        <figure className="m-0 overflow-hidden rounded-[16px] border">
          <Image
            src="/brand/portrait.png"
            alt="Abstract dot lattice in the brand palette"
            width={760}
            height={950}
            className="h-full w-full object-cover"
            style={{ filter: 'saturate(0.72) contrast(1.05)' }}
          />
        </figure>
      </div>

      <div className="mt-14 md:mt-20">
        <h2 className="text-[clamp(22px,2.6vw,32px)] tracking-[-0.02em]">Experience</h2>
        <div className="mt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          {TIMELINE.map((t) => (
            <div
              key={t.period + t.role}
              className="grid gap-1.5 border-b py-5 md:grid-cols-[170px_minmax(0,1fr)] md:gap-6"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="mono-meta">{t.period}</span>
              <div>
                <h3 className="text-[clamp(18px,1.9vw,21px)] font-semibold tracking-tight">
                  {t.role}
                </h3>
                <span className="mono-meta">{t.org.toUpperCase()}</span>
                <p className="mt-1.5 max-w-[58ch] text-[15px]" style={{ color: 'var(--muted)' }}>
                  {t.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-[clamp(22px,2.6vw,32px)] tracking-[-0.02em]">Get in touch</h2>
          <p className="mt-5 max-w-[60ch] text-[17.5px]" style={{ color: 'var(--muted)' }}>
            I am open to conversations about backend and full stack work, and I answer email
            properly. If you found an error in something I wrote, tell me and I will correct it.
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
