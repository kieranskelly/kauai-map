"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchBoard, voteWant, react } from "@/app/actions";
import { getDeviceId, getStoredName, storeName } from "@/lib/identity";
import { emptyBoard, type Board, type MyState, type PoiStats } from "@/lib/collab/types";

// How often we re-pull the board to pick up other people's votes/comments.
// "Live-ish" by polling — no websockets, which keeps the whole backend a couple
// of serverless functions. Comfortable for a trip-sized group.
const POLL_MS = 6000;

interface CollabValue {
  ready: boolean;
  deviceId: string;
  name: string;
  saveName: (n: string) => void;
  board: Board;
  toggleWant: (poiId: string) => void;
  toggleReaction: (poiId: string, reaction: string) => void;
  refresh: () => void;
}

const CollabContext = createContext<CollabValue | null>(null);

const EMPTY_STAT: PoiStats = { want: 0, reactions: {}, comments: 0 };
const EMPTY_MINE: MyState = { want: false, reaction: null };

export function CollabProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [name, setName] = useState("");
  const [board, setBoard] = useState<Board>(emptyBoard());

  // Latest-value refs so the polling timer and event handlers never read a
  // stale board/id from a closure captured at mount.
  const deviceRef = useRef("");
  const boardRef = useRef(board);
  boardRef.current = board;

  const applyBoard = useCallback((b: Board) => {
    boardRef.current = b;
    setBoard(b);
  }, []);

  const refresh = useCallback(async () => {
    const id = deviceRef.current;
    if (!id) return;
    try {
      applyBoard(await fetchBoard(id));
    } catch {
      /* transient — the next poll will catch up */
    }
  }, [applyBoard]);

  // One-time bootstrap: resolve identity, do an initial load, then poll and
  // also refresh whenever the tab regains focus (so phones waking up sync fast).
  useEffect(() => {
    const id = getDeviceId();
    deviceRef.current = id;
    setDeviceId(id);
    setName(getStoredName());
    setReady(true);
    refresh();

    const iv = setInterval(refresh, POLL_MS);
    const onFocus = () => refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(iv);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const saveName = useCallback((n: string) => {
    storeName(n);
    setName(getStoredName());
  }, []);

  const toggleWant = useCallback(
    (poiId: string) => {
      const id = deviceRef.current;
      if (!id) return;
      const prev = boardRef.current;
      const mine = prev.mine[poiId] ?? EMPTY_MINE;
      const stat = prev.stats[poiId] ?? EMPTY_STAT;
      const nextWant = !mine.want;

      applyBoard({
        stats: {
          ...prev.stats,
          [poiId]: {
            ...stat,
            want: Math.max(0, stat.want + (nextWant ? 1 : -1)),
          },
        },
        mine: { ...prev.mine, [poiId]: { ...mine, want: nextWant } },
      });

      voteWant(poiId, id, nextWant).then(applyBoard).catch(refresh);
    },
    [applyBoard, refresh],
  );

  const toggleReaction = useCallback(
    (poiId: string, reaction: string) => {
      const id = deviceRef.current;
      if (!id) return;
      const prev = boardRef.current;
      const mine = prev.mine[poiId] ?? EMPTY_MINE;
      const stat = prev.stats[poiId] ?? EMPTY_STAT;
      // Tapping your current reaction clears it; otherwise it replaces it.
      const next = mine.reaction === reaction ? null : reaction;

      const reactions = { ...stat.reactions };
      if (mine.reaction) {
        reactions[mine.reaction] = Math.max(0, (reactions[mine.reaction] ?? 0) - 1);
        if (reactions[mine.reaction] === 0) delete reactions[mine.reaction];
      }
      if (next) reactions[next] = (reactions[next] ?? 0) + 1;

      applyBoard({
        stats: { ...prev.stats, [poiId]: { ...stat, reactions } },
        mine: { ...prev.mine, [poiId]: { ...mine, reaction: next } },
      });

      react(poiId, id, next).then(applyBoard).catch(refresh);
    },
    [applyBoard, refresh],
  );

  return (
    <CollabContext.Provider
      value={{
        ready,
        deviceId,
        name,
        saveName,
        board,
        toggleWant,
        toggleReaction,
        refresh,
      }}
    >
      {children}
    </CollabContext.Provider>
  );
}

export function useCollab(): CollabValue {
  const ctx = useContext(CollabContext);
  if (!ctx) throw new Error("useCollab must be used within <CollabProvider>");
  return ctx;
}

/** Convenience selectors with safe defaults so callers skip the null-checks. */
export function statsFor(board: Board, poiId: string): PoiStats {
  return board.stats[poiId] ?? EMPTY_STAT;
}
export function mineFor(board: Board, poiId: string): MyState {
  return board.mine[poiId] ?? EMPTY_MINE;
}
