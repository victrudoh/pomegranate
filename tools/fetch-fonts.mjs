/**
 * Downloads the Satoshi webfont files into site/app/fonts/.
 *
 * They are committed rather than fetched at runtime, so the site makes no
 * third-party request on first paint. This script exists so the provenance of
 * those binaries is reproducible instead of a mystery: run it and the files are
 * re-fetched from Fontshare at the recorded weights.
 *
 * Note: the Fontshare API lists file URLs WITHOUT an extension. Appending
 * `.woff2` is required, and omitting it returns a 404 from their CDN, which is
 * an easy hour to lose.
 *
 * Licence: Satoshi is free for personal use from Fontshare (Indian Type Foundry).
 * For commercial use, buy the licence or switch to an SIL Open Font License face
 * (Geist and Outfit are both OFL and available via next/font/google).
 *
 * Usage: node tools/fetch-fonts.mjs   (run from the repo root)
 */
import { mkdir, writeFile } from 'node:fs/promises';

const OUT = 'site/app/fonts';

const WEIGHTS = [
  { weight: 400, file: 'Satoshi-Regular.woff2', weight_name: 'Regular' },
  { weight: 500, file: 'Satoshi-Medium.woff2', weight_name: 'Medium' },
  { weight: 700, file: 'Satoshi-Bold.woff2', weight_name: 'Bold' },
];

async function main() {
  await mkdir(OUT, { recursive: true });

  // ask Fontshare's CSS endpoint for the current URLs rather than hardcoding
  // paths, which have changed before
  const cssRes = await fetch('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');
  const css = await cssRes.text();

  let done = 0;
  for (const { weight, file } of WEIGHTS) {
    // pull the matching @font-face block, then its woff2 url
    const block = new RegExp(
      String.raw`@font-face\s*\{[^}]*font-weight:\s*${weight}\s*;[^}]*\}`,
      's',
    ).exec(css);
    if (!block) {
      console.log(`  skip ${weight}: no @font-face for that weight`);
      continue;
    }
    // Fontshare serves protocol-relative urls (//cdn.fontshare.com/...), so the
    // match has to accept an optional scheme and we prefix https ourselves.
    const urlMatch = /url\(['"]?((?:https:)?\/\/[^'")]+\.woff2)/.exec(block[0]);
    if (!urlMatch) {
      console.log(`  skip ${weight}: no woff2 url`);
      continue;
    }

    const absolute = urlMatch[1].startsWith('http') ? urlMatch[1] : `https:${urlMatch[1]}`;
    const res = await fetch(absolute);
    if (!res.ok) {
      console.log(`  FAIL ${weight}: HTTP ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());

    // a real woff2 starts with the magic bytes `wOF2`
    const magic = buf.subarray(0, 4).toString('latin1');
    if (magic !== 'wOF2') {
      console.log(`  FAIL ${weight}: not a woff2 (magic ${magic})`);
      continue;
    }

    await writeFile(`${OUT}/${file}`, buf);
    console.log(`  ${file}  ${(buf.length / 1024).toFixed(0)} KB`);
    done++;
  }

  console.log(`\n${done}/${WEIGHTS.length} written to ${OUT}/`);
  if (done < WEIGHTS.length) process.exitCode = 1;
}

main();
