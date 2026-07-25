import { ref, get, set, remove } from "firebase/database";
import { db } from "./firebase";
import type { FavoriteEntry } from "./types";

function favRef(uid: string, gameId: string) {
  return ref(db, `users/${uid}/favorites/${gameId}`);
}

export async function isFavorite(uid: string, gameId: string): Promise<boolean> {
  const snap = await get(favRef(uid, gameId));
  return snap.exists();
}

export async function addFavorite(uid: string, gameId: string) {
  await set(favRef(uid, gameId), { gameId, addedAt: Date.now() });
}

export async function removeFavorite(uid: string, gameId: string) {
  await remove(favRef(uid, gameId));
}

export async function toggleFavorite(uid: string, gameId: string): Promise<boolean> {
  const fav = await isFavorite(uid, gameId);
  if (fav) {
    await removeFavorite(uid, gameId);
    return false;
  }
  await addFavorite(uid, gameId);
  return true;
}

export async function getFavorites(uid: string): Promise<FavoriteEntry[]> {
  const snap = await get(ref(db, `users/${uid}/favorites`));
  if (!snap.exists()) return [];
  const data = snap.val() as Record<string, FavoriteEntry>;
  return Object.values(data).sort((a, b) => b.addedAt - a.addedAt);
}
