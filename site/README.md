# pomegranate

A personal site for technical writing and a project archive. Built for Victory Andrew Udoh.

The site is deliberately in two parts, and they serve different purposes.

- **`prototypes/V1 pomegranate.html`** — the design source of truth. One self-contained HTML file, no build, no install. Open it in a browser to see every page of the site. This is where the visual direction is decided.
- **`site/`** — the deployable Next.js app. Real routing, real static generation, markdown posts.

When the design changes, change the prototype first, then port it. The prototype is a single file, so it is cheap to edit and impossible to break the build with.

## Name

`pomegranate` collides with an existing Python probabilistic-modelling library (`jmschrei/pomegranate`) and an npm package of the same name, so a technical reader already has a meaning for the bare word. The site therefore always pairs the wordmark with your name in the footer and page titles. If you want the term to be unambiguously yours before buying a domain, `granatum` and `locule` carry the same metaphor with less baggage. Nothing in the code hardcodes the name beyond the wordmark, the footer and the metadata, so renaming is a small change.

## Running the site

```bash
cd site
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Type-check on its own:

```bash
npm run typecheck
```

## Publishing a post

Create a markdown file in `site/content/writing/`. The filename becomes the URL, so `postgres-indexes.md` is served at `/writing/postgres-indexes`.

```markdown
---
title: Your title here
date: 2026-11-04
summary: One sentence shown in the index and in search results.
tags: [Postgres, Performance]
---

Body in markdown. Code fences, tables, blockquotes and headings all render.
```

All four frontmatter fields are required. If one is missing or empty the build fails with the filename and the field name, rather than publishing a broken page. Reading time is calculated from the actual word count, not typed by hand.

No registry or index file needs updating. Adding the file is the whole workflow.

## Design system

The theme lives in one place: the `@theme` block and the two `[data-theme]` blocks in `site/app/globals.css`. Every colour resolves to a token, so retheming is a single-file change.

**Light is the default.** A first-time reader gets light mode; an inline script applies a stored preference before first paint only if the reader has explicitly chosen dark, so a returning dark-mode reader never sees a flash of the wrong theme.

| Token group | Purpose |
| --- | --- |
| `--bg`, `--bg-deep`, `--surface`, `--surface-2` | Layered backgrounds, darkest at the page level |
| `--fg`, `--fg-strong`, `--muted`, `--faint` | Text ramp from primary to metadata |
| `--border`, `--border-strong`, `--border-btn` | Hairlines, emphasis borders, button outlines |
| `--accent`, `--on-accent` | The single accent, and text that sits on it |

Deliberate constraints, all of them enforced in the code:

- **One accent colour for the whole site.** Aril crimson (`#d94f5c` in dark, `#a8253a` in light). Nothing else is coloured.
- **Light is the default**, dark is a supported alternative. The toggle persists to `localStorage`.
- **One icon family at one stroke width** (1.6). Paths are inlined from Lucide; new icons should be too, rather than drawn by hand.
- **No em-dashes or en-dashes** in any rendered copy. Periods, commas and colons instead.
- **Motion is gated.** The entrance animation is a CSS `@keyframes` that runs on load, so the first frame is readable even with scripts blocked, and it is fully disabled under `prefers-reduced-motion`.

### Contrast

All text was checked against its own background in both themes. Body and metadata text pass WCAG AA (4.5:1) throughout; the lowest measured values are the mono metadata at 4.60:1 in light and 4.80:1 in dark. Buttons, borders and focus rings were checked against WCAG 2.2 non-text requirements.

## Project structure

```
site/
├── app/
│   ├── layout.tsx              shell, metadata, theme script
│   ├── page.tsx                home
│   ├── globals.css             the entire design system
│   ├── writing/page.tsx        post index
│   ├── writing/[slug]/page.tsx single post, statically generated
│   ├── projects/page.tsx       project archive
│   ├── about/page.tsx          bio, experience, contact
│   └── not-found.tsx           404
├── components/                 header, footer, icons, cards, prose renderer
├── content/writing/            markdown posts
├── public/cv/                  the two CV PDFs
└── lib/
    ├── posts.ts                reads and validates markdown
    └── projects.ts             the project archive as data
```

## The CV

Both PDFs live in `site/public/cv/` and are served as static files, so the downloads work with JavaScript disabled:

- `victory-udoh-cv-frontend-2026.pdf`
- `victory-udoh-cv-backend-2026.pdf`

