/**
 * Builds the pomegranate brand assets from a single canonical mark definition.
 *
 * The mark is a pure silhouette: a rounded body with a bold three-point crown
 * (the calyx). Testing at real pixel sizes showed that interior seed detail
 * blurs into an unreadable smudge below roughly 24px, and 16px is the size that
 * actually matters for a browser tab. So the mark carries no interior detail at
 * all, and the crown does the work of identifying it. Seed motifs are used
 * elsewhere in the design system instead.
 *
 * Outputs (all into site/):
 *   app/icon.svg          scalable favicon, the primary source of truth
 *   app/icon.png          512px raster favicon
 *   app/apple-icon.png    180px iOS home screen icon
 *   app/favicon.ico       16/32/48 multi-size, written by hand (sharp cannot)
 *   public/brand/og.png   1200x630 social card
 *
 * Usage: node tools/build-brand.mjs   (run from site/)
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const RIND_DEEP = '#8e2839';
const RIND = '#b02a3d';
const CREAM = '#f6ece7';

/**
 * Canonical geometry on a 32x32 grid. Kept in one place so the SVG, the ICO and
 * the React component cannot drift apart.
 */
const G = {
  viewBox: 32,
  body: { cx: 16, cy: 19.6, rx: 11.4, ry: 11.0 },
  crown: 'M8.6 12.4 L10.6 3.2 L13.3 9.2 L16 1.4 L18.7 9.2 L21.4 3.2 L23.4 12.4 Z',
};

/** Rind-only mark, used for the favicon and the header. */
function markInner({ fill = RIND } = {}) {
  return `<ellipse cx="${G.body.cx}" cy="${G.body.cy}" rx="${G.body.rx}" ry="${G.body.ry}" fill="${fill}"/><path d="${G.crown}" fill="${fill}"/>`;
}

function markSvg({ size = G.viewBox, fill = RIND, rounded = false } = {}) {
  const bg = rounded
    ? `<rect width="${G.viewBox}" height="${G.viewBox}" rx="7.5" fill="${RIND_DEEP}"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${G.viewBox} ${G.viewBox}" role="img" aria-label="pomegranate">${bg}${markInner({ fill: rounded ? CREAM : fill })}</svg>`;
}

/**
 * Writes a multi-size .ico. Modern browsers all accept PNG-compressed entries,
 * so the container is simple: a 6-byte header, one 16-byte directory entry per
 * image, then the PNG payloads. sharp cannot emit ICO, hence the manual writer.
 */
function buildIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  images.forEach((img, i) => {
    const at = i * 16;
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, at + 0); // width
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, at + 1); // height
    dir.writeUInt8(0, at + 2); // palette count
    dir.writeUInt8(0, at + 3); // reserved
    dir.writeUInt16LE(1, at + 4); // colour planes
    dir.writeUInt16LE(32, at + 6); // bits per pixel
    dir.writeUInt32LE(img.data.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += img.data.length;
  });

  return Buffer.concat([header, dir, ...images.map((i) => i.data)]);
}

async function main() {
  await mkdir('app', { recursive: true });
  await mkdir('public/brand', { recursive: true });

  // ── scalable favicon: transparent, so it sits on any browser chrome ──
  await writeFile('app/icon.svg', markSvg({ size: G.viewBox, fill: RIND }));

  // ── raster favicon and iOS icon, on the brand crimson so they read on
  //    both light and dark surfaces without relying on transparency ──
  const tileSvg = markSvg({ size: G.viewBox, rounded: true });
  await sharp(Buffer.from(tileSvg)).resize(512, 512).png().toFile('app/icon.png');

  // apple-icon: no rounding, iOS applies its own mask
  const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="${RIND_DEEP}"/>${markInner({ fill: CREAM })}</svg>`;
  await sharp(Buffer.from(appleSvg)).resize(180, 180).png().toFile('app/apple-icon.png');

  // ── multi-size ICO ──
  const icoImages = [];
  for (const size of [16, 32, 48]) {
    const png = await sharp(Buffer.from(tileSvg)).resize(size, size).png().toBuffer();
    icoImages.push({ size, data: png });
  }
  await writeFile('app/favicon.ico', buildIco(icoImages));

  // ── social card, 1200x630. The mark sits to the left of a text block that is
  //    vertically centred against it, so the two never overlap regardless of
  //    how the font substitutes. ──
  const ogMark = await sharp(Buffer.from(markSvg({ size: 32, fill: RIND })))
    .resize(148, 148)
    .png()
    .toBuffer();

  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#141113"/>
    <text x="306" y="318" font-family="Helvetica, Arial, sans-serif" font-size="88" font-weight="600" fill="#f2ece6" letter-spacing="-2.6">pomegranate</text>
    <text x="310" y="370" font-family="monospace" font-size="25" fill="#948a88" letter-spacing="0.5">Victory Andrew Udoh</text>
    <text x="310" y="408" font-family="monospace" font-size="25" fill="#948a88" letter-spacing="0.5">technical writing and project archive</text>
  </svg>`;

  await sharp(Buffer.from(ogSvg))
    .composite([{ input: ogMark, left: 118, top: 250 }])
    .png()
    .toFile('public/brand/og.png');

  console.log('brand assets written');
}

main();
