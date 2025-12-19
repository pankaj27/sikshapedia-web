import React, { useState, useEffect } from 'react';
import { FiSearch, FiDollarSign, FiAward, FiCalendar, FiExternalLink, FiCheckCircle, FiFilter, FiUsers, FiTarget } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import MetaTags from '../components/SEO/MetaTags';

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scholarshipType, setScholarshipType] = useState('all');
  const [provider, setProvider] = useState('all');
  const [educationLevel, setEducationLevel] = useState('all');
  const [eligibleScholarships, setEligibleScholarships] = useState([]);
  const [showEligibilityChecker, setShowEligibilityChecker] = useState(false);
  const [eligibilityData, setEligibilityData] = useState({
    cgpa: '',
    annual_income: '',
    category: 'General'
  });
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    category: 'General',
    current_course: '',
    current_college: '',
    current_year: '',
    cgpa: '',
    class_10_percentage: '',
    class_12_percentage: '',
    annual_family_income: '',
    achievements: '',
    why_deserve_scholarship: ''
  });

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    filterScholarships();
  }, [scholarships, scholarshipType, provider, educationLevel]);

  const fetchScholarships = async () => {
    try {
      const response = await api.get('/scholarships');
      const data = Array.isArray(response.data) ? response.data : [];
      setScholarships(data);
      setFilteredScholarships(data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setScholarships([]);
      setFilteredScholarships([]);
    } finally {
      setLoading(false);
    }
  };

  const filterScholarships = () => {
    let filtered = scholarships;

    if (scholarshipType !== 'all') {
      filtered = filtered.filter(s => s.scholarship_type === scholarshipType);
    }

    if (provider !== 'all') {
      filtered = filtered.filter(s => s.provider === provider);
    }

    if (educationLevel !== 'all') {
      filtered = filtered.filter(s => s.education_level === educationLevel);
    }

    setFilteredScholarships(filtered);
  };

  const checkEligibility = async () => {
    try {
      const response = await api.get('/scholarship-applications/check-eligibility', {
        params: eligibilityData
      });
      setEligibleScholarships(response.data.scholarships);
      alert(`You are eligible for ${response.data.eligible_count} scholarships!`);
    } catch (error) {
      alert('Please login to check eligibility');
    }
  };

  const handleApplyClick = (scholarship) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setSelectedScholarship(scholarship);
    setFormData({
      ...formData,
      full_name: user.name || '',
      email: user.email || ''
    });
    setShowApplicationModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        scholarship_id: selectedScholarship.id,
        cgpa: parseFloat(formData.cgpa),
        class_10_percentage: parseFloat(formData.class_10_percentage),
        class_12_percentage: parseFloat(formData.class_12_percentage),
        annual_family_income: parseFloat(formData.annual_family_income)
      };

      await api.post('/scholarship-applications', submitData);
      alert('Scholarship application submitted successfully! Check your dashboard for updates.');
      setShowApplicationModal(false);
    } catch (error) {
      alert(error.response?.data?.detail || 'Error submitting application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scholarships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title="Scholarships - Find & Apply for Education Scholarships | AdmissionBuddy"
        description="Browse 1000+ scholarships for Indian students. Government, private, merit-based and need-based scholarships. Check eligibility and apply online."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Find Your Perfect Scholarship</h1>
            <p className="text-base md:text-lg text-purple-100 mb-4">
              Browse 1000+ scholarships worth crores. Government, private, merit-based, and need-based opportunities.
            </p>
            <Button
              onClick={() => setShowEligibilityChecker(true)}
              className="bg-white text-purple-600 hover:bg-gray-100 h-9 px-4 text-sm"
            >
              <FiTarget className="mr-2" /> Check My Eligibility
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{scholarships.length}</div>
            <div className="text-xs text-gray-600 mt-1">Total Scholarships</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">₹500Cr+</div>
            <div className="text-xs text-gray-600 mt-1">Worth Available</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-xs text-gray-600 mt-1">Partners</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">10K+</div>
            <div className="text-xs text-gray-600 mt-1">Students Helped</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FiFilter className="text-purple-600 text-sm" />
            <h2 className="text-base font-bold">Filter Scholarships</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                value={scholarshipType}
                onChange={(e) => setScholarshipType(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="Merit-based">Merit-based</option>
                <option value="Need-based">Need-based</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Providers</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="College">College</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Levels</option>
                <option value="UG">Undergraduate</option>
                <option value="PG">Postgraduate</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            Showing {filteredScholarships.length} of {scholarships.length} scholarships
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredScholarships.map((scholarship) => (
            <div key={scholarship.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{scholarship.name}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        scholarship.scholarship_type === 'Merit-based' ? 'bg-blue-100 text-blue-800' :
                        scholarship.scholarship_type === 'Need-based' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {scholarship.scholarship_type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {scholarship.provider}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-lg font-bold text-purple-600">{scholarship.amount || 'Varies'}</div>
                    <div className="text-xs text-gray-600">Value</div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{scholarship.description}</p>

                <div className="space-y-1.5 mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <FiAward className="text-purple-600 text-sm" />
                    <span className="text-gray-700"><strong>For:</strong> {scholarship.education_level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-orange-600 text-sm" />
                    <span className="text-gray-700"><strong>Deadline:</strong> {new Date(scholarship.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                {scholarship.benefits && scholarship.benefits.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-semibold text-xs mb-1.5">Benefits:</h4>
                  <ul className="space-y-1">
                    {scholarship.benefits.slice(0, 2).map((benefit, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start gap-1.5">
                        <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApplyClick(scholarship)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 h-8 text-xs px-3"
                  >
                    Apply Now
                  </Button>
                  {scholarship.application_link && (
                    <a
                      href={scholarship.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 h-8 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition flex items-center gap-1.5 text-xs"
                    >
                      <FiExternalLink className="text-xs" /> Visit
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-sm text-gray-600">No scholarships match your filter criteria.</p>
          </div>
        )}
      </div>

      {/* Eligibility Checker Modal */}
      {showEligibilityChecker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5">
            <h2 className="text-lg font-bold mb-3">Check Your Eligibility</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">CGPA/Percentage</label>
                <input
                  type="number"
                  step="0.1"
                  value={eligibilityData.cgpa}
                  onChange={(e) => setEligibilityData({...eligibilityData, cgpa: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 8.5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  value={eligibilityData.annual_income}
                  onChange={(e) => setEligibilityData({...eligibilityData, annual_income: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 500000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Category</label>
                <select
                  value={eligibilityData.category}
                  onChange={(e) => setEligibilityData({...eligibilityData, category: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={checkEligibility}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 h-8 text-xs"
                >
                  Check Eligibility
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEligibilityChecker(false)}
                  className="flex-1 h-8 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Apply for Scholarship</h2>
              <p className="text-xs text-gray-600 mt-1">{selectedScholarship?.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Current Course *</label>
                  <input
                    type="text"
                    name="current_course"
                    value={formData.current_course}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Current College *</label>
                  <input
                    type="text"
                    name="current_college"
                    value={formData.current_college}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Current Year *</label>
                  <input
                    type="text"
                    name="current_year"
                    value={formData.current_year}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 2nd Year"
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">CGPA *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Class 10 % *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="class_10_percentage"
                    value={formData.class_10_percentage}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Class 12 % *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="class_12_percentage"
                    value={formData.class_12_percentage}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Annual Family Income (₹) *</label>
                  <input
                    type="number"
                    name="annual_family_income"
                    value={formData.annual_family_income}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1">Achievements</label>
                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Academic, sports, cultural achievements"
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1">Why do you deserve this scholarship? *</label>
                  <textarea
                    name="why_deserve_scholarship"
                    value={formData.why_deserve_scholarship}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Explain your need and goals (max 500 words)"
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 h-8 text-xs">
                  Submit Application
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 h-8 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipsPage;
