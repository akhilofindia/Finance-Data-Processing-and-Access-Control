const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('finance_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(response.ok ? 'Invalid response from server' : text.slice(0, 200) || 'Request failed');
    }
  }
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
};

export default api;
