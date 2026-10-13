/**
 * The project archive. Everything here comes from the CVs; descriptions are
 * written rather than copied so they read as prose.
 *
 * Card visuals are one of two honest kinds, never a stock photo pretending to
 * be the product:
 *   - public/projects/<slug>.jpg  a real screenshot of the live site
 *   - public/projects/<slug>.png  abstract generated geometry, where no public
 *                                 site exists to capture
 * Both are 16:9 and produced by tools/build-project-art.mjs and
 * tools/process-shots.mjs.
 */
export type Project = {
  slug: string;
  name: string;
  org: string;
  period: string;
  category: 'Fintech' | 'Backend' | 'Product' | 'Public sector';
  summary: string;
  detail: string;
  stack: string[];
  /**
   * Card visual. Two honest kinds:
   *  - a real screenshot of the live site, in public/projects/<slug>.jpg
   *  - abstract generated geometry, in public/projects/<slug>.png, used only
   *    where there is no live site to show. Never a stock photo pretending
   *    to be the product.
   */
  image: string;
  /** Alt text. Describes what the image actually is, not the project. */
  imageAlt: string;
  featured?: boolean;
  /** Live site, checked and reachable. Omitted when the project is not public. */
  url?: string;
  /** Shown instead of a link when a public site is not currently reachable. */
  note?: string;
};

export const projects: Project[] = [
  {
    slug: 'pxn-wallet-pos',
    name: 'PXN Wallet and POS Platform',
    org: 'PXN Technologies',
    period: '2024 to now',
    category: 'Fintech',
    summary:
      'Administrative frontend for a wallet and point-of-sale product: merchant onboarding, wallet balances, user and transaction operations.',
    detail:
      'The hard part was never the interface. It was making pending and failed states honest enough that an operator could trust what they were looking at during a dispute, and keeping complex data-driven workflows usable for people who are not engineers.',
    stack: ['React', 'TypeScript', 'Dashboards', 'Payments'],
    image: '/projects/pxn-wallet-pos.jpg',
    imageAlt: 'Screenshot of the PXN site homepage',
    featured: true,
    url: 'https://pxnapp.com',
  },
  {
    slug: 'pxn-commerce-dashboard',
    name: 'PXN E-commerce Dashboard',
    org: 'PXN Technologies',
    period: '2024 to now',
    category: 'Product',
    summary:
      'Operational interfaces for day-to-day commerce: orders, inventory movement and merchant activity.',
    detail:
      'Built so a non-technical operator can find the thing that is stuck. The design goal was a workflow they could run without reading documentation.',
    stack: ['React', 'Tailwind CSS', 'React Query'],
    image: '/projects/pxn-commerce-dashboard.png',
    imageAlt: 'Abstract dot lattice in the brand palette',
  },
  {
    slug: 'dwelliva',
    name: 'Dwelliva',
    org: 'Dwelliva',
    period: '2025 to 2026',
    category: 'Product',
    summary:
      'Property management platform covering listings, wallets, bookings and onboarding.',
    detail:
      'Reusable components across the whole surface, so a change to a wallet card reached every screen at once. Consistency between the customer view and the admin view was the main constraint.',
    stack: ['Next.js', 'TypeScript'],
    image: '/projects/dwelliva.png',
    imageAlt: 'Abstract nested container diagram in the brand palette',
    // dwelliva-app.com currently returns HTTP 402 and the apex does not resolve,
    // so no link is shown rather than shipping a dead one. Restore it here when
    // the site is back up.
    note: 'Site currently offline',
  },
  {
    slug: 'talmow',
    name: 'Talmow',
    org: 'Getstac Org',
    period: '2026 to now',
    category: 'Backend',
    summary:
      'Backend architecture on NestJS and PostgreSQL. Scalable REST APIs, authentication and authorization, database integration and core business workflows.',
    detail:
      'Designing the data model and the accounting workflows underneath it, then working directly with product and frontend so the API contract holds up against what the interface actually needs.',
    stack: ['NestJS', 'PostgreSQL', 'Architecture'],
    image: '/projects/talmow.png',
    imageAlt: 'Abstract wireframe mesh in the brand palette',
  },
  {
    slug: 'ibookam',
    name: 'iBookam',
    org: 'iBookam',
    period: '2026',
    category: 'Backend',
    summary:
      'Booking and business management backend on NestJS and PostgreSQL.',
    detail:
      'Authentication, authorization and booking workflows, plus the unglamorous work of finding the slow endpoints and fixing them before they became complaints.',
    stack: ['NestJS', 'PostgreSQL', 'REST'],
    image: '/projects/ibookam.jpg',
    imageAlt: 'Screenshot of the iBookam site homepage',
    url: 'https://ibookam.com',
  },
  {
    slug: 'discount-hub',
    name: 'Discount Hub',
    org: 'Independent',
    period: '2025',
    category: 'Product',
    summary: 'AI-assisted product discovery.',
    detail:
      'The interesting problem was latency, not intelligence. A suggestion that arrives after the user has already decided is worse than no suggestion at all, so the whole feature was designed around a response budget.',
    stack: ['AI integration', 'Next.js'],
    image: '/projects/discount-hub.png',
    imageAlt: 'Abstract concentric sweep in the brand palette',
  },
  {
    slug: 'plateau-state',
    name: 'Plateau State Government Website',
    org: 'Public sector',
    period: '2024',
    category: 'Public sector',
    summary:
      'Public information site for a state government, built for visitors on slow connections and inexpensive devices.',
    detail:
      'Accessibility and load time were requirements rather than polish. That meant load budgets, image discipline and progressive enhancement instead of a large client bundle.',
    stack: ['Performance', 'Accessibility'],
    image: '/projects/plateau-state.jpg',
    imageAlt: 'Screenshot of the Plateau State government site homepage',
    url: 'https://www.plateaustate.gov.ng',
  },
  {
    slug: 'nesco-nigeria',
    name: 'NESCO Nigeria',
    org: 'NESCO Nigeria',
    period: '2023',
    category: 'Public sector',
    summary: 'Corporate site for an engineering and construction services company.',
    detail:
      'The work was mostly information architecture: restructuring their content so a procurement officer could find capability and contact details without running a search.',
    stack: ['Next.js', 'Content'],
    image: '/projects/nesco-nigeria.jpg',
    imageAlt: 'Screenshot of the NESCO Nigeria site homepage',
    url: 'https://www.nesconigeria.com',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
