/**
 * Builds hero images for the writing posts.
 *
 * Every image here comes from the project being written about, or from the post
 * author's own generated art. Nothing is a stock photograph of an unrelated
 * subject, and nothing is a screenshot of a different product.
 *
 * Provenance per image is recorded in HEROES below and repeated in the README,
 * because an image credit you cannot trace is worse than no image.
 *
 * Usage: node tools/build-post-heroes.mjs   (run from the repo root)
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = 'site/public/writing';
const W = 1600;
const H = 800; // 2:1, a wide banner that crops well on mobile

/** 16:9 poster frame from a YouTube thumbnail, letterboxed out to 2:1. */
async function fromThumb(src, { focus = 'top' } = {}) {
  const meta = await sharp(src).metadata();
  const targetRatio = W / H;
  let cropH = Math.round(meta.width / targetRatio);
  if (cropH > meta.height) cropH = meta.height;
  const cropW = Math.min(meta.width, Math.round(cropH * targetRatio));
  const top = focus === 'top' ? 0 : Math.max(0, Math.round((meta.height - cropH) / 2));
  return sharp(src)
    .extract({ left: Math.round((meta.width - cropW) / 2), top, width: cropW, height: cropH })
    .resize(W, H, { fit: 'fill' });
}

/**
 * Screenshots of real applications are flat UI, so the useful content usually
 * sits in the top band (toolbars, menus, the canvas). Cropping from the top
 * keeps the app recognisable; a centre crop of a tall screenshot does not.
 */
async function fromScreenshot(src, { shift = 0 } = {}) {
  const meta = await sharp(src).metadata();
  const targetRatio = W / H;
  let cropH = Math.min(meta.height, Math.round(meta.width / targetRatio));
  const cropW = Math.min(meta.width, Math.round(cropH * targetRatio));
  const top = Math.min(Math.max(0, Math.round(meta.height * shift)), meta.height - cropH);
  return sharp(src)
    .extract({ left: Math.round((meta.width - cropW) / 2), top, width: cropW, height: cropH })
    .resize(W, H, { fit: 'fill' });
}

/** First frame of an animated GIF, which is the project's own demo capture. */
async function fromGifFrame(src) {
  const meta = await sharp(src, { animated: true }).metadata();
  const frame = await sharp(src, { page: 0 }).toBuffer();
  void meta;
  return sharp(frame).resize(W, H, { fit: 'cover', position: 'top' });
}

const HEROES = [
  {
    // PhotoCraft's own README screenshot: Hokusai's The Great Wave (public
    // domain, Wikimedia Commons) open in the app's Curves workspace.
    source: '.shots/hero/photocraft.jpg',
    out: 'adobe-clones-in-rust.jpg',
    kind: 'screenshot',
    shift: 0,
    quality: 84,
  },
  {
    // First frame of the demo GIF published in the God's Eye View repo.
    source: '.shots/hero/godseye.gif',
    out: 'gods-eye-view.jpg',
    kind: 'gif',
    quality: 84,
  },
  {
    // The video's own poster frame, credited and linked in the post.
    source: '.shots/hero/yt-godseye.jpg',
    out: 'gods-eye-view-video.jpg',
    kind: 'thumb',
    quality: 84,
  },
  {
    source: '.shots/hero/yt-adobe.jpg',
    out: 'adobe-clones-in-rust-video.jpg',
    kind: 'thumb',
    quality: 84,
  },
];

/**
 * Abstract heroes for the engineering essays.
 *
 * These posts are about patterns and ideas, not about a specific product, so
 * there is no real screenshot that honestly illustrates them. A stock photo of
 * a server room or a person at a laptop would be decoration pretending to be
 * evidence. Generated geometry in the brand palette is the honest option, and it
 * matches the art used on the project cards, so the whole site reads as one
 * system.
 *
 * Each motif is chosen to echo its subject:
 */
const ESSAYS = [
  // idempotency: a lattice of identical marks, i.e. the same request repeated
  { out: 'idempotency-keys.png', kind: 'dots', seed: 71204 },
  // wallets and ledgers: balanced columns that never quite line up
  { out: 'wallets-and-ledgers.png', kind: 'bars', seed: 30418 },
  // react query and state: one origin with two competing spirals
  { out: 'react-query-and-state.png', kind: 'rings', seed: 88156 },
  // public sector performance: a sparse graph, drawing itself slowly
  { out: 'public-sector-performance.png', kind: 'grid', seed: 24907 },
  // postgres indexes: sorted vertical structure
  { out: 'postgres-indexes.png', kind: 'columns', seed: 56331 },
  // ai latency budget: signals that all stop at the same hard limit
  { out: 'ai-latency-budget.png', kind: 'cutoff', seed: 14072 },
];

/** Deterministic PRNG, so every regeneration is byte-identical. */
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const INK = '#8e2839';
const MID = '#b02a3d';
const LIGHT = '#d4a9a4';
const CREAM = '#f8f1ec';
const GROUND = '#efe6df';

