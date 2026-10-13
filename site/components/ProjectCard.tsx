import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { ArrowRight } from './Icons';

/**
 * One project, two shapes: a wide leading card for the featured project and a
 * standard grid card for the rest. Both link to /projects for now; point the
 * href at a case study once you write one.
 */
export function ProjectCard({
  project,
  variant = 'grid',
}: {
  project: Project;
  variant?: 'grid' | 'feature';
}) {
  const meta = `${project.category.toUpperCase()} · ${project.org.toUpperCase()} · ${project.period.toUpperCase()}`;

  if (variant === 'feature') {
    return (
      <Link
        href="/projects"
        className="group mb-5 grid overflow-hidden rounded-[16px] border md:grid-cols-[1.05fr_0.95fr]"
        style={{ background: 'var(--surface)' }}
      >
        <div className="p-6 md:p-9">
          <span className="mono-meta">{meta}</span>
          <h3 className="mt-2.5 text-[clamp(19px,2vw,23px)] font-semibold tracking-tight">
            {project.name}
          </h3>
          <p className="mt-3 max-w-[46ch] text-[15.5px]" style={{ color: 'var(--muted)' }}>
            {project.detail}
          </p>
          <span className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border px-2.5 py-0.5 text-[11.5px]"
                style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
              >
                {s}
              </span>
            ))}
          </span>
        </div>
        <div
          className="relative border-t md:border-t-0 md:border-l"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
        >
          <Image
            src={project.image}
            alt={`${project.name} context photograph`}
            width={1200}
            height={800}
            className="h-full min-h-[250px] w-full object-cover"
            style={{ filter: 'saturate(0.8) contrast(1.03)' }}
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/projects"
      className="group flex flex-col overflow-hidden rounded-[16px] border transition-transform hover:-translate-y-0.5"
      style={{ background: 'var(--surface)' }}
    >
      <div
        className="relative aspect-video overflow-hidden border-b"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
      >
        <Image
          src={project.image}
          alt={`${project.name} context photograph`}
          width={800}
          height={450}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          style={{ filter: 'saturate(0.8) contrast(1.03)' }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <span className="mono-meta">{meta}</span>
        <h3 className="text-[19px] font-semibold tracking-tight">{project.name}</h3>
        <p className="flex-1 text-[15px]" style={{ color: 'var(--muted)' }}>
          {project.summary}
        </p>
        <span className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border px-2.5 py-0.5 text-[11.5px]"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
            >
              {s}
            </span>
          ))}
        </span>
      </div>
    </Link>
  );
}
