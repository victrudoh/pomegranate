/**
 * Generates abstract geometry art for the project cards that have no live site.
 *
 * These are deliberately non-representational: built from the same primitives as
 * the brand mark (circles, arcs, straight rules) on a seeded grid, so they read
 * as technical diagram fragments rather than stock imagery. That keeps them
 * clearly decorative, which is the honest choice when there is no real screen to
 * show, and it avoids the fake-dashboard cliché.
 *
 * Everything is drawn in the brand ramp. Output is deterministic: each seed is
 * fixed, so regenerating produces byte-identical files.
 *
 * Usage: node tools/build-project-art.mjs   (run from site/)
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const W = 1200;
const H = 675; // 16:9
const OUT = 'public/projects';
const BRAND_OUT = 'public/brand';

const INK = '#8e2839';
const MID = '#b02a3d';
const LIGHT = '#d4a9a4';
const CREAM = '#f8f1ec';
const GROUND = '#efe6df';

/** Deterministic PRNG (mulberry32) so art is stable across runs. */
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A dot lattice that swells into clusters.
 *
 * Radius is driven by distance from one of two attractor points rather than
 * pure randomness, so the field has visible structure instead of looking
 * uniformly noisy. That is what stops it reading as a random scatter.
 */
function lattice({ seed, rows = 12, cols = 20 }) {
  const r = rng(seed);
  const cellW = W / cols;
  const cellH = H / rows;
  const attA = [W * (0.22 + r() * 0.1), H * (0.55 + r() * 0.2)];
  const attB = [W * (0.74 + r() * 0.1), H * (0.32 + r() * 0.2)];
  let out = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = cellW * (x + 0.5);
      const cy = cellH * (y + 0.5);
      const dA = Math.hypot(cx - attA[0], cy - attA[1]);
      const dB = Math.hypot(cx - attB[0], cy - attB[1]);
      const near = Math.min(dA, dB);
      // closeness -> bigger dot; the -0.34 shifts the field so there is real
      // empty space rather than every cell being occupied
      const closeness = Math.max(0, 1 - near / (W * 0.42)) - 0.34;
      const noise = (r() - 0.5) * 0.22;
      const v = closeness + noise;
      if (v <= 0.02) continue;
      const radius = 5 + v * 26;
      const fill = v > 0.62 ? INK : v > 0.34 ? MID : LIGHT;
      out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${radius.toFixed(1)}" fill="${fill}" opacity="${(0.34 + v * 0.6).toFixed(2)}"/>`;
    }
  }
  return out;
}

/** Concentric arcs from an off-centre origin. Reads as a radar sweep. */
function arcs({ seed }) {
  const r = rng(seed);
  const cx = W * 0.34;
  const cy = H * 0.72;
  let out = '';
  for (let i = 16; i > 0; i--) {
    const radius = 26 * i + r() * 22;
    const start = -0.35 - r() * 0.5;
    const sweep = 1.15 + r() * 1.25;
    const x1 = cx + Math.cos(start) * radius;
    const y1 = cy + Math.sin(start) * radius;
    const x2 = cx + Math.cos(start + sweep) * radius;
    const y2 = cy + Math.sin(start + sweep) * radius;
    const large = sweep > Math.PI ? 1 : 0;
    const strong = i % 4 === 0;
    out += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius.toFixed(1)} ${radius.toFixed(1)} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${strong ? INK : MID}" stroke-width="${(strong ? 7.5 : 3).toFixed(1)}" opacity="${(strong ? 0.72 : 0.4).toFixed(2)}" stroke-linecap="round"/>`;
  }
  return out;
}

/** Nested rotated rectangles. Reads as a containment or architecture diagram. */
function nested({ seed }) {
  const r = rng(seed);
  let out = '';
  let inset = 40;
  let step = 0;
  const cx = W / 2;
  const cy = H / 2;
  while (inset < Math.min(W, H) / 2 - 14) {
    const w = W - inset * 2;
    const h = H - inset * 2;
    const rot = step * (2.1 + r() * 1.4) * (step % 2 ? 1 : -1);
    const strong = step % 3 === 0;
    out += `<g transform="rotate(${rot.toFixed(2)} ${cx} ${cy})"><rect x="${inset}" y="${inset}" width="${w}" height="${h}" rx="${Math.max(4, 26 - step * 2).toFixed(1)}" fill="none" stroke="${strong ? INK : MID}" stroke-width="${(strong ? 6.5 : 2.6).toFixed(2)}" opacity="${(strong ? 0.68 : 0.38).toFixed(2)}"/></g>`;
    inset += 26 + r() * 30;
    step++;
  }
  return out;
}

/** Parallel rules of varying weight. Reads as a load trace or signal band. */
function rules({ seed }) {
  const r = rng(seed);
  let out = '';
  let y = 26;
  while (y < H - 30) {
    const heavy = r() > 0.74;
    const len = W * (heavy ? 0.36 + r() * 0.5 : 0.2 + r() * 0.66);
    const x = r() * (W - len);
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${len.toFixed(1)}" height="${(heavy ? 12 + r() * 9 : 3 + r() * 6).toFixed(1)}" rx="${(2 + r() * 5).toFixed(1)}" fill="${heavy ? INK : MID}" opacity="${(heavy ? 0.72 : 0.3 + r() * 0.35).toFixed(2)}"/>`;
    y += 15 + r() * 22;
  }
  return out;
}

