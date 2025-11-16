'use client'

import { useState } from 'react'
import { MapPin, Star, Container as MapContainer, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Mock data for demonstration
const MOCK_CONTRACTORS = [
  {
    id: 1,
    name: 'Elite Renovations',
    category: 'Kitchen Remodeling',
    rating: 4.8,
    reviews: 124,
    distance: 0.3,
    lat: 40.7128,
    lng: -74.006,
    image: '/kitchen-remodel.png',
  },
  {
    id: 2,
    name: 'Modern Builders',
    category: 'Bathroom Design',
    rating: 4.6,
    reviews: 89,
    distance: 0.8,
    lat: 40.7148,
    lng: -74.004,
    image: '/bathroom-renovation.png',
  },
  {
    id: 3,
    name: 'Eco Construction',
    category: 'Sustainable Renovations',
    rating: 4.9,
    reviews: 156,
    distance: 1.2,
    lat: 40.7108,
    lng: -74.008,
    image: '/green-building.jpg',
  },
  {
    id: 4,
    name: 'Historic Restoration',
    category: 'Restoration Services',
    rating: 4.7,
    reviews: 67,
    distance: 1.5,
    lat: 40.7180,
    lng: -74.002,
    image: '/restoration-work.jpg',
  },
]

export function MapView() {
  const [selectedContractor, setSelectedContractor] = useState<typeof MOCK_CONTRACTORS[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredContractors, setFilteredContractors] = useState(MOCK_CONTRACTORS)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query === '') {
      setFilteredContractors(MOCK_CONTRACTORS)
    } else {
      setFilteredContractors(
        MOCK_CONTRACTORS.filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase())
        )
      )
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-card border-r border-border/50 flex flex-col">
        {/* Search */}
        <div className="p-6 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Listings */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {filteredContractors.map((contractor) => (
              <Card
                key={contractor.id}
                onClick={() => setSelectedContractor(contractor)}
                className={`cursor-pointer overflow-hidden transition-all border-border/50 hover:border-border ${
                  selectedContractor?.id === contractor.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-background hover:bg-secondary'
                }`}
              >
                <div className="aspect-video bg-secondary overflow-hidden">
                  <img
                    src={contractor.image || "/placeholder.svg"}
                    alt={contractor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-lg">{contractor.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{contractor.category}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-medium text-foreground">{contractor.rating}</span>
                      <span className="text-xs text-muted-foreground">({contractor.reviews})</span>
                    </div>
                    <span className="text-xs text-accent font-medium">{contractor.distance} mi</span>
                  </div>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-secondary to-background">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <MapContainer className="w-24 h-24 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground mb-2">Interactive Map</p>
            <p className="text-sm text-muted-foreground/50 max-w-xs">
              Mapbox integration would render an interactive map here with contractor locations and details.
            </p>
          </div>
        </div>

        {/* Map Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredContractors.map((contractor, index) => {
            const x = 20 + (index % 2) * 60
            const y = 20 + Math.floor(index / 2) * 40
            return (
              <button
                key={contractor.id}
                onClick={() => setSelectedContractor(contractor)}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center pointer-events-auto transition-all transform hover:scale-110 ${
                  selectedContractor?.id === contractor.id
                    ? 'bg-primary ring-2 ring-primary/50 scale-110'
                    : 'bg-accent hover:bg-accent/80'
                }`}
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </button>
            )
          })}
        </div>

        {/* Selected Contractor Info Card */}
        {selectedContractor && (
          <div className="absolute bottom-6 right-6 w-80 bg-card border border-border/50 rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedContractor.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedContractor.category}</p>
              </div>
              <button
                onClick={() => setSelectedContractor(null)}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-medium text-foreground">{selectedContractor.rating}</span>
                  <span className="text-sm text-muted-foreground">({selectedContractor.reviews} reviews)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{selectedContractor.distance} miles away</p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Message & Book
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
