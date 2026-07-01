import { initializeApp, getApps } from "firebase/app";
import { getDataConnect } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/generated";

let _dc: ReturnType<typeof getDataConnect> | null = null;

export function getServerDC() {
  if (!_dc) {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is not set");
    }
    if (getApps().length === 0 || !getApps().find(a => a.name === "server-dc")) {
      initializeApp({
        apiKey,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
      }, "server-dc");
    }
    _dc = getDataConnect(getApps().find(a => a.name === "server-dc")! || getApps()[0], connectorConfig);
  }
  return _dc;
}
