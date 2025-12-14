import { getValidAccessToken } from './tokenManager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const accessToken = await getValidAccessToken();
  
  // If we couldn't get a valid access token, the user needs to log in again
  if (!accessToken) {
    // Redirect to login or handle unauthorized state
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('No valid access token available');
  }

  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers,
  });

  // If we get a 401, the token might be invalid, clear it and redirect to login
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  return response;
}

export const api = {
  get: (url: string, options?: RequestInit) => 
    fetchWithAuth(url, { ...options, method: 'GET' }),
  
  post: (url: string, body?: any, options?: RequestInit) => 
    fetchWithAuth(url, { 
      ...options, 
      method: 'POST', 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  put: (url: string, body?: any, options?: RequestInit) => 
    fetchWithAuth(url, { 
      ...options, 
      method: 'PUT', 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  delete: (url: string, options?: RequestInit) => 
    fetchWithAuth(url, { ...options, method: 'DELETE' }),
    
  patch: (url: string, body?: any, options?: RequestInit) => 
    fetchWithAuth(url, { 
      ...options, 
      method: 'PATCH', 
      body: body ? JSON.stringify(body) : undefined 
    }),
};

export default api;
