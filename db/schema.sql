-- Kauaʻi map · collaboration schema (Phase 4)
--
-- The app auto-creates these on first use (see lib/collab/db.ts → ensureSchema),
-- so running this by hand is optional. It's kept here as the source of truth and
-- for provisioning a fresh Neon/Vercel Postgres database in one paste.

-- One row per (spot, device). Holds both the "want to go" flag and the chosen
-- reaction, so a person's whole stance on a spot is a single upsert.
create table if not exists votes (
  poi_id     text        not null,
  device_id  text        not null,
  want       boolean     not null default false,
  reaction   text,
  updated_at timestamptz not null default now(),
  primary key (poi_id, device_id)
);

-- Free-form comment threads, one row per comment.
create table if not exists comments (
  id          text        primary key,   -- client-supplied uuid
  poi_id      text        not null,
  device_id   text        not null,       -- author's device (for "delete mine")
  author_name text        not null,
  body        text        not null,
  created_at  timestamptz not null default now()
);

create index if not exists comments_poi_idx on comments (poi_id, created_at);
