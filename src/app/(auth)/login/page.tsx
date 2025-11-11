'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound } from 'lucide-react';

const PIN_CODE = '1234';

const formSchema = z.object({
  pin: z.string().length(4, { message: 'PIN must be 4 digits.' }),
});

export default function PinLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    if (values.pin === PIN_CODE) {
      login();
      toast({
        title: 'Login Successful',
        description: "You're being redirected to your dashboard.",
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'Invalid PIN code.',
      });
      form.reset();
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <KeyRound className="w-12 h-12 text-muted-foreground mb-4" />
        <CardTitle>Enter PIN</CardTitle>
        <CardDescription>
          Enter the 4-digit PIN to access the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN Code</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      maxLength={4}
                      placeholder="••••" 
                      {...field} 
                      className="text-center text-2xl tracking-[1.5rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Unlock
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