They are reachable three ways: a `Download CV` button in the hero, a `CV` item in the main navigation, and a full `/cv` page. The files are also declared as `<link rel="alternate" type="application/pdf">` in the document head, which some CV parsers and browser extensions pick up.

To replace them, overwrite the two PDFs and update the file sizes shown in `components/CvDownloads.tsx`. Nothing else references them.

## The brand mark and favicon

One mark, generated from a single geometry definition in `tools/build-brand.mjs`, so the React component, the favicon and the social card can never drift apart.

**The mark is deliberately a pure silhouette:** a rounded body with a bold three-point crown (the calyx, the tuft on top of a real pomegranate). The design process tested four rounds of candidates and rasterised each at true pixel size, then magnified it with nearest-neighbour so the result could be judged rather than guessed. Two findings drove the final shape:

1. Interior seed detail blurs into an unreadable smudge below roughly 24px, and 16px is the size that actually matters in a browser tab. Every seed-based variant failed there.
2. The crown is the only feature that distinguishes a pomegranate from a generic berry, so it was made large enough to survive a 16px render.

Two candidate variants were rejected because at 32px their two minimal marks read as a face. That is not a risk worth shipping in a favicon.

| Asset | Size | Why it exists |
| --- | --- | --- |
| `app/icon.svg` | scalable | The primary favicon. Transparent, so it sits on any browser chrome. |
| `app/icon.png` | 512px | Raster fallback, cream mark on a crimson tile. |
| `app/apple-icon.png` | 180px | iOS home screen. Square, because iOS applies its own mask. |
| `app/favicon.ico` | 16 / 32 / 48 | Multi-size ICO, written by hand since sharp cannot emit ICO. |
| `public/brand/og.png` | 1200x630 | Social card, dark, mark locked up beside the wordmark. |

Regenerate everything after changing the geometry, running from `site/`:

```bash
cp ../tools/build-brand.mjs ./ && node build-brand.mjs
```

The favicon is intentionally **not** theme-aware. It always uses the deep rind ground with a cream mark, because a favicon is displayed on browser chrome the site does not control, and it has to read on both light and dark tabs.

## The mobile menu

A full-screen panel rather than a dropdown. A dropdown of four links is the generic answer and it wastes the one moment where the site has the whole screen.

- **The trigger morphs in place.** Two rules rotate into a cross, so there is no flash between unmounting one icon and mounting another.
- **Items stagger in,** each with its own `animation-delay` derived from its index.
- **Current section is marked** with an accent tint and an accent index number.
- **Full keyboard support.** Escape closes and returns focus to the trigger, focus moves into the panel on open, body scroll locks while open, and the closed panel carries `inert` so it stays out of the tab order.
- **The rest of the page is genuinely unreachable while open.** The scrim is a full-viewport blur that captures every click, and it is rendered through a portal into `#overlay-root` at the end of `<body>`. That placement is the fix, not a detail: rendered inline the scrim lived inside the header, which uses `backdrop-filter`, and a filtered element becomes the containing block for its fixed-position descendants. That made the scrim's `inset: 0` resolve against the 64px header box, so it covered almost nothing and the page underneath stayed clickable.
- **Reduced motion and reduced transparency are honoured.** Motion off means the panel appears instantly; transparency off means the blur is replaced by a near-opaque ground.

The prototype in `prototypes/` carries the same panel for the same reason.

## Project visuals

Each project card carries one of two kinds of image, and never a stock photo pretending to be the product:

| Kind | File | Used for |
| --- | --- | --- |
| Real screenshot | `public/projects/<slug>.jpg` | Projects with a live, reachable site |
| Abstract geometry | `public/projects/<slug>.png` | Projects with no public site |

The four screenshots are genuine captures of `pxnapp.com`, `ibookam.com`, `plateaustate.gov.ng` and `nesconigeria.com`, taken headlessly at 1280x800, cropped to 16:9 from the top, and stored as JPEG. Regenerate them from raw captures in `.shots/`:

```bash
node tools/process-shots.mjs      # run from the repo root
```

The abstract panels are generated from a fixed seed per project, so they are byte-stable and reproducible:

```bash
cp ../tools/build-project-art.mjs ./ && node build-project-art.mjs
```

Each motif is chosen to suit the subject: a container diagram for the property platform, a wireframe surface for backend architecture, a load trace for the operations dashboard, a sweep for discovery, a lattice for commerce. They are drawn in the brand ramp so the cards stay inside the palette.

