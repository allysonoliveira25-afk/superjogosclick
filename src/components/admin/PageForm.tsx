"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPage, updatePage } from "@/lib/pages";
import { slugify } from "@/lib/feedImport";
import type { CustomPage } from "@/lib/types";

export default function PageForm({ initial }: { initial?: CustomPage }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlugState] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [content, setContent] = useState(initial?.content ?? "");
  const [showInFooter, setShowInFooter] = useState(initial?.showInFooter ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const effectiveSlug = slugTouched ? slug : slugify(title);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title || !effectiveSlug || !content) {
      setError("Preencha título, slug e conteúdo.");
      return;
    }
    setSaving(true);
    try {
      const payload = { title, slug: effectiveSlug, content, showInFooter };
      if (initial) {
        await updatePage(initial.id, payload);
      } else {
        await createPage(payload);
      }
      router.push("/admin/paginas");
      router.refresh();
    } catch {
      setError("Não foi possível salvar a página.");
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
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Contato, Política de Privacidade"
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold">Slug (URL: /pagina/...)</label>
        <input
          value={effectiveSlug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlugState(slugify(e.target.value));
          }}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold">Conteúdo</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="Escreva o texto da página. Deixe uma linha em branco entre parágrafos."
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" checked={showInFooter} onChange={(e) => setShowInFooter(e.target.checked)} />
        Mostrar link no rodapé do site
      </label>

      {error && <p className="text-sm font-semibold text-accent-red">{error}</p>}

      <button
        disabled={saving}
        type="submit"
        className="self-start rounded-full bg-brand px-6 py-2.5 text-sm font-extrabold text-white shadow hover:bg-brand-dark disabled:opacity-60"
      >
        {saving ? "Salvando..." : initial ? "Salvar alterações" : "Criar página"}
      </button>
    </form>
  );
}
