import Link from 'next/link';
import { PlusCircle, Wrench, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardData } from '@/lib/actions';
import TaskList from '@/components/tasks/TaskList';

export default async function DashboardPage() {
  const { stats, recentTasks } = await getDashboardData();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <Button asChild>
          <Link href="/properties/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdueTasks}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Maintenance Tasks</CardTitle>
          <CardDescription>An overview of the latest tasks across all your properties.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskList tasks={recentTasks} />
        </CardContent>
      </Card>
    </div>
  );
}
