import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiBook, FiFileText, FiAward, FiHome, FiTrendingUp, FiLogOut, FiEdit, FiEye, FiBookOpen } from 'react-icons/fi';
import api from '../../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_colleges: 0,
    total_schools: 0,
    total_universities: 0,
    total_users: 0,
    total_reviews: 0,
    total_exams: 0,
    total_courses: 0,
    total_news: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const statCards = [
    { title: 'Total Colleges', value: stats.total_colleges, icon: FiBuilding, color: 'bg-blue-500', link: '/admin/colleges' },
    { title: 'Total Schools', value: stats.total_schools, icon: FiSchool, color: 'bg-green-500', link: '/admin/schools' },
    { title: 'Total Universities', value: stats.total_universities, icon: FiAward, color: 'bg-purple-500', link: '/admin/universities' },
    { title: 'Total Users', value: stats.total_users, icon: FiUsers, color: 'bg-orange-500', link: '/admin/users' },
    { title: 'Total Reviews', value: stats.total_reviews, icon: FiEdit, color: 'bg-pink-500', link: '/admin/reviews' },
    { title: 'Total Exams', value: stats.total_exams, icon: FiFileText, color: 'bg-indigo-500', link: '/admin/exams' },
    { title: 'Total Courses', value: stats.total_courses, icon: FiBook, color: 'bg-teal-500', link: '/admin/courses' },
    { title: 'News Articles', value: stats.total_news, icon: FiFileText, color: 'bg-red-500', link: '/admin/news' }
  ];

  const quickActions = [
    { title: 'Add New College', link: '/admin/colleges/new', icon: FiBuilding, color: 'bg-blue-500' },
    { title: 'Add New School', link: '/admin/schools/new', icon: FiSchool, color: 'bg-green-500' },
    { title: 'Add New University', link: '/admin/universities/new', icon: FiAward, color: 'bg-purple-500' },
    { title: 'Publish News', link: '/admin/news/new', icon: FiFileText, color: 'bg-red-500' },
    { title: 'Manage Reviews', link: '/admin/reviews', icon: FiEdit, color: 'bg-pink-500' },
    { title: 'View Analytics', link: '/admin/analytics', icon: FiTrendingUp, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your platform content and settings</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
