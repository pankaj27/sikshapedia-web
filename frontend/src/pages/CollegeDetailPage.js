import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiCalendar, FiUsers, FiAward, FiTrendingUp, FiPhone, FiMail, FiGlobe, FiCheckCircle, FiChevronDown, FiChevronUp, FiDownload, FiExternalLink } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  const fetchCollegeDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/colleges/${id}`);
      setCollege(response.data);
    } catch (error) {
      console.error('Error fetching college details:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigationTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'cutoff', label: 'Cutoff' },
    { id: 'placements', label: 'Placements' },
    { id: 'rankings', label: 'Rankings' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">College Not Found</h2>
          <Link to="/colleges" className="text-blue-600 hover:underline">Back to Colleges</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      {/* BREADCRUMB */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/colleges" className="hover:text-orange-600 transition-colors">Colleges</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{college.name}</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* College Logo */}
            <div className="flex-shrink-0">
              {college.images?.[0] ? (
                <img src={college.images[0]} alt={college.name} className="w-24 h-24 rounded-lg border-2 border-gray-200 object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                  {college.name.charAt(0)}
                </div>
              )}
            </div>

            {/* College Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{college.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-orange-600" size={14} />
                      <span>{college.location?.city}, {college.location?.state}</span>
                    </div>
                    <span className="text-gray-400">|</span>
                    <span className="font-medium text-blue-600">{college.type}</span>
                    <span className="text-gray-400">|</span>
                    <span>Established {college.established || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-500 fill-yellow-500" size={16} />
                      <span className="font-bold text-gray-900">{college.rating || '4.5'}</span>
                      <span className="text-gray-600 text-sm">/5</span>
                      <span className="text-gray-500 text-sm">({college.reviews || 100} Reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white text-sm whitespace-nowrap">
                    <FiCheckCircle className="mr-2" size={14} />
                    Apply Now
                  </Button>
                  <Button variant="outline" className="text-sm whitespace-nowrap">
                    <FiDownload className="mr-2" size={14} />
                    Brochure
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KEY HIGHLIGHTS */}
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₹{(college.average_fees / 100000).toFixed(2)}L</div>
              <div className="text-xs text-gray-600">Average Fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{college.placement?.average ? (college.placement.average / 100000).toFixed(1) : 'N/A'}L</div>
              <div className="text-xs text-gray-600">Avg Package</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">#{Math.floor(Math.random() * 50) + 1}</div>
              <div className="text-xs text-gray-600">NIRF Ranking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{college.courses?.length || 10}+</div>
              <div className="text-xs text-gray-600">Courses</div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY NAVIGATION TABS */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-orange-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* MAIN CONTENT */}
          <div className="flex-1">
            {/* OVERVIEW SECTION */}
            <section id="overview" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {college.name}</h2>
              <div className={`text-gray-700 text-sm leading-relaxed ${!showFullDescription ? 'line-clamp-4' : ''}`}>
                <p className="mb-3">
                  {college.description || `${college.name} is a premier educational institution located in ${college.location?.city}, ${college.location?.state}. 
                  The institute offers various undergraduate and postgraduate programs with excellent placement opportunities and state-of-the-art facilities.`}
                </p>
                <p>
                  With a strong focus on academic excellence and holistic development, the college has established itself as one of the leading institutions in the region.
                  The campus provides world-class infrastructure, experienced faculty, and a vibrant student community.
                </p>
              </div>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                {showFullDescription ? (
                  <>Read Less <FiChevronUp size={14} /></>
                ) : (
                  <>Read More <FiChevronDown size={14} /></>
                )}
              </button>
            </section>

            {/* ADMISSIONS SECTION */}
            <section id="admissions" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admissions 2026</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-2">Admission Criteria</h3>
                  <p className="text-sm text-gray-700">
                    Admission is based on merit in national level entrance exams followed by counselling rounds.
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-bold border">Course</th>
                        <th className="px-4 py-2 text-left text-sm font-bold border">Eligibility</th>
                        <th className="px-4 py-2 text-left text-sm font-bold border">Selection Criteria</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-sm border">B.Tech</td>
                        <td className="px-4 py-2 text-sm border">10+2 with 75% in PCM</td>
                        <td className="px-4 py-2 text-sm border">JEE Main + Counselling</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-sm border">M.Tech</td>
                        <td className="px-4 py-2 text-sm border">B.Tech with 60% marks</td>
                        <td className="px-4 py-2 text-sm border">GATE + Counselling</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm border">MBA</td>
                        <td className="px-4 py-2 text-sm border">Graduation with 50% marks</td>
                        <td className="px-4 py-2 text-sm border">CAT + GD/PI</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* COURSES & FEES SECTION */}
            <section id="courses" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Courses & Fees</h2>
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold border">Course</th>
                      <th className="px-4 py-3 text-left text-sm font-bold border">Duration</th>
                      <th className="px-4 py-3 text-left text-sm font-bold border">1st Year Fees</th>
                      <th className="px-4 py-3 text-left text-sm font-bold border">Total Fees</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600 border">B.Tech</td>
                      <td className="px-4 py-3 text-sm border">4 Years</td>
                      <td className="px-4 py-3 text-sm font-semibold border">₹{(college.average_fees / 100000).toFixed(2)}L</td>
                      <td className="px-4 py-3 text-sm font-semibold border">₹{((college.average_fees * 4) / 100000).toFixed(2)}L</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* CUTOFF SECTION */}
            <section id="cutoff" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cutoff 2025</h2>
              <p className="text-sm text-gray-600 mb-4">Latest cutoff ranks for various courses</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">Cutoff details will be updated soon after official announcement.</p>
              </div>
            </section>

            {/* PLACEMENTS SECTION */}
            <section id="placements" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Placements 2024</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-700">₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : '50'}L</div>
                  <div className="text-sm text-gray-600">Highest Package</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">₹{college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '15'}L</div>
                  <div className="text-sm text-gray-600">Average Package</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">95%</div>
                  <div className="text-sm text-gray-600">Placement Rate</div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Top Recruiters</h3>
                <div className="flex flex-wrap gap-2">
                  {['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture'].map((company) => (
                    <span key={company} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* RANKINGS SECTION */}
            <section id="rankings" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rankings</h2>
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-bold border">Agency</th>
                      <th className="px-4 py-2 text-left text-sm font-bold border">Year</th>
                      <th className="px-4 py-2 text-left text-sm font-bold border">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2 text-sm border">NIRF</td>
                      <td className="px-4 py-2 text-sm border">2025</td>
                      <td className="px-4 py-2 text-sm font-semibold text-orange-600 border">#{Math.floor(Math.random() * 50) + 1}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* FACILITIES SECTION */}
            <section id="facilities" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Campus & Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Library', 'Hostel', 'Sports Complex', 'Cafeteria', 'Wi-Fi Campus', 'Medical Facility', 'Labs', 'Auditorium', 'Gym'].map((facility) => (
                  <div key={facility} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border">
                    <FiCheckCircle className="text-green-600" size={16} />
                    <span className="text-sm text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* REVIEWS SECTION */}
            <section id="reviews" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Reviews</h2>
              <div className="text-center py-8">
                <p className="text-gray-600">Be the first to write a review for this college!</p>
                <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white">
                  Write a Review
                </Button>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            {/* Contact Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <FiMapPin className="text-orange-600 flex-shrink-0 mt-0.5" size={14} />
                  <span>{college.location?.address || `${college.location?.city}, ${college.location?.state}`}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FiPhone className="text-orange-600" size={14} />
                  <span>+91 XXXXXXXXXX</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FiMail className="text-orange-600" size={14} />
                  <span>info@{college.name.toLowerCase().replace(/\s+/g, '')}.edu</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FiGlobe className="text-orange-600" size={14} />
                  <a href="#" className="text-blue-600 hover:underline">Visit Website</a>
                </div>
              </div>
              <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white text-sm">
                Get in Touch
              </Button>
            </div>

            {/* Similar Colleges */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Similar Colleges</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <Link key={item} to="#" className="flex gap-2 hover:bg-gray-50 rounded p-2 transition-colors">
                    <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 truncate">College Name {item}</div>
                      <div className="text-[10px] text-gray-600">City, State</div>
                      <div className="text-[10px] text-orange-600 font-medium">₹2.5L Fees</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailPage;
