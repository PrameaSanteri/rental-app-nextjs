'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, PlusCircle, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { upsertTask } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { MaintenanceTask } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  status: z.enum(['Open', 'In Progress', 'Completed']),
  deadline: z.date().optional().nullable(),
});

type TaskFormDialogProps = {
  propertyId: string;
  task?: MaintenanceTask;
  onTaskCreated?: (task: MaintenanceTask) => void;
  onTaskUpdated?: (task: MaintenanceTask) => void;
  children?: React.ReactNode;
};

export default function TaskFormDialog({ propertyId, task, onTaskCreated, onTaskUpdated, children }: TaskFormDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'Open',
      deadline: task?.deadline ? task.deadline.toDate() : undefined,
    },
  });

   // Reset form when dialog opens for a new task
   React.useEffect(() => {
    if (open) {
      form.reset({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'Open',
        deadline: task?.deadline ? task.deadline.toDate() : undefined,
      });
      setPhotos([]);
    }
  }, [open, task, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPhotos(Array.from(event.target.files));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('data', JSON.stringify({ ...values, propertyId, id: task?.id }));
    photos.forEach((photo) => {
        formData.append('photos', photo);
    });

    const result = await upsertTask(formData);

    setLoading(false);

    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        toast({ title: 'Success', description: `Task ${task ? 'updated' : 'created'} successfully.` });
        setOpen(false);
        // Let the parent component handle optimistic updates if needed
        if (task && onTaskUpdated) {
            // A bit of a hack to create the updated task object
            const updatedTask = { ...task, ...values, deadline: values.deadline ? Timestamp.fromDate(values.deadline) : null};
            onTaskUpdated(updatedTask);
        } else if (!task && onTaskCreated) {
            // Server should return the created task ideally, for now we just refresh
            router.refresh();
        } else {
            router.refresh();
        }
    }
  }

  const trigger = children ? (
    <div onClick={() => setOpen(true)} className="w-full">
      {children}
    </div>
  ) : (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" /> Add Task
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="deadline" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover><FormMessage /></FormItem>
              )}
            />
            
            {task?.checkIn && (
              <FormItem>
                <FormLabel>Check-In Time (from comment)</FormLabel>
                <p className="text-sm pt-2 text-muted-foreground">
                  {format(task.checkIn.toDate(), 'PPP p')}
                </p>
              </FormItem>
            )}

            {task?.checkOut && (
              <FormItem>
                <FormLabel>Check-Out Time (from comment)</FormLabel>
                <p className="text-sm pt-2 text-muted-foreground">
                  {format(task.checkOut.toDate(), 'PPP p')}
                </p>
              </FormItem>
            )}

             <FormItem>
              <FormLabel>Photos</FormLabel>
              <FormControl>
                <Input type="file" multiple onChange={handleFileChange} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {task ? 'Save Changes' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
