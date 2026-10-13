/**
 * The project archive. Everything here comes from the CVs; descriptions are
 * written rather than copied so they read as prose. Swap in real screenshots
 * via the `image` field when you have them: the current values are placeholder
 * photography, not the actual product.
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
  image: string;
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
    image: 'https://picsum.photos/seed/pomegranate-pos-terminal-counter/1200/800',
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
    image: 'https://picsum.photos/seed/pomegranate-warehouse-commerce/800/450',
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
    image: 'https://picsum.photos/seed/pomegranate-property-apartment/800/450',
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
    image: 'https://picsum.photos/seed/pomegranate-backend-server/800/450',
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
    image: 'https://picsum.photos/seed/pomegranate-booking-lobby/800/450',
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
    image: 'https://picsum.photos/seed/pomegranate-shopping-discovery/800/450',
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
    image: 'https://picsum.photos/seed/pomegranate-highland-plateau/800/450',
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
    image: 'https://picsum.photos/seed/pomegranate-institution-building/800/450',
    url: 'https://www.nesconigeria.com',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
