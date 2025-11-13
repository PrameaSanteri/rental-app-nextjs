
import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Helper function to initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    // Ensure environment variables are loaded
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.MY_FIREBASE_CLIENT_EMAIL && process.env.MY_FIREBASE_PRIVATE_KEY) {
      const serviceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.MY_FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.MY_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      console.warn("Firebase Admin environment variables not set. Sync will not work.");
    }
  }
  return admin.firestore();
}

/**
 * This is the main function that will be triggered by a cron job.
 * It fetches today's bookings from Lodgify, calculates the number of guests
 * for each property, and updates the data in Firestore.
 */
export async function GET() {
  const lodgifyApiKey = process.env.LODGIFY_API_KEY;
  if (!lodgifyApiKey) {
    console.error('LODGIFY_API_KEY is not set in environment variables.');
    return NextResponse.json({ success: false, error: 'Lodgify API key not configured.' }, { status: 500 });
  }

  try {
    const db = initializeFirebaseAdmin();

    // 1. Fetch all bookings from Lodgify that are currently active
    // This uses the more efficient 'stayFilter=Current' parameter.
    const lodgifyUrl = 'https://api.lodgify.com/v2/reservations/bookings?stayFilter=Current&includeCount=false&includeTransactions=false';
    
    const response = await fetch(lodgifyUrl, {
      headers: {
        'X-ApiKey': lodgifyApiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch data from Lodgify: ${response.statusText} - ${errorBody}`);
    }

    const bookings = await response.json();

    // 2. Calculate guest count per property ID
    const guestCountByPropertyId: { [key: number]: number } = {};
    if (bookings && bookings.items) {
        for (const booking of bookings.items) {
            const propertyId = booking.property.id;
            const guests = booking.guests || 0;
            guestCountByPropertyId[propertyId] = (guestCountByPropertyId[propertyId] || 0) + guests;
        }
    }

    // 3. Check for potential updates without writing to Firestore (DRY RUN)
    const propertiesRef = db.collection('properties');
    const snapshot = await propertiesRef.get();
    
    let updatedCount = 0;
    const updatesToLog: { [key: string]: any } = {};

    snapshot.docs.forEach(doc => {
      const propertyData = doc.data();
      const lodgifyId = propertyData.lodgifyPropertyId;
      
      const guestCount = lodgifyId ? guestCountByPropertyId[lodgifyId] || 0 : 0;

      // Check if the count is different to see what would be updated
      if (propertyData.currentGuestCount !== guestCount) {
        updatesToLog[doc.id] = { 
          propertyName: propertyData.name || 'Unknown', 
          oldGuestCount: propertyData.currentGuestCount, 
          newGuestCount: guestCount 
        };
        updatedCount++;
      }
    });

    // The actual database write operation is disabled to ensure safety.
    // To enable writes, you would uncomment the following block and remove the dry run logic.
    /*
    if (updatedCount > 0) {
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            const propertyData = doc.data();
            if (updatesToLog[doc.id]) {
                batch.update(doc.ref, { currentGuestCount: updatesToLog[doc.id].newGuestCount });
            }
        });
        await batch.commit();
    }
    */

    console.log(`[DRY RUN] Lodgify sync check complete. ${updatedCount} properties would be updated.`);
    if (updatedCount > 0) {
        console.log('[DRY RUN] Changes that would be made:', JSON.stringify(updatesToLog, null, 2));
    }

    return NextResponse.json({
      success: true,
      status: 'DRY_RUN_ONLY',
      message: 'Data fetched from Lodgify, but no database writes were performed.',
      updated_properties_count: updatedCount,
      updates_that_would_be_made: updatesToLog
    });

  } catch (error: any) {
    console.error('Error during Lodgify sync (dry run):', error);
    return NextResponse.json({ success: false, error: error.message, status: 'DRY_RUN_FAILED' }, { status: 500 });
  }
}
