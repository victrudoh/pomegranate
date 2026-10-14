import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { projects } from '@/lib/projects';
import { PostRow } from '@/components/PostRow';
import { ArrowRight } from '@/components/Icons';
import { ProjectCard } from '@/components/ProjectCard';
import { ContactLinks } from '@/components/ContactLinks';
import { CvDownloads } from '@/components/CvDownloads';

const STACK = [
  ['LANGUAGE', 'TypeScript, JavaScript, Python'],
  ['CLIENT', 'React, Next.js, Angular'],
  ['SERVER', 'NestJS, Express, FastAPI, Laravel'],
  ['DATA', 'PostgreSQL, MongoDB, Redis'],
  ['ACCESS', 'Prisma, TypeORM, GraphQL, REST'],
  ['STYLE', 'Tailwind CSS, component systems'],
  ['STATE', 'Redux Toolkit, React Query'],
  ['SHIP', 'Docker, Git, Postman, Firebase'],
];

export default function HomePage() {
  const posts = getAllPosts();
  const latest = posts[0];
  const rest = posts.slice(1, 6);
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="wrap grid items-center gap-8 pt-14 pb-14 md:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)] md:gap-16 md:pt-24 md:pb-24">
        <div className="rise">
          <h1 className="text-[clamp(36px,5.4vw,66px)] leading-[1.06] tracking-[-0.028em]">
            I build web systems, then write down what broke.
          </h1>
          <p
            className="mt-6 max-w-[60ch] text-[clamp(17px,1.5vw,20px)] leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Full stack engineer in Uyo, Nigeria. Five years across fintech, property, booking and
            government platforms. Notes here are the parts that were hard the first time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/writing"
              className="btn-lift btn-glow inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium whitespace-nowrap"
              style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
            >
              Read the writing
            </Link>
            {/* Scrolls to the CV section below, where both PDFs live. It does not
                download a file directly, so a reader can choose which CV fits. */}
            <a
              href="#cv"
              className="btn-lift group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[15px] font-medium whitespace-nowrap hover:text-[var(--accent)]"
              style={{ borderColor: 'var(--border-btn)' }}
            >
              Download CV
              <ArrowRight
                size={16}
                className="rotate-90 transition-transform group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </div>

        <figure className="relative m-0 overflow-hidden rounded-[18px] border md:order-none" style={{ boxShadow: 'var(--shadow)' }}>
          <Image
            src="/brand/hero.png"
            alt="Abstract wireframe mesh in the brand palette"
            width={880}
            height={1100}
            priority
            className="h-full w-full object-cover"
            style={{ filter: 'saturate(0.82) contrast(1.04)' }}
          />
          <figcaption
            className="absolute inset-x-0 bottom-0 px-4 py-4 text-[13px]"
            style={{
              background:
                'linear-gradient(to top, color-mix(in oklab, var(--bg-deep) 94%, transparent), transparent)',
            }}
          >
            <span className="mono-meta block mb-1.5">UYO · GMT+1</span>
            Currently: backend architecture for Talmow at Getstac.
          </figcaption>
        </figure>
      </section>

      {/* LATEST */}
      {latest && (
        <section className="wrap grid items-center gap-2 border-t py-5 md:grid-cols-[auto_1fr_auto] md:gap-5">
          <span className="mono-meta">LATEST</span>
          <Link
            href={`/writing/${latest.slug}`}
            className="text-[clamp(19px,2vw,23px)] font-semibold tracking-tight transition-colors hover:text-[var(--accent)]"
          >
            {latest.title}
          </Link>
          <span className="mono-meta">{latest.readingMinutes} min read</span>
        </section>
      )}

      {/* WRITING */}
      <section className="border-t py-16 md:py-24">
        <div className="wrap">
          <div className="mb-10 grid items-end gap-4 md:mb-14 md:grid-cols-2 md:gap-8">
            <h2 className="text-[clamp(26px,3.3vw,40px)] leading-tight tracking-[-0.022em]">
              Writing
            </h2>
            <p
              className="max-w-[60ch] text-[clamp(17px,1.5vw,20px)] leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              Long-form on the infrastructure and the interface. No tutorials you could get from the
              docs. {posts.length} posts so far.
            </p>
          </div>

          <div className="border-t" style={{ borderColor: 'var(--border)' }}>
            {rest.map((p) => (
              <PostRow key={p.slug} post={p} />
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/writing"
              className="group inline-flex items-center gap-2 text-[15px] transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--muted)' }}
            >
              All {posts.length} posts
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="border-t py-16 md:py-24">
        <div className="wrap">
          <div className="mb-10 grid items-end gap-4 md:mb-14 md:grid-cols-2 md:gap-8">
            <h2 className="text-[clamp(26px,3.3vw,40px)] leading-tight tracking-[-0.022em]">
              What I reach for
            </h2>
            <p
              className="max-w-[60ch] text-[clamp(17px,1.5vw,20px)] leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              The daily tools. Not a wish list, the ones currently in production code I maintain.
            </p>
          </div>
          <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
            {STACK.map(([label, value]) => (
              <div
                key={label}
                className="tile-lift flex flex-col gap-1 rounded-xl border px-4 py-3.5"
                style={{ background: 'var(--surface)' }}
              >
                <span
                  className="text-[11px]"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                >
                  {label}
                </span>
                <span className="text-[14.5px]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="border-t py-16 md:py-24">
        <div className="wrap">
          <div className="mb-10 grid items-end gap-4 md:mb-14 md:grid-cols-2 md:gap-8">
            <h2 className="text-[clamp(26px,3.3vw,40px)] leading-tight tracking-[-0.022em]">
              Selected work
            </h2>
            <p
              className="max-w-[60ch] text-[clamp(17px,1.5vw,20px)] leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              {projects.length} platforms I have built or maintained, most of them still running and
              taking money.
            </p>
          </div>

          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} variant="feature" />
          ))}

          <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(310px,1fr))]">
            {others.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-[15px] transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--muted)' }}
            >
              All {projects.length} projects
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CV. The hero button targets this id, and the header's anchor offset
          rule in globals.css keeps the heading clear of the sticky nav. */}
      <section id="cv" className="border-t py-16 md:py-24">
        <div className="wrap">
          <div className="mb-10 grid items-end gap-4 md:mb-14 md:grid-cols-2 md:gap-8">
            <h2 className="text-[clamp(26px,3.3vw,40px)] leading-tight tracking-[-0.022em]">CV</h2>
            <p
              className="max-w-[60ch] text-[clamp(17px,1.5vw,20px)] leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              Two versions, because they lead with different work. The frontend one covers the
              interface and product side; the backend one leads with architecture, APIs and data.
            </p>
          </div>
          <CvDownloads />
        </div>
      </section>

      {/* CONTACT */}
      <section className="border-t py-16 md:py-24">
        <div className="wrap grid gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-[clamp(26px,3.3vw,40px)] leading-tight tracking-[-0.022em]">
              Get in touch
            </h2>
            <p
              className="mt-5 max-w-[60ch] text-[clamp(17px,1.5vw,20px)] leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              I am open to conversations about backend and full stack work, and I answer email
              properly. If you found an error in something I wrote, tell me and I will correct it.
            </p>
            <a
                href="mailto:victrudoh@gmail.com"
              className="btn-lift btn-glow mt-7 inline-flex items-center rounded-full px-5 py-2.5 text-[15px] font-medium whitespace-nowrap"
              style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
            >
              victrudoh@gmail.com
            </a>
          </div>
          <ContactLinks />
        </div>
      </section>
    </>
  );
}
