const defaultApiBaseUrl = 'https://sgp-5.onrender.com';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;

// Accept both "https://host" and "https://host/api" in env without duplicating /api.
const normalizedApiBaseUrl = rawApiBaseUrl
  .replace(/\/+$/, '')
  .replace(/\/api$/i, '');

export const API_ORIGIN = normalizedApiBaseUrl;
export const API_BASE = `${normalizedApiBaseUrl}/api`;

export const apiUrl = (path = '') => {
  if (!path) {
    return API_BASE;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
};

export const assetUrl = (path = '') => {
  if (!path) {
    return API_ORIGIN;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return path.startsWith('/') ? `${API_ORIGIN}${path}` : `${API_ORIGIN}/${path}`;
};