---
title: Idempotency keys are not optional
date: 2026-10-02
summary: When your payment endpoint gets called twice at 2am, a database transaction is not enough. How to make retries safe without double-charging a customer.
tags: [Payments, NestJS, PostgreSQL]
hero: /writing/idempotency-keys.png
heroAlt: Duplicate payment cards routed through a locked server with one transaction safely replayed
heroCaption: "Generated art for this post. Two arrivals, one logical operation, and a server that remembers."
---

We shipped a wallet that could charge a customer twice, and it took four weeks to find out. Not because the code was careless, but because the code was reasonable. A client retried, the load balancer routed to a different instance, and both instances did exactly what they were told.

The fix was not a better transaction. It was admitting that **the same request can legitimately arrive more than once**, and that the server, not the client, has to decide what counts as the same.

## The retry is not a bug

Every mobile client you will ever ship lives on a network that drops. When a request times out, the client cannot know whether the server processed it. It has two options: give up and let the user complain, or retry and risk a duplicate. Retrying is the right default. Your job is to make retrying safe.

> A timeout is not a failure. It is an unknown, and unknowns have to be designed for.

## A key, a table, one transaction

The mechanism is small. The client generates a unique key per logical operation and sends it on every attempt. The server records that key inside the same transaction that moves the money. If the key already exists, the server returns the stored response instead of doing the work again.

```sql
CREATE TABLE idempotency_keys (
  key           text PRIMARY KEY,
  request_hash  text NOT NULL,
  status_code   int,
  response      jsonb,
  locked_at     timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);
```

Two details carry most of the weight. The `PRIMARY KEY` is what makes the race safe: the second insert fails at the database, not in your application logic, so it holds across every instance behind the load balancer. And `request_hash` is what stops a client from reusing one key for two different operations, which is the failure mode that turns a safety feature into a corruption source.

## Claim before you charge

Insert the key first, with a null response, and commit that. Only then do the work. A second request arriving mid-flight sees a row with no response and returns a conflict instead of charging alongside the first. When the work finishes, you write the response back to the same row.

We stored the key *after* the charge succeeded. Under load, both requests passed the existence check before either wrote, so both charged. The order of those two operations was the entire bug.

A crashed process leaves a key stuck in the claimed state. That is what `locked_at` is for: a sweeper releases rows older than a few minutes, and the retry is safe again because nothing was ever committed under that key.

## What this did not fix

It does nothing for a client that generates a fresh key on every retry. That has to be part of the API contract, and it has to be in the documentation, because a client developer who has not been burned by this will not guess it.

It also does not make a non-idempotent upstream safe. If your payment provider charges on every call, the key protects your database and not their ledger.

Four weeks of investigation for roughly forty lines of code. The retry was always correct. The server just had no memory of it.
