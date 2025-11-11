'use client';

import { ReactNode } from 'react';
import { FirebaseProvider } from '.';
import { app, auth, db, storage } from './index';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider
      app={app}
      auth={auth}
      db={db}
      storage={storage}
    >
      {children}
    </FirebaseProvider>
  );
}
