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
  orderBy,
  limit as fbLimit,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CustomPage } from "./types";

const pagesCol = collection(db, "pages");

function toPage(id: string, data: Record<string, unknown>): CustomPage {
  return { id, ...(data as Omit<CustomPage, "id">) };
}

export async function getAllPages(): Promise<CustomPage[]> {
  const q = query(pagesCol, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toPage(d.id, d.data()));
}

export async function getPageById(id: string): Promise<CustomPage | null> {
  const snap = await getDoc(doc(db, "pages", id));
  if (!snap.exists()) return null;
  return toPage(snap.id, snap.data());
}

export async function getPageBySlug(slug: string): Promise<CustomPage | null> {
  const q = query(pagesCol, where("slug", "==", slug), fbLimit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return toPage(snap.docs[0].id, snap.docs[0].data());
}

export async function createPage(
  data: Omit<CustomPage, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(pagesCol, { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updatePage(id: string, data: Partial<Omit<CustomPage, "id">>) {
  await updateDoc(doc(db, "pages", id), { ...data, updatedAt: Date.now() });
}

export async function deletePage(id: string) {
  await deleteDoc(doc(db, "pages", id));
}
