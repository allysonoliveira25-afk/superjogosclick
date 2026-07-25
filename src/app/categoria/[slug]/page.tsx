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
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) notFound();

  const games = await getGamesByCategory(slug).catch(() => []);

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-5">
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow"
          style={{ backgroundColor: category.color }}
        >
          <CategoryIcon icon={category.icon} className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.15)]">
            {category.label}
          </h1>
          <p className="text-sm font-semibold text-white/80">
            {games.length} {games.length === 1 ? "jogo" : "jogos"}
          </p>
        </div>
      </div>

      {games.length === 0 ? (
        <p className="mt-8 font-semibold text-white/80">Ainda não há jogos nesta categoria.</p>
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
