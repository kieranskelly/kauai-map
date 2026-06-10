"use server";

// The collaboration API. Every export here is a React Server Function: callable
// from the client, but it actually runs on the server and is reachable by raw
// POST. With no auth in this app, input validation IS the security boundary —
// so each action checks the poi id against the known set, bounds the device id,
// allow-lists reactions, and caps text length before touching the database.

import * as db from "@/lib/collab/db";
import { POIS } from "@/lib/pois";
import {
  REACTION_SET,
  NAME_MAX,
  COMMENT_MAX,
  type Board,
  type CommentRow,
} from "@/lib/collab/types";

const POI_IDS = new Set(POIS.map((p) => p.id));

function assertPoi(id: unknown): asserts id is string {
  if (typeof id !== "string" || !POI_IDS.has(id)) {
    throw new Error("Unknown spot");
  }
}

// device_id is a client-generated UUID in localStorage. We don't trust it for
// identity (there are no accounts) — it only scopes "one vote per device" and
// "delete your own comment". Just sanity-bound it.
function assertDevice(id: unknown): asserts id is string {
  if (typeof id !== "string" || id.length < 8 || id.length > 64) {
    throw new Error("Bad device id");
  }
}

function cleanName(raw: unknown): string {
  const s = (typeof raw === "string" ? raw : "").trim().slice(0, NAME_MAX);
  return s.length > 0 ? s : "Anonymous";
}

export async function fetchBoard(deviceId: string): Promise<Board> {
  assertDevice(deviceId);
  return db.getBoard(deviceId);
}

export async function fetchComments(
  poiId: string,
  deviceId: string,
): Promise<CommentRow[]> {
  assertPoi(poiId);
  assertDevice(deviceId);
  return db.getComments(poiId, deviceId);
}

/** Toggle this device's "want to go" for a spot. Returns the fresh board. */
export async function voteWant(
  poiId: string,
  deviceId: string,
  want: boolean,
): Promise<Board> {
  assertPoi(poiId);
  assertDevice(deviceId);
  await db.setWant(poiId, deviceId, !!want);
  return db.getBoard(deviceId);
}

/** Set or clear this device's reaction (pass null to clear). Returns the board. */
export async function react(
  poiId: string,
  deviceId: string,
  reaction: string | null,
): Promise<Board> {
  assertPoi(poiId);
  assertDevice(deviceId);
  const value =
    reaction === null || REACTION_SET.has(reaction) ? reaction : null;
  await db.setReaction(poiId, deviceId, value);
  return db.getBoard(deviceId);
}

export async function postComment(
  poiId: string,
  deviceId: string,
  author: string,
  body: string,
): Promise<CommentRow> {
  assertPoi(poiId);
  assertDevice(deviceId);
  const text = (typeof body === "string" ? body : "").trim().slice(0, COMMENT_MAX);
  if (text.length === 0) throw new Error("Empty comment");
  return db.addComment(poiId, deviceId, cleanName(author), text);
}

export async function removeComment(
  id: string,
  deviceId: string,
): Promise<boolean> {
  assertDevice(deviceId);
  if (typeof id !== "string" || id.length === 0) throw new Error("Bad id");
  return db.deleteComment(id, deviceId);
}
