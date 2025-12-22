import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiEye, FiArrowLeft, FiCheck, FiLoader } from 'react-icons/fi';
import ContentBuilder from '../../components/admin/ContentBuilder';
import SEOSection from '../../components/admin/SEOSection';
import LivePreview from '../../components/admin/LivePreview';
import api from '../../api/axios';

const UniversalContentForm = () => {
  const { id, type } = useParams(); // type: college, school, university, course, exam
  const navigate = useNavigate();
  const isEdit = !!id;

  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    slug: '',
    status: 'draft',
    
    // Logo & Banner
    logoBanner: {
      logoUrl: '',
      bannerUrl: '',
      bannerAlt: ''
    },
    
    // SEO Settings
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      canonicalUrl: '',
      noIndex: false,
      noFollow: false,
    },
    
    // Badges
    badges: [],
    
    // Content Team
    contentTeam: {
      author: '',
      authorImage: '',
      authorBio: '',
      reviewedBy: '',
      updatedDate: new Date().toISOString().split('T')[0]
    },
    
    // Dynamic Menu
    menu: {
      type: 'tabs',
      items: []
    },
    
    // Widgets
    widgets: [],
    
    // Main Content Area (drag & drop)
    contentBlocks: [],
    
    // SEO Content Area (drag & drop with hide option)
    seoContentBlocks: [],
    
    // Gallery
    gallery: {
      images: [],
      layout: 'grid'
    },
    
    // Table of Contents
    toc: {
      autoGenerate: true,
      items: []
    }
  });

  // Auto-generate slug
  useEffect(() => {
    if (!isEdit && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, isEdit]);

  // Load existing data
  useEffect(() => {
    if (isEdit) {
      loadData();
    }
  }, [id, type]);

  const loadData = async () => {
    try {
      const endpoint = `/${type}s-detail/${id}`;
      const response = await api.get(endpoint);
      if (response.data) {
        setFormData(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSave = async (status = formData.status) => {
    setSaving(true);
    setSaveMessage('');
    
    try {
      const dataToSave = { ...formData, status };
      const endpoint = isEdit 
        ? `/${type}s-detail/${id}` 
        : `/${type}s-detail`;
      
      if (isEdit) {
        await api.put(endpoint, dataToSave);
      } else {
        await api.post(endpoint, dataToSave);
      }
      
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveMessage('Error saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📋' },
    { id: 'media', label: 'Logo & Banner', icon: '🖼️' },
    { id: 'seo', label: 'SEO Settings', icon: '🔍' },
    { id: 'content', label: 'Main Content', icon: '📝' },
    { id: 'seoContent', label: 'SEO Content', icon: '📄' },
    { id: 'menu', label: 'Menu & Navigation', icon: '📑' },
    { id: 'extras', label: 'Badges & Widgets', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isEdit ? 'Edit' : 'Create'} {type?.charAt(0).toUpperCase() + type?.slice(1)}
                </h1>
                <p className="text-sm text-gray-500">
                  {formData.name || 'Untitled'} • {formData.status}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {saveMessage && (
                <span className={`text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'} flex items-center gap-1`}>
                  <FiCheck size={16} /> {saveMessage}
                </span>
              )}
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                  showPreview ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <FiEye size={18} />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Save Draft
              </button>
              
              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? <FiLoader className="animate-spin" /> : <FiSave size={18} />}
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {/* Form Section */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="flex overflow-x-auto border-b">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                      <div className="flex items-center">
                        <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
                          /{type}s/
                        </span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => updateField('slug', e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="url-slug"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => updateField('status', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending Review</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    {/* Content Team */}
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-gray-800 mb-4">Content Team</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                          <input
                            type="text"
                            value={formData.contentTeam.author}
                            onChange={(e) => updateField('contentTeam', { ...formData.contentTeam, author: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Author name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Author Image URL</label>
                          <input
                            type="text"
                            value={formData.contentTeam.authorImage}
                            onChange={(e) => updateField('contentTeam', { ...formData.contentTeam, authorImage: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reviewed By</label>
                          <input
                            type="text"
                            value={formData.contentTeam.reviewedBy}
                            onChange={(e) => updateField('contentTeam', { ...formData.contentTeam, reviewedBy: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Reviewer name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                          <input
                            type="date"
                            value={formData.contentTeam.updatedDate}
                            onChange={(e) => updateField('contentTeam', { ...formData.contentTeam, updatedDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                      <input
                        type="text"
                        value={formData.logoBanner.logoUrl}
                        onChange={(e) => updateField('logoBanner', { ...formData.logoBanner, logoUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="https://example.com/logo.png"
                      />
                      {formData.logoBanner.logoUrl && (
                        <div className="mt-3 p-4 bg-gray-100 rounded-lg inline-block">
                          <img src={formData.logoBanner.logoUrl} alt="Logo" className="h-20 object-contain" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Banner URL</label>
                      <input
                        type="text"
                        value={formData.logoBanner.bannerUrl}
                        onChange={(e) => updateField('logoBanner', { ...formData.logoBanner, bannerUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="https://example.com/banner.jpg"
                      />
                      {formData.logoBanner.bannerUrl && (
                        <div className="mt-3 border rounded-lg overflow-hidden">
                          <img src={formData.logoBanner.bannerUrl} alt="Banner" className="w-full h-48 object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Banner Alt Text (SEO)</label>
                      <input
                        type="text"
                        value={formData.logoBanner.bannerAlt}
                        onChange={(e) => updateField('logoBanner', { ...formData.logoBanner, bannerAlt: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="Description of banner image"
                      />
                    </div>

                    {/* Gallery Section */}
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-gray-800 mb-4">Image Gallery</h3>
                      <ContentBuilder
                        value={[{ id: 'gallery', type: 'gallery', data: formData.gallery, visible: true }]}
                        onChange={(blocks) => {
                          const galleryBlock = blocks.find(b => b.type === 'gallery');
                          if (galleryBlock) {
                            updateField('gallery', galleryBlock.data);
                          }
                        }}
                        title=""
                      />
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <SEOSection
                    value={formData.seo}
                    onChange={(seo) => updateField('seo', seo)}
                  />
                )}

                {/* Main Content Tab */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      💡 Drag and drop content blocks to build your page. Each block can be reordered, hidden, or removed.
                    </p>
                    <ContentBuilder
                      value={formData.contentBlocks}
                      onChange={(blocks) => updateField('contentBlocks', blocks)}
                      title="Main Content Blocks"
                    />
                  </div>
                )}

                {/* SEO Content Tab */}
                {activeTab === 'seoContent' && (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      📝 SEO content area for detailed information. Use the eye icon to hide sections from display while keeping them for SEO.
                    </p>
                    
                    {/* Table of Contents Config */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3">Table of Contents Settings</h4>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.toc.autoGenerate}
                          onChange={(e) => updateField('toc', { ...formData.toc, autoGenerate: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Auto-generate from content headings</span>
                      </label>
                    </div>

                    <ContentBuilder
                      value={formData.seoContentBlocks}
                      onChange={(blocks) => updateField('seoContentBlocks', blocks)}
                      title="SEO Content Blocks (with hide option)"
                    />
                  </div>
                )}

                {/* Menu Tab */}
                {activeTab === 'menu' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Menu Type</label>
                      <select
                        value={formData.menu.type}
                        onChange={(e) => updateField('menu', { ...formData.menu, type: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      >
                        <option value="tabs">Horizontal Tabs</option>
                        <option value="sidebar">Sidebar Navigation</option>
                        <option value="dropdown">Dropdown Menu</option>
                        <option value="sticky">Sticky Navigation</option>
                      </select>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Menu Items</h4>
                      <div className="space-y-3">
                        {formData.menu.items.map((item, idx) => (
                          <div key={item.id || idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="checkbox"
                              checked={item.enabled}
                              onChange={(e) => {
                                const newItems = [...formData.menu.items];
                                newItems[idx].enabled = e.target.checked;
                                updateField('menu', { ...formData.menu, items: newItems });
                              }}
                              className="rounded"
                            />
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => {
                                const newItems = [...formData.menu.items];
                                newItems[idx].label = e.target.value;
                                updateField('menu', { ...formData.menu, items: newItems });
                              }}
                              className="flex-1 px-3 py-2 border rounded"
                              placeholder="Menu label"
                            />
                            <input
                              type="text"
                              value={item.anchor}
                              onChange={(e) => {
                                const newItems = [...formData.menu.items];
                                newItems[idx].anchor = e.target.value;
                                updateField('menu', { ...formData.menu, items: newItems });
                              }}
                              className="w-32 px-3 py-2 border rounded"
                              placeholder="#section-id"
                            />
                            <button
                              onClick={() => {
                                const newItems = formData.menu.items.filter((_, i) => i !== idx);
                                updateField('menu', { ...formData.menu, items: newItems });
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newItems = [...formData.menu.items, { id: `menu-${Date.now()}`, label: '', anchor: '', enabled: true }];
                            updateField('menu', { ...formData.menu, items: newItems });
                          }}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                        >
                          + Add Menu Item
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Extras Tab */}
                {activeTab === 'extras' && (
                  <div className="space-y-6">
                    {/* Badges */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Display Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'featured', label: '⭐ Featured', color: 'yellow' },
                          { value: 'verified', label: '✓ Verified', color: 'green' },
                          { value: 'admission_open', label: '🎓 Admission Open', color: 'blue' },
                          { value: 'admission_partner', label: '🤝 Admission Partner', color: 'purple' },
                          { value: 'no_cost_emi', label: '💳 No Cost EMI', color: 'orange' },
                          { value: 'scholarship', label: '📚 Scholarship', color: 'pink' },
                          { value: 'top_rated', label: '🏆 Top Rated', color: 'red' },
                        ].map(badge => (
                          <button
                            key={badge.value}
                            onClick={() => {
                              const newBadges = formData.badges.includes(badge.value)
                                ? formData.badges.filter(b => b !== badge.value)
                                : [...formData.badges, badge.value];
                              updateField('badges', newBadges);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${
                              formData.badges.includes(badge.value)
                                ? `bg-${badge.color}-100 text-${badge.color}-800 border-${badge.color}-300`
                                : 'bg-gray-100 text-gray-500 border-transparent'
                            }`}
                          >
                            {badge.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Widgets */}
                    <div className="pt-6 border-t">
                      <h4 className="font-medium text-gray-800 mb-3">Sidebar Widgets</h4>
                      <ContentBuilder
                        value={formData.widgets.map((w, i) => ({ id: `widget-${i}`, type: 'widget', data: w, visible: true }))}
                        onChange={(blocks) => {
                          updateField('widgets', blocks.map(b => b.data));
                        }}
                        title=""
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="sticky top-24 h-fit">
              <LivePreview data={formData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalContentForm;
