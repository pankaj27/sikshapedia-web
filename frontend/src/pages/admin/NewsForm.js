import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiSend, FiImage, FiVideo, FiList, FiGrid, FiSettings, FiSearch, FiPlus, FiTrash2, FiMove, FiEye, FiUpload } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import api from '../../api/axios';
import { generateSlug } from '../../utils/slugify';
import StatusBadge from '../../components/admin/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: FiSettings },
  { id: 'media', label: 'Media', icon: FiImage },
  { id: 'content', label: 'Content', icon: FiList },
  { id: 'toc', label: 'TOC', icon: FiList },
  { id: 'tables', label: 'Tables', icon: FiGrid },
  { id: 'widgets', label: 'Widgets', icon: FiGrid },
  { id: 'seo', label: 'SEO', icon: FiSearch },
];

const CATEGORIES = ['Admission', 'Exams', 'Results', 'Events', 'Policy', 'College News', 'Latest Alerts'];

const NewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Admission',
    summary: '',
    content: '',
    
    // Media
    featured_image: '',
    featured_image_alt: '',
    video_url: '',
    video_thumbnail: '',
    gallery_images: [],
    
    // Author (from team)
    author_id: '', // Team member ID
    author: '',
    author_image: '',
    author_designation: '',
    
    // TOC
    toc_enabled: false,
    toc_items: [],
    
    // Tables
    tables: [],
    
    // Widgets
    show_related_articles: true,
    show_related_exams: true,
    show_related_colleges: true,
    show_newsletter: true,
    show_cta_banner: false,
    cta_banner: { title: '', subtitle: '', button_text: '', button_link: '', gradient: 'from-orange-500 to-red-500' },
    
    // Tags & Related
    tags: [],
    related_colleges: [],
    related_exams: [],
    related_articles: [],
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    canonical_url: '',
    og_image: '',
    auto_generate_seo: true,
    schema_type: 'NewsArticle',
    
    // Status
    published: true,
    featured: false,
    status: 'draft'
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  // Auto-fill author from current logged-in user
  useEffect(() => {
    if (user && !isEdit) {
      setFormData(prev => ({
        ...prev,
        author_id: user.id,
        author: user.name || user.email,
        author_image: user.profile_photo || '',
        author_designation: user.job_title || user.role || 'Content Writer'
      }));
    }
  }, [user, isEdit]);

  useEffect(() => {
    if (isEdit) {
      fetchNews();
    }
  }, [id]);

  // Auto-generate slug from title
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  
  useEffect(() => {
    if (!isEdit && formData.title && !slugManuallyEdited) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title, isEdit, slugManuallyEdited]);

  // Auto-generate SEO fields
  useEffect(() => {
    if (formData.auto_generate_seo && formData.title) {
      const autoSeo = {};
      // Always update meta_title when title changes (if auto-generate is on)
      const newMetaTitle = `${formData.title} | Education News | Admissionbuddy`;
      if (formData.meta_title !== newMetaTitle) {
        autoSeo.meta_title = newMetaTitle;
      }
      // Update meta_description from summary
      if (formData.summary) {
        const newMetaDesc = formData.summary.slice(0, 160);
        if (formData.meta_description !== newMetaDesc) {
          autoSeo.meta_description = newMetaDesc;
        }
      }
      // Update alt tag
      const newAlt = `${formData.title} | News | Admissionbuddy`;
      if (formData.featured_image_alt !== newAlt) {
        autoSeo.featured_image_alt = newAlt;
      }
      // Update OG image
      if (formData.featured_image && !formData.og_image) {
        autoSeo.og_image = formData.featured_image;
      }
      if (Object.keys(autoSeo).length > 0) {
        setFormData(prev => ({ ...prev, ...autoSeo }));
      }
    }
  }, [formData.title, formData.summary, formData.featured_image, formData.auto_generate_seo]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/news/${id}`);
      setFormData(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to load news article');
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
      const dataToSave = { ...formData };
      if (isEdit) {
        await api.put(`/news/${id}`, dataToSave);
      } else {
        await api.post('/news', dataToSave);
      }
      navigate('/admin/news');
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Error saving news');
    } finally {
      setSaving(false);
    }
  };

  // Image upload handler
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
      alert('Image upload failed. Please use a URL instead.');
    }
  };

  // Tag management
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    handleChange('tags', formData.tags.filter((_, i) => i !== index));
  };

  // Keyword management
  const addKeyword = () => {
    if (keywordInput.trim() && !formData.meta_keywords.includes(keywordInput.trim())) {
      handleChange('meta_keywords', [...formData.meta_keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    handleChange('meta_keywords', formData.meta_keywords.filter((_, i) => i !== index));
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

  const removeTocItem = (index) => {
    handleChange('toc_items', formData.toc_items.filter((_, i) => i !== index));
  };

  // Table management
  const addTable = () => {
    handleChange('tables', [...formData.tables, {
      title: 'New Table',
      headers: ['Column 1', 'Column 2'],
      rows: [['', '']],
      style: 'default'
    }]);
  };

  const updateTable = (tableIndex, field, value) => {
    const newTables = [...formData.tables];
    newTables[tableIndex] = { ...newTables[tableIndex], [field]: value };
    handleChange('tables', newTables);
  };

  const addTableColumn = (tableIndex) => {
    const newTables = [...formData.tables];
    newTables[tableIndex].headers.push('New Column');
    newTables[tableIndex].rows = newTables[tableIndex].rows.map(row => [...row, '']);
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
    newTables[tableIndex].headers[colIndex] = value;
    handleChange('tables', newTables);
  };

  const removeTable = (tableIndex) => {
    handleChange('tables', formData.tables.filter((_, i) => i !== tableIndex));
  };

  // Gallery image management
  const addGalleryImage = () => {
    handleChange('gallery_images', [...formData.gallery_images, { url: '', alt: '', caption: '' }]);
  };

  const updateGalleryImage = (index, field, value) => {
    const newImages = [...formData.gallery_images];
    newImages[index] = { ...newImages[index], [field]: value };
    handleChange('gallery_images', newImages);
  };

  const removeGalleryImage = (index) => {
    handleChange('gallery_images', formData.gallery_images.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
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
              <Link to="/admin/news" className="text-gray-600 hover:text-gray-900">
                <FiArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isEdit ? 'Edit News Article' : 'Create News Article'}
                </h1>
                {isEdit && formData.status && (
                  <StatusBadge status={formData.status} />
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.open(`/news/${formData.slug}`, '_blank')} disabled={!formData.slug}>
                <FiEye className="mr-2" /> Preview
              </Button>
              <Button onClick={handleSubmit} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
                <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save News'}
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
                    ? 'bg-orange-50 text-orange-600 font-medium'
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
                  <h2 className="text-lg font-semibold mb-4">📝 Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Enter news title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5 bg-gray-50"
                        placeholder="auto-generated-slug"
                      />
                      <p className="text-xs text-gray-500 mt-1">URL: /news/{formData.slug || 'slug'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleChange('category', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => handleChange('status', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                        >
                          <option value="draft">Draft</option>
                          <option value="pending">Pending Review</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Summary *</label>
                      <textarea
                        value={formData.summary}
                        onChange={(e) => handleChange('summary', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        rows="3"
                        placeholder="Brief summary of the news article"
                        required
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="flex-1 border rounded-lg px-4 py-2"
                          placeholder="Add a tag"
                        />
                        <Button type="button" variant="outline" onClick={addTag}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                            #{tag}
                            <button type="button" onClick={() => removeTag(idx)} className="hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => handleChange('featured', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Featured Article</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) => handleChange('published', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Published</span>
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                {/* Featured Image */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🖼️ Featured Image</h2>
                  <div className="space-y-4">
                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(file, 'featured_image');
                            // Auto-generate alt from title if not set
                            if (!formData.featured_image_alt && formData.title) {
                              handleChange('featured_image_alt', formData.title);
                            }
                          }
                        }}
                        className="hidden"
                        id="featured-image-upload"
                      />
                      <label htmlFor="featured-image-upload" className="cursor-pointer">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                      </label>
                    </div>

                    {/* Or use URL */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or enter URL</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={formData.featured_image || ''}
                        onChange={(e) => handleChange('featured_image', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    {/* Image Preview */}
                    {formData.featured_image && (
                      <div className="relative group">
                        <img src={formData.featured_image} alt={formData.featured_image_alt || 'Preview'} className="w-full h-48 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            handleChange('featured_image', '');
                            handleChange('featured_image_alt', '');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}

                    {/* Alt Text with Auto-Generate */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">Alt Text (SEO)</label>
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.title) {
                              const autoAlt = `${formData.title} - ${formData.category} News | Admissionbuddy`;
                              handleChange('featured_image_alt', autoAlt.substring(0, 125));
                            } else {
                              alert('Please enter a title first to auto-generate alt text');
                            }
                          }}
                          className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                        >
                          ⚡ Auto-Generate from Title
                        </button>
                      </div>
                      <input
                        type="text"
                        value={formData.featured_image_alt || ''}
                        onChange={(e) => handleChange('featured_image_alt', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Descriptive alt text for accessibility & SEO"
                        maxLength={125}
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">Helps with SEO and accessibility</p>
                        <span className={`text-xs ${(formData.featured_image_alt?.length || 0) > 100 ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {formData.featured_image_alt?.length || 0}/125
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🎬 Video</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video Embed URL</label>
                      <input
                        type="url"
                        value={formData.video_url || ''}
                        onChange={(e) => handleChange('video_url', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="https://www.youtube.com/embed/... or https://player.vimeo.com/..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Use embed URL from YouTube or Vimeo</p>
                    </div>
                    {formData.video_url && (
                      <div className="aspect-video">
                        <iframe
                          src={formData.video_url}
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video Thumbnail</label>
                      <input
                        type="url"
                        value={formData.video_thumbnail || ''}
                        onChange={(e) => handleChange('video_thumbnail', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Custom thumbnail URL (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">📸 Image Gallery</h2>
                    <Button type="button" variant="outline" onClick={addGalleryImage}>
                      <FiPlus className="mr-2" /> Add Image
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.gallery_images.map((img, idx) => (
                      <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-medium">Image #{idx + 1}</span>
                          <button type="button" onClick={() => removeGalleryImage(idx)} className="text-red-500 hover:text-red-700">
                            <FiTrash2 />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <input
                              type="url"
                              value={img.url}
                              onChange={(e) => updateGalleryImage(idx, 'url', e.target.value)}
                              className="w-full border rounded px-3 py-2 text-sm"
                              placeholder="Image URL"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={img.alt}
                              onChange={(e) => updateGalleryImage(idx, 'alt', e.target.value)}
                              className="w-full border rounded px-3 py-2 text-sm"
                              placeholder="Alt text (SEO)"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={img.caption}
                              onChange={(e) => updateGalleryImage(idx, 'caption', e.target.value)}
                              className="w-full border rounded px-3 py-2 text-sm"
                              placeholder="Caption"
                            />
                          </div>
                        </div>
                        {img.url && (
                          <img src={img.url} alt={img.alt} className="mt-3 w-full h-24 object-cover rounded" />
                        )}
                      </div>
                    ))}
                    {formData.gallery_images.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No gallery images added</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">📄 Article Content</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML supported)</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleChange('content', e.target.value)}
                      className="w-full border rounded-lg px-4 py-3 font-mono text-sm"
                      rows="20"
                      placeholder="<h2>Section Title</h2>
<p>Your content here...</p>

<h3>Subsection</h3>
<ul>
  <li>Point 1</li>
  <li>Point 2</li>
</ul>"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supports HTML tags: h2, h3, p, ul, ol, li, strong, em, a, table, etc.</p>
                  </div>
                  
                  {/* Content Preview */}
                  {formData.content && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                      <div 
                        className="border rounded-lg p-4 prose max-w-none bg-gray-50"
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TOC Tab */}
            {activeTab === 'toc' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">📑 Table of Contents</h2>
                    <p className="text-sm text-gray-500">Define sections for easy navigation</p>
                  </div>
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
                        <FiMove className="text-gray-400 cursor-grab" />
                        <select
                          value={item.level}
                          onChange={(e) => updateTocItem(idx, 'level', parseInt(e.target.value))}
                          className="border rounded px-2 py-1.5 text-sm w-20"
                        >
                          <option value={1}>H2</option>
                          <option value={2}>H3</option>
                          <option value={3}>H4</option>
                        </select>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateTocItem(idx, 'title', e.target.value)}
                          className="flex-1 border rounded px-3 py-1.5"
                          placeholder="Section title"
                        />
                        <input
                          type="text"
                          value={item.id}
                          onChange={(e) => updateTocItem(idx, 'id', e.target.value)}
                          className="w-40 border rounded px-3 py-1.5 text-sm"
                          placeholder="section-id"
                        />
                        <button type="button" onClick={() => removeTocItem(idx)} className="text-red-500">
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
                        className="text-lg font-semibold border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none"
                        placeholder="Table Title"
                      />
                      <div className="flex items-center gap-2">
                        <select
                          value={table.style}
                          onChange={(e) => updateTable(tableIdx, 'style', e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="default">Default</option>
                          <option value="striped">Striped</option>
                          <option value="bordered">Bordered</option>
                        </select>
                        <button type="button" onClick={() => removeTable(tableIdx)} className="text-red-500">
                          <FiTrash2 />
                        </button>
                      </div>
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
                                  onChange={(e) => updateTableHeader(tableIdx, colIdx, e.target.value)}
                                  className="w-full bg-transparent text-center font-semibold outline-none"
                                  placeholder="Header"
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
                                    placeholder="Cell"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button type="button" variant="outline" size="sm" onClick={() => addTableColumn(tableIdx)}>
                        + Column
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => addTableRow(tableIdx)}>
                        + Row
                      </Button>
                    </div>
                  </div>
                ))}
                
                {formData.tables.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                    <FiGrid className="mx-auto mb-2" size={32} />
                    <p>No tables added yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Widgets Tab */}
            {activeTab === 'widgets' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🧩 Sidebar Widgets</h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.show_related_articles}
                        onChange={(e) => handleChange('show_related_articles', e.target.checked)}
                        className="rounded"
                      />
                      <span>Show Related Articles</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.show_related_exams}
                        onChange={(e) => handleChange('show_related_exams', e.target.checked)}
                        className="rounded"
                      />
                      <span>Show Related Exams</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.show_related_colleges}
                        onChange={(e) => handleChange('show_related_colleges', e.target.checked)}
                        className="rounded"
                      />
                      <span>Show Related Colleges</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.show_newsletter}
                        onChange={(e) => handleChange('show_newsletter', e.target.checked)}
                        className="rounded"
                      />
                      <span>Show Newsletter Signup</span>
                    </label>
                  </div>
                </div>

                {/* Related Content */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🔗 Related Content</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Related Exams (comma separated)</label>
                      <input
                        type="text"
                        value={formData.related_exams.join(', ')}
                        onChange={(e) => handleChange('related_exams', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="JEE Main, NEET, CAT"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Related Colleges (comma separated)</label>
                      <input
                        type="text"
                        value={formData.related_colleges.join(', ')}
                        onChange={(e) => handleChange('related_colleges', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="IIT Delhi, IIT Bombay"
                      />
                    </div>
                  </div>
                </div>

                {/* CTA Banner */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">📢 CTA Banner</h2>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.show_cta_banner}
                        onChange={(e) => handleChange('show_cta_banner', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Enable</span>
                    </label>
                  </div>
                  {formData.show_cta_banner && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.cta_banner?.title || ''}
                        onChange={(e) => handleChange('cta_banner', { ...formData.cta_banner, title: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="CTA Title"
                      />
                      <input
                        type="text"
                        value={formData.cta_banner?.subtitle || ''}
                        onChange={(e) => handleChange('cta_banner', { ...formData.cta_banner, subtitle: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="CTA Subtitle"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={formData.cta_banner?.button_text || ''}
                          onChange={(e) => handleChange('cta_banner', { ...formData.cta_banner, button_text: e.target.value })}
                          className="border rounded-lg px-4 py-2.5"
                          placeholder="Button Text"
                        />
                        <input
                          type="text"
                          value={formData.cta_banner?.button_link || ''}
                          onChange={(e) => handleChange('cta_banner', { ...formData.cta_banner, button_link: e.target.value })}
                          className="border rounded-lg px-4 py-2.5"
                          placeholder="Button Link"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={formData.meta_title || ''}
                        onChange={(e) => handleChange('meta_title', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="SEO title (auto-generated if empty)"
                      />
                      <p className="text-xs text-gray-500 mt-1">{(formData.meta_title || '').length}/60 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <textarea
                        value={formData.meta_description || ''}
                        onChange={(e) => handleChange('meta_description', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        rows="3"
                        placeholder="SEO description (auto-generated from summary if empty)"
                      />
                      <p className="text-xs text-gray-500 mt-1">{(formData.meta_description || '').length}/160 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
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
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {kw}
                            <button type="button" onClick={() => removeKeyword(idx)} className="hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                      <input
                        type="url"
                        value={formData.og_image || ''}
                        onChange={(e) => handleChange('og_image', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Social sharing image (uses featured image if empty)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                      <input
                        type="url"
                        value={formData.canonical_url || ''}
                        onChange={(e) => handleChange('canonical_url', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Leave empty to use default URL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Schema Type</label>
                      <select
                        value={formData.schema_type}
                        onChange={(e) => handleChange('schema_type', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      >
                        <option value="NewsArticle">News Article</option>
                        <option value="BlogPosting">Blog Post</option>
                        <option value="Article">Article</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SEO Preview */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">👁️ Search Preview</h2>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {formData.meta_title || formData.title || 'Page Title'}
                    </p>
                    <p className="text-green-700 text-sm">
                      {window.location.origin}/news/{formData.slug || 'slug'}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {formData.meta_description || formData.summary || 'Meta description will appear here...'}
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

export default NewsForm;
