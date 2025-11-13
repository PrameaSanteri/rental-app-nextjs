'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Button onClick={handleLoginClick} size="lg">
        Kirjaudu sisään
      </Button>
    </div>
  );
}
