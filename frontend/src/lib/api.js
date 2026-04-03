const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');

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