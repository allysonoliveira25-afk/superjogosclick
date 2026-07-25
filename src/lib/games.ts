import {
  ref,
  get,
  set,
  update,
  remove,
  push,
  query,
  orderByChild,
  equalTo,
  increment,
} from "firebase/database";
import { db } from "./firebase";
import type { Game } from "./types";

function toGame(id: string, data: Record<string, unknown>): Game {
  return { id, ...(data as Omit<Game, "id">) };
}

function toGames(data: Record<string, Record<string, unknown>> | null): Game[] {
  if (!data) return [];
  return Object.entries(data).map(([id, g]) => toGame(id, g));
}

export async function getAllGames(): Promise<Game[]> {
  const snap = await get(ref(db, "games"));
  return toGames(snap.val());
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const q = query(ref(db, "games"), orderByChild("slug"), equalTo(slug));
  const snap = await get(q);
  if (!snap.exists()) return null;
  const [id, game] = Object.entries(snap.val() as Record<string, Record<string, unknown>>)[0];
  return toGame(id, game);
}

export async function getGameById(id: string): Promise<Game | null> {
  const snap = await get(ref(db, `games/${id}`));
  if (!snap.exists()) return null;
  return toGame(id, snap.val());
}

export async function getGamesByIds(ids: string[]): Promise<Game[]> {
  const results = await Promise.all(ids.map((id) => getGameById(id)));
  return results.filter((g): g is Game => g !== null);
}

export async function getGamesByCategory(category: string): Promise<Game[]> {
  const q = query(ref(db, "games"), orderByChild("category"), equalTo(category));
  const snap = await get(q);
  return toGames(snap.val());
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
  const newRef = push(ref(db, "games"));
  await set(newRef, { ...data, plays: 0, createdAt: now, updatedAt: now });
  return newRef.key!;
}

export async function updateGame(id: string, data: Partial<Omit<Game, "id">>) {
  await update(ref(db, `games/${id}`), { ...data, updatedAt: Date.now() });
}

export async function deleteGame(id: string) {
  await remove(ref(db, `games/${id}`));
}

export async function incrementPlays(id: string) {
  await update(ref(db, `games/${id}`), { plays: increment(1) });
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
