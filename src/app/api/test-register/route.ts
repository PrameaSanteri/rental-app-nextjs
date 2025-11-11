'use server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { NextResponse } from 'next/server';

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (
  !getApps().find(
    (app) => app?.name === 'test-register'
  )
) {
  initializeApp(
    {
      credential: cert(serviceAccount),
    },
    'test-register'
  );
}

export async function GET() {
  try {
    const auth = getAuth(getApps().find((app) => app?.name === 'test-register'));
    const email = 'testuser@example.com';
    // Check if user already exists
    try {
      const user = await auth.getUserByEmail(email);
      return NextResponse.json({ message: `Dummy user ${user.email} already exists.` });
    } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
            throw error;
        }
    }

    await auth.createUser({
      email,
      password: 'password123',
    });
    return NextResponse.json({ message: `Dummy user ${email} created successfully!` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
