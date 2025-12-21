import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiSend, FiLoader, FiCheck, FiMessageCircle } from 'react-icons/fi';
import api from '../api/axios';
import { INDIAN_CITIES } from '../utils/urlHelpers';
import SearchableSelect from './SearchableSelect';

// Format city name for display (capitalize first letter)
const formatCityName = (city) => {
  return city.charAt(0).toUpperCase() + city.slice(1);
};

// Sorted cities for dropdown
const SORTED_CITIES = [...INDIAN_CITIES].sort().map(formatCityName);

// School classes for school forms
const SCHOOL_CLASSES = [
  'Nursery', 'LKG', 'UKG', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11 - Science', 'Class 11 - Commerce', 'Class 11 - Arts',
  'Class 12 - Science', 'Class 12 - Commerce', 'Class 12 - Arts'
];

const ApplyNowModal = ({ 
  isOpen, 
  onClose, 
  collegeId = null,
  collegeName = null,
  collegeLogoUrl = null,
  collegeCourses = [],
  formHeading = null,
  source = 'general',
  isSchool = false,  // NEW: Flag to indicate if this is a school
  schoolClasses = [] // NEW: Classes offered by school
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    course_interested: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);  // All courses for general form
  const [settings, setSettings] = useState(null);
  
  // Memoize collegeCourses to prevent infinite loops - use stable reference
  const collegeCourseString = collegeCourses.join(',');
  const memoizedCollegeCourses = useMemo(() => collegeCourses, [collegeCourseString]);

  // Fetch lead settings and all courses on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [settingsRes, coursesRes] = await Promise.all([
          api.get('/lead-settings'),
          api.get('/courses')  // Fetch all courses for general form
        ]);
        setSettings(settingsRes.data);
        // Extract course names from courses data
        const courseNames = coursesRes.data
          .map(c => c.name)
          .filter(Boolean)
          .sort();
        // Add "School Admission" at the beginning for general form
        const uniqueCourses = [...new Set(courseNames)];
        setAllCourses(['School Admission', ...uniqueCourses]);
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
      }
    };
    fetchInitialData();
  }, []);

  // Set courses from props - courses come from CollegeContext via CollegeDetailPage
  // For college-specific forms: use collegeCourses passed via props
  // For school-specific forms: use school classes
  // For general forms: use allCourses fetched from /api/courses
  useEffect(() => {
    if (isSchool) {
      // School-specific form: use school classes
      const classes = schoolClasses.length > 0 ? schoolClasses : SCHOOL_CLASSES;
      setCourses(classes);
    } else if (memoizedCollegeCourses.length > 0) {
      // College-specific form: use the courses from the college data
      setCourses(memoizedCollegeCourses);
    } else {
      // General form or college has no courses: clear local courses (will use allCourses)
      setCourses([]);
    }
  }, [memoizedCollegeCourses, isSchool, schoolClasses]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        mobile: '',
        city: '',
        course_interested: ''
      });
      setSuccess(false);
      setError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.city || !formData.course_interested) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        college_id: collegeId,
        college_name: collegeName || 'General Inquiry',
        source: source,
        form_heading: formHeading || settings?.general_form_heading || 'Apply Now'
      };

      await api.post('/leads', payload);
      setSuccess(true);
      
      // Mark user as having submitted a lead - they won't get popup on every page anymore
      localStorage.setItem('leadSubmitted', 'true');
      sessionStorage.setItem('applyPopupShown', 'true');
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const whatsappNumber = settings?.whatsapp_business_number || '919876543210';
    const message = encodeURIComponent(
      `Hi, I'm interested in ${collegeName || 'your courses'}. My name is ${formData.name || '[Your Name]'} and I want to know more about ${formData.course_interested || 'the available courses'}.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  const displayHeading = formHeading || (collegeName ? `Apply to ${collegeName}` : (settings?.general_form_heading || 'Get Expert Counselling'));
  const displaySubheading = collegeName 
    ? 'Fill the form and our counsellor will guide you through the admission process'
    : (settings?.general_form_subheading || 'Fill the form and our team will get back to you within 24 hours');

  return (
    <div 
      className="fixed left-0 right-0 bottom-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" 
      onClick={onClose}
      style={{ top: '64px' }}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Logo - z-60 to stay above dropdown (z-50) */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 relative sticky top-0 z-[60]">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <FiX className="w-5 h-5" />
          </button>
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
              {collegeLogoUrl ? (
                <img 
                  src={collegeLogoUrl} 
                  alt={collegeName || 'College'} 
                  className="w-10 h-10 object-contain"
                  onError={(e) => { e.target.src = '/favicon.png'; }}
                />
              ) : (
                <img 
                  src="/favicon.png" 
                  alt="admissionbuddy" 
                  className="w-10 h-10 object-contain"
                />
              )}
            </div>
            <div className="flex-1 pr-6">
              <h2 className="text-lg font-bold leading-tight">{displayHeading}</h2>
              <p className="text-orange-100 text-xs mt-0.5">{displaySubheading}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-4">
          {success ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Thank You!</h3>
              <p className="text-gray-600 text-sm mb-3">Our counsellor will contact you shortly.</p>
              {settings?.whatsapp_business_number && (
                <button
                  onClick={openWhatsApp}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mobile *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* City - Searchable Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                <SearchableSelect
                  name="city"
                  options={SORTED_CITIES}
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Search & select city"
                  searchPlaceholder="Type to search cities..."
                  icon={<FiMapPin className="w-4 h-4" />}
                  required
                />
              </div>

              {/* Course Interested - Searchable Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {isSchool ? 'Class Interested *' : 'Course Interested *'}
                </label>
                {/* College-specific form: use college courses, School form: use classes, General form: use all courses */}
                <SearchableSelect
                  name="course_interested"
                  options={courses.length > 0 ? courses : allCourses}
                  value={formData.course_interested}
                  onChange={handleChange}
                  placeholder={isSchool ? "Search & select class" : "Search & select course"}
                  searchPlaceholder={isSchool ? "Type to search classes..." : "Type to search courses..."}
                  icon={<FiBook className="w-4 h-4" />}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>

              {/* WhatsApp Option */}
              {settings?.whatsapp_business_number && (
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="w-full mt-2 py-2 border border-green-500 text-green-600 text-sm font-medium rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </button>
              )}

              <p className="text-xs text-gray-400 mt-2 text-center">
                By submitting, you agree to our Terms & Privacy Policy
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyNowModal;
