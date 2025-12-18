import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiSave, FiLoader, FiArrowLeft, FiPlus, FiTrash2, FiEye, FiSettings, FiEdit3, FiSearch, FiHelpCircle, FiGrid, FiTrendingUp, FiLink } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const CoursePageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [settings, setSettings] = useState({
    id: '',
    page_type: 'stream',
    is_active: true,
    title: '',
    subtitle: '',
    icon: '📚',
    badge: '',
    theme: 'from-blue-600 via-blue-700 to-indigo-700',
    theme_light: 'blue',
    filter_key: 'stream',
    filter_value: '',
    duration: '3-4 Years',
    benefits: [],
    popular_courses: [],
    related_pages: [],
    faqs: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    sidebar_cta_title: 'Need Guidance?',
    sidebar_cta_text: 'Get expert counselling',
    sidebar_cta_button: 'Get Free Counselling',
    sidebar_cta_link: '',
    intro_content: '',
    bottom_content: ''
  });

  useEffect(() => {
    if (id) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/course-pages/${id}`);
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      alert('Failed to load page settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/course-pages/${id}`, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Benefits
  const addBenefit = () => {
    setSettings(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), '']
    }));
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...(settings.benefits || [])];
    newBenefits[index] = value;
    setSettings(prev => ({ ...prev, benefits: newBenefits }));
  };

  const removeBenefit = (index) => {
    setSettings(prev => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== index)
    }));
  };

  // Popular Courses
  const addPopularCourse = () => {
    setSettings(prev => ({
      ...prev,
      popular_courses: [...(prev.popular_courses || []), '']
    }));
  };

  const updatePopularCourse = (index, value) => {
    const newCourses = [...(settings.popular_courses || [])];
    newCourses[index] = value;
    setSettings(prev => ({ ...prev, popular_courses: newCourses }));
  };

  const removePopularCourse = (index) => {
    setSettings(prev => ({
      ...prev,
      popular_courses: (prev.popular_courses || []).filter((_, i) => i !== index)
    }));
  };

  // Related Pages
  const addRelatedPage = () => {
    setSettings(prev => ({
      ...prev,
      related_pages: [...(prev.related_pages || []), '']
    }));
  };

  const updateRelatedPage = (index, value) => {
    const newPages = [...(settings.related_pages || [])];
    newPages[index] = value;
    setSettings(prev => ({ ...prev, related_pages: newPages }));
  };

  const removeRelatedPage = (index) => {
    setSettings(prev => ({
      ...prev,
      related_pages: (prev.related_pages || []).filter((_, i) => i !== index)
    }));
  };

  // FAQs
  const addFaq = () => {
    setSettings(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }]
    }));
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...(settings.faqs || [])];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setSettings(prev => ({ ...prev, faqs: newFaqs }));
  };

  const removeFaq = (index) => {
    setSettings(prev => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index)
    }));
  };

  const themeOptions = [
    { value: 'from-blue-600 via-blue-700 to-indigo-700', label: 'Blue', light: 'blue' },
    { value: 'from-red-600 via-rose-600 to-pink-600', label: 'Red/Medical', light: 'red' },
    { value: 'from-purple-600 via-violet-600 to-indigo-600', label: 'Purple', light: 'purple' },
    { value: 'from-green-600 via-emerald-600 to-teal-600', label: 'Green', light: 'emerald' },
    { value: 'from-amber-600 via-orange-500 to-red-500', label: 'Orange/Amber', light: 'amber' },
    { value: 'from-orange-600 via-orange-500 to-amber-500', label: 'Orange', light: 'orange' },
    { value: 'from-cyan-600 via-teal-600 to-emerald-600', label: 'Cyan/Teal', light: 'cyan' },
    { value: 'from-pink-600 via-rose-600 to-red-600', label: 'Pink', light: 'pink' },
    { value: 'from-indigo-600 via-blue-600 to-violet-600', label: 'Indigo', light: 'indigo' },
    { value: 'from-slate-700 via-slate-800 to-gray-900', label: 'Dark/Slate', light: 'slate' },
    { value: 'from-sky-600 via-cyan-600 to-blue-600', label: 'Sky', light: 'sky' },
    { value: 'from-violet-600 via-purple-600 to-indigo-600', label: 'Violet', light: 'violet' },
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiEdit3 },
    { id: 'filter', label: 'Filter & Theme', icon: FiSettings },
    { id: 'content', label: 'Content', icon: FiGrid },
    { id: 'seo', label: 'SEO', icon: FiSearch },
    { id: 'faqs', label: 'FAQs', icon: FiHelpCircle }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <FiLoader className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10 px-6 py-4 mb-6 rounded-lg shadow-sm -mx-6 -mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/admin/course-pages" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{settings.icon}</span>
                  <h1 className="text-xl font-bold text-gray-900">{settings.title || 'Edit Course Page'}</h1>
                </div>
                <p className="text-sm text-gray-500">/courses/{id}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.open(`/courses/${id}`, '_blank')}>
                <FiEye className="mr-2 w-4 h-4" /> Preview
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                {saving ? <FiLoader className="mr-2 w-4 h-4 animate-spin" /> : <FiSave className="mr-2 w-4 h-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-600 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Title (H1)</label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="Engineering Courses in India"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <textarea
                    value={settings.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    rows="2"
                    placeholder="B.Tech, B.E, M.Tech and other engineering programs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={settings.icon}
                    onChange={(e) => handleChange('icon', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-2xl"
                    placeholder="⚙️"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={settings.badge}
                    onChange={(e) => handleChange('badge', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="Technical Education"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration Text</label>
                  <input
                    type="text"
                    value={settings.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="4 Years (B.Tech)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Type</label>
                  <select
                    value={settings.page_type}
                    onChange={(e) => handleChange('page_type', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                  >
                    <option value="stream">Stream (Engineering, Medical...)</option>
                    <option value="level">Level (After 10th, After 12th...)</option>
                    <option value="degree">Degree (Diploma, PG, PhD...)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.is_active !== false}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Page is Active</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Filter & Theme Tab */}
          {activeTab === 'filter' && (
            <div className="space-y-6">
              {/* Filter Settings */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Course Filter</h2>
                <p className="text-sm text-gray-500 mb-4">Configure how courses are filtered for this page</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter By</label>
                    <select
                      value={settings.filter_key}
                      onChange={(e) => handleChange('filter_key', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    >
                      <option value="stream">Stream (Engineering, Medical, Arts...)</option>
                      <option value="degree_type">Degree Type (UG, PG, Diploma, PhD...)</option>
                      <option value="eligibility_level">Eligibility Level (after-10th, after-12th...)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter Value</label>
                    <input
                      type="text"
                      value={settings.filter_value}
                      onChange={(e) => handleChange('filter_value', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      placeholder="Engineering, PG, after-10th..."
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Query:</strong> <code className="bg-blue-100 px-1 rounded">/courses-detail?{settings.filter_key}={settings.filter_value}</code>
                  </p>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Theme & Colors</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleChange('theme', option.value);
                          handleChange('theme_light', option.light);
                        }}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          settings.theme === option.value
                            ? 'border-orange-500 ring-2 ring-orange-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`h-8 rounded bg-gradient-to-r ${option.value} mb-2`}></div>
                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Benefits */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Benefits ("Why Choose" Section)</h2>
                  <Button variant="outline" size="sm" onClick={addBenefit}>
                    <FiPlus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {(settings.benefits || []).map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="High demand in job market"
                      />
                      <button onClick={() => removeBenefit(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(settings.benefits || []).length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-2">No benefits added</p>
                  )}
                </div>
              </div>

              {/* Popular Courses */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiTrendingUp className="text-orange-600" /> Popular Courses (Sidebar)
                  </h2>
                  <Button variant="outline" size="sm" onClick={addPopularCourse}>
                    <FiPlus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {(settings.popular_courses || []).map((course, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded flex items-center justify-center text-xs font-bold">{index + 1}</span>
                      <input
                        type="text"
                        value={course}
                        onChange={(e) => updatePopularCourse(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="B.Tech CSE"
                      />
                      <button onClick={() => removePopularCourse(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Pages */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiLink className="text-blue-600" /> Related Pages (Sidebar)
                  </h2>
                  <Button variant="outline" size="sm" onClick={addRelatedPage}>
                    <FiPlus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {(settings.related_pages || []).map((page, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={page}
                        onChange={(e) => updateRelatedPage(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="/courses/after-12th"
                      />
                      <button onClick={() => removeRelatedPage(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar CTA */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Sidebar CTA</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={settings.sidebar_cta_title}
                      onChange={(e) => handleChange('sidebar_cta_title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                    <input
                      type="text"
                      value={settings.sidebar_cta_text}
                      onChange={(e) => handleChange('sidebar_cta_text', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={settings.sidebar_cta_button}
                      onChange={(e) => handleChange('sidebar_cta_button', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input
                      type="url"
                      value={settings.sidebar_cta_link || ''}
                      onChange={(e) => handleChange('sidebar_cta_link', e.target.value)}
                      placeholder="https://example.com/counselling"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={settings.meta_title}
                      onChange={(e) => handleChange('meta_title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">{settings.meta_title?.length || 0}/60 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                    <textarea
                      value={settings.meta_description}
                      onChange={(e) => handleChange('meta_description', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      rows="3"
                    />
                    <p className="text-xs text-gray-500 mt-1">{settings.meta_description?.length || 0}/160 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={(settings.meta_keywords || []).join(', ')}
                      onChange={(e) => handleChange('meta_keywords', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      placeholder="engineering courses, b.tech, m.tech..."
                    />
                  </div>
                </div>
              </div>

              {/* Additional Content Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Content</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intro Content (HTML) - Shows at top</label>
                    <textarea
                      value={settings.intro_content || ''}
                      onChange={(e) => handleChange('intro_content', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm"
                      rows="4"
                      placeholder="<p>Introduction content...</p>"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bottom Content (HTML) - Shows at bottom</label>
                    <textarea
                      value={settings.bottom_content || ''}
                      onChange={(e) => handleChange('bottom_content', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm"
                      rows="4"
                      placeholder="<p>Bottom content...</p>"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">FAQs</h2>
                <Button variant="outline" size="sm" onClick={addFaq}>
                  <FiPlus className="w-4 h-4 mr-1" /> Add FAQ
                </Button>
              </div>
              <div className="space-y-4">
                {(settings.faqs || []).map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 relative">
                    <button
                      onClick={() => removeFaq(index)}
                      className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 font-medium"
                        placeholder="Question..."
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        rows="2"
                        placeholder="Answer..."
                      />
                    </div>
                  </div>
                ))}
                {(settings.faqs || []).length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">No FAQs. Click "Add FAQ" to add questions.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CoursePageForm;
