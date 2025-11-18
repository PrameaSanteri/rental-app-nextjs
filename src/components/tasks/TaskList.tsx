'use client';
import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MaintenanceTask } from '@/lib/types';
import TaskStatusBadge from './TaskStatusBadge';
import TaskFormDialog from './TaskFormDialog';
import TaskComments from './TaskComments';
import { deleteTask } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type TaskListProps = {
  tasks: MaintenanceTask[];
  propertyId?: string;
};

export default function TaskList({ tasks: initialTasks, propertyId }: TaskListProps) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<MaintenanceTask[]>(initialTasks);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();


  const handleTaskCreated = (newTask: MaintenanceTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
    router.refresh();
  };

  const handleTaskUpdated = (updatedTask: MaintenanceTask) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    router.refresh();
  };

  const handleOptimisticDelete = (taskId: string) => {
    if (!propertyId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Cannot delete task without a property context.' });
        return;
    }

    startTransition(() => {
        const originalTasks = tasks;
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

        deleteTask(taskId, propertyId).then(result => {
            if (result.error) {
                setTasks(originalTasks);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete task.' });
            } else {
                toast({ title: 'Success', description: 'Task deleted.' });
                router.refresh();
            }
        });
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks found.</p>
        {propertyId && <div className="mt-4"><TaskFormDialog propertyId={propertyId} onTaskCreated={handleTaskCreated} /></div>}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell><TaskStatusBadge status={task.status} /></TableCell>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>{task.deadline ? format(task.deadline.toDate(), 'PPP') : 'N/A'}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {propertyId && <TaskFormDialog propertyId={propertyId} task={task} onTaskUpdated={handleTaskUpdated} />}
                  <TaskComments task={task} />
                  <DropdownMenuItem 
                    className="text-destructive" 
                    onClick={() => task.id && handleOptimisticDelete(task.id)}
                    disabled={isPending || !propertyId}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
