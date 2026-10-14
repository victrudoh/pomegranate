---
title: The government website that had to work on a 3G phone
date: 2026-07-14
summary: Plateau State's public site does not have the luxury of assuming bandwidth. What load budgets, image discipline and progressive enhancement actually looked like.
tags: [Performance, Accessibility]
hero: /writing/public-sector-performance.png
heroAlt: Abstract node and edge graph in the brand palette
heroCaption: "Generated art for this post. A page on a slow connection: sparse, and taking its time to arrive."
---

A state government website has a user base you cannot negotiate with. Somebody checking a public notice is doing it on a mid-range Android phone, on a network that drops, possibly paying for the data. Every design decision downstream of that fact is different from a product site.

## Measure the site the way they will load it

The single most useful thing we did was load the site on a throttled connection on a real device, in a real browser, early. Not a lab score. The actual thing.

The first version was not catastrophically heavy. It was 1.9MB, which on a good connection is nothing and on a bad one is a long blank rectangle. Most of that weight was photographs of buildings. Images are almost always the answer to "why is this slow", and they are the least controversial thing to fix.

## What actually moved the number

- Images served at the size they render, in a modern format, with width and height declared so the page does not jump while loading.
- A total budget for the initial load, written down, treated as a constraint rather than a target.
- No critical content behind client-side JavaScript. The notice and the contact details were in the HTML the server sent.
- Fonts from the system stack. A government site does not need a bespoke typeface badly enough to block its own text.

## Progressive enhancement is not nostalgia

It is easier to argue for now than it was five years ago, because the same discipline that survives a bad network also survives a slow device and a botched script load. Pages that work before JavaScript runs are pages that cannot be broken by a JavaScript error.

> Build the site so it works in the worst conditions you can name, then improve it for the good ones. The other order never gets revisited.

## The honest caveat

Accessibility and weight were requirements from the client, not preferences we smuggled in. When a stakeholder asks for a hero video on the homepage of a site whose users are on metered data, the answer has to come from the brief, not from the developer's taste. Getting that constraint agreed in writing before the design review is most of the battle.
