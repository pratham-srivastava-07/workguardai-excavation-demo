'use client';

import { useState, useEffect, useRef } from 'react';
import { PersistentMapLayout } from '@/components/map/persistent-map-layout';
import { SearchResults } from '@/components/map/search-results';
import { PostDetail } from '@/components/map/post-detail';
import { CreatePostForm } from '@/components/posts/create-post-form';
import { MakeOfferModal } from '@/components/map/make-offer-modal';
import { OrdersTab } from '@/components/dashboard-components/orders-tab';
import { ProjectsOffersTab } from '@/components/dashboard-components/projects-offers-tab';
import { HelpTab } from '@/components/dashboard-components/help-tab';
import { MessagesTab } from '@/components/dashboard-components/messages-tab';
import { WalletTab } from '@/components/dashboard-components/wallet-tab';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import { API_BASE_URL } from '@/constants/env';

interface Post {
  id: string;
  type: 'MATERIAL' | 'SERVICE' | 'SPACE' | 'VEHICLE';
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
  userId?: string;
  user?: any;
  company?: any;
  city?: any;
  status: string;
  // New fields for entities
  entityType?: 'CITY' | 'BUSINESS' | 'HOMEOWNER';
  subOptions?: string[]; // e.g., ['Projects', 'Tenders']
}

const MOCK_ENTITIES: Post[] = [
  {
    id: 'mock-city-1',
    type: 'SPACE', // Fallback type
    entityType: 'CITY',
    title: 'City of Lisbon',
    description: 'Capital city with ongoing urban projects.',
    subtype: 'Municipality',
    latitude: 38.7223,
    longitude: -9.1393,
    status: 'AVAILABLE',
    city: { cityName: 'Lisbon' },
    subOptions: ['Projects', 'Tenders', 'Materials', 'Spaces'],
    address: 'Praça do Comércio, Lisbon'
  },
  {
    id: 'mock-business-1',
    type: 'SERVICE',
    entityType: 'BUSINESS',
    title: 'BuildRight Construction',
    description: 'Premium construction services and materials.',
    subtype: 'General Contractor',
    latitude: 38.7423,
    longitude: -9.1593,
    status: 'AVAILABLE',
    company: { companyName: 'BuildRight Construction' },
    subOptions: ['Services', 'Materials', 'Spaces', 'Transportation'],
    address: 'Av. da Liberdade, Lisbon'
  },
  {
    id: 'mock-homeowner-1',
    type: 'SPACE',
    entityType: 'HOMEOWNER',
    title: 'Johns Renovation',
    description: 'Renovating my historic apartment.',
    subtype: 'Residential',
    latitude: 38.7123,
    longitude: -9.1293,
    status: 'AVAILABLE',
    user: { name: 'John Doe', role: 'HOMEOWNER' },
    subOptions: ['Spaces', 'Materials', 'Projects', 'Transportation'],
    address: 'Alfama, Lisbon'
  }
];

