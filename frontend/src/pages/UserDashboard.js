import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from '../components/CustomLink';
import { 
  FiUser, FiFileText, FiStar, FiBookmark, FiHeart, FiMessageSquare, 
  FiHelpCircle, FiGift, FiDollarSign, FiShare2, FiLogOut, FiBarChart2,
  FiEdit, FiCamera, FiCopy, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle,
  FiPlus, FiExternalLink, FiCreditCard, FiTrendingUp, FiArrowRight
} from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { getInstitutionDetailUrl } from '../utils/urlHelpers';

// Earnings Tab Component with Redemption
const EarningsTab = ({ dashboard, earnings, onRefresh }) => {
  const [pointsSummary, setPointsSummary] = useState(null);
  const [redemptions, setRedemptions] = useState([]);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // 'upi' or 'bank'
  const [userProfile, setUserProfile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, redemptionsRes, profileRes] = await Promise.all([
          api.get('/rewards/points-summary'),
          api.get('/rewards/redemptions'),
          api.get('/user/profile')
        ]);
        setPointsSummary(summaryRes.data);
        setRedemptions(redemptionsRes.data.redemptions || []);
        setUserProfile(profileRes.data);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRedeem = async () => {
    if (!redeemPoints || parseInt(redeemPoints) < 200) {
      alert('Minimum 200 points required for redemption');
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    // Validate payment details based on selected method
    const paymentDetails = userProfile?.payment_details || {};
    if (paymentMethod === 'upi' && !paymentDetails.upi_id) {
      alert('No UPI ID found in your profile. Please update your profile first.');
      return;
    }
    if (paymentMethod === 'bank' && (!paymentDetails.bank_name || !paymentDetails.account_number)) {
      alert('Bank details not found in your profile. Please update your profile first.');
      return;
    }

    setProcessing(true);
    try {
      await api.post('/rewards/redeem', {
        points: parseInt(redeemPoints),
        payment_method: paymentMethod,
        upi_id: paymentMethod === 'upi' ? paymentDetails.upi_id : null,
        bank_details: paymentMethod === 'bank' ? {
          bank_name: paymentDetails.bank_name,
          account_number: paymentDetails.account_number,
          ifsc_code: paymentDetails.ifsc_code,
          account_holder: paymentDetails.account_holder_name
        } : null
      });
      alert('Redemption request submitted! You will receive payment within 24-48 hours.');
      setShowRedeemModal(false);
      setRedeemPoints('');
      setPaymentMethod('');
      // Refresh data
      const [summaryRes, redemptionsRes] = await Promise.all([
        api.get('/rewards/points-summary'),
        api.get('/rewards/redemptions')
      ]);
      setPointsSummary(summaryRes.data);
      setRedemptions(redemptionsRes.data.redemptions || []);
      onRefresh();
    } catch (error) {
      alert(error.response?.data?.detail || 'Error submitting redemption request');
    } finally {
      setProcessing(false);
    }
  };

  const currentPoints = pointsSummary?.current_points || dashboard?.stats?.points || 0;
  const cashValue = currentPoints * 0.5;
  const canRedeem = currentPoints >= 200;
  
  // Get saved payment details
  const paymentDetails = userProfile?.payment_details || {};
  const hasUpi = !!paymentDetails.upi_id;
  const hasBank = !!(paymentDetails.bank_name && paymentDetails.account_number);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Earnings & Rewards</h2>
        <Button 
          onClick={() => setShowRedeemModal(true)}
          disabled={!canRedeem}
          className={`flex items-center gap-2 ${canRedeem ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`}
        >
          <FiCreditCard /> Redeem Points
        </Button>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Available Balance</p>
            <p className="text-4xl font-bold">{currentPoints} <span className="text-lg font-normal">points</span></p>
            <p className="text-lg opacity-90 mt-1">= ₹{cashValue.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Conversion Rate</p>
            <p className="font-semibold">100 pts = ₹50</p>
            <p className="text-sm opacity-75 mt-2">Min. redemption: 200 pts</p>
          </div>
        </div>
        {!canRedeem && (
          <div className="mt-4 bg-white/20 rounded-lg p-3 text-sm">
            💡 You need {200 - currentPoints} more points to redeem. Write reviews to earn more!
          </div>
        )}
      </div>

      {/* Points Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <FiStar className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-600">{pointsSummary?.breakdown?.from_reviews || 0}</p>
          <p className="text-sm text-gray-600">From Reviews</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <FiGift className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-600">{pointsSummary?.breakdown?.from_referrals || 0}</p>
          <p className="text-sm text-gray-600">From Referrals</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <FiMessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-600">{pointsSummary?.breakdown?.from_answers || 0}</p>
          <p className="text-sm text-gray-600">From Answers</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <FiTrendingUp className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-600">{pointsSummary?.breakdown?.redeemed || 0}</p>
          <p className="text-sm text-gray-600">Redeemed</p>
        </div>
      </div>

      {/* How to Earn */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold mb-4 text-lg">💰 How to Earn Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-yellow-600 mb-2 flex items-center gap-2">
              <FiStar /> Review Rewards
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center justify-between">
                <span>Write a review</span>
                <span className="font-semibold text-green-600">+50 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Detailed review (200+ chars)</span>
                <span className="font-semibold text-green-600">+50 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Verified student bonus</span>
                <span className="font-semibold text-green-600">+50 pts</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
              <FiGift /> Referral & Others
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center justify-between">
                <span>Successful referral</span>
                <span className="font-semibold text-green-600">+100 pts</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">
                Your referral code: <strong>{dashboard?.referral_code}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Redemption History */}
      {redemptions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold mb-4">Redemption History</h3>
          <div className="space-y-3">
            {redemptions.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    r.status === 'completed' ? 'bg-green-100' : 
                    r.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <FiCreditCard className={
                      r.status === 'completed' ? 'text-green-600' : 
                      r.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    } />
                  </div>
                  <div>
                    <p className="font-medium">{r.points} points → ₹{r.amount}</p>
                    <p className="text-sm text-gray-500">UPI: {r.upi_id}</p>
                    <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  r.status === 'completed' ? 'bg-green-100 text-green-700' : 
                  r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Points Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold mb-4">Recent Points Activity</h3>
        {pointsSummary?.recent_transactions?.length > 0 ? (
          <div className="space-y-3">
            {pointsSummary.recent_transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'review' ? 'bg-yellow-100' : 
                    tx.type === 'referral' ? 'bg-purple-100' :
                    tx.type === 'answer' ? 'bg-blue-100' :
                    tx.type === 'redemption' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {tx.type === 'review' && <FiStar className="text-yellow-600" />}
                    {tx.type === 'referral' && <FiGift className="text-purple-600" />}
                    {tx.type === 'answer' && <FiMessageSquare className="text-blue-600" />}
                    {tx.type === 'redemption' && <FiCreditCard className="text-red-600" />}
                    {!['review', 'referral', 'answer', 'redemption'].includes(tx.type) && <FiDollarSign className="text-gray-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${tx.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.points > 0 ? '+' : ''}{tx.points} pts
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No transactions yet. Start earning by writing reviews!</p>
        )}
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">💸 Redeem Points</h2>
            
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Available Points:</span>
                <span className="font-bold text-green-600">{currentPoints} pts</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-700">Cash Value:</span>
                <span className="font-bold text-green-600">₹{cashValue.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Points Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points to Redeem *
                </label>
                <input
                  type="number"
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(e.target.value)}
                  min="200"
                  max={currentPoints}
                  placeholder="Minimum 200 points"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {redeemPoints && (
                  <p className="text-sm text-green-600 mt-1">
                    You will receive: ₹{(parseInt(redeemPoints || 0) * 0.5).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Payment Method Selection */}
              {redeemPoints && parseInt(redeemPoints) >= 200 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Payment Method *
                  </label>
                  <div className="space-y-2">
                    {/* UPI Option */}
                    <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                      paymentMethod === 'upi' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    } ${!hasUpi ? 'opacity-50' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={!hasUpi}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">UPI</span>
                          {!hasUpi && <span className="text-xs text-red-500">(Not saved)</span>}
                        </div>
                        {hasUpi ? (
                          <p className="text-sm text-gray-600 mt-1">
                            UPI ID: <span className="font-medium">{paymentDetails.upi_id}</span>
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">
                            Add UPI ID in your profile to use this option
                          </p>
                        )}
                      </div>
                    </label>

                    {/* Bank Option */}
                    <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                      paymentMethod === 'bank' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    } ${!hasBank ? 'opacity-50' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={!hasBank}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Bank Transfer</span>
                          {!hasBank && <span className="text-xs text-red-500">(Not saved)</span>}
                        </div>
                        {hasBank ? (
                          <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                            <p>Bank: <span className="font-medium">{paymentDetails.bank_name}</span></p>
                            <p>A/C: <span className="font-medium">****{paymentDetails.account_number?.slice(-4)}</span></p>
                            <p>IFSC: <span className="font-medium">{paymentDetails.ifsc_code}</span></p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">
                            Add bank details in your profile to use this option
                          </p>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Link to update profile */}
                  {(!hasUpi || !hasBank) && (
                    <p className="text-xs text-blue-600 mt-2">
                      <Link to="/profile/edit" className="hover:underline">
                        → Update payment details in Profile
                      </Link>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowRedeemModal(false);
                  setPaymentMethod('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleRedeem}
                disabled={processing || !redeemPoints || parseInt(redeemPoints) < 200 || !paymentMethod}
              >
                {processing ? 'Processing...' : 'Confirm Redemption'}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Payment will be processed within 24-48 hours
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Tab-specific data
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
      // Only logout if the error message indicates invalid/expired token
      const errorMsg = error.response?.data?.detail || '';
      if (error.response?.status === 401 && 
          (errorMsg.includes('expired') || errorMsg.includes('Invalid') || errorMsg.includes('Not authenticated'))) {
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
              <img loading="lazy" src="/favicon.png" alt="admissionbuddy" className="h-8" />
              <span className="font-bold text-lg text-gray-900 hidden sm:block">admissionbuddy</span>
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
                  { id: 'reviews', icon: FiStar, label: 'My Reviews', count: dashboard?.stats?.reviews },
                  { id: 'questions', icon: FiHelpCircle, label: 'My Questions', count: dashboard?.stats?.questions },
                  { id: 'comments', icon: FiMessageSquare, label: 'My Comments', count: dashboard?.stats?.comments },
                  { id: 'favorites', icon: FiBookmark, label: 'Favorite Institutes', count: dashboard?.stats?.favorites },
                  { id: 'liked', icon: FiHeart, label: 'Liked Institutes', count: dashboard?.stats?.liked_colleges },
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
                      <span className="text-gray-600 text-sm">Admissions</span>
                      <FiCheckCircle className="text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{dashboard?.stats?.admissions || 0}</p>
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
                      <p className="text-sm opacity-90 mb-3">Share with friends and earn 100 points for each referral!</p>
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
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">My Reviews</h2>
                  <Link to="/write-review">
                    <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
                      <FiPlus /> Write Review
                    </Button>
                  </Link>
                </div>
                
                {reviews.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiStar className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600 mb-4">Write reviews to earn points and help other students</p>
                    <Link to="/write-review">
                      <Button className="bg-orange-600 hover:bg-orange-700">Write Your First Review</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => {
                      // Determine status styling
                      const statusConfig = {
                        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pending Review' },
                        approved: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Approved' },
                        rejected: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Rejected' },
                      };
                      const status = statusConfig[review.status] || statusConfig.pending;
                      
                      // Use the standard URL helper for consistent link generation
                      const instType = (review.institution_type || review.institute_type || 'college').toLowerCase();
                      const instituteLink = getInstitutionDetailUrl(
                        instType,
                        review.college_id || review.entity_id,
                        review.college_name || review.entity_name || 'Institute',
                        null,
                        review.serial_number
                      );
                      
                      return (
                        <div key={review.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${
                          review.status === 'approved' ? 'border-green-500' : 
                          review.status === 'rejected' ? 'border-red-500' : 
                          'border-yellow-500'
                        }`}>
                          <div className="p-6">
                            {/* Header with Status */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Link to={instituteLink} className="font-bold text-lg text-blue-600 hover:underline">
                                    {review.college_name || review.entity_name || 'Institute'}
                                  </Link>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                                    {status.label}
                                  </span>
                                </div>
                                {review.course && (
                                  <p className="text-sm text-gray-600 mb-2">Course: {review.course}</p>
                                )}
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <FiStar 
                                      key={i} 
                                      className={`${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                      size={18}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-600 ml-2 font-medium">{review.rating}/5</span>
                                </div>
                              </div>
                              {review.status === 'approved' && (
                                <div className="text-right">
                                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                                    +{review.points_earned || 50} pts
                                  </span>
                                  <p className="text-xs text-green-600 mt-1">Points Earned!</p>
                                </div>
                              )}
                              {review.status === 'pending' && (
                                <div className="text-right">
                                  <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                                    ~{review.points_earned || 50} pts
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">Pending approval</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Review Title */}
                            {review.review_title && (
                              <h4 className="font-semibold text-gray-800 mb-2">&quot;{review.review_title}&quot;</h4>
                            )}
                            
                            {/* Pros & Cons */}
                            {(review.pros || review.cons) && (
                              <div className="grid md:grid-cols-2 gap-4 mb-3">
                                {review.pros && (
                                  <div className="bg-green-50 rounded-lg p-3">
                                    <p className="text-sm font-semibold text-green-700 mb-1">👍 Pros</p>
                                    <p className="text-sm text-gray-700">{review.pros}</p>
                                  </div>
                                )}
                                {review.cons && (
                                  <div className="bg-red-50 rounded-lg p-3">
                                    <p className="text-sm font-semibold text-red-700 mb-1">👎 Cons</p>
                                    <p className="text-sm text-gray-700">{review.cons}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Review Text */}
                            {review.review_text && (
                              <p className="text-gray-700 mb-3">{review.review_text}</p>
                            )}
                            
                            {/* Rejection Reason */}
                            {review.status === 'rejected' && review.rejection_reason && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                <p className="text-sm font-semibold text-red-700 mb-1">Rejection Reason:</p>
                                <p className="text-sm text-red-600">{review.rejection_reason}</p>
                              </div>
                            )}
                            
                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t">
                              <p className="text-xs text-gray-500">
                                Submitted on {new Date(review.created_at).toLocaleDateString('en-IN', { 
                                  day: 'numeric', month: 'short', year: 'numeric' 
                                })}
                              </p>
                              {review.is_verified_student && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                                  <FiCheckCircle size={12} /> Verified Student
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Favorite Institutes</h2>
                
                {favorites.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiBookmark className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Favorite Institutes Yet</h3>
                    <p className="text-gray-600 mb-4">Save institutes you&apos;re interested in</p>
                    <Link to="/colleges">
                      <Button className="bg-orange-600 hover:bg-orange-700">Browse Institutes</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((fav) => {
                      // Use the standard URL helper for consistent link generation
                      const instType = (fav.college?.institution_type || 'college').toLowerCase();
                      const instituteLink = getInstitutionDetailUrl(
                        instType,
                        fav.college_id,
                        fav.college_name || fav.college?.name || 'Institute',
                        fav.college?.location?.city,
                        fav.college?.serial_number
                      );
                      
                      return (
                        <div key={fav.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                          <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                            {fav.college?.logo_url ? (
                              <img loading="lazy" src={fav.college.logo_url} alt="" className="w-12 h-12 object-contain" />
                            ) : (
                              <FiBookmark className="text-orange-600 text-2xl" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Link to={instituteLink} className="font-semibold text-gray-900 hover:text-blue-600 hover:underline">
                              {fav.college_name}
                            </Link>
                            <p className="text-sm text-gray-600">{fav.college?.location?.city}</p>
                          </div>
                          <Link to={instituteLink}>
                            <Button variant="ghost" size="sm">
                              <FiExternalLink />
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <EarningsTab 
                dashboard={dashboard} 
                earnings={earnings} 
                onRefresh={() => fetchTabData('earnings')} 
              />
            )}
            
            {/* Share Tab */}
            {activeTab === 'share' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Share & Earn</h2>
                
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-8 text-white text-center">
                  <FiGift className="text-5xl mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Invite Friends & Earn 100 Points</h3>
                  <p className="opacity-90 mb-6">Share your referral link and earn 100 points for each friend who signs up!</p>
                  
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
                    {questions.map((q) => {
                      // Generate institute link using the helper
                      const instType = (q.institution_type || 'college').toLowerCase();
                      const instituteLink = q.serial_number && q.college_name 
                        ? getInstitutionDetailUrl(instType, q.college_id, q.college_name, null, q.serial_number)
                        : '#';
                      
                      return (
                        <div key={q.id} className="bg-white rounded-xl shadow-sm p-6">
                          {/* Institute Name */}
                          {q.college_name && (
                            <Link to={instituteLink} className="text-sm text-blue-600 hover:underline font-medium mb-2 block">
                              {q.college_name}
                            </Link>
                          )}
                          <h3 className="font-bold">{q.title}</h3>
                          <p className="text-gray-600 mt-2">{q.question}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span>{q.answers_count || 0} answers</span>
                            <span>{new Date(q.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
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
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            {c.entity_name && (
                              <Link to={c.entity_link || '#'} className="text-sm text-blue-600 hover:underline font-medium">
                                {c.entity_name}
                              </Link>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(c.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-800 mt-2">{c.comment || c.content || c.text || 'No comment text'}</p>
                        {c.entity_type && (
                          <p className="text-xs text-gray-400 mt-2 capitalize">
                            Comment on {c.entity_type}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Liked Tab */}
            {activeTab === 'liked' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Liked Institutes</h2>
                {liked.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Liked Institutes</h3>
                    <p className="text-gray-600">Like institutes you&apos;re interested in</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liked.map((item) => {
                      // Generate institute link using the helper
                      const instType = (item.college?.institution_type || 'college').toLowerCase();
                      const instituteLink = getInstitutionDetailUrl(
                        instType,
                        item.entity_id,
                        item.college?.name || 'Institute',
                        item.college?.location?.city,
                        item.college?.serial_number
                      );
                      
                      return (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                            <FiHeart className="text-red-500 text-2xl" />
                          </div>
                          <div className="flex-1">
                            <Link to={instituteLink} className="font-semibold text-gray-900 hover:text-blue-600 hover:underline">
                              {item.college?.name || 'College'}
                            </Link>
                            <p className="text-sm text-gray-600">{item.college?.location?.city}</p>
                          </div>
                          <Link to={instituteLink}>
                            <Button variant="ghost" size="sm">
                              <FiExternalLink />
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
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
                        <span className="text-green-600 font-bold">+{ref.points_earned || 100} pts</span>
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
