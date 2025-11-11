'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthContext';
import Logo from './Logo';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/properties', icon: Building, label: 'Properties' },
];

type AppSidebarProps = {
  isMobile?: boolean;
};

export function AppSidebar({ isMobile = false }: AppSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navContent = (
    <>
      <div className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                  isActive
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return navContent;
  }

  return (
    <aside className="hidden border-r bg-card md:flex md:w-64 md:flex-col">
      {navContent}
    </aside>
  );
}
