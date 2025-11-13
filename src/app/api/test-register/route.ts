
import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

export async function GET() {
  // Initialize Firebase Admin SDK on-demand inside the handler
  if (!admin.apps.length) {
    // This check ensures that we only initialize the app once
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.MY_FIREBASE_CLIENT_EMAIL && process.env.MY_FIREBASE_PRIVATE_KEY) {
      const serviceAccount = {
        project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        client_email: process.env.MY_FIREBASE_CLIENT_EMAIL,
        private_key: process.env.MY_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };

      admin.initializeApp({
        // The ServiceAccount type definitions seem to expect camelCase, but the runtime requires snake_case.
        // We cast to `any` to bypass the TypeScript type checker.
        credential: admin.credential.cert(serviceAccount as any),
      });
    }
  }

  // If initialization still failed (e.g., missing env vars at runtime), return an error.
  if (!admin.apps.length) {
    console.error('Firebase Admin SDK initialization failed. Check server environment variables.');
    return NextResponse.json({ message: 'Server configuration error: Firebase Admin SDK not initialized.' }, { status: 500 });
  }

  try {
    const user = await admin.auth().createUser({
      email: 'testuser@example.com',
      password: 'pramea2020',
    });
    return NextResponse.json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error creating user', error: { message: errorMessage } }, { status: 500 });
  }
}
