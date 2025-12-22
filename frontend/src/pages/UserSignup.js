import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiMail, FiUser, FiPhone, FiMapPin, FiBook, FiGift, FiLoader, FiCheckCircle, FiArrowRight, FiHeart, FiStar, FiAward, FiFileText } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import SearchableSelect from '../components/SearchableSelect';
import { Link } from '../components/CustomLink';

// Import centralized data from constants
import { INDIA_CITIES, ALL_INDIA_COURSES, ALL_INDIA_EXAMS } from '../constants/indiaData';

// Default content (used while loading or if API fails)
const DEFAULT_CONTENT = {
  logo_url: "/favicon.png",
  heading: "Join admissionbuddy",
  subheading: "Find your dream college and track your applications all in one place",
  gradient_from: "orange-500",
  gradient_via: "orange-600",
  gradient_to: "red-600",
  stats: [],
  benefits: [
    { icon: "check", text: "Compare 10,000+ colleges" },
    { icon: "check", text: "Track your applications" },
    { icon: "check", text: "Get personalized recommendations" },
    { icon: "gift", text: "Earn rewards for referrals" }
  ],
  form_title: "Create Account",
  form_subtitle: "Join thousands of students finding their dream college",
  footer_text: "Already have an account?",
  footer_link_text: "Sign In",
  footer_link_url: "/login"
};

// Icon mapping
const ICON_MAP = {
  check: FiCheckCircle,
  gift: FiGift,
  star: FiStar,
  heart: FiHeart,
  award: FiAward
};

const UserSignup = () => {
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState('email'); // email, otp, details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState(DEFAULT_CONTENT);
  
  // Form data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [course, setCourse] = useState('');
  const [exam, setExam] = useState('');
  const [referralCode, setReferralCode] = useState('');
  
  // All courses and exams for dropdown (using centralized data as fallback)
  const [courses, setCourses] = useState(ALL_INDIA_COURSES);
  const [exams, setExams] = useState(ALL_INDIA_EXAMS);
  
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
    
    // Fetch courses and content
    fetchCourses();
    fetchContent();
  }, [googleEmail, googleName, refCode]);
  
  const fetchContent = async () => {
    try {
      const response = await api.get('/admin/auth-pages/signup');
      if (response.data?.content) {
        setContent({ ...DEFAULT_CONTENT, ...response.data.content });
      }
    } catch (err) {
      console.log('Using default signup content');
    }
  };
  
  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      const apiCourses = response.data.map(c => typeof c === 'object' ? c.name : c);
      // Use API courses if available, otherwise use default list
      setCourses(apiCourses.length > 0 ? apiCourses : ALL_INDIA_COURSES);
    } catch (err) {
      console.error('Error fetching courses:', err);
      // Fallback to default courses list
      setCourses(ALL_INDIA_COURSES);
    }
  };
  
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/auth/callback';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };
  
  // Build gradient class dynamically
  const gradientClass = `bg-gradient-to-br from-${content.gradient_from} via-${content.gradient_via || content.gradient_from} to-${content.gradient_to}`;
  
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
        // Use setTimeout to ensure localStorage is saved before navigation
        setTimeout(() => {
          window.location.replace('/dashboard');
        }, 100);
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
      // Use setTimeout to ensure localStorage is saved before navigation
      setTimeout(() => {
        window.location.replace('/dashboard');
      }, 100);
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
  
  // Render benefit icon
  const renderIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || FiCheckCircle;
    return <IconComponent />;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Illustration/Branding */}
      <div className={`hidden lg:flex lg:w-1/2 ${gradientClass} relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-400/10 rounded-full blur-2xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <Link to="/">
            <img src={content.logo_url} alt="admissionbuddy" className="h-20 mb-8" />
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-center">{content.heading}</h1>
          <p className="text-xl text-orange-100 text-center max-w-md">
            {content.subheading}
          </p>
          
          {/* Stats (if any) */}
          {content.stats && content.stats.length > 0 && (
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              {content.stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-orange-200 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Benefits */}
          {content.benefits && content.benefits.length > 0 && (
            <div className="mt-12 space-y-4 text-left max-w-sm">
              {content.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    {renderIcon(benefit.icon)}
                  </div>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/">
              <img src={content.logo_url} alt="admissionbuddy" className="h-14 mx-auto mb-4" />
            </Link>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {formatError(error)}
            </div>
          )}
          
          {/* Step 1: Email Input */}
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{content.form_title}</h2>
                <p className="text-gray-500 mt-2">{content.form_subtitle}</p>
              </div>
              
              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <FcGoogle className="text-2xl" />
                <span className="font-medium text-gray-700">Continue with Google</span>
              </button>
              
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all text-gray-900"
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 py-4 text-base font-semibold rounded-xl shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 transition-all"
                >
                  {loading ? (
                    <><FiLoader className="animate-spin mr-2" /> Sending OTP...</>
                  ) : (
                    <>Continue with Email <FiArrowRight className="ml-2" /></>
                  )}
                </Button>
              </form>
              
              {/* Login Link */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600">
                  {content.footer_text}{' '}
                  <Link to={content.footer_link_url || '/login'} className="text-orange-600 hover:text-orange-700 font-semibold">
                    {content.footer_link_text}
                  </Link>
                </p>
              </div>
              
              {/* Back to Home */}
              <p className="mt-6 text-center">
                <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
                  ← Back to Home
                </Link>
              </p>
            </>
          )}
          
          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-orange-600 text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Check Your Email</h2>
                <p className="text-gray-500 mt-2">We sent a 6-digit code to <strong className="text-gray-700">{email}</strong></p>
              </div>
              
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full text-center text-2xl tracking-[0.5em] px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all font-mono"
                    maxLength={6}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 py-4 text-base font-semibold rounded-xl shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 transition-all"
                >
                  {loading ? (
                    <><FiLoader className="animate-spin mr-2" /> Verifying...</>
                  ) : (
                    <>Verify OTP <FiArrowRight className="ml-2" /></>
                  )}
                </Button>
              </form>
              
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full mt-4 text-gray-600 hover:text-gray-800 py-2"
              >
                ← Change Email
              </button>
            </>
          )}
          
          {/* Step 3: Complete Profile */}
          {step === 'details' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="text-green-600 text-2xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Almost There!</h2>
                <p className="text-gray-500 mt-2">Complete your profile to get started</p>
              </div>
              
              <form onSubmit={handleCompleteSignup} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all text-gray-900"
                      required
                    />
                  </div>
                </div>
                
                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600"
                    />
                  </div>
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all text-gray-900"
                      required
                    />
                  </div>
                </div>
                
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <SearchableSelect
                    options={INDIA_CITIES}
                    value={city}
                    onChange={setCity}
                    placeholder="Select your city"
                    className="rounded-xl"
                  />
                </div>
                
                {/* Course Interested */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Interested *</label>
                  <SearchableSelect
                    options={courses}
                    value={course}
                    onChange={setCourse}
                    placeholder="Select course"
                    className="rounded-xl"
                  />
                </div>
                
                {/* Referral Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Referral Code <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FiGift className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="Enter referral code"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all text-gray-900"
                    />
                  </div>
                  {referralCode && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FiGift size={12} /> You'll get ₹100 signup bonus!
                    </p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 py-4 text-base font-semibold rounded-xl shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 transition-all mt-6"
                >
                  {loading ? (
                    <><FiLoader className="animate-spin mr-2" /> Creating Account...</>
                  ) : (
                    <>Create Account <FiArrowRight className="ml-2" /></>
                  )}
                </Button>
              </form>
              
              {/* Login Link */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
