import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiSearch, FiChevronDown } from 'react-icons/fi';

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
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-8 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <FiChevronRight className="mx-2" size={16} />
            <span className="text-gray-900 font-semibold">Entrance Exams In India</span>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="bg-white py-8 border-b">
        <div className="container mx-auto px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Entrance Exams In India</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Popular Exams Bar */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-8">
          <div className="flex items-center gap-6 overflow-x-auto">
            {popularExams.map((exam, idx) => (
              <Link
                key={idx}
                to={exam.url}
                className="text-sm font-semibold text-gray-700 hover:text-orange-600 whitespace-nowrap transition-colors"
              >
                {exam.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <aside className="w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Exams Category</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-orange-50 text-orange-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Exams
                </button>
                {visibleCategories.map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-50 text-orange-600 font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="w-full text-left px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2"
                >
                  {showAllCategories ? 'View Less' : 'View More'}
                  <FiChevronDown className={`transition-transform ${showAllCategories ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </aside>

          {/* Exam Cards Grid */}
          <main className="w-3/4">
            <div className="grid grid-cols-1 gap-6">
              {filteredExams.map((exam, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex p-6 gap-6">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <img
                        src={exam.logo}
                        alt={exam.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                    </div>

                    {/* Exam Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link to={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 mb-1">
                              {exam.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mb-2">{exam.fullName}</p>
                          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                            {exam.examMode}
                          </span>
                        </div>
                      </div>

                      {/* Important Dates */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1">Exam Date</p>
                          <p className="text-sm text-gray-900 font-medium">{exam.examDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1">Application Form</p>
                          <p className="text-sm text-gray-900 font-medium">{exam.applicationDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1">Result Announce</p>
                          <p className="text-sm text-gray-900 font-medium">{exam.resultDate}</p>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-6">
                        <Link
                          to="#"
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Application Process
                        </Link>
                        <Link
                          to="#"
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Exam Pattern
                        </Link>
                        <Link
                          to="#"
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Previous Year Paper
                        </Link>
                        <button className="ml-auto px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded shadow-sm transition-colors">
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
              <div className="text-center py-12">
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
