---
title: Stop fetching in a useEffect and calling it architecture
date: 2026-08-29
summary: React Query replaced half of our state management and quietly caused the other half. A concrete pattern for separating server state from UI state in a large dashboard.
tags: [React, State, Performance]
hero: /writing/react-query-and-state.png
heroAlt: Abstract concentric arcs radiating from one centre, in the brand palette
heroCaption: Generated art for this post. One source of truth with more than one thing reading from it.
---

We adopted React Query to delete a pile of loading booleans, and for two months it looked like a clean win. Then the dashboard grew a filter bar, and we discovered we had simply moved the problem.

The bug that taught me the difference was a filter that reset itself. A user picked a date range, the data refetched, and the selection jumped back to default. Nothing was broken. Two pieces of state were fighting over who owned the same truth.

## Server state and UI state are different things

Server state is data you do not own. It is a cache of somebody else's database, it can be stale, and it will be refetched whether or not you asked. UI state is data only this screen knows about: which tab is open, what the user has typed, whether a panel is expanded.

The failure mode is letting one stand in for the other. A filter stored in the cache key looks elegant until you want to clear it without losing the data. A selection stored in component state looks obvious until a refetch briefly returns an empty list and the selection resets.

## The pattern that held up

One owner per value, chosen by asking who has to know it:

- **URL** for anything the user would expect to share, bookmark or reload into: page, filters, sort, search.
- **React Query** for anything that came from the server, including loading and error states.
- **Component state** for the rest, and if the rest is growing past a handful of values, that is a signal the screen should be split.

The filter bug disappeared the day the filter moved into the URL. It was never a caching problem. We had been storing the user's intent in a place designed to evict it.

> The cache is not a feature store. It is a mirror of somebody else's database, and it is allowed to change without telling you.

## What it cost

More `useSearchParams` and less `useState`. A screen that survives a hard refresh with the exact view the user had, which is also what makes the filter shareable in a support thread. And far fewer components that secretly own a piece of the URL's job.
