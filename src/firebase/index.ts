// src/firebase/index.ts
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';
import { FirebaseProvider, useFirebase } from './provider';
import { FirebaseClientProvider } from './client-provider';

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
};

let firebaseServices: FirebaseServices | null = null;

function initializeFirebase(): FirebaseServices {
  if (typeof window === 'undefined') {
    // Return null services on the server
    return {
        app: null,
        auth: null,
        db: null,
        storage: null,
    } as unknown as FirebaseServices;
  }
  
  if (!firebaseServices) {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    firebaseServices = { app, auth, db, storage };
  }

  return firebaseServices;
}

export { 
    initializeFirebase,
    FirebaseProvider,
    useFirebase,
    FirebaseClientProvider
};
