# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the `supabase/` directory. The Supabase CLI is installed locally via npm — use `npx supabase` or `node_modules/.bin/supabase`:

```bash
npx supabase login                   # authenticate with Supabase
npx supabase link --project-ref zdvdqialhtghbbjvqdol  # re-link to the remote project
npx supabase db push                 # push local migrations to remote
npx supabase db pull                 # pull remote schema into local migrations
npx supabase db diff                 # diff local vs remote schema
npx supabase db reset                # reset local DB and re-apply all migrations
npx supabase gen types typescript    # generate TypeScript types from schema
npx supabase status                  # show linked project info
```

## Project Link

- **Remote project:** `zdvdqialhtghbbjvqdol` (ReOrderly Order Tracking Application)
- **Org:** `yewgxqadecpeggyxhjul`
- **Pooler URL:** `postgresql://postgres.zdvdqialhtghbbjvqdol@aws-1-us-east-2.pooler.supabase.com:5432/postgres`
- **PostgreSQL version:** 17.6

## Architecture

This directory is the back-end reference for the Reorderly app. **The client app (`client/`) currently uses localStorage only — Supabase is not yet wired in.** This directory holds the schema design for the planned migration.

```
supabase/
  reference/
    testing_schema.sql   # canonical DB schema (source of truth for table design)
    user_journey.md      # UX flow document
    db_img.webp          # ERD diagram
  supabase/
    .temp/               # CLI state: linked project ref, pooler URL, versions
  package.json           # supabase CLI as devDependency
```

## Schema

Four tables — all CASCADE-deletes flow from `users` down:

| Table | PK type | Notes |
|---|---|---|
| `users` | UUID | `user_name` and `email` are unique; `role` defaults to `'member'` |
| `orders` | VARCHAR(255) | Human-readable order number shown to users; FK → `users(id)` |
| `order_items` | UUID | Line items per order; FK → `orders(id)` |
| `delivery_schedules` | UUID | One schedule per order; tracks frequency, count, and next expected date; FK → `orders(id)` |

Key design decisions in `testing_schema.sql`:
- `orders.id` is a VARCHAR (not UUID) — it's the user-facing order number
- `delivery_schedules.last_delivery_date` is nullable in intent (set to NOT NULL in schema but should be revisited — it's blank until first delivery)
- `users.password` stores a hashed value; never store plaintext

## Migration Path (localStorage → Supabase)

The client's data layer is in `client/src/data/` (`userStore.js`, `orderStore.js`). When wiring Supabase:
1. The flat order object in `orderStore.js` maps to three tables: `orders` + `order_items` + `delivery_schedules`
2. Auth should migrate from the custom SHA-256 hash in `src/utils/hashPassword.js` to Supabase Auth (GoTrue)
3. RLS policies will need to enforce per-user data isolation — no admin role in the current app design
