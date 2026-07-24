export type AgeRating = "L" | "10" | "12" | "14" | "16" | "18";

export const AGE_RATINGS: { value: AgeRating; label: string; color: string }[] = [
  { value: "L", label: "Livre", color: "#2BB673" },
  { value: "10", label: "10 anos", color: "#3AA0FF" },
  { value: "12", label: "12 anos", color: "#F2C230" },
  { value: "14", label: "14 anos", color: "#F2861E" },
  { value: "16", label: "16 anos", color: "#E5473C" },
  { value: "18", label: "18 anos", color: "#171717" },
];

export type CategoryIconKey =
  | "sword"
  | "compass"
  | "puzzle"
  | "car"
  | "ball"
  | "target"
  | "chess"
  | "balloon"
  | "brain"
  | "controller"
  | "dice"
  | "star";

export interface Category {
  id: string;
  slug: string;
  label: string;
  icon: CategoryIconKey;
  color: string;
  custom: boolean;
  createdAt: number;
}

export type GameSource = "manual" | "gamepix" | "gamemonetize";

export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  url: string;
  category: string;
  tags: string[];
  ageRating: AgeRating;
  source: GameSource;
  externalId?: string;
  width?: number;
  height?: number;
  plays: number;
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AvatarConfig {
  skin: string;
  hair: string;
  hairColor: string;
  outfit: string;
  accessory: string;
  bg: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skin: "#F2C99E",
  hair: "short",
  hairColor: "#4A3222",
  outfit: "#3AA0FF",
  accessory: "none",
  bg: "#FFD23F",
};

export type UserRole = "user" | "admin";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  avatar: AvatarConfig;
  totalPlaytimeSeconds: number;
  createdAt: number;
}

export interface FavoriteEntry {
  gameId: string;
  addedAt: number;
}

export interface HistoryEntry {
  gameId: string;
  lastPlayedAt: number;
  totalSeconds: number;
  playCount: number;
}
