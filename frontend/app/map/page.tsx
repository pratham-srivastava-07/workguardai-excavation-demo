'use client';

import { useState, useEffect, useRef } from 'react';
import { PersistentMapLayout } from '@/components/map/persistent-map-layout';
import { SearchResults } from '@/components/map/search-results';
import { PostDetail } from '@/components/map/post-detail';
import { CreatePostForm } from '@/components/posts/create-post-form';
import { MakeOfferModal } from '@/components/map/make-offer-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Post {
  id: string;
  type: 'MATERIAL' | 'SERVICE' | 'SPACE';
  title: string;
  description?: string;
  subtype: string;
  quantity?: number;
  unit?: string;
  price?: number;
  latitude: number;
  longitude: number;
  address?: string;
  condition?: string;
  images?: string[];
  distance?: number;
  user?: any;
  company?: any;
  city?: any;
  status: string;
}

export default function MapPage() {
  return (
    <ProtectedRoute>
      <MapPageContent />
    </ProtectedRoute>
  );
}

function MapPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [leftPanelTitle, setLeftPanelTitle] = useState('');
  const [leftPanelContent, setLeftPanelContent] = useState<React.ReactNode>(null);
  const [activeMenuItem, setActiveMenuItem] = useState('map');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedPostForOffer, setSelectedPostForOffer] = useState<Post | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    setMapLoading(true);
    setMapError(null);

    // Wait for container to have dimensions
    const checkContainer = setInterval(() => {
      if (mapContainer.current && mapContainer.current.offsetWidth > 0 && mapContainer.current.offsetHeight > 0) {
        clearInterval(checkContainer);
        
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
        const mapStyle = apiKey 
          ? `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${apiKey}`
          : 'https://demotiles.maplibre.org/style.json'; // Fallback style

        try {
          mapRef.current = new maplibregl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: [-9.1393, 38.7223], // Lisbon default
            zoom: 12,
          });

          mapRef.current.on('load', () => {
            setMapLoading(false);
            setMapError(null);
          });

          mapRef.current.on('error', (e) => {
            console.error('Map error:', e);
            setMapError('Failed to load map. Please check your API key or try refreshing.');
            setMapLoading(false);
          });

          // Add navigation controls
          mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        } catch (error: any) {
          console.error('Error initializing map:', error);
          setMapError(error.message || 'Failed to initialize map');
          setMapLoading(false);
        }
      }
    }, 100);

    // Timeout after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkContainer);
      if (!mapRef.current) {
        setMapError('Map initialization timeout. Please check your internet connection and API key.');
        setMapLoading(false);
      }
    }, 5000);

    return () => {
      clearInterval(checkContainer);
      clearTimeout(timeout);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map markers when posts change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    posts.forEach((post) => {
      const el = document.createElement('div');
      el.className = 'bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer';
      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="white" viewBox="0 0 24 24"><path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"/></svg>`;

      const marker = new maplibregl.Marker(el)
        .setLngLat([post.longitude, post.latitude])
        .addTo(mapRef.current!);

      el.onclick = () => {
        setSelectedPost(post);
        setLeftPanelTitle('Post Details');
        setLeftPanelContent(
          <PostDetail
            post={post}
            onClose={() => {
              setSelectedPost(null);
              setShowLeftPanel(false);
            }}
            onMakeOffer={handleMakeOffer}
            onContact={(postId) => {
              // Handle contact
              console.log('Contact for post:', postId);
            }}
            onRequestPickup={(postId) => {
              // Handle request pickup
              console.log('Request pickup for post:', postId);
            }}
            isAuthenticated={!!localStorage.getItem('accessToken')}
            onAuthRequired={() => {
              // Show auth modal
              window.location.href = '/login';
            }}
          />
        );
        setShowLeftPanel(true);
        mapRef.current?.flyTo({
          center: [post.longitude, post.latitude],
          zoom: 14,
        });
      };

      markersRef.current.push(marker);
    });
  }, [posts]);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setPosts([]);
      return;
    }

    setLoading(true);
    try {
      // Get user location if available
      let lat: number | undefined;
      let lng: number | undefined;

      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      }

      const params = new URLSearchParams({
        query,
        ...(lat && lng ? { latitude: lat.toString(), longitude: lng.toString(), radius: '50' } : {}),
        page: '1',
        limit: '20',
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/posts/search?${params}`);
      const data = await response.json();

      if (data.data) {
        setPosts(data.data);
        setLeftPanelTitle('Search Results');
        setLeftPanelContent(
          <SearchResults
            posts={data.data}
            loading={false}
            onPostClick={(post) => {
              setSelectedPost(post);
              setLeftPanelTitle('Post Details');
              setLeftPanelContent(
                <PostDetail
                  post={post}
                  onClose={() => {
                    setSelectedPost(null);
                    setShowLeftPanel(false);
                  }}
                  onMakeOffer={handleMakeOffer}
                  onContact={handleContact}
                  onRequestPickup={handleRequestPickup}
                  isAuthenticated={true}
                />
              );
            }}
          />
        );
        setShowLeftPanel(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle menu item clicks
  const handleMenuItemClick = async (item: string) => {
    setActiveMenuItem(item);
    if (item === 'create-post') {
      handleCreatePost();
    } else if (item === 'posts') {
      // Load user's posts
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/posts`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.data) {
            setLeftPanelTitle('My Posts');
            setLeftPanelContent(
              <SearchResults
                posts={data.data}
                loading={false}
                onPostClick={(post) => {
                  setSelectedPost(post);
                  setLeftPanelTitle('Post Details');
                  setLeftPanelContent(
                    <PostDetail
                      post={post}
                      onClose={() => {
                        setSelectedPost(null);
                        setShowLeftPanel(false);
                      }}
                      onMakeOffer={(postId) => handleMakeOffer(postId)}
                      onContact={(postId) => handleContact(postId)}
                      onRequestPickup={(postId) => handleRequestPickup(postId)}
                      isAuthenticated={true}
                    />
                  );
                }}
              />
            );
            setShowLeftPanel(true);
          }
        } catch (error) {
          console.error('Error loading posts:', error);
        }
      }
    } else if (item === 'map') {
      setShowLeftPanel(false);
      setShowCreatePost(false);
    }
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
    setLeftPanelTitle('Create Post');
    setLeftPanelContent(
      <CreatePostForm
        onSuccess={() => {
          setShowCreatePost(false);
          setShowLeftPanel(false);
          // Refresh posts
          handleMenuItemClick('posts');
        }}
        onCancel={() => {
          setShowCreatePost(false);
          setShowLeftPanel(false);
        }}
      />
    );
    setShowLeftPanel(true);
  };

  const handleMakeOffer = (postId: string) => {
    const post = posts.find(p => p.id === postId) || selectedPost;
    if (post) {
      setSelectedPostForOffer(post);
      setShowOfferModal(true);
    }
  };

  const handleOfferSuccess = () => {
    setShowOfferModal(false);
    setSelectedPostForOffer(null);
    // Optionally refresh the post details
    if (selectedPost) {
      // Reload post details to show new offer
    }
  };

  const handleContact = (postId: string) => {
    // TODO: Implement messaging
    alert('Messaging feature coming soon!');
  };

  const handleRequestPickup = (postId: string) => {
    // TODO: Implement pickup request
    alert('Pickup request feature coming soon!');
  };

  return (
    <PersistentMapLayout
      initialSearchQuery={searchQuery}
      onSearch={handleSearch}
      showLeftPanel={showLeftPanel}
      onLeftPanelClose={() => {
        setShowLeftPanel(false);
        setSelectedPost(null);
        setShowCreatePost(false);
      }}
      leftPanelTitle={leftPanelTitle}
      leftPanelContent={leftPanelContent}
      activeMenuItem={activeMenuItem}
      onMenuItemClick={handleMenuItemClick}
    >
      <div 
        ref={mapContainer} 
        className="w-full h-full absolute inset-0 z-0"
        style={{ 
          minHeight: '100%', 
          minWidth: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      {/* Map Loading/Error State */}
      {(mapLoading || mapError) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md text-center">
            {mapLoading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-white">Loading map...</p>
              </>
            ) : (
              <>
                <p className="text-red-400 mb-2">Map Error</p>
                <p className="text-gray-300 text-sm mb-4">{mapError}</p>
                <p className="text-gray-500 text-xs">
                  {!process.env.NEXT_PUBLIC_GEOAPIFY_KEY && (
                    <>Missing NEXT_PUBLIC_GEOAPIFY_KEY in .env.local<br /></>
                  )}
                  Check browser console for details
                </p>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Create Post Button - Prominent Floating CTA */}
      <Button
        onClick={handleCreatePost}
        className="absolute bottom-6 right-6 z-50 rounded-full w-16 h-16 shadow-2xl bg-primary hover:bg-primary/90 text-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
        size="lg"
        title="Create New Post"
      >
        <Plus className="w-7 h-7" />
        {/* Tooltip on hover */}
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-800">
          Create New Post
        </span>
      </Button>

      {/* Make Offer Modal */}
      <MakeOfferModal
        open={showOfferModal}
        onOpenChange={setShowOfferModal}
        postId={selectedPostForOffer?.id || ''}
        postTitle={selectedPostForOffer?.title}
        currentPrice={selectedPostForOffer?.price}
        onSuccess={handleOfferSuccess}
      />
    </PersistentMapLayout>
  );
}
