"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGameById } from "@/lib/games";
import { getAllCategories } from "@/lib/categories";
import GameForm from "@/components/admin/GameForm";
import type { Category, Game } from "@/lib/types";

export default function EditGamePage() {
  const params = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null | undefined>(undefined);
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    getGameById(params.id).then(setGame);
    getAllCategories().then(setCategories);
  }, [params.id]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Editar jogo</h1>
      <div className="mt-4 max-w-2xl">
        {game === undefined || categories === null ? (
          <p className="text-muted">Carregando...</p>
        ) : game === null ? (
          <p className="text-muted">Jogo não encontrado.</p>
        ) : (
          <GameForm categories={categories} initial={game} />
        )}
      </div>
    </div>
  );
}
