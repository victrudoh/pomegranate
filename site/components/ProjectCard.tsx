import Image from 'next/image';
import type { Project } from '@/lib/projects';
import { ExternalLinkIcon } from './Icons';
import { SpotlightCard } from './SpotlightCard';

/**
 * The live-site line on a project. Rendered as a real link when one exists, and
 * as a plain note when the site is not reachable, so the page never ships a
 * dead link or implies a project is deployed when it is not.
 */
function ProjectLink({ project }: { project: Project }) {
  if (project.url) {
    const host = project.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener"
        className="project-link"
        aria-label={`${project.name}, opens ${host} in a new tab`}
      >
        Live at {host}
        <ExternalLinkIcon size={13} />
      </a>
    );
  }
  if (project.note) {
    return <span className="project-link">{project.note}</span>;
  }
  return null;
}

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
      <SpotlightCard className="mb-5 overflow-hidden rounded-[16px] border">
        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
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
            <span className="mt-3 block">
              <ProjectLink project={project} />
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
        </div>
      </SpotlightCard>
    );
  }

  return (
    <SpotlightCard className="group h-full overflow-hidden rounded-[16px] border transition-transform hover:-translate-y-0.5">
      <div className="flex h-full flex-col">
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
          <ProjectLink project={project} />
        </div>
      </div>
    </SpotlightCard>
  );
}
