import { ref, get, set, update, remove, push } from "firebase/database";
import { db } from "./firebase";
import type { CustomPage } from "./types";

function toPage(id: string, data: Record<string, unknown>): CustomPage {
  return { id, ...(data as Omit<CustomPage, "id">) };
}

export async function getAllPages(): Promise<CustomPage[]> {
  const snap = await get(ref(db, "pages"));
  if (!snap.exists()) return [];
  const data = snap.val() as Record<string, Record<string, unknown>>;
  return Object.entries(data)
    .map(([id, p]) => toPage(id, p))
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function getPageById(id: string): Promise<CustomPage | null> {
  const snap = await get(ref(db, `pages/${id}`));
  if (!snap.exists()) return null;
  return toPage(id, snap.val());
}

export async function getPageBySlug(slug: string): Promise<CustomPage | null> {
  const all = await getAllPages();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function createPage(
  data: Omit<CustomPage, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const now = Date.now();
  const newRef = push(ref(db, "pages"));
  await set(newRef, { ...data, createdAt: now, updatedAt: now });
  return newRef.key!;
}

export async function updatePage(id: string, data: Partial<Omit<CustomPage, "id">>) {
  await update(ref(db, `pages/${id}`), { ...data, updatedAt: Date.now() });
}

export async function deletePage(id: string) {
  await remove(ref(db, `pages/${id}`));
}
