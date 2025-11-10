import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MaintenanceTask } from '@/lib/types';
import TaskStatusBadge from './TaskStatusBadge';
import TaskFormDialog from './TaskFormDialog';
import TaskComments from './TaskComments';

type TaskListProps = {
  tasks: MaintenanceTask[];
  propertyId?: string;
};

export default function TaskList({ tasks, propertyId }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks found.</p>
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
            <TableCell>
              <TaskStatusBadge status={task.status} />
            </TableCell>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>
              {task.deadline ? format(task.deadline.toDate(), 'PPP') : 'N/A'}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {propertyId && <TaskFormDialog propertyId={propertyId} task={task} />}
                  <TaskComments task={task} />
                  <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
