import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiLoader } from 'react-icons/fi';
import api from '../api/axios';
import AdBanner from '../components/AdBanner';

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [settings, setSettings] = useState(null);
  const itemsPerPage = 12;

  // Default categories (used if settings not loaded)
  const defaultCategories = [
    { id: 'all', label: 'ALL NEWS', enabled: true },
    { id: 'admission', label: 'ADMISSION ALERT', enabled: true },
    { id: 'college', label: 'COLLEGE NEWS', enabled: true },
    { id: 'exam', label: 'EXAM NEWS', enabled: true },
    { id: 'latest', label: 'LATEST ALERTS', enabled: true }
  ];

  // Get categories from settings or use defaults
  const categories = (settings?.categories || defaultCategories).filter(cat => cat.enabled);

  const gradients = [
    'from-orange-400 to-red-500',
    'from-purple-400 to-pink-500',
    'from-blue-400 to-indigo-500',
    'from-cyan-400 to-blue-500',
    'from-green-400 to-emerald-500',
    'from-indigo-400 to-purple-500',
    'from-yellow-400 to-orange-500',
    'from-pink-400 to-rose-500',
    'from-teal-400 to-green-500',
    'from-violet-400 to-purple-500'
  ];

  const getGradient = (index) => gradients[index % gradients.length];

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchNews();
  }, [activeCategory, currentPage]);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/news-listing-settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching news settings:', error);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'all') {
        params.append('category', activeCategory);
      }
      params.append('limit', itemsPerPage);
      params.append('skip', (currentPage - 1) * itemsPerPage);
      
      const response = await api.get(`/news?${params.toString()}`);
      const newsData = response.data || [];
      
      // Set featured news (first item or most recent)
      if (newsData.length > 0 && currentPage === 1) {
        const featured = newsData.find(n => n.featured) || newsData[0];
        setFeaturedNews({
          ...featured,
          gradient: getGradient(0)
        });
      }
      
      // Map news with gradients
      const mappedNews = newsData.map((item, index) => ({
        ...item,
        gradient: getGradient(index)
      }));
      
      setNews(mappedNews);
      setTotalPages(Math.ceil((response.data.total || newsData.length) / itemsPerPage) || 1);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback to empty array
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Big Stories - get top stories from news
  const bigStoriesCount = settings?.big_stories_count || 5;
  const bigStories = news.slice(0, bigStoriesCount).map(item => ({
    title: item.title,
    date: item.published_date || item.date || new Date().toLocaleDateString(),
    slug: item.slug || item.id
  }));

  // Trending tags from settings or defaults
  const defaultTrendingTags = ['CAT 2025', 'JEE Main', 'NEET UG', 'GATE 2026', 'UPSC', 'IIT Admission', 'MBA Colleges', 'CUET', 'NTA', 'Engineering'];
  const trendingTags = settings?.trending_tags || defaultTrendingTags;

  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Ad Banner */}
      <AdBanner pageName="news" position="top" />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <FiChevronRight className="w-4 h-4" />
            <span className="text-gray-900">News</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === cat.id
                    ? 'text-orange-600 border-orange-600'
                    : 'text-gray-600 border-transparent hover:text-orange-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600">Loading news...</span>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Main Section */}
            <main className="flex-1 space-y-6">
              {/* Featured News */}
              {featuredNews && (
                <Link
                  to={`/news/${featuredNews.slug || featuredNews.id}`}
                  className={`block bg-gradient-to-r ${featuredNews.gradient} rounded-xl p-6 text-white hover:shadow-xl transition-shadow`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{featuredNews.tag || featuredNews.category}</span>
                    <span className="text-xs opacity-75">{featuredNews.published_date || featuredNews.date}</span>
                  </div>
                  <h1 className="text-xl font-bold mb-3">{featuredNews.title}</h1>
                  <p className="text-sm opacity-90 line-clamp-2">{featuredNews.description || featuredNews.excerpt}</p>
                </Link>
              )}

              {/* News Grid */}
              <div className="grid grid-cols-3 gap-4">
                {filteredNews.map((item, idx) => (
                  <React.Fragment key={item.id || idx}>
                    {/* Content Middle Ad - Show after 6th item */}
                    {idx === 6 && (
                      <div className="col-span-3 py-2">
                        <AdBanner pageName="news" position="content-middle" />
                      </div>
                    )}
                    <Link
                      to={`/news/${item.slug || item.id}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group overflow-hidden"
                    >
                      <div className={`h-2 bg-gradient-to-r ${item.gradient}`}></div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">{item.tag || item.category}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {item.description || item.excerpt} <span className="text-blue-600 font-semibold">Read More</span>
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{item.published_date || item.date}</span>
                          {item.views && <span className="text-gray-400">{item.views} views</span>}
                        </div>
                      </div>
                    </Link>
                  </React.Fragment>
                ))}
              </div>

              {filteredNews.length === 0 && !loading && (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500">No news found in this category.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  {Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded ${
                        page === currentPage
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 4 && (
                    <>
                      <span className="px-3 py-2">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-3 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="w-80 flex-shrink-0 space-y-6">
              {/* Sidebar Ad */}
              <AdBanner pageName="news" position="sidebar" />
              
              {/* The Big Stories */}
              {(settings?.show_big_stories !== false) && bigStories.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {settings?.big_stories_title || 'The Big Stories'}
                  </h2>
                  <div className="space-y-3">
                    {bigStories.map((story, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                        <Link to={`/news/${story.slug}`} className="block group">
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 mb-1">
                            {story.title}
                          </h3>
                          <p className="text-xs text-gray-500">{story.date}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Search */}
              {(settings?.show_trending_tags !== false) && trendingTags.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {settings?.trending_tags_title || '#Trending search'}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {trendingTags.map((tag, idx) => (
                      <Link
                        key={idx}
                        to={`/search?q=${encodeURIComponent(tag)}`}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-orange-50 text-blue-600 hover:text-orange-600 text-xs font-semibold rounded-full transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Subscription */}
              {(settings?.show_newsletter !== false) && (
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-sm p-6 text-white">
                  <h2 className="text-lg font-bold mb-3">
                    {settings?.newsletter_title || 'Subscribe to our newsletter'}
                  </h2>
                  <p className="text-sm mb-4 opacity-90">
                    {settings?.newsletter_subtitle || 'Get our latest news about exams, colleges and others'}
                  </p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 rounded-lg mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="w-full bg-white text-orange-600 font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                    {settings?.newsletter_button_text || 'Subscribe'}
                  </button>
                  <p className="text-xs mt-3 opacity-75">*Terms & conditions apply</p>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
