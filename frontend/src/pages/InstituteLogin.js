import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLock, FiLoader, FiAlertCircle } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const InstituteLogin = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError('Please enter login ID and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/institute/login', {
        login_id: loginId,
        password: password
      });
      
      localStorage.setItem('institute_token', response.data.session_token);
      localStorage.setItem('institute', JSON.stringify(response.data.institution));
      
      if (response.data.needs_password_change) {
        alert('Please change your password for security.');
      }
      
      navigate('/institute/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please enter your email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/institute/forgot-password', { email: forgotEmail });
      setForgotSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/favicon.png" alt="Admission Buddy" className="h-16 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Institution Portal</h1>
          <p className="text-blue-200 mt-2">Manage your leads and applications</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {!showForgotPassword ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Login to Your Account</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <FiAlertCircle /> {error}
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Login ID</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value.toUpperCase())}
                      placeholder="e.g., AIIM0001"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                >
                  {loading ? (
                    <><FiLoader className="animate-spin mr-2" /> Logging in...</>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Reset Password</h2>
              
              {forgotSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Sent!</h3>
                  <p className="text-gray-600 mb-4">Check your email for the reset token.</p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotSuccess(false);
                      setForgotEmail('');
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    ← Back to Login
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleForgotPassword}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                    >
                      {loading ? (
                        <><FiLoader className="animate-spin mr-2" /> Sending...</>
                      ) : (
                        'Send Reset Token'
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError('');
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        
        {/* Info Box */}
        <div className="mt-6 bg-blue-800 bg-opacity-50 rounded-xl p-4 text-blue-100 text-sm">
          <p className="font-medium mb-2">🔐 Login Credentials</p>
          <p>Your login credentials were sent to your registered email and phone when your institution was added to Admission Buddy.</p>
        </div>
      </div>
    </div>
  );
};

export default InstituteLogin;
