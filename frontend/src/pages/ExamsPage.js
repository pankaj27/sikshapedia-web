import React, { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiBookOpen, FiAward, FiClock, FiFileText, FiUsers, FiTrendingUp, FiChevronRight, FiFilter } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FeaturedSponsoredSection } from '../components/SponsoredAds';

import { Link } from '../components/CustomLink';
const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    fetchExams();
  }, [selectedStream, selectedLevel]);

  const fetchExams = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStream) params.append('stream', selectedStream);
      if (selectedLevel) params.append('exam_level', selectedLevel);
      
      const response = await api.get(`/exams?${params.toString()}`);
      setExams(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchExams();
      return;
    }
    try {
      const response = await api.get(`/exams?search=${encodeURIComponent(searchQuery)}`);
      setExams(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error searching exams:', error);
    }
  };

  const streams = ['Engineering', 'Medical', 'Management', 'Law', 'Design'];
  const levels = ['National', 'State', 'University'];

  // Stream icons mapping
  const streamIcons = {
    'Engineering': '⚙️',
    'Medical': '🏥',
    'Management': '📊',
    'Law': '⚖️',
    'Design': '🎨',
    'Science': '🔬',
    'Pharmacy': '💊',
    'Arts': '🎭',
    'Commerce': '💼'
  };

  // Get exam status color
  const getStatusColor = (exam) => {
    if (exam.mode === 'Online') return 'bg-green-100 text-green-700';
    if (exam.mode === 'Offline') return 'bg-blue-100 text-blue-700';
    return 'bg-purple-100 text-purple-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Modern Gradient */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-indigo-200 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <FiChevronRight className="w-4 h-4" />
              <span className="text-white">Entrance Exams</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Entrance Exams in India 2025
            </h1>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Complete guide to all major entrance examinations for Engineering, Medical, Management, Law & more
            </p>
            
            {/* Search Box */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search exams (JEE, NEET, CAT, GATE...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 pl-12 pr-4 bg-white text-gray-900 rounded-xl border-0 shadow-lg text-base"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg">
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">{exams.length || '50'}+</div>
                <div className="text-indigo-200 text-sm">Total Exams</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">10M+</div>
                <div className="text-indigo-200 text-sm">Annual Aspirants</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">5000+</div>
                <div className="text-indigo-200 text-sm">Accepting Colleges</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">100%</div>
                <div className="text-indigo-200 text-sm">Updated Info</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Exam Categories */}
      <section className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            <span className="text-gray-600 font-medium whitespace-nowrap text-sm">Popular:</span>
            {['JEE Main', 'NEET', 'CAT', 'GATE', 'CLAT', 'UPSC', 'GMAT', 'XAT'].map((exam) => (
              <Link
                key={exam}
                to={`/exams/${exam.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap transition"
              >
                {exam}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-4">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <FiFilter className="w-5 h-5 text-indigo-600" />
                    <span>Filter Exams</span>
                  </div>
                </div>
                
                {/* Stream Filter */}
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">By Stream</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="stream"
                        checked={selectedStream === ''}
                        onChange={() => setSelectedStream('')}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="text-gray-700 group-hover:text-indigo-600 text-sm">All Streams</span>
                    </label>
                    {streams.map(stream => (
                      <label key={stream} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="stream"
                          checked={selectedStream === stream}
                          onChange={() => setSelectedStream(stream)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-gray-700 group-hover:text-indigo-600 text-sm">
                          {streamIcons[stream]} {stream}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">By Exam Level</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="level"
                        checked={selectedLevel === ''}
                        onChange={() => setSelectedLevel('')}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="text-gray-700 group-hover:text-indigo-600 text-sm">All Levels</span>
                    </label>
                    {levels.map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="level"
                          checked={selectedLevel === level}
                          onChange={() => setSelectedLevel(level)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-gray-700 group-hover:text-indigo-600 text-sm">{level} Level</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedStream || selectedLevel) && (
                  <div className="p-5 border-t border-gray-100">
                    <button
                      onClick={() => { setSelectedStream(''); setSelectedLevel(''); }}
                      className="w-full py-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </aside>

            {/* Exams Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedStream || 'All'} Entrance Exams
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Showing {exams.length} exams {selectedLevel && `for ${selectedLevel} level`}
                  </p>
                </div>
              </div>

              {/* Featured Sponsored Section */}
              <div className="mb-6">
                <FeaturedSponsoredSection 
                  placementId="exam_listing_featured"
                  title="Featured Colleges for Exam Preparation"
                  subtitle="Sponsored colleges with excellent exam results"
                  bgColor="from-red-50 via-rose-50 to-pink-50"
                  headerColor="from-red-500 to-rose-500"
                  linkColor="text-red-600"
                  viewAllLink="/colleges"
                />
              </div>

              {/* Exams List */}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : exams.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiSearch className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No exams found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search term</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <Link
                      key={exam.id}
                      to={`/exams/${exam.id}`}
                      className="block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
                    >
                      <div className="p-5 md:p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Exam Logo/Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                              {exam.name?.substring(0, 3).toUpperCase() || 'EXM'}
                            </div>
                          </div>

                          {/* Exam Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start gap-2 mb-2">
                              <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                                {exam.name} {new Date().getFullYear() + 1}
                              </h3>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam)}`}>
                                {exam.mode || 'Offline'} Exam
                              </span>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3">{exam.full_name}</p>

                            {/* Key Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                  <FiCalendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">Exam Date</div>
                                  <div className="text-xs font-semibold text-gray-800">{exam.exam_date || 'TBA'}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                  <FiFileText className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">Application</div>
                                  <div className="text-xs font-semibold text-gray-800">{exam.application_start_date || 'TBA'}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                                  <FiTrendingUp className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">Level</div>
                                  <div className="text-xs font-semibold text-gray-800">{exam.exam_level || 'National'}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                  <FiUsers className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">Fee</div>
                                  <div className="text-xs font-semibold text-gray-800">₹{exam.application_fee?.General || 'N/A'}</div>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{exam.description}</p>

                            {/* Tags & Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap gap-2">
                                {exam.streams && exam.streams.slice(0, 3).map((stream, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                    {streamIcons[stream] || '📚'} {stream}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-indigo-600 text-sm font-medium group-hover:underline">
                                  Application Process
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className="text-indigo-600 text-sm font-medium group-hover:underline">
                                  Exam Pattern
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className="text-indigo-600 text-sm font-medium group-hover:underline">
                                  Results
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* CTA Button - Desktop */}
                          <div className="hidden md:flex flex-col items-end justify-center gap-3">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-xl">
                              Apply Now
                            </Button>
                            <span className="text-xs text-gray-500">
                              {exam.accepting_colleges || '1000'}+ Colleges
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Links Footer */}
                      <div className="px-5 md:px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            Result: {exam.result_date || 'TBA'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-indigo-600 text-sm font-medium">
                          View Details <FiChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Entrance Exams in India</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                India conducts numerous entrance examinations every year for admissions to various undergraduate, 
                postgraduate, and doctoral programs. These exams are conducted at national, state, and university 
                levels across streams like Engineering, Medical, Management, Law, Design, and more.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Major national-level exams include JEE Main, JEE Advanced, NEET, CAT, GATE, CLAT, and UPSC CSE. 
                Each exam has its own eligibility criteria, application process, exam pattern, and cutoff requirements. 
                Stay updated with the latest exam dates, syllabus, and preparation tips on this page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExamsPage;
