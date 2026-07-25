import { doc, getDoc, setDoc, collection, getDocs, increment, updateDoc } from "firebase/firestore/lite";
import { db } from "./firebase";
import { addPlaytime } from "./users";
import { incrementPlays } from "./games";
import type { HistoryEntry } from "./types";

function historyRef(uid: string, gameId: string) {
  return doc(db, "users", uid, "history", gameId);
}

export async function getHistory(uid: string): Promise<HistoryEntry[]> {
  const snap = await getDocs(collection(db, "users", uid, "history"));
  return snap.docs
    .map((d) => d.data() as HistoryEntry)
    .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
}

// Called once when a game session starts (iframe loaded / play button pressed).
export async function recordPlayStart(uid: string, gameId: string) {
  const ref = historyRef(uid, gameId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, {
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
    await setDoc(ref, entry);
  }
  await incrementPlays(gameId);
}

// Called with elapsed seconds when the player leaves the game page.
export async function recordPlaySeconds(uid: string, gameId: string, seconds: number) {
  if (seconds <= 0) return;
  await updateDoc(historyRef(uid, gameId), {
    totalSeconds: increment(seconds),
    lastPlayedAt: Date.now(),
  });
  await addPlaytime(uid, seconds);
}
