---
title: What God's Eye View actually shows you, and why the coverage gaps matter
date: 2026-10-14
summary: A globe that fuses live aircraft, ships, cameras and satellites into one browser window. The engineering is genuinely beautiful. I am less sure we are ready for what it normalises.
tags: [Geospatial, Open source, Data]
hero: /writing/gods-eye-view.jpg
heroAlt: God's Eye View running over Heathrow, with a data layer panel listing live flights, military flights, earthquakes, satellites, ships, CCTV feeds and radio
heroCaption: God's Eye View over Heathrow. Every layer in that left panel is a separate public dataset, fused into one view. Image from the project's own repository.
---

There is a browser application that puts live aircraft, ships, traffic cameras, satellites and earthquakes onto one photorealistic 3D globe, and it works without signing up for anything. It hit number one on GitHub Trending. [God's Eye View](https://github.com/bilawalsidhu/gods-eye-view) is by Bilawal Sidhu, sits at 55,817 stars as I write, and describes itself honestly: *a spy satellite simulator in your browser, except the data is real.*

I like this thing. I also think it is a good example of a tool that is more consequential than its own framing admits, and I want to be precise about why rather than either gushing or clutching pearls.

## First: nothing here is a secret

The first thing to get straight, because the memes get it wrong, is that this does not show you anything classified. It fuses sources that are already public, already free, and in several cases already being collected by hobbyists.

The aircraft come from the OpenSky Network, with adsb.lol as a fallback. Ships come from AISStream. Earthquakes come from USGS. Road geometry for traffic comes from OpenStreetMap's Overpass API, with TomTom as an optional live layer. Satellites come from CelesTrak, which publishes the same two-line orbital elements anybody with a tracking setup already uses. The CCTV feeds are city open data: Austin, Caltrans in California, and Transport for London's JamCams.

The cleverness is not in obtaining any one of these. Every source is documented and free to query. The cleverness is fusion and rendering: normalising a dozen incompatible feeds into one consistent coordinate space and time reference, then drawing it fast enough that panning the globe does not fall apart.

I have integrated enough APIs to know that the second half is where the months go. Making twelve sources agree on what "now" means is the actual engineering, and it is the part that deserves the applause.

## The part the clips leave out: it goes blind in ways that matter

This is the section I would want anybody to read before they form an opinion from a 60 second clip.

- **Aircraft coverage is uneven and political.** Dense over North America and Europe, thinning badly over oceans, Africa, and large parts of Asia. ADS-B needs a receiver within range, and the receiver network exists wherever hobbyists happen to live.
- **Absence is not evidence.** This is the one I care about most. A ship that leaves the map may simply have turned off its transponder, which is legal in some waters and common in others. A flight that does not appear may be a gap in coverage rather than a secret mission. The tool shows you what has been published. It cannot show you what has not.
- **Cameras are whatever the city chose to publish.** Austin and London are covered because those authorities publish. Most cities are invisible, and that is a policy decision, not a technical limit.

So the correct mental model is an index of what is published, not a survey of what exists. Everything it displays is real. The danger is the inverse inference, and the interface does not protect you from making it, because a dark patch of ocean looks a lot like an empty one.

## The part that actually worries me

The user who asked me to write this put it better than I would have: they love how it operates and they are worried about how society adapts to it. That is the right worry, so let me be specific about what I think the risks are, separated into ones I think are real and ones I think are overstated.

**Overstated: that this hands anybody new power.** Everything here was already public and already queryable. The state-level capability it imitates has been in place for decades. What is new is not access to the data, it is the cost of combining it, and the cost has gone from a specialist team to a weekend.

**Real, and I think underrated: the training of attention.** When surveillance is a beautiful product with a film-style interface, and a HUD that says TOP SECRET, watching becomes a normal thing to do with an evening. Nobody has to authorise that. It happens by default as the friction falls. A capability that requires effort to reach has a natural limiter. A capability that is one click and gorgeous does not.

**Real: watching is one-directional.** People like that this holds institutions accountable. Aircraft, vessels, and government activity on open feeds is a legitimate public interest story, and I do not want to lose that. But the same machinery points the other way with no friction at all. A crowd that can follow a plane can follow a person, and the difference between tracking a ship and tracking somebody's commute is a few API calls, not a design boundary. The tool itself is even-handed. The attention it attracts will not be.

**Real, and creeping: inference is now trivially cheap.** Combining flight paths, camera locations, and road geometry lets somebody reconstruct events that were never published in combined form. Each dataset was released in isolation by people who reasonably assumed nobody would bother fusing them. That assumption is gone, and it will not come back.

## What I would want to see happen

I am not arguing the project should not exist. I would rather have this capability in the open, documented, and inspectable than as a private contract between a vendor and a government, and the licence documentation I will get to is genuinely a model worth copying. But "the cat is out of the bag" is not a plan.

Three things would make me less uneasy about the direction.

1. **Friction that is honest rather than fake.** Easy to start, explicit about what is uncertain. Marking low-coverage areas as low coverage, rather than drawing them the same as confirmed-empty, is a small and real integrity measure. The project partly does this already with in-app data attribution. Extending that to confidence is the same instinct applied to the harder question.
2. **Written-down norms for personal-scale tracking.** Nobody is going to enforce them on an open tool. But somebody publishing this has a chance to say plainly where they would stop, and I would rather that statement exist and be argued with than be absent.
3. **Serious people thinking about the aggregate.** Not just whether a dataset is legal, but what happens when a dozen legal datasets are combined by anyone with a laptop. The project's own licensing documentation is an unusually good model for the first half. The second half is unsolved, and it is unsolved industry-wide, not just here.

## Where the project is genuinely excellent

I want to give real credit, because two parts of this are better than most commercial products at the same stage.

**Its handling of other people's licences.** The code is MIT. The data is not, and the project is unusually direct about the distinction: the MIT grant covers the source code and explicitly does not extend to third-party data. Some of that data is non-commercial. TeleGeography, bundled for the physical internet layer, is CC BY-NC-SA, so it ships in a clearly marked carve-out folder with instructions for commercial users to delete or license it. OpenSky's primary flight feed is under a non-commercial research licence. Google News headlines in the cockpit view are restricted to personal, noncommercial use.

They did not quietly drop the awkward datasets, which would have made the demo worse. They included them, scoped them, and documented the boundary. That is the right shape for a project standing on other people's licences, and it is the opposite of how most integrations handle it. Institutions cannot adopt a tool unless they know what they are allowed to do with it, and somebody here did that work in advance.

**Voice control of a spatial scene.** Speaking a location and having the globe fly there sounds like a gimmick. It is not. If you have ever tried to navigate a globe with a trackpad, you know how much friction sits between wanting to see a place and being there. Language is the correct interface for spatial navigation and I expect this pattern to be everywhere within two years.

## Practical notes if you want to try it

There is a one-click installer through [Pinokio](https://pinokio.co/apps/github-com-bilawalsidhu-gods-eye-view), and a coding-agent setup prompt for people who would rather have an assistant do the work. The default experience runs keyless, which is the right default: you see it working before you are asked for a credit card.

Photorealistic 3D tiles need a key. Google's own tiles are cheap or free at hobby volume but want billing configured; Cesium offers a community tier covering the same 3D tiles for personal and non-commercial use, which is the sensible route for most people who just want to look. Either way, keep the keys local. The setup prompt explicitly tells the agent not to ask you to paste keys into a chat, which is a small detail and good practice.

## Sources

**Where I found it**

- [God's Eye View blew up, here's what you can do with it](https://youtu.be/o_FJ1NIH9yw), Bilawal Sidhu's own walkthrough on YouTube

**The project**

- [God's Eye View on GitHub](https://github.com/bilawalsidhu/gods-eye-view)
- [Data sources and attribution](https://github.com/bilawalsidhu/gods-eye-view/blob/main/DATA_SOURCES.md), the licence detail I lean on above
- [One-click installer via Pinokio](https://pinokio.co/apps/github-com-bilawalsidhu-gods-eye-view) · [Pinokio desktop](https://desktop.pinokio.co/)
- [Spatial Intelligence](https://spatialintelligence.ai), the author's newsletter

**Underlying data providers**

- [OpenSky Network](https://opensky-network.org/) for aircraft · [adsb.lol](https://adsb.lol/) for military flights and traces
- [AISStream](https://aisstream.io/) for vessels · [CelesTrak](https://celestrak.org/) for satellite elements
- [USGS earthquakes](https://earthquake.usgs.gov/) · [OpenStreetMap](https://www.openstreetmap.org/) via Overpass
- [Transport for London JamCams](https://tfl.gov.uk/info-for/open-data-users/) · [City of Austin open data](https://data.austintexas.gov/)
