"use client";

import { useEffect, useState } from "react";
import { getAllCategories } from "@/lib/categories";
import GameForm from "@/components/admin/GameForm";
import type { Category } from "@/lib/types";

export default function NewGamePage() {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Novo jogo</h1>
      <div className="mt-4 max-w-2xl">
        {categories === null ? (
          <p className="text-muted">Carregando...</p>
        ) : categories.length === 0 ? (
          <p className="text-muted">
            Crie ao menos uma categoria em{" "}
            <a href="/admin/categorias" className="font-bold text-brand">
              Categorias
            </a>{" "}
            antes de cadastrar jogos.
          </p>
        ) : (
          <GameForm categories={categories} />
        )}
      </div>
    </div>
  );
}
