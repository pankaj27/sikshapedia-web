import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiLoader, FiPlus, FiTrash2, FiSettings, FiEdit3, FiSearch, FiBarChart2, FiFileText, FiHelpCircle } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const ExamListingSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Hero Section
    hero_title: 'Entrance Exams in India 2025-26',
    hero_subtitle: 'Complete guide to 200+ entrance exams for Engineering, Medical, Management, Law & more',
    hero_search_placeholder: 'Search exams (JEE, NEET, CAT, GATE...)',
    
    // Quick Stats
    stats: [
      { label: 'Total Exams', value: '200+' },
      { label: 'Categories', value: '24' },
      { label: 'Updates Daily', value: '50+' },
      { label: 'Students Helped', value: '10M+' }
    ],
    
    // News Section
    show_news_section: true,
    news_section_title: 'Latest Exam Updates',
    news_items: [],
    
    // Popular Sidebar
    show_popular_sidebar: true,
    popular_sidebar_title: 'Popular Exams',
    
    // SEO
    meta_title: 'Entrance Exams in India 2025-26 | Complete Guide',
    meta_description: 'Find all entrance exams in India for Engineering, Medical, Management, Law and more.',
    meta_keywords: [],
    
    // Content
    intro_content: '',
    bottom_content: '',
    faqs: [],
    
    // Categories
    show_all_categories: true,
    featured_categories: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/exam-listing-settings');
      if (response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/exam-listing-settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const addStat = () => {
    setSettings(prev => ({
      ...prev,
      stats: [...(prev.stats || []), { label: '', value: '' }]
    }));
  };

  const updateStat = (index, field, value) => {
    const newStats = [...(settings.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    setSettings(prev => ({ ...prev, stats: newStats }));
  };

  const removeStat = (index) => {
    setSettings(prev => ({
      ...prev,
      stats: (prev.stats || []).filter((_, i) => i !== index)
    }));
  };

  const addNewsItem = () => {
    setSettings(prev => ({
      ...prev,
      news_items: [...(prev.news_items || []), { title: '', date: '', tag: 'NEW', link: '' }]
    }));
  };

  const updateNewsItem = (index, field, value) => {
    const newItems = [...(settings.news_items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setSettings(prev => ({ ...prev, news_items: newItems }));
  };

  const removeNewsItem = (index) => {
    setSettings(prev => ({
      ...prev,
      news_items: (prev.news_items || []).filter((_, i) => i !== index)
    }));
  };

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <FiLoader className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10 px-6 py-4 mb-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Exam Listing Page Settings</h1>
              <p className="text-sm text-gray-500">Customize the /exams listing page content</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.open('/exams', '_blank')}>
                <FiFileText className="mr-2 w-4 h-4" /> Preview Page
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                {saving ? <FiLoader className="mr-2 w-4 h-4 animate-spin" /> : <FiSave className="mr-2 w-4 h-4" />}
                Save Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiEdit3 className="text-indigo-600" /> Hero Section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title (H1)</label>
                <input
                  type="text"
                  value={settings.hero_title}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                  placeholder="Entrance Exams in India 2025-26"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <textarea
                  value={settings.hero_subtitle}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                  rows="2"
                  placeholder="Complete guide to entrance exams..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Placeholder</label>
                <input
                  type="text"
                  value={settings.hero_search_placeholder}
                  onChange={(e) => handleChange('hero_search_placeholder', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                  placeholder="Search exams..."
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiBarChart2 className="text-green-600" /> Quick Stats
              </h2>
              <Button variant="outline" size="sm" onClick={addStat}>
                <FiPlus className="w-4 h-4 mr-1" /> Add Stat
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(settings.stats || []).map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 relative group">
                  <button
                    onClick={() => removeStat(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    className="w-full text-xl font-bold text-gray-800 bg-transparent border-none text-center mb-1"
                    placeholder="200+"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    className="w-full text-xs text-gray-500 bg-transparent border-none text-center"
                    placeholder="Label"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* News Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiFileText className="text-orange-600" /> Latest Updates Section
                </h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.show_news_section}
                    onChange={(e) => handleChange('show_news_section', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm text-gray-600">Show Section</span>
                </label>
              </div>
              <Button variant="outline" size="sm" onClick={addNewsItem}>
                <FiPlus className="w-4 h-4 mr-1" /> Add News
              </Button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                value={settings.news_section_title}
                onChange={(e) => handleChange('news_section_title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div className="space-y-3">
              {(settings.news_items || []).map((item, index) => (
                <div key={index} className="flex gap-3 items-start bg-gray-50 rounded-lg p-3">
                  <div className="flex-1 grid grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateNewsItem(index, 'title', e.target.value)}
                      className="col-span-2 border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="News title..."
                    />
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => updateNewsItem(index, 'date', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="14 Dec 2025"
                    />
                    <select
                      value={item.tag}
                      onChange={(e) => updateNewsItem(index, 'tag', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="NEW">NEW</option>
                      <option value="UPDATE">UPDATE</option>
                      <option value="RESULT">RESULT</option>
                      <option value="DEADLINE">DEADLINE</option>
                    </select>
                  </div>
                  <button onClick={() => removeNewsItem(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(settings.news_items || []).length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No news items. Click "Add News" to add updates.</p>
              )}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiSearch className="text-purple-600" /> SEO Settings
            </h2>
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
                  onChange={(e) => handleChange('meta_keywords', e.target.value.split(',').map(k => k.trim()))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                  placeholder="entrance exams, JEE, NEET, CAT..."
                />
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiHelpCircle className="text-blue-600" /> FAQs
              </h2>
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

          {/* Additional Content */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiSettings className="text-gray-600" /> Additional Content
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Introduction Content (HTML)</label>
                <textarea
                  value={settings.intro_content}
                  onChange={(e) => handleChange('intro_content', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm"
                  rows="4"
                  placeholder="<p>Introduction content that appears below the hero section...</p>"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bottom Content (HTML)</label>
                <textarea
                  value={settings.bottom_content}
                  onChange={(e) => handleChange('bottom_content', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm"
                  rows="4"
                  placeholder="<p>Content that appears at the bottom of the page...</p>"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ExamListingSettings;
