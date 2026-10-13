/**
 * Normalises captured site screenshots into 16:9 project cards.
 *
 * The raw captures are full-viewport shots at inconsistent widths. This crops
 * each to 16:9 from the top (where the site's identity and hero live), resizes
 * to 1200x675 to match the abstract art panels, and writes JPEG because these
 * are photographic and compress far better that way. The abstract panels stay
 * PNG because flat vector geometry compresses better as PNG.
 *
 * Input:  .shots/<name>.png   (raw captures, plus-width, any height)
 * Output: site/public/projects/<slug>.jpg
 *
 * Usage: node tools/process-shots.mjs   (run from the repo root)
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const IN = '.shots';
const OUT = 'site/public/projects';
const W = 1200;
const H = 675; // 16:9

/** Which capture becomes which project card. */
const SHOTS = [
  { file: 'pxn.png', slug: 'pxn-wallet-pos' },
  { file: 'ibookam.png', slug: 'ibookam' },
  { file: 'plateau.png', slug: 'plateau-state' },
  { file: 'nesco.png', slug: 'nesco-nigeria' },
];

async function main() {
  await mkdir(OUT, { recursive: true });

  for (const shot of SHOTS) {
    const src = `${IN}/${shot.file}`;
    const meta = await sharp(src).metadata();
    const targetRatio = W / H;

    // crop to 16:9 from the top of the viewport
    let cropH = Math.round(meta.width / targetRatio);
    if (cropH > meta.height) cropH = meta.height;
    const cropW = Math.min(meta.width, Math.round(cropH * targetRatio));

    const out = `${OUT}/${shot.slug}.jpg`;
    await sharp(src)
      .extract({
        left: Math.round((meta.width - cropW) / 2),
        top: 0,
        width: cropW,
        height: cropH,
      })
      .resize(W, H, { fit: 'fill' })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(out);

    const size = (await sharp(out).metadata()).size ?? 0;
    const final = (await import('node:fs')).statSync(out).size;
    console.log(
      `${shot.slug}.jpg  ${meta.width}x${meta.height} -> ${W}x${H}  ${(final / 1024).toFixed(0)} KB`,
    );
  }
}

main();
