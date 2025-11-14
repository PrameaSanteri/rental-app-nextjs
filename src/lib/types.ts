import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export type Property = {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  imageHint: string;
  ownerId: string;
  lodgifyPropertyId: number; // Add Lodgify Property ID
  currentGuestCount?: number; // Add current guest count (optional)
  createdAt: Timestamp;
};

export type MaintenanceTask = {
  id: string;
  title: string;
  description: string;
  propertyId: string;
  status: 'Open' | 'In Progress' | 'Completed';
  deadline: Timestamp | null;
  createdAt: Timestamp;
  photos: { url: string; path: string }[];
};

export type TaskComment = {
  id: string;
  text: string;
  userId: string;
  userDisplayName: string;
  createdAt: Timestamp;
};
