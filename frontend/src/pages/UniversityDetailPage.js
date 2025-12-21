/**
 * UniversityDetailPage - Public detail page for universities
 * Shows university information, courses, placements, etc.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiMapPin, FiPhone, FiMail, FiGlobe, FiAward, FiUsers, FiBriefcase,
  FiCalendar, FiBook, FiStar, FiChevronRight, FiHome, FiArrowLeft
} from 'react-icons/fi';
import api from '../api/axios';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import ReviewsSection from '../components/ReviewsSection';
import QuestionsSection from '../components/QuestionsSection';

const UniversityDetailPage = () => {
  const { seg1: rawSlug } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Parse slug - strip numeric prefix if present (e.g., "000-test-university" -> "test-university")
  const slug = rawSlug?.replace(/^\d+-/, '') || rawSlug;

  useEffect(() => {
    fetchUniversity();
  }, [slug]);

  const fetchUniversity = async () => {
    setLoading(true);
    try {
      // First try to fetch by slug
      const res = await api.get('/universities');
      const universities = res.data;
      // Match by slug, id, or raw slug with numeric prefix
      const found = universities.find(u => 
        u.slug === slug || 
        u.id === slug || 
        u.slug === rawSlug || 
        u.id === rawSlug
      );
      
      if (found) {
        setUniversity(found);
      } else {
        setError('University not found');
      }
    } catch (err) {
      console.error('Error fetching university:', err);
      setError('Failed to load university');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <FiAward className="mx-auto text-6xl text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">University Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The university you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/university')} className="bg-purple-600 hover:bg-purple-700">
              <FiArrowLeft className="mr-2" /> Browse Universities
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'courses', label: 'Courses', icon: FiBook },
    { id: 'placements', label: 'Placements', icon: FiBriefcase },
    { id: 'reviews', label: 'Reviews', icon: FiStar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/" className="hover:text-purple-600">Home</a>
            <FiChevronRight className="mx-2" size={14} />
            <a href="/university" className="hover:text-purple-600">Universities</a>
            <FiChevronRight className="mx-2" size={14} />
            <span className="text-gray-900">{university.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center">
              {university.logo ? (
                <img src={university.logo} alt={university.name} className="w-20 h-20 object-contain" />
              ) : (
                <FiAward className="text-purple-600" size={40} />
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                  {university.university_type}
                </span>
                {university.accreditation && (
                  <span className="px-2 py-1 bg-green-500/20 rounded text-xs font-medium">
                    {university.accreditation}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{university.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <span className="flex items-center gap-1">
                  <FiMapPin size={16} />
                  {university.city}, {university.state}
                </span>
                {university.established_year && (
                  <span className="flex items-center gap-1">
                    <FiCalendar size={16} />
                    Est. {university.established_year}
                  </span>
                )}
                {university.nirf_rank && (
                  <span className="flex items-center gap-1">
                    <FiAward size={16} />
                    NIRF Rank #{university.nirf_rank}
                  </span>
                )}
              </div>
            </div>

            {/* Rating Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
              <div className="text-4xl font-bold">{university.rating?.toFixed(1) || '0.0'}</div>
              <div className="flex justify-center gap-1 my-1">
                {[1,2,3,4,5].map(i => (
                  <FiStar 
                    key={i} 
                    className={i <= Math.round(university.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'} 
                    size={16} 
                  />
                ))}
              </div>
              <div className="text-xs text-white/80">{university.total_reviews || 0} reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{university.total_colleges || 0}</div>
              <div className="text-xs text-gray-500">Affiliated Colleges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{university.total_courses || 0}</div>
              <div className="text-xs text-gray-500">Courses Offered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{university.total_students?.toLocaleString() || '-'}</div>
              <div className="text-xs text-gray-500">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{university.total_faculty?.toLocaleString() || '-'}</div>
              <div className="text-xs text-gray-500">Faculty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{university.placement_percentage || '-'}%</div>
              <div className="text-xs text-gray-500">Placement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <div className="flex border-b overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition ${
                      activeTab === tab.id 
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-3">About {university.name}</h2>
                      <p className="text-gray-600 leading-relaxed">
                        {university.description || `${university.name} is a ${university.university_type} university located in ${university.city}, ${university.state}. ${university.established_year ? `Established in ${university.established_year}, it` : 'It'} offers various undergraduate, postgraduate, and doctoral programs across multiple disciplines.`}
                      </p>
                    </div>

                    {/* Streams */}
                    {university.streams && university.streams.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Streams Offered</h3>
                        <div className="flex flex-wrap gap-2">
                          {university.streams.map(stream => (
                            <span key={stream} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                              {stream}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Facts */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Facts</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">Type</div>
                          <div className="font-semibold">{university.university_type}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">Accreditation</div>
                          <div className="font-semibold">{university.accreditation || 'N/A'}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">Established</div>
                          <div className="font-semibold">{university.established_year || 'N/A'}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">NIRF Rank</div>
                          <div className="font-semibold">{university.nirf_rank ? `#${university.nirf_rank}` : 'N/A'}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-semibold">{university.city}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">State</div>
                          <div className="font-semibold">{university.state}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Courses Offered</h2>
                    {university.courses && university.courses.length > 0 ? (
                      <div className="grid gap-4">
                        {university.courses.map((course, i) => (
                          <div key={i} className="border rounded-lg p-4 hover:bg-gray-50">
                            <h3 className="font-semibold">{typeof course === 'string' ? course : course.name}</h3>
                            {typeof course !== 'string' && course.duration && (
                              <p className="text-sm text-gray-500">Duration: {course.duration}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Course information will be updated soon.</p>
                    )}
                  </div>
                )}

                {activeTab === 'placements' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Placement Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
                        <div className="text-4xl font-bold text-green-600">{university.placement_percentage || '-'}%</div>
                        <div className="text-sm text-gray-600 mt-1">Placement Rate</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 text-center">
                        <div className="text-4xl font-bold text-purple-600">₹{university.highest_package || '-'} LPA</div>
                        <div className="text-sm text-gray-600 mt-1">Highest Package</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
                        <div className="text-4xl font-bold text-blue-600">₹{university.average_package || '-'} LPA</div>
                        <div className="text-sm text-gray-600 mt-1">Average Package</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewsSection 
                    collegeId={university.id} 
                    collegeName={university.name}
                    isUniversity={true}
                  />
                )}
              </div>
            </div>

            {/* Questions Section */}
            <QuestionsSection 
              entityId={university.id} 
              entityType="university"
              entityName={university.name}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {university.address && (
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{university.address}</span>
                  </div>
                )}
                {university.phone && (
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-purple-600" />
                    <a href={`tel:${university.phone}`} className="text-sm text-purple-600 hover:underline">{university.phone}</a>
                  </div>
                )}
                {university.email && (
                  <div className="flex items-center gap-3">
                    <FiMail className="text-purple-600" />
                    <a href={`mailto:${university.email}`} className="text-sm text-purple-600 hover:underline">{university.email}</a>
                  </div>
                )}
                {university.website && (
                  <div className="flex items-center gap-3">
                    <FiGlobe className="text-purple-600" />
                    <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Now Card (if admission partner) */}
            {university.is_admission_partner && (
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Apply Now</h3>
                <p className="text-sm text-white/90 mb-4">Start your admission process for {university.name}</p>
                <Button 
                  onClick={() => navigate(`/admission/universities?id=${university.id}`)}
                  className="w-full bg-white text-green-600 hover:bg-gray-100"
                >
                  Apply for Admission
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UniversityDetailPage;