function essayArt(kind, seed) {
  const r = makeRng(seed);
  let out = '';

  if (kind === 'dots') {
    // a field of identical marks, denser toward the centre
    const cols = 26;
    const rows = 13;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = (W / cols) * (x + 0.5);
        const cy = (H / rows) * (y + 0.5);
        const d = Math.hypot(cx - W * 0.5, cy - H * 0.5) / (W * 0.42);
        const v = Math.max(0, 1 - d) - 0.24 + (r() - 0.5) * 0.16;
        if (v <= 0.02) continue;
        out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(4 + v * 17).toFixed(1)}" fill="${v > 0.55 ? INK : v > 0.28 ? MID : LIGHT}" opacity="${(0.32 + v * 0.55).toFixed(2)}"/>`;
      }
    }
  }

  if (kind === 'bars' || kind === 'columns') {
    const vertical = kind === 'columns';
    const count = vertical ? 30 : 22;
    for (let i = 0; i < count; i++) {
      const strong = r() > 0.72;
      const len = (vertical ? H : W) * (strong ? 0.5 + r() * 0.45 : 0.14 + r() * 0.5);
      const thickness = strong ? 14 + r() * 12 : 4 + r() * 8;
      const pos = vertical
        ? (W / count) * (i + 0.5) + (r() - 0.5) * 14
        : (H / count) * (i + 0.5) + (r() - 0.5) * 12;
      const start = vertical ? H - len - 24 : 24 + r() * 60;
      const x = vertical ? pos : start;
      const y = vertical ? start : pos;
      const w = vertical ? thickness : len;
      const h = vertical ? len : thickness;
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(thickness / 2).toFixed(1)}" fill="${strong ? INK : MID}" opacity="${(strong ? 0.62 : 0.26 + r() * 0.3).toFixed(2)}"/>`;
    }
  }

  if (kind === 'rings') {
    const cx = W * 0.5;
    const cy = H * 0.5;
    for (let i = 26; i > 0; i--) {
      const radius = 20 * i + r() * 18;
      const start = r() * Math.PI * 2;
      const sweep = 0.5 + r() * 2.6;
      const x1 = cx + Math.cos(start) * radius;
      const y1 = cy + Math.sin(start) * radius;
      const x2 = cx + Math.cos(start + sweep) * radius;
      const y2 = cy + Math.sin(start + sweep) * radius;
      const strong = i % 5 === 0;
      out += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius.toFixed(1)} ${radius.toFixed(1)} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${strong ? INK : MID}" stroke-width="${(strong ? 5.5 : 2.2).toFixed(1)}" opacity="${(strong ? 0.5 : 0.22).toFixed(2)}" stroke-linecap="round"/>`;
    }
  }

  if (kind === 'grid') {
    // a sparse graph drawing itself, thicker where it "slows down". Kept denser
    // and darker than a first pass, which read as almost empty at page width.
    const cols = 24;
    const rows = 12;
    const pts = [];
    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        pts.push([(W / cols) * x + (r() - 0.5) * 34, (H / rows) * y + (r() - 0.5) * 30]);
      }
    }
    const at = (x, y) => pts[y * (cols + 1) + x];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const o = r();
        if (o < 0.36) continue;
        const strong = o > 0.8;
        const a = at(x, y);
        const b = at(x + 1, y);
        out += `<path d="M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)}" stroke="${strong ? INK : MID}" stroke-width="${(strong ? 6.5 : 2.8).toFixed(1)}" opacity="${(strong ? 0.68 : 0.34).toFixed(2)}"/>`;
        if (r() > 0.42) {
          const c = at(x, y + 1);
          out += `<path d="M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${c[0].toFixed(1)} ${c[1].toFixed(1)}" stroke="${strong ? MID : LIGHT}" stroke-width="2.4" opacity="${(strong ? 0.4 : 0.26).toFixed(2)}"/>`;
        }
      }
    }
  }

  if (kind === 'cutoff') {
    // Fewer, thinner rules so the negative space actually reads. Every rule runs
    // to the same vertical limit and stops: the budget is the empty right side,
    // and the faint vertical line marks where it runs out.
    const limit = W * 0.58;
    const count = 15;
    for (let i = 0; i < count; i++) {
      const y = 40 + (H - 80) * (i / (count - 1)) + (r() - 0.5) * 14;
      const strong = r() > 0.66;
      // a couple of rules run short, which reads as a request that finished early
      const short = r() > 0.86 ? 0.45 + r() * 0.3 : 1;
      const end = 46 + (limit - 46) * short;
      out += `<rect x="46" y="${y.toFixed(1)}" width="${(end - 46).toFixed(1)}" height="${(strong ? 9 + r() * 5 : 3 + r() * 4).toFixed(1)}" rx="3" fill="${strong ? INK : MID}" opacity="${(strong ? 0.74 : 0.34).toFixed(2)}"/>`;
    }
    out += `<rect x="${limit.toFixed(1)}" y="26" width="2" height="${(H - 52).toFixed(1)}" fill="${INK}" opacity="0.38"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${CREAM}"/>
        <stop offset="60%" stop-color="${GROUND}"/>
        <stop offset="100%" stop-color="#e0d2c9"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <g>${out}</g>
  </svg>`;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  for (const hero of HEROES) {
    const meta = await sharp(hero.source, { animated: false }).metadata().catch(() => null);
    if (!meta) {
      console.log(`SKIP ${hero.out}: could not read ${hero.source}`);
      continue;
    }

    let pipeline;
    if (hero.kind === 'thumb') pipeline = await fromThumb(hero.source);
    else if (hero.kind === 'gif') pipeline = await fromGifFrame(hero.source);
    else pipeline = await fromScreenshot(hero.source, { shift: hero.shift ?? 0 });

    await pipeline
      .jpeg({ quality: hero.quality, mozjpeg: true, progressive: true })
      .toFile(`${OUT}/${hero.out}`);

    const size = (await import('node:fs')).statSync(`${OUT}/${hero.out}`).size;
    console.log(`${hero.out}  ${(size / 1024).toFixed(0)} KB  (from ${hero.source})`);
  }

  // abstract essay heroes, generated rather than sourced
  for (const essay of ESSAYS) {
    const svg = essayArt(essay.kind, essay.seed);
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .toFile(`${OUT}/${essay.out}`);
    const size = (await import('node:fs')).statSync(`${OUT}/${essay.out}`).size;
    console.log(`${essay.out}  ${(size / 1024).toFixed(0)} KB  (generated, ${essay.kind})`);
  }
}

main();
