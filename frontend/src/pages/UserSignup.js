import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiMail, FiUser, FiPhone, FiMapPin, FiBook, FiGift, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import SearchableSelect from '../components/SearchableSelect';

// All India Cities
const INDIA_CITIES = [
  "Agra", "Ahmedabad", "Ajmer", "Aligarh", "Allahabad", "Amritsar", "Aurangabad",
  "Bangalore", "Bareilly", "Bhopal", "Bhubaneswar", "Bikaner", "Chandigarh", "Chennai",
  "Coimbatore", "Cuttack", "Dehradun", "Delhi", "Dhanbad", "Durgapur", "Faridabad",
  "Ghaziabad", "Gorakhpur", "Gurgaon", "Guwahati", "Gwalior", "Hubli", "Hyderabad",
  "Indore", "Jabalpur", "Jaipur", "Jalandhar", "Jammu", "Jamshedpur", "Jodhpur",
  "Kanpur", "Kochi", "Kolkata", "Kota", "Lucknow", "Ludhiana", "Madurai", "Mangalore",
  "Meerut", "Mumbai", "Mysore", "Nagpur", "Nashik", "Navi Mumbai", "Noida", "Patna",
  "Pondicherry", "Pune", "Raipur", "Rajkot", "Ranchi", "Salem", "Siliguri", "Srinagar",
  "Surat", "Thane", "Thiruvananthapuram", "Tiruchirappalli", "Tiruppur", "Udaipur",
  "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam", "Warangal"
];

const UserSignup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState('email'); // email, otp, details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [course, setCourse] = useState('');
  const [referralCode, setReferralCode] = useState('');
  
  // All courses for dropdown
  const [courses, setCourses] = useState([]);
  
  // Pre-fill from Google auth or referral
  const googleEmail = searchParams.get('email');
  const googleName = searchParams.get('name');
  const refCode = searchParams.get('ref');
  
  useEffect(() => {
    // Pre-fill if coming from Google auth
    if (googleEmail) {
      setEmail(googleEmail);
      setStep('details');
    }
    if (googleName) {
      setName(googleName);
    }
    if (refCode) {
      setReferralCode(refCode);
    }
    
    // Fetch courses
    fetchCourses();
  }, [googleEmail, googleName, refCode]);
  
  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.map(c => typeof c === 'object' ? c.name : c));
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };
  
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/auth/callback';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };
  
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/user/send-otp', { email });
      setStep('otp');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || 'Failed to send OTP');
      } else if (typeof detail === 'object' && detail !== null) {
        setError(detail.msg || detail.message || 'Failed to send OTP');
      } else {
        setError(detail || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/user/verify-otp', { email, otp });
      
      if (response.data.status === 'pending_signup') {
        setStep('details');
      } else if (response.data.status === 'authenticated') {
        // User exists, login successful
        localStorage.setItem('token', response.data.session_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || 'Invalid OTP');
      } else if (typeof detail === 'object' && detail !== null) {
        setError(detail.msg || detail.message || 'Invalid OTP');
      } else {
        setError(detail || 'Invalid OTP');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    
    if (!name || !phone || !city || !course) {
      setError('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/user/complete-signup', {
        name,
        email,
        phone,
        city,
        course,
        referral_code: referralCode || null
      });
      
      localStorage.setItem('token', response.data.session_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      // Handle validation errors (Pydantic returns array of objects)
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        // Extract first error message
        const firstError = detail[0];
        setError(firstError?.msg || firstError?.message || 'Validation error');
      } else if (typeof detail === 'object' && detail !== null) {
        setError(detail.msg || detail.message || JSON.stringify(detail));
      } else {
        setError(detail || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to format error for display
  const formatError = (error) => {
    if (typeof error === 'string') return error;
    if (Array.isArray(error)) return error.map(e => e.msg || e.message || String(e)).join(', ');
    if (typeof error === 'object' && error !== null) return error.msg || error.message || JSON.stringify(error);
    return String(error);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/favicon.png" alt="Admission Buddy" className="h-16 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-2">Join thousands of students finding their dream college</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formatError(error)}
            </div>
          )}
          
          {/* Step 1: Email Input */}
          {step === 'email' && (
            <>
              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition mb-6"
              >
                <FcGoogle className="text-2xl" />
                <span className="font-medium text-gray-700">Continue with Google</span>
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              
              <form onSubmit={handleSendOTP}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 py-3 text-lg"
                >
                  {loading ? (
                    <><FiLoader className="animate-spin mr-2" /> Sending OTP...</>
                  ) : (
                    'Continue with Email'
                  )}
                </Button>
              </form>
            </>
          )}
          
          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-orange-600 text-2xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Check Your Email</h2>
                <p className="text-gray-600 mt-2">We sent a 6-digit code to <strong>{email}</strong></p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  maxLength={6}
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 py-3 text-lg"
              >
                {loading ? (
                  <><FiLoader className="animate-spin mr-2" /> Verifying...</>
                ) : (
                  'Verify OTP'
                )}
              </Button>
              
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full mt-4 text-orange-600 hover:text-orange-700"
              >
                ← Change Email
              </button>
            </form>
          )}
          
          {/* Step 3: Complete Profile */}
          {step === 'details' && (
            <form onSubmit={handleCompleteSignup}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="text-green-600 text-2xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Almost There!</h2>
                <p className="text-gray-600 mt-2">Complete your profile to continue</p>
              </div>
              
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
                
                {/* City Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <SearchableSelect
                    options={INDIA_CITIES}
                    value={city}
                    onChange={setCity}
                    placeholder="Search & select city"
                    icon={<FiMapPin className="text-gray-400" />}
                  />
                </div>
                
                {/* Course Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Interested *</label>
                  <SearchableSelect
                    options={courses.length > 0 ? courses : ['B.Tech', 'M.Tech', 'MBA', 'BBA', 'B.Sc', 'M.Sc', 'MBBS', 'BDS', 'LLB', 'B.Com', 'M.Com', 'BCA', 'MCA', 'B.Pharm', 'M.Pharm']}
                    value={course}
                    onChange={setCourse}
                    placeholder="Search & select course"
                    icon={<FiBook className="text-gray-400" />}
                  />
                </div>
                
                {/* Referral Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code (Optional)</label>
                  <div className="relative">
                    <FiGift className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="Enter referral code"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  {referralCode && (
                    <p className="text-xs text-green-600 mt-1">🎁 You&apos;ll get ₹100 signup bonus!</p>
                  )}
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-orange-600 hover:bg-orange-700 py-3 text-lg"
              >
                {loading ? (
                  <><FiLoader className="animate-spin mr-2" /> Creating Account...</>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          )}
          
          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
