import React, { useState, useEffect } from 'react';
import { Link } from '../../components/CustomLink';
import { FiGrid, FiUsers, FiBook, FiFileText, FiAward, FiBuilding, FiTrendingUp, FiEdit, FiEye, FiSchool, FiHome, FiBookOpen, FiSend, FiMessageCircle, FiPhone, FiDollarSign, FiSettings, FiImage } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_colleges: 0,
    total_schools: 0,
    total_universities: 0,
    total_users: 0,
    total_reviews: 0,
    total_exams: 0,
    total_courses: 0,
    total_news: 0,
    total_leads: 0,
    total_questions: 0,
    total_counselling: 0,
    total_sponsored_ads: 0,
    active_sponsored_ads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Colleges', value: stats.total_colleges, icon: FiHome, color: 'bg-blue-500', link: '/admin/colleges' },
    { title: 'Total Schools', value: stats.total_schools, icon: FiBookOpen, color: 'bg-green-500', link: '/admin/schools' },
    { title: 'Total Universities', value: stats.total_universities, icon: FiAward, color: 'bg-purple-500', link: '/admin/universities' },
    { title: 'Total Users', value: stats.total_users, icon: FiUsers, color: 'bg-orange-500', link: '/admin/users' },
    { title: 'Total Reviews', value: stats.total_reviews, icon: FiEdit, color: 'bg-pink-500', link: '/admin/reviews' },
    { title: 'Total Exams', value: stats.total_exams, icon: FiFileText, color: 'bg-indigo-500', link: '/admin/exams' },
    { title: 'Total Courses', value: stats.total_courses, icon: FiBook, color: 'bg-teal-500', link: '/admin/courses' },
    { title: 'News Articles', value: stats.total_news, icon: FiFileText, color: 'bg-red-500', link: '/admin/news' }
  ];

  const quickActions = [
    { title: 'Add New College', link: '/admin/colleges/new', icon: FiHome, color: 'bg-blue-500' },
    { title: 'Add New School', link: '/admin/schools/new', icon: FiBookOpen, color: 'bg-green-500' },
    { title: 'Add New University', link: '/admin/universities/new', icon: FiAward, color: 'bg-purple-500' },
    { title: 'Sponsored Ads', link: '/admin/sponsored-ads', icon: FiDollarSign, color: 'bg-amber-500' },
    { title: 'Ad Manager', link: '/admin/advertisements', icon: FiImage, color: 'bg-cyan-500' },
    { title: 'Publish News', link: '/admin/news/new', icon: FiFileText, color: 'bg-red-500' },
    { title: 'View Analytics', link: '/admin/analytics', icon: FiTrendingUp, color: 'bg-orange-500' }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Stats Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Link
                key={index}
                to={stat.link}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <FiEye className="text-gray-400" size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {loading ? '...' : stat.value.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-5 border border-gray-100 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <action.icon className="text-white" size={20} />
                  </div>
                  <span className="font-semibold text-gray-900">{action.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Frontend Widgets Management */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Frontend Widgets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Apply Now Widget Card */}
            <Link to="/admin/leads" className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiSend size={20} />
                </div>
                <span className="px-2 py-1 bg-green-400/20 text-green-100 text-xs rounded-full">Active</span>
              </div>
              <h3 className="font-bold">Apply Now</h3>
              <p className="text-xs text-white/80 mb-3">Quick admission form widget</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{stats.total_leads} Submissions</span>
              </div>
            </Link>

            {/* Ask Question Widget Card */}
            <Link to="/admin/questions" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiMessageCircle size={20} />
                </div>
                <span className="px-2 py-1 bg-green-400/20 text-green-100 text-xs rounded-full">Active</span>
              </div>
              <h3 className="font-bold">Ask Question</h3>
              <p className="text-xs text-white/80 mb-3">Q&A support widget</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{stats.total_questions} Questions</span>
              </div>
            </Link>

            {/* Counselling Widget Card */}
            <Link to="/admin/counselling" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiPhone size={20} />
                </div>
                <span className="px-2 py-1 bg-green-400/20 text-green-100 text-xs rounded-full">Active</span>
              </div>
              <h3 className="font-bold">Counselling</h3>
              <p className="text-xs text-white/80 mb-3">Free career guidance</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{stats.total_counselling} Requests</span>
              </div>
            </Link>

            {/* Sponsor Ads Widget Card */}
            <Link to="/admin/sponsored-ads" className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <HiOutlineSparkles size={20} className="text-yellow-400" />
                </div>
                <span className="px-2 py-1 bg-yellow-400/20 text-yellow-200 text-xs rounded-full">{stats.active_sponsored_ads} Active</span>
              </div>
              <h3 className="font-bold">Sponsor Ads</h3>
              <p className="text-xs text-white/80 mb-3">Sponsored advertisements</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{stats.total_sponsored_ads} Total Ads</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">System is running smoothly</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">All services operational</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">New Apply Now submission received</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Counselling request from Delhi</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
