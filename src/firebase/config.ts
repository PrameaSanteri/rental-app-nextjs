// src/firebase/config.ts
const isBrowser = typeof window !== 'undefined';

export const firebaseConfig = {
  apiKey: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY : '',
  authDomain: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN : '',
  projectId: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : '',
  storageBucket: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET : '',
  messagingSenderId: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : '',
  appId: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID : '',
};
