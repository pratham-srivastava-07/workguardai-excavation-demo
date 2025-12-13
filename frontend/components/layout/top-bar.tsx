'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  isAuthenticated?: boolean;
  user?: {
    name?: string;
    role?: string;
  };
  onLogout?: () => void;
}

export function TopBar({ onSearch, searchQuery = '', isAuthenticated = false, user, onLogout }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="h-16 bg-black border-b border-gray-800 flex items-center justify-between px-4 md:px-6 z-50 relative">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-white">Renowise</span>
      </Link>

      {/* Search Bar - Centered */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 md:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            name="search"
            type="text"
            placeholder="Search materials, services, projects, or location..."
            defaultValue={searchQuery}
            className="pl-10 w-full bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800"
          />
        </div>
      </form>

      {/* Menu Items - Desktop */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
          About
        </Link>
        <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
          Contact
        </Link>
        <Link href="/homeowners" className="text-sm text-gray-300 hover:text-white">
          Homeowners
        </Link>
        <Link href="/businesses" className="text-sm text-gray-300 hover:text-white">
          Businesses
        </Link>
        <Link href="/cities" className="text-sm text-gray-300 hover:text-white">
          Cities
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-2">
        {isAuthenticated ? (
          <>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300">
              <User className="w-4 h-4" />
              <span>{user?.name || 'User'}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <LogIn className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Sign In</span>
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black border-b border-gray-800 md:hidden">
          <div className="flex flex-col p-4 space-y-3">
            <Link href="/about" className="text-sm text-gray-300">About</Link>
            <Link href="/contact" className="text-sm text-gray-300">Contact</Link>
            <Link href="/homeowners" className="text-sm text-gray-300">Homeowners</Link>
            <Link href="/businesses" className="text-sm text-gray-300">Businesses</Link>
            <Link href="/cities" className="text-sm text-gray-300">Cities</Link>
          </div>
        </div>
      )}
    </div>
  );
}

