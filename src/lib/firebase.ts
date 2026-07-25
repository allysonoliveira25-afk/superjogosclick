import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// The "lite" Firestore SDK is REST-based (one-shot reads/writes only, no
// onSnapshot). We only ever do one-shot reads in this app, and Cloudflare
// Workers blocks the dynamic code generation the full SDK's realtime
// WebChannel/gRPC-Web layer relies on ("EvalError: Code generation from
// strings disallowed"), so the full "firebase/firestore" package crashes
// every SSR request there. Lite avoids that entirely.
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
