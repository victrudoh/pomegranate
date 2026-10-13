import type { Metadata } from 'next';
import { projects } from '@/lib/projects';
import { ProjectCard } from '@/components/ProjectCard';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Eight platforms built or maintained across fintech, property, booking, e-commerce and public sector work.',
};

export default function ProjectsPage() {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section className="wrap py-14 md:py-20">
      <header className="mb-10 grid items-end gap-4 md:mb-14 md:grid-cols-2 md:gap-8">
        <h1 className="text-[clamp(30px,4vw,48px)] leading-tight tracking-[-0.024em]">Projects</h1>
        <p
          className="max-w-[60ch] text-[clamp(17px,1.5vw,19px)] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          {projects.length} platforms I have built or maintained, spanning fintech, property,
          booking, e-commerce and public sector work. Where a project has a live site, the card
          shows a real screenshot of it. The rest use abstract generated art.
        </p>
      </header>

      {featured.map((p) => (
        <ProjectCard key={p.slug} project={p} variant="feature" />
      ))}

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(310px,1fr))]">
        {others.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
