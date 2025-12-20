import React, { useState, useEffect } from 'react';
import { Link } from '../../components/CustomLink';
import { 
  FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiEye, FiPause, FiPlay, 
  FiBarChart2, FiDollarSign, FiImage, FiVideo, FiFileText, FiCode,
  FiTarget, FiCalendar, FiClock, FiTrendingUp, FiMousePointer,
  FiSave, FiX, FiSearch, FiFilter, FiRefreshCw
} from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';

// Ad Types
const AD_TYPES = [
  { id: 'banner', name: 'Banner Ad', icon: FiImage, color: 'from-blue-500 to-cyan-500' },
  { id: 'text', name: 'Text Ad', icon: FiFileText, color: 'from-green-500 to-emerald-500' },
  { id: 'video', name: 'Video Ad', icon: FiVideo, color: 'from-red-500 to-rose-500' },
  { id: 'html', name: 'HTML/Native', icon: FiCode, color: 'from-purple-500 to-violet-500' },
  { id: 'college_card', name: 'College Card', icon: FiTarget, color: 'from-orange-500 to-amber-500' },
];

// Banner Sizes
const BANNER_SIZES = [
  { id: '728x90', name: 'Leaderboard (728x90)' },
  { id: '300x250', name: 'Medium Rectangle (300x250)' },
  { id: '160x600', name: 'Wide Skyscraper (160x600)' },
  { id: '320x50', name: 'Mobile Banner (320x50)' },
  { id: '300x600', name: 'Half Page (300x600)' },
  { id: '970x250', name: 'Billboard (970x250)' },
  { id: 'custom', name: 'Custom Size' },
];

// Placement Positions
const PLACEMENTS = [
  { id: 'header_banner', name: 'Header Banner' },
  { id: 'sidebar_top', name: 'Sidebar - Top' },
  { id: 'sidebar_middle', name: 'Sidebar - Middle' },
  { id: 'content_top', name: 'Content - Top' },
  { id: 'content_middle', name: 'Content - Middle' },
  { id: 'content_bottom', name: 'Content - Bottom' },
  { id: 'footer_banner', name: 'Footer Banner' },
  { id: 'featured', name: 'Featured Section' },
  { id: 'admission', name: 'Admissions Open Section' },
  { id: 'sponsored', name: 'Sponsored Section' },
];

