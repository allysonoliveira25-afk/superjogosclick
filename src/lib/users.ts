import { ref, get, set, update, increment } from "firebase/database";
import { db } from "./firebase";
import { DEFAULT_AVATAR, type UserProfile, type UserRole } from "./types";

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await get(ref(db, `users/${uid}`));
  if (!snap.exists()) return null;
  return snap.val() as UserProfile;
}

export async function createUserProfile(
  uid: string,
  displayName: string,
  email: string
): Promise<UserProfile> {
  const profile: UserProfile = {
    uid,
    displayName,
    email,
    role: "user",
    avatar: DEFAULT_AVATAR,
    totalPlaytimeSeconds: 0,
    createdAt: Date.now(),
  };
  await set(ref(db, `users/${uid}`), profile);
  return profile;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await update(ref(db, `users/${uid}`), data);
}

export async function addPlaytime(uid: string, seconds: number) {
  if (seconds <= 0) return;
  await update(ref(db, `users/${uid}`), {
    totalPlaytimeSeconds: increment(seconds),
  });
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await get(ref(db, "users"));
  if (!snap.exists()) return [];
  const data = snap.val() as Record<string, UserProfile>;
  return Object.values(data);
}

export async function setUserRole(uid: string, role: UserRole) {
  await update(ref(db, `users/${uid}`), { role });
}

export function playtimePoints(totalPlaytimeSeconds: number): number {
  return Math.floor(totalPlaytimeSeconds / 60) * 10;
}
