'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Package } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { cn } from '@/lib/utils';


const navLinks = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/properties', icon: Package, label: 'Properties' },
];

interface AppSidebarProps {
  onLinkClick?: () => void;
}

export function AppSidebar({ onLinkClick }: AppSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLinkClick = () => {
    onLinkClick?.();
  };

  const linkClasses = (href: string) => cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
    {
        "bg-accent text-primary": pathname === href,
    }
  );

  return (
    <aside className='flex flex-col w-full'>
      <div className="flex-1">
        <nav className="grid items-start gap-1 p-4 text-sm font-medium">
            {navLinks.map((link) => (
            <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={linkClasses(link.href)}
            >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
            </Link>
            ))}
            {user?.role === 'admin' && (
                <Link
                    href="/users"
                    onClick={handleLinkClick}
                    className={linkClasses('/users')}
                >
                    <Users className="h-4 w-4" />
                    <span>Manage Users</span>
                </Link>
            )}
        </nav>
      </div>
    </aside>
  );
}
