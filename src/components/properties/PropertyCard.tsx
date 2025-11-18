import Link from 'next/link';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Property } from '@/lib/types';

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`} className="block">
      <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-48 w-full">
          <Image
            src={property.imageUrl}
            alt={`Image of ${property.name}`}
            fill
            className="object-cover"
            data-ai-hint={property.imageHint}
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{property.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground">{property.address}</p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>
              {property.currentGuestCount !== undefined ? `${property.currentGuestCount} guests` : 'N/A'}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
