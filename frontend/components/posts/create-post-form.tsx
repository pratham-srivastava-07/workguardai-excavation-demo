'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Upload, X, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const MATERIAL_SUBTYPES = [
  'window', 'tiles', 'iron bar', 'wood', 'planks', 'roof tiles',
  'paint', 'screws', 'posters', 'gravel', 'sand'
];

const SERVICE_SUBTYPES = [
  'transport', 'demolition', 'rental of equipment', 'rental of vehicles'
];

const SPACE_SUBTYPES = [
  'coworking', 'parking', 'hall', 'school', 'storage'
];

const UNITS = ['m²', 'm³', 'pieces', 'liters', 'kilograms'];

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

interface FormState {
  type: 'MATERIAL' | 'SERVICE' | 'SPACE';
  subtype: string;
  title: string;
  description: string;
  quantity: string;
  unit: string;
  price: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  condition: string;
  availabilityDate: string;
  images: string[];
  pickupAllowed: boolean;
  transportNeeded: boolean;
  canCompanyCollect: boolean;
  permitForReuse: boolean;
  hazardousMaterials: boolean;
  structuralItems: boolean;
  socialLink: string;
  hourlyRate: string;
  dailyRate: string;
  rentalDuration: string;
}

const STORAGE_KEY = 'renowise_post_draft';

