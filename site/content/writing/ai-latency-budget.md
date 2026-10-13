---
title: AI features fail on latency, not on intelligence
date: 2026-05-21
summary: Discount Hub taught me that users forgive a wrong answer faster than a slow one. Designing an AI-assisted product around the 400ms expectation.
tags: [AI, Product]
---

The first version of the recommendation feature was good. The suggestions were relevant, the ranking was sensible, and users ignored it.

The reason was not quality. It was that the answer arrived 2.4 seconds after the moment it could have been useful. By then the user had already scrolled past the decision, and a correct suggestion delivered late reads as an interruption rather than help.

## The budget is a design decision

Once we measured it, the feature had an obvious shape: there was a latency budget, and anything that could not be produced inside it did not ship, however clever it was. Ours settled around 400ms for the inline case, because that is roughly where a suggestion still feels like part of the interaction instead of a response to it.

That single number killed more roadmap items than any technical objection, and it was correct to kill them.

## What fit inside the budget

- Precomputed candidates, ranked cheaply at request time, instead of ranking the full catalogue.
- A suggestion that degrades: if the model call is slow, show the rule-based result rather than a spinner.
- No suggestion at all when the budget is blown. An empty slot is better than a late one.

The last point caused the longest argument. Showing nothing feels like a missing feature. Showing something late is a worse experience, and it is the one users actually remember.

> A slow answer is not a slower version of a good answer. It is a different, worse answer.

## The general lesson

Intelligence is the easy part now. The constraint that decides whether an AI feature works is the same constraint that decides every other interface question: how long the user is willing to wait, and what they are doing while they wait. Model quality sets the ceiling. Latency sets whether anyone ever sees the ceiling.
