'use client';

import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { SearchBar } from '@/components/Search';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Building2, Hammer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  console.log('Geoapify key:', process.env.NEXT_PUBLIC_GEOAPIFY_KEY)
  const { isLoggedIn, user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Navbar />

      <main>
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center space-y-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Find Renovation Services
                <br />
                <span className="text-white/80">Near You</span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto">
                Connect with trusted renovation companies, discover quality materials,
                and find the perfect projects on our interactive map platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SearchBar />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 text-lg px-8"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-black hover:text-white hover:bg-white/10 text-lg px-8"
                asChild
              >
                <Link href="/map">Explore Map</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold">
                Everything You Need
              </h2>
              <p className="text-xl text-white/70">
                All renovation resources in one place
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <CardContent className="pt-6 space-y-4 cursor-pointer">
                    <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Find Companies</h3>
                    <p className="text-white/70">
                      Discover verified renovation companies and service providers
                      near your location with detailed profiles and reviews.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <CardContent className="pt-6 space-y-4 cursor-pointer">
                    <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Quality Materials</h3>
                    <p className="text-white/70">
                      Browse and purchase high-quality renovation materials from
                      trusted suppliers in your area.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <CardContent className="pt-6 space-y-4 cursor-pointer">
                    <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
                      <Hammer className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Post Projects</h3>
                    <p className="text-white/70">
                      Share your renovation projects and connect with the right
                      professionals to bring your vision to life.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-4xl sm:text-5xl font-bold">
                Ready to Start?
              </h2>
              <p className="text-xl text-white/70">
                Join thousands of users connecting through our platform
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 text-lg px-12"
                asChild
              >
                <Link href="/signup">Sign Up Now</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-white/60">
          <p>&copy; 2024 Renowise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
