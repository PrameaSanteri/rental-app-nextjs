'use server';

import { db, storage } from '@/firebase';
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
  limit,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import type { MaintenanceTask, Property, TaskComment } from './types';
import { analyzeCheckinTimes } from '@/ai/genkit';

// Mock Lodgify API Client
async function getBookingsFromLodgify(propertyId: number): Promise<{ guests: number }[]> {
  // This is a mock. In a real scenario, this would call the Lodgify API.
  // The number of guests is randomized for demonstration.
  console.log(`Fetching bookings for property ${propertyId} from Lodgify...`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  const bookingCount = Math.floor(Math.random() * 3); // 0 to 2 bookings
  const bookings = Array.from({ length: bookingCount }, () => ({ 
    guests: Math.floor(Math.random() * 5) + 1 
  }));
  
  console.log(`Found ${bookings.length} bookings for property ${propertyId}.`);
  return bookings;
}

// --- Property Actions ---
export async function addProperty(data: Omit<Property, 'id' | 'createdAt'>) {
  try {
    await addDoc(collection(db, 'properties'), {
      ...data,
      createdAt: Timestamp.now(),
    });
    revalidatePath('/properties');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getProperties(): Promise<Property[]> {
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const properties = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Property)
    );
  
    // Fetch guest count for each property from the mock Lodgify API
    const propertiesWithGuestCount = await Promise.all(
      properties.map(async (prop) => {
        try {
          if (prop.lodgifyPropertyId) {
            const bookings = await getBookingsFromLodgify(prop.lodgifyPropertyId);
            const totalGuests = bookings.reduce((sum, booking) => sum + booking.guests, 0);
            return { ...prop, currentGuestCount: totalGuests };
          } else {
            console.warn(`Property ${prop.id} is missing a Lodgify Property ID.`);
            return { ...prop, currentGuestCount: 0 };
          }
        } catch (error) {
          console.error(`Failed to fetch bookings for property ${prop.id}:`, error);
          return { ...prop, currentGuestCount: 0 }; // Default to 0 on error
        }
      })
    );
  
    return propertiesWithGuestCount;
}

export async function getPropertyById(id: string): Promise<(Property & { tasks: MaintenanceTask[] }) | null> {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const property = { id: docSnap.id, ...docSnap.data() } as Property;
      const tasks = await getTasksForProperty(id);
      return { ...property, tasks };
    }
  
    return null;
}

// --- Task Actions ---
export async function upsertTask(formData: FormData) {
  try {
    const rawData = formData.get('data') as string;
    if (!rawData) throw new Error('Missing task data');
    
    const data = JSON.parse(rawData);
    const photos = formData.getAll('photos') as File[];
    
    const taskData: Partial<MaintenanceTask> = {
      ...data,
      deadline: data.deadline ? Timestamp.fromDate(new Date(data.deadline)) : null,
    };

    const photoUploads: { url: string; path: string }[] = [];
    for (const photo of photos) {
        if (photo.size > 0) {
            const filePath = `tasks/${data.propertyId}/${Date.now()}-${photo.name}`;
            const storageRef = ref(storage, filePath);
            await uploadBytes(storageRef, photo);
            const downloadURL = await getDownloadURL(storageRef);
            photoUploads.push({ url: downloadURL, path: filePath });
        }
    }

    if (data.id) { // Update existing task
      const docRef = doc(db, 'tasks', data.id);
      const existingTask = (await getDoc(docRef)).data() as MaintenanceTask;
      await updateDoc(docRef, {
        ...taskData,
        photos: [...(existingTask.photos || []), ...photoUploads]
      });
    } else { // Create new task
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdAt: Timestamp.now(),
        photos: photoUploads,
      });
    }

    revalidatePath(`/properties/${data.propertyId}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getTasksForProperty(
  propertyId: string
): Promise<MaintenanceTask[]> {
  const q = query(
    collection(db, 'tasks'),
    where('propertyId', '==', propertyId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as MaintenanceTask)
  );
}


export async function deleteTask(taskId: string, propertyId: string) {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      revalidatePath(`/properties/${propertyId}`);
      revalidatePath('/dashboard');
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting task:", error);
      return { error: error.message };
    }
  }

// --- Dashboard Data ---
export async function getDashboardData() {
    const tasksCol = collection(db, 'tasks');
    const activeTasksQuery = query(tasksCol, where('status', 'in', ['Open', 'In Progress']));
    
    const activeTasksSnap = await getDocs(activeTasksQuery);
    const activeTasks = activeTasksSnap.docs.map(doc => doc.data() as MaintenanceTask);
    const overdueTasks = activeTasks.filter(t => t.deadline && t.deadline.toDate() < new Date()).length;
  
    const stats = {
      activeTasks: activeTasks.length,
      overdueTasks: overdueTasks,
    };
  
    const recentTasksQuery = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'), limit(5));
    const recentTasksSnapshot = await getDocs(recentTasksQuery);
    const recentTasks = recentTasksSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as MaintenanceTask);
  
    return { stats, recentTasks };
  }

// --- Comment Actions ---
export async function addComment(data: {
    taskId: string;
    text: string;
    userId: string;
    userDisplayName: string;
}) {
  try {
    const commentData = {
        ...data,
        createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, `tasks/${data.taskId}/comments`), commentData);
    const newComment = { id: docRef.id, ...commentData } as TaskComment;
    
    try {
        const checkinAnalysis = await analyzeCheckinTimes({ message: data.text });

        const updateData: Partial<Pick<MaintenanceTask, 'checkIn' | 'checkOut'>> = {};

        if (checkinAnalysis.checkIn) {
            updateData.checkIn = Timestamp.fromDate(new Date(checkinAnalysis.checkIn));
        }
        if (checkinAnalysis.checkOut) {
            updateData.checkOut = Timestamp.fromDate(new Date(checkinAnalysis.checkOut));
        }
        
        if (Object.keys(updateData).length > 0) {
            const taskRef = doc(db, 'tasks', data.taskId);
            await updateDoc(taskRef, updateData);
        }
    } catch (aiError) {
        console.error('AI analysis failed:', aiError);
    }
    
    revalidatePath(`/properties/`); 
    return { success: true, newComment };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getCommentsForTask(taskId: string): Promise<TaskComment[]> {
    const q = query(
        collection(db, `tasks/${taskId}/comments`),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as TaskComment)
    );
}
