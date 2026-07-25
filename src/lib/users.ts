import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  increment,
} from "firebase/firestore/lite";
import { db } from "./firebase";
import { DEFAULT_AVATAR, type UserProfile, type UserRole } from "./types";

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
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
  await setDoc(doc(db, "users", uid), profile);
  return profile;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, "users", uid), data);
}

export async function addPlaytime(uid: string, seconds: number) {
  if (seconds <= 0) return;
  await updateDoc(doc(db, "users", uid), {
    totalPlaytimeSeconds: increment(seconds),
  });
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => d.data() as UserProfile);
}

export async function setUserRole(uid: string, role: UserRole) {
  await updateDoc(doc(db, "users", uid), { role });
}

export function playtimePoints(totalPlaytimeSeconds: number): number {
  return Math.floor(totalPlaytimeSeconds / 60) * 10;
}
