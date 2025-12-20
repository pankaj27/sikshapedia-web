import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Get current path for redirect logic
      const currentPath = getCurrentPath();
      const isAdminPage = currentPath.startsWith('/admin');
      const isInstitutePage = currentPath.startsWith('/institute');
      if (isAdminPage) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      } else if (isInstitutePage) {
        localStorage.removeItem('institute_token');
        localStorage.removeItem('institute');
        window.location.href = '/institute/login';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signup';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
