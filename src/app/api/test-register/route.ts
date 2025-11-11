'use server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NextResponse } from 'next/server';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase client app if not already initialized
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig, 'test-register-client');
const auth = getAuth(app);

export async function GET() {
  try {
    const email = 'testuser@example.com';
    const password = 'password123';

    // Try to sign in to check if user exists.
    // This is a client-side way to check for existence without admin privileges.
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return NextResponse.json({ message: `Dummy user ${email} already exists.` });
    } catch (error: any) {
        if (error.code !== 'auth/invalid-credential' && error.code !== 'auth/user-not-found') {
            // If it's another error (like network), throw it.
            throw error;
        }
        // If user not found or invalid credential, we can proceed to create.
    }

    // Create the user
    await createUserWithEmailAndPassword(auth, email, password);
    return NextResponse.json({ message: `Dummy user ${email} created successfully!` });

  } catch (error: any) {
    // Distinguish between user already existing and other errors during creation
    if (error.code === 'auth/email-already-in-use') {
        return NextResponse.json({ message: `Dummy user testuser@example.com already exists.` });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
