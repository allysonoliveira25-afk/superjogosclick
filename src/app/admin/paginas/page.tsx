"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPages, deletePage } from "@/lib/pages";
import type { CustomPage } from "@/lib/types";

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CustomPage[] | null>(null);

  async function load() {
    setPages(await getAllPages());
  }

  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta página?")) return;
    await deletePage(id);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Páginas</h1>
        <Link
          href="/admin/paginas/nova"
          className="rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white shadow hover:bg-brand-dark"
        >
          ➕ Criar página
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-surface shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase text-muted">
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Rodapé</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pages?.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-2.5 font-semibold">{p.title}</td>
                <td className="px-4 py-2.5 text-muted">/pagina/{p.slug}</td>
                <td className="px-4 py-2.5">{p.showInFooter ? "✓" : "—"}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-2">
                    <Link href={`/admin/paginas/${p.id}`} className="font-bold text-brand">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="font-bold text-accent-red">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages?.length === 0 && (
          <p className="p-6 text-center text-muted">
            Nenhuma página criada ainda. Que tal começar com &quot;Contato&quot; ou &quot;Privacidade&quot;?
          </p>
        )}
      </div>
    </div>
  );
}
