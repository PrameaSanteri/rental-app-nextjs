import type { ReactNode } from 'react';
import Link from 'next/link';
import Logo from '@/components/layout/Logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/50 p-4">
      <div className="mb-8">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      {children}
    </div>
  );
}
