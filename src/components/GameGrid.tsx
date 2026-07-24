import GameCard from "./GameCard";
import type { Game } from "@/lib/types";

export default function GameGrid({
  title,
  emoji,
  games,
}: {
  title: string;
  emoji?: string;
  games: Game[];
}) {
  if (games.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-heading text-xl font-extrabold text-brand-dark">
        {emoji} {title}
      </h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {games.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </section>
  );
}
