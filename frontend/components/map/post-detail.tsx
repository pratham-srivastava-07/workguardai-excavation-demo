'use client';

import { useState } from 'react';
import { X, MapPin, Package, DollarSign, Calendar, User, MessageSquare, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getImageArray } from '@/utils/imageHelper';

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
  availabilityDate?: string;
  pickupAllowed?: boolean;
  transportNeeded?: boolean;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
  company?: {
    companyName?: string;
  };
  city?: {
    cityName?: string;
  };
  subOptions?: string[];
  status: string;
}

interface PostDetailProps {
  post: Post;
  onClose?: () => void;
  onMakeOffer?: (postId: string) => void;
  onContact?: (postId: string) => void;
  onRequestPickup?: (postId: string) => void;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
  showOfferButton?: boolean;
}

export function PostDetail({
  post,
  onClose,
  onMakeOffer,
  onContact,
  onRequestPickup,
  isAuthenticated = false,
  onAuthRequired,
  showOfferButton = true,
}: PostDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = getImageArray(post.images);

  const handleAction = (action: () => void) => {
    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    action();
  };

  const typeColors = {
    MATERIAL: 'bg-blue-900 text-blue-200',
    SERVICE: 'bg-green-900 text-green-200',
    SPACE: 'bg-purple-900 text-purple-200',
  };

  return (
    <div className="p-6 space-y-6 bg-black">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className={typeColors[post.type]}>
              {post.type}
            </Badge>
            {post.status !== 'AVAILABLE' && (
              <Badge variant="destructive">{post.status}</Badge>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
          <p className="text-sm text-gray-400">
            {post.subtype} • {post.condition || 'Condition not specified'}
          </p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div className="relative">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <img
              src={images[currentImageIndex]}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-3">
              {images.map((_, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === currentImageIndex
                    ? 'bg-primary w-6'
                    : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {post.description && (
        <div>
          <h3 className="font-semibold text-white mb-2">Description</h3>
          <p className="text-gray-300">{post.description}</p>
        </div>
      )}

      {/* Sub-options for Entities */}
      {post.subOptions && post.subOptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-white">Explore</h3>
          <div className="grid grid-cols-2 gap-2">
            {post.subOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                className="w-full justify-start text-left border-gray-700 hover:bg-gray-800 hover:text-white"
                onClick={() => handleAction(() => console.log('Clicked option:', option))}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Details Grid - Only show for standard posts or if relevant fields exist */}
      {(post.quantity || post.price || post.availabilityDate || post.address) && (
        <div className="grid grid-cols-2 gap-4">
          {post.quantity && (
            <Card className="p-3 bg-gray-900 border-gray-800">
              <div className="flex items-center space-x-2 text-sm">
                <Package className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-gray-400">Quantity</div>
                  <div className="font-semibold text-white">
                    {post.quantity} {post.unit || 'units'}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {post.price && (
            <Card className="p-3 bg-gray-900 border-gray-800">
              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-gray-400">Price</div>
                  <div className="font-semibold text-white">€{(post.price / 100).toFixed(2)}</div>
                </div>
              </div>
            </Card>
          )}

          {post.availabilityDate && (
            <Card className="p-3 bg-gray-900 border-gray-800">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-gray-400">Available</div>
                  <div className="font-semibold text-white">
                    {new Date(post.availabilityDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {post.address && (
            <Card className="p-3 bg-gray-900 border-gray-800">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-gray-400">Location</div>
                  <div className="font-semibold text-white line-clamp-1">{post.address}</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Options */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-white">Options</div>
        <div className="flex flex-wrap gap-2">
          {post.pickupAllowed && (
            <Badge variant="outline" className="border-gray-700 text-gray-300">Pickup Allowed</Badge>
          )}
          {post.transportNeeded && (
            <Badge variant="outline" className="border-gray-700 text-gray-300">Transport Needed</Badge>
          )}
        </div>
      </div>

      {/* Posted by */}
      <Card className="p-4 bg-gray-900 border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-white">
              {post.company?.companyName ||
                post.city?.cityName ||
                post.user?.name ||
                'Anonymous'}
            </div>
            <div className="text-sm text-gray-400">
              {post.company ? 'Company' : post.city ? 'City' : post.user?.role || 'User'}
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
        {showOfferButton && (
          <Button
            className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
            onClick={() => handleAction(() => onMakeOffer?.(post.id))}
          >
            Make an Offer
          </Button>
        )}
        {!showOfferButton && (
          <Button
            className="w-full bg-gray-700 hover:bg-gray-700 cursor-not-allowed"
            disabled
            title="You cannot make an offer on your own post"
          >
            Make an Offer (Your Post)
          </Button>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => handleAction(() => onContact?.(post.id))}
            className="cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact
          </Button>
          {post.pickupAllowed && (
            <Button
              variant="outline"
              onClick={() => handleAction(() => onRequestPickup?.(post.id))}
              className="cursor-pointer"
            >
              Request Pickup
            </Button>
          )}
        </div>
        <div className="flex items-center justify-center space-x-4 pt-2">
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}

