import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for large form submissions
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

// Handle auth errors - DON'T auto-logout, let components handle it
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just pass through the error, don't auto-logout
    // Components will handle 401 errors as needed
    return Promise.reject(error);
  }
);

export default api;
