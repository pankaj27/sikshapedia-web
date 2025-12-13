import React from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const LatestNews = () => {
  const newsItems = [
    {
      title: 'JEE Main 2024 Registration Started',
      date: 'Dec 10, 2024',
      category: 'Exam Alert',
      color: 'bg-red-100 text-red-700',
      icon: <FiBell />
    },
    {
      title: 'NEET 2024 Exam Dates Announced',
      date: 'Dec 8, 2024',
      category: 'Important Date',
      color: 'bg-blue-100 text-blue-700',
      icon: <FiCalendar />
    },
    {
      title: 'Top Engineering Colleges Released NIRF Rankings',
      date: 'Dec 5, 2024',
      category: 'Trending',
      color: 'bg-green-100 text-green-700',
      icon: <FiTrendingUp />
    },
    {
      title: 'CAT 2024 Results Out - Check Cutoffs',
      date: 'Dec 3, 2024',
      category: 'Result',
      color: 'bg-orange-100 text-orange-700',
      icon: <FiBell />
    }
  ];

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
          {newsItems.map((news, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${news.color}`}>
                {news.icon}
                {news.category}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                {news.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FiCalendar size={14} />
                {news.date}
              </p>
            </div>
          ))}
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
