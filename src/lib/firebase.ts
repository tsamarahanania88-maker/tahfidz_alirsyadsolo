/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfigJson from "@/firebase-applet-config.json";

let firebaseConfig: any = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let databaseId: string | undefined = undefined;

// Use config from firebase-applet-config.json if available
if (firebaseConfigJson && firebaseConfigJson.apiKey) {
  firebaseConfig = {
    apiKey: firebaseConfigJson.apiKey,
    authDomain: firebaseConfigJson.authDomain,
    projectId: firebaseConfigJson.projectId,
    storageBucket: firebaseConfigJson.storageBucket,
    messagingSenderId: firebaseConfigJson.messagingSenderId,
    appId: firebaseConfigJson.appId,
  };
  if (firebaseConfigJson.firestoreDatabaseId) {
    databaseId = firebaseConfigJson.firestoreDatabaseId;
  }
}

// Check if all essential keys are provided and are not placeholder values
const rawApiKey = firebaseConfig.apiKey;
const rawProjectId = firebaseConfig.projectId;

const isFirebaseConfigured = !!(
  rawApiKey &&
  rawProjectId &&
  rawApiKey !== "YOUR_API_KEY" &&
  rawProjectId !== "YOUR_PROJECT_ID" &&
  !rawApiKey.startsWith("YOUR_") &&
  !rawProjectId.startsWith("YOUR_")
);

let app;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    if (databaseId) {
      db = getFirestore(app, databaseId);
    } else {
      db = getFirestore(app);
    }
    console.log("Firebase initialized successfully with database:", databaseId || "default");
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.log("Firebase config not found. Running in Local Storage Fallback mode.");
}

export { db, isFirebaseConfigured };
