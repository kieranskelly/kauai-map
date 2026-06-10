// Shared types for the collaboration layer (votes + reactions + comments).
// Imported by BOTH client and server, so keep it free of any node/server APIs.

/**
 * The reaction palette. One emoji per person per spot (tapping your current
 * one again clears it). Kept short and trip-flavored so the row stays tappable
 * on a phone. The string values are what we persist — never reorder casually,
 * existing rows reference them by value.
 */
export const REACTIONS = ["😍", "🤙", "🏄", "📸", "🤔"] as const;
export type Reaction = (typeof REACTIONS)[number];

export const REACTION_SET: ReadonlySet<string> = new Set(REACTIONS);

/** Aggregate counts for one spot, shared by everyone viewing the board. */
export interface PoiStats {
  /** How many people tapped "want to go". Drives the leaderboard. */
  want: number;
  /** emoji → count. Only non-zero entries are present. */
  reactions: Record<string, number>;
  /** Number of comments on this spot. */
  comments: number;
}

/** *This device's* own state for one spot — used to light up the controls. */
export interface MyState {
  want: boolean;
  reaction: string | null;
}

/**
 * One board snapshot: aggregate stats for every spot + this device's own
 * choices. Returned by `fetchBoard` and after every vote/reaction so the UI
 * always has an authoritative count to reconcile optimistic updates against.
 */
export interface Board {
  stats: Record<string, PoiStats>;
  mine: Record<string, MyState>;
}

/** A single comment as sent to the client. `createdAt` is epoch milliseconds. */
export interface CommentRow {
  id: string;
  poiId: string;
  author: string;
  body: string;
  createdAt: number;
  /** True when this comment was written by the requesting device. */
  mine: boolean;
}

/** Caps enforced on the server (and mirrored in the UI for nicer UX). */
export const NAME_MAX = 32;
export const COMMENT_MAX = 500;

/** Empty board helper so the client never has to null-check the maps. */
export function emptyBoard(): Board {
  return { stats: {}, mine: {} };
}
