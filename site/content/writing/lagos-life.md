---
title: Lagos Life is a game about Nigerian hustle, and the build is the real story
date: 2026-10-15
summary: A Sims-style life sim set in Lagos went from a Wednesday night side project to a million players in three days. The game is fun. Who gets to ship software now is the more interesting part.
tags: [AI, Product, Nigeria]
hero: /writing/lagos-life.jpg
heroAlt: The Lagos Life landing screen, showing a stylised map of Lagos with labelled locations including Amala Shitta, Quilox, Freedom Park and Elegushi, and a banner reading 35k Lagosians playing right now
heroCaption: The Lagos Life map. Mainland and Island, with the places the game expects you to already know. Image from the game's own site.
---

I have been playing [Lagos Life](https://lagoslife.eliysites.com) for a few days, and the honest verdict first: it is fun. Not "impressive for a side project" fun. Actually fun, in the way The Sims was fun, where you lose an evening to optimising a fictional person's rent.

But the game is not the most interesting thing here. The build is, and so is what its reception reveals about who gets to ship software right now.

## What it actually is

A browser-based life simulation set in Lagos. You make a character, get a job, earn virtual naira, pay rent, eat, socialise, and try to keep your head above water.

The detail that makes it work is the class assignment. You start as either **Nepo** or **Lapo**. Nepo, from "nepo baby", means you begin with money and connections. Lapo, a nod to LAPO Microfinance Bank, means you begin with very little and the only way forward is small loans and side income.

That is a joke, and it is also the entire thesis of the game. It is not a Lagos-themed skin over a generic life sim, which is what most localised games turn out to be. It is built around the actual mechanics of surviving Lagos: working costs energy, eating costs money, income arrives slower than expenses compound, and the starting point someone is handed shapes everything that follows. Anyone who has lived it will recognise the systems immediately.

It also gets the texture right. Amala Shitta and Quilox are real places and the game assumes you already know why they matter. That is the difference between localisation and recognition.

## An eight-hour build, after eight years of work

The creator is **Shalom Rayhamen**, a UK-based Nigerian software engineer, 26, who builds under the name Eliy.

Her path is the part worth pausing on, because the word "overnight" is doing a lot of work in most coverage of this. She learned to code in Abia on a Chromebook her mother bought her, at a time when her family could not always afford school fees for both her and her brother, and worked from tech hubs for the free electricity and Wi-Fi. Her first paid job, in 2020, was ₦60k for building a front end. A stranger found her through Facebook posts about teaching kids to code, and that introduction led to the remote work that eventually supported a UK Global Talent Visa.

So when people describe this as an overnight success, they are reading the graph wrong. It is eight years of compounding, and one night when the compounding paid out.

The build itself: she started on a Wednesday night intending to spend an hour or two, and finished at about 5 a.m. Roughly eight hours. She posted the link at 7 a.m. and went to sleep. By the time she woke at 10 a.m. it was trending with over 10,000 plays.

She has said the idea came from growing up on The Sims 3 and feeling it was not localised enough, and that seeing another Nigerian developer's danfo-driving game [Lagos Run](https://urbangeekz.com/2026/10/two-nigerian-developers-create-viral-lagos-inspired-games-using-ai) go viral is what pushed her to build hers. There is a small, human detail in her account worth repeating: the motivation was the fear of being the person who had the idea first and watched someone else ship it.

## The numbers, with the caveat they need

The growth was unusual enough that the figures are worth writing down carefully. Most come from the game's own dashboard and none have been independently audited.

| Measure | Figure | When |
| --- | --- | --- |
| Launch | 1 October 2026 | Nigeria's Independence Day |
| Players | 1 million in 3 days | within the first week |
| Peak concurrent | 100,000+ | first week |
| Revenue | ~$46,900 | first 4 days |
| Pre-seed | $500,000 | about a week after launch |

For scale on that first row: Instagram took roughly two and a half months to reach a million users, Facebook about ten, and Netflix around three and a half years. That comparison says less about the game's polish than about how thoroughly a browser link collapses the old distribution timeline.

The funding is the detail that makes this more than a viral moment. The round closed in a single day, with participation including Flutterwave's Olugbenga Agboola through Resilience17. In Nigeria's venture market, a one-day close is close to unheard of.

The honest caveat: the game does not publicly define what counts as a "player", so a million is not the same as a million retained users. Treat the figures as directional rather than audited.

## Revenue came from virtual real estate

Worth noting because it is a more interesting model than the usual one.

She started by selling in-game naira bundles at ₦500, ₦1,000 and ₦2,000, and added ₦10,000 and ₦20,000 tiers after players asked for them. But she has been explicit that those top-ups are the least profitable part.

The actual business turned out to be **billboards and plots inside the city**. Companies began approaching her about two days after launch, asking to advertise in-game, and demand outstripped the available space fast enough that she had to expand the world to fit more. There is also music promotion in the virtual clubs like Quilox.

That is a small but real insight: the audience was valuable enough that businesses wanted to reach it inside the fiction, which is a different proposition from running ads beside it.

## The week after, which is the actual engineering

The story nobody tells about a viral product is the week after. Hers included two failures worth naming.

**She is still the only coder.** She has said scaling has been the hardest part, and that she has had to rush in fixes when the game lagged under load.

**One bug wiped out every player's money.** She added an anti-corruption feature, a scripting error fired, and every account's funds were reset. She reset the tampered balances, restored the legitimate ones, and apologised. People were angry, and she understood why: for a lot of players this is an escape, and for a moment the escape was broken.

The interesting engineering question about Lagos Life is therefore not how it was generated. It is whether a single developer can keep a real-time, multi-user, stateful economy coherent while it grows this fast, and what happens to the players when the answer is no. Very few products ever find out this early.

## What it says about building now

Rayhamen has been open that she leans heavily on AI through development, and that she now uses AI agents to catch bugs and triage feature requests. She is measured about it in a way that is more useful than the hype: her own advice is that you do not need AI to make something from scratch, but that it is good at improving what you already have, and that talent is what AI multiplies.

That framing is the part I would keep. The interesting shift is not that a model can write code. It is that the iteration loop has compressed enough that a feature can be added the same night it is requested, by one person, in public, at a hundred thousand concurrent users.

It is also, plainly, an encouraging thing to watch. Nigerians building consumer software that the world pays attention to is not something there is much of to point at, and this is a woman who taught herself to code on a borrowed Chromebook and shipped a game in eight hours that beat Instagram's first million by about two and a half months.

I had fun playing it, and I am looking forward to seeing which direction it goes next. She has said expansion to other African countries is coming, and given that Abuja and Port Harcourt already exist in the world, I believe her.

## Sources

**The game**

- [Lagos Life](https://lagoslife.eliysites.com)

**Interviews and reporting**

- [How Shalom Rayhamen built her career, and Lagos Life](https://www.zikoko.com/money/lagos-life-is-going-to-retire-me), her own account in Zikoko, including the eight-hour build and the revenue breakdown
- [Nigerian game recreating everyday Lagos life goes viral](https://punchng.com/nigerian-game-recreating-everyday-lagos-life-goes-viral), Punch, on the player figures and the Lapo/Nepo split
- [Ten things to know about the viral Lagos Life game](https://www.vanguardngr.com/2026/10/10-things-to-know-about-the-viral-lagos-life-game), Vanguard, on the advertising model and the 18+ rating
- [Two Nigerian developers create viral Lagos-inspired games using AI](https://urbangeekz.com/2026/10/two-nigerian-developers-create-viral-lagos-inspired-games-using-ai), UrbanGeekz, on Lagos Run and the funding round

*Player and revenue figures come from the game's own dashboard and have not been independently audited.*
