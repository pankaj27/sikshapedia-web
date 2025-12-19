import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiGlobe, FiSettings, FiSearch, FiBarChart2, FiHelpCircle } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const TABS = [
  { id: 'hero', label: 'Hero Section', icon: FiGlobe },
  { id: 'countries', label: 'Countries & Programs', icon: FiBarChart2 },
  { id: 'cta', label: 'CTA & Content', icon: FiSettings },
  { id: 'seo', label: 'SEO & FAQs', icon: FiSearch },
];

const StudyAbroadListingSettings = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    hero_title: 'Study Abroad',
    hero_subtitle: 'Explore top universities around the world and find your perfect study destination',
    hero_bg_gradient: 'from-indigo-600 to-purple-700',
    hero_image: '',
    stats: [
      { label: 'Partner Universities', value: '500+', icon: '🏛️' },
      { label: 'Countries', value: '50+', icon: '🌍' },
      { label: 'Students Placed', value: '10K+', icon: '👨‍🎓' },
      { label: 'Scholarship Value', value: '$50M+', icon: '💰' }
    ],
    featured_countries: [
      { name: 'USA', flag: '🇺🇸', universities: 100, description: 'World-class education system' },
      { name: 'UK', flag: '🇬🇧', universities: 80, description: 'Rich academic heritage' },
      { name: 'Canada', flag: '🇨🇦', universities: 60, description: 'Multicultural environment' },
      { name: 'Australia', flag: '🇦🇺', universities: 50, description: 'Quality lifestyle' }
    ],
    show_country_filter: true,
    show_ranking_filter: true,
    show_tuition_filter: true,
    show_program_filter: true,
    program_types: [
      { id: 'undergraduate', name: 'Undergraduate', icon: '📚' },
      { id: 'postgraduate', name: 'Postgraduate', icon: '🎓' },
      { id: 'phd', name: 'PhD/Research', icon: '🔬' },
      { id: 'mba', name: 'MBA', icon: '💼' }
    ],
    cta_title: 'Need Help Choosing the Right University?',
    cta_subtitle: 'Our expert counselors can help you find the perfect study abroad destination',
    cta_button_text: 'Get Free Counseling',
    cta_button_link: '/counseling',
    why_study_abroad: [
      { title: 'Global Recognition', description: 'Degrees recognized worldwide', icon: '🌐' },
      { title: 'Career Opportunities', description: 'Better job prospects globally', icon: '💼' },
      { title: 'Cultural Exposure', description: 'Experience diverse cultures', icon: '🎭' },
      { title: 'Personal Growth', description: 'Develop independence and skills', icon: '🚀' }
    ],
    // SEO Fields
    auto_generate_seo: true,
    meta_title: 'Study Abroad 2025 - Top Universities Worldwide | Admissionbuddy',
    meta_description: 'Explore 500+ top universities in USA, UK, Canada, Australia. Get expert guidance for your study abroad journey. Apply now!',
    meta_keywords: ['study abroad', 'international universities', 'USA universities', 'UK universities', 'study in Canada'],
    canonical_url: '',
    og_image: '',
    og_title: '',
    og_description: '',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    schema_type: 'WebPage',
    robots: 'index, follow',
    faqs: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/study-abroad-listing-settings');
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
    setSaving(true);
    try {
      await api.put('/study-abroad-listing-settings', settings);
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

  // Stats management
  const addStat = () => {
    setSettings(prev => ({
      ...prev,
      stats: [...prev.stats, { label: 'New Stat', value: '0', icon: '📊' }]
    }));
  };

  const updateStat = (index, field, value) => {
    const newStats = [...settings.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    handleChange('stats', newStats);
  };

  const removeStat = (index) => {
    handleChange('stats', settings.stats.filter((_, i) => i !== index));
  };

  // Featured Countries management
  const addCountry = () => {
    setSettings(prev => ({
      ...prev,
      featured_countries: [...prev.featured_countries, { name: 'New Country', flag: '🏳️', universities: 0, description: '' }]
    }));
  };

  const updateCountry = (index, field, value) => {
    const newCountries = [...settings.featured_countries];
    newCountries[index] = { ...newCountries[index], [field]: value };
    handleChange('featured_countries', newCountries);
  };

  const removeCountry = (index) => {
    handleChange('featured_countries', settings.featured_countries.filter((_, i) => i !== index));
  };

  // Program Types management
  const addProgram = () => {
    setSettings(prev => ({
      ...prev,
      program_types: [...prev.program_types, { id: `program-${Date.now()}`, name: 'New Program', icon: '📖' }]
    }));
  };

  const updateProgram = (index, field, value) => {
    const newPrograms = [...settings.program_types];
    newPrograms[index] = { ...newPrograms[index], [field]: value };
    handleChange('program_types', newPrograms);
  };

  const removeProgram = (index) => {
    handleChange('program_types', settings.program_types.filter((_, i) => i !== index));
  };

  // Why Study Abroad management
  const addWhyItem = () => {
    setSettings(prev => ({
      ...prev,
      why_study_abroad: [...prev.why_study_abroad, { title: 'New Benefit', description: '', icon: '✨' }]
    }));
  };

  const updateWhyItem = (index, field, value) => {
    const newItems = [...settings.why_study_abroad];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('why_study_abroad', newItems);
  };

  const removeWhyItem = (index) => {
    handleChange('why_study_abroad', settings.why_study_abroad.filter((_, i) => i !== index));
  };

  // FAQ management
  const addFaq = () => {
    setSettings(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...settings.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    handleChange('faqs', newFaqs);
  };

  const removeFaq = (index) => {
    handleChange('faqs', settings.faqs.filter((_, i) => i !== index));
  };

  // Keywords management
  const [keywordInput, setKeywordInput] = useState('');
  const addKeyword = () => {
    if (keywordInput.trim() && !settings.meta_keywords.includes(keywordInput.trim())) {
      handleChange('meta_keywords', [...settings.meta_keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    handleChange('meta_keywords', settings.meta_keywords.filter(k => k !== keyword));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Abroad Page Settings</h1>
            <p className="text-gray-600">Control the Study Abroad listing page content and appearance</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
            <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border p-6">
          {/* Hero Section Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Hero Section</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={settings.hero_title}
                    onChange={(e) => handleChange('hero_title', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Background Gradient</label>
                  <input
                    type="text"
                    value={settings.hero_bg_gradient}
                    onChange={(e) => handleChange('hero_bg_gradient', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="from-indigo-600 to-purple-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                <textarea
                  value={settings.hero_subtitle}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hero Background Image URL (optional)</label>
                <input
                  type="text"
                  value={settings.hero_image || ''}
                  onChange={(e) => handleChange('hero_image', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="https://example.com/hero-image.jpg"
                />
              </div>

              {/* Stats */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium">Statistics</label>
                  <Button variant="outline" size="sm" onClick={addStat}>
                    <FiPlus className="mr-1" /> Add Stat
                  </Button>
                </div>
                <div className="space-y-3">
                  {settings.stats.map((stat, index) => (
                    <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={stat.icon}
                        onChange={(e) => updateStat(index, 'icon', e.target.value)}
                        className="w-16 border rounded px-2 py-1.5 text-center text-xl"
                        placeholder="🏛️"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        className="flex-1 border rounded px-3 py-1.5"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        className="w-24 border rounded px-3 py-1.5"
                        placeholder="Value"
                      />
                      <button onClick={() => removeStat(index)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter Options */}
              <div>
                <label className="text-sm font-medium mb-3 block">Filter Options</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.show_country_filter}
                      onChange={(e) => handleChange('show_country_filter', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Country Filter</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.show_ranking_filter}
                      onChange={(e) => handleChange('show_ranking_filter', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Ranking Filter</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.show_tuition_filter}
                      onChange={(e) => handleChange('show_tuition_filter', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Tuition Filter</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.show_program_filter}
                      onChange={(e) => handleChange('show_program_filter', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Program Filter</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Countries & Programs Tab */}
          {activeTab === 'countries' && (
            <div className="space-y-6">
              {/* Featured Countries */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Featured Countries</h2>
                  <Button variant="outline" size="sm" onClick={addCountry}>
                    <FiPlus className="mr-1" /> Add Country
                  </Button>
                </div>
                <div className="space-y-3">
                  {settings.featured_countries.map((country, index) => (
                    <div key={index} className="flex gap-3 items-center p-4 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={country.flag}
                        onChange={(e) => updateCountry(index, 'flag', e.target.value)}
                        className="w-16 border rounded px-2 py-1.5 text-center text-2xl"
                        placeholder="🏳️"
                      />
                      <input
                        type="text"
                        value={country.name}
                        onChange={(e) => updateCountry(index, 'name', e.target.value)}
                        className="w-32 border rounded px-3 py-1.5"
                        placeholder="Country Name"
                      />
                      <input
                        type="number"
                        value={country.universities}
                        onChange={(e) => updateCountry(index, 'universities', parseInt(e.target.value) || 0)}
                        className="w-24 border rounded px-3 py-1.5"
                        placeholder="Count"
                      />
                      <input
                        type="text"
                        value={country.description}
                        onChange={(e) => updateCountry(index, 'description', e.target.value)}
                        className="flex-1 border rounded px-3 py-1.5"
                        placeholder="Description"
                      />
                      <button onClick={() => removeCountry(index)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Types */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Program Types</h2>
                  <Button variant="outline" size="sm" onClick={addProgram}>
                    <FiPlus className="mr-1" /> Add Program
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {settings.program_types.map((program, index) => (
                    <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={program.icon}
                        onChange={(e) => updateProgram(index, 'icon', e.target.value)}
                        className="w-14 border rounded px-2 py-1.5 text-center text-xl"
                        placeholder="📚"
                      />
                      <input
                        type="text"
                        value={program.name}
                        onChange={(e) => updateProgram(index, 'name', e.target.value)}
                        className="flex-1 border rounded px-3 py-1.5"
                        placeholder="Program Name"
                      />
                      <button onClick={() => removeProgram(index)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CTA & Content Tab */}
          {activeTab === 'cta' && (
            <div className="space-y-6">
              {/* CTA Section */}
              <div>
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Call to Action Section</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">CTA Title</label>
                    <input
                      type="text"
                      value={settings.cta_title}
                      onChange={(e) => handleChange('cta_title', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={settings.cta_button_text}
                      onChange={(e) => handleChange('cta_button_text', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2.5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">CTA Subtitle</label>
                    <textarea
                      value={settings.cta_subtitle}
                      onChange={(e) => handleChange('cta_subtitle', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2.5"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CTA Button Link</label>
                    <input
                      type="text"
                      value={settings.cta_button_link}
                      onChange={(e) => handleChange('cta_button_link', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2.5"
                      placeholder="/counseling"
                    />
                  </div>
                </div>
              </div>

              {/* Why Study Abroad */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Why Study Abroad Section</h2>
                  <Button variant="outline" size="sm" onClick={addWhyItem}>
                    <FiPlus className="mr-1" /> Add Item
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.why_study_abroad.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex gap-3 mb-2">
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => updateWhyItem(index, 'icon', e.target.value)}
                          className="w-14 border rounded px-2 py-1.5 text-center text-xl"
                          placeholder="🌐"
                        />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateWhyItem(index, 'title', e.target.value)}
                          className="flex-1 border rounded px-3 py-1.5"
                          placeholder="Title"
                        />
                        <button onClick={() => removeWhyItem(index)} className="text-red-500 hover:text-red-700">
                          <FiTrash2 />
                        </button>
                      </div>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateWhyItem(index, 'description', e.target.value)}
                        className="w-full border rounded px-3 py-1.5"
                        rows="2"
                        placeholder="Description"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEO & FAQs Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* SEO Settings */}
              <div>
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={settings.meta_title}
                      onChange={(e) => handleChange('meta_title', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                    <textarea
                      value={settings.meta_description}
                      onChange={(e) => handleChange('meta_description', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2.5"
                      rows="3"
                    />
                    <p className="text-xs text-gray-500 mt-1">{settings.meta_description.length}/160 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Keywords</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        className="flex-1 border rounded-lg px-4 py-2"
                        placeholder="Add keyword and press Enter"
                      />
                      <Button variant="outline" onClick={addKeyword}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {settings.meta_keywords.map((keyword, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {keyword}
                          <button onClick={() => removeKeyword(keyword)} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">FAQs</h2>
                  <Button variant="outline" size="sm" onClick={addFaq}>
                    <FiPlus className="mr-1" /> Add FAQ
                  </Button>
                </div>
                <div className="space-y-4">
                  {settings.faqs.map((faq, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <label className="text-sm font-medium">Question {index + 1}</label>
                        <button onClick={() => removeFaq(index)} className="text-red-500 hover:text-red-700">
                          <FiTrash2 />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className="w-full border rounded px-4 py-2 mb-2"
                        placeholder="Question"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        className="w-full border rounded px-4 py-2"
                        rows="3"
                        placeholder="Answer"
                      />
                    </div>
                  ))}
                  {settings.faqs.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No FAQs added yet. Click "Add FAQ" to add one.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudyAbroadListingSettings;
