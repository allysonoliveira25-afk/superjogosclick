import { AGE_RATINGS, type AgeRating } from "@/lib/types";

export default function AgeRatingBadge({
  rating,
  size = "md",
}: {
  rating: AgeRating;
  size?: "sm" | "md";
}) {
  const meta = AGE_RATINGS.find((r) => r.value === rating) ?? AGE_RATINGS[0];
  const dims = size === "sm" ? "w-6 h-6 text-[10px]" : "w-9 h-9 text-sm";
  return (
    <span
      title={`Classificação indicativa: ${meta.label}`}
      className={`inline-flex items-center justify-center rounded-lg font-extrabold text-white shrink-0 ${dims}`}
      style={{ backgroundColor: meta.color }}
    >
      {meta.value}
    </span>
  );
}
