import React, { useState, useCallback, useEffect } from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiX, FiCheck, FiLoader } from 'react-icons/fi';
import { Button } from '../ui/button';
import api from '../../api/axios';

/**
 * Custom NavLink component that handles navigation with full page reload
 * as a workaround for React Router v7 interference from external scripts.
 */
const NavLink = ({ to, children, className, onClick, ...props }) => {
  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    window.location.href = to;
  }, [to, onClick]);
  
  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

// Indian states list for dropdown
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh"
];

// Register Institute Modal Component
const RegisterInstituteModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    institute_name: '',
    contact_person: '',
    designation: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    institute_type: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lead-forms/register-institute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            institute_name: '', contact_person: '', designation: '', email: '',
            phone: '', city: '', state: '', institute_type: '', message: ''
          });
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="admissionbuddy" className="h-10 w-10" />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
              <FiX size={20} />
            </button>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-bold">Register My Institute</h2>
            <p className="text-blue-100 text-sm">Join our network of 5000+ institutes</p>
          </div>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
            <p className="text-gray-600">Our team will contact you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name *</label>
              <input
                type="text"
                name="institute_name"
                value={formData.institute_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., ABC College of Engineering"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Admin, Principal"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@institute.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10-digit mobile"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute Type *</label>
              <select
                name="institute_type"
                value={formData.institute_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="University">University</option>
                <option value="Coaching">Coaching Institute</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell us about your requirements..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              {loading ? (
                <><FiLoader className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                'Submit Registration'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

// Advertise With Us Modal Component
const AdvertiseModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    designation: '',
    email: '',
    phone: '',
    advertising_interest: '',
    budget_range: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lead-forms/advertise-with-us`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            company_name: '', contact_person: '', designation: '', email: '',
            phone: '', advertising_interest: '', budget_range: '', message: ''
          });
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="admissionbuddy" className="h-10 w-10" />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
              <FiX size={20} />
            </button>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-bold">Advertise With Us</h2>
            <p className="text-orange-100 text-sm">Reach 1M+ students & parents</p>
          </div>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
            <p className="text-gray-600">Our advertising team will reach out shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company/Brand Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your company or brand name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Marketing Manager"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="10-digit mobile"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Advertising Interest *</label>
              <select
                name="advertising_interest"
                value={formData.advertising_interest}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Interest</option>
                <option value="Banner Ads">Banner Ads</option>
                <option value="Sponsored Listings">Sponsored Listings</option>
                <option value="Featured Placement">Featured Placement</option>
                <option value="Email Campaigns">Email Campaigns</option>
                <option value="Custom Campaign">Custom Campaign</option>
                <option value="Multiple Options">Multiple Options</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
              <select
                name="budget_range"
                value={formData.budget_range}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Budget</option>
                <option value="Under ₹50,000">Under ₹50,000</option>
                <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                <option value="₹1,00,000 - ₹5,00,000">₹1,00,000 - ₹5,00,000</option>
                <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 - ₹10,00,000</option>
                <option value="Above ₹10,00,000">Above ₹10,00,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Tell us about your advertising goals..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium"
            >
              {loading ? (
                <><FiLoader className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                'Submit Inquiry'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAdvertiseModal, setShowAdvertiseModal] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('Thank you for subscribing!');
    setEmail('');
  };

  const topExams = [
    { name: 'JEE Main', link: '/exams' },
    { name: 'NEET', link: '/exams' },
    { name: 'CAT', link: '/exams' },
    { name: 'CUET', link: '/exams' },
    { name: 'GATE', link: '/exams' },
    { name: 'JEE Advanced', link: '/exams' }
  ];

  const topColleges = [
    { name: 'Engineering Colleges', link: '/engineering' },
    { name: 'Medical Colleges', link: '/medical' },
    { name: 'MBA Colleges', link: '/mba' },
    { name: 'Law Colleges', link: '/law' }
  ];

  const topCourses = [
    { name: 'B.Tech', link: '/courses' },
    { name: 'MBA/PGDM', link: '/courses' },
    { name: 'MBBS', link: '/courses' },
    { name: 'B.Com', link: '/courses' },
    { name: 'BA', link: '/courses' },
    { name: 'B.Sc', link: '/courses' }
  ];

  const studyAbroad = [
    { name: 'Study in USA', link: '/study-abroad' },
    { name: 'Study in UK', link: '/study-abroad' },
    { name: 'Study in Canada', link: '/study-abroad' },
    { name: 'Study in Australia', link: '/study-abroad' }
  ];

  const resources = [
    { name: 'Scholarships', link: '/scholarships' },
    { name: 'Education Loans', link: '/loans' },
    { name: 'Compare Colleges', link: '/compare' },
    { name: 'College Predictor', link: '/eligibility-checker' },
    { name: 'Blog', link: '/blog' }
  ];

  const quickLinks = [
    { name: 'About Us', link: '/about' },
    { name: 'Contact Us', link: '/contact' },
    { name: 'Privacy Policy', link: '/privacy' },
    { name: 'Terms & Conditions', link: '/terms' }
  ];

  return (
    <footer className="bg-black text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-1">
                Subscribe to our Newsletter
              </h3>
              <p className="text-orange-100 text-sm">
                Get College Notifications, Exam Notifications and News Updates
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto items-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2.5 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-white h-11 text-sm"
              />
              <Button type="submit" className="bg-white text-orange-600 hover:bg-gray-100 whitespace-nowrap h-11 px-6 text-sm">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Top Exams */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">TOP EXAMS</h4>
            <ul className="space-y-2">
              {topExams.map((exam, idx) => (
                <li key={idx}>
                  <NavLink to={exam.link} className="text-sm hover:text-orange-500 transition-colors">
                    {exam.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Colleges */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">TOP COLLEGES</h4>
            <ul className="space-y-2">
              {topColleges.map((college, idx) => (
                <li key={idx}>
                  <NavLink to={college.link} className="text-sm hover:text-orange-500 transition-colors">
                    {college.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Courses */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">TOP COURSES</h4>
            <ul className="space-y-2">
              {topCourses.map((course, idx) => (
                <li key={idx}>
                  <NavLink to={course.link} className="text-sm hover:text-orange-500 transition-colors">
                    {course.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Study Abroad */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">STUDY ABROAD</h4>
            <ul className="space-y-2">
              {studyAbroad.map((country, idx) => (
                <li key={idx}>
                  <NavLink to={country.link} className="text-sm hover:text-orange-500 transition-colors">
                    {country.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">RESOURCES</h4>
            <ul className="space-y-2">
              {resources.map((resource, idx) => (
                <li key={idx}>
                  <NavLink to={resource.link} className="text-sm hover:text-orange-500 transition-colors">
                    {resource.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">QUICK LINKS</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <NavLink to={link.link} className="text-sm hover:text-orange-500 transition-colors">
                    {link.name}
                  </NavLink>
                </li>
              ))}
              {/* Modal trigger links */}
              <li>
                <button 
                  onClick={() => setShowRegisterModal(true)}
                  className="text-sm hover:text-orange-500 transition-colors text-left"
                >
                  Register My Institute
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowAdvertiseModal(true)}
                  className="text-sm hover:text-orange-500 transition-colors text-left"
                >
                  Advertise With Us
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* For Institutions Banner */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-900 rounded-xl p-6">
            <div>
              <h4 className="text-white font-bold text-lg mb-1">Are you an Institution?</h4>
              <p className="text-gray-400 text-sm">Manage your leads, applications and analytics from your dashboard</p>
            </div>
            <NavLink to="/institute/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                Institute Login →
              </Button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and Copyright */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <img src="/assets/main-logo.png" alt="admissionbuddy" className="h-6" />
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} admissionbuddy. All rights reserved.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="LinkedIn">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="YouTube">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RegisterInstituteModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
      />
      <AdvertiseModal 
        isOpen={showAdvertiseModal} 
        onClose={() => setShowAdvertiseModal(false)} 
      />
    </footer>
  );
};

export default Footer;
