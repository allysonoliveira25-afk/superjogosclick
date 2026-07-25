import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { db } from "./firebase";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "./types";

const SETTINGS_REF = doc(db, "settings", "site");

export async function getSiteSettings(): Promise<SiteSettings> {
  const snap = await getDoc(SETTINGS_REF);
  if (!snap.exists()) return DEFAULT_SITE_SETTINGS;
  return { ...DEFAULT_SITE_SETTINGS, ...(snap.data() as Partial<SiteSettings>) };
}

export async function updateSiteSettings(data: Partial<SiteSettings>) {
  await setDoc(SETTINGS_REF, data, { merge: true });
}
