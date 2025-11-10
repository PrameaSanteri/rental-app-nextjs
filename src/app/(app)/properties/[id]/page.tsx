import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPropertyById, getTasksForProperty } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TaskList from '@/components/tasks/TaskList';
import TaskFormDialog from '@/components/tasks/TaskFormDialog';

type PropertyDetailPageProps = {
  params: { id: string };
};

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  const tasks = await getTasksForProperty(params.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Image
            src={property.imageUrl}
            alt={property.name}
            width={600}
            height={400}
            data-ai-hint={property.imageHint}
            className="rounded-lg object-cover w-full aspect-[3/2]"
          />
        </div>
        <div className="md:w-2/3">
            <h1 className="text-3xl font-bold font-headline mb-2">{property.name}</h1>
            <p className="text-lg text-muted-foreground">{property.address}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Maintenance Tasks</CardTitle>
            <CardDescription>All maintenance tasks for {property.name}.</CardDescription>
          </div>
          <TaskFormDialog propertyId={property.id} />
        </CardHeader>
        <CardContent>
          <TaskList tasks={tasks} propertyId={property.id} />
        </CardContent>
      </Card>
    </div>
  );
}
