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

