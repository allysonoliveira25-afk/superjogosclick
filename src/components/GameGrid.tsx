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
    <section className="mt-6">
      <h2 className="mb-2.5 font-heading text-lg font-extrabold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.15)]">
        {emoji} {title}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
        {games.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </section>
  );
}
