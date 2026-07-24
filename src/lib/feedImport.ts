import { DEFAULT_CATEGORIES } from "./categories";
import type { AgeRating, Game, GameSource } from "./types";

export interface FeedGame {
  externalId: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  url: string;
  width?: number;
  height?: number;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function decodeEntities(text: string): string {
  if (!text) return "";
  const named: Record<string, string> = {
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"',
    "&apos;": "'", "&#39;": "'", "&nbsp;": " ", "&hellip;": "…",
    "&mdash;": "—", "&ndash;": "–", "&rsquo;": "'", "&lsquo;": "'",
    "&ldquo;": '"', "&rdquo;": '"',
  };
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, (m) => named[m.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

// External feeds send category names in English; map them to our default
// category slugs. Falls back to "casual" for anything unrecognized.
const CATEGORY_MAP: Record<string, string> = {
  action: "acao", fighting: "acao", "beat-em-up": "acao",
  adventure: "aventura", "action adventure": "aventura", rpg: "aventura",
  puzzle: "puzzle", puzzles: "puzzle", logic: "puzzle", memory: "puzzle", match3: "puzzle", "match-3": "puzzle",
  racing: "corrida", "car games": "corrida", driving: "corrida", "bike games": "corrida",
  sports: "esportes", sport: "esportes", football: "esportes", soccer: "esportes", basketball: "esportes",
  shooting: "tiro", "shoot em up": "tiro", "shoot-em-up": "tiro", shooter: "tiro",
  strategy: "estrategia", "tower defense": "estrategia", "tower-defense": "estrategia", clicker: "estrategia",
  casual: "casual", arcade: "casual", girls: "casual", kids: "casual", multiplayer: "casual",
  "2 player": "casual", board: "casual", card: "casual", cooking: "casual", dress: "casual",
  "dress up": "casual", jump: "casual", running: "casual", idle: "casual", io: "casual",
  brain: "raciocinio", "brain games": "raciocinio",
};

export function mapFeedCategory(external: string): string {
  if (!external) return "casual";
  const key = external.toLowerCase().trim();
  if (CATEGORY_MAP[key]) return CATEGORY_MAP[key];
  const bySlug = DEFAULT_CATEGORIES.find((c) => c.slug === slugify(key) || c.label.toLowerCase() === key);
  return bySlug?.slug ?? "casual";
}

export function parseGameMonetize(raw: unknown): FeedGame[] {
  const list: Record<string, unknown>[] = Array.isArray(raw)
    ? (raw as Record<string, unknown>[])
    : ((raw as { games?: unknown[] })?.games as Record<string, unknown>[]) ?? [];
  return list
    .filter(Boolean)
    .map((item) => ({
      externalId: String(item.id ?? ""),
      title: decodeEntities(String(item.title ?? "Sem título")),
      description: decodeEntities(String(item.description || item.instructions || item.title || "")),
      thumbnail: String(item.thumb ?? ""),
      category: String(item.category ?? "Casual"),
      tags:
        typeof item.tags === "string"
          ? item.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      url: String(item.url ?? ""),
      width: item.width ? Number(item.width) : undefined,
      height: item.height ? Number(item.height) : undefined,
    }))
    .filter((g) => g.externalId && g.url);
}

export function parseGamePix(raw: unknown): FeedGame[] {
  const list: Record<string, unknown>[] =
    (raw as { items?: Record<string, unknown>[] })?.items ?? [];
  return list
    .filter(Boolean)
    .map((item) => ({
      externalId: String(item.id ?? item.namespace ?? ""),
      title: decodeEntities(String(item.title ?? "Sem título")),
      description: decodeEntities(String(item.description ?? item.title ?? "")),
      thumbnail: String(item.banner_image ?? item.image ?? ""),
      category: String(item.category ?? "Casual"),
      tags: [],
      url: String(item.url ?? ""),
      width: item.width ? Number(item.width) : undefined,
      height: item.height ? Number(item.height) : undefined,
    }))
    .filter((g) => g.externalId && g.url);
}

export function toGameDraft(
  fg: FeedGame,
  source: GameSource,
  ageRating: AgeRating
): Omit<Game, "id" | "plays" | "createdAt" | "updatedAt"> {
  return {
    title: fg.title,
    slug: slugify(fg.title) || fg.externalId,
    description: fg.description,
    thumbnail: fg.thumbnail,
    url: fg.url,
    category: mapFeedCategory(fg.category),
    tags: fg.tags,
    ageRating,
    source,
    externalId: fg.externalId,
    width: fg.width,
    height: fg.height,
    featured: false,
  };
}
