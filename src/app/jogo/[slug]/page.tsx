import { notFound } from "next/navigation";
import { getGameBySlug, getGamesByCategory } from "@/lib/games";
import { getCategoryBySlug } from "@/lib/categories";
import GamePlayer from "@/components/GamePlayer";
import AgeRatingBadge from "@/components/AgeRatingBadge";
import GameCard from "@/components/GameCard";
import { AGE_RATINGS } from "@/lib/types";

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const [category, related] = await Promise.all([
    getCategoryBySlug(game.category),
    getGamesByCategory(game.category),
  ]);
  const relatedGames = related.filter((g) => g.id !== game.id).slice(0, 12);
  const ratingLabel = AGE_RATINGS.find((r) => r.value === game.ageRating)?.label;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <GamePlayer game={game} />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-brand-dark">
            {game.title}
          </h1>
          {category && (
            <p className="mt-1 text-sm text-muted">Categoria: {category.label}</p>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-2 shadow">
          <AgeRatingBadge rating={game.ageRating} />
          <span className="text-xs font-semibold text-muted">
            Classificação indicativa
            <br />
            {ratingLabel}
          </span>
        </div>
      </div>

      {game.description && (
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/80">
          {game.description}
        </p>
      )}

      {game.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {game.tags.map((t) => (
            <span key={t} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand-dark">
              #{t}
            </span>
          ))}
        </div>
      )}

      {relatedGames.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-heading text-xl font-extrabold text-brand-dark">
            🎮 Jogos parecidos
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {relatedGames.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
