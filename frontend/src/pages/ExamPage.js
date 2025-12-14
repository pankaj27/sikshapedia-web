import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';

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
      logo: 'https://via.placeholder.com/48',
      name: 'CUET 2025',
      fullName: 'Common Universities Entrance Test',
      examMode: 'Offline Exam',
      examDate: '12 May 25 - 02 Jun 25',
      applicationDate: '28 Feb 25 - 23 Mar 25',
      resultDate: '03 Jul 25',
      category: 'Engineering'
    },
    {
      logo: 'https://via.placeholder.com/48',
      name: 'JEE Main 2026',
      fullName: 'Joint Entrance Exam Main',
      examMode: 'Online Exam',
      examDate: '21 Jan 26 - 29 Jan 26',
      applicationDate: '14 Oct 25 - 24 Nov 25',
      resultDate: '18 Feb 26',
      category: 'Engineering'
    },
    {
      logo: 'https://via.placeholder.com/48',
      name: 'NEET 2025',
      fullName: 'National Eligibility Cum Entrance Test',
      examMode: 'Offline Exam',
      examDate: '03 May 25',
      applicationDate: '06 Feb 25 - 06 Mar 25',
      resultDate: '13 Jun 25',
      category: 'Medical'
    },
    {
      logo: 'https://via.placeholder.com/48',
      name: 'CAT 2025',
      fullName: 'Common Admission Test',
      examMode: 'Online Exam',
      examDate: '29 Nov 25',
      applicationDate: '31 Jul 25 - 19 Sept 25',
      resultDate: 'TBA',
      category: 'Management'
    },
    {
      logo: 'https://via.placeholder.com/48',
      name: 'GATE 2026',
      fullName: 'Graduate Aptitude Test in Engineering',
      examMode: 'Online Exam',
      examDate: '06 Feb 26',
      applicationDate: '27 Aug 25 - 12 Oct 25',
      resultDate: '18 Mar 26',
      category: 'Engineering'
    },
    {
      logo: 'https://via.placeholder.com/48',
      name: 'CLAT 2025',
      fullName: 'Common Law Admission Test',
      examMode: 'Online Exam',
      examDate: '06 Dec 25',
      applicationDate: '31 Jul 25 - 30 Oct 25',
      resultDate: '16 Dec 25',
      category: 'Law'
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
      {/* Page Title Section */}
      <div className="bg-white py-6 px-8 border-b">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Entrance Exams In India</h1>
          
          {/* Search Bar - Always Visible */}
          <div className="relative max-w-2xl mb-6">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          {/* Popular Exams Links */}
          <div className="flex items-center gap-6 overflow-x-auto pb-2">
            {popularExams.map((exam, idx) => (
              <Link
                key={idx}
                to={exam.url}
                className="text-sm font-semibold text-blue-600 hover:text-orange-600 whitespace-nowrap transition-colors"
              >
                {exam.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar - Categories */}
          <aside className="w-80 flex-shrink-0 space-y-5">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Exams Category</h2>
              <div className="space-y-1">
                {visibleCategories.map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
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
                  className="w-full text-left px-3 py-2 text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 mt-2"
                >
                  {showAllCategories ? (
                    <>
                      View Less <FiChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      View More <FiChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Exam News Section */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Exam News</h2>
              <div className="space-y-4">
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
                  <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <Link to="#" className="block group">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 mb-1 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{news.date}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {news.description}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
              <Link 
                to="/exam-news" 
                className="block text-center mt-4 pt-4 border-t border-gray-200 text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All News
              </Link>
            </div>
          </aside>

          {/* Exam Cards Grid */}
          <main className="flex-1">
            <div className="space-y-5">
              {filteredExams.map((exam, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex p-5 gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <img
                        src={exam.logo}
                        alt={exam.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </div>

                    {/* Exam Details */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <Link to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <h3 className="text-lg font-bold text-gray-900 hover:text-orange-600 mb-1">
                            {exam.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">{exam.fullName}</p>
                        <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {exam.examMode}
                        </span>
                      </div>

                      <div className="border-t border-gray-100 pt-3 mb-3"></div>

                      {/* Important Dates */}
                      <div className="grid grid-cols-3 gap-6 mb-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 mb-1">Exam Date</h4>
                          <p className="text-sm text-gray-700">{exam.examDate}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 mb-1">Application Form</h4>
                          <p className="text-sm text-gray-700">{exam.applicationDate}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 mb-1">Result Announce</h4>
                          <p className="text-sm text-gray-700">{exam.resultDate}</p>
                        </div>
                      </div>

                      {/* Links & Button */}
                      <div className="flex items-center flex-wrap gap-4">
                        <Link
                          to="#"
                          className="text-sm text-blue-600 hover:underline font-semibold"
                        >
                          Application Process
                        </Link>
                        <Link
                          to="#"
                          className="text-sm text-blue-600 hover:underline font-semibold"
                        >
                          Exam Pattern
                        </Link>
                        <Link
                          to="#"
                          className="text-sm text-blue-600 hover:underline font-semibold"
                        >
                          Previous Year Paper
                        </Link>
                        <button className="ml-auto px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded transition-colors">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredExams.length === 0 && (
              <div className="bg-white rounded shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg">No exams found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
