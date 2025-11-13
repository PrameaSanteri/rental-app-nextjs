'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user?.role !== 'admin') {
    return <p>Loading or unauthorized...</p>; // Or a loading spinner
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      {/* User management UI will go here */}
    </div>
  );
}
