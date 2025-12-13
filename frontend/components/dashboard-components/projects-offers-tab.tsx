'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Briefcase, DollarSign, Calendar, Plus } from 'lucide-react';
import { MakeOfferModal } from '@/components/map/make-offer-modal';
import { API_BASE_URL } from '@/constants/env';

interface Project {
  id: string;
  title: string;
  status: string;
  budgetMin?: number;
  budgetMax?: number;
  size?: number;
  createdAt: string;
}

interface Offer {
  id: string;
  amount?: number;
  message?: string;
  status: string;
  createdAt: string;
  post: {
    id: string;
    title: string;
    type: string;
    latitude: number;
    longitude: number;
    address?: string;
  };
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  company?: {
    id: string;
    companyName: string;
    logoUrl?: string;
  };
}

interface Post {
  id: string;
  title: string;
  type: string;
  subtype: string;
  latitude: number;
  longitude: number;
  address?: string;
  price?: number;
  quantity?: number;
  unit?: string;
  condition?: string;
  images?: any;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
}

interface ProjectsOffersTabProps {
  onItemClick?: (item: { type: 'project' | 'offer' | 'post'; id: string; lat: number; lng: number }) => void;
  onMapCenter?: (lat: number, lng: number) => void;
}

export function ProjectsOffersTab({ onItemClick, onMapCenter }: ProjectsOffersTabProps) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [offersMade, setOffersMade] = useState<Offer[]>([]);
  const [offersReceived, setOffersReceived] = useState<Offer[]>([]);
  const [availablePosts, setAvailablePosts] = useState<Post[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedPostForOffer, setSelectedPostForOffer] = useState<Post | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserRole(user.role || '');
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/projects-offers`, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects and offers');
        }

        const data = await response.json();
        setProjects(data.projects || []);
        setOffersMade(data.offersMade || []);
        setOffersReceived(data.offersReceived || []);
        setAvailablePosts(data.availablePosts || []);
      } catch (error) {
        console.error('Error fetching projects and offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (item: { type: 'project' | 'offer' | 'post'; id: string; lat: number; lng: number }) => {
    if (onMapCenter) {
      onMapCenter(item.lat, item.lng);
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const handleMakeOffer = (post: Post) => {
    setSelectedPostForOffer(post);
    setShowOfferModal(true);
  };

  const handleOfferSuccess = () => {
    setShowOfferModal(false);
    setSelectedPostForOffer(null);
    // Refresh data
    window.location.reload();
  };

  return (
    <div className="p-6">
      <Tabs defaultValue={userRole === 'HOMEOWNER' ? 'projects' : userRole === 'COMPANY' ? 'available-posts' : 'offers-received'} className="w-full">
        <TabsList className={`grid w-full bg-gray-900 ${userRole === 'HOMEOWNER' ? 'grid-cols-3' : userRole === 'COMPANY' ? 'grid-cols-4' : 'grid-cols-2'}`}>
          {userRole === 'HOMEOWNER' && (
            <TabsTrigger value="projects" className="cursor-pointer">Projects</TabsTrigger>
          )}
          {userRole === 'COMPANY' && (
            <TabsTrigger value="available-posts" className="cursor-pointer">Available Posts</TabsTrigger>
          )}
          <TabsTrigger value="offers-made" className="cursor-pointer">Offers Made</TabsTrigger>
          <TabsTrigger value="offers-received" className="cursor-pointer">Offers Received</TabsTrigger>
        </TabsList>

        {userRole === 'HOMEOWNER' && (
          <TabsContent value="projects" className="mt-4">
            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No projects yet</p>
              ) : (
                projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-850 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white">{project.title}</CardTitle>
                        </div>
                        <Badge className="bg-gray-700 text-white">
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm text-gray-400">
                        {project.size && <span>Size: {project.size}m²</span>}
                        {project.budgetMin && project.budgetMax && (
                          <span>
                            Budget: €{project.budgetMin.toLocaleString()} - €{project.budgetMax.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        )}

        <TabsContent value="offers-made" className="mt-4">
          <div className="space-y-4">
            {offersMade.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No offers made yet</p>
            ) : (
              offersMade.map((offer) => (
                <Card
                  key={offer.id}
                  className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-850 transition-colors"
                  onClick={() => handleItemClick({
                    type: 'offer',
                    id: offer.id,
                    lat: offer.post.latitude,
                    lng: offer.post.longitude,
                  })}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white">{offer.post.title}</CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                          {offer.post.type}
                        </CardDescription>
                      </div>
                      <Badge className="bg-gray-700 text-white">
                        {offer.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {offer.amount && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-white">€{(offer.amount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {offer.post.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{offer.post.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {userRole === 'COMPANY' && (
          <TabsContent value="available-posts" className="mt-4">
            <div className="space-y-4">
              {availablePosts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No available posts to make offers on</p>
              ) : (
                availablePosts.map((post) => (
                  <Card
                    key={post.id}
                    className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-850 transition-colors"
                    onClick={() => handleItemClick({
                      type: 'post',
                      id: post.id,
                      lat: post.latitude,
                      lng: post.longitude,
                    })}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white">{post.title}</CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            {post.type} • {post.subtype}
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-700 text-white">Available</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {post.price && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-white font-semibold">€{(post.price / 100).toFixed(2)}</span>
                        </div>
                      )}
                      {post.quantity && (
                        <div className="text-sm text-gray-400">
                          Quantity: {post.quantity} {post.unit || 'units'}
                        </div>
                      )}
                      {post.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{post.address}</span>
                        </div>
                      )}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMakeOffer(post);
                        }}
                        className="w-full mt-2 bg-primary hover:bg-primary/90 cursor-pointer"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Make Offer
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        )}

        <TabsContent value="offers-received" className="mt-4">
          <div className="space-y-4">
            {offersReceived.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No offers received yet</p>
            ) : (
              offersReceived.map((offer) => (
                <Card
                  key={offer.id}
                  className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-850 transition-colors"
                  onClick={() => handleItemClick({
                    type: 'offer',
                    id: offer.id,
                    lat: offer.post.latitude,
                    lng: offer.post.longitude,
                  })}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white">{offer.post.title}</CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                          {offer.post.type}
                        </CardDescription>
                      </div>
                      <Badge className="bg-gray-700 text-white">
                        {offer.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {offer.user && (
                      <div className="text-sm text-gray-300">
                        From: {offer.user.name || offer.user.email}
                      </div>
                    )}
                    {offer.company && (
                      <div className="text-sm text-gray-300">
                        From: {offer.company.companyName}
                      </div>
                    )}
                    {offer.amount && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-white">€{(offer.amount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {offer.post.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{offer.post.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Make Offer Modal */}
      {selectedPostForOffer && (
        <MakeOfferModal
          open={showOfferModal}
          onOpenChange={setShowOfferModal}
          postId={selectedPostForOffer.id}
          postTitle={selectedPostForOffer.title}
          currentPrice={selectedPostForOffer.price}
          onSuccess={handleOfferSuccess}
        />
      )}
    </div>
  );
}

