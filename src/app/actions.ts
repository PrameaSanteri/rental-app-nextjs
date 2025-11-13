'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/firebase';

export async function deleteTask(taskId: string) {
  try {
    await firestore.collection('maintenanceTasks').doc(taskId).delete();
    revalidatePath('/dashboard'); // Revalidate the page to reflect the changes
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task.' };
  }
}
