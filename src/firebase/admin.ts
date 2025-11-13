import * as admin from 'firebase-admin';

// Initialize the app with a service account, granting admin privileges
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const firestore = admin.firestore();
