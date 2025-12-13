'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('HOMEOWNER' | 'COMPANY' | 'CITY')[];
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRole = () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (!token || !userData) {
        router.push('/login?redirect=' + window.location.pathname);
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (!user.role || !allowedRoles.includes(user.role)) {
          // Redirect to appropriate dashboard based on role
          if (user.role === 'HOMEOWNER') {
            router.push('/homeowner-dashboard');
          } else if (user.role === 'COMPANY') {
            router.push('/company-dashboard');
          } else if (user.role === 'CITY') {
            router.push('/city-dashboard');
          } else {
            router.push('/map');
          }
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkRole();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

