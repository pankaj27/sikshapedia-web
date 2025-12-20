import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from '../components/CustomLink';
import { 
  FiUser, FiFileText, FiStar, FiBookmark, FiHeart, FiMessageSquare, 
  FiHelpCircle, FiGift, FiDollarSign, FiShare2, FiLogOut, FiBarChart2,
  FiEdit, FiCamera, FiCopy, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle,
  FiPlus, FiExternalLink
} from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Tab-specific data
  const [applications, setApplications] = useState([]);
  const [admissionBookings, setAdmissionBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [comments, setComments] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [liked, setLiked] = useState([]);
  const [referrals, setReferrals] = useState({ referrals: [], total_referrals: 0 });
  const [earnings, setEarnings] = useState({ transactions: [], total_earnings: 0 });
  const [shareLink, setShareLink] = useState(null);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/signup');
      return;
    }
    setUser(JSON.parse(savedUser));
    fetchDashboard();
  }, [navigate]);
  
  const fetchDashboard = async () => {
    try {
      const response = await api.get('/user/dashboard');
      setDashboard(response.data);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signup');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTabData = async (tab) => {
    try {
      switch (tab) {
        case 'applications':
          const appsRes = await api.get('/user/applications');
          setApplications(appsRes.data);
          break;
        case 'admissions':
          const admissionsRes = await api.get('/admission/my-bookings');
          setAdmissionBookings(admissionsRes.data.bookings || []);
          break;
        case 'reviews':
          const reviewsRes = await api.get('/user/reviews');
          setReviews(reviewsRes.data);
          break;
        case 'questions':
          const questionsRes = await api.get('/user/questions');
          setQuestions(questionsRes.data);
          break;
        case 'comments':
          const commentsRes = await api.get('/user/comments');
          setComments(commentsRes.data);
          break;
        case 'favorites':
          const favsRes = await api.get('/user/favorites');
          setFavorites(favsRes.data);
          break;
        case 'liked':
          const likedRes = await api.get('/user/liked');
          setLiked(likedRes.data);
          break;
        case 'referrals':
          const refsRes = await api.get('/user/referrals');
          setReferrals(refsRes.data);
          break;
        case 'earnings':
          const earningsRes = await api.get('/user/earnings');
          setEarnings(earningsRes.data);
          break;
        case 'share':
          const shareRes = await api.get('/user/share-link');
          setShareLink(shareRes.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${tab}:`, error);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchTabData(tab);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  
  const copyReferralCode = () => {
    navigator.clipboard.writeText(dashboard?.referral_code || '');
    alert('Referral code copied!');
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="Admission Buddy" className="h-8" />
              <span className="font-bold text-lg text-gray-900 hidden sm:block">Admission Buddy</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm hidden sm:block">Welcome, {user?.name?.split(' ')[0]}</span>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                <FiLogOut size={18} /> <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
              {/* Profile Section */}
              <div className="text-center pb-4 border-b mb-4">
                <div className="relative inline-block">
                  {user?.profile_photo_url ? (
                    <img 
                      src={user.profile_photo_url} 
                      alt={user.name} 
                      className="w-20 h-20 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <Link 
                    to="/profile/edit" 
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50"
                  >
                    <FiCamera size={14} className="text-gray-600" />
                  </Link>
                </div>
                <h3 className="font-bold text-lg mt-3">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {dashboard?.stats?.points || 0} Points
                  </span>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="space-y-1">
                {[
                  { id: 'overview', icon: FiBarChart2, label: 'Overview' },
                  { id: 'profile', icon: FiUser, label: 'My Profile' },
                  { id: 'admissions', icon: FiCheckCircle, label: 'Admission Bookings', highlight: true },
                  { id: 'applications', icon: FiFileText, label: 'Applications', count: dashboard?.stats?.applications },
                  { id: 'reviews', icon: FiStar, label: 'My Reviews', count: dashboard?.stats?.reviews },
                  { id: 'questions', icon: FiHelpCircle, label: 'My Questions', count: dashboard?.stats?.questions },
                  { id: 'comments', icon: FiMessageSquare, label: 'My Comments', count: dashboard?.stats?.comments },
                  { id: 'favorites', icon: FiBookmark, label: 'Favorites', count: dashboard?.stats?.favorites },
                  { id: 'liked', icon: FiHeart, label: 'Liked Colleges', count: dashboard?.stats?.liked_colleges },
                  { id: 'referrals', icon: FiGift, label: 'Referrals', count: dashboard?.stats?.referrals },
                  { id: 'earnings', icon: FiDollarSign, label: 'Earnings' },
                  { id: 'share', icon: FiShare2, label: 'Share & Earn' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-sm ${
                      activeTab === item.id 
                        ? 'bg-orange-50 text-orange-600 font-semibold' 
                        : item.highlight ? 'text-green-700 hover:bg-green-50 bg-green-50/50' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon size={18} /> {item.label}
                    </span>
                    {item.count > 0 && (
                      <span className="px-2 py-0.5 bg-orange-600 text-white text-xs rounded-full">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Applications</span>
                      <FiFileText className="text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{dashboard?.stats?.applications || 0}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Reviews</span>
                      <FiStar className="text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-500">{dashboard?.stats?.reviews || 0}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Points</span>
                      <FiDollarSign className="text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{dashboard?.stats?.points || 0}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Referrals</span>
                      <FiGift className="text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{dashboard?.stats?.referrals || 0}</p>
                  </div>
                </div>
                
                {/* Referral Card */}
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Your Referral Code</h3>
                      <p className="text-sm opacity-90 mb-3">Share with friends and earn ₹200 for each referral!</p>
                      <div className="flex items-center gap-3">
                        <code className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-xl font-bold tracking-wider">
                          {dashboard?.referral_code || 'LOADING...'}
                        </code>
                        <button
                          onClick={copyReferralCode}
                          className="bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-opacity-90 transition flex items-center gap-2 font-medium"
                        >
                          <FiCopy /> Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Application Status */}
                {dashboard?.application_status_breakdown && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4">Application Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(dashboard.application_status_breakdown).map(([status, count]) => (
                        <div key={status} className={`text-center p-4 rounded-lg ${
                          status === 'submitted' ? 'bg-blue-50' :
                          status === 'under_review' ? 'bg-yellow-50' :
                          status === 'accepted' ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <p className={`text-2xl font-bold ${
                            status === 'submitted' ? 'text-blue-600' :
                            status === 'under_review' ? 'text-yellow-600' :
                            status === 'accepted' ? 'text-green-600' : 'text-red-600'
                          }`}>{count}</p>
                          <p className="text-sm text-gray-600 mt-1 capitalize">{status.replace('_', ' ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Recent Applications */}
                {dashboard?.recent_applications?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Recent Applications</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleTabChange('applications')}>
                        View All →
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {dashboard.recent_applications.slice(0, 3).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition">
                          <div>
                            <p className="font-semibold">{app.college_name}</p>
                            <p className="text-sm text-gray-600">{app.course}</p>
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
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">My Profile</h2>
                  <Link to="/profile/edit">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <FiEdit /> Edit Profile
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <p className="font-medium mt-1">{user?.name || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium mt-1">{user?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-medium mt-1">{user?.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">City</label>
                    <p className="font-medium mt-1">{user?.city || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Course Interested</label>
                    <p className="font-medium mt-1">{user?.course || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Member Since</label>
                    <p className="font-medium mt-1">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">My Applications</h2>
                  <Link to="/colleges">
                    <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
                      <FiPlus /> Apply to College
                    </Button>
                  </Link>
                </div>
                
                {applications.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-4">Start applying to colleges to track your applications here</p>
                    <Link to="/colleges">
                      <Button className="bg-orange-600 hover:bg-orange-700">Browse Colleges</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold">{app.college_name}</h3>
                            <p className="text-gray-600">{app.course}</p>
                            <p className="text-sm text-gray-500">Application #{app.application_number}</p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Student Name</p>
                            <p className="font-medium">{app.student_name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-medium">{app.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">City</p>
                            <p className="font-medium">{app.city}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Applied On</p>
                            <p className="font-medium">{new Date(app.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">My Reviews</h2>
                </div>
                
                {reviews.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiStar className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600 mb-4">Write reviews to earn points and help other students</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold">{review.college_name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <FiStar 
                                  key={i} 
                                  className={i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            +{review.points_earned} pts
                          </span>
                        </div>
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-gray-600 text-sm">{review.review}</p>
                        <p className="text-xs text-gray-500 mt-3">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Favorite Colleges</h2>
                
                {favorites.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiBookmark className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Favorites Yet</h3>
                    <p className="text-gray-600 mb-4">Save colleges you&apos;re interested in</p>
                    <Link to="/colleges">
                      <Button className="bg-orange-600 hover:bg-orange-700">Browse Colleges</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                          {fav.college?.logo_url ? (
                            <img src={fav.college.logo_url} alt="" className="w-12 h-12 object-contain" />
                          ) : (
                            <FiBookmark className="text-orange-600 text-2xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{fav.college_name}</h3>
                          <p className="text-sm text-gray-600">{fav.college?.location?.city}</p>
                        </div>
                        <Link to={`/colleges/${fav.college_id}`}>
                          <Button variant="ghost" size="sm">
                            <FiExternalLink />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Earnings & Rewards</h2>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <h3 className="text-sm opacity-90 mb-1">Total Points</h3>
                    <p className="text-3xl font-bold">{earnings.total_points || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                    <h3 className="text-sm opacity-90 mb-1">Review Earnings</h3>
                    <p className="text-3xl font-bold">₹{earnings.review_earnings || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <h3 className="text-sm opacity-90 mb-1">Referral Earnings</h3>
                    <p className="text-3xl font-bold">₹{earnings.referral_earnings || 0}</p>
                  </div>
                </div>
                
                {/* How to Earn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <FiStar className="text-yellow-500" /> Review Rewards
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Write a review: ₹50</li>
                      <li>• Detailed review (200+ words): ₹100</li>
                      <li>• Verified student: +₹50 bonus</li>
                      <li>• Include photos: +₹30 bonus</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <FiGift className="text-purple-500" /> Referral Rewards
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Each successful referral: ₹200</li>
                      <li>• Your friend gets: ₹100</li>
                      <li>• Your code: <strong>{dashboard?.referral_code}</strong></li>
                    </ul>
                  </div>
                </div>
                
                {/* Transactions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold mb-4">Transaction History</h3>
                  {earnings.transactions?.length > 0 ? (
                    <div className="space-y-3">
                      {earnings.transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === 'review' ? 'bg-yellow-100' : 'bg-purple-100'
                            }`}>
                              {tx.type === 'review' ? 
                                <FiStar className="text-yellow-600" /> : 
                                <FiGift className="text-purple-600" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">{tx.description}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(tx.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-green-600">+₹{tx.amount}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No transactions yet</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Share Tab */}
            {activeTab === 'share' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Share & Earn</h2>
                
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-8 text-white text-center">
                  <FiGift className="text-5xl mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Invite Friends & Earn ₹200</h3>
                  <p className="opacity-90 mb-6">Share your referral link and earn ₹200 for each friend who signs up!</p>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                    <p className="text-sm opacity-75 mb-2">Your Referral Code</p>
                    <code className="text-2xl font-bold tracking-wider">{dashboard?.referral_code}</code>
                  </div>
                  
                  {shareLink && (
                    <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-6">
                      <p className="text-sm opacity-75 mb-2">Share Link</p>
                      <div className="flex items-center gap-2 justify-center">
                        <code className="text-sm bg-white bg-opacity-20 px-3 py-2 rounded">{shareLink.share_link}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shareLink.share_link);
                            alert('Link copied!');
                          }}
                          className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center gap-4">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(shareLink?.share_message || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-medium transition"
                    >
                      Share on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* Questions Tab */}
            {activeTab === 'questions' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">My Questions</h2>
                {questions.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiHelpCircle className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Questions Yet</h3>
                    <p className="text-gray-600">Ask questions about colleges to get answers</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((q) => (
                      <div key={q.id} className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-bold">{q.title}</h3>
                        <p className="text-gray-600 mt-2">{q.question}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>{q.answers_count} answers</span>
                          <span>{new Date(q.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">My Comments</h2>
                {comments.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiMessageSquare className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Comments Yet</h3>
                    <p className="text-gray-600">Engage with reviews and questions by commenting</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((c) => (
                      <div key={c.id} className="bg-white rounded-xl shadow-sm p-6">
                        <p className="text-gray-700">{c.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Liked Tab */}
            {activeTab === 'liked' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Liked Colleges</h2>
                {liked.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Liked Colleges</h3>
                    <p className="text-gray-600">Like colleges you&apos;re interested in</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liked.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                          <FiHeart className="text-red-500 text-2xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.college?.name || 'College'}</h3>
                          <p className="text-sm text-gray-600">{item.college?.location?.city}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Admission Bookings Tab */}
            {activeTab === 'admissions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">My Admission Applications</h2>
                  <Link to="/admission/colleges">
                    <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                      <FiPlus /> Book New Admission
                    </Button>
                  </Link>
                </div>
                
                {admissionBookings.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiCheckCircle className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Admission Bookings Yet</h3>
                    <p className="text-gray-600 mb-4">Book your seat at admission partner institutions</p>
                    <Link to="/admission/colleges">
                      <Button className="bg-green-600 hover:bg-green-700">Browse Admission Partners</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {admissionBookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold">{booking.institution_name}</h3>
                            <p className="text-gray-600">{booking.course_or_class}</p>
                            <p className="text-sm text-gray-500">Application #{booking.id?.slice(0, 12)}</p>
                          </div>
                          {(() => {
                            const statusConfig = {
                              pending_payment: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock, label: 'Pending Payment' },
                              submitted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiClock, label: 'Submitted' },
                              approved: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle, label: 'Approved' },
                              rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle, label: 'Rejected' }
                            };
                            const config = statusConfig[booking.status] || statusConfig.submitted;
                            const Icon = config.icon;
                            return (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                                <Icon size={14} /> {config.label}
                              </span>
                            );
                          })()}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600">Student Name</p>
                            <p className="font-medium">{booking.student_name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Mobile</p>
                            <p className="font-medium">{booking.mobile}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Amount Paid</p>
                            <p className="font-medium text-green-600">₹{booking.total_amount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Applied On</p>
                            <p className="font-medium">{new Date(booking.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        {/* Payment Status */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-600">Payment:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.payment_status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.payment_status === 'completed' ? '✓ Paid' : 'Pending'}
                          </span>
                        </div>
                        
                        {/* Institution Comments */}
                        {booking.institution_comments && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm font-medium text-blue-800 mb-1">Institution Comments:</p>
                            <p className="text-sm text-blue-700">{booking.institution_comments}</p>
                          </div>
                        )}
                        
                        {/* Status History */}
                        {booking.status_history && booking.status_history.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium text-gray-700 mb-2">Status History:</p>
                            <div className="space-y-1">
                              {booking.status_history.slice(-3).map((history, index) => (
                                <div key={index} className="text-xs text-gray-500 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                  <span className="capitalize">{history.status.replace('_', ' ')}</span>
                                  <span>-</span>
                                  <span>{new Date(history.timestamp).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Referrals Tab */}
            {activeTab === 'referrals' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">My Referrals</h2>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-600">Total Referrals</p>
                      <p className="text-3xl font-bold text-purple-600">{referrals.total_referrals}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Your Code</p>
                      <code className="text-xl font-bold">{referrals.referral_code}</code>
                    </div>
                  </div>
                </div>
                
                {referrals.referrals?.length > 0 ? (
                  <div className="space-y-3">
                    {referrals.referrals.map((ref) => (
                      <div key={ref.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{ref.referred_user_name}</p>
                          <p className="text-sm text-gray-600">{ref.referred_user_email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(ref.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-green-600 font-bold">+₹{ref.points_earned}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiGift className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Referrals Yet</h3>
                    <p className="text-gray-600">Share your code to start earning</p>
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

export default UserDashboard;
