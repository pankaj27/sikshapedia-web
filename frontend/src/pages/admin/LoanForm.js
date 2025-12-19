import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage, FiList, FiGrid, FiSettings, FiSearch, FiPlus, FiTrash2, FiEye, FiUpload } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import api from '../../api/axios';
import { generateSlug } from '../../utils/slugify';
import { useAuth } from '../../contexts/AuthContext';

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: FiSettings },
  { id: 'eligibility', label: 'Eligibility', icon: FiList },
  { id: 'media', label: 'Media', icon: FiImage },
  { id: 'content', label: 'Content', icon: FiList },
  { id: 'toc', label: 'TOC', icon: FiList },
  { id: 'tables', label: 'Tables', icon: FiGrid },
  { id: 'seo', label: 'SEO', icon: FiSearch },
];

const LOAN_TYPES = ['Education Loan', 'Study Abroad Loan', 'Collateral Loan', 'Non-Collateral Loan', 'Skill Development Loan'];
const BANK_TYPES = ['Public Sector Bank', 'Private Bank', 'NBFC', 'Foreign Bank', 'Co-operative Bank'];

const LoanForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    slug: '',
    bank_name: '',
    bank_type: 'Public Sector Bank',
    loan_type: 'Education Loan',
    
    // Loan Details
    min_amount: '',
    max_amount: '',
    interest_rate_min: '',
    interest_rate_max: '',
    interest_type: 'Floating', // Fixed, Floating
    processing_fee: '',
    tenure_min: '',
    tenure_max: '',
    moratorium_period: '',
    
    // Short Description
    short_description: '',
    
    // Eligibility
    eligibility_criteria: [],
    min_age: '',
    max_age: '',
    nationality: 'Indian',
    courses_covered: [],
    colleges_covered: '', // All / Select
    countries_covered: [], // For study abroad
    
    // Documents Required
    documents_required: [],
    
    // Media
    featured_image: '',
    featured_image_alt: '',
    bank_logo: '',
    
    // Content
    content: '',
    benefits: [],
    application_process: '',
    repayment_options: '',
    
    // TOC
    toc_enabled: false,
    toc_items: [],
    
    // Tables
    tables: [],
    
    // Contact & Links
    official_website: '',
    application_link: '',
    contact_email: '',
    contact_phone: '',
    branch_locator_link: '',
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    canonical_url: '',
    og_image: '',
    
    // Status
    is_active: true,
    is_featured: false,
    views: 0,
    applications: 0,
    
    // FAQs
    faqs: [],
    
    created_by: '',
  });

  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (user && !isEdit) {
      setFormData(prev => ({ ...prev, created_by: user.id }));
    }
  }, [user, isEdit]);

  useEffect(() => {
    if (isEdit) {
      fetchLoan();
    }
  }, [id]);

  useEffect(() => {
    if (!isEdit && formData.name && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.name) }));
    }
  }, [formData.name, isEdit]);

  const fetchLoan = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/loans/${id}`);
      setFormData(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching loan:', error);
      alert('Failed to load loan');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/loans/${id}`, formData);
      } else {
        await api.post('/loans', formData);
      }
      navigate('/admin/loans');
    } catch (error) {
      console.error('Error saving loan:', error);
      alert('Error saving loan');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file, field) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const response = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleChange(field, response.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed');
    }
  };

  // Array field helpers
  const addArrayItem = (field, defaultItem) => {
    handleChange(field, [...(formData[field] || []), defaultItem]);
  };

  const updateArrayItem = (field, index, value) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    handleChange(field, newArray);
  };

  const removeArrayItem = (field, index) => {
    handleChange(field, (formData[field] || []).filter((_, i) => i !== index));
  };

  // TOC management
  const addTocItem = () => {
    handleChange('toc_items', [...formData.toc_items, { id: `section-${Date.now()}`, title: '', level: 1 }]);
  };

  const updateTocItem = (index, field, value) => {
    const newItems = [...formData.toc_items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('toc_items', newItems);
  };

  // Table management
  const addTable = () => {
    handleChange('tables', [...formData.tables, {
      title: 'New Table',
      headers: ['Column 1', 'Column 2'],
      rows: [['', '']],
    }]);
  };

  const updateTable = (tableIndex, field, value) => {
    const newTables = [...formData.tables];
    newTables[tableIndex] = { ...newTables[tableIndex], [field]: value };
    handleChange('tables', newTables);
  };

  const addTableRow = (tableIndex) => {
    const newTables = [...formData.tables];
    newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
    handleChange('tables', newTables);
  };

  const updateTableCell = (tableIndex, rowIndex, colIndex, value) => {
    const newTables = [...formData.tables];
    newTables[tableIndex].rows[rowIndex][colIndex] = value;
    handleChange('tables', newTables);
  };

  const updateTableHeader = (tableIndex, colIndex, value) => {
    const newTables = [...formData.tables];
    newTables[tableIndex].headers[colIdx] = value;
    handleChange('tables', newTables);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.meta_keywords.includes(keywordInput.trim())) {
      handleChange('meta_keywords', [...formData.meta_keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/loans" className="text-gray-600 hover:text-gray-900">
                <FiArrowLeft size={24} />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {isEdit ? 'Edit Loan' : 'Create Education Loan'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.open(`/loans/${formData.slug}`, '_blank')} disabled={!formData.slug}>
                <FiEye className="mr-2" /> Preview
              </Button>
              <Button onClick={handleSubmit} disabled={saving} className="bg-blue-500 hover:bg-blue-600">
                <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save Loan'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Tabs */}
        <aside className="w-56 bg-white border-r min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Form */}
        <main className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
            
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🏦 Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Loan Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="e.g., SBI Education Loan"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5 bg-gray-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Bank/Lender Name *</label>
                        <input
                          type="text"
                          value={formData.bank_name}
                          onChange={(e) => handleChange('bank_name', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                          placeholder="e.g., State Bank of India"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Bank Type</label>
                        <select
                          value={formData.bank_type}
                          onChange={(e) => handleChange('bank_type', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                        >
                          {BANK_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Loan Type *</label>
                      <select
                        value={formData.loan_type}
                        onChange={(e) => handleChange('loan_type', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      >
                        {LOAN_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Short Description</label>
                      <textarea
                        value={formData.short_description}
                        onChange={(e) => handleChange('short_description', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        rows="3"
                        placeholder="Brief overview of the loan"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => handleChange('is_featured', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Featured Loan</span>
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
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">💰 Loan Details</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Minimum Amount</label>
                        <input
                          type="text"
                          value={formData.min_amount}
                          onChange={(e) => handleChange('min_amount', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                          placeholder="e.g., ₹50,000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Maximum Amount</label>
                        <input
                          type="text"
                          value={formData.max_amount}
                          onChange={(e) => handleChange('max_amount', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                          placeholder="e.g., ₹1.5 Crore"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Interest Rate (Min)</label>
                        <input
                          type="text"
                          value={formData.interest_rate_min}
                          onChange={(e) => handleChange('interest_rate_min', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                          placeholder="e.g., 7.5%"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Interest Rate (Max)</label>
                        <input
                          type="text"
                          value={formData.interest_rate_max}
                          onChange={(e) => handleChange('interest_rate_max', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                          placeholder="e.g., 10.5%"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Interest Type</label>
                        <select
                          value={formData.interest_type}
                          onChange={(e) => handleChange('interest_type', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                        >
                          <option value="Fixed">Fixed</option>
                          <option value="Floating">Floating</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Processing Fee</label>
                        <input
                          type="text"
                          value={formData.processing_fee}
                          onChange={(e) => handleChange('processing_fee', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                          placeholder="e.g., 0.5% or ₹10,000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tenure (Min)</label>
                        <input
                          type="text"
                          value={formData.tenure_min}
                          onChange={(e) => handleChange('tenure_min', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                          placeholder="e.g., 5 years"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tenure (Max)</label>
                        <input
                          type="text"
                          value={formData.tenure_max}
                          onChange={(e) => handleChange('tenure_max', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                          placeholder="e.g., 15 years"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Moratorium Period</label>
                      <input
                        type="text"
                        value={formData.moratorium_period}
                        onChange={(e) => handleChange('moratorium_period', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="e.g., Course duration + 1 year"
                      />
                    </div>
                  </div>
                </div>

                {/* Links & Contact */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🔗 Links & Contact</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Official Website</label>
                      <input
                        type="url"
                        value={formData.official_website}
                        onChange={(e) => handleChange('official_website', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Application Link</label>
                      <input
                        type="url"
                        value={formData.application_link}
                        onChange={(e) => handleChange('application_link', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => handleChange('contact_email', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => handleChange('contact_phone', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Eligibility Tab */}
            {activeTab === 'eligibility' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">✅ Eligibility Criteria</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Minimum Age</label>
                        <input
                          type="text"
                          value={formData.min_age}
                          onChange={(e) => handleChange('min_age', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                          placeholder="e.g., 18 years"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Maximum Age</label>
                        <input
                          type="text"
                          value={formData.max_age}
                          onChange={(e) => handleChange('max_age', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                          placeholder="e.g., 35 years"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nationality</label>
                        <select
                          value={formData.nationality}
                          onChange={(e) => handleChange('nationality', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                        >
                          <option value="Indian">Indian</option>
                          <option value="NRI">NRI</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                    </div>

                    {/* Eligibility Points */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Eligibility Requirements</label>
                        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('eligibility_criteria', '')}>
                          <FiPlus className="mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(formData.eligibility_criteria || []).map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateArrayItem('eligibility_criteria', idx, e.target.value)}
                              className="flex-1 border rounded px-3 py-2"
                              placeholder="Requirement"
                            />
                            <button type="button" onClick={() => removeArrayItem('eligibility_criteria', idx)} className="text-red-500 p-2">
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Courses Covered */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Courses Covered</label>
                        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('courses_covered', '')}>
                          <FiPlus className="mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(formData.courses_covered || []).map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateArrayItem('courses_covered', idx, e.target.value)}
                              className="flex-1 border rounded px-3 py-2"
                              placeholder="Course name"
                            />
                            <button type="button" onClick={() => removeArrayItem('courses_covered', idx)} className="text-red-500 p-2">
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Documents Required */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Documents Required</label>
                        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('documents_required', '')}>
                          <FiPlus className="mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(formData.documents_required || []).map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateArrayItem('documents_required', idx, e.target.value)}
                              className="flex-1 border rounded px-3 py-2"
                              placeholder="Document name"
                            />
                            <button type="button" onClick={() => removeArrayItem('documents_required', idx)} className="text-red-500 p-2">
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🖼️ Featured Image</h2>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(file, 'featured_image');
                            if (!formData.featured_image_alt && formData.name) {
                              handleChange('featured_image_alt', formData.name);
                            }
                          }
                        }}
                        className="hidden"
                        id="featured-image-upload"
                      />
                      <label htmlFor="featured-image-upload" className="cursor-pointer">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm font-medium">Click to upload image</p>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <input
                        type="url"
                        value={formData.featured_image}
                        onChange={(e) => handleChange('featured_image', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>

                    {formData.featured_image && (
                      <img src={formData.featured_image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium">Alt Text (SEO)</label>
                        <button
                          type="button"
                          onClick={() => handleChange('featured_image_alt', `${formData.name} | ${formData.bank_name} Education Loan`)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          ⚡ Auto-Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        value={formData.featured_image_alt}
                        onChange={(e) => handleChange('featured_image_alt', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🏦 Bank Logo</h2>
                  <input
                    type="url"
                    value={formData.bank_logo}
                    onChange={(e) => handleChange('bank_logo', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Bank logo URL"
                  />
                  {formData.bank_logo && (
                    <img src={formData.bank_logo} alt="Bank Logo" className="mt-3 h-16 object-contain" />
                  )}
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">📄 Detailed Content</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Description (HTML)</label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                        className="w-full border rounded-lg px-4 py-3 font-mono text-sm"
                        rows="12"
                        placeholder="<h2>About the Loan</h2><p>...</p>"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Application Process</label>
                      <textarea
                        value={formData.application_process}
                        onChange={(e) => handleChange('application_process', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        rows="4"
                        placeholder="Step-by-step application process"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Repayment Options</label>
                      <textarea
                        value={formData.repayment_options}
                        onChange={(e) => handleChange('repayment_options', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        rows="4"
                        placeholder="Available repayment options"
                      />
                    </div>

                    {/* Benefits */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Key Benefits</label>
                        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('benefits', '')}>
                          <FiPlus className="mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(formData.benefits || []).map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateArrayItem('benefits', idx, e.target.value)}
                              className="flex-1 border rounded px-3 py-2"
                              placeholder="Benefit"
                            />
                            <button type="button" onClick={() => removeArrayItem('benefits', idx)} className="text-red-500 p-2">
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOC Tab */}
            {activeTab === 'toc' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">📑 Table of Contents</h2>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.toc_enabled}
                      onChange={(e) => handleChange('toc_enabled', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Enable TOC</span>
                  </label>
                </div>
                
                {formData.toc_enabled && (
                  <div className="space-y-3">
                    {formData.toc_items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                        <select
                          value={item.level}
                          onChange={(e) => updateTocItem(idx, 'level', parseInt(e.target.value))}
                          className="border rounded px-2 py-1.5 text-sm w-20"
                        >
                          <option value={1}>H2</option>
                          <option value={2}>H3</option>
                        </select>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateTocItem(idx, 'title', e.target.value)}
                          className="flex-1 border rounded px-3 py-1.5"
                          placeholder="Section title"
                        />
                        <button type="button" onClick={() => removeArrayItem('toc_items', idx)} className="text-red-500">
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addTocItem} className="w-full border-dashed">
                      <FiPlus className="mr-2" /> Add TOC Item
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Tables Tab */}
            {activeTab === 'tables' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">📊 Data Tables</h2>
                  <Button type="button" variant="outline" onClick={addTable}>
                    <FiPlus className="mr-2" /> Add Table
                  </Button>
                </div>
                
                {formData.tables.map((table, tableIdx) => (
                  <div key={tableIdx} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={table.title}
                        onChange={(e) => updateTable(tableIdx, 'title', e.target.value)}
                        className="text-lg font-semibold border-b border-transparent hover:border-gray-300 outline-none"
                        placeholder="Table Title"
                      />
                      <button type="button" onClick={() => removeArrayItem('tables', tableIdx)} className="text-red-500">
                        <FiTrash2 />
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            {table.headers.map((header, colIdx) => (
                              <th key={colIdx} className="border bg-gray-100 p-2">
                                <input
                                  type="text"
                                  value={header}
                                  onChange={(e) => {
                                    const newTables = [...formData.tables];
                                    newTables[tableIdx].headers[colIdx] = e.target.value;
                                    handleChange('tables', newTables);
                                  }}
                                  className="w-full bg-transparent text-center font-semibold outline-none"
                                />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {row.map((cell, colIdx) => (
                                <td key={colIdx} className="border p-2">
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => updateTableCell(tableIdx, rowIdx, colIdx, e.target.value)}
                                    className="w-full bg-transparent outline-none"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <Button type="button" variant="outline" size="sm" onClick={() => addTableRow(tableIdx)} className="mt-3">
                      + Row
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🔍 SEO Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={formData.meta_title}
                        onChange={(e) => handleChange('meta_title', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                      <p className="text-xs text-gray-500 mt-1">{(formData.meta_title || '').length}/60</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Meta Description</label>
                      <textarea
                        value={formData.meta_description}
                        onChange={(e) => handleChange('meta_description', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        rows="3"
                      />
                      <p className="text-xs text-gray-500 mt-1">{(formData.meta_description || '').length}/160</p>
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
                        />
                        <Button type="button" variant="outline" onClick={addKeyword}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData.meta_keywords || []).map((kw, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {kw}
                            <button type="button" onClick={() => removeArrayItem('meta_keywords', idx)}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">OG Image URL</label>
                      <input
                        type="url"
                        value={formData.og_image}
                        onChange={(e) => handleChange('og_image', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">👁️ Search Preview</h2>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-blue-600 text-lg hover:underline">
                      {formData.meta_title || formData.name || 'Loan Title'}
                    </p>
                    <p className="text-green-700 text-sm">
                      {window.location.origin}/loans/{formData.slug || 'slug'}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {formData.meta_description || formData.short_description || 'Meta description...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </form>
        </main>
      </div>
    </div>
  );
};

export default LoanForm;
