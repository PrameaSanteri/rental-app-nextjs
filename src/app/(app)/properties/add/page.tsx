'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addProperty } from '@/lib/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, 'Property name must be at least 3 characters.'),
  address: z.string().min(5, 'Address must be at least 5 characters.'),
  imageId: z.string().min(1, 'Please select an image.'),
});

export default function AddPropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      imageId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const selectedImage = PlaceHolderImages.find(img => img.id === values.imageId);
    if (!selectedImage) {
        toast({ variant: 'destructive', title: 'Invalid image selected.' });
        setLoading(false);
        return;
    }

    const result = await addProperty({
        ...values,
        imageUrl: selectedImage.imageUrl,
        imageHint: selectedImage.imageHint,
        ownerId: 'pinned-user', // Static owner ID since we don't have users
    });

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
      setLoading(false);
    } else {
      toast({ title: 'Success', description: 'Property added successfully.' });
      router.push('/properties');
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Add New Property</h1>
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>Fill in the information for your new rental property.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Downtown Apartment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Anytown, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Image</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a placeholder image" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PlaceHolderImages.filter(p => p.id.startsWith("property")).map(image => (
                          <SelectItem key={image.id} value={image.id}>{image.description}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Property
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
