import React from 'react';
import { FiLogIn, FiUserPlus, FiX } from 'react-icons/fi';
import { Button } from './ui/button';

const LoginPromptModal = ({ isOpen, onClose, action = 'continue', message }) => {
  if (!isOpen) return null;

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handleSignup = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/signup?redirect=${encodeURIComponent(currentPath)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-center text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <FiX size={24} />
          </button>
          <div className="flex justify-center mb-4">
            <img src="/favicon.png" alt="admissionbuddy" className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-white/90">
            {message || `Please login or create an account to ${action}`}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg flex items-center justify-center gap-3"
          >
            <FiLogIn size={20} />
            Login to Your Account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Button 
            onClick={handleSignup}
            variant="outline"
            className="w-full py-6 text-lg flex items-center justify-center gap-3 border-2 hover:bg-gray-50"
          >
            <FiUserPlus size={20} />
            Create New Account
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Join thousands of students sharing their experiences
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
