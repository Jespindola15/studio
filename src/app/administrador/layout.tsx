'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/administrador/login';

  useEffect(() => {
    if (!isUserLoading && !user && !isLoginPage) {
      router.push('/administrador/login');
    }
  }, [user, isUserLoading, router, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-card p-6">
        <Link href="/administrador">
          <Logo />
        </Link>
        <nav className="mt-8 flex flex-col gap-4">
          <Link href="/administrador" className="font-medium text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/administrador/vehiculos" className="font-medium text-muted-foreground hover:text-foreground">
            Vehículos
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
