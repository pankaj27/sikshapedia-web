import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from '../../components/CustomLink';
import { FiMessageSquare, FiFileText, FiDollarSign, FiUsers, FiTrendingUp, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import api from '../../api/axios';

// StatCard component moved outside to prevent re-renders
const StatCard = ({ title, value, subValue, icon: Icon, color, link }) => (
  <Link to={link} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {subValue && <p className="text-sm text-gray-400 mt-1">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('600', '100')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </Link>
);

const RewardsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/rewards/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  const StatCard = ({ title, value, subValue, icon: Icon, color, link }) => (
    <Link to={link} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subValue && <p className="text-sm text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </Link>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Rewards & Payments Dashboard</h1>
          <span className="text-sm text-gray-500">Points Rate: 100 points = ₹50</span>
        </div>

        {/* Action Required Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">⚡ Action Required</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/rewards/pending-reviews" className="bg-white/20 rounded-lg p-4 hover:bg-white/30 transition">
              <div className="flex items-center gap-3">
                <FiMessageSquare className="w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">{stats?.reviews?.pending || 0}</p>
                  <p className="text-sm opacity-90">Pending Reviews</p>
                </div>
              </div>
            </Link>
            <Link to="/admin/rewards/pending-answers" className="bg-white/20 rounded-lg p-4 hover:bg-white/30 transition">
              <div className="flex items-center gap-3">
                <FiFileText className="w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">{stats?.answers?.pending || 0}</p>
                  <p className="text-sm opacity-90">Pending Answers</p>
                </div>
              </div>
            </Link>
            <Link to="/admin/rewards/redemptions" className="bg-white/20 rounded-lg p-4 hover:bg-white/30 transition">
              <div className="flex items-center gap-3">
                <FiDollarSign className="w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">{stats?.redemptions?.pending || 0}</p>
                  <p className="text-sm opacity-90">Pending Redemptions</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Reviews Approved"
            value={stats?.reviews?.approved || 0}
            subValue={`${stats?.reviews?.rejected || 0} rejected`}
            icon={FiCheckCircle}
            color="text-green-600"
            link="/admin/rewards/pending-reviews"
          />
          <StatCard
            title="Total Answers Approved"
            value={stats?.answers?.approved || 0}
            icon={FiFileText}
            color="text-blue-600"
            link="/admin/rewards/pending-answers"
          />
          <StatCard
            title="Total Payouts"
            value={`₹${stats?.redemptions?.total_payouts?.toFixed(2) || '0.00'}`}
            subValue={`₹${stats?.redemptions?.pending_payout?.toFixed(2) || '0.00'} pending`}
            icon={FiDollarSign}
            color="text-purple-600"
            link="/admin/rewards/payments"
          />
          <StatCard
            title="Users with Points"
            value={stats?.users_with_points || 0}
            icon={FiUsers}
            color="text-orange-600"
            link="/admin/rewards/users-report"
          />
        </div>

        {/* Referrals Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Referral Program Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{stats?.referrals?.total || 0}</p>
              <p className="text-gray-500">Total Referrals</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{stats?.referrals?.successful || 0}</p>
              <p className="text-gray-500">Successful (First Review)</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">
                {(stats?.referrals?.total || 0) - (stats?.referrals?.successful || 0)}
              </p>
              <p className="text-gray-500">Pending Completion</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/rewards/pending-reviews" className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition">
              <FiClock className="w-5 h-5" />
              <span>Review Pending</span>
            </Link>
            <Link to="/admin/rewards/redemptions?status=pending" className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition">
              <FiDollarSign className="w-5 h-5" />
              <span>Process Payments</span>
            </Link>
            <Link to="/admin/rewards/users-report" className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
              <FiUsers className="w-5 h-5" />
              <span>User Points</span>
            </Link>
            <Link to="/admin/rewards/payments" className="flex items-center gap-2 px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition">
              <FiTrendingUp className="w-5 h-5" />
              <span>Payment History</span>
            </Link>
          </div>
        </div>

        {/* Points Configuration Info */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">📊 Points Configuration</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-700">Review (Base)</p>
              <p className="text-blue-600">50 points</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-700">Review (Detailed 200+ chars)</p>
              <p className="text-blue-600">+50 points</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-700">Review with Photos</p>
              <p className="text-blue-600">+30 points</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-700">Verified Student</p>
              <p className="text-blue-600">+50 points</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-700">Answer Approved</p>
              <p className="text-blue-600">10 points</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-700">Referral Success</p>
              <p className="text-blue-600">100 points</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-700">Min Redemption</p>
              <p className="text-blue-600">200 points</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-700">Conversion Rate</p>
              <p className="text-blue-600">100 pts = ₹50</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RewardsDashboard;
