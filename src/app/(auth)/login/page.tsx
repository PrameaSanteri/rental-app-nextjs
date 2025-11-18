'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


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
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleLogin = () => {
    if (!pin) {
        toast({ title: 'Error', description: 'Please enter a PIN.', variant: 'destructive' });
        return;
    }
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

  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Enter your PIN to access the dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Your PIN Code"
          className="text-center text-lg h-12"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          autoFocus
        />
        <Button onClick={handleLogin} disabled={loading} className="w-full" size="lg">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </CardContent>
    </Card>
  );
}
