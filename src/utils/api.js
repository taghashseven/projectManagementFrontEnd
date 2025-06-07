// apiClient.js

export default async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
  
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
  
    return response.json();
  }
  