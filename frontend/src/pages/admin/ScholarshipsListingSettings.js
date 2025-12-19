import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const ScholarshipsListingSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    hero_title: 'Scholarships & Financial Aid',
    hero_subtitle: 'Find scholarships to fund your education dreams',
    hero_bg_gradient: 'from-green-600 to-teal-600',
    stats: [
      { label: 'Scholarships Listed', value: '500+', icon: '🎓' },
      { label: 'Total Value', value: '₹50Cr+', icon: '💰' },
      { label: 'Students Benefited', value: '25K+', icon: '👨‍🎓' },
      { label: 'Success Rate', value: '85%', icon: '📈' }
    ],
    scholarship_types: [
      { id: 'merit', name: 'Merit-Based', description: 'Based on academic performance' },
      { id: 'need', name: 'Need-Based', description: 'Based on financial need' },
      { id: 'sports', name: 'Sports Quota', description: 'For athletes and sportspersons' },
      { id: 'minority', name: 'Minority Scholarships', description: 'For minority communities' }
    ],
    education_levels: [
      { id: 'ug', name: 'Undergraduate', count: 200 },
      { id: 'pg', name: 'Postgraduate', count: 150 },
      { id: 'phd', name: 'PhD/Research', count: 50 },
      { id: 'diploma', name: 'Diploma/Certificate', count: 100 }
    ],
    show_deadline_filter: true,
    show_amount_filter: true,
    cta_title: 'Need Help Finding Scholarships?',
    cta_subtitle: 'Our experts can guide you to the right opportunities',
    cta_button_text: 'Get Free Guidance',
    cta_button_link: '/contact',
    meta_title: 'Scholarships 2025 - Find & Apply for Scholarships | Admissionbuddy',
    meta_description: 'Discover 500+ scholarships for Indian students. Merit-based, need-based, and sports scholarships. Apply now and fund your education.',
    meta_keywords: ['scholarships', 'education scholarships', 'merit scholarship', 'student financial aid'],
    faqs: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/scholarships-listing-settings');
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
      await api.put('/scholarships-listing-settings', settings);
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

  const addType = () => {
    setSettings(prev => ({
      ...prev,
      scholarship_types: [...prev.scholarship_types, { id: `type-${Date.now()}`, name: 'New Type', description: '' }]
    }));
  };

  const updateType = (index, field, value) => {
    const newTypes = [...settings.scholarship_types];
    newTypes[index] = { ...newTypes[index], [field]: value };
    handleChange('scholarship_types', newTypes);
  };

  const removeType = (index) => {
    handleChange('scholarship_types', settings.scholarship_types.filter((_, i) => i !== index));
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
    handleChange('faqs', newFaqs);
  };

  const removeFaq = (index) => {
    handleChange('faqs', (settings.faqs || []).filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="p-6 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div></div>;
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Scholarships Page Settings</h1>
            <p className="text-gray-500">Configure the /scholarships listing page</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-green-500 hover:bg-green-600">
            <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">🦸 Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hero Title</label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={settings.hero_subtitle}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background Gradient</label>
              <select
                value={settings.hero_bg_gradient}
                onChange={(e) => handleChange('hero_bg_gradient', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="from-green-600 to-teal-600">Green to Teal</option>
                <option value="from-blue-600 to-indigo-700">Blue to Indigo</option>
                <option value="from-purple-600 to-pink-600">Purple to Pink</option>
                <option value="from-orange-500 to-red-600">Orange to Red</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">📊 Quick Stats</h2>
            <Button type="button" variant="outline" size="sm" onClick={addStat}>
              <FiPlus className="mr-1" /> Add Stat
            </Button>
          </div>
          <div className="space-y-3">
            {settings.stats.map((stat, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                <input
                  type="text"
                  value={stat.icon}
                  onChange={(e) => updateStat(idx, 'icon', e.target.value)}
                  className="w-16 border rounded px-2 py-1 text-center text-xl"
                />
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(idx, 'value', e.target.value)}
                  className="w-24 border rounded px-3 py-1"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(idx, 'label', e.target.value)}
                  className="flex-1 border rounded px-3 py-1"
                />
                <button type="button" onClick={() => removeStat(idx)} className="text-red-500 p-1">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarship Types */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">🎓 Scholarship Types</h2>
            <Button type="button" variant="outline" size="sm" onClick={addType}>
              <FiPlus className="mr-1" /> Add Type
            </Button>
          </div>
          <div className="space-y-3">
            {settings.scholarship_types.map((type, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                <input
                  type="text"
                  value={type.name}
                  onChange={(e) => updateType(idx, 'name', e.target.value)}
                  className="w-48 border rounded px-3 py-1"
                />
                <input
                  type="text"
                  value={type.description}
                  onChange={(e) => updateType(idx, 'description', e.target.value)}
                  className="flex-1 border rounded px-3 py-1"
                />
                <button type="button" onClick={() => removeType(idx)} className="text-red-500 p-1">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">🔧 Filters</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.show_deadline_filter}
                onChange={(e) => handleChange('show_deadline_filter', e.target.checked)}
                className="rounded"
              />
              <span>Show Deadline Filter</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.show_amount_filter}
                onChange={(e) => handleChange('show_amount_filter', e.target.checked)}
                className="rounded"
              />
              <span>Show Amount Filter</span>
            </label>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">📢 CTA Section</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">CTA Title</label>
              <input
                type="text"
                value={settings.cta_title}
                onChange={(e) => handleChange('cta_title', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA Subtitle</label>
              <input
                type="text"
                value={settings.cta_subtitle}
                onChange={(e) => handleChange('cta_subtitle', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <input
                type="text"
                value={settings.cta_button_text}
                onChange={(e) => handleChange('cta_button_text', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button Link</label>
              <input
                type="text"
                value={settings.cta_button_link}
                onChange={(e) => handleChange('cta_button_link', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">🔍 SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Meta Title</label>
              <input
                type="text"
                value={settings.meta_title}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea
                value={settings.meta_description}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">❓ FAQs</h2>
            <Button type="button" variant="outline" size="sm" onClick={addFaq}>
              <FiPlus className="mr-1" /> Add FAQ
            </Button>
          </div>
          <div className="space-y-3">
            {(settings.faqs || []).map((faq, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                    className="flex-1 border rounded px-3 py-1"
                    placeholder="Question"
                  />
                  <button type="button" onClick={() => removeFaq(idx)} className="text-red-500 p-1">
                    <FiTrash2 />
                  </button>
                </div>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                  placeholder="Answer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipsListingSettings;
