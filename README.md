# pomegranate

Technical writing and a project archive for Victory Andrew Udoh.

| Path | What it is |
| --- | --- |
| `site/` | The deployable Next.js app. See `site/README.md` to run, edit and publish. |
| `prototypes/V8 pomegranate.html` | The design source of truth. One self-contained file, no install. Open it in a browser. |
| `prototypes/archive/` | Superseded prototype versions, kept rather than overwritten. |
| `tools/pdftext.py` | Extracts text from the CV PDFs, which use subset-encoded fonts that generic extractors cannot read. |
| `tools/build-brand.mjs` | Builds the favicon, app icons and social card from one mark definition. |
| `tools/build-project-art.mjs` | Builds the abstract project-card artwork and the hero/portrait panels. |
| `tools/build-post-heroes.mjs` | Builds the hero images for the writing posts. |
| `tools/fetch-fonts.mjs` | Downloads the self-hosted Satoshi files into `site/app/fonts/`. |
| `tools/process-shots.mjs` | Converts captured site screenshots into optimized project card assets. |
| `.notes/` | Local extracted CV text used while drafting site content. Not committed. |
| `.shots/` | Raw captures and intermediate images the build scripts read. Not committed. |

The generator scripts import `sharp`, which lives in `site/node_modules`. Run them from `site/`, or copy them there first.

## Quick start

Open `prototypes/V8 pomegranate.html` to see the design. To run the real app:

```bash
cd site
npm install
npm run dev
```

Full documentation, including how to publish a post, how each image is generated, and before-you-deploy steps, is in `site/README.md`.

## Content status

Eight posts are written. Two are news analysis from October 2026 (the Rust Adobe clones, and God's Eye View); six are engineering essays. All of them are mine to review and correct before publishing, and the news posts in particular carry dated numbers that go stale. Details are in `site/README.md`.
