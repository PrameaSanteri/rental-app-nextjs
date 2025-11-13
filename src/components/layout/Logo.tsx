import { Wrench } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-primary-foreground font-semibold">
      <div className="p-2 bg-primary rounded-lg">
        <Wrench className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-headline text-foreground">PrameaCARE</span>
    </div>
  );
}
