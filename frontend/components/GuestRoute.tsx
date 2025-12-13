// components/GuestRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/map');
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}