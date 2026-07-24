"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getFavorites } from "@/lib/favorites";
import { getGamesByIds } from "@/lib/games";
import GameCard from "@/components/GameCard";
import type { Game } from "@/lib/types";

export default function FavoritosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    getFavorites(user.uid).then(async (favs) => {
      const list = await getGamesByIds(favs.map((f) => f.gameId));
      setGames(list);
    });
  }, [user]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-3xl font-extrabold text-brand-dark">
        ❤️ Meus favoritos
      </h1>
      {games === null ? (
        <p className="mt-6 text-muted">Carregando...</p>
      ) : games.length === 0 ? (
        <p className="mt-6 text-muted">
          Você ainda não favoritou nenhum jogo. Clique no coração 🤍 nos jogos para salvá-los aqui!
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
