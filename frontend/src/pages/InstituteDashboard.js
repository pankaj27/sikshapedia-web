import React, { useState, useEffect } from 'react';
import { Link } from '../components/CustomLink';
import { 
  FiUsers, FiFileText, FiBarChart2, FiTrendingUp, FiLogOut,
  FiCheckCircle, FiClock, FiXCircle, FiAlertCircle, FiFilter,
  FiPhone, FiMail, FiMapPin, FiEye, FiSearch, FiDollarSign, FiEdit2,
  FiStar, FiLink, FiShare2
} from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import ReviewQRGenerator from '../components/ReviewQRGenerator';

const InstituteDashboard = () => {
  const [institution, setInstitution] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Tab data
  const [leads, setLeads] = useState([]);
  const [applications, setApplications] = useState([]);
  const [adAnalytics, setAdAnalytics] = useState(null);
  const [admissionBookings, setAdmissionBookings] = useState([]);
  const [selectedAdmissionBooking, setSelectedAdmissionBooking] = useState(null);
  const [admissionComment, setAdmissionComment] = useState('');
  const [reviewLink, setReviewLink] = useState(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  
  // Reviews, Questions & Comments data
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answerText, setAnswerText] = useState({});
  const [submittingAnswer, setSubmittingAnswer] = useState(null);
  
  // Filters
  const [leadSourceFilter, setLeadSourceFilter] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const savedInstitute = localStorage.getItem('institute');
    if (!savedInstitute) {
      // Use window.location for navigation (React Router v7 workaround)
      window.location.href = '/institute/login';
      return;
    }
    setInstitution(JSON.parse(savedInstitute));
    fetchDashboard();
  }, []);
  
  const fetchDashboard = async () => {
    try {
      const response = await api.get('/institute/dashboard');
      setDashboard(response.data);
      setInstitution(response.data.institution);
      localStorage.setItem('institute', JSON.stringify(response.data.institution));
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('institute_token');
        localStorage.removeItem('institute');
        // Use window.location for navigation (React Router v7 workaround)
        window.location.href = '/institute/login';
      }
    } finally {
      setLoading(false);
    }
  };
  
  const fetchLeads = async () => {
    try {
      let url = '/institute/leads';
      const params = [];
      if (leadSourceFilter) params.push(`source=${leadSourceFilter}`);
      if (leadStatusFilter) params.push(`status=${leadStatusFilter}`);
      if (params.length) url += '?' + params.join('&');
      
      const response = await api.get(url);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };
  
  const fetchApplications = async () => {
    try {
      let url = '/institute/applications';
      if (appStatusFilter) url += `?status=${appStatusFilter}`;
      
      const response = await api.get(url);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };
  
  const fetchAdAnalytics = async () => {
    try {
      const response = await api.get('/institute/ad-analytics');
      setAdAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'leads') fetchLeads();
    if (tab === 'applications') fetchApplications();
    if (tab === 'analytics') fetchAdAnalytics();
    if (tab === 'admission_bookings') fetchAdmissionBookings();
  };
  
  const fetchAdmissionBookings = async () => {
    try {
      const response = await api.get('/admission/institution-bookings');
      setAdmissionBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching admission bookings:', error);
    }
  };
  
  const handleAdmissionStatusUpdate = async (bookingId, status) => {
    try {
      await api.put(`/admission/booking/${bookingId}/status`, {
        status,
        comments: admissionComment || `Application ${status} by institution`
      });
      setAdmissionComment('');
      setSelectedAdmissionBooking(null);
      fetchAdmissionBookings();
      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status');
    }
  };
  
  useEffect(() => {
    if (activeTab === 'leads') fetchLeads();
  }, [leadSourceFilter, leadStatusFilter]);
  
  useEffect(() => {
    if (activeTab === 'applications') fetchApplications();
  }, [appStatusFilter]);
  
  useEffect(() => {
    if (activeTab === 'review_link' && institution?.id) fetchReviewLink();
  }, [activeTab, institution?.id]);
  
  const fetchReviewLink = async () => {
    try {
      const res = await api.get(`/institute/review-link/${institution.id}`);
      if (res.data.has_link) {
        setReviewLink(res.data);
      }
    } catch (err) {
      console.error('Error fetching review link:', err);
    }
  };
  
  const generateReviewLink = async () => {
    setGeneratingLink(true);
    try {
      const res = await api.post('/institute/review-link', {
        institute_id: institution.id,
        institute_type: institution.type || 'college'
      });
      setReviewLink({
        has_link: true,
        link_code: res.data.link_code,
        views: 0,
        submissions: 0
      });
    } catch (err) {
      alert('Failed to generate review link');
    } finally {
      setGeneratingLink(false);
    }
  };
  
  const fetchReviewsAndQuestions = async () => {
    if (!institution?.id) return;
    try {
      const [reviewsRes, statsRes, questionsRes] = await Promise.all([
        api.get(`/reviews/college/${institution.id}?limit=50`),
        api.get(`/reviews/stats/${institution.id}`),
        api.get(`/questions/college/${institution.id}?limit=50`)
      ]);
      setReviews(reviewsRes.data);
      setReviewStats(statsRes.data);
      setQuestions(questionsRes.data);
    } catch (err) {
      console.error('Error fetching reviews/questions:', err);
    }
  };
  
  const handleAnswerQuestion = async (questionId) => {
    const answer = answerText[questionId];
    if (!answer?.trim()) return;
    
    setSubmittingAnswer(questionId);
    try {
      await api.post('/questions/answer', {
        question_id: questionId,
        answer: answer.trim(),
        answered_by: 'institute',
        institute_name: institution.name
      });
      setAnswerText({ ...answerText, [questionId]: '' });
      fetchReviewsAndQuestions();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit answer');
    } finally {
      setSubmittingAnswer(null);
    }
  };
  
  useEffect(() => {
    if (activeTab === 'review_link' && institution?.id) {
      fetchReviewLink();
      fetchReviewsAndQuestions();
    }
  }, [activeTab, institution?.id]);
  
  const handleLogout = async () => {
    try {
      await api.post('/institute/logout');
    } catch (e) {
      // Ignore logout errors
      console.log('Logout error:', e);
    }
    localStorage.removeItem('institute_token');
    localStorage.removeItem('institute');
    window.location.href = '/institute/login';
  };
  
  const handleLeadStatusUpdate = async (leadId, status) => {
    try {
      await api.patch(`/institute/leads/${leadId}`, { status });
      fetchLeads();
      fetchDashboard();
    } catch (error) {
      alert('Failed to update lead');
    }
  };
  
  const handleApplicationStatusUpdate = async (appId, status) => {
    try {
      await api.patch(`/institute/applications/${appId}`, { status });
      fetchApplications();
      fetchDashboard();
    } catch (error) {
      alert('Failed to update application');
    }
  };
  
  const getStatusBadge = (status, type = 'application') => {
    const appBadges = {
      submitted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiClock },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiAlertCircle },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle }
    };
    const leadBadges = {
      new: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiClock },
      contacted: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiPhone },
      qualified: { bg: 'bg-purple-100', text: 'text-purple-800', icon: FiCheckCircle },
      converted: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle }
    };
    
    const badges = type === 'lead' ? leadBadges : appBadges;
    const badge = badges[status] || badges.submitted || badges.new;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon size={14} /> {status?.replace('_', ' ').toUpperCase()}
      </span>
    );
  };
  
  const getSourceBadge = (source) => {
    const isAd = ['sponsored_ad', 'advertisement', 'ad_campaign'].includes(source);
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        isAd ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
      }`}>
        {isAd ? '📣 Ad' : '🌱 Organic'}
      </span>
    );
  };
  
  // Filter leads by search
  const filteredLeads = leads.filter(lead => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(q) ||
      lead.email?.toLowerCase().includes(q) ||
      lead.phone?.includes(q)
    );
  });
  
  // Filter applications by search
  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.student_name?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.phone?.includes(q)
    );
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <img src="/favicon.png" alt="Logo" className="h-10" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">{institution?.name}</h1>
                <p className="text-sm text-blue-200">Institution Portal</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              <FiLogOut className="mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              <nav className="space-y-1">
                {[
                  { id: 'overview', icon: FiBarChart2, label: 'Overview' },
                  { id: 'leads', icon: FiUsers, label: 'Leads', count: dashboard?.leads?.total },
                  { id: 'applications', icon: FiFileText, label: 'Applications', count: dashboard?.applications?.total },
                  { id: 'admission_bookings', icon: FiDollarSign, label: 'Admission Bookings', highlight: true },
                  { id: 'review_link', icon: FiStar, label: 'Reviews & QR', highlight: true },
                  { id: 'analytics', icon: FiTrendingUp, label: 'Ad Analytics' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                        : item.highlight ? 'text-green-700 hover:bg-green-50 bg-green-50/50' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={20} /> {item.label}
                    </span>
                    {item.count > 0 && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Total Leads</span>
                      <FiUsers className="text-blue-600 text-xl" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{dashboard?.leads?.total || 0}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Organic Leads</span>
                      <span className="text-green-600">🌱</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{dashboard?.leads?.organic || 0}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">From Ads</span>
                      <span className="text-purple-600">📣</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{dashboard?.leads?.from_ads || 0}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Applications</span>
                      <FiFileText className="text-orange-600 text-xl" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{dashboard?.applications?.total || 0}</p>
                  </div>
                </div>
                
                {/* Lead Status Breakdown */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Lead Status</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {['new', 'contacted', 'qualified', 'converted', 'rejected'].map((status) => (
                      <div key={status} className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboard?.leads?.status_breakdown?.[status] || 0}
                        </p>
                        <p className="text-xs text-gray-600 capitalize mt-1">{status}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Application Status */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Application Status</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {['submitted', 'under_review', 'accepted', 'rejected'].map((status) => (
                      <div key={status} className={`text-center p-4 rounded-lg ${
                        status === 'submitted' ? 'bg-blue-50' :
                        status === 'under_review' ? 'bg-yellow-50' :
                        status === 'accepted' ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <p className={`text-2xl font-bold ${
                          status === 'submitted' ? 'text-blue-600' :
                          status === 'under_review' ? 'text-yellow-600' :
                          status === 'accepted' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {dashboard?.applications?.status_breakdown?.[status] || 0}
                        </p>
                        <p className="text-xs text-gray-600 capitalize mt-1">{status.replace('_', ' ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recent Leads */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Recent Leads</h3>
                    <Button variant="ghost" size="sm" onClick={() => handleTabChange('leads')}>
                      View All →
                    </Button>
                  </div>
                  {dashboard?.recent_leads?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboard.recent_leads.slice(0, 5).map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{lead.name}</p>
                            <p className="text-sm text-gray-600">{lead.email} | {lead.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getSourceBadge(lead.source)}
                            {getStatusBadge(lead.status, 'lead')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No leads yet</p>
                  )}
                </div>
              </>
            )}
            
            {/* Leads Tab */}
            {activeTab === 'leads' && (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
                  
                  {/* Search & Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={leadSourceFilter}
                      onChange={(e) => setLeadSourceFilter(e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="">All Sources</option>
                      <option value="organic">Organic</option>
                      <option value="ad">From Ads</option>
                    </select>
                    <select
                      value={leadStatusFilter}
                      onChange={(e) => setLeadStatusFilter(e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="">All Status</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                
                {filteredLeads.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Leads Found</h3>
                    <p className="text-gray-600">Leads will appear here when users inquire about your institution</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLeads.map((lead) => (
                      <div key={lead.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold">{lead.name}</h3>
                              {getSourceBadge(lead.source)}
                              {getStatusBadge(lead.status, 'lead')}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiMail /> {lead.email}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiPhone /> {lead.phone}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiMapPin /> {lead.city}
                              </div>
                            </div>
                            {lead.course_interested && (
                              <p className="text-sm text-gray-600 mt-2">
                                <strong>Course:</strong> {lead.course_interested}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Received: {new Date(lead.created_at).toLocaleString()}
                            </p>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            {lead.status === 'new' && (
                              <Button
                                size="sm"
                                onClick={() => handleLeadStatusUpdate(lead.id, 'contacted')}
                                className="bg-yellow-500 hover:bg-yellow-600"
                              >
                                Mark Contacted
                              </Button>
                            )}
                            {['new', 'contacted'].includes(lead.status) && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleLeadStatusUpdate(lead.id, 'qualified')}
                                  className="bg-purple-500 hover:bg-purple-600"
                                >
                                  Qualified
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleLeadStatusUpdate(lead.id, 'rejected')}
                                  className="text-red-600 border-red-600"
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {lead.status === 'qualified' && (
                              <Button
                                size="sm"
                                onClick={() => handleLeadStatusUpdate(lead.id, 'converted')}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Mark Converted
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            
            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">Admission Applications</h2>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg"
                      />
                    </div>
                    <select
                      value={appStatusFilter}
                      onChange={(e) => setAppStatusFilter(e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="">All Status</option>
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                
                {filteredApplications.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applications</h3>
                    <p className="text-gray-600">Applications will appear here when students apply</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((app) => (
                      <div key={app.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold">{app.student_name}</h3>
                            <p className="text-gray-600">{app.course}</p>
                            <p className="text-sm text-gray-500">#{app.application_number}</p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium">{app.email}</p>
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
                        
                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          {app.status === 'submitted' && (
                            <Button
                              size="sm"
                              onClick={() => handleApplicationStatusUpdate(app.id, 'under_review')}
                              className="bg-yellow-500 hover:bg-yellow-600"
                            >
                              Mark Under Review
                            </Button>
                          )}
                          {['submitted', 'under_review'].includes(app.status) && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApplicationStatusUpdate(app.id, 'accepted')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApplicationStatusUpdate(app.id, 'rejected')}
                                className="text-red-600 border-red-600"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900">Ad Analytics</h2>
                
                {adAnalytics ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <p className="text-gray-600 text-sm">Impressions</p>
                        <p className="text-3xl font-bold text-blue-600">{adAnalytics.summary.total_impressions.toLocaleString()}</p>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <p className="text-gray-600 text-sm">Clicks</p>
                        <p className="text-3xl font-bold text-green-600">{adAnalytics.summary.total_clicks.toLocaleString()}</p>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <p className="text-gray-600 text-sm">CTR</p>
                        <p className="text-3xl font-bold text-purple-600">{adAnalytics.summary.ctr}%</p>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <p className="text-gray-600 text-sm">Conversions</p>
                        <p className="text-3xl font-bold text-orange-600">{adAnalytics.summary.total_conversions}</p>
                      </div>
                    </div>
                    
                    {/* Additional Stats */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-bold mb-4">Performance Summary</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-gray-600 mb-2">Conversion Rate</p>
                          <p className="text-2xl font-bold">{adAnalytics.summary.conversion_rate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2">Total Spend</p>
                          <p className="text-2xl font-bold">₹{adAnalytics.summary.total_spend.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2">Leads from Ads</p>
                          <p className="text-2xl font-bold">{adAnalytics.leads_from_ads}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2">Active Ads</p>
                          <p className="text-2xl font-bold">{adAnalytics.ads?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiTrendingUp className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Ad Data</h3>
                    <p className="text-gray-600">Contact admin to set up sponsored ads for your institution</p>
                  </div>
                )}
              </>
            )}
            
            {/* Review Link & QR Code Tab */}
            {activeTab === 'review_link' && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Review Link & QR Code</h2>
                  <p className="text-gray-600">Generate and share review links with students. They can scan the QR or click the link to leave reviews.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* QR Code Generator */}
                  <div>
                    {reviewLink?.has_link ? (
                      <ReviewQRGenerator
                        reviewLink={`${window.location.origin}/review/${reviewLink.link_code}`}
                        instituteName={institution?.name || 'Institution'}
                        instituteLogo={institution?.logo_url}
                        instituteType={institution?.type || 'College'}
                      />
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FiLink className="text-orange-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Generate Review Link</h3>
                        <p className="text-gray-600 mb-6">Create a shareable link and QR code for students to submit reviews</p>
                        <Button 
                          onClick={generateReviewLink}
                          disabled={generatingLink}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          {generatingLink ? 'Generating...' : 'Generate Review Link'}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Stats & Tips */}
                  <div className="space-y-6">
                    {reviewLink?.has_link && (
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Link Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600">{reviewLink.views || 0}</p>
                            <p className="text-sm text-gray-600">Total Views</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-green-600">{reviewLink.submissions || 0}</p>
                            <p className="text-sm text-gray-600">Reviews Submitted</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Tips for More Reviews</h3>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          Print the QR code and display it in classrooms, notice boards
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          Share the link in alumni WhatsApp groups
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          Include the QR code in farewell event materials
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          Send the link to final year students via email
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          Add to placement brochures and marketing materials
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Why Reviews Matter?</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Authentic student reviews help prospective students make informed decisions. 
                        Institutions with more positive reviews rank higher in search results and 
                        attract more quality applications. Reviews build trust and credibility.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Admission Bookings Tab */}
            {activeTab === 'admission_bookings' && (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Admission Bookings</h2>
                    <p className="text-gray-600">Manage seat booking applications from students</p>
                  </div>
                </div>
                
                {admissionBookings.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <FiDollarSign className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Admission Bookings</h3>
                    <p className="text-gray-600">Admission bookings will appear here when students book seats</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {admissionBookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold">{booking.student_name}</h3>
                            <p className="text-gray-600">{booking.course_or_class}</p>
                            <p className="text-sm text-gray-500">Application #{booking.id?.slice(0, 15)}</p>
                          </div>
                          {(() => {
                            const statusConfig = {
                              submitted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Submitted' },
                              approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
                              rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
                            };
                            const config = statusConfig[booking.status] || statusConfig.submitted;
                            return (
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                                {config.label}
                              </span>
                            );
                          })()}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600">Father&apos;s Name</p>
                            <p className="font-medium">{booking.father_name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Mobile</p>
                            <p className="font-medium">{booking.mobile}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium">{booking.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Amount Paid</p>
                            <p className="font-medium text-green-600">₹{booking.total_amount}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600">DOB</p>
                            <p className="font-medium">{booking.dob}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Aadhaar</p>
                            <p className="font-medium">{booking.aadhaar_number}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Last Qualification</p>
                            <p className="font-medium">{booking.last_qualification}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Applied On</p>
                            <p className="font-medium">{new Date(booking.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm mb-4">
                          <p className="text-gray-600">Address</p>
                          <p className="font-medium">{booking.address}, {booking.city}, {booking.state} - {booking.pin}</p>
                        </div>
                        
                        {/* Documents */}
                        <div className="flex gap-3 mb-4 text-sm">
                          {booking.photo_url && (
                            <a href={booking.photo_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                              <FiEye size={14} /> Photo
                            </a>
                          )}
                          {booking.aadhaar_doc_url && (
                            <a href={booking.aadhaar_doc_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                              <FiEye size={14} /> Aadhaar Doc
                            </a>
                          )}
                          {booking.qualification_doc_url && (
                            <a href={booking.qualification_doc_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                              <FiEye size={14} /> Qualification Doc
                            </a>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        {booking.status === 'submitted' && (
                          <div className="flex gap-3 pt-4 border-t">
                            <Button
                              size="sm"
                              onClick={() => setSelectedAdmissionBooking(booking)}
                              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                            >
                              <FiCheckCircle size={14} /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAdmissionBooking(booking);
                                setAdmissionComment('');
                              }}
                              className="text-red-600 border-red-600"
                            >
                              <FiXCircle size={14} /> Reject
                            </Button>
                          </div>
                        )}
                        
                        {/* Institution Comments */}
                        {booking.institution_comments && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700">Your Comments:</p>
                            <p className="text-sm text-gray-600">{booking.institution_comments}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Approve/Reject Modal */}
                {selectedAdmissionBooking && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                      <h3 className="text-lg font-bold mb-4">
                        Update Application Status
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Student: <strong>{selectedAdmissionBooking.student_name}</strong><br />
                        Course: <strong>{selectedAdmissionBooking.course_or_class}</strong>
                      </p>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add Comments (optional)
                        </label>
                        <textarea
                          value={admissionComment}
                          onChange={(e) => setAdmissionComment(e.target.value)}
                          placeholder="Enter any comments for the student..."
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setSelectedAdmissionBooking(null);
                            setAdmissionComment('');
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleAdmissionStatusUpdate(selectedAdmissionBooking.id, 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleAdmissionStatusUpdate(selectedAdmissionBooking.id, 'rejected')}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;
