'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OldAdminRedirectLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    router.replace('/administrador');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirigiendo...</p>
    </div>
  );
}
