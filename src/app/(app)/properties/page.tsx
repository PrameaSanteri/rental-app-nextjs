import { getProperties } from '@/lib/actions';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';


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
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
}
