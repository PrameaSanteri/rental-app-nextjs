'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Package } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

const navLinks = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/properties', icon: Package, label: 'Properties' },
];

interface AppSidebarProps {
  isMobile?: boolean;
  onLinkClick?: () => void; // Callback to be called when a link is clicked
}

export function AppSidebar({ isMobile, onLinkClick }: AppSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <aside className={`flex-shrink-0 border-r bg-gray-100 p-4 dark:bg-gray-800 ${isMobile ? 'w-full' : 'w-64'}`}>
      <nav className="flex flex-col space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleLinkClick} // Add onClick handler
            className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium ${
              pathname === link.href
                ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}>
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        ))}
        {user?.role === 'admin' && (
            <Link
                href="/users"
                onClick={handleLinkClick} // Add onClick handler
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium ${
                pathname === '/users'
                    ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                    : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}>
                <Users className="h-5 w-5" />
                <span>Manage Users</span>
            </Link>
        )}
      </nav>
    </aside>
  );
}
