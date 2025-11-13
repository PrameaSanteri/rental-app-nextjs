'use server';

import { db, storage } from '@/firebase';
import {
  collection,
  addDoc,
  doc,
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

// Property Actions
export async function addProperty(data: {
  name: string;
  address: string;
  imageUrl: string;
  imageHint: string;
  ownerId: string; 
}) {
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
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Property)
  );
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const docRef = doc(db, 'properties', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Property;
  }
  return null;
}

// Task Actions
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

// Dashboard Data
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

// Comment Actions
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

    revalidatePath(`/properties/`); // A bit broad, but ensures data is fresh
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
