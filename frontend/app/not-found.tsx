'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Map, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-gray-900">
            <Link href="/map">
              <Map className="w-4 h-4 mr-2" />
              Go to Map
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

