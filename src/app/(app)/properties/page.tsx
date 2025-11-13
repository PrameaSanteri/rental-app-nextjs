
import { getProperties } from '@/lib/actions';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react'; // Import Users icon

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Properties</h1>
        <Button asChild>
          <Link href="/properties/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Property
          </Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <p>No properties found. Add your first one!</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((prop) => (
            <Card key={prop.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={prop.imageUrl}
                    alt={`Image of ${prop.name}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <CardTitle className="mb-2 font-headline text-xl">{prop.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{prop.address}</p>
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-bold">
                    {prop.currentGuestCount !== undefined ? prop.currentGuestCount : 'N/A'}
                  </span>
                </div>
                <Button asChild variant="secondary">
                  <Link href={`/properties/${prop.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
