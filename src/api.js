// Dev: same-origin /api (Vite proxy → Express). Override with VITE_API_URL. Prod build: default to backend URL.
const rawBase =
  import.meta.env.VITE_API_URL ||
  'https://finance-data-processing-and-access-47fd.onrender.com/api';

// Normalize: remove trailing slashes and ensure it ends with /api if not already present
const API_BASE = rawBase.replace(/\/+$/, '').endsWith('/api')
  ? rawBase.replace(/\/+$/, '')
  : rawBase.replace(/\/+$/, '') + '/api';

function parseApiError(text, response) {
  const trimmed = text.trim();
  if (trimmed.startsWith('<!') || trimmed.startsWith('<html')) {
    if (trimmed.includes('Cannot POST') || trimmed.includes('Cannot GET')) {
      return 'API route not found. Start the backend (cd backend && node index.js) and restart Vite after changing vite.config.js.';
    }
    return `Unexpected HTML from server (${response.status}). Check that the API is running on port 5000.`;
  }
  try {
    const j = JSON.parse(text);
    if (j.message) return j.message;
  } catch {
    /* ignore */
  }
  return trimmed.slice(0, 160) || `Request failed (${response.status})`;
}

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('finance_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      if (!response.ok) {
        throw new Error(parseApiError(text, response));
      }
      throw new Error('Invalid JSON from server');
    }
  }
  if (!response.ok) {
    throw new Error(data.message || parseApiError(text, response));
  }
  return data;
};

export default api;
