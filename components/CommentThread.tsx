"use client";

import { useEffect, useRef, useState } from "react";
import { fetchComments, postComment, removeComment } from "@/app/actions";
import { useCollab } from "./CollabProvider";
import { COMMENT_MAX, NAME_MAX, type CommentRow } from "@/lib/collab/types";

const POLL_MS = 6000;

function ago(ms: number): string {
  const s = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

export function CommentThread({ poiId }: { poiId: string }) {
  const { deviceId, name, saveName, refresh } = useCollab();
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [body, setBody] = useState("");
  const [nameField, setNameField] = useState(name);
  const [posting, setPosting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the name field in step with the stored name until the user types here.
  useEffect(() => {
    setNameField((cur) => (cur ? cur : name));
  }, [name]);

  // Load + poll the thread for as long as this spot's card is open. Re-runs
  // when you switch spots because `poiId` changes.
  useEffect(() => {
    if (!deviceId) return;
    let alive = true;
    setLoaded(false);
    const load = async () => {
      try {
        const rows = await fetchComments(poiId, deviceId);
        if (alive) {
          setComments(rows);
          setLoaded(true);
        }
      } catch {
        /* transient */
      }
    };
    load();
    const iv = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [poiId, deviceId]);

  const submit = async () => {
    const text = body.trim();
    if (!text || posting || !deviceId) return;
    setPosting(true);

    const typed = nameField.trim();
    if (typed && typed !== name) saveName(typed);
    const author = typed || name || "Anonymous";

    try {
      const row = await postComment(poiId, deviceId, author, text);
      setComments((c) => [...c, row]);
      setBody("");
      refresh(); // bump the comment count on the board + leaderboard
      requestAnimationFrame(() =>
        endRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
    } finally {
      setPosting(false);
    }
  };

  const del = async (id: string) => {
    setComments((c) => c.filter((x) => x.id !== id)); // optimistic
    try {
      await removeComment(id, deviceId);
    } finally {
      refresh();
    }
  };

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">
        {comments.length > 0 ? `${comments.length} comment${comments.length === 1 ? "" : "s"}` : "Comments"}
      </div>

      <div className="max-h-44 space-y-2.5 overflow-y-auto pr-1">
        {loaded && comments.length === 0 && (
          <p className="text-xs text-white/40">
            No comments yet — start the conversation. 🌺
          </p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="group flex gap-2 text-sm">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-medium text-white/90">{c.author}</span>
                <span className="text-[10px] text-white/35">{ago(c.createdAt)}</span>
                {c.mine && (
                  <button
                    onClick={() => del(c.id)}
                    className="ml-auto text-[10px] text-white/30 opacity-0 transition group-hover:opacity-100 hover:text-red-300"
                    aria-label="Delete comment"
                  >
                    delete
                  </button>
                )}
              </div>
              <p className="whitespace-pre-wrap break-words leading-snug text-white/70">
                {c.body}
              </p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="mt-2.5 flex flex-col gap-1.5">
        <input
          value={nameField}
          onChange={(e) => setNameField(e.target.value)}
          maxLength={NAME_MAX}
          placeholder="Your name"
          className="w-full rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 outline-none ring-1 ring-white/10 focus:ring-white/25"
        />
        <div className="flex items-end gap-1.5">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit();
              }
            }}
            maxLength={COMMENT_MAX}
            rows={1}
            placeholder="Add a comment…"
            className="max-h-24 min-h-[2.25rem] flex-1 resize-y rounded-lg bg-white/5 px-2.5 py-2 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-white/10 focus:ring-white/25"
          />
          <button
            onClick={submit}
            disabled={!body.trim() || posting}
            className="shrink-0 rounded-lg bg-white/15 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/25 disabled:opacity-40"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
