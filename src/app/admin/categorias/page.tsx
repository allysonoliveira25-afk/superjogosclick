"use client";

import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  seedDefaultCategories,
} from "@/lib/categories";
import { slugify } from "@/lib/feedImport";
import CategoryIcon from "@/components/CategoryIcon";
import type { Category, CategoryIconKey } from "@/lib/types";

const ICONS: CategoryIconKey[] = [
  "sword", "compass", "puzzle", "car", "ball", "target",
  "chess", "balloon", "brain", "controller", "dice", "star",
];
const COLORS = ["#E5473C", "#2BB673", "#8B5CF6", "#F2861E", "#3AA0FF", "#F2C230", "#4A5568", "#FF5DA2", "#14B8A6"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState<CategoryIconKey>("star");
  const [color, setColor] = useState(COLORS[0]);
  const [saving, setSaving] = useState(false);

  async function load() {
    setCategories(await getAllCategories());
  }

  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    setSaving(true);
    await createCategory({ label: label.trim(), slug: slugify(label), icon, color, custom: true });
    setLabel("");
    await load();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta categoria? Os jogos nela deixarão de aparecer em listagens por categoria.")) return;
    await deleteCategory(id);
    load();
  }

  async function handleSeed() {
    await seedDefaultCategories();
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Categorias</h1>
        {categories.length === 0 && (
          <button
            onClick={handleSeed}
            className="rounded-full bg-accent-blue px-4 py-2 text-sm font-extrabold text-white shadow"
          >
            ⚡ Criar categorias padrão
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: c.color }}
            >
              <CategoryIcon icon={c.icon} className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-bold">{c.label}</p>
              <p className="text-xs text-muted">/{c.slug}</p>
            </div>
            <button onClick={() => handleDelete(c.id)} className="text-sm font-bold text-accent-red">
              Excluir
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleCreate} className="mt-8 max-w-md rounded-2xl bg-surface p-5 shadow">
        <h2 className="font-heading text-lg font-extrabold text-brand-dark">Nova categoria personalizada</h2>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nome da categoria"
          className="mt-3 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
        />

        <p className="mb-1.5 mt-3 text-sm font-bold">Ícone</p>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIcon(i)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 ${
                icon === i ? "border-brand bg-brand/10" : "border-black/10"
              }`}
            >
              <CategoryIcon icon={i} className="h-5 w-5" />
            </button>
          ))}
        </div>

        <p className="mb-1.5 mt-3 text-sm font-bold">Cor</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-brand-dark" : "border-white"}`}
            />
          ))}
        </div>

        <button
          disabled={saving}
          type="submit"
          className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-extrabold text-white shadow hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Criar categoria"}
        </button>
      </form>
    </div>
  );
}
