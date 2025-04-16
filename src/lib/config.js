/**
 * Configuration settings
 */

// Get the API base URL based on environment
export const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  // Map frontend hostnames to their respective backend servers
  if (hostname === '165.22.118.105' || hostname === 'localhost') {
    return 'http://165.22.118.105:5000/api';
  }
  
  // Default fallback
  return 'http://165.22.118.105:5000/api';
};

// Export a function that builds a complete URL for an endpoint
export const buildApiUrl = (endpoint) => {
  const apiUrl = getApiUrl();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${apiUrl}${normalizedEndpoint}`;
};

export default {
  getApiUrl,
  buildApiUrl
};