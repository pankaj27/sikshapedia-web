import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiPlus, FiTrash2, FiEye, FiCheck, FiGift, FiStar, FiHeart, FiAward } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';

const ICON_OPTIONS = [
  { value: 'check', label: 'Check', icon: FiCheck },
  { value: 'gift', label: 'Gift', icon: FiGift },
  { value: 'star', label: 'Star', icon: FiStar },
  { value: 'heart', label: 'Heart', icon: FiHeart },
  { value: 'award', label: 'Award', icon: FiAward },
];

const GRADIENT_COLORS = [
  'blue-600', 'blue-700', 'blue-800', 'indigo-600', 'indigo-700', 'indigo-800',
  'orange-500', 'orange-600', 'red-500', 'red-600', 'purple-600', 'purple-700',
  'green-500', 'green-600', 'teal-500', 'teal-600', 'pink-500', 'pink-600'
];

const AuthPagesManagement = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [loginContent, setLoginContent] = useState(null);
  const [signupContent, setSignupContent] = useState(null);
  
  useEffect(() => {
    fetchContent();
  }, []);
  
  const fetchContent = async () => {
    setLoading(true);
    try {
      const [loginRes, signupRes] = await Promise.all([
        api.get('/admin/auth-pages/login'),
        api.get('/admin/auth-pages/signup')
      ]);
      setLoginContent(loginRes.data.content);
      setSignupContent(signupRes.data.content);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async (pageType) => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const content = pageType === 'login' ? loginContent : signupContent;
      await api.put(`/admin/auth-pages/${pageType}`, content);
      setMessage({ type: 'success', text: `${pageType === 'login' ? 'Login' : 'Signup'} page content saved successfully!` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save content' });
    } finally {
      setSaving(false);
    }
  };
  
  const handleReset = async (pageType) => {
    if (!window.confirm(`Reset ${pageType} page content to default? This cannot be undone.`)) return;
    
    try {
      await api.post(`/admin/auth-pages/${pageType}/reset`);
      await fetchContent();
      setMessage({ type: 'success', text: 'Content reset to default' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reset content' });
    }
  };
  
  const updateContent = (pageType, field, value) => {
    if (pageType === 'login') {
      setLoginContent(prev => ({ ...prev, [field]: value }));
    } else {
      setSignupContent(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const addStat = (pageType) => {
    const content = pageType === 'login' ? loginContent : signupContent;
    const newStats = [...(content.stats || []), { value: '', label: '' }];
    updateContent(pageType, 'stats', newStats);
  };
  
  const updateStat = (pageType, index, field, value) => {
    const content = pageType === 'login' ? loginContent : signupContent;
    const newStats = [...content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateContent(pageType, 'stats', newStats);
  };
  
  const removeStat = (pageType, index) => {
    const content = pageType === 'login' ? loginContent : signupContent;
    const newStats = content.stats.filter((_, i) => i !== index);
    updateContent(pageType, 'stats', newStats);
  };
  
  const addBenefit = (pageType) => {
    const content = pageType === 'login' ? loginContent : signupContent;
    const newBenefits = [...(content.benefits || []), { icon: 'check', text: '' }];
    updateContent(pageType, 'benefits', newBenefits);
  };
  
  const updateBenefit = (pageType, index, field, value) => {
    const content = pageType === 'login' ? loginContent : signupContent;
    const newBenefits = [...content.benefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    updateContent(pageType, 'benefits', newBenefits);
  };
  
  const removeBenefit = (pageType, index) => {
    const content = pageType === 'login' ? loginContent : signupContent;
    const newBenefits = content.benefits.filter((_, i) => i !== index);
    updateContent(pageType, 'benefits', newBenefits);
  };
  
  const renderEditor = (pageType) => {
    const content = pageType === 'login' ? loginContent : signupContent;
    if (!content) return null;
    
    return (
      <div className="space-y-6">
        {/* Left Panel Settings */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">1</span>
            Left Panel (Branding)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
              <input
                type="text"
                value={content.heading || ''}
                onChange={(e) => updateContent(pageType, 'heading', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Welcome Back!"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="text"
                value={content.logo_url || ''}
                onChange={(e) => updateContent(pageType, 'logo_url', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="/favicon.png"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
              <textarea
                value={content.subheading || ''}
                onChange={(e) => updateContent(pageType, 'subheading', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Sign in to access your dashboard..."
              />
            </div>
            
            {/* Gradient Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gradient From</label>
              <select
                value={content.gradient_from || ''}
                onChange={(e) => updateContent(pageType, 'gradient_from', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {GRADIENT_COLORS.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gradient To</label>
              <select
                value={content.gradient_to || ''}
                onChange={(e) => updateContent(pageType, 'gradient_to', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {GRADIENT_COLORS.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Stats (shown on left panel)</label>
              <button
                onClick={() => addStat(pageType)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <FiPlus size={14} /> Add Stat
              </button>
            </div>
            
            {content.stats?.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(pageType, idx, 'value', e.target.value)}
                  className="w-24 px-3 py-2 border rounded-lg text-sm"
                  placeholder="10K+"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(pageType, idx, 'label', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  placeholder="Colleges"
                />
                <button
                  onClick={() => removeStat(pageType, idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          
          {/* Benefits Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Benefits (shown on left panel)</label>
              <button
                onClick={() => addBenefit(pageType)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <FiPlus size={14} /> Add Benefit
              </button>
            </div>
            
            {content.benefits?.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <select
                  value={benefit.icon}
                  onChange={(e) => updateBenefit(pageType, idx, 'icon', e.target.value)}
                  className="w-28 px-3 py-2 border rounded-lg text-sm"
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={benefit.text}
                  onChange={(e) => updateBenefit(pageType, idx, 'text', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  placeholder="Compare 10,000+ colleges"
                />
                <button
                  onClick={() => removeBenefit(pageType, idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Panel Settings */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">2</span>
            Right Panel (Form)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
              <input
                type="text"
                value={content.form_title || ''}
                onChange={(e) => updateContent(pageType, 'form_title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Sign In"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Subtitle</label>
              <input
                type="text"
                value={content.form_subtitle || ''}
                onChange={(e) => updateContent(pageType, 'form_subtitle', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your credentials to continue"
              />
            </div>
          </div>
        </div>
        
        {/* Footer Settings */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">3</span>
            Footer & Links
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
              <input
                type="text"
                value={content.footer_text || ''}
                onChange={(e) => updateContent(pageType, 'footer_text', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Don't have an account?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Link Text</label>
              <input
                type="text"
                value={content.footer_link_text || ''}
                onChange={(e) => updateContent(pageType, 'footer_link_text', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Create Account"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Link URL</label>
              <input
                type="text"
                value={content.footer_link_url || ''}
                onChange={(e) => updateContent(pageType, 'footer_link_url', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="/signup"
              />
            </div>
          </div>
          
          {/* Institute Login (only for login page) */}
          {pageType === 'login' && (
            <div className="mt-4 pt-4 border-t">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={content.show_institute_login || false}
                  onChange={(e) => updateContent(pageType, 'show_institute_login', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show Institute Login Box</span>
              </label>
              
              {content.show_institute_login && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institute Login Text</label>
                    <input
                      type="text"
                      value={content.institute_login_text || ''}
                      onChange={(e) => updateContent(pageType, 'institute_login_text', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Are you an institution?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institute Login Link Text</label>
                    <input
                      type="text"
                      value={content.institute_login_link_text || ''}
                      onChange={(e) => updateContent(pageType, 'institute_login_link_text', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Institute Login →"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleReset(pageType)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <FiRefreshCw size={16} /> Reset to Default
          </button>
          
          <div className="flex items-center gap-3">
            <a
              href={pageType === 'login' ? '/login' : '/signup'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <FiEye size={16} /> Preview
            </a>
            <Button
              onClick={() => handleSave(pageType)}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Auth Pages Content</h1>
        <p className="text-gray-600">Customize the content shown on Login and Signup pages</p>
      </div>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('login')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'login'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Login Page
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'signup'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Signup Page
        </button>
      </div>
      
      {/* Editor */}
      {renderEditor(activeTab)}
    </div>
  );
};

export default AuthPagesManagement;
