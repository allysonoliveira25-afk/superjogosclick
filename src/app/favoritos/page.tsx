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
    <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-5">
      <h1 className="font-heading text-2xl font-extrabold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.15)]">
        ❤️ Meus favoritos
      </h1>
      {games === null ? (
        <p className="mt-6 font-semibold text-white/80">Carregando...</p>
      ) : games.length === 0 ? (
        <p className="mt-6 font-semibold text-white/80">
          Você ainda não favoritou nenhum jogo. Clique no coração 🤍 nos jogos para salvá-los aqui!
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
