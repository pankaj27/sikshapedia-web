import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AdminLayout from '../../components/admin/AdminLayout';

const CollapsibleSection = ({ title, children, defaultOpen = false, icon = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg mb-4 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
      >
        <span className="font-semibold flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

const ListingPageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    url_slug: '',
    page_type: 'india',
    institution_type: 'colleges',
    state: '',
    city: '',
    stream: '',
    course: '',
    college_type: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    canonical_url: '',
    page_title: '',
    page_subtitle: '',
    introduction: '',
    content_sections: [],
    tables: [],
    faqs: [],
    related_pages: [],
    is_published: true
  });

  const pageTypes = [
    { value: 'india', label: 'India Page', example: 'india-colleges' },
    { value: 'state', label: 'State Page', example: 'maharashtra-colleges' },
    { value: 'city', label: 'City Page', example: 'mumbai-colleges' },
    { value: 'stream', label: 'Stream Page', example: 'engineering' },
    { value: 'course', label: 'Course Page', example: 'btech' },
    { value: 'type', label: 'College Type Page', example: 'government-colleges' },
    { value: 'accreditation', label: 'Accreditation Page', example: 'naac-a-plus-colleges' }
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  const streams = [
    'Engineering', 'Medical', 'Management', 'Law', 'Arts', 'Science', 
    'Commerce', 'Education', 'Pharmacy', 'Architecture', 'Design',
    'Agriculture', 'Nursing', 'Dental', 'Hotel Management'
  ];

  const collegeTypes = ['Government', 'Private', 'Deemed', 'Autonomous', 'Aided'];

  useEffect(() => {
    if (isEditing) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/listing-pages/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching page:', error);
      alert('Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const autoGenerateSlug = () => {
    let slug = '';
    const inst = formData.institution_type || 'colleges';
    
    switch (formData.page_type) {
      case 'india':
        slug = `india-${inst}`;
        break;
      case 'state':
        slug = formData.state ? `${generateSlug(formData.state)}-${inst}` : '';
        break;
      case 'city':
        slug = formData.city ? `${generateSlug(formData.city)}-${inst}` : '';
        break;
      case 'stream':
        slug = formData.stream ? generateSlug(formData.stream) : '';
        break;
      case 'course':
        slug = formData.course ? generateSlug(formData.course) : '';
        break;
      case 'type':
        slug = formData.college_type ? `${generateSlug(formData.college_type)}-${inst}` : '';
        break;
      case 'accreditation':
        slug = formData.meta_title ? generateSlug(formData.meta_title.split(' ')[0]) + `-${inst}` : '';
        break;
      default:
        slug = '';
    }
    handleChange('url_slug', slug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.url_slug) {
      alert('URL Slug is required');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await api.put(`/listing-pages/${id}`, formData);
      } else {
        await api.post('/listing-pages', formData);
      }
      navigate('/admin/listing-pages');
    } catch (error) {
      console.error('Error saving page:', error);
      alert(error.response?.data?.detail || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  // Content Sections handlers
  const addContentSection = () => {
    setFormData(prev => ({
      ...prev,
      content_sections: [...prev.content_sections, { title: '', content: '', order: prev.content_sections.length }]
    }));
  };

  const updateContentSection = (index, field, value) => {
    const updated = [...formData.content_sections];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, content_sections: updated }));
  };

  const removeContentSection = (index) => {
    setFormData(prev => ({
      ...prev,
      content_sections: prev.content_sections.filter((_, i) => i !== index)
    }));
  };

  // FAQ handlers
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFaq = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, faqs: updated }));
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Table handlers
  const addTable = () => {
    setFormData(prev => ({
      ...prev,
      tables: [...prev.tables, { title: '', headers: ['Column 1', 'Column 2'], rows: [['', '']] }]
    }));
  };

  const updateTable = (index, field, value) => {
    const updated = [...formData.tables];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, tables: updated }));
  };

  const removeTable = (index) => {
    setFormData(prev => ({
      ...prev,
      tables: prev.tables.filter((_, i) => i !== index)
    }));
  };

  // Related Pages handlers
  const addRelatedPage = () => {
    setFormData(prev => ({
      ...prev,
      related_pages: [...prev.related_pages, { title: '', url: '' }]
    }));
  };

  const updateRelatedPage = (index, field, value) => {
    const updated = [...formData.related_pages];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, related_pages: updated }));
  };

  const removeRelatedPage = (index) => {
    setFormData(prev => ({
      ...prev,
      related_pages: prev.related_pages.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/admin/listing-pages')}>
            <FiArrowLeft className="mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEditing ? 'Edit' : 'Add'} Listing Page Content</h1>
            <p className="text-gray-600 text-sm">Add SEO content, FAQs, and more for listing pages</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Configuration */}
          <CollapsibleSection title="Page Configuration" icon="⚙️" defaultOpen={true}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Page Type *</label>
                <select
                  value={formData.page_type}
                  onChange={(e) => handleChange('page_type', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {pageTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} (e.g., /{type.example})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Institution Type *</label>
                <select
                  value={formData.institution_type}
                  onChange={(e) => handleChange('institution_type', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="colleges">Colleges</option>
                  <option value="schools">Schools</option>
                  <option value="universities">Universities</option>
                </select>
              </div>
            </div>

            {/* Conditional Fields based on page_type */}
            {formData.page_type === 'state' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select State *</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.page_type === 'city' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">City Name *</label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter city name (e.g., Mumbai)"
                />
              </div>
            )}

            {formData.page_type === 'stream' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Stream *</label>
                <select
                  value={formData.stream}
                  onChange={(e) => handleChange('stream', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.page_type === 'course' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Course Name *</label>
                <Input
                  value={formData.course}
                  onChange={(e) => handleChange('course', e.target.value)}
                  placeholder="Enter course name (e.g., B.Tech, MBA)"
                />
              </div>
            )}

            {formData.page_type === 'type' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">College Type *</label>
                <select
                  value={formData.college_type}
                  onChange={(e) => handleChange('college_type', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Type</option>
                  {collegeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">URL Slug *</label>
              <div className="flex gap-2">
                <Input
                  value={formData.url_slug}
                  onChange={(e) => handleChange('url_slug', e.target.value)}
                  placeholder="e.g., maharashtra-colleges"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={autoGenerateSlug}>
                  Auto Generate
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">URL will be: /{formData.url_slug || 'your-slug'}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => handleChange('is_published', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="is_published" className="text-sm">Publish this page</label>
            </div>
          </CollapsibleSection>

          {/* SEO Meta Tags */}
          <CollapsibleSection title="SEO Meta Tags" icon="🏷️" defaultOpen={true}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meta Title</label>
                <Input
                  value={formData.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  placeholder="SEO title for this page"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.meta_title?.length || 0}/60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  placeholder="SEO description for this page"
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.meta_description?.length || 0}/160 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Canonical URL</label>
                <Input
                  value={formData.canonical_url}
                  onChange={(e) => handleChange('canonical_url', e.target.value)}
                  placeholder="https://yoursite.com/page-url"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Page Content */}
          <CollapsibleSection title="Page Content" icon="📝" defaultOpen={true}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Page Title (H1)</label>
                <Input
                  value={formData.page_title}
                  onChange={(e) => handleChange('page_title', e.target.value)}
                  placeholder="e.g., Top Colleges in Maharashtra 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Page Subtitle</label>
                <Input
                  value={formData.page_subtitle}
                  onChange={(e) => handleChange('page_subtitle', e.target.value)}
                  placeholder="e.g., Find the best colleges with placements, rankings & more"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Introduction</label>
                <textarea
                  value={formData.introduction}
                  onChange={(e) => handleChange('introduction', e.target.value)}
                  placeholder="Write an introduction paragraph for this listing page..."
                  className="w-full border rounded px-3 py-2"
                  rows={5}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Content Sections */}
          <CollapsibleSection title="Content Sections" icon="📄" defaultOpen={false}>
            {formData.content_sections.map((section, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">Section {index + 1}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => removeContentSection(index)}>
                    <FiTrash2 size={14} />
                  </Button>
                </div>
                <Input
                  value={section.title}
                  onChange={(e) => updateContentSection(index, 'title', e.target.value)}
                  placeholder="Section Title"
                  className="mb-2"
                />
                <textarea
                  value={section.content}
                  onChange={(e) => updateContentSection(index, 'content', e.target.value)}
                  placeholder="Section Content (HTML supported)"
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                />
              </div>
            ))}
            <Button type="button" onClick={addContentSection} size="sm">
              <FiPlus className="mr-2" /> Add Section
            </Button>
          </CollapsibleSection>

          {/* FAQs */}
          <CollapsibleSection title="FAQs" icon="❓" defaultOpen={false}>
            {formData.faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">FAQ {index + 1}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => removeFaq(index)}>
                    <FiTrash2 size={14} />
                  </Button>
                </div>
                <Input
                  value={faq.question}
                  onChange={(e) => updateFaq(index, 'question', e.target.value)}
                  placeholder="Question"
                  className="mb-2"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                  placeholder="Answer"
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
            ))}
            <Button type="button" onClick={addFaq} size="sm">
              <FiPlus className="mr-2" /> Add FAQ
            </Button>
          </CollapsibleSection>

          {/* Related Pages */}
          <CollapsibleSection title="Related Pages (Internal Links)" icon="🔗" defaultOpen={false}>
            {formData.related_pages.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={link.title}
                  onChange={(e) => updateRelatedPage(index, 'title', e.target.value)}
                  placeholder="Link Title"
                  className="flex-1"
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateRelatedPage(index, 'url', e.target.value)}
                  placeholder="/url-slug"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={() => removeRelatedPage(index)}>
                  <FiTrash2 size={14} />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addRelatedPage} size="sm">
              <FiPlus className="mr-2" /> Add Related Page
            </Button>
          </CollapsibleSection>

          {/* Submit */}
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/listing-pages')}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-orange-600 hover:bg-orange-700">
              <FiSave className="mr-2" />
              {saving ? 'Saving...' : (isEditing ? 'Update Page' : 'Create Page')}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ListingPageForm;
