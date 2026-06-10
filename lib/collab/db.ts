// Server-only data layer for the collaboration features.
//
// Two interchangeable backends behind one set of functions:
//   • Postgres (Neon)  — used in production / whenever DATABASE_URL is set.
//   • JSON file        — local-dev fallback so the whole feature is testable
//                        with no external service. NEVER runs on Vercel (its
//                        filesystem is read-only and DATABASE_URL is set there).
//
// This module touches `node:fs` and the database, so it must only ever be
// imported from server code (it's pulled in by app/actions.ts, which is
// `"use server"`). Don't import it into a client component.

import { promises as fs } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import type { Board, CommentRow, PoiStats, MyState } from "./types";

const CONN = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
const USE_PG = CONN.length > 0;

// Shapes the SQL columns resolve to. The neon driver returns untyped
// `Record<string, any>[]`, so we await first and cast the array (legal: each of
// these is assignable to Record) rather than casting the query promise.
type VoteAggRow = {
  poi_id: string;
  device_id: string;
  want: boolean;
  reaction: string | null;
};
type CommentCountRow = { poi_id: string; n: number };
type CommentSelectRow = {
  id: string;
  author_name: string;
  body: string;
  device_id: string;
  created_at: string | number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Postgres (Neon) backend
// ─────────────────────────────────────────────────────────────────────────────

// `neon()` returns a tagged-template query function backed by HTTP — no pool to
// manage, which is exactly what serverless functions want.
const sql = USE_PG ? neon(CONN) : null;

// Create tables on first use. Module-level state survives within a warm
// instance; `if not exists` keeps it safe if a cold instance re-runs it.
let ready: Promise<void> | null = null;
function ensureSchema(): Promise<void> {
  if (!sql) return Promise.resolve();
  if (!ready) {
    ready = (async () => {
      await sql`
        create table if not exists votes (
          poi_id     text        not null,
          device_id  text        not null,
          want       boolean     not null default false,
          reaction   text,
          updated_at timestamptz not null default now(),
          primary key (poi_id, device_id)
        )`;
      await sql`
        create table if not exists comments (
          id          text        primary key,
          poi_id      text        not null,
          device_id   text        not null,
          author_name text        not null,
          body        text        not null,
          created_at  timestamptz not null default now()
        )`;
      await sql`create index if not exists comments_poi_idx on comments (poi_id, created_at)`;
    })();
  }
  return ready;
}

// ─────────────────────────────────────────────────────────────────────────────
// File backend (local dev)
// ─────────────────────────────────────────────────────────────────────────────

interface VoteRow {
  want: boolean;
  reaction: string | null;
}
interface StoredComment {
  id: string;
  poiId: string;
  deviceId: string;
  author: string;
  body: string;
  createdAt: number;
}
interface FileShape {
  votes: Record<string, Record<string, VoteRow>>; // poiId → deviceId → row
  comments: StoredComment[];
}

const FILE = path.join(process.cwd(), ".data", "collab.json");

// Serialize all file access through one promise chain so concurrent server
// actions in the single dev process can't clobber each other's writes.
let queue: Promise<unknown> = Promise.resolve();
function withFile<T>(fn: (data: FileShape) => Promise<T> | T): Promise<T> {
  const run = queue.then(async () => {
    let data: FileShape;
    try {
      data = JSON.parse(await fs.readFile(FILE, "utf8"));
    } catch {
      data = { votes: {}, comments: [] };
    }
    const result = await fn(data);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(data, null, 2));
    return result;
  });
  // Keep the chain alive even if this op throws.
  queue = run.catch(() => {});
  return run;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API (backend-agnostic)
// ─────────────────────────────────────────────────────────────────────────────

export async function getBoard(deviceId: string): Promise<Board> {
  if (sql) {
    await ensureSchema();
    const [voteRows, commentRows] = await Promise.all([
      sql`select poi_id, device_id, want, reaction from votes`,
      sql`select poi_id, count(*)::int as n from comments group by poi_id`,
    ]);
    return buildBoard(
      voteRows as VoteAggRow[],
      commentRows as CommentCountRow[],
      deviceId,
    );
  }

  return withFile((data) => {
    const voteRows = Object.entries(data.votes).flatMap(([poi_id, byDevice]) =>
      Object.entries(byDevice).map(([device_id, v]) => ({
        poi_id,
        device_id,
        want: v.want,
        reaction: v.reaction,
      })),
    );
    const counts = new Map<string, number>();
    for (const c of data.comments)
      counts.set(c.poiId, (counts.get(c.poiId) ?? 0) + 1);
    const commentRows = [...counts].map(([poi_id, n]) => ({ poi_id, n }));
    return buildBoard(voteRows, commentRows, deviceId);
  });
}

// Shared board assembly — identical logic regardless of where the rows came from.
function buildBoard(
  voteRows: { poi_id: string; device_id: string; want: boolean; reaction: string | null }[],
  commentRows: { poi_id: string; n: number }[],
  deviceId: string,
): Board {
  const stats: Record<string, PoiStats> = {};
  const mine: Record<string, MyState> = {};
  const stat = (id: string): PoiStats =>
    (stats[id] ??= { want: 0, reactions: {}, comments: 0 });

  for (const r of voteRows) {
    const s = stat(r.poi_id);
    if (r.want) s.want += 1;
    if (r.reaction) s.reactions[r.reaction] = (s.reactions[r.reaction] ?? 0) + 1;
    if (r.device_id === deviceId)
      mine[r.poi_id] = { want: r.want, reaction: r.reaction };
  }
  for (const c of commentRows) stat(c.poi_id).comments = c.n;

  return { stats, mine };
}

export async function getComments(
  poiId: string,
  deviceId: string,
): Promise<CommentRow[]> {
  if (sql) {
    await ensureSchema();
    const rows = (await sql`
      select id, author_name, body, device_id,
             (extract(epoch from created_at) * 1000)::bigint as created_at
      from comments
      where poi_id = ${poiId}
      order by created_at asc`) as CommentSelectRow[];
    return rows.map((r) => ({
      id: r.id,
      poiId,
      author: r.author_name,
      body: r.body,
      createdAt: Number(r.created_at),
      mine: r.device_id === deviceId,
    }));
  }

  return withFile((data) =>
    data.comments
      .filter((c) => c.poiId === poiId)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((c) => ({
        id: c.id,
        poiId,
        author: c.author,
        body: c.body,
        createdAt: c.createdAt,
        mine: c.deviceId === deviceId,
      })),
  );
}

export async function setWant(
  poiId: string,
  deviceId: string,
  want: boolean,
): Promise<void> {
  if (sql) {
    await ensureSchema();
    await sql`
      insert into votes (poi_id, device_id, want)
      values (${poiId}, ${deviceId}, ${want})
      on conflict (poi_id, device_id)
      do update set want = excluded.want, updated_at = now()`;
    return;
  }
  await withFile((data) => {
    const byDevice = (data.votes[poiId] ??= {});
    byDevice[deviceId] = { want, reaction: byDevice[deviceId]?.reaction ?? null };
  });
}

export async function setReaction(
  poiId: string,
  deviceId: string,
  reaction: string | null,
): Promise<void> {
  if (sql) {
    await ensureSchema();
    // The `false` only applies on first insert; on conflict we touch reaction
    // alone so an existing "want" flag is preserved.
    await sql`
      insert into votes (poi_id, device_id, want, reaction)
      values (${poiId}, ${deviceId}, false, ${reaction})
      on conflict (poi_id, device_id)
      do update set reaction = excluded.reaction, updated_at = now()`;
    return;
  }
  await withFile((data) => {
    const byDevice = (data.votes[poiId] ??= {});
    byDevice[deviceId] = { want: byDevice[deviceId]?.want ?? false, reaction };
  });
}

export async function addComment(
  poiId: string,
  deviceId: string,
  author: string,
  body: string,
): Promise<CommentRow> {
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  if (sql) {
    await ensureSchema();
    await sql`
      insert into comments (id, poi_id, device_id, author_name, body)
      values (${id}, ${poiId}, ${deviceId}, ${author}, ${body})`;
  } else {
    await withFile((data) => {
      data.comments.push({ id, poiId, deviceId, author, body, createdAt });
    });
  }
  return { id, poiId, author, body, createdAt, mine: true };
}

export async function deleteComment(
  id: string,
  deviceId: string,
): Promise<boolean> {
  if (sql) {
    await ensureSchema();
    const rows = await sql`
      delete from comments
      where id = ${id} and device_id = ${deviceId}
      returning id`;
    return rows.length > 0;
  }
  return withFile((data) => {
    const before = data.comments.length;
    data.comments = data.comments.filter(
      (c) => !(c.id === id && c.deviceId === deviceId),
    );
    return data.comments.length < before;
  });
}

/** Which backend is live — surfaced so the UI can hint "local only" in dev. */
export const BACKEND: "postgres" | "file" = USE_PG ? "postgres" : "file";
