/**
 * Simplified API client for the profile app
 */

import { getApiUrl } from './config';

/**
 * Common fetch wrapper with error handling
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    // Create API URL
    const url = `${getApiUrl()}${endpoint}`;
    
    console.log('Making API request to:', url);
    
    // Create an AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for cookies/sessions
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    
    // Parse JSON response
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        console.warn('Response is not JSON:', text);
        return { text };
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      const text = await response.text();
      return { text };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('API request timed out:', endpoint);
      throw new Error('Request timed out. Please try again later.');
    }
    
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Auth API methods
 */
const auth = {
  // Login with email and password
  login: async (email, password) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Logout current user
  logout: async () => {
    return fetchWithAuth('/auth/logout', {
      method: 'POST',
    });
  },
  
  // Get current user info
  getCurrentUser: async () => {
    try {
      return await fetchWithAuth('/auth/me', {
        method: 'GET',
      });
    } catch (error) {
      // Allow the app to continue if auth check fails
      console.warn('Auth check failed:', error);
      return { authenticated: false };
    }
  },
};

/**
 * User profile API methods
 */
const profile = {
  // Upload avatar image
  uploadAvatar: async (file) => {
    // Create FormData to send file
    const formData = new FormData();
    formData.append('avatar', file);
    
    // Make API request with file upload
    try {
      const url = `${getApiUrl()}/uploads/avatar`;
      console.log('Uploading avatar to:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for uploads
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Avatar upload failed:', error);
      throw error;
    }
  },
  
  // Get user profile data
  getUserProfile: async () => {
    return fetchWithAuth('/users/me', {
      method: 'GET',
    });
  },
};

/**
 * Export the API object
 */
export const api = {
  auth,
  profile,
};

export default api;