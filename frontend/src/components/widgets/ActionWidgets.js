import React, { useState } from 'react';
import { FiSend, FiMessageCircle, FiUsers, FiX, FiPhone, FiMail, FiCheckCircle, FiUser, FiMapPin, FiBook, FiLoader } from 'react-icons/fi';
import { HiOutlineSparkles, HiOutlineChatAlt2 } from 'react-icons/hi';
import { Button } from '../ui/button';
import { INDIAN_CITIES } from '../../utils/urlHelpers';
import api from '../../api/axios';

// Format city name for display
const formatCityName = (city) => city.charAt(0).toUpperCase() + city.slice(1);
const SORTED_CITIES = [...INDIAN_CITIES].sort().map(formatCityName);

// Apply Now Widget - with Admission Buddy logo and city dropdown
export const ApplyNowWidget = ({ collegeName, collegeLogoUrl, courseName, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    course: courseName || ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        city: formData.city,
        course_interested: formData.course,
        college_name: collegeName || 'General Inquiry',
        source: 'homepage_widget'
      };
      await api.post('/leads', payload);
      setSubmitted(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <FiCheckCircle className="mx-auto text-green-600 mb-2" size={40} />
        <h3 className="font-semibold text-green-800">Application Submitted!</h3>
        <p className="text-sm text-green-600">We will contact you soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
            {collegeLogoUrl ? (
              <img src={collegeLogoUrl} alt={collegeName || 'College'} className="w-8 h-8 object-contain" onError={(e) => { e.target.src = '/favicon.png'; }} />
            ) : (
              <img src="/favicon.png" alt="Admission Buddy" className="w-8 h-8 object-contain" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">Apply Now</h3>
            <p className="text-xs text-white/80">{collegeName || 'Start your admission journey'}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <FiX size={20} />
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white text-sm"
          />
        </div>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="tel"
              placeholder="Phone"
              maxLength={10}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              className="w-full pl-10 pr-2 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white text-sm"
            />
          </div>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 pointer-events-none z-10" />
            <select
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
              className="w-full pl-10 pr-2 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white text-sm appearance-none cursor-pointer [&>option]:text-gray-800"
            >
              <option value="" className="text-gray-500">Select City</option>
              {SORTED_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="relative">
          <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Course Interested (e.g., B.Tech, MBA)"
            value={formData.course}
            onChange={(e) => setFormData({...formData, course: e.target.value})}
            required
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
      </form>
    </div>
  );
};

// Ask a Question Widget
export const AskQuestionWidget = ({ context, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || email.split('@')[0],
          email: email,
          phone: phone,
          subject: 'Question from Homepage',
          message: question,
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(data.detail || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting question:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <FiCheckCircle className="mx-auto text-blue-600 mb-2" size={40} />
        <h3 className="font-semibold text-blue-800">Question Submitted!</h3>
        <p className="text-sm text-blue-600">Our team will respond shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HiOutlineChatAlt2 size={24} />
          <h3 className="font-bold text-lg">Ask a Question</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <FiX size={20} />
          </button>
        )}
      </div>
      <p className="text-sm text-white/90 mb-4">
        Have a query? Our experts are here to help!
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white"
        />
        <input
          type="tel"
          placeholder="Your Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white"
        />
        <textarea
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white resize-none"
        />
        {error && (
          <p className="text-red-200 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>
    </div>
  );
};

// Need Counselling Widget
export const CounsellingWidget = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredTime: 'morning',
    interest: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lead-forms/counselling-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          preferred_time: formData.preferredTime,
          interest: formData.interest
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(data.detail || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting counselling request:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
        <FiCheckCircle className="mx-auto text-purple-600 mb-2" size={40} />
        <h3 className="font-semibold text-purple-800">Request Submitted!</h3>
        <p className="text-sm text-purple-600">A counsellor will call you soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiUsers size={24} />
          <h3 className="font-bold text-lg">Need Counselling?</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <FiX size={20} />
          </button>
        )}
      </div>
      <p className="text-sm text-white/90 mb-4">
        Get free career guidance from our expert counsellors
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white"
        />
        <select
          value={formData.preferredTime}
          onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
        >
          <option value="morning" className="text-gray-800">Morning (9 AM - 12 PM)</option>
          <option value="afternoon" className="text-gray-800">Afternoon (12 PM - 4 PM)</option>
          <option value="evening" className="text-gray-800">Evening (4 PM - 7 PM)</option>
        </select>
        <input
          type="text"
          placeholder="Area of Interest (e.g., Engineering, Medical)"
          value={formData.interest}
          onChange={(e) => setFormData({...formData, interest: e.target.value})}
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white"
        />
        {error && (
          <p className="text-red-200 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Request Callback'}
        </button>
      </form>
    </div>
  );
};

// Sponsor Ad Widget
export const SponsorAdWidget = ({ 
  title = "Featured Partner",
  description = "Explore top programs with exclusive benefits",
  image,
  link,
  sponsor,
  onClose 
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-white/80 hover:text-white z-10 bg-black/30 rounded-full p-1"
          >
            <FiX size={16} />
          </button>
        )}
        {image && (
          <img 
            src={image} 
            alt={`${sponsor || 'Partner'} - ${title} | AdmissionBuddy`}
            className="w-full h-32 object-cover"
          />
        )}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-yellow-500 text-yellow-900 text-[10px] font-bold rounded uppercase">
            Sponsored
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
        <p className="text-gray-300 text-sm mb-3">{description}</p>
        {sponsor && (
          <p className="text-gray-400 text-xs mb-3">By {sponsor}</p>
        )}
        <a
          href={link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg text-center hover:bg-yellow-400 transition-colors"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

// Floating Widget Button
export const FloatingWidgetButton = ({ icon: Icon, label, onClick, color = 'orange' }) => {
  const colorClasses = {
    orange: 'bg-orange-500 hover:bg-orange-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    green: 'bg-green-500 hover:bg-green-600'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 ${colorClasses[color]} text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
    >
      <Icon size={18} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
};

// Sidebar Widgets Container
export const SidebarWidgets = ({ showApply = true, showQuestion = true, showCounselling = true, showAd = true }) => {
  return (
    <div className="space-y-4">
      {showApply && <ApplyNowWidget />}
      {showQuestion && <AskQuestionWidget />}
      {showCounselling && <CounsellingWidget />}
      {showAd && (
        <SponsorAdWidget
          title="Top MBA Programs 2024"
          description="Get 50% scholarship on early applications"
          image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop"
          sponsor="IIM Bangalore"
          link="#"
        />
      )}
    </div>
  );
};

// Compact Widget Cards (for homepage)
export const CompactWidgetCards = () => {
  const [activeWidget, setActiveWidget] = useState(null);

  const widgets = [
    { id: 'apply', label: 'Apply Now', icon: FiSend, color: 'from-orange-500 to-orange-600' },
    { id: 'question', label: 'Ask Question', icon: FiMessageCircle, color: 'from-blue-500 to-blue-600' },
    { id: 'counselling', label: 'Free Counselling', icon: FiUsers, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="relative">
      {/* Widget Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {widgets.map(widget => (
          <button
            key={widget.id}
            onClick={() => setActiveWidget(activeWidget === widget.id ? null : widget.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br ${widget.color} text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
          >
            <widget.icon size={24} />
            <span className="text-xs font-medium">{widget.label}</span>
          </button>
        ))}
      </div>

      {/* Active Widget Modal */}
      {activeWidget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            {activeWidget === 'apply' && <ApplyNowWidget onClose={() => setActiveWidget(null)} />}
            {activeWidget === 'question' && <AskQuestionWidget onClose={() => setActiveWidget(null)} />}
            {activeWidget === 'counselling' && <CounsellingWidget onClose={() => setActiveWidget(null)} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default {
  ApplyNowWidget,
  AskQuestionWidget,
  CounsellingWidget,
  SponsorAdWidget,
  FloatingWidgetButton,
  SidebarWidgets,
  CompactWidgetCards
};
