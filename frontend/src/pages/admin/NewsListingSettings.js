import React, { useState, useEffect } from 'react';
import { FiSave, FiLoader, FiPlus, FiTrash2, FiEdit3, FiBarChart2, FiFileText, FiHelpCircle, FiTag, FiMail, FiTrendingUp, FiList } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const NewsListingSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Hero Section
    hero_title: 'Latest News & Updates',
    hero_subtitle: 'Stay updated with the latest news on admissions, exams, colleges and education',
    
    // Quick Stats
    stats: [
      { label: 'News Articles', value: '500+' },
      { label: 'Categories', value: '5' },
      { label: 'Daily Updates', value: '20+' },
      { label: 'Subscribers', value: '50K+' }
    ],
    
    // Categories
    categories: [
      { id: 'all', label: 'ALL NEWS', enabled: true },
      { id: 'admission', label: 'ADMISSION ALERT', enabled: true },
      { id: 'college', label: 'COLLEGE NEWS', enabled: true },
      { id: 'exam', label: 'EXAM NEWS', enabled: true },
      { id: 'latest', label: 'LATEST ALERTS', enabled: true }
    ],
    
    // Sidebar Config
    show_big_stories: true,
    big_stories_title: 'The Big Stories',
    big_stories_count: 5,
    
    show_trending_tags: true,
    trending_tags_title: '#Trending search',
    trending_tags: ['CAT 2025', 'JEE Main', 'NEET UG', 'GATE 2026', 'UPSC', 'IIT Admission', 'MBA Colleges', 'CUET', 'NTA', 'Engineering'],
    
    show_newsletter: true,
    newsletter_title: 'Subscribe to our newsletter',
    newsletter_subtitle: 'Get our latest news about exams, colleges and others',
    newsletter_button_text: 'Subscribe',
    
    // SEO
    meta_title: 'Latest News & Updates | Education News',
    meta_description: 'Stay updated with the latest news on admissions, exams, colleges and education in India.',
    meta_keywords: ['education news', 'admission news', 'exam news', 'college news'],
    
    // Content
    intro_content: '',
    bottom_content: '',
    faqs: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/news-listing-settings');
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
      await api.put('/news-listing-settings', settings);
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

  // Stat helpers
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

  // Category helpers
  const addCategory = () => {
    setSettings(prev => ({
      ...prev,
      categories: [...(prev.categories || []), { id: '', label: '', enabled: true }]
    }));
  };

  const updateCategory = (index, field, value) => {
    const newCategories = [...(settings.categories || [])];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setSettings(prev => ({ ...prev, categories: newCategories }));
  };

  const removeCategory = (index) => {
    setSettings(prev => ({
      ...prev,
      categories: (prev.categories || []).filter((_, i) => i !== index)
    }));
  };

  // Trending tag helpers
  const addTrendingTag = () => {
    setSettings(prev => ({
      ...prev,
      trending_tags: [...(prev.trending_tags || []), '']
    }));
  };

  const updateTrendingTag = (index, value) => {
    const newTags = [...(settings.trending_tags || [])];
    newTags[index] = value;
    setSettings(prev => ({ ...prev, trending_tags: newTags }));
  };

  const removeTrendingTag = (index) => {
    setSettings(prev => ({
      ...prev,
      trending_tags: (prev.trending_tags || []).filter((_, i) => i !== index)
    }));
  };

  // FAQ helpers
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

  // Keyword helpers
  const addKeyword = () => {
    setSettings(prev => ({
      ...prev,
      meta_keywords: [...(prev.meta_keywords || []), '']
    }));
  };

  const updateKeyword = (index, value) => {
    const newKeywords = [...(settings.meta_keywords || [])];
    newKeywords[index] = value;
    setSettings(prev => ({ ...prev, meta_keywords: newKeywords }));
  };

  const removeKeyword = (index) => {
    setSettings(prev => ({
      ...prev,
      meta_keywords: (prev.meta_keywords || []).filter((_, i) => i !== index)
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
              <h1 className="text-2xl font-bold text-gray-900">News Listing Page Settings</h1>
              <p className="text-sm text-gray-500">Customize the /news listing page content</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.open('/news', '_blank')}>
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
                  placeholder="Latest News & Updates"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <textarea
                  value={settings.hero_subtitle}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                  rows="2"
                  placeholder="Stay updated with the latest news..."
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
                    placeholder="500+"
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

          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiList className="text-blue-600" /> News Categories
              </h2>
              <Button variant="outline" size="sm" onClick={addCategory}>
                <FiPlus className="w-4 h-4 mr-1" /> Add Category
              </Button>
            </div>
            <div className="space-y-3">
              {(settings.categories || []).map((category, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <input
                    type="checkbox"
                    checked={category.enabled}
                    onChange={(e) => updateCategory(index, 'enabled', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <input
                    type="text"
                    value={category.id}
                    onChange={(e) => updateCategory(index, 'id', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Category ID (e.g., admission)"
                  />
                  <input
                    type="text"
                    value={category.label}
                    onChange={(e) => updateCategory(index, 'label', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Display Label (e.g., ADMISSION ALERT)"
                  />
                  <button
                    onClick={() => removeCategory(index)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-purple-600" /> Sidebar Settings
            </h2>
            
            {/* Big Stories */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.show_big_stories}
                  onChange={(e) => handleChange('show_big_stories', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="font-medium">Show Big Stories Section</span>
              </div>
              {settings.show_big_stories && (
                <div className="grid grid-cols-2 gap-4 ml-7">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={settings.big_stories_title}
                      onChange={(e) => handleChange('big_stories_title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Stories</label>
                    <input
                      type="number"
                      value={settings.big_stories_count}
                      onChange={(e) => handleChange('big_stories_count', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Trending Tags */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.show_trending_tags}
                  onChange={(e) => handleChange('show_trending_tags', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="font-medium">Show Trending Tags</span>
              </div>
              {settings.show_trending_tags && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={settings.trending_tags_title}
                    onChange={(e) => handleChange('trending_tags_title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Tags</label>
                    <Button variant="outline" size="sm" onClick={addTrendingTag}>
                      <FiPlus className="w-4 h-4 mr-1" /> Add Tag
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(settings.trending_tags || []).map((tag, index) => (
                      <div key={index} className="flex items-center gap-1 bg-blue-50 rounded-full px-3 py-1 group">
                        <FiTag className="w-3 h-3 text-blue-500" />
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => updateTrendingTag(index, e.target.value)}
                          className="bg-transparent border-none text-sm text-blue-700 w-24"
                          placeholder="Tag name"
                        />
                        <button
                          onClick={() => removeTrendingTag(index)}
                          className="text-red-500 opacity-0 group-hover:opacity-100"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.show_newsletter}
                  onChange={(e) => handleChange('show_newsletter', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="font-medium">Show Newsletter Section</span>
              </div>
              {settings.show_newsletter && (
                <div className="ml-7 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Title</label>
                    <input
                      type="text"
                      value={settings.newsletter_title}
                      onChange={(e) => handleChange('newsletter_title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Subtitle</label>
                    <input
                      type="text"
                      value={settings.newsletter_subtitle}
                      onChange={(e) => handleChange('newsletter_subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={settings.newsletter_button_text}
                      onChange={(e) => handleChange('newsletter_button_text', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiFileText className="text-orange-600" /> SEO Settings
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  value={settings.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                  rows="3"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
                  <Button variant="outline" size="sm" onClick={addKeyword}>
                    <FiPlus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(settings.meta_keywords || []).map((keyword, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 rounded px-3 py-1 group">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => updateKeyword(index, e.target.value)}
                        className="bg-transparent border-none text-sm w-28"
                        placeholder="keyword"
                      />
                      <button
                        onClick={() => removeKeyword(index)}
                        className="text-red-500 opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Content */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiEdit3 className="text-teal-600" /> Additional Content
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intro Content (HTML - shown below hero)
                </label>
                <textarea
                  value={settings.intro_content || ''}
                  onChange={(e) => handleChange('intro_content', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm"
                  rows="4"
                  placeholder="<p>Welcome to our news section...</p>"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bottom Content (HTML - shown at page bottom)
                </label>
                <textarea
                  value={settings.bottom_content || ''}
                  onChange={(e) => handleChange('bottom_content', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm"
                  rows="4"
                  placeholder="<p>Stay connected...</p>"
                />
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiHelpCircle className="text-yellow-600" /> FAQs
              </h2>
              <Button variant="outline" size="sm" onClick={addFaq}>
                <FiPlus className="w-4 h-4 mr-1" /> Add FAQ
              </Button>
            </div>
            <div className="space-y-4">
              {(settings.faqs || []).map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 relative group">
                  <button
                    onClick={() => removeFaq(index)}
                    className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 font-medium"
                      placeholder="Question"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      rows="2"
                      placeholder="Answer"
                    />
                  </div>
                </div>
              ))}
              {(settings.faqs || []).length === 0 && (
                <p className="text-gray-500 text-center py-4">No FAQs added yet</p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pb-8">
            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 px-8">
              {saving ? <FiLoader className="mr-2 w-4 h-4 animate-spin" /> : <FiSave className="mr-2 w-4 h-4" />}
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsListingSettings;
