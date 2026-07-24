import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";
import { getGamesByCategory } from "@/lib/games";
import CategoryIcon from "@/components/CategoryIcon";
import GameCard from "@/components/GameCard";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const games = await getGamesByCategory(slug);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
          style={{ backgroundColor: category.color }}
        >
          <CategoryIcon icon={category.icon} className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-brand-dark">
            {category.label}
          </h1>
          <p className="text-sm text-muted">
            {games.length} {games.length === 1 ? "jogo" : "jogos"}
          </p>
        </div>
      </div>

      {games.length === 0 ? (
        <p className="mt-8 text-muted">Ainda não há jogos nesta categoria.</p>
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
