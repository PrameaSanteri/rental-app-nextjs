import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPropertyById } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TaskList from '@/components/tasks/TaskList';
import TaskFormDialog from '@/components/tasks/TaskFormDialog';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const propertyData = await getPropertyById(params.id);

  if (!propertyData) {
    notFound();
  }

  const { tasks, ...property } = propertyData;

  return (
    <div className="space-y-8">
      <div className="relative h-64 w-full rounded-lg overflow-hidden">
         <Image
            src={property.imageUrl}
            alt={`Image of ${property.name}`}
            fill
            className="object-cover"
            data-ai-hint={property.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
             <h1 className="text-4xl font-bold text-white">{property.name}</h1>
             <p className="text-lg text-white/90">{property.address}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Maintenance Tasks</CardTitle>
            <CardDescription>All tasks associated with {property.name}.</CardDescription>
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
