"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import AgeRatingBadge from "./AgeRatingBadge";
import type { Game } from "@/lib/types";

export default function GameCard({ game }: { game: Game }) {
  const { user } = useAuth();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    isFavorite(user.uid, game.id).then((v) => {
      if (active) setFav(v);
    });
    return () => {
      active = false;
    };
  }, [user, game.id]);

  const showFav = Boolean(user) && fav;

  async function handleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    const next = await toggleFavorite(user.uid, game.id);
    setFav(next);
  }

  return (
    <Link href={`/jogo/${game.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface shadow-[0_2px_8px_rgba(36,27,61,0.12)] transition-all duration-150 group-hover:-translate-y-1 group-hover:shadow-[0_10px_24px_rgba(36,27,61,0.25)]">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          sizes="(max-width: 768px) 33vw, 180px"
          className="object-cover"
          unoptimized
        />
        <div className="absolute left-1.5 top-1.5">
          <AgeRatingBadge rating={game.ageRating} size="sm" />
        </div>
        {user && (
          <button
            onClick={handleFav}
            aria-label={showFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-lg leading-none shadow"
          >
            {showFav ? "❤️" : "🤍"}
          </button>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-lg">
            ▶
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-5">
          <p className="line-clamp-2 text-xs font-extrabold leading-tight text-white">
            {game.title}
          </p>
        </div>
      </div>
    </Link>
  );
}
