import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiGlobe, FiMapPin, FiDollarSign, FiAward, FiBook, FiSettings } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Singapore', 'Ireland', 'New Zealand', 'Switzerland', 'Sweden', 'Italy', 'Spain', 'Japan', 'South Korea', 'China', 'UAE', 'Other'];

const PROGRAMS = ['Engineering', 'Computer Science', 'Business/MBA', 'Medicine', 'Law', 'Arts & Humanities', 'Sciences', 'Social Sciences', 'Architecture', 'Design', 'Data Science', 'AI/ML', 'Finance', 'Marketing', 'Psychology', 'Education', 'Nursing', 'Pharmacy'];

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: FiGlobe },
  { id: 'rankings', label: 'Rankings', icon: FiAward },
  { id: 'programs', label: 'Programs', icon: FiBook },
  { id: 'fees', label: 'Fees & Costs', icon: FiDollarSign },
  { id: 'requirements', label: 'Requirements', icon: FiSettings },
  { id: 'seo', label: 'SEO', icon: FiSettings },
];

const StudyAbroadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: '',
    city: '',
    description: '',
    website: '',
    
    // Rankings
    ranking: {
      qs: '',
      the: '',
      arwu: '',
      usnews: '',
    },
    
    // Programs
    programs: [],
    
    // Fees
    tuition_fees: {
      currency: 'USD',
      min: '',
      max: '',
      notes: '',
    },
    living_cost: {
      currency: 'USD',
      monthly: '',
      notes: '',
    },
    
    // Requirements
    language_requirements: {
      ielts: '',
      toefl: '',
      pte: '',
      duolingo: '',
    },
    acceptance_rate: '',
    application_deadline: '',
    application_fee: '',
    
    // Media
    images: [],
    logo: '',
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    auto_generate_seo: true,
    
    // Status
    is_featured: false,
    is_active: true,
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [programInput, setProgramInput] = useState('');

  useEffect(() => {
    if (id) {
      fetchUniversity();
    }
  }, [id]);

  // Auto-generate slug
  useEffect(() => {
    if (!isEdit && formData.name) {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, isEdit]);

  // Auto-generate SEO
  useEffect(() => {
    if (formData.auto_generate_seo && formData.name) {
      const autoSeo = {};
      const newTitle = `${formData.name} - Study in ${formData.country || 'Abroad'} | Admissionbuddy`;
      if (formData.meta_title !== newTitle) {
        autoSeo.meta_title = newTitle;
      }
      if (formData.description && !formData.meta_description) {
        autoSeo.meta_description = formData.description.slice(0, 160);
      }
      if (Object.keys(autoSeo).length > 0) {
        setFormData(prev => ({ ...prev, ...autoSeo }));
      }
    }
  }, [formData.name, formData.country, formData.description, formData.auto_generate_seo]);

  const fetchUniversity = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/study-abroad/${id}`);
      setFormData(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching university:', error);
      alert('Failed to load university');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/study-abroad/${id}`, formData);
      } else {
        await api.post('/study-abroad', formData);
      }
      alert(isEdit ? 'University updated!' : 'University created!');
      navigate('/admin/study-abroad');
    } catch (error) {
      console.error('Error saving university:', error);
      alert('Failed to save university');
    } finally {
      setSaving(false);
    }
  };

  const addProgram = () => {
    if (programInput && !formData.programs.includes(programInput)) {
      setFormData(prev => ({ ...prev, programs: [...prev.programs, programInput] }));
      setProgramInput('');
    }
  };

  const removeProgram = (program) => {
    setFormData(prev => ({ ...prev, programs: prev.programs.filter(p => p !== program) }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.meta_keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({ ...prev, meta_keywords: [...prev.meta_keywords, keywordInput.trim()] }));
      setKeywordInput('');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/study-abroad')}>
              <FiArrowLeft className="mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit University' : 'Add New University'}
              </h1>
              <p className="text-gray-500">Study Abroad Program</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => handleChange('is_featured', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Active</span>
            </label>
            <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
              <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save University'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h2 className="text-lg font-semibold">🌍 Basic Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">University Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="e.g., Massachusetts Institute of Technology"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  required
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="e.g., Cambridge"
                  required
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  rows="4"
                  placeholder="Brief description of the university..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="https://www.mit.edu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h2 className="text-lg font-semibold">🏆 World Rankings</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">QS World Ranking</label>
                <input
                  type="number"
                  value={formData.ranking?.qs || ''}
                  onChange={(e) => handleNestedChange('ranking', 'qs', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="e.g., 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Times Higher Education</label>
                <input
                  type="number"
                  value={formData.ranking?.the || ''}
                  onChange={(e) => handleNestedChange('ranking', 'the', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="e.g., 5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">ARWU (Shanghai)</label>
                <input
                  type="number"
                  value={formData.ranking?.arwu || ''}
                  onChange={(e) => handleNestedChange('ranking', 'arwu', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="e.g., 3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">US News Ranking</label>
                <input
                  type="number"
                  value={formData.ranking?.usnews || ''}
                  onChange={(e) => handleNestedChange('ranking', 'usnews', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="e.g., 2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Acceptance Rate (%)</label>
              <input
                type="number"
                value={formData.acceptance_rate || ''}
                onChange={(e) => handleChange('acceptance_rate', e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 max-w-xs"
                placeholder="e.g., 4.5"
                step="0.1"
              />
            </div>
          </div>
        )}

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h2 className="text-lg font-semibold">📚 Programs Offered</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Quick Add Popular Programs</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {PROGRAMS.filter(p => !formData.programs.includes(p)).map(program => (
                  <button
                    key={program}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, programs: [...prev.programs, program] }))}
                    className="px-3 py-1.5 border rounded-full text-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
                  >
                    + {program}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Add Custom Program</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={programInput}
                  onChange={(e) => setProgramInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProgram())}
                  className="flex-1 border rounded-lg px-4 py-2"
                  placeholder="Enter program name"
                />
                <Button type="button" variant="outline" onClick={addProgram}>
                  <FiPlus className="mr-1" /> Add
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Selected Programs ({formData.programs.length})</label>
              <div className="flex flex-wrap gap-2">
                {formData.programs.map(program => (
                  <span
                    key={program}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {program}
                    <button type="button" onClick={() => removeProgram(program)} className="hover:text-red-500">
                      ×
                    </button>
                  </span>
                ))}
                {formData.programs.length === 0 && (
                  <p className="text-gray-500 text-sm">No programs added yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h2 className="text-lg font-semibold">💰 Fees & Living Costs</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Tuition Fees (per year)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Currency</label>
                    <select
                      value={formData.tuition_fees?.currency || 'USD'}
                      onChange={(e) => handleNestedChange('tuition_fees', 'currency', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={formData.tuition_fees?.min || ''}
                      onChange={(e) => handleNestedChange('tuition_fees', 'min', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="30000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={formData.tuition_fees?.max || ''}
                      onChange={(e) => handleNestedChange('tuition_fees', 'max', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="60000"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Living Costs (per month)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Currency</label>
                    <select
                      value={formData.living_cost?.currency || 'USD'}
                      onChange={(e) => handleNestedChange('living_cost', 'currency', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Monthly Cost</label>
                    <input
                      type="number"
                      value={formData.living_cost?.monthly || ''}
                      onChange={(e) => handleNestedChange('living_cost', 'monthly', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="2000"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Application Fee</label>
              <input
                type="text"
                value={formData.application_fee || ''}
                onChange={(e) => handleChange('application_fee', e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 max-w-xs"
                placeholder="e.g., $75"
              />
            </div>
          </div>
        )}

        {/* Requirements Tab */}
        {activeTab === 'requirements' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h2 className="text-lg font-semibold">📋 Admission Requirements</h2>
            
            <div>
              <h3 className="font-medium mb-3">Language Requirements (Minimum Scores)</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">IELTS</label>
                  <input
                    type="text"
                    value={formData.language_requirements?.ielts || ''}
                    onChange={(e) => handleNestedChange('language_requirements', 'ielts', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="7.0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">TOEFL</label>
                  <input
                    type="text"
                    value={formData.language_requirements?.toefl || ''}
                    onChange={(e) => handleNestedChange('language_requirements', 'toefl', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">PTE</label>
                  <input
                    type="text"
                    value={formData.language_requirements?.pte || ''}
                    onChange={(e) => handleNestedChange('language_requirements', 'pte', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="68"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Duolingo</label>
                  <input
                    type="text"
                    value={formData.language_requirements?.duolingo || ''}
                    onChange={(e) => handleNestedChange('language_requirements', 'duolingo', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="120"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Application Deadline</label>
              <input
                type="text"
                value={formData.application_deadline || ''}
                onChange={(e) => handleChange('application_deadline', e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 max-w-md"
                placeholder="e.g., January 1, 2026 (Fall intake)"
              />
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">🔍 SEO Settings</h2>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.auto_generate_seo}
                  onChange={(e) => handleChange('auto_generate_seo', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto-generate from content</span>
              </label>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title || ''}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="SEO title"
                />
                <p className="text-xs text-gray-500 mt-1">{(formData.meta_title || '').length}/60 characters</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={formData.meta_description || ''}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  rows="3"
                  placeholder="SEO description"
                />
                <p className="text-xs text-gray-500 mt-1">{(formData.meta_description || '').length}/160 characters</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Meta Keywords</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    className="flex-1 border rounded-lg px-4 py-2"
                    placeholder="Add keyword"
                  />
                  <Button type="button" variant="outline" onClick={addKeyword}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.meta_keywords || []).map((kw, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {kw}
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, meta_keywords: prev.meta_keywords.filter((_, i) => i !== idx) }))}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Search Preview */}
            <div className="border-t pt-6">
              <h3 className="font-medium mb-3">👁️ Search Preview</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {formData.meta_title || `${formData.name} - Study in ${formData.country} | Admissionbuddy`}
                </p>
                <p className="text-green-700 text-sm">
                  {window.location.origin}/study-abroad/{formData.slug || 'university-slug'}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {formData.meta_description || formData.description?.slice(0, 160) || 'University description...'}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
};

export default StudyAbroadForm;
