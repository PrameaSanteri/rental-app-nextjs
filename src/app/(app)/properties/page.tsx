
import { getProperties } from '@/lib/actions';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import Image from 'next/image';

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
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No properties found. Add your first one!</p>
          <Button asChild>
            <Link href="/properties/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Property
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((prop) => (
            <Card key={prop.id} className="flex flex-col overflow-hidden">
                <div className="relative h-48 w-full">
                    <Image
                        src={prop.imageUrl}
                        alt={`Image of ${prop.name}`}
                        fill
                        className="object-cover"
                        data-ai-hint={prop.imageHint}
                    />
                </div>
              <CardContent className="flex-1 p-6">
                <CardTitle className="mb-2 font-headline text-xl">{prop.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{prop.address}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                 <div className="flex items-center pt-4 border-t w-full">
                   <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-bold">
                    {prop.currentGuestCount !== undefined ? prop.currentGuestCount : 'N/A'}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
