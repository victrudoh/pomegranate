# pomegranate

Technical writing and a project archive for Victory Andrew Udoh.

| Path | What it is |
| --- | --- |
| `site/` | The deployable Next.js app. See `site/README.md` to run, edit and publish. |
| `prototypes/V1 pomegranate.html` | The design source of truth. One self-contained file, no install. Open it in a browser. |
| `prototypes/archive/` | Superseded prototype versions. |
| `tools/pdftext.py` | Extracts text from the CV PDFs, which use subset-encoded fonts that generic extractors cannot read. |
| `.notes/` | Local extracted CV text used while drafting site content. Not committed. |

## Quick start

Open `prototypes/V1 pomegranate.html` to see the design. To run the real app:

```bash
cd site
npm install
npm run dev
```

Full documentation, including how to publish a post and before-you-deploy steps, is in `site/README.md`.
