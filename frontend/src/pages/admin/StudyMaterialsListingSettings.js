import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const StudyMaterialsListingSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    hero_title: 'Study Materials',
    hero_subtitle: 'Free notes, sample papers, and mock tests for competitive exams',
    hero_bg_gradient: 'from-purple-600 to-indigo-700',
    stats: [
      { label: 'Study Materials', value: '1000+', icon: '📚' },
      { label: 'Exams Covered', value: '50+', icon: '📝' },
      { label: 'Downloads', value: '100K+', icon: '⬇️' },
      { label: 'Students', value: '50K+', icon: '👨‍🎓' }
    ],
    material_types: [
      { id: 'notes', name: 'Study Notes', icon: '📖', description: 'Comprehensive topic-wise notes' },
      { id: 'sample-papers', name: 'Sample Papers', icon: '📄', description: 'Practice with sample questions' },
      { id: 'pyq', name: 'Previous Year Papers', icon: '📋', description: 'Solve past exam papers' },
      { id: 'mock-tests', name: 'Mock Tests', icon: '✍️', description: 'Full-length practice tests' },
      { id: 'videos', name: 'Video Lectures', icon: '🎬', description: 'Learn from expert videos' }
    ],
    exam_categories: [
      { id: 'engineering', name: 'Engineering Exams', exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'] },
      { id: 'medical', name: 'Medical Exams', exams: ['NEET UG', 'NEET PG', 'AIIMS', 'JIPMER'] },
      { id: 'govt', name: 'Government Exams', exams: ['UPSC', 'SSC', 'Banking', 'Railways'] },
      { id: 'management', name: 'Management Exams', exams: ['CAT', 'MAT', 'XAT', 'GMAT'] }
    ],
    show_filters: true,
    show_premium_badge: true,
    premium_cta_text: 'Unlock Premium Materials',
    cta_title: 'Need More Resources?',
    cta_subtitle: 'Get access to premium study materials and expert guidance',
    cta_button_text: 'Upgrade to Premium',
    cta_button_link: '/premium',
    meta_title: 'Study Materials - Free Notes, Sample Papers & Mock Tests | Admissionbuddy',
    meta_description: 'Download free study materials for JEE, NEET, UPSC and more. Get notes, sample papers, previous year questions, and mock tests.',
    meta_keywords: ['study materials', 'free notes', 'sample papers', 'mock tests', 'previous year papers'],
    faqs: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/study-materials-listing-settings');
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
      await api.put('/study-materials-listing-settings', settings);
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

  const addMaterialType = () => {
    setSettings(prev => ({
      ...prev,
      material_types: [...prev.material_types, { id: `type-${Date.now()}`, name: 'New Type', icon: '📚', description: '' }]
    }));
  };

  const updateMaterialType = (index, field, value) => {
    const newTypes = [...settings.material_types];
    newTypes[index] = { ...newTypes[index], [field]: value };
    handleChange('material_types', newTypes);
  };

  const removeMaterialType = (index) => {
    handleChange('material_types', settings.material_types.filter((_, i) => i !== index));
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
    return <div className="p-6 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>;
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Study Materials Page Settings</h1>
            <p className="text-gray-500">Configure the /study-materials listing page</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-purple-500 hover:bg-purple-600">
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
                <option value="from-purple-600 to-indigo-700">Purple to Indigo</option>
                <option value="from-blue-600 to-indigo-700">Blue to Indigo</option>
                <option value="from-green-600 to-teal-600">Green to Teal</option>
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

        {/* Material Types */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">📚 Material Types</h2>
            <Button type="button" variant="outline" size="sm" onClick={addMaterialType}>
              <FiPlus className="mr-1" /> Add Type
            </Button>
          </div>
          <div className="space-y-3">
            {settings.material_types.map((type, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                <input
                  type="text"
                  value={type.icon}
                  onChange={(e) => updateMaterialType(idx, 'icon', e.target.value)}
                  className="w-16 border rounded px-2 py-1 text-center text-xl"
                />
                <input
                  type="text"
                  value={type.name}
                  onChange={(e) => updateMaterialType(idx, 'name', e.target.value)}
                  className="w-40 border rounded px-3 py-1"
                />
                <input
                  type="text"
                  value={type.description}
                  onChange={(e) => updateMaterialType(idx, 'description', e.target.value)}
                  className="flex-1 border rounded px-3 py-1"
                />
                <button type="button" onClick={() => removeMaterialType(idx)} className="text-red-500 p-1">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">⚙️ Features</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.show_filters}
                onChange={(e) => handleChange('show_filters', e.target.checked)}
                className="rounded"
              />
              <span>Show Filter Options</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.show_premium_badge}
                onChange={(e) => handleChange('show_premium_badge', e.target.checked)}
                className="rounded"
              />
              <span>Show Premium Badge on Materials</span>
            </label>
            {settings.show_premium_badge && (
              <div className="ml-6">
                <label className="block text-sm font-medium mb-1">Premium CTA Text</label>
                <input
                  type="text"
                  value={settings.premium_cta_text}
                  onChange={(e) => handleChange('premium_cta_text', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}
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

export default StudyMaterialsListingSettings;
