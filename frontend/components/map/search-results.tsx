'use client';

import { useState } from 'react';
import { MapPin, Package, Wrench, Building2, Star, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  user?: {
    name?: string;
    role?: string;
  };
  company?: {
    companyName?: string;
  };
  city?: {
    cityName?: string;
  };
  status: string;
}

interface SearchResultsProps {
  posts: Post[];
  onPostClick?: (post: Post) => void;
  loading?: boolean;
}

const typeIcons = {
  MATERIAL: Package,
  SERVICE: Wrench,
  SPACE: Building2,
};

const typeColors = {
  MATERIAL: 'bg-blue-100 text-blue-800',
  SERVICE: 'bg-green-100 text-green-800',
  SPACE: 'bg-purple-100 text-purple-800',
};

export function SearchResults({ posts, onPostClick, loading }: SearchResultsProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-800 rounded-lg mb-2" />
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-600" />
        <p className="text-white">No results found</p>
        <p className="text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    if (onPostClick) {
      onPostClick(post);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Filters & Sort */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">
          {posts.length} result{posts.length !== 1 ? 's' : ''}
        </span>
        <select className="text-sm border border-gray-700 bg-gray-900 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
          <option>Sort by: Distance</option>
          <option>Sort by: Price</option>
          <option>Sort by: Newest</option>
        </select>
      </div>

      {/* Results List */}
      {posts.map((post) => {
        const Icon = typeIcons[post.type];
        const typeColor = typeColors[post.type];
        const isSelected = selectedPost?.id === post.id;

        return (
            <Card
            key={post.id}
            onClick={() => handlePostClick(post)}
            className={cn(
              'cursor-pointer transition-all hover:shadow-lg overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700',
              isSelected && 'ring-2 ring-primary border-primary'
            )}
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-100 overflow-hidden relative">
              {(() => {
                const images = Array.isArray(post.images) 
                  ? post.images 
                  : typeof post.images === 'string' 
                    ? (() => { try { return JSON.parse(post.images); } catch { return []; } })()
                    : [];
                return images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                    }}
                  />
                ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon className="w-12 h-12 text-gray-400" />
                </div>
              );
              })()}
              <div className="absolute top-2 left-2">
                <Badge className={typeColor}>
                  {post.type}
                </Badge>
              </div>
              {post.status !== 'AVAILABLE' && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive">
                    {post.status}
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-white mb-1 line-clamp-1">
                {post.title}
              </h3>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                {post.description || `${post.subtype} • ${post.condition || 'Condition not specified'}`}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-3">
                  {post.quantity && (
                    <span className="flex items-center">
                      <Package className="w-3 h-3 mr-1" />
                      {post.quantity} {post.unit || 'units'}
                    </span>
                  )}
                  {post.distance !== undefined && (
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {post.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between">
                {post.price ? (
                  <div className="flex items-center text-lg font-semibold text-white">
                    <DollarSign className="w-4 h-4 mr-1" />
                    €{(post.price / 100).toFixed(2)}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Price on request</span>
                )}
                <Button size="sm" variant="outline">
                  View more
                </Button>
              </div>

              {/* Posted by */}
              <div className="mt-2 pt-2 border-t border-gray-800 text-xs text-gray-500">
                Posted by:{' '}
                {post.company?.companyName ||
                  post.city?.cityName ||
                  post.user?.name ||
                  'Anonymous'}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

