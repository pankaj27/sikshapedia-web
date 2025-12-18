import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiChevronRight, FiClock, FiBookOpen, FiUsers, FiSearch, FiFilter, FiSend } from 'react-icons/fi';
import api from '../api/axios';
import { ApplyNowWidget } from '../components/widgets/ActionWidgets';

const CourseListingPage = () => {
  const { stream } = useParams();
  const [courses, setCourses] = useState([]);
  const [apiCourses, setApiCourses] = useState([]); // Courses from API
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWidget, setActiveWidget] = useState(null);
  const [filters, setFilters] = useState({
    level: 'All',
    type: 'Full Time'
  });

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch from both quick entry and detailed courses
        const [quickResponse, detailResponse] = await Promise.all([
          api.get('/courses'),
          api.get('/courses-detail')
        ]);
        
        // Merge and format courses
        const quickCourses = quickResponse.data || [];
        const detailCourses = detailResponse.data || [];
        
        // Filter by stream if provided
        let filtered = [...quickCourses];
        if (stream) {
          const streamLower = stream.toLowerCase();
          filtered = quickCourses.filter(c => 
            c.stream?.toLowerCase().includes(streamLower) ||
            c.name?.toLowerCase().includes(streamLower) ||
            c.sub_stream?.toLowerCase().includes(streamLower)
          );
        }
        
        setApiCourses(detailCourses);
        setCourses(filtered.length > 0 ? filtered : quickCourses.slice(0, 20));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [stream]);

  // Sample engineering courses data
  const engineeringCourses = [
    {
      id: 1,
      name: 'Bachelor of Technology [B.Tech] (Computer Science and Engineering)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 2427,
      links: {
        overview: '/courses/btech-cse',
        career: '/courses/btech-cse/career',
        syllabus: '/courses/btech-cse/syllabus'
      }
    },
    {
      id: 2,
      name: 'Bachelor of Technology [B.Tech] (Mechanical Engineering)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 2228,
      links: {
        overview: '/courses/btech-mech',
        career: '/courses/btech-mech/career',
        syllabus: '/courses/btech-mech/syllabus'
      }
    },
    {
      id: 3,
      name: 'Bachelor of Technology [B.Tech] (Civil Engineering)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 2060,
      links: {
        overview: '/courses/btech-civil',
        career: '/courses/btech-civil/career',
        syllabus: '/courses/btech-civil/syllabus'
      }
    },
    {
      id: 4,
      name: 'Bachelor of Technology [B.Tech] (Electronics & Communication Engineering)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 1970,
      links: {
        overview: '/courses/btech-ece',
        syllabus: '/courses/btech-ece/syllabus'
      }
    },
    {
      id: 5,
      name: 'Bachelor of Engineering [BE] (Mechanical Engineering)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 1237,
      links: {
        overview: '/courses/be-mech'
      }
    },
    {
      id: 6,
      name: 'Bachelor of Technology [B.Tech] (Information Technology)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 1178,
      links: {
        overview: '/courses/btech-it',
        career: '/courses/btech-it/career',
        syllabus: '/courses/btech-it/syllabus'
      }
    },
    {
      id: 7,
      name: 'Bachelor of Engineering [BE] (Civil Engineering)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 1099,
      links: {
        overview: '/courses/be-civil'
      }
    },
    {
      id: 8,
      name: 'Bachelor of Technology [B.Tech] (Electrical and Electronics Engineering)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 1067,
      links: {
        overview: '/courses/btech-eee'
      }
    },
    {
      id: 9,
      name: 'Bachelor of Technology [B.Tech] (Artificial Intelligence & Machine Learning)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 866,
      links: {
        overview: '/courses/btech-ai-ml',
        syllabus: '/courses/btech-ai-ml/syllabus'
      }
    },
    {
      id: 10,
      name: 'Diploma in Electronics and Communication Engineering',
      duration: '3 Years',
      type: 'Full Time',
      level: 'Diploma',
      collegesCount: 785,
      links: {
        overview: '/courses/diploma-ece'
      }
    },
    {
      id: 11,
      name: 'Bachelor of Technology [B.Tech] (Data Science)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 540,
      links: {
        overview: '/courses/btech-ds',
        career: '/courses/btech-ds/career',
        syllabus: '/courses/btech-ds/syllabus'
      }
    },
    {
      id: 12,
      name: 'Bachelor of Technology [B.Tech] (Cyber Security)',
      duration: '4 Years',
      type: 'Full Time',
      level: 'Bachelors',
      collegesCount: 342,
      links: {
        overview: '/courses/btech-cyber',
        career: '/courses/btech-cyber/career',
        syllabus: '/courses/btech-cyber/syllabus'
      }
    }
  ];

  useEffect(() => {
    let filtered = courses;
    
    if (filters.level !== 'All') {
      filtered = filtered.filter(course => 
        course.degree_type?.toLowerCase() === filters.level.toLowerCase() ||
        course.level?.toLowerCase() === filters.level.toLowerCase()
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredCourses(filtered);
  }, [filters, courses, searchQuery]);

  const getStreamTitle = () => {
    if (!stream) return 'All Courses';
    const titles = {
      'engineering': 'Engineering Courses',
      'medical': 'Medical Courses',
      'management': 'Management Courses',
      'science': 'Science Courses',
      'commerce': 'Commerce Courses',
      'arts': 'Arts Courses',
      'law': 'Law Courses',
      'mba': 'MBA/PGDM Courses',
      'btech': 'B.Tech/B.E Courses'
    };
    return titles[stream.toLowerCase()] || `${stream.charAt(0).toUpperCase() + stream.slice(1)} Courses`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <FiChevronRight size={14} className="mx-2" />
            <Link to="/courses" className="hover:text-orange-600">Courses</Link>
            {stream && (
              <>
                <FiChevronRight size={14} className="mx-2" />
                <span className="text-gray-900 font-medium">{getStreamTitle()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">{getStreamTitle()} in India 2025</h1>
          <p className="text-orange-100">Explore {filteredCourses.length}+ courses | Find the best course for your career</p>
          
          {/* Search Bar */}
          <div className="mt-4 max-w-xl">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <FiFilter className="text-orange-600" />
                <h2 className="font-bold text-gray-800">Filters</h2>
              </div>
              
              {/* Level Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3 text-gray-800">Degree Level</h3>
                <div className="space-y-2">
                  {['All', 'UG', 'PG', 'Diploma', 'PhD'].map(level => (
                    <label key={level} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="level"
                        checked={filters.level === level}
                        onChange={() => setFilters({...filters, level})}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h3 className="font-bold text-sm mb-3 text-gray-800">Type of course</h3>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.type === 'Full Time'}
                    onChange={() => setFilters({...filters, type: filters.type === 'Full Time' ? '' : 'Full Time'})}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Full Time</span>
                </label>
              </div>

              {/* Popular Courses Links */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold text-sm mb-3 text-gray-800">Popular Courses</h3>
                <div className="space-y-2">
                  <Link to="/courses/btech" className="block text-sm text-blue-600 hover:underline">BE/B.Tech</Link>
                  <Link to="/courses/polytechnic" className="block text-sm text-blue-600 hover:underline">Polytechnic</Link>
                  <Link to="/courses/diploma-engineering" className="block text-sm text-blue-600 hover:underline">Diploma</Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses</p>
              <select className="border rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500">
                <option>Sort by: Popular</option>
                <option>Sort by: Name A-Z</option>
                <option>Sort by: Duration</option>
              </select>
            </div>

            {/* Course Cards - CollegeDunia Style */}
            <div className="space-y-4">
              {filteredCourses.map((course, idx) => {
                const courseSlug = course.slug || course.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                const collegeCounts = course.total_colleges || course.collegesCount || Math.floor(Math.random() * 2000) + 100;
                
                return (
                  <div key={course.id || idx} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-200">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        {/* Course Name */}
                        <Link 
                          to={`/courses/detail/${courseSlug}`} 
                          className="text-lg font-bold text-blue-700 hover:text-blue-800 hover:underline mb-2 block"
                        >
                          {course.full_name || course.name}
                        </Link>
                        
                        {/* Course Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <FiClock size={14} className="text-orange-600" />
                            {course.duration || '4 Years'}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <FiBookOpen size={14} className="text-blue-600" />
                            {course.degree_type || course.type || 'Full Time'}
                          </span>
                          {course.avg_fees > 0 && (
                            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">
                              ₹{(course.avg_fees || course.average_fees || 0).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* College Count */}
                        <div className="mb-4">
                          <Link to={`/colleges?course=${courseSlug}`} className="text-sm text-gray-700 hover:text-orange-600">
                            <FiUsers className="inline mr-1" size={14} />
                            <span className="font-bold text-orange-600">{collegeCounts.toLocaleString()}</span> Colleges offering this course
                          </Link>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Link 
                            to={`/courses/detail/${courseSlug}`} 
                            className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
                          >
                            Course Overview
                          </Link>
                          <Link 
                            to={`/courses/detail/${courseSlug}#career`} 
                            className="text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 transition"
                          >
                            Career Options & Jobs
                          </Link>
                          <Link 
                            to={`/courses/detail/${courseSlug}#syllabus`} 
                            className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition"
                          >
                            Syllabus
                          </Link>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Apply Now Button */}
                    <Link 
                      to={course.links.overview}
                      className="ml-4 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded shadow-sm whitespace-nowrap"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Engineering Colleges Section */}
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Engineering Colleges In India</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'IIT Bombay - Indian Institute of Technology - [IITB]', location: 'Mumbai, Maharashtra' },
                  { name: 'IIT Delhi - Indian Institute of Technology [IITD]', location: 'New Delhi, Delhi NCR' },
                  { name: 'IIT Madras - Indian Institute of Technology - [IITM]', location: 'Chennai, Tamil Nadu' },
                  { name: 'IIT Kanpur - Indian Institute of Technology - [IITK]', location: 'Kanpur, Uttar Pradesh' },
                  { name: 'IIT Kharagpur - Indian Institute of Technology - [IITKGP]', location: 'Kharagpur, West Bengal' },
                  { name: 'IIT Roorkee - Indian Institute of Technology - [IITR]', location: 'Roorkee, Uttarakhand' }
                ].map((college, idx) => (
                  <Link key={idx} to={`/colleges/${idx + 1}`} className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600">{college.name}</h3>
                      <p className="text-xs text-gray-600">{college.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/engineering-colleges" className="inline-block mt-4 text-sm text-blue-600 hover:underline font-medium">
                show more colleges
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseListingPage;
