import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getProperties } from '@/lib/actions';

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Properties</h1>
        <Button asChild>
          <Link href="/properties/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      {properties.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id}>
              <CardHeader className="p-0">
                <Image
                  src={property.imageUrl}
                  alt={property.name}
                  width={600}
                  height={400}
                  data-ai-hint={property.imageHint}
                  className="rounded-t-lg object-cover aspect-[3/2]"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{property.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{property.address}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/properties/${property.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
            <Home className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No properties yet</h2>
            <p className="text-muted-foreground mb-4">Get started by adding your first rental property.</p>
            <Button asChild>
              <Link href="/properties/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Property
              </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
