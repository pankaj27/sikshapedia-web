/**
 * SimplifiedInstitutionForm - A simplified data entry form for institutions
 * (Colleges, Schools, Universities)
 * 
 * Features:
 * - Step-by-step wizard with clear progress
 * - Simplified content builder with drag-and-drop
 * - Auto-generated Table of Contents
 * - Simple menu configuration with toggles
 * - All existing features preserved but presented simply
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import SimpleContentBuilder from '../../components/admin/SimpleContentBuilder';
import SimpleMenuConfig from '../../components/admin/SimpleMenuConfig';
import {
  FiSave, FiArrowLeft, FiArrowRight, FiCheck, FiImage,
  FiMapPin, FiPhone, FiGlobe, FiMail, FiStar, FiAward,
  FiDollarSign, FiCalendar, FiBook, FiInfo, FiEye
} from 'react-icons/fi';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// ===========================================
// STEP COMPONENTS
// ===========================================

// Step 1: Basic Information
const BasicInfoStep = ({ formData, setFormData, entityType }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📝 Basic Information</h2>
        <p className="text-blue-100">Enter the essential details of the {entityType}</p>
      </div>

      {/* Name & URL */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {entityType.charAt(0).toUpperCase() + entityType.slice(1)} Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-lg"
            placeholder={`e.g., ABC ${entityType.charAt(0).toUpperCase() + entityType.slice(1)} of Engineering`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL Slug <span className="text-gray-400">(auto-generated)</span>
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="abc-college-engineering"
          />
          <p className="text-xs text-gray-500 mt-1">URL: /{entityType}s/{formData.slug || 'your-slug'}</p>
        </div>
      </div>

      {/* Logo & Cover Image */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FiImage className="inline mr-1" /> Logo URL
          </label>
          <input
            type="text"
            name="logo"
            value={formData.logo || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="https://example.com/logo.png"
          />
          {formData.logo && (
            <img src={formData.logo} alt="Logo Preview" className="mt-2 h-16 object-contain rounded-lg border" />
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FiImage className="inline mr-1" /> Cover Image URL
          </label>
          <input
            type="text"
            name="cover_image"
            value={formData.cover_image || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="https://example.com/cover.jpg"
          />
          {formData.cover_image && (
            <img src={formData.cover_image} alt="Cover Preview" className="mt-2 h-24 w-full object-cover rounded-lg border" />
          )}
        </div>
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="short_description"
          value={formData.short_description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          placeholder="A brief 2-3 line description of the institution..."
        />
        <p className="text-xs text-gray-500 mt-1">{formData.short_description?.length || 0}/250 characters</p>
      </div>

      {/* Location */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiMapPin className="text-blue-500" /> Location Details
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">City <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
              placeholder="Mumbai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">State <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
              placeholder="Maharashtra"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country || 'India'}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
              placeholder="India"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Full Address</label>
          <textarea
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
            placeholder="Complete address with street, area, pin code..."
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiPhone className="text-green-500" /> Contact Information
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
              placeholder="+91 1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
              placeholder="info@college.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
              placeholder="https://www.college.edu"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiStar className="text-yellow-500" /> Quick Stats
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Established Year</label>
            <input
              type="number"
              name="established_year"
              value={formData.established_year || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
              placeholder="1990"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Rating (0-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating || ''}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
              placeholder="4.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Total Students</label>
            <input
              type="number"
              name="total_students"
              value={formData.total_students || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
              placeholder="5000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Institute Type</label>
            <select
              name="institute_type"
              value={formData.institute_type || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="deemed">Deemed</option>
              <option value="autonomous">Autonomous</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fees & Ranking */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiDollarSign className="text-green-500" /> Fee Range
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Minimum (₹)</label>
              <input
                type="number"
                name="fee_range_min"
                value={formData.fee_range_min || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Maximum (₹)</label>
              <input
                type="number"
                name="fee_range_max"
                value={formData.fee_range_max || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500"
                placeholder="500000"
              />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiAward className="text-yellow-500" /> Ranking
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">NIRF Rank</label>
              <input
                type="number"
                name="nirf_rank"
                value={formData.nirf_rank || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500"
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Accreditation</label>
              <select
                name="accreditation"
                value={formData.accreditation || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500"
              >
                <option value="">Select Grade</option>
                <option value="A++">NAAC A++</option>
                <option value="A+">NAAC A+</option>
                <option value="A">NAAC A</option>
                <option value="B++">NAAC B++</option>
                <option value="B+">NAAC B+</option>
                <option value="B">NAAC B</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Badges / Features */}
      <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-100">
        <h3 className="font-bold text-gray-800 mb-4">🏷️ Features & Badges</h3>
        <div className="flex flex-wrap gap-3">
          {['featured', 'verified', 'admission_open', 'scholarship_available', 'placement_guaranteed'].map(badge => (
            <label key={badge} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData[badge] || false}
                onChange={(e) => setFormData(prev => ({ ...prev, [badge]: e.target.checked }))}
                className="w-5 h-5 rounded text-purple-600"
              />
              <span className="px-3 py-1 bg-white rounded-full text-sm border border-purple-200">
                {badge.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">📊 Publication Status</h3>
        <div className="flex gap-4">
          {['draft', 'pending', 'published'].map(status => (
            <label key={status} className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition ${
              formData.status === status 
                ? status === 'published' ? 'border-green-500 bg-green-50' 
                  : status === 'pending' ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-500 bg-gray-100'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={handleChange}
                className="sr-only"
              />
              <p className="font-bold capitalize">{status}</p>
              <p className="text-xs text-gray-500">
                {status === 'draft' && 'Save as work in progress'}
                {status === 'pending' && 'Ready for review'}
                {status === 'published' && 'Visible on website'}
              </p>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Step 2: Content Builder
const ContentStep = ({ formData, setFormData }) => {
  const [tocItems, setTocItems] = useState([]);

  const handleContentChange = (blocks) => {
    setFormData(prev => ({
      ...prev,
      content_blocks: blocks
    }));
  };

  const handleTocChange = (toc) => {
    setTocItems(toc);
    setFormData(prev => ({
      ...prev,
      seo_toc: toc
    }));
  };

  return (
    <div className="space-y-6">
      {/* SEO Intro */}
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiInfo className="text-blue-500" /> SEO Introduction
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          This short text appears before the "Read More" button on the detail page.
        </p>
        <textarea
          value={formData.seo_intro || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, seo_intro: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
          placeholder="[College Name] is a premier institution established in [Year]. It offers undergraduate and postgraduate programs in various disciplines..."
        />
      </div>

      {/* Content Builder */}
      <SimpleContentBuilder
        value={formData.content_blocks || []}
        onChange={handleContentChange}
        onTocChange={handleTocChange}
        title="Page Content (Drag & Drop)"
        showTocPreview={true}
      />
    </div>
  );
};

// Step 3: Menu & Navigation
const MenuStep = ({ formData, setFormData }) => {
  const tocItems = formData.seo_toc || [];

  const handleMenuChange = (menuConfig) => {
    setFormData(prev => ({
      ...prev,
      menu_config: {
        ...prev.menu_config,
        mode: menuConfig.mode,
        items: menuConfig.items,
        use_custom_menu: menuConfig.mode === 'custom',
        auto_from_toc: menuConfig.mode === 'auto_toc'
      }
    }));
  };

  return (
    <SimpleMenuConfig
      value={{
        mode: formData.menu_config?.auto_from_toc ? 'auto_toc' 
          : formData.menu_config?.use_custom_menu ? 'custom' 
          : 'default',
        items: formData.menu_config?.items || []
      }}
      onChange={handleMenuChange}
      tocItems={tocItems}
    />
  );
};

// Step 4: SEO Settings
const SEOStep = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🔍 SEO Settings</h2>
        <p className="text-purple-100">Optimize for search engines (Google, Bing, etc.)</p>
      </div>

      {/* Meta Title */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Meta Title
        </label>
        <input
          type="text"
          value={formData.meta_title || ''}
          onChange={(e) => handleChange('meta_title', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
          placeholder="Page title for search results (50-60 characters)"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">Appears in browser tab & search results</p>
          <span className={`text-xs ${(formData.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-400'}`}>
            {formData.meta_title?.length || 0}/60
          </span>
        </div>
      </div>

      {/* Meta Description */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Meta Description
        </label>
        <textarea
          value={formData.meta_description || ''}
          onChange={(e) => handleChange('meta_description', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
          placeholder="Brief description for search results (150-160 characters)"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">Appears below title in search results</p>
          <span className={`text-xs ${(formData.meta_description?.length || 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
            {formData.meta_description?.length || 0}/160
          </span>
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Meta Keywords
        </label>
        <input
          type="text"
          value={formData.meta_keywords || ''}
          onChange={(e) => handleChange('meta_keywords', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
          placeholder="college name, city, courses, admissions (comma separated)"
        />
        <p className="text-xs text-gray-500 mt-1">Keywords help search engines understand your content</p>
      </div>

      {/* Search Result Preview */}
      <div className="bg-gray-100 rounded-xl p-6">
        <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FiEye /> Search Result Preview
        </h4>
        <div className="bg-white rounded-lg p-4 border">
          <p className="text-blue-600 text-lg hover:underline cursor-pointer">
            {formData.meta_title || formData.name || 'Page Title'}
          </p>
          <p className="text-green-700 text-sm">
            www.yoursite.com › colleges › {formData.slug || 'slug'}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {formData.meta_description || formData.short_description || 'Page description will appear here...'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN COMPONENT
// ===========================================
const SimplifiedInstitutionForm = ({ entityType = 'college' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: 'draft',
    content_blocks: [],
    seo_toc: [],
    menu_config: { mode: 'default', items: [] }
  });

  // Steps configuration
  const steps = [
    { id: 1, title: 'Basic Info', icon: FiInfo, description: 'Name, location, contact' },
    { id: 2, title: 'Content', icon: FiBook, description: 'Add text, tables, images, videos' },
    { id: 3, title: 'Menu & TOC', icon: FiGlobe, description: 'Navigation & structure' },
    { id: 4, title: 'SEO', icon: FiStar, description: 'Search optimization' },
  ];

  // Load existing data
  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = entityType === 'college' ? 'colleges' 
        : entityType === 'school' ? 'schools' 
        : 'universities';
      
      const response = await fetch(`${API_URL}/api/${endpoint}/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug
  useEffect(() => {
    if (!formData.slug && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100);
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, formData.slug]);

  // Save data
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = entityType === 'college' ? 'colleges' 
        : entityType === 'school' ? 'schools' 
        : 'universities';
      
      const url = isEditing 
        ? `${API_URL}/api/${endpoint}/${id}` 
        : `${API_URL}/api/${endpoint}`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Saved successfully!');
        if (!isEditing) {
          const data = await response.json();
          navigate(`/admin/${entityType}s/simple/edit/${data.id}`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to save: ${errorData.detail || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Navigation
  const goNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? `Edit ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}` : `Add New ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`}
              </h1>
              {formData.name && (
                <p className="text-gray-500">{formData.name}</p>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 font-medium shadow-lg"
            >
              <FiSave size={20} />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

          {/* Step Indicator */}
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                      currentStep === step.id 
                        ? 'bg-orange-500 text-white shadow-lg' 
                        : currentStep > step.id 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === step.id ? 'bg-white/20' 
                        : currentStep > step.id ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {currentStep > step.id ? <FiCheck size={18} /> : <step.icon size={18} />}
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="font-semibold">{step.title}</p>
                      <p className={`text-xs ${currentStep === step.id ? 'text-orange-100' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 rounded-full ${
                      currentStep > step.id ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {currentStep === 1 && (
            <BasicInfoStep formData={formData} setFormData={setFormData} entityType={entityType} />
          )}
          {currentStep === 2 && (
            <ContentStep formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 3 && (
            <MenuStep formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 4 && (
            <SEOStep formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
                currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FiArrowLeft size={20} />
              Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">Step {currentStep} of {steps.length}</p>
              <p className="font-medium">{steps[currentStep - 1].title}</p>
            </div>

            {currentStep < steps.length ? (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium"
              >
                Next
                <FiArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 font-medium"
              >
                <FiCheck size={20} />
                {saving ? 'Saving...' : 'Save & Finish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SimplifiedInstitutionForm;
