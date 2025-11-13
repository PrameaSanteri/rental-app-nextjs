'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Hardcoded user for now
const USERS = [
  {
    name: 'Santeri',
    pin: '12345678',
    role: 'admin',
  },
];

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = () => {
    setLoading(true);
    const user = USERS.find((u) => u.pin === pin);

    if (user) {
      login(user);
      toast({ title: 'Success', description: `Welcome, ${user.name}!` });
      router.push('/dashboard');
    } else {
      toast({ title: 'Error', description: 'Invalid PIN', variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-xs p-8 space-y-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center">Enter PIN</h1>
        <Input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN Code"
          className="text-center"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </div>
  );
}
