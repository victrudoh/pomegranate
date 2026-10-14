---
title: Portals, wallets, and the ledger problem nobody hands you
date: 2026-09-18
summary: Building a wallet UI is easy. Reconciling it against a transaction log with a pending state is where every property platform quietly loses money.
tags: [Fintech, React]
hero: /writing/wallets-and-ledgers.png
heroAlt: Wallet and transaction ledger reconciling money flows between tenants, landlords, banks and property nodes
heroCaption: Generated art for this post. The interface is easy; the ledger is where the truth has to balance.
---

A wallet interface takes an afternoon. Two numbers, a currency symbol, a list of movements underneath. Every demo I have seen of one looks finished, and almost none of them are.

The part that is not in the demo is the moment a transaction is neither done nor failed.

## Pending is a real state, not a spinner

On a property platform, money moves between a tenant, a landlord, a wallet and a bank. Several of those legs are asynchronous. For the seconds or hours in between, the only honest thing the interface can say is that the outcome is not yet known.

Teams hide that state with a spinner, then discover the following month that tenants paid twice, because a user who cannot tell whether something worked will try again.

## The rule we settled on

The balance a user sees and the balance the ledger believes should be the same number, derived the same way, in the same place. If the interface computes a total by summing a list of movements, you have two implementations of your accounting logic and they will disagree.

So the server returns the authoritative balance, plus the movements. The client never adds up money. It formats what it was told.

> If your frontend can compute a balance, you have two ledgers and a disagreement scheduled.

## What this changes in practice

- Every movement carries a state the UI has words for: pending, settled, failed, reversed.
- A pending movement reduces available balance, so the interface stops promising money that is in flight.
- Failed is not the same as reversed, and the UI says which happened, because users escalate differently for each.

None of this is novel accounting. It is just the part that gets skipped when the demo looks finished.
