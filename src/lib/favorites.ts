import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore/lite";
import { db } from "./firebase";
import type { FavoriteEntry } from "./types";

function favRef(uid: string, gameId: string) {
  return doc(db, "users", uid, "favorites", gameId);
}

export async function isFavorite(uid: string, gameId: string): Promise<boolean> {
  const snap = await getDoc(favRef(uid, gameId));
  return snap.exists();
}

export async function addFavorite(uid: string, gameId: string) {
  await setDoc(favRef(uid, gameId), { gameId, addedAt: Date.now() });
}

export async function removeFavorite(uid: string, gameId: string) {
  await deleteDoc(favRef(uid, gameId));
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
  const snap = await getDocs(collection(db, "users", uid, "favorites"));
  return snap.docs
    .map((d) => d.data() as FavoriteEntry)
    .sort((a, b) => b.addedAt - a.addedAt);
}
