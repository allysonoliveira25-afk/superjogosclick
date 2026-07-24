"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllGames } from "@/lib/games";
import { getAllUsers } from "@/lib/users";
import { getAllCategories } from "@/lib/categories";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    games: number;
    plays: number;
    users: number;
    categories: number;
  } | null>(null);

  useEffect(() => {
    Promise.all([getAllGames(), getAllUsers(), getAllCategories()]).then(
      ([games, users, categories]) => {
        setStats({
          games: games.length,
          plays: games.reduce((s, g) => s + (g.plays || 0), 0),
          users: users.length,
          categories: categories.length,
        });
      }
    );
  }, []);

  const cards = [
    { label: "Jogos cadastrados", value: stats?.games, emoji: "🎮", color: "bg-accent-orange" },
    { label: "Total de jogadas", value: stats?.plays, emoji: "🕹️", color: "bg-accent-blue" },
    { label: "Usuários", value: stats?.users, emoji: "👥", color: "bg-accent-green" },
    { label: "Categorias", value: stats?.categories, emoji: "🗂️", color: "bg-accent-pink" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Visão geral do SuperJogosClick.</p>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="flex items-center gap-3 rounded-2xl bg-surface p-4 shadow">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl text-white ${c.color}`}>
              {c.emoji}
            </span>
            <div>
              <p className="font-heading text-2xl font-extrabold">{c.value ?? "—"}</p>
              <p className="text-xs font-semibold text-muted">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/admin/jogos/novo" className="rounded-2xl bg-surface p-4 shadow hover:-translate-y-0.5">
          <p className="text-2xl">➕</p>
          <p className="mt-1 font-bold">Adicionar jogo</p>
          <p className="text-xs text-muted">Cadastrar manualmente</p>
        </Link>
        <Link href="/admin/importar" className="rounded-2xl bg-surface p-4 shadow hover:-translate-y-0.5">
          <p className="text-2xl">📥</p>
          <p className="mt-1 font-bold">Importar em massa</p>
          <p className="text-xs text-muted">GameMonetize / GamePix</p>
        </Link>
        <Link href="/admin/categorias" className="rounded-2xl bg-surface p-4 shadow hover:-translate-y-0.5">
          <p className="text-2xl">🗂️</p>
          <p className="mt-1 font-bold">Categorias</p>
          <p className="text-xs text-muted">Criar categorias personalizadas</p>
        </Link>
        <Link href="/admin/paginas/nova" className="rounded-2xl bg-surface p-4 shadow hover:-translate-y-0.5">
          <p className="text-2xl">📄</p>
          <p className="mt-1 font-bold">Criar página</p>
          <p className="text-xs text-muted">Contato, privacidade, etc.</p>
        </Link>
        <Link href="/admin/configuracoes" className="rounded-2xl bg-surface p-4 shadow hover:-translate-y-0.5">
          <p className="text-2xl">⚙️</p>
          <p className="mt-1 font-bold">Configurações</p>
          <p className="text-xs text-muted">Nome, contato, manutenção</p>
        </Link>
      </div>
    </div>
  );
}
