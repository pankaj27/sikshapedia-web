import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiSearch, FiChevronDown, FiChevronUp, FiCalendar, FiFileText, FiClock, FiBookOpen, FiTrendingUp, FiBell, FiArrowRight, FiLoader } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';
import { FeaturedSponsoredSection } from '../components/SponsoredAds';
import api from '../api/axios';

import { Link } from '../components/CustomLink';
const ExamPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularExams, setPopularExams] = useState([]);
  
  // Page settings from backend
  const [pageSettings, setPageSettings] = useState({
    hero_title: 'Entrance Exams in India 2025-26',
    hero_subtitle: 'Complete guide to 200+ entrance exams for Engineering, Medical, Management, Law & more',
    hero_search_placeholder: 'Search exams (JEE, NEET, CAT, GATE...)',
    stats: [
      { label: 'Total Exams', value: '200+' },
      { label: 'Categories', value: '24' },
      { label: 'Updates Daily', value: '50+' },
      { label: 'Students Helped', value: '10M+' }
    ],
    show_news_section: true,
    news_section_title: 'Latest Exam Updates',
    news_items: [],
    meta_title: 'Entrance Exams in India 2025-26 | Complete Guide',
    meta_description: 'Find all entrance exams in India.',
    faqs: []
  });

  const categories = [
    'Engineering', 'Medical', 'Management', 'Science', 'Law', 'Pharmacy',
    'Computer Applications', 'Arts', 'Education', 'Design', 'Architecture',
    'Commerce', 'Paramedical', 'Dental', 'Class 12 Exams', 'Agriculture',
    'Class 10 Exams', 'Hotel Management', 'Veterinary Sciences', 'Vocational Courses',
    'Study Abroad Exams', 'Mass Communications', 'Aviation', 'Animation'
  ];

  // Color palette for exam cards
  const colorPalette = [
    'from-blue-500 to-blue-600',
    'from-orange-500 to-orange-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-red-500 to-red-600',
    'from-indigo-500 to-indigo-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600',
    'from-cyan-500 to-cyan-600',
    'from-amber-500 to-amber-600'
  ];

  // Fetch page settings and exams from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch page settings
        try {
          const settingsRes = await api.get('/exam-listing-settings');
          if (settingsRes.data) {
            setPageSettings(prev => ({ ...prev, ...settingsRes.data }));
          }
        } catch (err) {
          console.log('Using default page settings');
        }
        
        // Fetch from exams-detail endpoint for comprehensive exam data
        const response = await api.get('/exams-detail?limit=200');
        const examData = response.data || [];
        
        // Transform API data to match component format
        const transformedExams = examData.map((exam, index) => ({
          id: exam.id,
          name: exam.name,
          fullName: exam.full_name || exam.name,
          description: exam.description,
          examMode: exam.exam_mode ? `${exam.exam_mode} Exam` : 'Online/Offline',
          examDate: exam.exam_date || 'TBA',
          applicationDate: exam.application_start_date && exam.application_end_date 
            ? `${exam.application_start_date} - ${exam.application_end_date}` 
            : exam.application_start_date || 'TBA',
          resultDate: exam.result_date || 'TBA',
          category: exam.streams?.[0] || 'General',
          streams: exam.streams || [],
          initials: exam.name?.split(' ').map(w => w[0]).join('').substring(0, 4) || 'EXAM',
          color: colorPalette[index % colorPalette.length],
          colleges: exam.accepting_colleges?.length ? `${exam.accepting_colleges.length}+` : '-',
          applicants: exam.total_applicants ? `${(exam.total_applicants / 100000).toFixed(0)}L+` : '-',
          slug: exam.slug || exam.name?.toLowerCase().replace(/\s+/g, '-'),
          level: exam.exam_level || exam.level,
          conductingBody: exam.conducting_body,
          totalMarks: exam.total_marks,
          numQuestions: exam.num_questions,
          examDuration: exam.exam_duration,
          status: exam.status,
          isPopular: exam.is_popular || false,
          isFeatured: exam.is_featured || false,
          popularOrder: exam.popular_order || 0
        }));
        
        // Filter only published/active exams (exclude drafts)
        const activeExams = transformedExams.filter(e => e.status !== 'draft' || !e.status);
        
        setExams(activeExams);
        
        // Set popular exams - use is_popular flag, sorted by popular_order
        const popular = activeExams
          .filter(e => e.isPopular)
          .sort((a, b) => a.popularOrder - b.popularOrder)
          .slice(0, 10)
          .map(e => ({
            name: e.name,
            url: `/exams/${e.slug || e.id}`
          }));
        
        // Fallback to first 10 if no popular exams marked
        setPopularExams(popular.length > 0 ? popular : activeExams.slice(0, 10).map(e => ({
          name: e.name,
          url: `/exams/${e.slug || e.id}`
        })));
        
      } catch (error) {
        console.error('Error fetching exams:', error);
        // Keep some fallback data if API fails
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredExams = exams.filter(exam => {
    // Match category - check both single category and streams array
    const matchesCategory = selectedCategory === 'All' || 
                            exam.category === selectedCategory ||
                            (exam.streams && exam.streams.includes(selectedCategory));
    const matchesSearch = exam.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 12);

  // Category icons
  const categoryIcons = {
    'Engineering': '⚙️', 'Medical': '🏥', 'Management': '📊', 'Science': '🔬',
    'Law': '⚖️', 'Pharmacy': '💊', 'Computer Applications': '💻', 'Arts': '🎭',
    'Education': '📚', 'Design': '🎨', 'Architecture': '🏛️', 'Commerce': '💼',
    'Paramedical': '🏥', 'Dental': '🦷', 'Class 12 Exams': '📖', 'Agriculture': '🌾',
    'Class 10 Exams': '📝', 'Hotel Management': '🏨', 'Veterinary Sciences': '🐾',
    'Vocational Courses': '🔧', 'Study Abroad Exams': '✈️', 'Mass Communications': '📺',
    'Aviation': '✈️', 'Animation': '🎬'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="relative container mx-auto px-4 py-10 md:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-6">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <FiChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Entrance Exams</span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {pageSettings.hero_title}
            </h1>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl">
              {pageSettings.hero_subtitle}
            </p>

            {/* Search Box */}
            <div className="relative max-w-2xl mb-8">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder={pageSettings.hero_search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all"
              />
            </div>

            {/* Quick Stats - Dynamic from settings */}
            <div className="grid grid-cols-4 gap-4 max-w-xl">
              {(pageSettings.stats || []).slice(0, 4).map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-indigo-200 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Exams Strip */}
      <section className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-gray-500 font-medium text-sm whitespace-nowrap flex items-center gap-1">
              <FiTrendingUp className="w-4 h-4 text-orange-500" /> Popular:
            </span>
            {popularExams.map((exam, idx) => (
              <Link
                key={idx}
                to={exam.url}
                className="px-4 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 border border-gray-200 hover:border-orange-200 rounded-full text-sm font-medium text-gray-700 hover:text-orange-700 whitespace-nowrap transition-all"
              >
                {exam.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner pageName="exams" position="top" />
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-4">
            {/* Categories Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <FiBookOpen className="w-5 h-5" />
                  Exam Categories
                </h2>
              </div>
              <div className="p-4">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl mb-1 transition-all ${
                    selectedCategory === 'All'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  📋 All Exams
                </button>
                <div className="space-y-0.5">
                  {visibleCategories.map((category, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${
                        selectedCategory === category
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {categoryIcons[category] || '📚'} {category}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="w-full mt-3 pt-3 border-t border-gray-100 text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center justify-center gap-1"
                >
                  {showAllCategories ? (
                    <>View Less <FiChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>View All 24 Categories <FiChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar Ad */}
            <AdBanner pageName="exams" position="sidebar" />

            {/* News Card */}
            {/* Latest Exam Updates - Only show if we have news/updates from API */}
            {latestNews && latestNews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-4">
                  <h2 className="text-white font-bold flex items-center gap-2">
                    <FiBell className="w-5 h-5" />
                    Latest Exam Updates
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  {latestNews.slice(0, 4).map((news, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-bold rounded bg-green-100 text-green-700">
                          NEWS
                        </span>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition line-clamp-2">
                            {news.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{news.date || news.published_date}</p>
                        </div>
                      </div>
                    </div>
                ))}
                <Link 
                  to="/exam-news" 
                  className="flex items-center justify-center gap-1 pt-3 border-t border-gray-100 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                >
                  View All News <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCategory === 'All' ? 'All Entrance Exams' : `${selectedCategory} Exams`}
                </h2>
                <p className="text-gray-500 text-sm">Showing {filteredExams.length} exams</p>
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

            {/* Exam Cards */}
            <div className="space-y-4">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <FiLoader className="w-8 h-8 text-indigo-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Loading exams...</span>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredExams.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No exams found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? `No exams match "${searchQuery}"` : `No exams in ${selectedCategory} category yet`}
                  </p>
                </div>
              )}

              {!loading && filteredExams.map((exam, idx) => (
                <React.Fragment key={exam.id || `exam-${idx}`}>
                  {/* Middle Ad after 3rd item */}
                  {idx === 3 && (
                    <div className="py-2">
                      <AdBanner pageName="exams" position="content-middle" />
                    </div>
                  )}
                  
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 group">
                    <div className="p-5 md:p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Exam Logo */}
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${exam.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                            <span className="font-bold text-lg md:text-xl">{exam.initials}</span>
                          </div>
                        </div>

                        {/* Exam Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start gap-2 mb-2">
                            <Link to={`/exams/${exam.slug || exam.id}`}>
                              <h3 className="text-lg md:text-xl font-bold text-gray-900 hover:text-indigo-600 transition">
                                {exam.name}
                              </h3>
                            </Link>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              exam.examMode?.includes('Online') 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {exam.examMode}
                            </span>
                            {exam.level && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                {exam.level}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4">{exam.fullName}</p>

                          {/* Key Dates Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiCalendar className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Exam Date</div>
                                <div className="text-sm font-bold text-gray-800">{exam.examDate}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiFileText className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Application</div>
                                <div className="text-sm font-bold text-gray-800">{exam.applicationDate}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiClock className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Result</div>
                                <div className="text-sm font-bold text-gray-800">{exam.resultDate}</div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Links */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <Link
                              to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}/application-form`}
                              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                            >
                              Application Process
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link
                              to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}/exam-pattern`}
                              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                            >
                              Exam Pattern
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link
                              to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}/question-paper`}
                              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                            >
                              Previous Papers
                            </Link>
                          </div>
                        </div>

                        {/* CTA Section */}
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                          <div className="text-center md:text-right">
                            <div className="text-xs text-gray-500">{exam.colleges} Colleges</div>
                            <div className="text-xs text-gray-500">{exam.applicants} Applicants</div>
                          </div>
                          <Link
                            to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}/application-form`}
                            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* No Results */}
            {filteredExams.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No exams found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Intro Content Section (from Admin) */}
      {pageSettings.intro_content && (
        <section className="bg-gray-50 border-t py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div 
                className="prose prose-gray max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: pageSettings.intro_content }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Bottom Content Section (from Admin) */}
      {pageSettings.bottom_content ? (
        <section className="bg-white border-t py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div 
                className="prose prose-gray max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: pageSettings.bottom_content }}
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white border-t py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Entrance Exams in India 2025-26</h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p>
                  India conducts over 200 entrance examinations annually for admissions to undergraduate, 
                  postgraduate, and doctoral programs. These exams are conducted at national, state, and 
                  university levels across various streams.
                </p>
                <p className="mt-3">
                  Major national-level exams include JEE Main, JEE Advanced, NEET, CAT, GATE, CLAT, and UPSC CSE. 
                  Each exam has unique eligibility criteria, application processes, and syllabus. Use our 
                  comprehensive guides to prepare effectively.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section (from Admin) */}
      {pageSettings.faqs && pageSettings.faqs.length > 0 && (
        <section className="bg-gray-50 border-t py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {pageSettings.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Q: {faq.question}</h3>
                    <p className="text-gray-600 text-sm">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ExamPage;
