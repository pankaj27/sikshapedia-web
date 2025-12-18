import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiChevronRight, FiSearch, FiClock, FiBookOpen, FiArrowRight, 
  FiLoader, FiBriefcase, FiFileText, FiExternalLink, FiGrid,
  FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import api from '../api/axios';

const CoursesAfter10thPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  
  // Default courses (shown if no API data)
  const defaultCourses = {
    'Engineering': [
      { name: 'Diploma in Mechanical Engineering', duration: '3 Years', course_mode: 'Full Time', slug: 'diploma-mechanical-engineering' },
      { name: 'Diploma in Civil Engineering', duration: '3 Years', course_mode: 'Full Time', slug: 'diploma-civil-engineering' },
      { name: 'Diploma in Electrical Engineering', duration: '3 Years', course_mode: 'Full Time', slug: 'diploma-electrical-engineering' },
      { name: 'Diploma in Computer Engineering', duration: '3 Years', course_mode: 'Full Time', slug: 'diploma-computer-engineering' },
      { name: 'ITI Fitter', duration: '2 Years', course_mode: 'Full Time', slug: 'iti-fitter' },
      { name: 'ITI Electrician', duration: '2 Years', course_mode: 'Full Time', slug: 'iti-electrician' },
    ],
    'Arts & Humanities': [
      { name: 'Certificate in Spoken English', duration: '1 Year', course_mode: 'Full Time', slug: 'certificate-spoken-english' },
      { name: 'Diploma in Fine Arts', duration: '3 Years', course_mode: 'Full Time', slug: 'diploma-fine-arts' },
    ],
    'Medical & Paramedical': [
      { name: 'Diploma in Nursing (ANM)', duration: '2 Years', course_mode: 'Full Time', slug: 'diploma-anm-nursing' },
      { name: 'Diploma in Pharmacy', duration: '2 Years', course_mode: 'Full Time', slug: 'diploma-pharmacy' },
      { name: 'Diploma in Medical Lab Technology', duration: '2 Years', course_mode: 'Full Time', slug: 'diploma-mlt' },
    ],
    'Computer & IT': [
      { name: 'Diploma in Computer Application (DCA)', duration: '1 Year', course_mode: 'Full Time', slug: 'dca' },
      { name: 'Diploma in Information Technology', duration: '3 Years', course_mode: 'Full Time', slug: 'diploma-it' },
    ],
    'Hotel Management': [
      { name: 'Diploma in Hotel Management', duration: '1 Year', course_mode: 'Full Time', slug: 'diploma-hotel-management' },
    ],
    'Vocational Courses': [
      { name: 'ITI Welder', duration: '1 Year', course_mode: 'Full Time', slug: 'iti-welder' },
      { name: 'ITI Carpenter', duration: '1 Year', course_mode: 'Full Time', slug: 'iti-carpenter' },
    ],
  };
  
  // Course data organized by category (from API or default)
  const [coursesByCategory, setCoursesByCategory] = useState(defaultCourses);

  // Category icons and colors
  const categoryMeta = {
    'Engineering': { icon: '⚙️', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    'Arts & Humanities': { icon: '🎨', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    'Medical & Paramedical': { icon: '🏥', color: 'from-red-500 to-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    'Dental': { icon: '🦷', color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    'Computer & IT': { icon: '💻', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    'Animation & Design': { icon: '🎬', color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
    'Hotel Management': { icon: '🏨', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    'Vocational Courses': { icon: '🔧', color: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
    'Agriculture': { icon: '🌾', color: 'from-green-500 to-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    'Fashion & Textile': { icon: '👗', color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
    // Initialize all categories as expanded
    const expanded = {};
    Object.keys(coursesByCategory).forEach(cat => expanded[cat] = true);
    setExpandedCategories(expanded);
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filter courses based on search
  const filteredCategories = Object.entries(coursesByCategory).filter(([category, courses]) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return category.toLowerCase().includes(query) || 
           courses.some(c => c.name.toLowerCase().includes(query));
  });

  // Count total courses
  const totalCourses = Object.values(coursesByCategory).flat().length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Courses After 10th - Best Diploma & Certificate Courses 2025</title>
        <meta name="description" content="Explore 50+ diploma, certificate and ITI courses after 10th class. Find the best career-oriented courses in Engineering, Medical, IT, Design and more." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white">
          <div className="container mx-auto px-4 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-orange-100 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <FiChevronRight className="w-4 h-4" />
              <Link to="/courses" className="hover:text-white transition">Courses</Link>
              <FiChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">After 10th</span>
            </div>

            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Courses After 10th Class
              </h1>
              <p className="text-lg text-orange-100 mb-6 max-w-2xl">
                Explore {totalCourses}+ diploma, certificate & vocational courses to kickstart your career after class 10th
              </p>

              {/* Search Box */}
              <div className="relative max-w-xl mb-8">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiSearch className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses (Diploma, ITI, Certificate...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                />
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <FiGrid className="w-5 h-5" />
                  <span className="font-medium">{Object.keys(coursesByCategory).length} Categories</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <FiBookOpen className="w-5 h-5" />
                  <span className="font-medium">{totalCourses}+ Courses</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <FiClock className="w-5 h-5" />
                  <span className="font-medium">6 Months - 3 Years</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Category Navigation */}
        <section className="bg-white border-b shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
              <span className="text-gray-500 text-sm whitespace-nowrap">Jump to:</span>
              {Object.keys(coursesByCategory).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    document.getElementById(category.replace(/\s+/g, '-').toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-full whitespace-nowrap transition-colors"
                >
                  {categoryMeta[category]?.icon} {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course List */}
            <div className="flex-1">
              {filteredCategories.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">No courses found</h3>
                  <p className="text-gray-400">Try a different search term</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredCategories.map(([category, courses]) => {
                    const meta = categoryMeta[category] || { icon: '📚', color: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
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
                          className={`w-full flex items-center justify-between p-4 bg-gradient-to-r ${meta.color} text-white hover:opacity-95 transition-opacity`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{meta.icon}</span>
                            <div className="text-left">
                              <h2 className="text-xl font-bold">{category}</h2>
                              <p className="text-sm text-white/80">{courses.length} courses available</p>
                            </div>
                          </div>
                          {isExpanded ? <FiChevronUp className="w-6 h-6" /> : <FiChevronDown className="w-6 h-6" />}
                        </button>

                        {/* Course Cards */}
                        {isExpanded && (
                          <div className="divide-y">
                            {filteredCourses.map((course, idx) => (
                              <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <Link 
                                      to={`/courses/${course.slug}`}
                                      className="text-lg font-semibold text-gray-800 hover:text-orange-600 transition-colors"
                                    >
                                      {course.name}
                                    </Link>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${meta.bg} ${meta.border} border rounded-full text-xs font-medium text-gray-700`}>
                                        <FiClock className="w-3 h-3" />
                                        {course.duration}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">
                                        <FiBookOpen className="w-3 h-3" />
                                        {course.mode}
                                      </span>
                                    </div>
                                    {/* Quick Links */}
                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                      <Link 
                                        to={`/courses/${course.slug}`}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiFileText className="w-3 h-3" />
                                        Course Overview
                                      </Link>
                                      <Link 
                                        to={`/courses/${course.slug}#career`}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiBriefcase className="w-3 h-3" />
                                        Career Options
                                      </Link>
                                      <Link 
                                        to={`/courses/${course.slug}#syllabus`}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                      >
                                        <FiBookOpen className="w-3 h-3" />
                                        Syllabus
                                      </Link>
                                    </div>
                                  </div>
                                  <Link
                                    to={`/courses/${course.slug}#apply`}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                                  >
                                    Apply Now
                                    <FiArrowRight className="w-4 h-4" />
                                  </Link>
                                </div>
                              </div>
                            ))}
                            {/* View All Link */}
                            <div className="p-4 bg-gray-50">
                              <Link 
                                to={`/courses/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
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
              {/* Related Pages */}
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="font-bold text-gray-800 mb-4">Related Course Pages</h3>
                <div className="space-y-2">
                  <Link to="/courses/after-12th" className="block p-3 bg-gray-50 hover:bg-orange-50 rounded-lg text-gray-700 hover:text-orange-600 transition-colors">
                    📚 Courses After 12th
                  </Link>
                  <Link to="/courses/after-graduation" className="block p-3 bg-gray-50 hover:bg-orange-50 rounded-lg text-gray-700 hover:text-orange-600 transition-colors">
                    🎓 Courses After Graduation
                  </Link>
                  <Link to="/courses/professional" className="block p-3 bg-gray-50 hover:bg-orange-50 rounded-lg text-gray-700 hover:text-orange-600 transition-colors">
                    💼 Professional Courses
                  </Link>
                  <Link to="/courses/short-term" className="block p-3 bg-gray-50 hover:bg-orange-50 rounded-lg text-gray-700 hover:text-orange-600 transition-colors">
                    ⚡ Short-Term Courses
                  </Link>
                </div>
              </div>

              {/* Why Choose */}
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-sm p-5 text-white">
                <h3 className="font-bold mb-4">Why Choose Courses After 10th?</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-200">✓</span>
                    <span>Early career start with practical skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-200">✓</span>
                    <span>Lower fees compared to degree courses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-200">✓</span>
                    <span>High demand in job market</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-200">✓</span>
                    <span>Options to pursue higher studies later</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-200">✓</span>
                    <span>Government job opportunities (ITI)</span>
                  </li>
                </ul>
              </div>

              {/* Popular Courses */}
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="font-bold text-gray-800 mb-4">🔥 Most Popular</h3>
                <div className="space-y-3">
                  {[
                    'Diploma in Mechanical Engineering',
                    'Diploma in Computer Application',
                    'ITI Electrician',
                    'Diploma in Nursing (ANM)',
                    'Diploma in Pharmacy'
                  ].map((course, idx) => (
                    <Link 
                      key={idx}
                      to={`/courses/${course.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block text-sm text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      {idx + 1}. {course}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-indigo-900 rounded-xl shadow-sm p-5 text-white text-center">
                <h3 className="font-bold mb-2">Need Career Guidance?</h3>
                <p className="text-sm text-indigo-200 mb-4">Talk to our experts to find the right course for you</p>
                <button className="w-full py-3 bg-white text-indigo-900 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
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
                { q: 'What are the best courses after 10th?', a: 'Popular courses include Diploma in Engineering, ITI courses, Diploma in Pharmacy, ANM Nursing, and various certificate programs in IT and Design.' },
                { q: 'Can I do diploma after 10th?', a: 'Yes, you can pursue polytechnic diploma courses in various streams like Engineering, Pharmacy, and Hotel Management after completing 10th class.' },
                { q: 'What is the duration of ITI courses?', a: 'ITI courses typically range from 6 months to 2 years depending on the trade. Engineering trades are usually 2 years while non-engineering trades are 1 year.' },
                { q: 'Are diploma courses better than 11th-12th?', a: 'Both paths have their advantages. Diploma courses offer hands-on skills and early job opportunities, while 11th-12th prepares you for higher education like B.Tech or MBBS.' },
              ].map((faq, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-5 border">
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

export default CoursesAfter10thPage;
