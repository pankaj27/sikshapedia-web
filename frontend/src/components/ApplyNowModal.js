import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiSend, FiLoader, FiCheck, FiMessageCircle } from 'react-icons/fi';
import api from '../api/axios';

const ApplyNowModal = ({ 
  isOpen, 
  onClose, 
  collegeId = null,
  collegeName = null,
  collegeCourses = [],
  formHeading = null,
  source = 'general'
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
  const [courses, setCourses] = useState(collegeCourses);
  const [settings, setSettings] = useState(null);

  // Fetch lead settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/lead-settings');
        setSettings(response.data);
      } catch (err) {
        console.error('Failed to fetch lead settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Fetch courses if collegeId provided but no courses passed
  useEffect(() => {
    if (collegeId && collegeCourses.length === 0) {
      const fetchCourses = async () => {
        try {
          const response = await api.get(`/colleges/${collegeId}/courses-for-form`);
          setCourses(response.data.courses || []);
        } catch (err) {
          console.error('Failed to fetch college courses:', err);
        }
      };
      fetchCourses();
    } else {
      setCourses(collegeCourses);
    }
  }, [collegeId, collegeCourses]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        mobile: '',
        city: '',
        course_interested: courses.length > 0 ? courses[0] : ''
      });
      setSuccess(false);
      setError('');
    }
  }, [isOpen, courses]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold pr-8">{displayHeading}</h2>
          <p className="text-orange-100 text-sm mt-1">{displaySubheading}</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-4">We've received your inquiry. Our counsellor will contact you shortly.</p>
              {settings?.whatsapp_business_number && (
                <button
                  onClick={openWhatsApp}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Course Interested */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Interested *</label>
                <div className="relative">
                  <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  {courses.length > 0 ? (
                    <select
                      name="course_interested"
                      value={formData.course_interested}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white"
                      required
                    >
                      <option value="">Select a course</option>
                      {courses.map((course, idx) => (
                        <option key={idx} value={course}>{course}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="course_interested"
                      value={formData.course_interested}
                      onChange={handleChange}
                      placeholder="e.g., B.Tech, MBA, MBBS"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
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
                <div className="text-center">
                  <span className="text-gray-500 text-sm">or</span>
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="w-full mt-2 py-2.5 border-2 border-green-500 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-gray-500">
            By submitting, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplyNowModal;
