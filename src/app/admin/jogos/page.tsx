"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllGames, deleteGame, updateGame } from "@/lib/games";
import AgeRatingBadge from "@/components/AgeRatingBadge";
import type { Game } from "@/lib/types";

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[] | null>(null);
  const [filter, setFilter] = useState("");

  async function load() {
    const all = await getAllGames();
    setGames(all.sort((a, b) => b.createdAt - a.createdAt));
  }

  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este jogo? Essa ação não pode ser desfeita.")) return;
    await deleteGame(id);
    load();
  }

  async function toggleFeatured(g: Game) {
    await updateGame(g.id, { featured: !g.featured });
    load();
  }

  const filtered = games?.filter((g) => g.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Jogos</h1>
        <Link
          href="/admin/jogos/novo"
          className="rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white shadow hover:bg-brand-dark"
        >
          ➕ Adicionar jogo
        </Link>
      </div>

      <input
        placeholder="Filtrar por título..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mt-4 w-full max-w-sm rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
      />

      <div className="mt-4 overflow-x-auto rounded-2xl bg-surface shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase text-muted">
              <th className="px-4 py-3">Jogo</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Classificação</th>
              <th className="px-4 py-3">Jogadas</th>
              <th className="px-4 py-3">Destaque</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((g) => (
              <tr key={g.id} className="border-b border-black/5 last:border-0">
                <td className="flex items-center gap-2 px-4 py-2.5">
                  <img src={g.thumbnail} alt="" className="h-9 w-9 rounded-lg object-cover" />
                  <span className="font-semibold">{g.title}</span>
                </td>
                <td className="px-4 py-2.5">{g.category}</td>
                <td className="px-4 py-2.5">
                  <AgeRatingBadge rating={g.ageRating} size="sm" />
                </td>
                <td className="px-4 py-2.5">{g.plays}</td>
                <td className="px-4 py-2.5">
                  <button onClick={() => toggleFeatured(g)} className="text-lg">
                    {g.featured ? "⭐" : "☆"}
                  </button>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-2">
                    <Link href={`/admin/jogos/${g.id}`} className="font-bold text-brand">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(g.id)} className="font-bold text-accent-red">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered?.length === 0 && (
          <p className="p-6 text-center text-muted">Nenhum jogo encontrado.</p>
        )}
      </div>
    </div>
  );
}
