import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit as fbLimit,
  increment,
} from "firebase/firestore/lite";
import { db } from "./firebase";
import type { Game } from "./types";

const gamesCol = collection(db, "games");

function toGame(id: string, data: Record<string, unknown>): Game {
  return { id, ...(data as Omit<Game, "id">) };
}

export async function getAllGames(): Promise<Game[]> {
  const snap = await getDocs(gamesCol);
  return snap.docs.map((d) => toGame(d.id, d.data()));
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const q = query(gamesCol, where("slug", "==", slug), fbLimit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return toGame(snap.docs[0].id, snap.docs[0].data());
}

export async function getGameById(id: string): Promise<Game | null> {
  const snap = await getDoc(doc(db, "games", id));
  if (!snap.exists()) return null;
  return toGame(snap.id, snap.data());
}

export async function getGamesByIds(ids: string[]): Promise<Game[]> {
  const results = await Promise.all(ids.map((id) => getGameById(id)));
  return results.filter((g): g is Game => g !== null);
}

export async function getGamesByCategory(category: string): Promise<Game[]> {
  const q = query(gamesCol, where("category", "==", category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toGame(d.id, d.data()));
}

export async function getFeaturedGames(max = 10): Promise<Game[]> {
  const all = await getAllGames();
  return all
    .filter((g) => g.featured)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, max);
}

export async function getPopularGames(max = 18): Promise<Game[]> {
  const all = await getAllGames();
  return all.sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, max);
}

export async function getRecentGames(max = 24): Promise<Game[]> {
  const all = await getAllGames();
  return all.sort((a, b) => b.createdAt - a.createdAt).slice(0, max);
}

export async function searchGames(term: string): Promise<Game[]> {
  const all = await getAllGames();
  const needle = term.trim().toLowerCase();
  if (!needle) return [];
  return all.filter(
    (g) =>
      g.title.toLowerCase().includes(needle) ||
      g.tags.some((t) => t.toLowerCase().includes(needle))
  );
}

export async function createGame(
  data: Omit<Game, "id" | "plays" | "createdAt" | "updatedAt">
): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(gamesCol, { ...data, plays: 0, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateGame(id: string, data: Partial<Omit<Game, "id">>) {
  await updateDoc(doc(db, "games", id), { ...data, updatedAt: Date.now() });
}

export async function deleteGame(id: string) {
  await deleteDoc(doc(db, "games", id));
}

export async function incrementPlays(id: string) {
  await updateDoc(doc(db, "games", id), { plays: increment(1) });
}

export async function bulkImportGames(
  games: Omit<Game, "id" | "plays" | "createdAt" | "updatedAt">[]
): Promise<number> {
  const existing = await getAllGames();
  const existingExternalIds = new Set(
    existing.filter((g) => g.externalId).map((g) => `${g.source}:${g.externalId}`)
  );
  let imported = 0;
  for (const g of games) {
    const key = `${g.source}:${g.externalId}`;
    if (g.externalId && existingExternalIds.has(key)) continue;
    await createGame(g);
    imported++;
  }
  return imported;
}
