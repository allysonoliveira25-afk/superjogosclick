import { ref, get, update } from "firebase/database";
import { db } from "./firebase";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "./types";

const SETTINGS_REF = ref(db, "settings/site");

export async function getSiteSettings(): Promise<SiteSettings> {
  const snap = await get(SETTINGS_REF);
  if (!snap.exists()) return DEFAULT_SITE_SETTINGS;
  return { ...DEFAULT_SITE_SETTINGS, ...(snap.val() as Partial<SiteSettings>) };
}

export async function updateSiteSettings(data: Partial<SiteSettings>) {
  await update(SETTINGS_REF, data);
}
