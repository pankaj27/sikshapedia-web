import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiChevronRight, FiSearch, FiClock, FiBookOpen, FiArrowRight, 
  FiLoader, FiBriefcase, FiFileText, FiExternalLink, FiGrid,
  FiChevronDown, FiChevronUp, FiAward, FiDollarSign, FiUsers,
  FiCheckCircle, FiTrendingUp
} from 'react-icons/fi';
import api from '../api/axios';

const DiplomaCoursesPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState('All');
  
  // Course data organized by category (from API only)
  const [coursesByCategory, setCoursesByCategory] = useState({});

  // Category icons and colors - Vibrant for Diploma
  const categoryMeta = {
    'Engineering': { icon: '🔧', color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
    'Computer & IT': { icon: '💻', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
    'Medical & Paramedical': { icon: '🏥', color: 'from-rose-500 to-red-600', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
    'Pharmacy': { icon: '💊', color: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
    'Management': { icon: '📈', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    'Design': { icon: '🎨', color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
    'Hotel Management': { icon: '🏨', color: 'from-orange-500 to-amber-600', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    'Agriculture': { icon: '🌾', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    'Architecture': { icon: '🏛️', color: 'from-slate-500 to-gray-600', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
    'Fashion & Textile': { icon: '👗', color: 'from-fuchsia-500 to-pink-600', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-700' },
    'Animation & Multimedia': { icon: '🎬', color: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
    'Education': { icon: '📚', color: 'from-cyan-500 to-teal-600', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
    'Vocational': { icon: '🔨', color: 'from-stone-500 to-neutral-600', bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700' },
    'Other': { icon: '📖', color: 'from-gray-500 to-slate-600', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
  };

  // Duration filters
  const durationFilters = ['All', '1 Year', '2 Years', '3 Years'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Fetch courses with degree_type = Diploma
        const response = await api.get('/courses-detail?degree_type=Diploma&status=published&limit=500');
        const coursesData = response.data || [];
        
        setAllCourses(coursesData);
        
        if (coursesData.length > 0) {
          // Group courses by stream/category
          const grouped = {};
          coursesData.forEach(course => {
            const category = course.stream || 'Other';
            if (!grouped[category]) {
              grouped[category] = [];
            }
            grouped[category].push({
              id: course.id,
              name: course.name,
              full_name: course.full_name,
              duration: course.duration,
              course_mode: course.course_mode || 'Full Time',
              slug: course.slug,
              degree_type: course.degree_type,
              average_fees: course.average_fees,
              career_options: course.career_options || [],
              eligibility: course.eligibility,
              eligibility_level: course.eligibility_level
            });
          });
          
          // Sort categories
          const sortedGrouped = Object.keys(grouped).sort().reduce((obj, key) => {
            obj[key] = grouped[key];
            return obj;
          }, {});
          
          setCoursesByCategory(sortedGrouped);
        } else {
          setCoursesByCategory({});
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCoursesByCategory({});
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  // Initialize expanded categories
  useEffect(() => {
    const expanded = {};
    Object.keys(coursesByCategory).forEach(cat => expanded[cat] = true);
    setExpandedCategories(expanded);
  }, [coursesByCategory]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filter courses
  const filteredCategories = Object.entries(coursesByCategory).filter(([category, courses]) => {
    if (!searchQuery && selectedDuration === 'All') return true;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || category.toLowerCase().includes(query) || 
           courses.some(c => c.name.toLowerCase().includes(query));
    return matchesSearch;
  });

  // Stats
  const totalCourses = allCourses.length;
  const totalCategories = Object.keys(coursesByCategory).length;

  // Popular diploma courses for sidebar
  const popularDiplomaCourses = [
    'Diploma in Mechanical Engineering',
    'Diploma in Civil Engineering',
    'Diploma in Computer Engineering',
    'Diploma in Electrical Engineering',
    'Diploma in Pharmacy',
    'Diploma in Nursing',
    'Diploma in Hotel Management',
    'Diploma in Fashion Design'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading diploma courses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Diploma Courses in India 2025 - Complete List & Guide</title>
        <meta name="description" content="Explore 300+ diploma courses in Engineering, IT, Medical, Design & more. Get complete details on eligibility, duration, fees, and career options after diploma." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Teal/Cyan Theme */}
        <section className="bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-600 text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative container mx-auto px-4 py-12 md:py-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-teal-100 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <FiChevronRight className="w-4 h-4" />
              <Link to="/courses" className="hover:text-white transition">Courses</Link>
              <FiChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">Diploma</span>
            </div>

            <div className="grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <FiAward className="w-5 h-5" />
                  <span className="text-sm font-medium">Polytechnic & Professional Diplomas</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Diploma Courses in India
                </h1>
                <p className="text-lg text-teal-100 mb-6 max-w-2xl">
                  {totalCourses > 0 
                    ? `Discover ${totalCourses}+ polytechnic and professional diploma courses across ${totalCategories} streams. Build practical skills for immediate career opportunities.`
                    : 'Discover polytechnic and professional diploma courses. Build practical skills for immediate career opportunities.'}
                </p>

                {/* Search Box */}
                <div className="relative max-w-xl mb-6">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiSearch className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search diploma courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-lg"
                  />
                </div>

                {/* Duration Filters */}
                <div className="flex flex-wrap gap-3">
                  <span className="text-teal-100 text-sm self-center">Duration:</span>
                  {durationFilters.map(duration => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedDuration === duration
                          ? 'bg-white text-teal-700 shadow-md'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Cards */}
              {totalCourses > 0 && (
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FiBookOpen className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold">{totalCourses}+</div>
                    <div className="text-teal-100 text-sm">Courses</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FiGrid className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold">{totalCategories}</div>
                    <div className="text-teal-100 text-sm">Streams</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FiClock className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold">1-3</div>
                    <div className="text-teal-100 text-sm">Years</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FiTrendingUp className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold">High</div>
                    <div className="text-teal-100 text-sm">Job Demand</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Key Benefits Bar */}
        <section className="bg-white border-b py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <FiCheckCircle className="w-5 h-5 text-teal-600" />
                <span>Practical Training</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiCheckCircle className="w-5 h-5 text-teal-600" />
                <span>Lower Fees</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiCheckCircle className="w-5 h-5 text-teal-600" />
                <span>Quick Career Start</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiCheckCircle className="w-5 h-5 text-teal-600" />
                <span>Industry Ready Skills</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiCheckCircle className="w-5 h-5 text-teal-600" />
                <span>Lateral Entry to B.Tech</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Category Navigation */}
        {totalCourses > 0 && (
          <section className="bg-white border-b shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
                <span className="text-gray-500 text-sm whitespace-nowrap font-medium">Streams:</span>
                {Object.keys(coursesByCategory).map((category) => {
                  const meta = categoryMeta[category] || categoryMeta['Other'];
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        document.getElementById(category.replace(/\s+/g, '-').toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`px-4 py-2 text-sm ${meta.bg} ${meta.text} hover:opacity-80 rounded-full whitespace-nowrap transition-all font-medium border ${meta.border}`}
                    >
                      {meta.icon} {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course List */}
            <div className="flex-1">
              {filteredCategories.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border shadow-sm">
                  <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBookOpen className="w-10 h-10 text-teal-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Diploma Courses Available Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery 
                      ? "No courses match your search. Try a different term."
                      : "Diploma courses will be displayed here once they are added by the admin."}
                  </p>
                  {!searchQuery && (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 max-w-md mx-auto">
                      <p className="text-sm text-teal-700">
                        <strong>Admin:</strong> Add courses from <a href="/admin/courses-detail/new" className="underline hover:text-teal-900">Course Details</a> with <code className="bg-teal-100 px-1 rounded">Degree Type = "Diploma"</code>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredCategories.map(([category, courses]) => {
                    const meta = categoryMeta[category] || categoryMeta['Other'];
                    const isExpanded = expandedCategories[category];
                    const filteredCourses = searchQuery 
                      ? courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      : courses;

                    if (filteredCourses.length === 0) return null;

                    return (
                      <div 
                        key={category} 
                        id={category.replace(/\s+/g, '-').toLowerCase()}
                        className="bg-white rounded-2xl shadow-sm border overflow-hidden scroll-mt-20"
                      >
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(category)}
                          className={`w-full flex items-center justify-between p-5 bg-gradient-to-r ${meta.color} text-white hover:opacity-95 transition-opacity`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                              <span className="text-3xl">{meta.icon}</span>
                            </div>
                            <div className="text-left">
                              <h2 className="text-xl font-bold">Diploma in {category}</h2>
                              <p className="text-sm text-white/80">{courses.length} diploma courses available</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="hidden md:inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium">
                              {courses.length} Courses
                            </span>
                            {isExpanded ? <FiChevronUp className="w-6 h-6" /> : <FiChevronDown className="w-6 h-6" />}
                          </div>
                        </button>

                        {/* Course Cards */}
                        {isExpanded && (
                          <div className="divide-y">
                            {filteredCourses.map((course, idx) => (
                              <div key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                      <div className={`w-10 h-10 ${meta.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <span className="text-lg">{meta.icon}</span>
                                      </div>
                                      <div>
                                        <Link 
                                          to={`/courses/${course.slug}`}
                                          className="text-lg font-semibold text-gray-800 hover:text-teal-600 transition-colors"
                                        >
                                          {course.name}
                                        </Link>
                                        {course.full_name && course.full_name !== course.name && (
                                          <p className="text-sm text-gray-500">{course.full_name}</p>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Tags */}
                                    <div className="flex flex-wrap items-center gap-2 mt-3 ml-13">
                                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 ${meta.bg} ${meta.border} border rounded-lg text-xs font-medium ${meta.text}`}>
                                        <FiClock className="w-3 h-3" />
                                        {course.duration}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700">
                                        <FiBookOpen className="w-3 h-3" />
                                        {course.course_mode || 'Full Time'}
                                      </span>
                                      {course.eligibility_level && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs font-medium text-purple-700">
                                          <FiUsers className="w-3 h-3" />
                                          {course.eligibility_level === 'after-10th' ? 'After 10th' : 'After 12th'}
                                        </span>
                                      )}
                                      {course.average_fees > 0 && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-700">
                                          <FiDollarSign className="w-3 h-3" />
                                          ₹{(course.average_fees / 1000).toFixed(0)}K/year
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Quick Links */}
                                    <div className="flex flex-wrap items-center gap-4 mt-3 ml-13">
                                      <Link 
                                        to={`/courses/${course.slug}`}
                                        className="text-sm text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiFileText className="w-3 h-3" />
                                        Overview
                                      </Link>
                                      <Link 
                                        to={`/courses/${course.slug}#syllabus`}
                                        className="text-sm text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiBookOpen className="w-3 h-3" />
                                        Syllabus
                                      </Link>
                                      <Link 
                                        to={`/courses/${course.slug}#career`}
                                        className="text-sm text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiBriefcase className="w-3 h-3" />
                                        Job Scope
                                      </Link>
                                      <Link 
                                        to={`/courses/${course.slug}#colleges`}
                                        className="text-sm text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiGrid className="w-3 h-3" />
                                        Polytechnics
                                      </Link>
                                    </div>
                                  </div>
                                  
                                  <Link
                                    to={`/courses/${course.slug}`}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-medium rounded-xl transition-all shadow-sm whitespace-nowrap"
                                  >
                                    View Details
                                    <FiArrowRight className="w-4 h-4" />
                                  </Link>
                                </div>
                              </div>
                            ))}
                            
                            {/* View All Link */}
                            <div className="p-4 bg-gray-50 flex justify-between items-center">
                              <span className="text-sm text-gray-500">{courses.length} diploma courses in {category}</span>
                              <Link 
                                to={`/courses/listing/${category.toLowerCase().replace(/\s+/g, '-')}?type=diploma`}
                                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
                              >
                                View All
                                <FiExternalLink className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* Popular Diploma Courses */}
              <div className="bg-white rounded-2xl shadow-sm border p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiTrendingUp className="text-teal-600" /> Popular Diploma Courses
                </h3>
                <div className="space-y-2">
                  {popularDiplomaCourses.map((course, idx) => (
                    <Link 
                      key={idx}
                      to={`/courses/${course.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center gap-3 p-2 hover:bg-teal-50 rounded-lg text-gray-700 hover:text-teal-600 transition-colors text-sm"
                    >
                      <span className="w-6 h-6 bg-teal-100 rounded text-teal-700 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{course}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Pages */}
              <div className="bg-white rounded-2xl shadow-sm border p-5">
                <h3 className="font-bold text-gray-800 mb-4">Related Course Pages</h3>
                <div className="space-y-2">
                  <Link to="/courses/after-10th" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-teal-50 rounded-xl text-gray-700 hover:text-teal-600 transition-colors text-sm">
                    <span className="text-xl">📚</span>
                    <span>Courses After 10th</span>
                  </Link>
                  <Link to="/courses/after-12th" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-teal-50 rounded-xl text-gray-700 hover:text-teal-600 transition-colors text-sm">
                    <span className="text-xl">🎓</span>
                    <span>Courses After 12th</span>
                  </Link>
                  <Link to="/courses/iti" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-teal-50 rounded-xl text-gray-700 hover:text-teal-600 transition-colors text-sm">
                    <span className="text-xl">🔧</span>
                    <span>ITI Courses</span>
                  </Link>
                </div>
              </div>

              {/* Why Diploma */}
              <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl shadow-sm p-5 text-white">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FiAward /> Why Choose Diploma?
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="w-4 h-4 mt-0.5 text-teal-200 flex-shrink-0" />
                    <span>Industry-focused practical training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="w-4 h-4 mt-0.5 text-teal-200 flex-shrink-0" />
                    <span>Lower fees than degree courses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="w-4 h-4 mt-0.5 text-teal-200 flex-shrink-0" />
                    <span>Quick entry to job market (1-3 years)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="w-4 h-4 mt-0.5 text-teal-200 flex-shrink-0" />
                    <span>Lateral entry to B.Tech 2nd year</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="w-4 h-4 mt-0.5 text-teal-200 flex-shrink-0" />
                    <span>Government job opportunities</span>
                  </li>
                </ul>
              </div>

              {/* Eligibility Box */}
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
                <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <FiUsers className="text-amber-600" /> Eligibility
                </h3>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li>• 10th pass for polytechnic diploma</li>
                  <li>• 12th pass for some specialized diplomas</li>
                  <li>• No entrance exam for most courses</li>
                  <li>• Merit-based or direct admission</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-sm p-5 text-white text-center">
                <h3 className="font-bold mb-2">Need Help Choosing?</h3>
                <p className="text-sm text-slate-300 mb-4">Get expert guidance on diploma courses</p>
                <button className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl transition-colors">
                  Get Free Counselling
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-white border-t py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: 'What is a diploma course?', a: 'A diploma course is a vocational/technical program that provides practical skills and knowledge in a specific field. Duration ranges from 1-3 years and can be pursued after 10th or 12th class.' },
                { q: 'What is the difference between diploma and degree?', a: 'Diploma courses are shorter (1-3 years), more practical, and focus on job-ready skills. Degree courses (3-4 years) are more theoretical and provide broader academic knowledge.' },
                { q: 'Can I do B.Tech after diploma?', a: 'Yes! Diploma holders can get lateral entry directly into the 2nd year of B.Tech/BE programs, saving one year compared to regular students.' },
                { q: 'Which diploma course has the highest salary?', a: 'Diploma courses in Computer Engineering, Mechanical Engineering, Electrical Engineering, and Pharmacy typically offer higher starting salaries ranging from ₹2-5 LPA.' },
              ].map((faq, idx) => (
                <div key={idx} className="bg-teal-50 rounded-xl p-5 border border-teal-100">
                  <h3 className="font-semibold text-gray-800 mb-2">Q: {faq.q}</h3>
                  <p className="text-gray-600 text-sm">A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DiplomaCoursesPage;
