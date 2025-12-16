import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AdBanner from '../components/AdBanner';

const ExamPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Engineering', 'Medical', 'Management', 'Science', 'Law', 'Pharmacy',
    'Computer Applications', 'Arts', 'Education', 'Design', 'Architecture',
    'Commerce', 'Paramedical', 'Dental', 'Class 12 Exams', 'Agriculture',
    'Class 10 Exams', 'Hotel Management', 'Veterinary Sciences', 'Vocational Courses',
    'Study Abroad Exams', 'Mass Communications', 'Aviation', 'Animation'
  ];

  const popularExams = [
    { name: 'JEE Main', url: '/exams/jee-main' },
    { name: 'NEET', url: '/exams/neet' },
    { name: 'CAT', url: '/exams/cat' },
    { name: 'GATE', url: '/exams/gate' },
    { name: 'CLAT', url: '/exams/clat' },
    { name: 'JEE Advanced', url: '/exams/jee-advanced' },
    { name: 'COMEDK UGET', url: '/exams/comedk-uget' },
    { name: 'AP EAPCET', url: '/exams/ap-eapcet' },
    { name: 'WBJEE', url: '/exams/wbjee' },
    { name: 'KCET', url: '/exams/kcet' }
  ];

  const exams = [
    {
      name: 'CUET 2025',
      fullName: 'Common Universities Entrance Test',
      examMode: 'Offline Exam',
      examDate: '12 May 25 - 02 Jun 25',
      applicationDate: '28 Feb 25 - 23 Mar 25',
      resultDate: '03 Jul 25',
      category: 'Engineering',
      initials: 'CUET',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'JEE Main 2026',
      fullName: 'Joint Entrance Exam Main',
      examMode: 'Online Exam',
      examDate: '21 Jan 26 - 29 Jan 26',
      applicationDate: '14 Oct 25 - 24 Nov 25',
      resultDate: '18 Feb 26',
      category: 'Engineering',
      initials: 'JEE',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'NEET 2025',
      fullName: 'National Eligibility Cum Entrance Test',
      examMode: 'Offline Exam',
      examDate: '03 May 25',
      applicationDate: '06 Feb 25 - 06 Mar 25',
      resultDate: '13 Jun 25',
      category: 'Medical',
      initials: 'NEET',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'CAT 2025',
      fullName: 'Common Admission Test',
      examMode: 'Online Exam',
      examDate: '29 Nov 25',
      applicationDate: '31 Jul 25 - 19 Sept 25',
      resultDate: 'TBA',
      category: 'Management',
      initials: 'CAT',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'GATE 2026',
      fullName: 'Graduate Aptitude Test in Engineering',
      examMode: 'Online Exam',
      examDate: '06 Feb 26',
      applicationDate: '27 Aug 25 - 12 Oct 25',
      resultDate: '18 Mar 26',
      category: 'Engineering',
      initials: 'GATE',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'CLAT 2025',
      fullName: 'Common Law Admission Test',
      examMode: 'Online Exam',
      examDate: '06 Dec 25',
      applicationDate: '31 Jul 25 - 30 Oct 25',
      resultDate: '16 Dec 25',
      category: 'Law',
      initials: 'CLAT',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const filteredExams = exams.filter(exam => {
    const matchesCategory = selectedCategory === 'All' || exam.category === selectedCategory;
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b py-2 px-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Exams</span>
          </div>
        </div>
      </div>

      {/* Page Title Section - More Compact */}
      <div className="bg-white py-4 px-8 border-b">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Entrance Exams In India</h1>
          
          {/* Search Bar - Always Visible */}
          <div className="relative max-w-2xl mb-3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          {/* Popular Exams Links */}
          <div className="flex items-center gap-4 overflow-x-auto pb-1">
            {popularExams.map((exam, idx) => (
              <Link
                key={idx}
                to={exam.url}
                className="text-xs font-semibold text-blue-600 hover:text-orange-600 whitespace-nowrap transition-colors"
              >
                {exam.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - More Compact */}
      <div className="container mx-auto px-8 py-5">
        <div className="flex gap-4">
          {/* Sidebar - Categories - More Compact */}
          <aside className="w-64 flex-shrink-0 space-y-3">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-3 sticky top-20">
              <h2 className="text-base font-bold text-gray-900 mb-2">Exams Category</h2>
              <div className="space-y-0.5">
                {visibleCategories.map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-2 py-1.5 text-xs transition-colors ${
                      selectedCategory === category
                        ? 'text-orange-600 font-semibold'
                        : 'text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="w-full text-left px-2 py-1.5 text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1 mt-1"
                >
                  {showAllCategories ? (
                    <>
                      View Less <FiChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      View More <FiChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Exam News Section - More Compact */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h2 className="text-base font-bold text-gray-900 mb-2">Exam News</h2>
              <div className="space-y-2.5">
                {[
                  {
                    title: 'JEE Main 2026 Registration Started',
                    date: '14 Dec 2025',
                    description: 'JEE Main 2026 registration has commenced. Candidates can apply till January 10, 2026.'
                  },
                  {
                    title: 'NEET 2025 Exam Date Announced',
                    date: '12 Dec 2025',
                    description: 'NEET 2025 will be conducted on May 3, 2025. Application forms available from Feb 6, 2025.'
                  },
                  {
                    title: 'CUET 2025 Registration Opens',
                    date: '10 Dec 2025',
                    description: 'Common Universities Entrance Test registration window is now open for session 2025.'
                  },
                  {
                    title: 'CAT 2025 Results Declared',
                    date: '08 Dec 2025',
                    description: 'IIM Calcutta has released CAT 2025 results. Candidates can check their scores on the official website.'
                  }
                ].map((news, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                    <Link to="#" className="block group">
                      <h3 className="text-xs font-bold text-gray-900 group-hover:text-orange-600 mb-0.5 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 mb-1">{news.date}</p>
                      <p className="text-[10px] text-gray-600 leading-relaxed">
                        {news.description}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
              <Link 
                to="/exam-news" 
                className="block text-center mt-2 pt-2 border-t border-gray-200 text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All News
              </Link>
            </div>
          </aside>

          {/* Exam Cards Grid - More Compact */}
          <main className="flex-1">
            <div className="space-y-3">
              {filteredExams.map((exam, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex p-3 gap-3">
                    {/* Logo with Initials - Smaller */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded bg-gradient-to-br ${exam.color} flex items-center justify-center shadow-sm`}>
                        <span className="text-white font-bold text-xs">{exam.initials}</span>
                      </div>
                    </div>

                    {/* Exam Details - More Compact */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <Link to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <h3 className="text-base font-bold text-gray-900 hover:text-orange-600 mb-0.5">
                            {exam.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-600 mb-1.5">{exam.fullName}</p>
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded">
                          {exam.examMode}
                        </span>
                      </div>

                      <div className="border-t border-gray-100 pt-2 mb-2"></div>

                      {/* Important Dates - More Compact */}
                      <div className="grid grid-cols-3 gap-4 mb-2.5">
                        <div>
                          <h4 className="text-[10px] font-bold text-gray-900 mb-0.5">Exam Date</h4>
                          <p className="text-xs text-gray-700">{exam.examDate}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-gray-900 mb-0.5">Application Form</h4>
                          <p className="text-xs text-gray-700">{exam.applicationDate}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-gray-900 mb-0.5">Result Announce</h4>
                          <p className="text-xs text-gray-700">{exam.resultDate}</p>
                        </div>
                      </div>

                      {/* Links & Button - Perfect Sizing */}
                      <div className="flex items-center flex-wrap gap-3">
                        <Link
                          to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}/application-form`}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Application Process
                        </Link>
                        <Link
                          to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}/exam-pattern`}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Exam Pattern
                        </Link>
                        <Link
                          to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}/question-paper`}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Previous Year Paper
                        </Link>
                        <Link
                          to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}/application-form`}
                          className="ml-auto px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-semibold rounded transition-colors"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredExams.length === 0 && (
              <div className="bg-white rounded shadow-sm p-8 text-center">
                <p className="text-gray-500 text-sm">No exams found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
