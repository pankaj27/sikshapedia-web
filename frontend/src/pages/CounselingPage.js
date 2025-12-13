import React, { useState, useEffect } from 'react';
import { FiStar, FiCalendar, FiClock, FiVideo, FiPhone, FiMessageSquare, FiAward } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import MetaTags from '../components/SEO/MetaTags';

const CounselingPage = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formData, setFormData] = useState({
    session_type: 'Career',
    session_date: '',
    session_time: '',
    mode: 'Video',
    student_name: '',
    student_email: '',
    student_phone: '',
    current_education: '',
    query_description: ''
  });

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await api.get('/counselors');
      setCounselors(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (counselor) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setSelectedCounselor(counselor);
    setFormData({
      ...formData,
      student_name: user.name || '',
      student_email: user.email || ''
    });
    setShowBookingModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData, counselor_id: selectedCounselor.id };
      await api.post('/counseling-sessions', submitData);
      alert('Session booked successfully! Check your dashboard for details.');
      setShowBookingModal(false);
    } catch (error) {
      alert(error.response?.data?.detail || 'Error booking session');
    }
  };

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'Video': return <FiVideo />;
      case 'Phone': return <FiPhone />;
      case 'Chat': return <FiMessageSquare />;
      default: return <FiVideo />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags title="Career Counseling - Book Free Sessions | AdmissionBuddy" />

      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Counseling</h1>
          <p className="text-xl">Book free sessions with expert counselors. Get personalized guidance for your career, exams, and study abroad plans.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {counselors.map((counselor) => (
            <div key={counselor.id} className="bg-white rounded-lg shadow hover:shadow-xl transition">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {counselor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{counselor.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <FiStar className="text-yellow-500" />
                      <span className="font-semibold">{counselor.rating}</span>
                      <span className="text-sm text-gray-500">({counselor.total_reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-3">{counselor.bio}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FiAward className="text-green-600" />
                    <span>{counselor.experience_years} years experience</span>
                  </div>
                  <div>
                    <span className="font-medium">Specialization:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {counselor.specialization.map((spec, idx) => (
                        <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <strong>{counselor.total_sessions}</strong> sessions completed
                </div>

                <Button
                  onClick={() => handleBookClick(counselor)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Book Free Session
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Book Counseling Session</h2>
              <p className="text-gray-600">{selectedCounselor?.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Session Type *</label>
                  <select name="session_type" value={formData.session_type} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg">
                    <option value="Career">Career Guidance</option>
                    <option value="Exam">Exam Preparation</option>
                    <option value="Course">Course Selection</option>
                    <option value="Study Abroad">Study Abroad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mode *</label>
                  <select name="mode" value={formData.mode} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg">
                    <option value="Video">Video Call</option>
                    <option value="Phone">Phone Call</option>
                    <option value="Chat">Chat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input type="date" name="session_date" value={formData.session_date} onChange={handleInputChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time *</label>
                  <select name="session_time" value={formData.session_time} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg">
                    <option value="">Select Time</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input type="text" name="student_name" value={formData.student_name} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" name="student_email" value={formData.student_email} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input type="tel" name="student_phone" value={formData.student_phone} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Education *</label>
                  <input type="text" name="current_education" value={formData.current_education} onChange={handleInputChange} required placeholder="e.g., Class 12, B.Tech 2nd Year" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Query Description *</label>
                  <textarea name="query_description" value={formData.query_description} onChange={handleInputChange} required rows="3" placeholder="Describe what you need help with..." className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">Book Session</Button>
                <Button type="button" variant="outline" onClick={() => setShowBookingModal(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselingPage;
