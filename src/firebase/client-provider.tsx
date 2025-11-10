'use client';

import { ReactNode, useMemo } from 'react';
import { FirebaseProvider, initializeFirebase } from '.';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseServices = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider
      app={firebaseServices.app}
      auth={firebaseServices.auth}
      db={firebaseServices.db}
      storage={firebaseServices.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
