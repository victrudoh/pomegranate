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

## Post hero images

Every post can carry a hero banner via frontmatter:

```yaml
hero: /writing/my-post.jpg
heroAlt: What the image shows
heroCaption: Optional caption, also used for attribution.
```

All three are optional. The hero renders wider than the text column, below the title, and doubles as the post's social card image when one is set.

The post heroes come from two honest sources:

- **Real screenshots.** The Adobe post uses PhotoCraft's own README screenshot, with Hokusai's *The Great Wave* open in the Curves workspace. The artwork is public domain via Wikimedia Commons and the caption says so. The God's Eye View post uses a frame from the project's own published demo capture.
- **Generated editorial art.** The six engineering essays use article-specific generated banners: latency as a timed product interaction, idempotency as duplicate payment routing, public-sector performance as a lightweight mobile government page, indexes as ordered database pages, React Query as separated state layers, and wallets as reconciled ledger flows.

Nothing here is a stock photograph of an unrelated subject. Captions are mandatory in practice: an image credit you cannot trace is worse than no image.

## Tables in posts

Markdown tables render through `react-markdown` with `remark-gfm`, and a `components` override in `components/Prose.tsx` wraps every table in a horizontally scrollable container. That wrapper has to be added in code, because markdown gives you no way to add one, and without it a wide table pushes the whole page sideways on a phone.

## Project visuals

Each project card carries one of two kinds of image, and never a stock photo pretending to be the product:

| Kind | File | Used for |
| --- | --- | --- |
| Real screenshot | `public/projects/<slug>.jpg` | Projects with a live, reachable site |
| Abstract geometry | `public/projects/<slug>.png` | Projects with no public site |

The four screenshots are genuine captures of `pxnapp.com`, `ibookam.com`, `plateaustate.gov.ng` and `nesconigeria.com`. Regenerate them from raw captures in `.shots/` with `tools/process-shots.mjs`. The abstract panels are generated from a fixed seed per project, so they are byte-stable and reproducible.

**Why not live iframes?** All four sites permit framing (no `X-Frame-Options`, no `frame-ancestors`), so a live embed would work. It was rejected anyway: it would load four complete third-party sites, including their scripts and analytics, on every visit to the projects page. That is a real privacy and performance cost imposed on your readers to save one screenshot step. Static captures show the same thing with zero runtime cost.

There are no remote image hosts configured in `next.config.mjs`, so nothing is fetched from a third party at runtime.

## SEO and sharing

Everything here is generated from `lib/site.ts`, which holds the canonical host in one place. Change `SITE.url` there and the canonicals, sitemap, feed and share previews all follow.

| What | Where | Why |
| --- | --- | --- |
| Canonical URLs | Every page | Without one, `/` and `/index` index as two pages and split ranking |
| Sitemap | `/sitemap.xml`, generated from the post list | A new markdown file appears automatically |
| robots.txt | `/robots.txt`, generated | Previously a static file pointing at `example.com` |
| RSS feed | `/writing/rss.xml` | One stable document listing every post |
| JSON-LD | `components/StructuredData.tsx` and per post | `Person`, `WebSite`, `Blog`, `BlogPosting` |
| Open Graph | Per page and per post | This is what drives link previews |

### Link previews

Pasting a post URL into WhatsApp, Slack, iMessage or X shows the post's own hero image, title and summary. Three things make that work, and all three are load-bearing:

1. **`metadataBase` is set** in `app/layout.tsx`. Without it Next emits relative image URLs, and every scraper requires absolute ones. They fail silently: you get a bare link with no preview and no error.
2. **Every post declares `openGraph.images`** with explicit width and height. WhatsApp and Facebook will not render a preview without dimensions, and a post with no hero falls back to the site card rather than showing nothing.
3. **`twitter:card` is `summary_large_image`**, which is what produces the big-image layout rather than a thumbnail.

Per post you get `og:type=article`, `article:published_time`, `article:author` and the tags, plus a `BlogPosting` JSON-LD block. The JSON-LD author is a reference to the site-wide `Person` entity by `@id`, and that entity carries `sameAs` links to GitHub and LinkedIn. That link is how a search engine knows the site and the profiles are the same person.

