import { ref, get, set, update, increment } from "firebase/database";
import { db } from "./firebase";
import { addPlaytime } from "./users";
import { incrementPlays } from "./games";
import type { HistoryEntry } from "./types";

function historyRef(uid: string, gameId: string) {
  return ref(db, `users/${uid}/history/${gameId}`);
}

export async function getHistory(uid: string): Promise<HistoryEntry[]> {
  const snap = await get(ref(db, `users/${uid}/history`));
  if (!snap.exists()) return [];
  const data = snap.val() as Record<string, HistoryEntry>;
  return Object.values(data).sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
}

// Called once when a game session starts (iframe loaded / play button pressed).
export async function recordPlayStart(uid: string, gameId: string) {
  const r = historyRef(uid, gameId);
  const snap = await get(r);
  if (snap.exists()) {
    await update(r, {
      lastPlayedAt: Date.now(),
      playCount: increment(1),
    });
  } else {
    const entry: HistoryEntry = {
      gameId,
      lastPlayedAt: Date.now(),
      totalSeconds: 0,
      playCount: 1,
    };
    await set(r, entry);
  }
  await incrementPlays(gameId);
}

// Called with elapsed seconds when the player leaves the game page.
export async function recordPlaySeconds(uid: string, gameId: string, seconds: number) {
  if (seconds <= 0) return;
  await update(historyRef(uid, gameId), {
    totalSeconds: increment(seconds),
    lastPlayedAt: Date.now(),
  });
  await addPlaytime(uid, seconds);
}
