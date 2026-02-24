// Shared types between frontend and backend

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'HOMEOWNER' | 'COMPANY' | 'CITY';
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  logoUrl?: string;
}

export interface Post {
  id: string;
  title: string;
  type: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Offer {
  id: string;
  amount?: number;
  message?: string;
  status: OfferStatus;
  createdAt: string;
  post: Post;
  user?: User;
  company?: CompanyProfile;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  budgetMin?: number;
  budgetMax?: number;
  size?: number;
  images?: any;
  streetAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
}
