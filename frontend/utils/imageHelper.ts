/**
 * Safely extracts image array from post images field
 * Handles both array format and JSON string format
 */
export function getImageArray(images: any): string[] {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images;
  }

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

/**
 * Gets the first image URL or returns a placeholder
 */
export function getFirstImage(images: any, placeholder?: string): string {
  const imageArray = getImageArray(images);
  if (imageArray.length > 0) {
    return imageArray[0];
  }
  return placeholder || 'https://via.placeholder.com/800x600?text=No+Image';
}

/**
 * Returns a theme-appropriate construction image based on keywords
 */
export function getCategoryImage(input: string = ''): string {
  const normalized = input.toLowerCase();

  if (normalized.includes('tile')) return 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400';
  if (normalized.includes('sand')) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400';
  if (normalized.includes('gravel')) return 'https://images.unsplash.com/photo-1516139008210-96e45dccc83b?w=400';
  if (normalized.includes('wood') || normalized.includes('floor') || normalized.includes('plank'))
    return 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400';
  if (normalized.includes('steel') || normalized.includes('beam') || normalized.includes('metal'))
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400';
  if (normalized.includes('concrete') || normalized.includes('block'))
    return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400';
  if (normalized.includes('roof')) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400';
  if (normalized.includes('paint')) return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400';
  if (normalized.includes('tool') || normalized.includes('machine') || normalized.includes('saw') || normalized.includes('drill'))
    return 'https://images.unsplash.com/photo-1581244276891-e3373cdc0b0d?w=400';
  if (normalized.includes('space') || normalized.includes('storage') || normalized.includes('garage') || normalized.includes('workshop'))
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
  if (normalized.includes('transport') || normalized.includes('delivery'))
    return 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400';

  // Generic construction fallback
  return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400';
}

