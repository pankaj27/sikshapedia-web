import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiFileText, FiStar, FiBookmark, FiLogOut, FiUser, FiBarChart2, 
  FiTrash2, FiEdit, FiDollarSign, FiBell, FiClock, FiCheckCircle,
  FiXCircle, FiAlertCircle, FiCopy, FiUsers
} from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const EnhancedStudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_applications: 0,
    total_reviews: 0,
    saved_colleges: 0,
    total_earnings: 0,
    unread_notifications: 0,
    referral_code: '',
    referral_count: 0,
    application_status_breakdown: {},
    recent_applications: []
  });
  const [applications, setApplications] = useState([]);
  const [savedColleges, setSavedColleges] = useState([]);
  const [earnings, setEarnings] = useState({ transactions: [], total_earnings: 0 });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/signup');
      return;
    }
    setUser(JSON.parse(savedUser));
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    try {
      const [statsRes, appsRes, savedRes, earningsRes, notificationsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/applications/my'),
        api.get('/users/saved-colleges'),
        api.get('/earnings'),
        api.get('/notifications')
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
      setSavedColleges(savedRes.data);
      setEarnings(earningsRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleUnsaveCollege = async (collegeId) => {
    try {
      await api.delete(`/users/save-college/${collegeId}`);
      setSavedColleges(savedColleges.filter(c => c.id !== collegeId));
      setStats({...stats, saved_colleges: stats.saved_colleges - 1});
    } catch (error) {
      alert('Error removing college');
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(stats.referral_code);
    alert('Referral code copied!');
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? {...n, read: true} : n
      ));
      setStats({...stats, unread_notifications: stats.unread_notifications - 1});
    } catch (error) {
      console.error('Error marking notification as read');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      submitted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiClock, label: 'Submitted' },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiAlertCircle, label: 'Under Review' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle, label: 'Accepted' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle, label: 'Rejected' }
    };
    const badge = badges[status] || badges.submitted;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon size={14} /> {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'overview' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiBarChart2 /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'applications' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiFileText /> Applications 
                  <span className="ml-auto bg-orange-600 text-white text-xs px-2 py-1 rounded-full">{applications.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('earnings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'earnings' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiDollarSign /> Earnings
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'notifications' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiBell /> Notifications
                  {stats.unread_notifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{stats.unread_notifications}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'saved' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiBookmark /> Saved Colleges
                  <span className="ml-auto text-xs text-gray-500">{savedColleges.length}</span>
                </button>
                
                <div className="pt-4 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

                {/* Stats Cards Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600 text-sm">Applications</h3>
                      <FiFileText className="text-blue-600 text-2xl" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{stats.total_applications}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600 text-sm">Reviews</h3>
                      <FiStar className="text-yellow-500 text-2xl" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-500">{stats.total_reviews}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600 text-sm">Total Earnings</h3>
                      <FiDollarSign className="text-green-600 text-2xl" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">₹{stats.total_earnings}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600 text-sm">Referrals</h3>
                      <FiUsers className="text-purple-600 text-2xl" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{stats.referral_count}</p>
                  </div>
                </div>

                {/* Referral Code Card */}
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg shadow p-6 mb-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Your Referral Code</h3>
                      <p className="text-sm opacity-90 mb-3">Share with friends and earn ₹200 for each referral!</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-xl font-bold tracking-wider">
                          {stats.referral_code}
                        </code>
                        <button
                          onClick={copyReferralCode}
                          className="bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-opacity-90 transition flex items-center gap-2"
                        >
                          <FiCopy /> Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Status Breakdown */}
                {stats.application_status_breakdown && (
                  <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">Application Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{stats.application_status_breakdown.submitted || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Submitted</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{stats.application_status_breakdown.under_review || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Under Review</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{stats.application_status_breakdown.accepted || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Accepted</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{stats.application_status_breakdown.rejected || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Rejected</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Applications */}
                {stats.recent_applications && stats.recent_applications.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Recent Applications</h3>
                      <Button variant="outline" onClick={() => setActiveTab('applications')}>
                        View All
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {stats.recent_applications.slice(0, 3).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition">
                          <div className="flex-1">
                            <p className="font-semibold">{app.preferred_course}</p>
                            <p className="text-sm text-gray-600">Application #{app.application_number}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(app.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold">My Applications</h1>
                  <Link to="/colleges">
                    <Button className="bg-orange-600 hover:bg-orange-700">Apply to More Colleges</Button>
                  </Link>
                </div>

                {applications.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-4">Start applying to colleges to see your applications here</p>
                    <Link to="/colleges">
                      <Button className="bg-orange-600 hover:bg-orange-700">Browse Colleges</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{app.preferred_course}</h3>
                            <p className="text-gray-600">Application #{app.application_number}</p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Student Name</p>
                            <p className="font-semibold">{app.student_name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-semibold">{app.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-semibold">{app.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Applied On</p>
                            <p className="font-semibold">{new Date(app.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {app.message && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Message: {app.message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">Earnings & Rewards</h1>

                {/* Earnings Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                    <h3 className="text-lg mb-2">Total Earnings</h3>
                    <p className="text-4xl font-bold">₹{earnings.total_earnings || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
                    <h3 className="text-lg mb-2">Review Earnings</h3>
                    <p className="text-4xl font-bold">₹{earnings.review_earnings || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                    <h3 className="text-lg mb-2">Referral Earnings</h3>
                    <p className="text-4xl font-bold">₹{earnings.referral_earnings || 0}</p>
                  </div>
                </div>

                {/* Earning Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <FiStar className="text-yellow-500" /> How to Earn from Reviews?
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Write a review: ₹50</li>
                      <li>• Detailed review (200+ words): ₹100</li>
                      <li>• Verified review: +₹50 bonus</li>
                      <li>• Review with photos: +₹30 bonus</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <FiUsers className="text-purple-500" /> Referral Program
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Each successful referral: ₹200</li>
                      <li>• Friend gets: ₹100 signup bonus</li>
                      <li>• Your referral code: <strong>{stats.referral_code}</strong></li>
                      <li>• Total referrals: {stats.referral_count}</li>
                    </ul>
                  </div>
                </div>

                {/* Transactions History */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold mb-4">Transaction History</h3>
                  {earnings.transactions && earnings.transactions.length > 0 ? (
                    <div className="space-y-3">
                      {earnings.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'review' ? 'bg-yellow-100' : 'bg-purple-100'
                            }`}>
                              {transaction.type === 'review' ? 
                                <FiStar className="text-yellow-600" /> : 
                                <FiUsers className="text-purple-600" />
                              }
                            </div>
                            <div>
                              <p className="font-semibold">{transaction.description}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-xl font-bold text-green-600">+₹{transaction.amount}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiDollarSign className="text-6xl mx-auto mb-3 text-gray-300" />
                      <p>No earnings yet. Start writing reviews to earn!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">Notifications</h1>

                {notifications.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <FiBell className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notifications</h3>
                    <p className="text-gray-600">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition ${
                          !notification.read ? 'border-l-4 border-orange-600' : ''
                        }`}
                        onClick={() => !notification.read && markNotificationRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{notification.title}</h3>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(notification.created_at).toLocaleDateString()} at{' '}
                              {new Date(notification.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">Saved Colleges</h1>

                {savedColleges.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <FiBookmark className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Colleges</h3>
                    <p className="text-gray-600 mb-4">Start exploring and save colleges you're interested in</p>
                    <Link to="/colleges">
                      <Button className="bg-orange-600 hover:bg-orange-700">Browse Colleges</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedColleges.map((college) => (
                      <div key={college.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition">
                        <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">{college.name}</h3>
                          <p className="text-gray-600 mb-4">{college.location?.city}, {college.location?.state}</p>
                          <div className="flex items-center justify-between">
                            <Link to={`/colleges/${college.id}`}>
                              <Button variant="outline" size="sm">View Details</Button>
                            </Link>
                            <button
                              onClick={() => handleUnsaveCollege(college.id)}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStudentDashboard;
