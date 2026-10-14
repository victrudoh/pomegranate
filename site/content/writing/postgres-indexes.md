---
title: Postgres indexes I should have created six months earlier
date: 2026-06-03
summary: Five slow queries from production, what the explain plan said, and the composite index that took each one from hundreds of milliseconds to single digits.
tags: [PostgreSQL, Performance]
hero: /writing/postgres-indexes.png
heroAlt: Abstract vertical bars of varying height in the brand palette
heroCaption: "Generated art for this post. Ordered structure: the shape an index gives to rows."
---

Indexes are cheap to add and expensive to postpone. Every one of these was found the same way: a page that felt slightly wrong, a look at the query log, and a plan that was doing far more work than the result justified.

The pattern across all five was a composite index where a single-column one already existed.

## Read the plan before you guess

`EXPLAIN ANALYZE` shows you what the planner did, not what you assumed it did. In our case the giveaway was a sequential scan on a table that had an index on the filtered column. The index existed and Postgres declined to use it, because the query filtered on two columns and sorted by a third.

A single-column index answers "where id = 5". It does not answer "where merchant_id = 5 and status = 'pending' order by created_at desc", which is what the dashboard actually asked for.

## Column order is the whole design

For a composite index, put the equality columns first and the range or sort column last. Equality columns narrow the scan to a contiguous slice; the sort column then arrives already ordered, which is what removes the sort step from the plan.

```sql
CREATE INDEX CONCURRENTLY idx_tx_merchant_status_created
  ON transactions (merchant_id, status, created_at DESC);
```

`CONCURRENTLY` matters on a live table. Without it the create takes a write lock and your deploy becomes an outage.

## The five

- Transaction list by merchant and status, sorted by date. The dashboard's main table.
- Bookings by user and state, sorted by start time. The single slowest endpoint we had.
- Wallet movements by wallet, sorted by date. The one that made the ledger screen feel broken.
- Listings by city and status, sorted by price. Public search.
- Audit events by actor, sorted by time. Only ever queried during an incident, which is exactly when you cannot afford it being slow.

Total added write cost: negligible at our volume. Total added read benefit: the slowest screen went from roughly 900ms to under 20ms, and I stopped opening the query log out of dread.

> Add the index when you write the query, not when the dashboard starts feeling heavy. The second one is a production incident with a date on it.
