'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Sparkles, AlertCircle, MapPin, Plus, CheckCircle2, Calendar, DollarSign, Package, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/constants/env';

const MATERIAL_SUBTYPES = [
  'window', 'tiles', 'iron bar', 'wood', 'planks', 'roof tiles',
  'paint', 'screws', 'posters', 'gravel', 'sand', 'curtains', 'curtain blinds'
];

const UNITS = ['m²', 'm³', 'pieces', 'liters', 'kilograms'];

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onSwitchToProject?: () => void;
  initialData?: any;
}

const STORAGE_KEY = 'renowise_post_draft';

// Helper to compress images
const compressImage = (base64: string, maxWidth = 1200, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = base64;
  });
};

export function CreatePostForm({ onSuccess, onCancel, onSwitchToProject, initialData }: CreatePostFormProps) {
  const { toast } = useToast();

  const loadSavedState = () => {
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

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const [type, setType] = useState<'MATERIAL' | 'PROJECT'>(savedState.type || 'MATERIAL');
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [pickupAllowed, setPickupAllowed] = useState(savedState.pickupAllowed || false);
  const [transportNeeded, setTransportNeeded] = useState(savedState.transportNeeded || false);
  const [canCompanyCollect, setCanCompanyCollect] = useState(savedState.canCompanyCollect || false);
  const [permitForReuse, setPermitForReuse] = useState(savedState.permitForReuse || false);
  const [hazardousMaterials, setHazardousMaterials] = useState(savedState.hazardousMaterials || false);
  const [structuralItems, setStructuralItems] = useState(savedState.structuralItems || false);
  const [socialLink, setSocialLink] = useState(savedState.socialLink || '');
  const [buyUrl, setBuyUrl] = useState(savedState.buyUrl || '');
  const [videoUrl, setVideoUrl] = useState(savedState.videoUrl || '');
  const [hourlyRate, setHourlyRate] = useState(savedState.hourlyRate || '');
  const [dailyRate, setDailyRate] = useState(savedState.dailyRate || '');
  const [rentalDuration, setRentalDuration] = useState(savedState.rentalDuration || '');

  // Vehicle specific state
  const [km, setKm] = useState(savedState.km || '');
  const [year, setYear] = useState(savedState.year || '');
  const [color, setColor] = useState(savedState.color || '');
  const [vin, setVin] = useState(savedState.vin || '');
  const [gearbox, setGearbox] = useState(savedState.gearbox || '');
  const [inspectionPassed, setInspectionPassed] = useState(savedState.inspectionPassed || false);

  const [loading, setLoading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(false);

  const [manualLat, setManualLat] = useState(savedState.latitude?.toString() || '');
  const [manualLng, setManualLng] = useState(savedState.longitude?.toString() || '');

  useEffect(() => {
    if (!latitude && !longitude) {
      getLocation();
    }
  }, []);

  const saveState = () => {
    const state = {
      type, subtype, title, description, quantity, unit, price,
      latitude, longitude, address, condition, availabilityDate,
      images, pickupAllowed, transportNeeded, canCompanyCollect,
      permitForReuse, hazardousMaterials, structuralItems,
      socialLink, buyUrl, videoUrl, hourlyRate, dailyRate, rentalDuration,
      km, year, color, vin, gearbox, inspectionPassed
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  };

  const handleTypeChange = (newType: 'MATERIAL' | 'PROJECT') => {
    saveState();
    setType(newType);
    if (newType === 'PROJECT') {
      if (onSwitchToProject) onSwitchToProject();
      return;
    }
    if (!MATERIAL_SUBTYPES.includes(subtype)) {
      setSubtype('');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      saveState();
    }, 500);
    return () => clearTimeout(timer);
  }, [type, subtype, title, description, quantity, unit, price, address, condition,
    availabilityDate, images, pickupAllowed, transportNeeded, canCompanyCollect,
    permitForReuse, hazardousMaterials, structuralItems, socialLink, hourlyRate,
    dailyRate, rentalDuration, latitude, longitude, km, year, color, vin, gearbox, inspectionPassed]);

  const getSubtypes = () => {
    return type === 'MATERIAL' ? MATERIAL_SUBTYPES : [];
  };

  const getLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setManualLat(lat.toString());
          setManualLng(lng.toString());
          setLocationLoading(false);
          toast({
            title: 'Location captured',
            description: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationLoading(false);
          toast({
            title: 'Location Access Denied',
            description: 'Please enter coordinates manually or allow location access',
            variant: 'destructive',
          });
        }
      );
    } else {
      setLocationLoading(false);
      toast({
        title: 'Not Supported',
        description: 'Geolocation is not supported by your browser. Please enter coordinates manually.',
        variant: 'destructive',
      });
    }
  };

  const handleManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: 'Invalid Coordinates',
        description: 'Please enter valid latitude and longitude',
        variant: 'destructive',
      });
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast({
        title: 'Invalid Range',
        description: 'Latitude must be between -90 and 90, Longitude between -180 and 180',
        variant: 'destructive',
      });
      return;
    }

    setLatitude(lat);
    setLongitude(lng);
    toast({
      title: 'Coordinates Set',
      description: `Location set to ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} is too large. Max 5MB per image.`,
          variant: 'destructive',
        });
        continue;
      }

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Compress for preview only
        const compressed = await compressImage(base64, 400, 0.7);
        newPreviews.push(compressed);
        newFiles.push(file);
      } catch (error) {
        console.error('Image processing error:', error);
        toast({
          title: 'Upload Error',
          description: `Failed to process ${file.name}`,
          variant: 'destructive',
        });
      }
    }

    setImages((prev) => [...prev, ...newPreviews]);
    setImageFiles((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const generateDescription = async () => {
    setGeneratingDescription(true);
    const generated = `MATERIAL - ${subtype}${quantity ? `, ${quantity} ${unit}` : ''}${condition ? `, ${condition}` : ''}${price ? `, €${price}` : ''}`;
    setDescription(generated);
    setGeneratingDescription(false);
    toast({
      title: 'Description Generated',
      description: 'AI description has been generated. You can edit it if needed.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== SUBMIT STARTED ===');
    setDebugInfo('Starting submission...');

    if (!subtype) {
      toast({
        title: 'Subtype Required',
        description: 'Please select a subtype',
        variant: 'destructive',
      });
      return;
    }

    const minImages = userRole === 'COMPANY' ? 3 : 2;
    if (images.length < minImages) {
      toast({
        title: 'Images Required',
        description: `Please upload at least ${minImages} images`,
        variant: 'destructive',
      });
      return;
    }

    if (!latitude || !longitude) {
      toast({
        title: 'Location Required',
        description: 'Please set your location using GPS or enter coordinates manually',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      console.log('Token exists:', !!token);

      if (!token) {
        setDebugInfo('No auth token found - redirecting to login');
        const draft = {
          type, subtype, title, description, quantity, unit, price, images,
          latitude, longitude, address, condition, availabilityDate,
          pickupAllowed, transportNeeded, canCompanyCollect, permitForReuse,
          hazardousMaterials, structuralItems, socialLink, buyUrl, videoUrl
        };
        localStorage.setItem('postDraft', JSON.stringify(draft));

        toast({
          title: 'Authentication Required',
          description: 'Redirecting to login...',
        });

        if (typeof window !== 'undefined') {
          window.location.href = '/login?redirect=/map&action=create-post';
        }
        return;
      }

      // Use FormData for multipart upload
      const formData = new FormData();
      formData.append('type', type);
      formData.append('subtype', subtype);
      formData.append('title', title);
      formData.append('description', description);
      if (quantity) formData.append('quantity', quantity);
      if (unit) formData.append('unit', unit);
      if (price) formData.append('price', (Math.round(parseFloat(price) * 100)).toString());
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      if (address) formData.append('address', address);
      if (condition) formData.append('condition', condition);
      if (availabilityDate) formData.append('availabilityDate', availabilityDate);

      // Append image files
      imageFiles.forEach((file, index) => {
        formData.append('images', file, `image-${index}.jpg`);
      });

      formData.append('pickupAllowed', pickupAllowed.toString());
      formData.append('transportNeeded', transportNeeded.toString());
      formData.append('canCompanyCollect', canCompanyCollect.toString());
      formData.append('permitForReuse', permitForReuse.toString());
      formData.append('hazardousMaterials', hazardousMaterials.toString());
      formData.append('structuralItems', structuralItems.toString());
      if (socialLink) formData.append('socialLink', socialLink);
      if (buyUrl) formData.append('buyUrl', buyUrl);
      if (videoUrl) formData.append('videoUrl', videoUrl);

      // Vehicle fields
      setDebugInfo(`Sending multipart request to ${API_BASE_URL}/posts`);

      const url = initialData?.id
        ? `${API_BASE_URL}/posts/${initialData.id}`
        : `${API_BASE_URL}/posts`;

      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // DO NOT set Content-Type - browser will set it with boundary
        },
        body: formData,
      });

      console.log('Response status:', response.status);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        setDebugInfo(`Parse error: ${responseText.substring(0, 200)}`);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        console.error('Request failed:', data);
        setDebugInfo(`Error ${response.status}: ${JSON.stringify(data)}`);
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }

      console.log('Success! Response:', data);
      setDebugInfo(initialData?.id ? 'Post updated successfully!' : 'Post created successfully!');

      localStorage.removeItem(STORAGE_KEY);

      toast({
        title: 'Success',
        description: initialData?.id ? 'Post updated successfully!' : 'Post created successfully!',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMessage = error.message || 'Failed to create post';
      setDebugInfo(`Error: ${errorMessage}`);

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-black mb-15">


      <div>
        <Label className="text-white mb-3 block font-medium">Post Type *</Label>
        <div className="flex space-x-2">
          {(['MATERIAL', 'PROJECT'] as const)
            .map((t) => (
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

      {/* Subtype Selector - Grid Based */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Subtype *</Label>
        <div className="grid grid-cols-3 gap-2">
          {getSubtypes().map((st) => (
            <Button
              key={st}
              type="button"
              variant={subtype === st ? 'default' : 'outline'}
              onClick={() => setSubtype(st)}
              className={cn(
                "text-xs transition-all h-10",
                subtype === st ? "bg-primary" : "border-gray-800 hover:bg-gray-900"
              )}
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="space-y-4 pt-4">
        <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Basic Info</Label>
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Title *</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-gray-500">Description</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateDescription}
              disabled={generatingDescription}
              className="h-7 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {generatingDescription ? 'Generating...' : 'AI Generate'}
            </Button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description or use AI to generate"
            className="w-full min-h-[100px] p-3 border border-gray-700 bg-gray-900 text-white rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Logistics & Quantity Section */}
      <div className="space-y-4 pt-4">
        <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Logistics & Quantity</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Quantity</Label>
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
            <Label className="text-xs text-gray-500 mb-1 block">Unit</Label>
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
      </div>

      {/* Pricing Section */}
      <div className="space-y-4 pt-4">
        <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Pricing</Label>
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Price (€)</Label>
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

      </div>

      {/* Location Section */}
      <div className="space-y-4 pt-4">
        <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Location *
        </Label>

        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-500">Address / GPS</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getLocation}
            disabled={locationLoading}
            className="h-7 text-xs"
          >
            {locationLoading ? 'Getting...' : 'Use My GPS'}
          </Button>
        </div>

        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. Lisbon, Rua da Prata"
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
        />

        {/* Manual Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-[10px] text-gray-500">Latitude</Label>
            <Input
              type="number"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              className="bg-gray-900 border-gray-700 h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-gray-500">Longitude</Label>
            <Input
              type="number"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              className="bg-gray-900 border-gray-700 h-8 text-xs"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleManualCoordinates}
          className="w-full h-8 text-xs"
        >
          Validate Coordinates
        </Button>

        {latitude && longitude && (
          <div className="flex items-center space-x-2 text-[10px] text-green-500">
            <CheckCircle2 className="w-3 h-3" />
            <span>Location Verified: {latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
          </div>
        )}
      </div>

      {/* Media & Logistics Section */}
      <div className="space-y-4 pt-4 border-t border-gray-800">
        <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Upload className="w-4 h-4" /> Media Upload ({userRole === 'COMPANY' ? '3-6' : '2-6'} photos)
        </Label>

        <div className="flex gap-4 items-center">
          <Button
            type="button"
            variant="outline"
            className="border-dashed border-2 h-24 w-24 flex flex-col gap-2 flex-shrink-0"
            onClick={() => document.getElementById('image-upload-post')?.click()}
          >
            <Plus className="w-6 h-6" />
            <span className="text-[10px]">Add Photos</span>
          </Button>
          <input
            id="image-upload-post"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, index) => (
              <div key={index} className="relative h-20 w-20 flex-shrink-0">
                <img src={img} className="h-full w-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Condition</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="new" className="text-white">New</SelectItem>
                <SelectItem value="used" className="text-white">Used</SelectItem>
                <SelectItem value="damaged" className="text-white">Damaged</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Available From</Label>
            <Input
              type="date"
              value={availabilityDate}
              onChange={(e) => setAvailabilityDate(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>
      </div>

      {/* Logistics & External Links Section */}
      <div className="space-y-4 pt-4 border-t border-gray-800">
        <Label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Logistics & External</Label>

        <div className="grid grid-cols-2 gap-y-3">
          {[
            { checked: pickupAllowed, setter: setPickupAllowed, label: 'Pickup Allowed' },
            { checked: transportNeeded, setter: setTransportNeeded, label: 'Transport Needed' },
            { checked: canCompanyCollect, setter: setCanCompanyCollect, label: 'Company Collect' },
            { checked: permitForReuse, setter: setPermitForReuse, label: 'Reuse Permit' },
            { checked: hazardousMaterials, setter: setHazardousMaterials, label: 'Hazardous' },
            { checked: structuralItems, setter: setStructuralItems, label: 'Structural' },
          ].map(({ checked, setter, label }) => (
            <label key={label} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setter(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary"
              />
              <span className="text-xs text-gray-300">{label}</span>
            </label>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Social Link (Instagram/etc.)</Label>
            <Input
              type="url"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              placeholder="https://..."
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Buy / Rent URL</Label>
            <Input
              type="url"
              value={buyUrl}
              onChange={(e) => setBuyUrl(e.target.value)}
              placeholder="https://..."
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          {(userRole === 'COMPANY' || userRole === 'BUSINESS') && (
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Video Promo URL</Label>
              <Input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Final Actions */}
      <div className="flex space-x-2 pt-6 border-t border-gray-800">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 h-10 text-lg font-bold bg-primary hover:bg-primary/90"
        >
          {loading ? 'Posting...' : (initialData?.id ? 'Update' : 'Post Now')}
          {!loading && <CheckCircle2 className="ml-2 w-5 h-5" />}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              onCancel();
            }}
            className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white h-10 px-6"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
