"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGame, updateGame } from "@/lib/games";
import { slugify } from "@/lib/feedImport";
import { AGE_RATINGS, type AgeRating, type Category, type Game } from "@/lib/types";

interface Props {
  categories: Category[];
  initial?: Game;
}

export default function GameForm({ categories, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlugState] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [category, setCategory] = useState(initial?.category ?? categories[0]?.slug ?? "");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [ageRating, setAgeRating] = useState<AgeRating>(initial?.ageRating ?? "L");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const effectiveSlug = slugTouched ? slug : slugify(title);

  function handleTitleChange(value: string) {
    setTitle(value);
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlugState(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title || !effectiveSlug || !thumbnail || !url || !category) {
      setError("Preencha título, thumbnail, URL do jogo e categoria.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title,
        slug: effectiveSlug,
        description,
        thumbnail,
        url,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        ageRating,
        featured,
        source: initial?.source ?? ("manual" as const),
      };
      if (initial) {
        await updateGame(initial.id, payload);
      } else {
        await createGame(payload);
      }
      router.push("/admin/jogos");
      router.refresh();
    } catch {
      setError("Não foi possível salvar o jogo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow">
      <div>
        <label className="mb-1 block text-sm font-bold">Título</label>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold">Slug (URL)</label>
        <input
          value={effectiveSlug}
          onChange={(e) => handleSlugChange(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-bold">URL da thumbnail</label>
          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold">URL do jogo (iframe)</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-bold">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold">Classificação indicativa</label>
          <select
            value={ageRating}
            onChange={(e) => setAgeRating(e.target.value as AgeRating)}
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
          >
            {AGE_RATINGS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.value} — {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold">Tags (separadas por vírgula)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Destacar na página inicial
      </label>

      {error && <p className="text-sm font-semibold text-accent-red">{error}</p>}

      <button
        disabled={saving}
        type="submit"
        className="self-start rounded-full bg-brand px-6 py-2.5 text-sm font-extrabold text-white shadow hover:bg-brand-dark disabled:opacity-60"
      >
        {saving ? "Salvando..." : initial ? "Salvar alterações" : "Criar jogo"}
      </button>
    </form>
  );
}
