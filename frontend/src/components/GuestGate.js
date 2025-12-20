import React, { useState, useEffect } from 'react';
import { FiLock, FiUserPlus } from 'react-icons/fi';
import { Button } from './ui/button';

/**
 * GuestGate - Blurs content for guest users and prompts registration
 * 
 * Props:
 * - children: Content to show (blurred for guests)
 * - title: Title shown in the gate overlay (e.g., "Fee Details", "Placement Data")
 * - blurAmount: Amount of blur (default: 8px)
 */
const GuestGate = ({ children, title = "This Content", blurAmount = 8 }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for session cookie or token
    const checkAuth = () => {
      const hasSession = document.cookie.includes('session_token') || 
                        localStorage.getItem('user_token') ||
                        localStorage.getItem('user');
      setIsLoggedIn(hasSession);
    };
    checkAuth();
    
    // Re-check on storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleClick = () => {
    if (!isLoggedIn) {
      setShowPrompt(true);
    }
  };

  const handleRegister = () => {
    // Store current URL to redirect back after login
    sessionStorage.setItem('redirect_after_login', window.location.pathname);
    window.location.href = '/signup';
  };

  const handleLogin = () => {
    sessionStorage.setItem('redirect_after_login', window.location.pathname);
    window.location.href = '/login';
  };

  // If logged in, show content normally
  if (isLoggedIn) {
    return <>{children}</>;
  }

  // Guest view - blurred with overlay
  return (
    <div className="relative">
      {/* Blurred Content */}
      <div 
        style={{ filter: `blur(${blurAmount}px)` }}
        className="select-none pointer-events-none"
      >
        {children}
      </div>

      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center cursor-pointer"
        onClick={handleClick}
      >
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiLock className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Register to View {title}</h3>
          <p className="text-sm text-gray-500 mb-3">Create a free account to access all details</p>
          <Button 
            onClick={handleRegister}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <FiUserPlus className="w-4 h-4 mr-2" /> Register Free
          </Button>
        </div>
      </div>

      {/* Registration Prompt Modal */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPrompt(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock {title}</h2>
              <p className="text-gray-600 mb-6">
                Create a free account to view fee details, placement data, admission dates, and more. 
                Plus, earn rewards for reviews!
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleRegister}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
                >
                  <FiUserPlus className="w-4 h-4 mr-2" /> Create Free Account
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleLogin}
                  className="w-full py-3"
                >
                  Already have an account? Login
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  🎁 Bonus: Earn ₹50+ for every review you write!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestGate;
