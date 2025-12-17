// API Configuration
// This file centralizes API endpoint configuration
// The API URL is loaded from environment variables

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_BASE_URL = API_URL;

// Helper function to build API endpoints
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export default {
  API_BASE_URL,
  buildApiUrl,
};

