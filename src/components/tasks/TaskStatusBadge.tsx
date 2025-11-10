import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MaintenanceTask } from '@/lib/types';

type TaskStatusBadgeProps = {
  status: MaintenanceTask['status'];
  className?: string;
};

export default function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  const statusStyles = {
    'Open': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
    'Completed': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  };

  return (
    <Badge variant="outline" className={cn('font-normal', statusStyles[status], className)}>
      {status}
    </Badge>
  );
}