To verify a live deploy, paste a post URL into [the Facebook debugger](https://developers.facebook.com/tools/debug/) or [opengraph.xyz](https://www.opengraph.xyz/). Both refetch from scratch and will tell you if an image fails to load.

### Share buttons

Every post ends with a share row. It uses the native share sheet where the platform has one, which is what puts a post into WhatsApp in two taps on a phone, and falls back to explicit WhatsApp, X and LinkedIn buttons plus copy-link elsewhere.

The URL shared is read from the page's own `<link rel="canonical">` rather than `window.location`, so sharing from a URL with tracking parameters or a trailing slash still sends the clean address.

## Typeface

The site uses **Satoshi**, self-hosted from `app/fonts/`.

It is a real font file served from this deployment, not a CDN link. An earlier version declared `Satoshi` in the stack without shipping the file, so every visitor silently got the system fallback and the intended type identity never appeared. Worth checking any time a font is named in CSS: a name that is never downloaded is indistinguishable from a deliberate choice.

```bash
node tools/fetch-fonts.mjs     # re-fetch the woff2 files from Fontshare
```

The URLs come from Fontshare's CSS endpoint rather than being hardcoded. Note their API lists file paths **without** an extension; omitting `.woff2` returns a 404.

**Licence:** Satoshi is free for personal use. For commercial use, buy a licence or switch to an SIL Open Font License face. Geist and Outfit are both OFL and available through `next/font/google` with one line changed in `lib/fonts.ts`.

## Tags

Tags are real links. Every chip goes to `/writing/tagged/<slug>`, the writing index opens with a browse-by-tag row, and each tag page cross-links the others with post counts.

Tag pages are generated from the tags that actually exist on posts (`lib/tags.ts`), so adding a tag to a markdown file produces a working page with no registry to update. They are also the main internal linking on the site: a reader who finishes one Postgres post now has a route to the others, and search engines get topical clustering instead of eight orphaned articles.

`Open source` becomes `open-source`; anything that slugs to an unknown tag returns a 404 rather than an empty page.

## Back to top

The floating button appears once the reader is 1.5 screens down and fills a ring with scroll position as they go.

It uses **no scroll event listener**. Visibility comes from an IntersectionObserver on a marker element, and the ring is driven by `animation-timeline: scroll(root)` on the compositor, the same mechanism as the top progress bar, so the two can never disagree.

Two things about the marker element are load-bearing and were both wrong on the first attempt:

1. **It must be the first element in `<body>`.** It is geometric: the threshold is its own bottom edge at 1.5 viewport heights. Mounting it later moves the threshold down with it, which put it at the very end of the document and meant the button only appeared at the footer, exactly backwards.
2. **It must not use a negative-margin spacer.** A `height: 150vh` block with `margin-bottom: -150vh` works in a plain document but breaks inside any scroll container, where the spacer overlaps content instead of displacing it. It is now a 0-height relative wrapper holding an absolutely positioned 150vh child, so it never affects layout.

Verified geometry: with a 469px viewport, the marker's bottom edge resolves to 704px, which is exactly 1.5 screens.

## Accessibility notes

- Every interactive control is reachable by keyboard and has a visible focus ring.
- The mobile menu traps nothing, closes on Escape, and returns focus to its trigger.
- The share row announces its copied state through `aria-live`, rather than only changing colour.
- The table scroll container is focusable and labelled, so a keyboard user can scroll a wide table.

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
4. **Set your real domain.** `SITE.url` in `lib/site.ts` currently points at the Vercel domain. Change it there when you move to a custom domain, and metadata, sitemap, robots and feed links follow.
5. **Review the nine posts.** Three are news analysis written from a brief (the Rust Adobe clones, God's Eye View, and Lagos Life); the other six are engineering essays drawn from your CV. All are written as concrete first-person engineering accounts so the design was demonstrated with genuine long-form prose rather than lorem ipsum. Read them, edit them, or replace them with writing that is actually yours before publishing. The three news posts carry dated figures that go stale, and their facts were verified against primary sources at the time of writing rather than taken from a video or a social post.
6. **Consider a font.** The stack asks for Satoshi and falls back through General Sans to the system UI font. Adding Satoshi is a two-line change in `globals.css` plus the font files or a hosted link.
7. **Swap the social card.** `public/brand/og.png` is generated and currently says `example.com` nowhere, so it is safe as-is, but it uses a system font rather than your display face. Regenerate it with `tools/build-brand.mjs` once the real font is in place.

## Notes on the build

- **Facts in the three news posts were verified against primary sources, not videos or social posts.** Two examples of why that matters: the Adobe video cited PhotoCraft at "more than 13,000 stars" when the GitHub API reported 58,747, and named the PDF tool "PrintCraft" when the repository is `PdfCraft`. Separately, an often-repeated claim that Lagos Life was built with a specific Claude model could not be confirmed in any source; the Claude attribution in circulation refers to Lagos Run, a different game by a different developer, and the Lagos Life post says so rather than repeating it. Star counts and player counts are presented as dated tables so it is obvious they expire.
- Maps to Tailwind v4, which is why there is no `tailwind.config.js`: the theme is declared in CSS and Tailwind runs as a PostCSS plugin.
- Posts render through `react-markdown` with `remark-gfm` for tables, `rehype-slug` for heading anchors and `rehype-highlight` for code. The initial plan was `next-mdx-remote`, which is now archived, so this is the maintained path.
- All nine posts are statically prerendered at build time. The build output lists each one individually.
- `next/image` uses local assets only. `next.config.mjs` intentionally has no remote image hosts, so no third-party image request happens at runtime.
