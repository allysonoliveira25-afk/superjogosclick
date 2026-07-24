"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchGames } from "@/lib/games";
import GameCard from "@/components/GameCard";
import type { Game } from "@/lib/types";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setGames(null);
    });
    searchGames(q).then((res) => {
      if (active) setGames(res);
    });
    return () => {
      active = false;
    };
  }, [q]);

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-5">
      <h1 className="font-heading text-2xl font-extrabold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.15)]">
        Resultados para &quot;{q}&quot;
      </h1>
      {games === null ? (
        <p className="mt-6 font-semibold text-white/80">Buscando...</p>
      ) : games.length === 0 ? (
        <p className="mt-6 font-semibold text-white/80">Nenhum jogo encontrado.</p>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center text-muted">Carregando...</p>}>
      <SearchResults />
    </Suspense>
  );
}
