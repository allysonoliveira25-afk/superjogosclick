import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Fallbacks so a missing/misspelled NEXT_PUBLIC_FIREBASE_* env var can never
// crash `next build` (Firebase throws synchronously at init time if it can't
// determine a project/database URL at all, which took down every page during
// static generation — including /_not-found, which every build touches).
// With a placeholder in its place, init always succeeds; only real Firebase
// calls fail, and those are already caught by the safe()/.catch() wrappers
// around every data-fetching call in this app, degrading to empty data
// instead of a failed deploy.
const REQUIRED_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

const missing = REQUIRED_KEYS.filter((k) => !process.env[k]?.trim());
if (missing.length > 0) {
  console.warn(
    `[firebase] Missing env var(s): ${missing.join(", ")}. ` +
      "Using placeholder config — auth/database calls will fail until these " +
      "are set (in Cloudflare: Settings → Build → Build variables and secrets, " +
      "AND Settings → Variables and Secrets)."
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyPLACEHOLDER00000000000000000",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://placeholder-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "placeholder",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
