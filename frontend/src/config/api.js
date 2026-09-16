// Frontend Configuration — Single source of truth
export const FrontendConfig = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
};

// Backward-compatible named export
export const API_URL = FrontendConfig.API_URL;
