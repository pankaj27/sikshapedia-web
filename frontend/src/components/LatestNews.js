import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiCalendar, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import api from '../api/axios';

const LatestNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // Use featured endpoint which prioritizes admin-selected news
      const response = await api.get('/news/featured?limit=4');
      setNewsItems(response.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStyle = (category) => {
    const styles = {
      'Exam Alert': { color: 'bg-red-100 text-red-700', icon: <FiBell /> },
      'Admission': { color: 'bg-blue-100 text-blue-700', icon: <FiCalendar /> },
      'Result': { color: 'bg-orange-100 text-orange-700', icon: <FiBell /> },
      'Trending': { color: 'bg-green-100 text-green-700', icon: <FiTrendingUp /> },
      'default': { color: 'bg-gray-100 text-gray-700', icon: <FiBookOpen /> }
    };
    return styles[category] || styles['default'];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 rounded-lg p-6 h-40"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) {
    return null; // Don't show section if no news
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest News & Alerts</h2>
            <p className="text-gray-600">Stay updated with admission alerts and exam notifications</p>
          </div>
          <Link 
            to="/news" 
            className="text-orange-600 hover:text-orange-700 font-semibold hidden md:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((news, idx) => {
            const categoryStyle = getCategoryStyle(news.category);
            return (
              <Link
                key={news.id || idx}
                to={`/news/${news.slug || news.id}`}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 block"
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${categoryStyle.color}`}>
                  {categoryStyle.icon}
                  {news.category || 'News'}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <FiCalendar size={14} />
                  {formatDate(news.published_at || news.created_at)}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link 
            to="/news"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            View All News →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