/** A triangulated mesh that slopes across the frame. Reads as a wireframe. */
function mesh({ seed, cols = 16, rows = 10 }) {
  const r = rng(seed);
  const pts = [];
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= cols; x++) {
      // a gentle diagonal tilt, so the surface has direction
      const tilt = (x / cols) * 54;
      pts.push([
        (W / cols) * x + (r() - 0.5) * 26,
        (H / rows) * y + tilt + (r() - 0.5) * 26,
      ]);
    }
  }
  const at = (x, y) => pts[y * (cols + 1) + x];
  let out = '';
  const line = (a, b, o) =>
    `<path d="M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)}" stroke="${o > 0.78 ? INK : MID}" stroke-width="${(o > 0.78 ? 5.5 : 2.4).toFixed(1)}" opacity="${(o > 0.78 ? 0.62 : 0.3).toFixed(2)}" stroke-linecap="round"/>`;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const o = r();
      if (o < 0.34) continue;
      out += line(at(x, y), at(x + 1, y), o);
      if (r() > 0.32) out += line(at(x, y), at(x, y + 1), o);
      if (r() > 0.66) out += line(at(x, y), at(x + 1, y + 1), o);
    }
  }
  return out;
}

/**
 * Motif per project, chosen to suit the subject: a container diagram for a
 * property platform, a wireframe surface for backend architecture, a load trace
 * for an operations dashboard, a sweep for discovery, a lattice for commerce.
 */
const PANELS = [
  { slug: 'pxn-commerce-dashboard', motif: lattice, seed: 20241, wash: 'right' },
  { slug: 'dwelliva', motif: nested, seed: 77310, wash: 'left' },
  { slug: 'talmow', motif: mesh, seed: 51488, wash: 'right' },
  { slug: 'discount-hub', motif: arcs, seed: 39017, wash: 'left' },
  { slug: 'giitsc-enterprise', motif: rules, seed: 62155, wash: 'right' },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(BRAND_OUT, { recursive: true });

  for (const panel of PANELS) {
    const motif = panel.motif({ seed: panel.seed });
    const washX = panel.wash === 'left' ? '8%' : '92%';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs>
        <radialGradient id="wash" cx="${washX}" cy="26%" r="94%">
          <stop offset="0%" stop-color="${CREAM}"/>
          <stop offset="58%" stop-color="${GROUND}"/>
          <stop offset="100%" stop-color="#e2d3ca"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#wash)"/>
      <g>${motif}</g>
    </svg>`;

    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(`${OUT}/${panel.slug}.png`);
    console.log(`projects/${panel.slug}.png`);
  }

  /**
   * Hero and portrait panels.
   *
   * These stand in for the two photographs the site eventually wants: a real
   * portrait, and a real workspace shot. Abstract geometry is used rather than
   * a stock photograph of an unrelated person or desk, because a stock face
   * would misrepresent who wrote the site. Clearly abstract art reads as a
   * placeholder, which is the honest option, and it matches the project art.
   *
   * Both are 4:5, matching the aspect ratios the layouts reserve.
   */
  const brandPanels = [
    // portrait: a lattice, drawn at 4:5
    {
      file: 'portrait.png',
      w: 760,
      h: 950,
      inner: (() => {
        const r = rng(11837);
        let out = '';
        const cols = 12;
        const rows = 15;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const cx = (760 / cols) * (x + 0.5);
            const cy = (950 / rows) * (y + 0.5);
            const dA = Math.hypot(cx - 300, cy - 400);
            const dB = Math.hypot(cx - 560, cy - 680);
            const v = Math.max(0, 1 - Math.min(dA, dB) / 420) - 0.36 + (r() - 0.5) * 0.2;
            if (v <= 0.02) continue;
            out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(5 + v * 24).toFixed(1)}" fill="${v > 0.6 ? '#8e2839' : v > 0.32 ? '#b02a3d' : '#d4a9a4'}" opacity="${(0.34 + v * 0.58).toFixed(2)}"/>`;
          }
        }
        return out;
      })(),
    },
    // hero: a diagonal mesh, drawn at 4:5
    {
      file: 'hero.png',
      w: 880,
      h: 1100,
      inner: (() => {
        const r = rng(60422);
        const cols = 12;
        const rows = 15;
        const pts = [];
        for (let y = 0; y <= rows; y++) {
          for (let x = 0; x <= cols; x++) {
            pts.push([
              (880 / cols) * x + (r() - 0.5) * 30,
              (1100 / rows) * y + (x / cols) * 70 + (r() - 0.5) * 30,
            ]);
          }
        }
        const at = (x, y) => pts[y * (cols + 1) + x];
        let out = '';
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const o = r();
            if (o < 0.34) continue;
            const strong = o > 0.78;
            const stroke = strong ? '#8e2839' : '#b02a3d';
            const sw = strong ? 5.5 : 2.4;
            const op = strong ? 0.6 : 0.3;
            const seg = (a, b) =>
              `<path d="M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)}" stroke="${stroke}" stroke-width="${sw}" opacity="${op}" stroke-linecap="round"/>`;
            out += seg(at(x, y), at(x + 1, y));
            if (r() > 0.34) out += seg(at(x, y), at(x, y + 1));
            if (r() > 0.68) out += seg(at(x, y), at(x + 1, y + 1));
          }
        }
        return out;
      })(),
    },
  ];

  for (const panel of brandPanels) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${panel.w}" height="${panel.h}" viewBox="0 0 ${panel.w} ${panel.h}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${CREAM}"/>
          <stop offset="65%" stop-color="${GROUND}"/>
          <stop offset="100%" stop-color="#ddd0c7"/>
        </linearGradient>
      </defs>
      <rect width="${panel.w}" height="${panel.h}" fill="url(#bg)"/>
      <g>${panel.inner}</g>
    </svg>`;
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(`${BRAND_OUT}/${panel.file}`);
    console.log(`brand/${panel.file}`);
  }

  console.log(`\n${PANELS.length} project panels and ${brandPanels.length} brand panels written`);
}

main();
