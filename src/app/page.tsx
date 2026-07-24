import Link from "next/link";
import { getFeaturedGames, getPopularGames, getRecentGames } from "@/lib/games";
import { getAllCategories } from "@/lib/categories";
import GameGrid from "@/components/GameGrid";
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
    <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-5">
      {!hasGames && (
        <div className="rounded-2xl border-2 border-dashed border-white/50 bg-white/10 p-8 text-center text-white">
          {categories.length === 0 ? (
            <>
              Nenhuma categoria criada ainda. Entre no{" "}
              <Link href="/admin/categorias" className="font-extrabold underline">
                painel admin
              </Link>{" "}
              e clique em &quot;Criar categorias padrão&quot; para começar.
            </>
          ) : (
            <>
              Nenhum jogo cadastrado ainda. Entre no{" "}
              <Link href="/admin" className="font-extrabold underline">
                painel admin
              </Link>{" "}
              para adicionar os primeiros jogos.
            </>
          )}
        </div>
      )}

      <GameGrid title="Em destaque" emoji="🔥" games={featured} />
      <GameGrid title="Mais jogados" emoji="⭐" games={popular} />
      <GameGrid title="Novidades" emoji="🆕" games={recent} />
    </div>
  );
}