const AdvertisementManagement = () => {
  const [ads, setAds] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ads'); // ads, analytics, create
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    ad_type: 'banner',
    image_url: '',
    image_alt: '',
    banner_size: '728x90',
    headline: '',
    description: '',
    video_url: '',
    video_thumbnail: '',
    html_content: '',
    college_id: '',
    click_url: '',
    click_url_target: '_blank',
    target_urls: [],
    section_type: 'banner',
    placement_position: 'content_top',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '00:00',
    end_time: '23:59',
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    budget: {
      total_budget: 0,
      daily_budget: 0,
      cost_per_click: 0,
      cost_per_impression: 0,
    },
    rotation: {
      enabled: false,
      max_impressions: 0,
      max_clicks: 0,
      rotation_type: 'sequential',
      weight: 1,
    },
    is_active: true,
    priority: 1,
    tags: [],
    notes: '',
  });

  const [newTargetUrl, setNewTargetUrl] = useState('');

  useEffect(() => {
    fetchAds();
    fetchAnalytics();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterType) params.append('ad_type', filterType);
      
      const response = await api.get(`/advertisements?${params.toString()}`);
      setAds(response.data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/advertisements/analytics/summary');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleCreateAd = async () => {
    try {
      if (editingAd) {
        await api.put(`/advertisements/${editingAd.id}`, formData);
        alert('Advertisement updated successfully!');
      } else {
        await api.post('/advertisements', formData);
        alert('Advertisement created successfully!');
      }
      setShowCreateModal(false);
      setEditingAd(null);
      resetForm();
      fetchAds();
      fetchAnalytics();
    } catch (error) {
      console.error('Error saving ad:', error);
      alert('Error saving advertisement');
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      await api.delete(`/advertisements/${adId}`);
      fetchAds();
      fetchAnalytics();
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  const handleToggleStatus = async (ad) => {
    try {
      await api.put(`/advertisements/${ad.id}`, {
        is_paused: !ad.is_paused,
        status: ad.is_paused ? 'active' : 'paused'
      });
      fetchAds();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleEditAd = (ad) => {
    setEditingAd(ad);
    setFormData({
      ...ad,
      budget: ad.budget || { total_budget: 0, daily_budget: 0, cost_per_click: 0, cost_per_impression: 0 },
      rotation: ad.rotation || { enabled: false, max_impressions: 0, max_clicks: 0, rotation_type: 'sequential', weight: 1 },
      target_urls: ad.target_urls || [],
      days_of_week: ad.days_of_week || [0, 1, 2, 3, 4, 5, 6],
      tags: ad.tags || [],
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      ad_type: 'banner',
      image_url: '',
      image_alt: '',
      banner_size: '728x90',
      headline: '',
      description: '',
      video_url: '',
      video_thumbnail: '',
      html_content: '',
      college_id: '',
      click_url: '',
      click_url_target: '_blank',
      target_urls: [],
      section_type: 'banner',
      placement_position: 'content_top',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      start_time: '00:00',
      end_time: '23:59',
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      budget: { total_budget: 0, daily_budget: 0, cost_per_click: 0, cost_per_impression: 0 },
      rotation: { enabled: false, max_impressions: 0, max_clicks: 0, rotation_type: 'sequential', weight: 1 },
      is_active: true,
      priority: 1,
      tags: [],
      notes: '',
    });
  };

  const addTargetUrl = () => {
    if (newTargetUrl && !formData.target_urls.includes(newTargetUrl)) {
      setFormData({ ...formData, target_urls: [...formData.target_urls, newTargetUrl] });
      setNewTargetUrl('');
    }
  };

  const removeTargetUrl = (url) => {
    setFormData({ ...formData, target_urls: formData.target_urls.filter(u => u !== url) });
  };

  const filteredAds = ads.filter(ad => {
    if (searchQuery && !ad.name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getAdTypeInfo = (type) => AD_TYPES.find(t => t.id === type) || AD_TYPES[0];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Link to="/admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advertisement Management</h1>
            <p className="text-gray-600">Manage all ad formats, tracking, and analytics</p>
          </div>
          <Button onClick={() => { resetForm(); setEditingAd(null); setShowCreateModal(true); }} className="bg-blue-600 hover:bg-blue-700">
            <FiPlus className="mr-2" /> Create Advertisement
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'ads' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
        >
          <FiImage className="inline mr-2" /> Advertisements ({ads.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
        >
          <FiBarChart2 className="inline mr-2" /> Analytics Dashboard
        </button>
      </div>

      {/* Analytics Dashboard Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Impressions</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.summary.total_impressions.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiEye className="text-blue-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">Today: {analytics.today.impressions.toLocaleString()}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Clicks</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.summary.total_clicks.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiMousePointer className="text-green-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">Today: {analytics.today.clicks.toLocaleString()}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Avg. CTR</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.summary.avg_ctr}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiTrendingUp className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">₹{analytics.summary.total_spent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FiDollarSign className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Ad Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{analytics.summary.active_ads}</p>
              <p className="text-sm text-green-600">Active Ads</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">{analytics.summary.paused_ads}</p>
              <p className="text-sm text-yellow-600">Paused Ads</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-700">{analytics.summary.completed_ads}</p>
              <p className="text-sm text-gray-600">Completed Ads</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{analytics.summary.total_ads}</p>
              <p className="text-sm text-blue-600">Total Ads</p>
            </div>
          </div>

          {/* Last 7 Days Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Last 7 Days Performance</h3>
            <div className="flex items-end gap-2 h-40">
              {analytics.last_7_days.map((day, idx) => {
                const maxImpressions = Math.max(...analytics.last_7_days.map(d => d.impressions), 1);
                const height = (day.impressions / maxImpressions) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-100 rounded-t relative" style={{ height: `${Math.max(height, 5)}%` }}>
                      <div 
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t"
                        style={{ height: `${(day.clicks / Math.max(day.impressions, 1)) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{day.date.slice(5)}</p>
                    <p className="text-xs text-gray-600">{day.impressions}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 rounded"></span> Impressions</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span> Clicks</span>
            </div>
          </div>

          {/* Top Performing Ads */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Top Performing Ads</h3>
            <div className="space-y-3">
              {analytics.top_ads.map((ad, idx) => (
                <div key={ad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium">{ad.name}</p>
                      <p className="text-xs text-gray-500">{ad.ad_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{ad.impressions.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Impressions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{ad.clicks.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-600">{ad.ctr}%</p>
                      <p className="text-xs text-gray-500">CTR</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advertisements List Tab */}
      {activeTab === 'ads' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search ads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); fetchAds(); }}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Types</option>
                {AD_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); fetchAds(); }}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
              <Button variant="outline" onClick={fetchAds}>
                <FiRefreshCw className="mr-2" /> Refresh
              </Button>
            </div>
          </div>

          {/* Ads List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              </div>
            ) : filteredAds.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                <FiImage size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No advertisements found</p>
                <Button onClick={() => setShowCreateModal(true)} className="mt-4">
                  <FiPlus className="mr-2" /> Create Your First Ad
                </Button>
              </div>
            ) : (
              filteredAds.map(ad => {
                const typeInfo = getAdTypeInfo(ad.ad_type);
                const TypeIcon = typeInfo.icon;
                return (
                  <div key={ad.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="flex">
                      {/* Ad Preview */}
                      <div className={`w-48 bg-gradient-to-br ${typeInfo.color} p-4 flex items-center justify-center`}>
                        {ad.ad_type === 'banner' && ad.image_url ? (
                          <img src={ad.image_url} alt={ad.name} className="max-w-full max-h-24 object-contain rounded" />
                        ) : (
                          <TypeIcon className="text-white" size={48} />
                        )}
                      </div>
                      
                      {/* Ad Info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{ad.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                ad.is_paused ? 'bg-yellow-100 text-yellow-700' :
                                ad.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {ad.is_paused ? 'Paused' : ad.status === 'completed' ? 'Completed' : 'Active'}
                              </span>
                              <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                                {typeInfo.name}
                              </span>
                              {ad.target_urls?.length > 0 && (
                                <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
                                  {ad.target_urls.length} Target URLs
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleToggleStatus(ad)} className="p-2 hover:bg-gray-100 rounded-lg" title={ad.is_paused ? 'Resume' : 'Pause'}>
                              {ad.is_paused ? <FiPlay className="text-green-600" /> : <FiPause className="text-yellow-600" />}
                            </button>
                            <button onClick={() => handleEditAd(ad)} className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                              <FiEdit2 className="text-blue-600" />
                            </button>
                            <button onClick={() => handleDeleteAd(ad.id)} className="p-2 hover:bg-gray-100 rounded-lg" title="Delete">
                              <FiTrash2 className="text-red-600" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-6 mt-4 text-sm">
                          <div className="flex items-center gap-1">
                            <FiEye className="text-gray-400" />
                            <span className="font-medium">{ad.stats?.impressions?.toLocaleString() || 0}</span>
                            <span className="text-gray-500">impressions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiMousePointer className="text-gray-400" />
                            <span className="font-medium">{ad.stats?.clicks?.toLocaleString() || 0}</span>
                            <span className="text-gray-500">clicks</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiTrendingUp className="text-gray-400" />
                            <span className="font-medium">
                              {ad.stats?.impressions > 0 ? ((ad.stats?.clicks / ad.stats?.impressions) * 100).toFixed(2) : 0}%
                            </span>
                            <span className="text-gray-500">CTR</span>
                          </div>
                          {ad.budget?.total_budget > 0 && (
                            <div className="flex items-center gap-1">
                              <FiDollarSign className="text-gray-400" />
                              <span className="font-medium">₹{ad.budget?.spent_total?.toLocaleString() || 0}</span>
                              <span className="text-gray-500">/ ₹{ad.budget?.total_budget?.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Dates */}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiCalendar size={12} />
                            {ad.start_date} - {ad.end_date}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock size={12} />
                            {ad.start_time} - {ad.end_time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
              </h2>
              <button onClick={() => { setShowCreateModal(false); setEditingAd(null); }} className="text-white/80 hover:text-white">
                <FiX size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ad Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter ad name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ad Type *</label>
                  <select
                    value={formData.ad_type}
                    onChange={(e) => setFormData({...formData, ad_type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {AD_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ad Type Specific Fields */}
              {formData.ad_type === 'banner' && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-blue-800">Banner Ad Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL *</label>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="https://example.com/banner.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Banner Size</label>
                      <select
                        value={formData.banner_size}
                        onChange={(e) => setFormData({...formData, banner_size: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        {BANNER_SIZES.map(size => (
                          <option key={size.id} value={size.id}>{size.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={formData.image_alt}
                        onChange={(e) => setFormData({...formData, image_alt: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Image description for accessibility"
                      />
                    </div>
                  </div>
                  {formData.image_url && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Preview:</p>
                      <img src={formData.image_url} alt="Preview" className="max-h-32 rounded border" />
                    </div>
                  )}
                </div>
              )}

              {formData.ad_type === 'text' && (
                <div className="bg-green-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-green-800">Text Ad Settings</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Headline *</label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={(e) => setFormData({...formData, headline: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Ad headline (max 30 chars)"
                      maxLength={30}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Ad description (max 90 chars)"
                      maxLength={90}
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {formData.ad_type === 'video' && (
                <div className="bg-red-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-red-800">Video Ad Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Video URL *</label>
                      <input
                        type="url"
                        value={formData.video_url}
                        onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                      <input
                        type="url"
                        value={formData.video_thumbnail}
                        onChange={(e) => setFormData({...formData, video_thumbnail: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="https://example.com/thumbnail.jpg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.ad_type === 'html' && (
                <div className="bg-purple-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-purple-800">HTML/Native Ad Settings</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">HTML Content *</label>
                    <textarea
                      value={formData.html_content}
                      onChange={(e) => setFormData({...formData, html_content: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                      placeholder="<div>Your HTML ad code here</div>"
                      rows={6}
                    />
                  </div>
                </div>
              )}

              {/* Click URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Click URL</label>
                  <input
                    type="url"
                    value={formData.click_url}
                    onChange={(e) => setFormData({...formData, click_url: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://example.com/landing-page"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Open In</label>
                  <select
                    value={formData.click_url_target}
                    onChange={(e) => setFormData({...formData, click_url_target: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="_blank">New Tab</option>
                    <option value="_self">Same Tab</option>
                  </select>
                </div>
              </div>

              {/* Target URLs */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold">Target URLs (Link-wise Ads)</h3>
                <p className="text-sm text-gray-600">Leave empty to show on all pages, or add specific URLs where this ad should appear.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTargetUrl}
                    onChange={(e) => setNewTargetUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="/maharashtra-colleges or /colleges?city=Mumbai"
                  />
                  <Button onClick={addTargetUrl} variant="outline">
                    <FiPlus className="mr-1" /> Add
                  </Button>
                </div>
                {formData.target_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.target_urls.map((url, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                        {url}
                        <button onClick={() => removeTargetUrl(url)} className="hover:text-red-600">
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Placement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Section Type</label>
                  <select
                    value={formData.section_type}
                    onChange={(e) => setFormData({...formData, section_type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="banner">Banner</option>
                    <option value="featured">Featured</option>
                    <option value="admission">Admissions Open</option>
                    <option value="sponsored">Sponsored</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  <select
                    value={formData.placement_position}
                    onChange={(e) => setFormData({...formData, placement_position: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {PLACEMENTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold">Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="bg-orange-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-orange-800">Budget & Billing</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Budget (₹)</label>
                    <input
                      type="number"
                      value={formData.budget.total_budget}
                      onChange={(e) => setFormData({...formData, budget: {...formData.budget, total_budget: parseFloat(e.target.value) || 0}})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                      placeholder="0 = unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Daily Budget (₹)</label>
                    <input
                      type="number"
                      value={formData.budget.daily_budget}
                      onChange={(e) => setFormData({...formData, budget: {...formData.budget, daily_budget: parseFloat(e.target.value) || 0}})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                      placeholder="0 = unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cost Per Click (₹)</label>
                    <input
                      type="number"
                      value={formData.budget.cost_per_click}
                      onChange={(e) => setFormData({...formData, budget: {...formData.budget, cost_per_click: parseFloat(e.target.value) || 0}})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CPM (₹ per 1000)</label>
                    <input
                      type="number"
                      value={formData.budget.cost_per_impression}
                      onChange={(e) => setFormData({...formData, budget: {...formData.budget, cost_per_impression: parseFloat(e.target.value) || 0}})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Rotation */}
              <div className="bg-purple-50 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-purple-800">Ad Rotation</h3>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.rotation.enabled}
                      onChange={(e) => setFormData({...formData, rotation: {...formData.rotation, enabled: e.target.checked}})}
                      className="rounded"
                    />
                    <span className="text-sm">Enable Rotation</span>
                  </label>
                </div>
                {formData.rotation.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Impressions</label>
                      <input
                        type="number"
                        value={formData.rotation.max_impressions}
                        onChange={(e) => setFormData({...formData, rotation: {...formData.rotation, max_impressions: parseInt(e.target.value) || 0}})}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="0"
                        placeholder="0 = unlimited"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Clicks</label>
                      <input
                        type="number"
                        value={formData.rotation.max_clicks}
                        onChange={(e) => setFormData({...formData, rotation: {...formData.rotation, max_clicks: parseInt(e.target.value) || 0}})}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="0"
                        placeholder="0 = unlimited"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rotation Type</label>
                      <select
                        value={formData.rotation.rotation_type}
                        onChange={(e) => setFormData({...formData, rotation: {...formData.rotation, rotation_type: e.target.value}})}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="sequential">Sequential</option>
                        <option value="random">Random</option>
                        <option value="weighted">Weighted</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority (1-10)</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="1"
                    max="10"
                  />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  placeholder="Internal notes about this ad"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); setEditingAd(null); }}>
                Cancel
              </Button>
              <Button onClick={handleCreateAd} className="bg-blue-600 hover:bg-blue-700">
                <FiSave className="mr-2" /> {editingAd ? 'Update Advertisement' : 'Create Advertisement'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementManagement;
