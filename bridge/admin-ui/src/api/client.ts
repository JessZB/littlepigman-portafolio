import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sessionToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global session guard: if the backend rejects our token, go back to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('sessionToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
