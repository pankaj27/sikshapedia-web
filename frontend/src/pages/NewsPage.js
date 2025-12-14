import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'ALL NEWS', url: '/news' },
    { id: 'admission', label: 'ADMISSION ALERT', url: '/news/admission' },
    { id: 'college', label: 'COLLEGE NEWS', url: '/news/college' },
    { id: 'exam', label: 'EXAM NEWS', url: '/news/exam' },
    { id: 'latest', label: 'LATEST ALERTS', url: '/news/latest' }
  ];

  const featuredNews = {
    title: 'SNAP 2025 Test 2 Exam Analysis Live Updates',
    description: 'The SNAP 2025 Test 2 is scheduled on 14th December 2025 in CBT Mode in two slots: 2:00 PM to 3:00 PM and 4:30 PM to 5:30 PM. The SNAP 2025 Test 2 Exam Analysis Live Updates will be...',
    date: 'Dec 13, 2025',
    tag: 'SNAP',
    url: '#',
    gradient: 'from-orange-400 to-red-500'
  };

  const allNewsItems = [
    // Exam News
    {
      title: 'SNAP 2025 Test 2 Question Paper with Solutions: Download SNAP 2025 Question Paper with Answer Key',
      description: 'The SNAP 2025 Question Paper, along with the Answer Key and detailed solutions, will be available for download in PDF format...',
      date: 'Dec 12, 2025',
      tag: 'SNAP',
      category: 'exam',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      title: 'AILET LLM 2026 Question Paper (Available) Download Solutions and Answer Key pdf',
      description: 'AILET 2026 LLM Question Paper with Answer Key PDF will be available for download. NLU Delhi will conduct AILET 2026 on December 13, 2025...',
      date: 'Dec 12, 2025',
      tag: 'AILET',
      category: 'exam',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      title: 'CAT 2025 Results Declared',
      description: 'IIM Calcutta has released CAT 2025 results. Candidates can check their scores on the official website...',
      date: 'Dec 08, 2025',
      tag: 'CAT',
      category: 'exam',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      title: 'JEE Main 2026 Registration Started',
      description: 'JEE Main 2026 registration has commenced. Candidates can apply till January 10, 2026. The exam will be held in two sessions...',
      date: 'Dec 14, 2025',
      tag: 'JEE Main',
      category: 'exam',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      title: 'NEET 2025 Exam Date Announced',
      description: 'NEET 2025 will be conducted on May 3, 2025. Application forms will be available from February 6, 2025...',
      date: 'Dec 12, 2025',
      tag: 'NEET',
      category: 'exam',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      title: 'GATE 2026 Registration Extended',
      description: 'IIT Delhi has extended the GATE 2026 registration deadline by one week. Last date to apply is now October 19, 2025...',
      date: 'Dec 10, 2025',
      tag: 'GATE',
      category: 'exam',
      gradient: 'from-indigo-400 to-purple-500'
    },
    // College News
    {
      title: 'MGR University PhD/MS Research Admission 2026 Begins; Apply by January 31',
      description: 'The Dr. M.G.R. Educational and Research Institute in Chennai has begun accepting applications for its PhD/MS Research Admission program...',
      date: 'Dec 11, 2025',
      tag: 'Dr. M.G.R. University',
      category: 'college',
      gradient: 'from-green-400 to-teal-500'
    },
    {
      title: 'Bennett University Greater Noida Releases Fee Structure 2026',
      description: 'Bennett University, Greater Noida, has released its 2026 fee structure for all major UG, PG, Dual Degree programs...',
      date: 'Dec 11, 2025',
      tag: 'Bennett University',
      category: 'college',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'IIT Delhi Announces New BTech Programs for 2026',
      description: 'IIT Delhi has announced three new BTech programs in AI, Quantum Computing, and Sustainable Energy for the academic year 2026-27...',
      date: 'Dec 13, 2025',
      tag: 'IIT Delhi',
      category: 'college',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      title: 'DU Releases Semester Results for UG Courses',
      description: 'Delhi University has declared semester examination results for undergraduate courses. Students can check their results on the official portal...',
      date: 'Dec 09, 2025',
      tag: 'Delhi University',
      category: 'college',
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      title: 'BITS Pilani Placements 2025: Highest Package Reaches ₹60 LPA',
      description: 'BITS Pilani has concluded its placement season with remarkable results. The highest domestic package stood at ₹60 lakhs per annum...',
      date: 'Dec 14, 2025',
      tag: 'BITS Pilani',
      category: 'college',
      gradient: 'from-violet-400 to-purple-500'
    },
    {
      title: 'Anna University Announces Revaluation Schedule',
      description: 'Anna University has published the revaluation schedule for November/December 2025 examinations. Last date to apply is December 20...',
      date: 'Dec 10, 2025',
      tag: 'Anna University',
      category: 'college',
      gradient: 'from-amber-400 to-orange-500'
    },
    // Admission News
    {
      title: 'IIM Visakhapatnam Admission 2026: Interview Shortlist Out',
      description: 'IIM Visakhapatnam offers admission to its various programs based on scores in national entrance exams...',
      date: 'Dec 12, 2025',
      tag: 'IIM Visakhapatnam',
      category: 'admission',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      title: 'IIT Bombay Opens PhD Admissions for Winter 2026',
      description: 'IIT Bombay has opened PhD admissions for various departments for the winter semester 2026. The last date to apply is January 15, 2026...',
      date: 'Dec 13, 2025',
      tag: 'IIT Bombay',
      category: 'admission',
      gradient: 'from-teal-400 to-green-500'
    },
    {
      title: 'XLRI MBA Admissions 2026: Applications Open',
      description: 'XLRI Jamshedpur has started accepting applications for MBA programs for the batch of 2026-28. XAT scores are mandatory...',
      date: 'Dec 11, 2025',
      tag: 'XLRI',
      category: 'admission',
      gradient: 'from-purple-400 to-indigo-500'
    },
    {
      title: 'NIT Trichy BTech Admissions: JEE Main Cutoffs Released',
      description: 'NIT Trichy has released the expected JEE Main cutoffs for BTech admissions 2026. Computer Science cutoff is around 98 percentile...',
      date: 'Dec 10, 2025',
      tag: 'NIT Trichy',
      category: 'admission',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      title: 'AIIMS Delhi PG Admissions: Important Dates Announced',
      description: 'AIIMS Delhi has announced important dates for PG medical admissions. The entrance exam will be conducted in March 2026...',
      date: 'Dec 09, 2025',
      tag: 'AIIMS Delhi',
      category: 'admission',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      title: 'Jadavpur University MCA Admissions Open',
      description: 'Jadavpur University has opened MCA admissions for 2026. Candidates need to qualify NIMCET or JECA for admission...',
      date: 'Dec 14, 2025',
      tag: 'Jadavpur University',
      category: 'admission',
      gradient: 'from-lime-400 to-green-500'
    },
    // Latest Alerts
    {
      title: 'CBSE Date Sheet 2026 Released for Class 10 and 12',
      description: 'CBSE has released the date sheet for Class 10 and 12 board examinations 2026. Exams will begin from February 15, 2026...',
      date: 'Dec 14, 2025',
      tag: 'CBSE',
      category: 'latest',
      gradient: 'from-rose-400 to-pink-500'
    },
    {
      title: 'UGC NET December 2025 Admit Card Released',
      description: 'NTA has released the admit card for UGC NET December 2025 exam. Candidates can download from the official website...',
      date: 'Dec 13, 2025',
      tag: 'UGC NET',
      category: 'latest',
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      title: 'CUET 2026 Registration Starts from January 2026',
      description: 'NTA has announced that CUET 2026 registration will commence in January 2026. The exam will be conducted in May 2026...',
      date: 'Dec 12, 2025',
      tag: 'CUET',
      category: 'latest',
      gradient: 'from-violet-400 to-purple-500'
    },
    {
      title: 'NEET PG 2026 Exam Pattern Changed: NMC Announces',
      description: 'National Medical Commission has announced changes in NEET PG exam pattern. The number of questions has been increased to 300...',
      date: 'Dec 11, 2025',
      tag: 'NEET PG',
      category: 'latest',
      gradient: 'from-fuchsia-400 to-pink-500'
    },
    {
      title: 'Scholarship Alert: PM Scholarship 2026 Applications Open',
      description: 'The Prime Minister Scholarship Scheme 2026 applications are now open. Students can apply until January 31, 2026...',
      date: 'Dec 10, 2025',
      tag: 'Scholarship',
      category: 'latest',
      gradient: 'from-sky-400 to-blue-500'
    },
    {
      title: 'Maharashtra CET 2026 Dates Announced',
      description: 'Maharashtra State CET Cell has announced MHT CET 2026 exam dates. The exam will be conducted in April-May 2026...',
      date: 'Dec 09, 2025',
      tag: 'MHT CET',
      category: 'latest',
      gradient: 'from-amber-400 to-yellow-500'
    }
  ];

  const filteredNewsItems = activeCategory === 'all' 
    ? allNewsItems 
    : allNewsItems.filter(item => item.category === activeCategory);

  const bigStories = activeCategory === 'all' 
    ? [
        { title: 'SNAP 2025 Test 2 Exam Analysis Live Updates', date: 'Dec 13, 2025', category: 'exam' },
        { title: 'IIT Delhi Announces New BTech Programs for 2026', date: 'Dec 13, 2025', category: 'college' },
        { title: 'IIT Bombay Opens PhD Admissions for Winter 2026', date: 'Dec 13, 2025', category: 'admission' },
        { title: 'CBSE Date Sheet 2026 Released for Class 10 and 12', date: 'Dec 14, 2025', category: 'latest' },
        { title: 'JEE Main 2026 Registration Started', date: 'Dec 14, 2025', category: 'exam' }
      ]
    : filteredNewsItems.slice(0, 5).map(item => ({ 
        title: item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title, 
        date: item.date,
        category: item.category
      }));

  const trendingTags = ['SNAP', 'MAT', 'AILET', 'NEET', 'JEE Main', 'CAT'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Trending Bar */}
      <div className="bg-orange-600 text-white py-2 px-8">
        <div className="container mx-auto">
          <span className="font-bold mr-3">Trending Now:</span>
          <Link to="#" className="hover:underline">
            SNAP 2025 Test 2 Exam Analysis Live Updates [Check Now]
          </Link>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-8">
          <div className="flex items-center gap-8 overflow-x-auto py-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-sm font-bold whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8">
        <div className="flex gap-8">
          {/* Main News Section */}
          <main className="flex-1">
            {/* Featured News */}
            <div className="mb-8">
              <Link to={featuredNews.url} className="block group">
                <div className={`w-full h-80 bg-gradient-to-br ${featuredNews.gradient} rounded-lg mb-4 flex items-center justify-center`}>
                  <div className="text-white text-center p-8">
                    <svg className="w-20 h-20 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                    </svg>
                    <p className="text-sm font-semibold opacity-90">Featured News</p>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {featuredNews.title}
                </h1>
                <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                  {featuredNews.description} <span className="text-blue-600 font-semibold">Read More</span>
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">{featuredNews.date}</span>
                  <Link to="#" className="text-blue-600 hover:underline font-semibold">
                    {featuredNews.tag}
                  </Link>
                </div>
              </Link>
            </div>

            {/* Category Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
              {activeCategory === 'all' ? 'All News' : 
               activeCategory === 'exam' ? 'Exam News' :
               activeCategory === 'college' ? 'College News' :
               activeCategory === 'admission' ? 'Admission Alerts' :
               activeCategory === 'latest' ? 'Latest Alerts' : 'News'}
            </h2>

            {/* News Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {filteredNewsItems.slice(0, 9).map((news, idx) => (
                <Link
                  key={idx}
                  to="#"
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className={`w-full h-48 bg-gradient-to-br ${news.gradient} flex items-center justify-center`}>
                    <svg className="w-16 h-16 text-white opacity-70" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {news.description} <span className="text-blue-600 font-semibold">Read More</span>
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{news.date}</span>
                      <Link to="#" className="text-blue-600 hover:underline font-semibold">
                        {news.tag}
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4].map((page) => (
                <Link
                  key={page}
                  to="#"
                  className={`px-3 py-2 rounded ${
                    page === 1
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </Link>
              ))}
              <span className="px-3 py-2">...</span>
              <Link to="#" className="px-3 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded">
                334
              </Link>
              <Link to="#" className="px-3 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded">
                Next
              </Link>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0 space-y-6">
            {/* The Big Stories */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">The Big Stories</h2>
              <div className="space-y-3">
                {bigStories.map((story, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <Link to="#" className="block group">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 mb-1">
                        {story.title}
                      </h3>
                      <p className="text-xs text-gray-500">{story.date}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Search */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">#Trending search</h2>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag, idx) => (
                  <Link
                    key={idx}
                    to="#"
                    className="px-3 py-1.5 bg-gray-100 hover:bg-orange-50 text-blue-600 hover:text-orange-600 text-xs font-semibold rounded-full transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-sm p-6 text-white">
              <h2 className="text-lg font-bold mb-3">Subscribe to our newsletter</h2>
              <p className="text-sm mb-4 opacity-90">Get our latest news about exams, colleges and others</p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="w-full bg-white text-orange-600 font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
              <p className="text-xs mt-3 opacity-75">*Terms & conditions apply</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
