import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

/**
 * AuthCallback - Handles Google OAuth callback
 * 
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
 * 
 * Flow:
 * 1. User lands here after Google auth with session_id in URL fragment
 * 2. Extract session_id, exchange for user data
 * 3. If user exists: Login and redirect to dashboard
 * 4. If new user: Redirect to signup with pre-filled data
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);
  
  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    
    const processAuth = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = location.hash || window.location.hash;
        const params = new URLSearchParams(hash.replace('#', ''));
        const sessionId = params.get('session_id');
        
        if (!sessionId) {
          console.error('No session_id found in URL');
          navigate('/signup');
          return;
        }
        
        // Exchange session_id for user data
        const response = await api.post('/auth/user/google/session', {
          session_id: sessionId
        });
        
        if (response.data.status === 'pending_signup') {
          // New user - redirect to complete signup
          const { email, name, picture } = response.data;
          const params = new URLSearchParams();
          if (email) params.set('email', email);
          if (name) params.set('name', name);
          navigate(`/signup?${params.toString()}`);
        } else if (response.data.status === 'authenticated') {
          // Existing user - login successful
          localStorage.setItem('token', response.data.session_token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/signup');
      }
    };
    
    processAuth();
  }, [navigate, location]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
