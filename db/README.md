# Collaboration backend (Phase 4)

Votes, reactions, and comments. **No auth** — identity is an anonymous
`device_id` (a UUID in `localStorage`), used only to enforce one vote per device
and to let you delete your own comment.

## Two backends, one interface

`lib/collab/db.ts` picks a backend at runtime:

| Condition                         | Backend            | Notes                                   |
| --------------------------------- | ------------------ | --------------------------------------- |
| `DATABASE_URL` / `POSTGRES_URL` set | **Neon Postgres**  | Production. Tables auto-created on boot. |
| neither set                       | **JSON file**      | Local dev only → `.data/collab.json` (gitignored). Never on Vercel (read-only FS). |

This means the whole feature runs locally with **no database** — vote/comment
against the file store, then flip on Postgres for the shared, deployed version
with zero code changes.

## Provisioning Neon (the shared, real version)

1. In the Vercel dashboard for this project → **Storage** → create a **Neon**
   Postgres database (Marketplace). Vercel injects `DATABASE_URL` (+ friends)
   into the project's env automatically.
2. For local use against that same DB, pull the vars: `vercel env pull .env.local`
   (`.env*` is gitignored).
3. Tables self-create on first request. To pre-create or inspect, paste
   [`schema.sql`](./schema.sql) into the Neon SQL editor.

Nothing else changes — the Server Actions in `app/actions.ts` and the data layer
are backend-agnostic.
