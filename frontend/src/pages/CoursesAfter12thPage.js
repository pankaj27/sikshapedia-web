import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiChevronRight, FiSearch, FiClock, FiBookOpen, FiArrowRight, 
  FiLoader, FiBriefcase, FiFileText, FiExternalLink, FiGrid,
  FiChevronDown, FiChevronUp, FiAward, FiDollarSign, FiUsers
} from 'react-icons/fi';
import api from '../api/axios';

const CoursesAfter12thPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const [selectedStream, setSelectedStream] = useState('All');
  
  // Course data organized by category (from API only)
  const [coursesByCategory, setCoursesByCategory] = useState({});

  // Category icons and colors
  const categoryMeta = {
    'Engineering': { icon: '⚙️', color: 'from-blue-600 to-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    'Medical': { icon: '🏥', color: 'from-red-600 to-red-700', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    'Management': { icon: '📊', color: 'from-purple-600 to-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    'Commerce': { icon: '💰', color: 'from-emerald-600 to-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    'Science': { icon: '🔬', color: 'from-cyan-600 to-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
    'Arts': { icon: '🎨', color: 'from-pink-600 to-pink-700', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
    'Law': { icon: '⚖️', color: 'from-amber-600 to-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    'Design': { icon: '🎯', color: 'from-rose-600 to-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
    'Computer Applications': { icon: '💻', color: 'from-indigo-600 to-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
    'Pharmacy': { icon: '💊', color: 'from-teal-600 to-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
    'Agriculture': { icon: '🌾', color: 'from-green-600 to-green-700', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    'Hotel Management': { icon: '🏨', color: 'from-orange-600 to-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    'Mass Communication': { icon: '📺', color: 'from-violet-600 to-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
    'Education': { icon: '📚', color: 'from-sky-600 to-sky-700', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
    'Architecture': { icon: '🏛️', color: 'from-slate-600 to-slate-700', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
    'Other': { icon: '📖', color: 'from-gray-600 to-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
  };

  // Stream filters
  const streamFilters = ['All', 'Science', 'Commerce', 'Arts'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Fetch courses with eligibility_level = after-12th
        const response = await api.get('/courses-detail?eligibility_level=after-12th&status=published&limit=500');
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
              entrance_exams: course.entrance_exams || []
            });
          });
          
          // Sort categories alphabetically
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
  
  // Initialize expanded categories when coursesByCategory changes
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

  // Filter courses based on search and stream
  const filteredCategories = Object.entries(coursesByCategory).filter(([category, courses]) => {
    if (!searchQuery && selectedStream === 'All') return true;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || category.toLowerCase().includes(query) || 
           courses.some(c => c.name.toLowerCase().includes(query));
    return matchesSearch;
  });

  // Count total courses from actual data
  const totalCourses = allCourses.length;
  const totalCategories = Object.keys(coursesByCategory).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Courses After 12th - Best UG Courses in India 2025</title>
        <meta name="description" content="Explore 500+ undergraduate courses after 12th in Science, Commerce, Arts streams. Find B.Tech, MBBS, BBA, B.Com, BA and more with eligibility, fees & colleges." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="relative container mx-auto px-4 py-12 md:py-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-blue-200 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <FiChevronRight className="w-4 h-4" />
              <Link to="/courses" className="hover:text-white transition">Courses</Link>
              <FiChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">After 12th</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Courses After 12th Class
                </h1>
                <p className="text-lg text-blue-100 mb-6">
                  {totalCourses > 0 
                    ? `Discover ${totalCourses}+ undergraduate courses across ${totalCategories} streams to shape your career after class 12th`
                    : 'Discover undergraduate courses across multiple streams to shape your career after class 12th'}
                </p>

                {/* Search Box */}
                <div className="relative max-w-xl mb-6">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiSearch className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search courses (B.Tech, MBBS, BBA, B.Com...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
                  />
                </div>

                {/* Stream Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="text-blue-200 text-sm self-center">Filter by stream:</span>
                  {streamFilters.map(stream => (
                    <button
                      key={stream}
                      onClick={() => setSelectedStream(stream)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedStream === stream
                          ? 'bg-white text-blue-900'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {stream}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats Cards */}
              {totalCourses > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <FiBookOpen className="w-8 h-8 text-blue-300 mb-2" />
                    <div className="text-3xl font-bold">{totalCourses}+</div>
                    <div className="text-blue-200 text-sm">Total Courses</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <FiGrid className="w-8 h-8 text-purple-300 mb-2" />
                    <div className="text-3xl font-bold">{totalCategories}</div>
                    <div className="text-blue-200 text-sm">Streams</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <FiAward className="w-8 h-8 text-amber-300 mb-2" />
                    <div className="text-3xl font-bold">UG</div>
                    <div className="text-blue-200 text-sm">Degree Level</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <FiClock className="w-8 h-8 text-green-300 mb-2" />
                    <div className="text-3xl font-bold">3-5</div>
                    <div className="text-blue-200 text-sm">Years Duration</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Category Navigation - Only show if courses exist */}
        {totalCourses > 0 && (
          <section className="bg-white border-b shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
                <span className="text-gray-500 text-sm whitespace-nowrap font-medium">Browse:</span>
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
                <div className="bg-white rounded-xl p-12 text-center border shadow-sm">
                  <FiBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Available Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery 
                      ? "No courses match your search. Try a different term."
                      : "Courses after 12th will be displayed here once they are added by the admin."}
                  </p>
                  {!searchQuery && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-sm text-blue-700">
                        <strong>Admin:</strong> Add courses from <a href="/admin/courses-detail/new" className="underline hover:text-blue-900">Course Details</a> with <code className="bg-blue-100 px-1 rounded">Eligibility Level = "After 12th"</code>
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
                        className="bg-white rounded-xl shadow-sm border overflow-hidden scroll-mt-20"
                      >
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(category)}
                          className={`w-full flex items-center justify-between p-5 bg-gradient-to-r ${meta.color} text-white hover:opacity-95 transition-opacity`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">{meta.icon}</span>
                            <div className="text-left">
                              <h2 className="text-xl font-bold">{category}</h2>
                              <p className="text-sm text-white/80">{courses.length} courses available</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
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
                                    <Link 
                                      to={`/courses/${course.slug}`}
                                      className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                                    >
                                      {course.name}
                                    </Link>
                                    {course.full_name && course.full_name !== course.name && (
                                      <p className="text-sm text-gray-500 mt-0.5">{course.full_name}</p>
                                    )}
                                    
                                    {/* Tags */}
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                      <span className={`inline-flex items-center gap-1 px-3 py-1 ${meta.bg} ${meta.border} border rounded-full text-xs font-medium ${meta.text}`}>
                                        <FiClock className="w-3 h-3" />
                                        {course.duration}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">
                                        <FiBookOpen className="w-3 h-3" />
                                        {course.course_mode || 'Full Time'}
                                      </span>
                                      {course.degree_type && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700">
                                          <FiAward className="w-3 h-3" />
                                          {course.degree_type}
                                        </span>
                                      )}
                                      {course.average_fees > 0 && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-medium text-amber-700">
                                          <FiDollarSign className="w-3 h-3" />
                                          ₹{(course.average_fees / 1000).toFixed(0)}K/year
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Quick Links */}
                                    <div className="flex flex-wrap items-center gap-4 mt-3">
                                      <Link 
                                        to={`/courses/${course.slug}`}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiFileText className="w-3 h-3" />
                                        Overview
                                      </Link>
                                      <Link 
                                        to={`/courses/${course.slug}#eligibility`}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiUsers className="w-3 h-3" />
                                        Eligibility
                                      </Link>
                                      <Link 
                                        to={`/courses/${course.slug}#career`}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiBriefcase className="w-3 h-3" />
                                        Career Options
                                      </Link>
                                      <Link 
                                        to={`/courses/${course.slug}#colleges`}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiGrid className="w-3 h-3" />
                                        Top Colleges
                                      </Link>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col gap-2">
                                    <Link
                                      to={`/courses/${course.slug}`}
                                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                                    >
                                      View Details
                                      <FiArrowRight className="w-4 h-4" />
                                    </Link>
                                    {course.entrance_exams?.length > 0 && (
                                      <span className="text-xs text-gray-500 text-center">
                                        Entrance: {course.entrance_exams.slice(0, 2).join(', ')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* View All Link */}
                            <div className="p-4 bg-gray-50 flex justify-between items-center">
                              <span className="text-sm text-gray-500">{courses.length} courses in {category}</span>
                              <Link 
                                to={`/courses/listing/${category.toLowerCase().replace(/\s+/g, '-')}`}
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                              >
                                View All {category} Courses
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
              {/* Popular Streams */}
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiGrid className="text-blue-600" /> Popular Streams
                </h3>
                <div className="space-y-2">
                  {[
                    { name: 'Engineering (B.Tech/BE)', icon: '⚙️', link: '/courses/listing/engineering' },
                    { name: 'Medical (MBBS/BDS)', icon: '🏥', link: '/courses/listing/medical' },
                    { name: 'Management (BBA/BBM)', icon: '📊', link: '/courses/listing/management' },
                    { name: 'Commerce (B.Com)', icon: '💰', link: '/courses/listing/commerce' },
                    { name: 'Science (B.Sc)', icon: '🔬', link: '/courses/listing/science' },
                    { name: 'Arts (BA)', icon: '🎨', link: '/courses/listing/arts' },
                  ].map((stream, idx) => (
                    <Link 
                      key={idx}
                      to={stream.link} 
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <span className="text-xl">{stream.icon}</span>
                      <span className="text-sm font-medium">{stream.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Pages */}
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="font-bold text-gray-800 mb-4">Related Course Pages</h3>
                <div className="space-y-2">
                  <Link to="/courses/after-10th" className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 transition-colors text-sm">
                    📚 Courses After 10th
                  </Link>
                  <Link to="/courses/after-graduation" className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 transition-colors text-sm">
                    🎓 Courses After Graduation
                  </Link>
                  <Link to="/courses/professional" className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 transition-colors text-sm">
                    💼 Professional Courses
                  </Link>
                </div>
              </div>

              {/* Why After 12th */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-sm p-5 text-white">
                <h3 className="font-bold mb-4">Why Choose UG Courses?</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">✓</span>
                    <span>Foundation for professional career</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">✓</span>
                    <span>Gateway to higher studies (PG/PhD)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">✓</span>
                    <span>Wide range of specializations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">✓</span>
                    <span>Better job opportunities & salary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">✓</span>
                    <span>Government job eligibility</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl shadow-sm p-5 text-white text-center">
                <h3 className="font-bold mb-2">Confused About Course Selection?</h3>
                <p className="text-sm text-purple-200 mb-4">Get personalized guidance from our experts</p>
                <button className="w-full py-3 bg-white text-purple-900 font-medium rounded-lg hover:bg-purple-50 transition-colors">
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
                { q: 'What are the best courses after 12th Science?', a: 'Popular courses include B.Tech/BE in various engineering branches, MBBS, BDS, B.Sc in Physics/Chemistry/Biology, BCA, B.Pharm, and B.Arch.' },
                { q: 'What courses can I do after 12th Commerce?', a: 'You can pursue B.Com, BBA, CA, CS, CMA, B.Com (Hons), BBA LLB, Bachelor in Economics, or Banking & Finance courses.' },
                { q: 'What are the career options after 12th Arts?', a: 'Arts students can pursue BA, BFA, BJMass Communication, BA LLB, Hotel Management, Fashion Design, or Social Work courses.' },
                { q: 'How to choose the right course after 12th?', a: 'Consider your interests, career goals, aptitude, job prospects, course fees, and entrance exam requirements. Career counselling can also help in making the right decision.' },
              ].map((faq, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-5 border">
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

export default CoursesAfter12thPage;