export function CreatePostForm({ onSuccess, onCancel, initialData }: CreatePostFormProps) {
  const { toast } = useToast();
  
  // Load saved state or use initial data
  const loadSavedState = (): Partial<FormState> => {
    if (initialData) return initialData;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
    return {};
  };

  const savedState = loadSavedState();
  
  const [type, setType] = useState<'MATERIAL' | 'SERVICE' | 'SPACE'>(savedState.type || 'MATERIAL');
  const [subtype, setSubtype] = useState(savedState.subtype || '');
  const [title, setTitle] = useState(savedState.title || '');
  const [description, setDescription] = useState(savedState.description || '');
  const [quantity, setQuantity] = useState(savedState.quantity || '');
  const [unit, setUnit] = useState(savedState.unit || '');
  const [price, setPrice] = useState(savedState.price || '');
  const [latitude, setLatitude] = useState<number | null>(savedState.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(savedState.longitude || null);
  const [address, setAddress] = useState(savedState.address || '');
  const [condition, setCondition] = useState(savedState.condition || '');
  const [availabilityDate, setAvailabilityDate] = useState(savedState.availabilityDate || '');
  const [images, setImages] = useState<string[]>(savedState.images || []);
  const [pickupAllowed, setPickupAllowed] = useState(savedState.pickupAllowed || false);
  const [transportNeeded, setTransportNeeded] = useState(savedState.transportNeeded || false);
  const [canCompanyCollect, setCanCompanyCollect] = useState(savedState.canCompanyCollect || false);
  const [permitForReuse, setPermitForReuse] = useState(savedState.permitForReuse || false);
  const [hazardousMaterials, setHazardousMaterials] = useState(savedState.hazardousMaterials || false);
  const [structuralItems, setStructuralItems] = useState(savedState.structuralItems || false);
  const [socialLink, setSocialLink] = useState(savedState.socialLink || '');
  const [hourlyRate, setHourlyRate] = useState(savedState.hourlyRate || '');
  const [dailyRate, setDailyRate] = useState(savedState.dailyRate || '');
  const [rentalDuration, setRentalDuration] = useState(savedState.rentalDuration || '');
  const [loading, setLoading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);

  // Save state to localStorage whenever it changes
  const saveState = () => {
    const state: FormState = {
      type,
      subtype,
      title,
      description,
      quantity,
      unit,
      price,
      latitude,
      longitude,
      address,
      condition,
      availabilityDate,
      images,
      pickupAllowed,
      transportNeeded,
      canCompanyCollect,
      permitForReuse,
      hazardousMaterials,
      structuralItems,
      socialLink,
      hourlyRate,
      dailyRate,
      rentalDuration,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  };

  // Save state when type changes (preserve other fields)
  const handleTypeChange = (newType: 'MATERIAL' | 'SERVICE' | 'SPACE') => {
    saveState(); // Save current state before switching
    setType(newType);
    // Only reset subtype if it's not valid for new type
    const newSubtypes = newType === 'MATERIAL' ? MATERIAL_SUBTYPES : 
                        newType === 'SERVICE' ? SERVICE_SUBTYPES : SPACE_SUBTYPES;
    if (!newSubtypes.includes(subtype)) {
      setSubtype('');
    }
  };

  // Auto-save on field changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveState();
    }, 500);
    return () => clearTimeout(timer);
  }, [type, subtype, title, description, quantity, unit, price, address, condition, availabilityDate, images, pickupAllowed, transportNeeded, canCompanyCollect, permitForReuse, hazardousMaterials, structuralItems, socialLink, hourlyRate, dailyRate, rentalDuration]);

  // Get current subtypes based on type
  const getSubtypes = () => {
    switch (type) {
      case 'MATERIAL':
        return MATERIAL_SUBTYPES;
      case 'SERVICE':
        return SERVICE_SUBTYPES;
      case 'SPACE':
        return SPACE_SUBTYPES;
      default:
        return [];
    }
  };

  // Get user location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: 'Location Error',
            description: 'Could not get your location. Please enter it manually.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  // Handle image upload (placeholder - in production, upload to cloud storage)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 6) {
      toast({
        title: 'Too many images',
        description: 'Maximum 6 images allowed',
        variant: 'destructive',
      });
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Generate AI description (placeholder)
  const generateDescription = async () => {
    setGeneratingDescription(true);
    // TODO: Call AI API to generate description
    // For now, just create a basic description
    const generated = `${type} - ${subtype}${quantity ? `, ${quantity} ${unit}` : ''}${condition ? `, ${condition}` : ''}${price ? `, €${price}` : ''}`;
    setDescription(generated);
    setGeneratingDescription(false);
    toast({
      title: 'Description Generated',
      description: 'AI description has been generated. You can edit it if needed.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length < 2) {
      toast({
        title: 'Images Required',
        description: 'Please upload at least 2 images',
        variant: 'destructive',
      });
      return;
    }

    if (!latitude || !longitude) {
      toast({
        title: 'Location Required',
        description: 'Please allow location access or enter an address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // Save draft and redirect to login
        const draft = {
          type,
          subtype,
          title,
          description,
          quantity,
          unit,
          price,
          images,
          // ... other fields
        };
        localStorage.setItem('postDraft', JSON.stringify(draft));
        window.location.href = '/login?redirect=/map&action=create-post';
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          subtype,
          title,
          description,
          quantity: quantity ? parseFloat(quantity) : undefined,
          unit: unit || undefined,
          price: price ? Math.round(parseFloat(price) * 100) : undefined,
          latitude,
          longitude,
          address: address || undefined,
          condition: condition || undefined,
          availabilityDate: availabilityDate || undefined,
          images,
          pickupAllowed,
          transportNeeded,
          canCompanyCollect,
          permitForReuse,
          hazardousMaterials,
          structuralItems,
          socialLink: socialLink || undefined,
          hourlyRate: hourlyRate ? Math.round(parseFloat(hourlyRate) * 100) : undefined,
          dailyRate: dailyRate ? Math.round(parseFloat(dailyRate) * 100) : undefined,
          rentalDuration: rentalDuration || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      // Clear saved state on success
      localStorage.removeItem(STORAGE_KEY);

      toast({
        title: 'Success',
        description: 'Post created successfully!',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-black">
      {/* Post Type Toggle */}
      <div>
        <Label className="text-white mb-3 block font-medium">Post Type *</Label>
        <div className="flex space-x-2">
          {(['MATERIAL', 'SERVICE', 'SPACE'] as const).map((t) => (
            <Button
              key={t}
              type="button"
              variant={type === t ? 'default' : 'outline'}
              onClick={() => handleTypeChange(t)}
              className={cn(
                "flex-1 transition-all",
                type === t 
                  ? "bg-primary hover:bg-primary/90" 
                  : "border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
              )}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {/* Subtype */}
      <div>
        <Label className="text-white mb-2 block font-medium">Subtype *</Label>
        <Select value={subtype} onValueChange={setSubtype} required>
          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Select subtype" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            {getSubtypes().map((st) => (
              <SelectItem key={st} value={st} className="text-white">
                {st}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div>
        <Label className="text-white mb-2 block font-medium">Title *</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
          required
        />
      </div>

      {/* Description with AI */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-white font-medium">Description</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateDescription}
            disabled={generatingDescription}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {generatingDescription ? 'Generating...' : 'AI Generate'}
          </Button>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description or use AI to generate"
          className="w-full min-h-[100px] p-3 border border-gray-700 bg-gray-900 text-white rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Quantity & Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white mb-2 block font-medium">Quantity</Label>
        <Input
          type="number"
          step="0.01"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0.00"
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
        />
        </div>
        <div>
          <Label className="text-white mb-2 block font-medium">Unit</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {UNITS.map((u) => (
                <SelectItem key={u} value={u} className="text-white">
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price */}
      <div>
        <Label className="text-white mb-2 block font-medium">Price (€)</Label>
        <Input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      {/* Service/Rental Rates */}
      {(type === 'SERVICE' || type === 'SPACE') && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-white mb-2 block font-medium">Hourly Rate (€)</Label>
            <Input
              type="number"
              step="0.01"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block font-medium">Daily Rate (€)</Label>
            <Input
              type="number"
              step="0.01"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>
      )}

      {/* Location */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-white font-medium">Location *</Label>
          <Button type="button" variant="outline" size="sm" onClick={getLocation}>
            Use My Location
          </Button>
        </div>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
        />
        {latitude && longitude && (
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
        )}
      </div>

      {/* Condition & Availability */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white mb-2 block font-medium">Condition</Label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="new" className="text-white">New</SelectItem>
              <SelectItem value="used" className="text-white">Used</SelectItem>
              <SelectItem value="damaged" className="text-white">Damaged</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-white mb-2 block font-medium">Availability Date</Label>
          <Input
            type="date"
            value={availabilityDate}
            onChange={(e) => setAvailabilityDate(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <Label className="text-white mb-2 block font-medium">Images * (2-6 required)</Label>
        <div className="mt-2 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square">
                <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 6 && (
              <label className="aspect-square border-2 border-dashed border-gray-700 rounded flex items-center justify-center cursor-pointer hover:border-gray-600 bg-gray-900">
                <Upload className="w-6 h-6 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {images.length}/6 images uploaded
          </p>
        </div>
      </div>

      {/* Options */}
      <div>
        <Label className="text-white mb-2 block font-medium">Options</Label>
        <div className="space-y-2 mt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pickupAllowed}
              onChange={(e) => setPickupAllowed(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-300">Pickup Allowed</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={transportNeeded}
              onChange={(e) => setTransportNeeded(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-300">Transport Needed</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={canCompanyCollect}
              onChange={(e) => setCanCompanyCollect(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-300">Can Company Collect</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={permitForReuse}
              onChange={(e) => setPermitForReuse(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-300">Permit for Reuse</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hazardousMaterials}
              onChange={(e) => setHazardousMaterials(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-300">Hazardous Materials</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={structuralItems}
              onChange={(e) => setStructuralItems(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-300">Structural Items</span>
          </label>
        </div>
      </div>

      {/* Social Link */}
      <div>
        <Label className="text-white mb-2 block font-medium">Social Link (Instagram, etc.)</Label>
        <Input
          type="url"
          value={socialLink}
          onChange={(e) => setSocialLink(e.target.value)}
          placeholder="https://..."
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-2 pt-4 border-t border-gray-800">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 bg-primary hover:bg-primary/90 text-white"
          size="lg"
        >
          {loading ? 'Posting...' : 'Create Post'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            // Clear saved state on cancel
            localStorage.removeItem(STORAGE_KEY);
            if (onCancel) onCancel();
          }}
          className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