export default function MapPage() {
  return (
    <>
      <MapPageContent />
    </>
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

    // Filter mock entities based on search
    const filteredMock = searchQuery
      ? MOCK_ENTITIES.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.subtype.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : MOCK_ENTITIES;

    // Add new markers
    const allItems = [...posts, ...filteredMock];

    allItems.forEach((post) => {
      const el = document.createElement('div');

      // Determine color/icon based on entity type
      let bgClass = 'bg-primary';
      let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="white" viewBox="0 0 24 24"><path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"/></svg>`;

      if (post.entityType === 'CITY') {
        bgClass = 'bg-blue-600';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="2"></line><line x1="6" y1="2" x2="6" y2="22"></line><line x1="18" y1="2" x2="18" y2="22"></line></svg>`;
      } else if (post.entityType === 'BUSINESS') {
        bgClass = 'bg-orange-600';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 21v-8H7v8"/><path d="M9 9h1"/><path d="M14 9h1"/><path d="M9 13h1"/><path d="M14 13h1"/></svg>`;
      } else if (post.entityType === 'HOMEOWNER') {
        bgClass = 'bg-green-600';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
      }

      // Override for VEHICLE type
      if (post.type === 'VEHICLE') {
        bgClass = 'bg-red-600';
        // Car icon
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`;
      }

      el.className = `${bgClass} text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform`;
      el.innerHTML = iconSvg;

      const marker = new maplibregl.Marker(el)
        .setLngLat([post.longitude, post.latitude])
        .addTo(mapRef.current!);

      el.onclick = () => {
        setSelectedPost(post);
        centerMap(post.latitude, post.longitude);
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
            showOfferButton={shouldShowOfferButton(post)}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            currentUserId={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : undefined}
          />
        );
        setShowLeftPanel(true);
      };

      // Add cursor pointer style
      el.style.cursor = 'pointer';

      markersRef.current.push(marker);
    });
  }, [posts]);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setPosts([]); // Keep empty or maybe show MOCK_ENTITIES by default? User said "show those homeowners...".
      // Let's show mock entities when search is empty or just "near location" is implied
      // For now, render MOCK_ENTITIES is handled in the map effect via allItems
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

      const response = await fetch(`${API_BASE_URL}/posts/search?${params}`);
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
              centerMap(post.latitude, post.longitude);
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
                  showOfferButton={shouldShowOfferButton(post)}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                  currentUserId={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : undefined}
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

  // Center map on coordinates
  const centerMap = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 1000,
      });
    }
  };

  // Handle menu item clicks
  const handleMenuItemClick = async (item: string) => {
    setActiveMenuItem(item);

    if (item === 'map') {
      // Map: collapse left panel
      setShowLeftPanel(false);
      setShowCreatePost(false);
      setSelectedPost(null);
      return;
    }

    // All other items: expand left panel
    setShowLeftPanel(true);

    if (item === 'create-post') {
      handleCreatePost();
    } else if (item === 'posts') {
      // Load user's posts
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/posts`, {
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
                  centerMap(post.latitude, post.longitude);
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
                      showOfferButton={shouldShowOfferButton(post)}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                      currentUserId={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : undefined}
                    />
                  );
                }}
              />
            );
          }
        } catch (error) {
          console.error('Error loading posts:', error);
        }
      }
    } else if (item === 'projects') {
      setLeftPanelTitle('Projects / Offers');
      setLeftPanelContent(
        <ProjectsOffersTab
          onItemClick={(item) => {
            centerMap(item.lat, item.lng);
          }}
          onMapCenter={centerMap}
        />
      );
    } else if (item === 'orders') {
      // Only allow Company and City to access orders
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.role === 'HOMEOWNER') {
            // Redirect homeowners away from orders
            setShowLeftPanel(false);
            return;
          }
        } catch {
          // Invalid user data, allow access (will be checked on backend)
        }
      }
      setLeftPanelTitle('Orders');
      setLeftPanelContent(
        <OrdersTab
          onOrderClick={(order) => {
            // Handle order click if needed
          }}
          onMapCenter={centerMap}
        />
      );
    } else if (item === 'messages') {
      setLeftPanelTitle('Messages');
      setLeftPanelContent(<MessagesTab />);
    } else if (item === 'wallet') {
      setLeftPanelTitle('Wallet / Payments');
      setLeftPanelContent(<WalletTab />);
    } else if (item === 'help') {
      setLeftPanelTitle('Help');
      setLeftPanelContent(<HelpTab />);
    }
  };

  // Check if user can make offer on this post (not their own)
  const shouldShowOfferButton = (post: Post): boolean => {
    const userData = localStorage.getItem('user');
    if (!userData) return true; // Show button if not logged in (will require auth)
    try {
      const user = JSON.parse(userData);
      // Check post.userId first (direct field)
      if (post.userId) {
        return post.userId !== user.id;
      }
      // Check if post has user object with id
      if (post.user && post.user.id) {
        return post.user.id !== user.id;
      }
      // Fallback: if post doesn't have user info, allow offer (will be checked on backend)
      return true;
    } catch {
      return true;
    }
  };

  const handleCreatePost = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/login?redirect=/map';
      return;
    }
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

  const handleEditPost = (post: Post) => {
    setShowLeftPanel(true);
    setLeftPanelTitle('Edit Post');
    setLeftPanelContent(
      <CreatePostForm
        initialData={post}
        onSuccess={() => {
          setShowLeftPanel(false);
          // Refresh posts
          handleMenuItemClick('posts'); // determine basic refresh strategy
          // If viewing My Posts, refreshing is easy. If map, maybe re-search or reload?
          // For now simple refresh if we were on 'posts' tab, or empty
          window.location.reload(); // Simplest way to ensure map updates for now
        }}
        onCancel={() => {
          // Go back to details view
          setSelectedPost(post);
          // Re-render details
          const el = markersRef.current.find(m => {
            // Logic to find marker logic is hard without ID map, but we can just reset panel
            return false;
          });
          // Just show details again
          setLeftPanelTitle('Post Details');
          setLeftPanelContent(
            <PostDetail
              post={post}
              onClose={() => setShowLeftPanel(false)}
              onMakeOffer={handleMakeOffer}
              onContact={handleContact}
              onRequestPickup={handleRequestPickup}
              isAuthenticated={true}
              showOfferButton={shouldShowOfferButton(post)}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              currentUserId={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : undefined}
            />
          );
        }}
      />
    );
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Post deleted successfully');
        setShowLeftPanel(false);
        setSelectedPost(null);
        // Refresh map/posts
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete post');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting post');
    }
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
        className="absolute bottom-6 right-6 z-50 rounded-full w-16 h-16 shadow-2xl bg-primary hover:bg-primary/90 text-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center group cursor-pointer"
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
