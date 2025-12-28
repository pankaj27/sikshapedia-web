import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120 seconds timeout for large form submissions
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

// Helper function to safely get current path without causing React re-renders
// This is safe because it's called during axios request, not during React render
const getCurrentPath = () => {
  try {
    return window.location.pathname || '/';
  } catch {
    return '/';
  }
};

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get current path at request time (not during React render)
    const currentPath = getCurrentPath();
    const isAdminPage = currentPath.startsWith('/admin');
    const isInstitutePage = currentPath.startsWith('/institute');
    
    let token = null;
    if (isAdminPage) {
      token = localStorage.getItem('adminToken');
    } else if (isInstitutePage) {
      token = localStorage.getItem('institute_token');
    } else {
      token = localStorage.getItem('token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors with retry logic for network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Retry once on network error (but not on 4xx/5xx errors)
    if (error.message === 'Network Error' && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('[API] Retrying request after network error...');
      
      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default api;
