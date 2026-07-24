import Link from "next/link";
import { getFeaturedGames, getPopularGames, getRecentGames } from "@/lib/games";
import { getAllCategories } from "@/lib/categories";
import GameGrid from "@/components/GameGrid";
import CategoryIcon from "@/components/CategoryIcon";
import type { Game, Category } from "@/lib/types";

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [featured, popular, recent, categories] = await Promise.all([
    safe<Game[]>(getFeaturedGames(), []),
    safe<Game[]>(getPopularGames(), []),
    safe<Game[]>(getRecentGames(), []),
    safe<Category[]>(getAllCategories(), []),
  ]);

  const hasGames = featured.length + popular.length + recent.length > 0;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-accent-pink px-6 py-10 text-white shadow-lg sm:px-10">
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">
          Bem-vindo ao SuperJogosClick! 🎮
        </h1>
        <p className="mt-2 max-w-lg text-sm text-white/90 sm:text-base">
          Centenas de jogos online grátis, direto no navegador. Sem instalar
          nada — é só escolher e jogar!
        </p>
      </section>

      {categories.length > 0 && (
        <section className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categoria/${c.slug}`}
              className="flex shrink-0 flex-col items-center gap-1.5 rounded-2xl bg-surface px-4 py-3 shadow transition hover:-translate-y-0.5"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: c.color }}
              >
                <CategoryIcon icon={c.icon} className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold">{c.label}</span>
            </Link>
          ))}
        </section>
      )}

      {!hasGames && (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-brand/30 bg-surface p-8 text-center text-muted">
          Nenhum jogo cadastrado ainda. Entre no{" "}
          <Link href="/admin" className="font-bold text-brand">
            painel admin
          </Link>{" "}
          para adicionar os primeiros jogos.
        </div>
      )}

      <GameGrid title="Em destaque" emoji="🔥" games={featured} />
      <GameGrid title="Mais jogados" emoji="⭐" games={popular} />
      <GameGrid title="Novidades" emoji="🆕" games={recent} />
    </div>
  );
}
