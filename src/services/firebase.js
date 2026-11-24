import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getApp, getApps, initializeApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (Object.values(config).some((valor) => !valor)) {
  throw new Error(
    "As variáveis EXPO_PUBLIC_FIREBASE_* precisam estar definidas no .env",
  );
}

const jaInicializado = getApps().length > 0;
const app = jaInicializado ? getApp() : initializeApp(config);

// eslint-disable-next-line import/namespace
const getReactNativePersistence = firebaseAuth["getReactNativePersistence"];
const usarPersistenciaNativa =
  Platform.OS !== "web" && typeof getReactNativePersistence === "function";

export const auth =
  jaInicializado || !usarPersistenciaNativa
    ? firebaseAuth.getAuth(app)
    : firebaseAuth.initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export const db = getFirestore(app);
