import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronRight, FiArrowRight, FiBookOpen, FiBriefcase, FiActivity, FiTrendingUp, FiAward, FiCpu, FiHeart, FiUsers, FiLayers, FiTarget, FiCompass } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineBeaker, HiOutlineScale, HiOutlineCurrencyRupee, HiOutlineDesktopComputer, HiOutlinePencilAlt, HiOutlineOfficeBuilding, HiOutlineHeart } from 'react-icons/hi';

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Popular course tags
  const popularTags = [
    { name: 'B.Tech', link: '/courses/btech', color: 'bg-blue-500' },
    { name: 'MBA', link: '/courses/mba', color: 'bg-purple-500' },
    { name: 'MBBS', link: '/courses/mbbs', color: 'bg-red-500' },
    { name: 'B.Sc', link: '/courses/bsc', color: 'bg-green-500' },
    { name: 'B.Com', link: '/courses/bcom', color: 'bg-yellow-500' },
    { name: 'BA', link: '/courses/ba', color: 'bg-pink-500' },
    { name: 'BCA', link: '/courses/bca', color: 'bg-indigo-500' },
    { name: 'LLB', link: '/courses/llb', color: 'bg-gray-600' },
  ];

  // Level-based courses with gradient colors
  const levelCourses = [
    {
      title: 'After 10th',
      subtitle: 'Diploma & Vocational',
      icon: '🎓',
      gradient: 'from-emerald-400 to-cyan-500',
      link: '/courses/after-10th',
      stats: '200+ Courses',
      popular: ['ITI', 'Polytechnic', 'Vocational']
    },
    {
      title: 'After 12th',
      subtitle: 'Undergraduate Programs',
      icon: '📚',
      gradient: 'from-blue-500 to-purple-600',
      link: '/courses/after-12th',
      stats: '500+ Courses',
      popular: ['B.Tech', 'MBBS', 'B.Com', 'BA']
    },
    {
      title: 'Diploma',
      subtitle: 'Professional Certifications',
      icon: '📜',
      gradient: 'from-orange-400 to-pink-500',
      link: '/courses/diploma',
      stats: '150+ Courses',
      popular: ['Engineering', 'Pharmacy', 'Nursing']
    },
    {
      title: 'Postgraduate',
      subtitle: 'Masters & PG Programs',
      icon: '🎯',
      gradient: 'from-purple-500 to-indigo-600',
      link: '/courses/pg',
      stats: '400+ Courses',
      popular: ['MBA', 'M.Tech', 'M.Sc', 'MA']
    },
    {
      title: 'PhD & Research',
      subtitle: 'Doctoral Programs',
      icon: '🔬',
      gradient: 'from-rose-400 to-red-500',
      link: '/courses/phd',
      stats: '100+ Programs',
      popular: ['Science', 'Engineering', 'Arts']
    },
    {
      title: 'Certificate',
      subtitle: 'Short-term Courses',
      icon: '✨',
      gradient: 'from-amber-400 to-orange-500',
      link: '/courses/certificate',
      stats: '300+ Courses',
      popular: ['IT', 'Management', 'Design']
    },
  ];

  // Stream categories with icons and colors
  const streamCategories = [
    { 
      name: 'Engineering', 
      icon: HiOutlineCpu, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
      borderColor: 'border-blue-200',
      link: '/courses/engineering',
      courses: ['B.Tech', 'B.E', 'M.Tech', 'Polytechnic'],
      count: '250+'
    },
    { 
      name: 'Medical', 
      icon: HiOutlineHeart, 
      color: 'text-red-600', 
      bgColor: 'bg-red-50',
      hoverBg: 'hover:bg-red-100',
      borderColor: 'border-red-200',
      link: '/courses/medical',
      courses: ['MBBS', 'BDS', 'BAMS', 'Nursing'],
      count: '120+'
    },
    { 
      name: 'Management', 
      icon: HiOutlineOfficeBuilding, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      hoverBg: 'hover:bg-purple-100',
      borderColor: 'border-purple-200',
      link: '/courses/management',
      courses: ['MBA', 'BBA', 'PGDM', 'Executive MBA'],
      count: '180+'
    },
    { 
      name: 'Science', 
      icon: HiOutlineBeaker, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      hoverBg: 'hover:bg-green-100',
      borderColor: 'border-green-200',
      link: '/courses/science',
      courses: ['B.Sc', 'M.Sc', 'B.Sc (Hons)', 'Integrated'],
      count: '200+'
    },
    { 
      name: 'Commerce', 
      icon: HiOutlineCurrencyRupee, 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50',
      hoverBg: 'hover:bg-amber-100',
      borderColor: 'border-amber-200',
      link: '/courses/commerce',
      courses: ['B.Com', 'M.Com', 'CA', 'CS'],
      count: '80+'
    },
    { 
      name: 'Arts & Humanities', 
      icon: HiOutlinePencilAlt, 
      color: 'text-pink-600', 
      bgColor: 'bg-pink-50',
      hoverBg: 'hover:bg-pink-100',
      borderColor: 'border-pink-200',
      link: '/courses/arts',
      courses: ['BA', 'MA', 'BFA', 'Journalism'],
      count: '150+'
    },
    { 
      name: 'Computer Applications', 
      icon: HiOutlineDesktopComputer, 
      color: 'text-indigo-600', 
      bgColor: 'bg-indigo-50',
      hoverBg: 'hover:bg-indigo-100',
      borderColor: 'border-indigo-200',
      link: '/courses/computer',
      courses: ['BCA', 'MCA', 'B.Sc IT', 'Data Science'],
      count: '100+'
    },
    { 
      name: 'Law', 
      icon: HiOutlineScale, 
      color: 'text-gray-700', 
      bgColor: 'bg-gray-50',
      hoverBg: 'hover:bg-gray-100',
      borderColor: 'border-gray-200',
      link: '/courses/law',
      courses: ['LLB', 'LLM', 'BA LLB', 'BBA LLB'],
      count: '60+'
    },
    { 
      name: 'Education', 
      icon: HiOutlineAcademicCap, 
      color: 'text-teal-600', 
      bgColor: 'bg-teal-50',
      hoverBg: 'hover:bg-teal-100',
      borderColor: 'border-teal-200',
      link: '/courses/education',
      courses: ['B.Ed', 'M.Ed', 'D.El.Ed', 'B.P.Ed'],
      count: '50+'
    },
  ];

  // Trending courses
  const trendingCourses = [
    { name: 'Data Science', growth: '+45%', icon: '📊' },
    { name: 'Artificial Intelligence', growth: '+62%', icon: '🤖' },
    { name: 'Digital Marketing', growth: '+38%', icon: '📱' },
    { name: 'Cyber Security', growth: '+52%', icon: '🔒' },
    { name: 'Cloud Computing', growth: '+41%', icon: '☁️' },
    { name: 'Machine Learning', growth: '+58%', icon: '🧠' },
  ];

  // Helper component for icon
  const HiOutlineCpu = HiOutlineDesktopComputer;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600"></div>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Discover Your Perfect
              <span className="block text-yellow-300">Course Journey</span>
            </h1>
            <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Explore 10,000+ courses across 50+ streams. Find the right path for your career.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for courses, streams, or colleges..."
                  className="w-full pl-14 pr-32 py-4 md:py-5 rounded-2xl text-gray-800 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Popular Tags */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {popularTags.map((tag, idx) => (
                <Link
                  key={idx}
                  to={tag.link}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition-all border border-white/30"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Choose by Level Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
              EXPLORE BY LEVEL
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Education Level</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find courses based on your current education stage</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {levelCourses.map((level, idx) => (
              <Link
                key={idx}
                to={level.link}
                className="group relative overflow-hidden rounded-2xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${level.gradient}`}></div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                
                <div className="relative">
                  <span className="text-4xl mb-3 block">{level.icon}</span>
                  <h3 className="font-bold text-lg mb-1">{level.title}</h3>
                  <p className="text-sm text-white/80 mb-3">{level.subtitle}</p>
                  <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {level.stats}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiArrowRight className="text-white" size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Choose by Stream Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              EXPLORE BY STREAM
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Interest Area</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover courses in your field of interest</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streamCategories.map((stream, idx) => {
              const IconComponent = stream.icon;
              return (
                <Link
                  key={idx}
                  to={stream.link}
                  className={`group relative p-6 rounded-2xl border-2 ${stream.borderColor} ${stream.bgColor} ${stream.hoverBg} transition-all duration-300 hover:shadow-lg hover:border-transparent`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stream.bgColor} ${stream.color}`}>
                      <IconComponent size={28} />
                    </div>
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-bold text-gray-700 shadow-sm">
                      {stream.count}
                    </span>
                  </div>
                  
                  <h3 className={`text-xl font-bold ${stream.color} mb-3`}>{stream.name}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stream.courses.map((course, cidx) => (
                      <span key={cidx} className="px-2 py-1 bg-white rounded-md text-xs font-medium text-gray-600">
                        {course}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm font-semibold text-gray-600 group-hover:text-orange-600 transition-colors">
                    Explore all courses
                    <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Courses Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-yellow-500 text-gray-900 rounded-full text-sm font-semibold mb-4">
              🔥 TRENDING NOW
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">High-Demand Courses</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Courses with the highest career growth potential in 2025</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingCourses.map((course, idx) => (
              <Link
                key={idx}
                to={`/courses/search?q=${encodeURIComponent(course.name)}`}
                className="group bg-gray-800 hover:bg-gray-700 rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-yellow-500"
              >
                <span className="text-4xl mb-3 block">{course.icon}</span>
                <h3 className="font-semibold text-white mb-2 text-sm">{course.name}</h3>
                <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                  {course.growth}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 bg-orange-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">10,000+</div>
              <div className="text-orange-200">Courses</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">5,000+</div>
              <div className="text-orange-200">Colleges</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">50+</div>
              <div className="text-orange-200">Streams</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">2M+</div>
              <div className="text-orange-200">Students Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Need Help Choosing the Right Course?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Our expert counselors are here to guide you. Get personalized course recommendations based on your interests and career goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/course-finder"
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FiCompass size={20} />
                Find My Course
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FiUsers size={20} />
                Talk to Counselor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
