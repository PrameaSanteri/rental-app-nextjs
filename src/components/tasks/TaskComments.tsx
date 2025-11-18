'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { addComment, getCommentsForTask } from '@/lib/actions';
import type { MaintenanceTask, TaskComment } from '@/lib/types';
import { Separator } from '../ui/separator';

const commentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty.'),
});

type TaskCommentsProps = {
  task: MaintenanceTask;
};

export default function TaskComments({ task }: TaskCommentsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' },
  });

  const onOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setLoading(true);
      const fetchedComments = await getCommentsForTask(task.id);
      setComments(fetchedComments);
      setLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to comment.' });
        return;
    }

    setLoading(true);
    const result = await addComment({
      taskId: task.id,
      text: values.text,
      userId: user.uid,
      userDisplayName: user.displayName || user.email || 'Anonymous',
    });

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        if(result.newComment) {
            setComments(prev => [result.newComment!, ...prev]);
        }
        form.reset();
    }
    setLoading(false);
  }
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-2 h-auto text-sm font-normal">
            <MessageSquare className="mr-2 h-4 w-4" /> Comments
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Comments for: {task.title}</DrawerTitle>
            <DrawerDescription>View and add comments for this task.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
                <FormField control={form.control} name="text" render={({ field }) => (
                    <FormItem className="flex-grow"><FormControl><Input placeholder="Add a comment..." {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                />
                <Button type="submit" disabled={loading || !user}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
                </Button>
              </form>
            </Form>
          </div>
          <Separator />
          <ScrollArea className="h-64 px-4">
            {loading && !comments.length ? (
                <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : comments.length > 0 ? (
              <div className="space-y-4 py-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(comment.userDisplayName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{comment.userDisplayName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">No comments yet.</div>
            )}
          </ScrollArea>
          <DrawerFooter>
            <DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