**Why not live iframes?** All four sites permit framing (no `X-Frame-Options`, no `frame-ancestors`), so a live embed would work. It was rejected anyway: it would load four complete third-party sites, including their scripts and analytics, on every visit to the projects page. That is a real privacy and performance cost imposed on your readers to save one screenshot step. Static captures show the same thing with zero runtime cost. Revisit if you want the cards to stay current without redeploying.

There are no remote image hosts configured in `next.config.mjs`, so nothing is fetched from a third party at runtime.

## Interactions

The site was built so that nothing here is required to read it. Every effect is additive.

| Effect | Where | How |
| --- | --- | --- |
| Mobile menu panel | Under 768px | Full-screen panel, morphing trigger |
| Full-page backdrop blur | Menu open | Portalled scrim with `backdrop-filter` |
| Reading progress bar | Top of every page | CSS `animation-timeline: scroll(root)` |
| Header elevation | On scroll | IntersectionObserver sentinel |
| Cursor-tracking glow | Project cards | Pointer position written to CSS vars via ref |
| Accent rule reveal | Writing index rows | `transform: scaleY()` on hover |
| Button lift and glow | Primary CTAs | `transform: translateY()` and box-shadow |
| Tile lift | Stack chips, fact tiles | `transform: translateY()` |
| Click to copy | Contact rows | `navigator.clipboard`, falls back to the plain link |
| Entrance rise | Hero | CSS `@keyframes` on load, no scroll trigger |

Three rules hold across all of it:

1. **No scroll event listeners.** Progress uses a scroll-driven CSS animation, the header uses an IntersectionObserver sentinel, and the card glow coalesces to one write per frame with `requestAnimationFrame`.
2. **Only `transform` and `opacity` are animated.** Nothing animates `top`, `left`, `width` or `height`, so there is no layout thrash.
3. **Everything collapses under `prefers-reduced-motion: reduce`.** The progress bar is not drawn, the glow is not attached, and transforms are disabled.

The cursor glow is also skipped for coarse pointers, so touch devices never run that code.

## Before you deploy

1. **Add a real portrait and workspace photo.** The hero and About images are currently generated abstract art, not photographs. That was a deliberate choice: a stock photo of an unrelated person would misrepresent who wrote the site, so clearly abstract geometry is the honest placeholder. A real portrait would improve the About page more than anything else. Drop files into `public/brand/` and update the two `src` values in `app/page.tsx` and `app/about/page.tsx`.
2. **Refresh the project screenshots as the sites change.** They are static captures, so they age. Re-run `node tools/process-shots.mjs` from the repo root after new captures land in `.shots/`.
3. **Restore the Dwelliva link when the site is back up.** `dwelliva-app.com` currently returns HTTP 402 and the apex domain does not resolve, so the project card shows `Site currently offline` rather than a dead link. Add a `url` field to that entry in `site/lib/projects.ts` once it responds, and the link appears automatically.
4. **Set your real domain.** `metadataBase` in `app/layout.tsx` and the `Sitemap` line in `public/robots.txt` both say `example.com`.
5. **Write your own posts.** The six posts are real articles on subjects drawn from your CV, written as concrete first-person engineering accounts. They exist so the design is demonstrated with genuine long-form prose rather than lorem ipsum. Read them, edit them, or replace them with writing that is actually yours before publishing.
6. **Add a sitemap.** There is no `sitemap.ts` yet. With static routes it is a small file if you want one.
7. **Consider a font.** The stack asks for Satoshi and falls back through General Sans to the system UI font. Adding Satoshi is a two-line change in `globals.css` plus the font files or a hosted link.
8. **Swap the social card.** `public/brand/og.png` is generated and currently says `example.com` nowhere, so it is safe as-is, but it uses a system font rather than your display face. Regenerate it with `tools/build-brand.mjs` once the real font is in place.

## Notes on the build

- Maps to Tailwind v4, which is why there is no `tailwind.config.js`: the theme is declared in CSS and Tailwind runs as a PostCSS plugin.
- Posts render through `react-markdown` with `remark-gfm` for tables, `rehype-slug` for heading anchors and `rehype-highlight` for code. The initial plan was `next-mdx-remote`, which is now archived, so this is the maintained path.
- All six posts are statically prerendered at build time. The build output lists each one individually.
- `next/image` is configured to allow `picsum.photos` only. Add your own host to `remotePatterns` in `next.config.mjs` when you switch to real assets.
