import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiLoader } from 'react-icons/fi';
import api from '../api/axios';
import AdBanner from '../components/AdBanner';

import { Link } from '../components/CustomLink';
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

  // Helper function to strip HTML tags
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  // Big Stories - get top stories from news
  const bigStoriesCount = settings?.big_stories_count || 5;
  const bigStories = news.slice(0, bigStoriesCount).map(item => ({
    title: item.title,
    date: item.published_date || item.date || new Date().toLocaleDateString(),
    slug: item.slug || item.id
  }));

  // Trending tags - only from settings, no defaults
  const trendingTags = settings?.trending_tags || [];

  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Ad Banner */}
      <AdBanner pageName="news" position="top" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <FiChevronRight className="w-4 h-4" />
            <span className="text-white">News</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {settings?.hero_title || 'Latest News & Updates'}
          </h1>
          <p className="text-white/90 mb-6">
            {settings?.hero_subtitle || 'Stay updated with the latest news on admissions, exams, colleges and education'}
          </p>
          
          {/* Quick Stats */}
          {settings?.stats && settings.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {settings.stats.map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Intro Content (from admin) */}
      {settings?.intro_content && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: settings.intro_content }} />
        </div>
      )}

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
              {/* Featured News - Large Hero Card */}
              {featuredNews && (
                <Link
                  to={`/news/${featuredNews.slug || featuredNews.id}`}
                  className="block relative rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  {/* Large Featured Image */}
                  <div className="relative h-[400px]">
                    {featuredNews.featured_image ? (
                      <img 
                        src={featuredNews.featured_image} 
                        alt={featuredNews.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${featuredNews.gradient}`}></div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-full">
                          {featuredNews.category || 'Featured'}
                        </span>
                        <span className="text-white/80 text-sm">{featuredNews.published_date || featuredNews.date}</span>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                        {featuredNews.title}
                      </h1>
                      <p className="text-white/80 text-lg line-clamp-2 mb-4">
                        {stripHtml(featuredNews.summary || featuredNews.description || featuredNews.excerpt)}
                      </p>
                      <div className="flex items-center gap-4 text-white/70 text-sm">
                        {featuredNews.author && <span>By {featuredNews.author}</span>}
                        {featuredNews.views && <span>• {featuredNews.views} views</span>}
                        <span className="text-orange-400 font-semibold">Read Full Story →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* News Grid - Modern Cards with Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.slice(featuredNews ? 1 : 0).map((item, idx) => (
                  <React.Fragment key={item.id || idx}>
                    {/* Content Middle Ad - Show after 6th item */}
                    {idx === 5 && (
                      <div className="col-span-full py-2">
                        <AdBanner pageName="news" position="content-middle" />
                      </div>
                    )}
                    <Link
                      to={`/news/${item.slug || item.id}`}
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col"
                    >
                      {/* Card Image */}
                      <div className="relative h-48 overflow-hidden">
                        {item.featured_image ? (
                          <img 
                            src={item.featured_image} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                            <span className="text-6xl opacity-30">📰</span>
                          </div>
                        )}
                        {/* Category Badge */}
                        <span className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                          {item.category}
                        </span>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                          {item.summary || item.description || item.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-gray-500">
                            <span>{item.published_date || item.date}</span>
                            {item.views && <span>• {item.views} views</span>}
                          </div>
                          <span className="text-orange-600 font-semibold group-hover:translate-x-1 transition-transform">
                            Read →
                          </span>
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

      {/* Bottom Content (from admin) */}
      {settings?.bottom_content && (
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: settings.bottom_content }} />
          </div>
        </div>
      )}

      {/* FAQs Section */}
      {settings?.faqs && settings.faqs.length > 0 && (
        <div className="bg-gray-50 border-t">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {settings.faqs.map((faq, idx) => (
                <details key={idx} className="bg-white rounded-lg shadow-sm border">
                  <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-orange-600">
                    {faq.question}
                  </summary>
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
