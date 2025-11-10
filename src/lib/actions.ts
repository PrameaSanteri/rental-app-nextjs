'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

import {
  collection,
  addDoc,
  doc,
  setDoc,
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
import type { MaintenanceTask, Property, TaskComment, UserProfile } from './types';
import { PlaceHolderImages } from './placeholder-images';

function getFirebaseServices() {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    return { auth, db, storage };
}

// Auth Actions
export async function login(data: any) {
  const { auth } = getFirebaseServices();
  try {
    await signInWithEmailAndPassword(auth, data.email, data.password);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function register(data: any) {
  const { auth, db } = getFirebaseServices();
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const user = userCredential.user;
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: data.email?.split('@')[0] || 'New User',
    };
    await setDoc(doc(db, 'users', user.uid), userProfile);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function logout() {
  const { auth } = getFirebaseServices();
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Property Actions
export async function addProperty(data: {
  name: string;
  address: string;
  imageUrl: string;
  imageHint: string;
  ownerId: string;
}) {
  const { db } = getFirebaseServices();
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
  const { db } = getFirebaseServices();
  // In a real app, you would filter by ownerId
  const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Property)
  );
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { db } = getFirebaseServices();
  const docRef = doc(db, 'properties', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Property;
  }
  return null;
}

// Task Actions
export async function upsertTask(formData: FormData) {
  const { db, storage } = getFirebaseServices();
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
  const { db } = getFirebaseServices();
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

// Dashboard Data
export async function getDashboardData() {
  // These are simplified mocks. A real implementation would involve more complex queries.
  const stats = {
    totalProperties: 4,
    activeTasks: 8,
    completedTasks: 32,
    overdueTasks: 2,
  };
  const recentTasks: MaintenanceTask[] = [
    { id: '1', title: 'Fix leaky faucet in Apt 3B', propertyId: '1', status: 'In Progress', deadline: Timestamp.fromDate(new Date('2024-08-10')), createdAt: Timestamp.now(), photos: [] },
    { id: '2', title: 'Paint living room', propertyId: '2', status: 'Open', deadline: Timestamp.fromDate(new Date('2024-08-15')), createdAt: Timestamp.now(), photos: [] },
    { id: '3', title: 'Repair broken window', propertyId: '1', status: 'Completed', deadline: null, createdAt: Timestamp.now(), photos: [] },
  ];
  return { stats, recentTasks };
}

// Comment Actions
export async function addComment(data: {
  taskId: string;
  text: string;
  userId: string;
  userDisplayName: string;
}) {
  const { db } = getFirebaseServices();
  try {
    const commentData = {
        ...data,
        createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, `tasks/${data.taskId}/comments`), commentData);
    const newComment = { id: docRef.id, ...commentData } as TaskComment;

    revalidatePath(`/properties/`); // A bit broad, but ensures data is fresh
    return { success: true, newComment };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getCommentsForTask(taskId: string): Promise<TaskComment[]> {
    const { db } = getFirebaseServices();
    const q = query(
        collection(db, `tasks/${taskId}/comments`),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as TaskComment)
    );
}
