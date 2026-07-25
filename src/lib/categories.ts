import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore/lite";
import { db } from "./firebase";
import type { Category } from "./types";

const categoriesCol = collection(db, "categories");

export const DEFAULT_CATEGORIES: Omit<Category, "id" | "createdAt">[] = [
  { slug: "acao", label: "Ação", icon: "sword", color: "#E5473C", custom: false },
  { slug: "aventura", label: "Aventura", icon: "compass", color: "#2BB673", custom: false },
  { slug: "puzzle", label: "Puzzle", icon: "puzzle", color: "#8B5CF6", custom: false },
  { slug: "corrida", label: "Corrida", icon: "car", color: "#F2861E", custom: false },
  { slug: "esportes", label: "Esportes", icon: "ball", color: "#3AA0FF", custom: false },
  { slug: "tiro", label: "Tiro", icon: "target", color: "#F2C230", custom: false },
  { slug: "estrategia", label: "Estratégia", icon: "chess", color: "#4A5568", custom: false },
  { slug: "casual", label: "Casual", icon: "balloon", color: "#FF5DA2", custom: false },
  { slug: "raciocinio", label: "Raciocínio", icon: "brain", color: "#14B8A6", custom: false },
];

function toCategory(id: string, data: Record<string, unknown>): Category {
  return { id, ...(data as Omit<Category, "id">) };
}

export async function getAllCategories(): Promise<Category[]> {
  const q = query(categoriesCol, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toCategory(d.id, d.data()));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const all = await getAllCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function seedDefaultCategories() {
  const existing = await getAllCategories();
  const existingSlugs = new Set(existing.map((c) => c.slug));
  for (const c of DEFAULT_CATEGORIES) {
    if (existingSlugs.has(c.slug)) continue;
    await addDoc(categoriesCol, { ...c, createdAt: Date.now() });
  }
}

export async function createCategory(
  data: Omit<Category, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(categoriesCol, { ...data, createdAt: Date.now() });
  return ref.id;
}

export async function updateCategory(id: string, data: Partial<Omit<Category, "id">>) {
  await updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, "categories", id));
}
