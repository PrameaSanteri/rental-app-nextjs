// src/firebase/provider.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { FirebaseApp } from 'firebase/app';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  storage: FirebaseStorage | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
    app: null,
    auth: null,
    db: null,
    storage: null
});

interface FirebaseProviderProps extends FirebaseContextValue {
    children: ReactNode;
}

export function FirebaseProvider({ children, app, auth, db, storage }: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={{ app, auth, db, storage }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
