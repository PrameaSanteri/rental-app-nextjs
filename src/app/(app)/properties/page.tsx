
import { getProperties } from '@/lib/actions';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import Image from 'next/image';

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Button asChild>
          <Link href="/properties/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Property
          </Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card className="text-center py-12">
            <CardHeader>
                <CardTitle>No properties found</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground mb-4">Add your first one to get started.</p>
                 <Button asChild>
                    <Link href="/properties/add">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Property
                    </Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((prop) => (
            <Card key={prop.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="relative h-48 w-full">
                    <Image
                        src={prop.imageUrl}
                        alt={`Image of ${prop.name}`}
                        fill
                        className="object-cover"
                        data-ai-hint={prop.imageHint}
                    />
                </div>
              <CardHeader>
                <CardTitle className="text-xl">{prop.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{prop.address}</p>
              </CardContent>
              <CardFooter>
                 <div className="flex items-center text-sm text-muted-foreground">
                   <Users className="mr-2 h-4 w-4" />
                  <span>
                    {prop.currentGuestCount !== undefined ? `${prop.currentGuestCount} guests` : 'N/A'}
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
