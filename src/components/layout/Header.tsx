
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, UserCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-primary">
          PrameaCARE
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center transition-colors hover:text-primary',
                pathname === href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
            <Link href="/properties/add">
                 <button className="flex items-center justify-center font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full p-2">
                    <PlusCircle className="h-6 w-6" />
                </button>
            </Link>
            <Link href="/profile">
                <button className="flex items-center justify-center font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full p-2">
                    <UserCircle className="h-6 w-6" />
                </button>
            </Link>
        </div>
      </div>
    </header>
  );
}
