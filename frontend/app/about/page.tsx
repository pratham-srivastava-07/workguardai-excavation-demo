'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Users, MapPin, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Renowise
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
              <Link href="/map" className="text-gray-300 hover:text-white">Map</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About Renowise</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connecting homeowners, companies, and cities to create a sustainable circular economy for construction materials and services.
          </p>
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Renowise is revolutionizing the construction industry by creating a marketplace where materials, services, and spaces can be shared, reused, and repurposed. We believe in building a sustainable future where nothing goes to waste.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our platform connects homeowners looking for renovation materials, companies offering services, and cities managing public resources—all on an interactive map that makes discovery and connection seamless.
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              To become the leading platform for sustainable construction practices, reducing waste by 50% and creating a circular economy where every material finds its next purpose.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <MapPin className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Map-First Experience</h3>
            <p className="text-gray-400">
              Everything is location-based. Find materials, services, and spaces near you with our interactive map interface.
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Three Actor Types</h3>
            <p className="text-gray-400">
              Homeowners, Companies, and Cities—each with unique needs and capabilities, all connected on one platform.
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <Heart className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sustainable Future</h3>
            <p className="text-gray-400">
              Every transaction on Renowise contributes to reducing construction waste and building a circular economy.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Search</h3>
              <p className="text-gray-400 text-sm">
                Search for materials, services, or spaces on our interactive map
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Discover</h3>
              <p className="text-gray-400 text-sm">
                Browse listings with detailed information, images, and location
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Connect</h3>
              <p className="text-gray-400 text-sm">
                Make offers, contact sellers, or request pickups directly
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Complete</h3>
              <p className="text-gray-400 text-sm">
                Finalize transactions and contribute to a sustainable future
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gray-900 rounded-lg p-12 border border-gray-800">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users already using Renowise to find materials, offer services, and build sustainably.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg">
              <Link href="/signup">Sign Up Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/map">Explore Map</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Renowise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

