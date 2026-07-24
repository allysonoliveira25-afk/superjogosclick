"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getHistory } from "@/lib/history";
import { getGamesByIds } from "@/lib/games";
import AgeRatingBadge from "@/components/AgeRatingBadge";
import type { Game, HistoryEntry } from "@/lib/types";

export default function HistoricoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<{ entry: HistoryEntry; game: Game }[] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    getHistory(user.uid).then(async (entries) => {
      const games = await getGamesByIds(entries.map((e) => e.gameId));
      const byId = new Map(games.map((g) => [g.id, g]));
      const merged = entries
        .map((entry) => {
          const game = byId.get(entry.gameId);
          return game ? { entry, game } : null;
        })
        .filter((r): r is { entry: HistoryEntry; game: Game } => r !== null);
      setRows(merged);
    });
  }, [user]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-heading text-3xl font-extrabold text-brand-dark">
        🕑 Histórico de jogos
      </h1>
      {rows === null ? (
        <p className="mt-6 text-muted">Carregando...</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-muted">Você ainda não jogou nenhum jogo.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {rows.map(({ entry, game }) => (
            <Link
              key={game.id}
              href={`/jogo/${game.slug}`}
              className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow hover:shadow-md"
            >
              <img src={game.thumbnail} alt={game.title} className="h-14 w-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-bold">{game.title}</p>
                <p className="text-xs text-muted">
                  Jogado {entry.playCount}x · {Math.round(entry.totalSeconds / 60)} min ·{" "}
                  {new Date(entry.lastPlayedAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <AgeRatingBadge rating={game.ageRating} size="sm" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
