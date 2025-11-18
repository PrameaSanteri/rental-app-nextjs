'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
     <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <Skeleton className="h-24 w-48" />
           <div className="space-y-2 mt-4">
             <Skeleton className="h-4 w-[250px]" />
           </div>
        </div>
      </div>
  );
}
