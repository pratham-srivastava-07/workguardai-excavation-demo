// utils/tokenManager.ts
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    // Check if token expires in less than 5 minutes
    return decoded.exp < currentTime + 300;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      },
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Refresh token is invalid, clear storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    }

    const data = await response.json();
    
    // Update tokens in localStorage
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

export const getValidAccessToken = async (): Promise<string | null> => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    return null;
  }

  // If token is expired or about to expire, refresh it
  if (isTokenExpired(accessToken)) {
    return await refreshAccessToken();
  }

  return accessToken;
};

export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!accessToken || !refreshToken) {
    return false;
  }

  // Check if refresh token is still valid
  try {
    const decoded = jwtDecode<DecodedToken>(refreshToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};