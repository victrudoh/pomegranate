---
title: The Adobe clones are real, and the moat was thinner than anyone said
date: 2026-10-14
summary: Seven Creative Cloud apps rebuilt from scratch in Rust by one developer and a model. The interesting part is not the price, it is which parts turned out to be hard.
tags: [AI, Open source, Rust]
hero: /writing/adobe-clones-in-rust.jpg
heroAlt: PhotoCraft, an open-source Rust image editor, with Hokusai's The Great Wave open in the canvas and a Curves adjustment layer editing its histogram
heroCaption: PhotoCraft editing Hokusai's The Great Wave off Kanagawa (public domain, Wikimedia Commons), with a Curves adjustment layer open. Screenshot from the project's own README.
---

On 30 September someone started publishing Rust rebuilds of the Adobe suite. By the middle of October there are seven of them, they are open source, and the largest has more stars than most venture-backed developer tools will see in a lifetime.

[PhotoCraft](https://github.com/storytold/photocraft), [VectorCraft](https://github.com/storytold/vectorcraft), [FilmCraft](https://github.com/storytold/filmcraft), [LightCraft](https://github.com/storytold/lightcraft), [PdfCraft](https://github.com/storytold/pdfcraft), [EffectCraft](https://github.com/storytold/effectcraft), [DesignCraft](https://github.com/storytold/designcraft). All from the `storytold` organisation, which the app site calls [ArtCraft](https://getartcraft.com/). All written from scratch in pure Rust.

I came to this through a short video that was doing the rounds, which is credited at the bottom. The video is a good summary of the reaction. It is a poor source for the numbers, and it is where I would start disagreeing with the framing.

## What is actually there

Here is the state of them, pulled from the GitHub API on 14 October 2026 rather than read off a screen:

| Project | Stars | Replaces |
| --- | --- | --- |
| [PhotoCraft](https://github.com/storytold/photocraft) | 58,747 | Photoshop |
| [PdfCraft](https://github.com/storytold/pdfcraft) | 13,009 | Acrobat |
| [FilmCraft](https://github.com/storytold/filmcraft) | 12,731 | Premiere Pro |
| [LightCraft](https://github.com/storytold/lightcraft) | 12,133 | Lightroom |
| [VectorCraft](https://github.com/storytold/vectorcraft) | 8,597 | Illustrator |
| [EffectCraft](https://github.com/storytold/effectcraft) | 6,322 | After Effects |
| [DesignCraft](https://github.com/storytold/designcraft) | 3,758 | InDesign |

Every repo was created on the same day. Every one has been pushed to within the last day. And PhotoCraft's figure will be wrong by the time most people read this, which is the honest reason to put a date next to a number instead of a number in a sentence.

The video cites PhotoCraft at "more than 13,000 stars". That was close to true for about a week. It is 58,747 as I write. Also: it calls the PDF tool "PrintCraft", where the actual repository is **PdfCraft**. Small things, but a video that gets the star count and the name wrong is telling you it did not check, and if it did not check those it did not check the rest either.

## Why I think this is the interesting story of the month

The reaction everywhere has been about price. Creative Cloud Pro is $69.99 a month on the annual plan and the early cancellation terms are genuinely punitive, and the feeling of being locked in by your own habits and file formats is real. But "Adobe is expensive" is not news, and it is not why this matters.

What I find genuinely interesting is that this reframes a question the industry treated as settled. For years the received wisdom was that you cannot practically clone Photoshop. Not because the features are individually hard, but because the moat is everything around them: thirty years of proprietary file format edge cases, a vast plugin ecosystem, colour management that has to be exactly right or a print run is ruined, and a codebase full of behaviour nobody documented and everybody depends on.

The implied claim was that this accumulated pile of detail was worth more than the features themselves. A fortnight, one developer and a coding model produced the shape of seven applications. Not finished applications. But recognisable ones, which was supposed to be the hard part.

That tells me the pile was thinner than the industry told itself, and that is worth knowing regardless of how any of these projects turn out.

## What I want to watch next

I am not treating this as a settled verdict, because it is not one. What I actually want to see is two things.

**How far they get.** FilmCraft's own roadmap puts it around 50 to 60 percent ready for real work. The features that remain are the ones that decide whether a tool is a toy, and they are exactly the ones I would have predicted:

- **File fidelity.** Can it open what it claims, round-trip without loss, and hand the file back to the original application intact? This is where clones historically die.
- **Colour correctness.** ICC handling, wide gamut, soft proofing. Wrong here is worse than absent, because it fails silently and you find out at the printer.
- **Performance at scale.** Layers, masking and large canvases under GPU compositing. The demo is a photograph. The job is a 900 megabyte document someone has lived in for a month.
- **Determinism.** The same input, the same output, every time. A professional cannot build a workflow on rendering that varies between runs.

**What Adobe does about it.** This is the half nobody is discussing, and honestly the more revealing one. The possible responses are quite different: ignore it and let it stay a hobbyist curiosity, compete on price and terms, litigate, or lean into the parts a clone cannot replicate, which is collaboration, asset libraries, fonts and the workflow glue around the apps. Adobe has not sued. Nobody has been served, and "Adobe and Anthropic will end up in court" is a guess dressed as analysis. Reverse-engineering for interoperability has a long and reasonably well-protected history.

My read is that the pricing is the exposed flank, not the code.

## Why Rust, and why it matters to me

Not because Rust is fashionable. This is the workload it was built for: hot loops over large buffers with a lot of pointer chasing, which is the classic source of the memory bugs that make image editors fall over on a big document. Rust removes a category of that at compile time.

It also compiles to WebAssembly, which is why every one of these has a plausible route to the browser. The ArtCraft site already lists macOS, Windows and Web as targets. If your editor runs in a tab, installing stops being a step in the funnel, and that changes who can use the tool at all.

## The test I would actually apply

I build on other people's software constantly, so my own rule is simple: open a real project file, edit it, save it, then open that same file in the original application. If it survives, the tool is a tool. If it does not, it is a demo, however many stars it has.

And a reminder that attention is not correctness. Star counts measure curiosity. A clean-room rebuild is a strong legal posture and a hard thing to verify from outside, so treat the framing on trust rather than as proven fact. The most useful number in this whole story is still the 50 to 60 percent FilmCraft published about itself.

## Sources

**Where I found it**

- The video that started this: [Runtime Caffeine on YouTube](https://youtube.com/shorts/RwMJSW0OcwY). Treat the star counts in it as out of date; the repos below are the source.

**The projects**

- [ArtCraft](https://getartcraft.com/), the organisation building them, and [all the apps](https://getartcraft.com/apps)
- [PhotoCraft](https://github.com/storytold/photocraft) · [VectorCraft](https://github.com/storytold/vectorcraft) · [FilmCraft](https://github.com/storytold/filmcraft) · [LightCraft](https://github.com/storytold/lightcraft) · [PdfCraft](https://github.com/storytold/pdfcraft) · [EffectCraft](https://github.com/storytold/effectcraft) · [DesignCraft](https://github.com/storytold/designcraft)
- [FilmCraft's roadmap](https://github.com/storytold/filmcraft/blob/main/ROADMAP.md), the source of the 50 to 60 percent figure

**Background**

- [Adobe's subscription and cancellation terms](https://www.adobe.com/legal/subscription-terms.html), for the actual cancellation language rather than the summary
- [Adobe Creative Cloud plans and pricing](https://www.adobe.com/creativecloud/plans.html)
