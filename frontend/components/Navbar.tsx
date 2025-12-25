'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const {isLoggedIn, user, logout} = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`sticky top-0 z-50 transition-all duration-700 ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center transition-all duration-700 ${
          scrolled ? 'justify-center gap-8' : 'justify-between'
        }`}
      >
        <Link href="/" className="text-white text-2xl font-bold tracking-tight">
          RenoWise
        </Link>

        <div className={`hidden md:flex gap-8 items-center ${scrolled ? '' : 'ml-auto'}`}>
          <Link
            href="/about"
            className="text-white/90 hover:text-white transition-colors text-sm font-medium"
          >
            About
          </Link>

          {!isLoggedIn && <>
           <Button
            variant="outline"
            className="border-white/20 text-white  hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/login">Login</Link>
          </Button></>}
          
          {/* <div className="relative group">
            <button className="text-white/90 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
              English
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-black border border-white/10 rounded-md shadow-lg hidden group-hover:block py-1">
               {['English', 'Finnish', 'Danish', 'Albanian', 'Portuguese'].map((lang) => (
                 <button key={lang} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10">
                   {lang}
                 </button>
               ))}
            </div>
          </div> */}
         {!isLoggedIn && <>
          <Button
            className="bg-white text-black hover:bg-white/90"
            asChild
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
         </>}
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-black border-white/10">
            <div className="flex flex-col gap-6 mt-8">
              <Link
                href="/about"
                className="text-white text-lg hover:text-white/80 transition-colors"
              >
                About
              </Link>

              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-white text-black hover:bg-white/90" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
}
