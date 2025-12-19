import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiMove, FiEye, FiSettings, FiLayout, FiType, FiHelpCircle, FiGrid, FiBarChart2, FiImage } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const WIDGET_TYPES = [
  { type: 'rich_text', name: 'Rich Text Block', icon: FiType, description: 'HTML content with formatting' },
  { type: 'faq', name: 'FAQ Accordion', icon: FiHelpCircle, description: 'Expandable FAQ items' },
  { type: 'cta_cards', name: 'CTA Cards', icon: FiGrid, description: 'Action cards with buttons' },
  { type: 'stats', name: 'Stats Counter', icon: FiBarChart2, description: 'Numbers with labels' },
  { type: 'image_text', name: 'Image + Text', icon: FiImage, description: 'Image with text content' },
];

const PAGE_INFO = {
  'about': { name: 'About Us', defaultTitle: 'About Admissionbuddy' },
  'contact': { name: 'Contact Us', defaultTitle: 'Contact Us' },
  'privacy': { name: 'Privacy Policy', defaultTitle: 'Privacy Policy' },
  'terms': { name: 'Terms of Service', defaultTitle: 'Terms of Service' },
  'admission-schools': { name: 'School Admissions', defaultTitle: 'School Admissions 2026' },
  'admission-colleges': { name: 'College Admissions', defaultTitle: 'College Admissions 2026' },
  'admission-universities': { name: 'University Admissions', defaultTitle: 'University Admissions 2026' },
};

const TABS = [
  { id: 'hero', label: 'Hero Section', icon: FiLayout },
  { id: 'widgets', label: 'Content Widgets', icon: FiGrid },
  { id: 'seo', label: 'SEO Settings', icon: FiSettings },
];

const StaticPageForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);

  const pageInfo = PAGE_INFO[slug] || { name: slug, defaultTitle: slug };

  const [formData, setFormData] = useState({
    slug: slug,
    page_title: pageInfo.defaultTitle,
    
    // Hero
    hero_enabled: true,
    hero_title: pageInfo.defaultTitle,
    hero_subtitle: '',
    hero_background_type: 'gradient',
    hero_background_value: 'from-purple-600 to-indigo-700',
    hero_cta_text: '',
    hero_cta_link: '',
    hero_image: '',
    
    // Widgets
    widgets: [],
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    og_image: '',
    canonical_url: '',
    auto_generate_seo: true,
    schema_type: 'WebPage',
    
    // Settings
    show_breadcrumb: true,
    is_published: true,
  });

  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPage();
    }
  }, [slug]);

  // Auto-generate SEO
  useEffect(() => {
    if (formData.auto_generate_seo && formData.hero_title) {
      const autoSeo = {};
      const newMetaTitle = `${formData.hero_title} | Admissionbuddy`;
      if (!formData.meta_title || formData.meta_title !== newMetaTitle) {
        autoSeo.meta_title = newMetaTitle;
      }
      if (!formData.meta_description && formData.hero_subtitle) {
        autoSeo.meta_description = formData.hero_subtitle.slice(0, 160);
      }
      if (Object.keys(autoSeo).length > 0) {
        setFormData(prev => ({ ...prev, ...autoSeo }));
      }
    }
  }, [formData.hero_title, formData.hero_subtitle, formData.auto_generate_seo]);

  const fetchPage = async () => {
    try {
      const response = await api.get(`/static-pages/${slug}`);
      if (response.data && response.data.page_title) {
        setFormData(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/static-pages/${slug}`, formData);
      alert('Page saved successfully!');
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  // Widget Management
  const addWidget = (type) => {
    const widgetDefaults = {
      rich_text: { content: '<p>Enter your content here...</p>' },
      faq: { items: [{ question: 'Question 1?', answer: 'Answer 1' }] },
      cta_cards: { cards: [{ title: 'Card Title', description: 'Description', button_text: 'Learn More', button_link: '/' }] },
      stats: { items: [{ value: '100+', label: 'Colleges' }, { value: '50K+', label: 'Students' }] },
      image_text: { image: '', title: 'Title', content: 'Content', layout: 'image-left' },
    };

    const newWidget = {
      id: Date.now().toString(),
      type,
      title: WIDGET_TYPES.find(w => w.type === type)?.name || type,
      enabled: true,
      order: formData.widgets.length,
      content: widgetDefaults[type] || {},
    };

    setFormData(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }));
    setShowWidgetPicker(false);
  };

  const updateWidget = (widgetId, field, value) => {
    setFormData(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => 
        w.id === widgetId ? { ...w, [field]: value } : w
      )
    }));
  };

  const updateWidgetContent = (widgetId, contentField, value) => {
    setFormData(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => 
        w.id === widgetId ? { ...w, content: { ...w.content, [contentField]: value } } : w
      )
    }));
  };

  const removeWidget = (widgetId) => {
    if (window.confirm('Remove this widget?')) {
      setFormData(prev => ({
        ...prev,
        widgets: prev.widgets.filter(w => w.id !== widgetId)
      }));
    }
  };

  const moveWidget = (widgetId, direction) => {
    const widgets = [...formData.widgets];
    const idx = widgets.findIndex(w => w.id === widgetId);
    if (direction === 'up' && idx > 0) {
      [widgets[idx], widgets[idx - 1]] = [widgets[idx - 1], widgets[idx]];
    } else if (direction === 'down' && idx < widgets.length - 1) {
      [widgets[idx], widgets[idx + 1]] = [widgets[idx + 1], widgets[idx]];
    }
    setFormData(prev => ({ ...prev, widgets }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.meta_keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        meta_keywords: [...prev.meta_keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  // Widget Editor Components
  const renderWidgetEditor = (widget) => {
    switch (widget.type) {
      case 'rich_text':
        return (
          <div>
            <label className="block text-sm font-medium mb-1">Content (HTML)</label>
            <textarea
              value={widget.content?.content || ''}
              onChange={(e) => updateWidgetContent(widget.id, 'content', e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 font-mono text-sm"
              rows="8"
              placeholder="<p>Your content here...</p>"
            />
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">FAQ Items</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateWidgetContent(widget.id, 'items', [...(widget.content?.items || []), { question: '', answer: '' }])}
              >
                <FiPlus className="mr-1" /> Add FAQ
              </Button>
            </div>
            {(widget.content?.items || []).map((item, idx) => (
              <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => {
                    const items = [...widget.content.items];
                    items[idx].question = e.target.value;
                    updateWidgetContent(widget.id, 'items', items);
                  }}
                  className="w-full border rounded px-3 py-2 mb-2"
                  placeholder="Question"
                />
                <textarea
                  value={item.answer}
                  onChange={(e) => {
                    const items = [...widget.content.items];
                    items[idx].answer = e.target.value;
                    updateWidgetContent(widget.id, 'items', items);
                  }}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                  placeholder="Answer"
                />
                <button
                  type="button"
                  onClick={() => {
                    const items = widget.content.items.filter((_, i) => i !== idx);
                    updateWidgetContent(widget.id, 'items', items);
                  }}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        );

      case 'cta_cards':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">CTA Cards</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateWidgetContent(widget.id, 'cards', [...(widget.content?.cards || []), { title: '', description: '', button_text: '', button_link: '' }])}
              >
                <FiPlus className="mr-1" /> Add Card
              </Button>
            </div>
            {(widget.content?.cards || []).map((card, idx) => (
              <div key={idx} className="border rounded-lg p-3 bg-gray-50 space-y-2">
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => {
                    const cards = [...widget.content.cards];
                    cards[idx].title = e.target.value;
                    updateWidgetContent(widget.id, 'cards', cards);
                  }}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Card Title"
                />
                <textarea
                  value={card.description}
                  onChange={(e) => {
                    const cards = [...widget.content.cards];
                    cards[idx].description = e.target.value;
                    updateWidgetContent(widget.id, 'cards', cards);
                  }}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                  placeholder="Card Description"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={card.button_text}
                    onChange={(e) => {
                      const cards = [...widget.content.cards];
                      cards[idx].button_text = e.target.value;
                      updateWidgetContent(widget.id, 'cards', cards);
                    }}
                    className="border rounded px-3 py-2"
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    value={card.button_link}
                    onChange={(e) => {
                      const cards = [...widget.content.cards];
                      cards[idx].button_link = e.target.value;
                      updateWidgetContent(widget.id, 'cards', cards);
                    }}
                    className="border rounded px-3 py-2"
                    placeholder="Button Link"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const cards = widget.content.cards.filter((_, i) => i !== idx);
                    updateWidgetContent(widget.id, 'cards', cards);
                  }}
                  className="text-red-500 text-sm"
                >
                  Remove Card
                </button>
              </div>
            ))}
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Stats Items</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateWidgetContent(widget.id, 'items', [...(widget.content?.items || []), { value: '', label: '' }])}
              >
                <FiPlus className="mr-1" /> Add Stat
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(widget.content?.items || []).map((item, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => {
                      const items = [...widget.content.items];
                      items[idx].value = e.target.value;
                      updateWidgetContent(widget.id, 'items', items);
                    }}
                    className="w-full border rounded px-3 py-2 mb-2 text-center font-bold"
                    placeholder="100+"
                  />
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const items = [...widget.content.items];
                      items[idx].label = e.target.value;
                      updateWidgetContent(widget.id, 'items', items);
                    }}
                    className="w-full border rounded px-3 py-2 text-center text-sm"
                    placeholder="Label"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const items = widget.content.items.filter((_, i) => i !== idx);
                      updateWidgetContent(widget.id, 'items', items);
                    }}
                    className="text-red-500 text-xs mt-2 w-full text-center"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'image_text':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={widget.content?.image || ''}
                onChange={(e) => updateWidgetContent(widget.id, 'image', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={widget.content?.title || ''}
                onChange={(e) => updateWidgetContent(widget.id, 'title', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={widget.content?.content || ''}
                onChange={(e) => updateWidgetContent(widget.id, 'content', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Layout</label>
              <select
                value={widget.content?.layout || 'image-left'}
                onChange={(e) => updateWidgetContent(widget.id, 'layout', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="image-left">Image Left</option>
                <option value="image-right">Image Right</option>
              </select>
            </div>
          </div>
        );

      default:
        return <p className="text-gray-500">Widget editor not available</p>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/static-pages')}>
              <FiArrowLeft className="mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit: {pageInfo.name}</h1>
              <p className="text-gray-500">/{slug.replace('admission-', 'admission/')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={`/${slug.replace('admission-', 'admission/')}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <FiEye className="mr-2" /> Preview
              </Button>
            </a>
            <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
              <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save Page'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">🎯 Hero Section</h2>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hero_enabled}
                  onChange={(e) => handleChange('hero_enabled', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Enable Hero</span>
              </label>
            </div>

            {formData.hero_enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hero Title *</label>
                  <input
                    type="text"
                    value={formData.hero_title}
                    onChange={(e) => handleChange('hero_title', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Page Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                  <textarea
                    value={formData.hero_subtitle}
                    onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5"
                    rows="2"
                    placeholder="Brief description or tagline"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Background Type</label>
                    <select
                      value={formData.hero_background_type}
                      onChange={(e) => handleChange('hero_background_type', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2.5"
                    >
                      <option value="gradient">Gradient</option>
                      <option value="color">Solid Color</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {formData.hero_background_type === 'gradient' ? 'Gradient Classes' : 
                       formData.hero_background_type === 'image' ? 'Image URL' : 'Color'}
                    </label>
                    <input
                      type="text"
                      value={formData.hero_background_value}
                      onChange={(e) => handleChange('hero_background_value', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2.5"
                      placeholder={formData.hero_background_type === 'gradient' ? 'from-purple-600 to-indigo-700' : '#6366f1'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={formData.hero_cta_text}
                      onChange={(e) => handleChange('hero_cta_text', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2.5"
                      placeholder="Get Started"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CTA Button Link</label>
                    <input
                      type="text"
                      value={formData.hero_cta_link}
                      onChange={(e) => handleChange('hero_cta_link', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2.5"
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Widgets Tab */}
        {activeTab === 'widgets' && (
          <div className="space-y-4">
            {/* Widget List */}
            {formData.widgets.map((widget, idx) => (
              <div key={widget.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveWidget(widget.id, 'up')}
                        disabled={idx === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveWidget(widget.id, 'down')}
                        disabled={idx === formData.widgets.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                    <span className="font-medium">{widget.title}</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      {widget.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={widget.enabled}
                        onChange={(e) => updateWidget(widget.id, 'enabled', e.target.checked)}
                        className="rounded"
                      />
                      Enabled
                    </label>
                    <button
                      type="button"
                      onClick={() => removeWidget(widget.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Section Title</label>
                    <input
                      type="text"
                      value={widget.title}
                      onChange={(e) => updateWidget(widget.id, 'title', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  {renderWidgetEditor(widget)}
                </div>
              </div>
            ))}

            {/* Add Widget Button */}
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowWidgetPicker(!showWidgetPicker)}
                className="w-full border-dashed border-2"
              >
                <FiPlus className="mr-2" /> Add Widget
              </Button>

              {showWidgetPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border p-4 z-10">
                  <h4 className="font-medium mb-3">Select Widget Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {WIDGET_TYPES.map((wt) => (
                      <button
                        key={wt.type}
                        type="button"
                        onClick={() => addWidget(wt.type)}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-purple-50 hover:border-purple-300 transition text-left"
                      >
                        <wt.icon className="text-purple-600" size={20} />
                        <div>
                          <p className="font-medium text-sm">{wt.name}</p>
                          <p className="text-xs text-gray-500">{wt.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {formData.widgets.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FiGrid className="mx-auto mb-3" size={48} />
                <p>No widgets added yet</p>
                <p className="text-sm">Click "Add Widget" to start building your page</p>
              </div>
            )}
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
                  value={formData.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  placeholder="Page title for search engines"
                />
                <p className="text-xs text-gray-500 mt-1">{(formData.meta_title || '').length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  rows="3"
                  placeholder="Description for search results"
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
                  {formData.meta_keywords.map((kw, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {kw}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          meta_keywords: prev.meta_keywords.filter((_, i) => i !== idx)
                        }))}
                      >
                        ×
                      </button>
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
                  placeholder="Social sharing image"
                />
              </div>
            </div>

            {/* Search Preview */}
            <div className="border-t pt-6">
              <h3 className="font-medium mb-3">👁️ Search Preview</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {formData.meta_title || `${formData.hero_title} | Admissionbuddy`}
                </p>
                <p className="text-green-700 text-sm">
                  {window.location.origin}/{slug.replace('admission-', 'admission/')}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {formData.meta_description || formData.hero_subtitle || 'Meta description will appear here...'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default StaticPageForm;
