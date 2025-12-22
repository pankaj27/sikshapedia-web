import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentBuilder from '../../components/admin/ContentBuilder';
import SEOSection from '../../components/admin/SEOSection';
import LivePreview from '../../components/admin/LivePreview';
import {
  FiSave, FiEye, FiSettings, FiLayout, FiImage, FiTag, FiUsers,
  FiMenu, FiGrid, FiFileText, FiChevronLeft, FiChevronRight,
  FiUpload, FiX, FiPlus, FiTrash2, FiMove, FiEyeOff
} from 'react-icons/fi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Sortable Menu Item Component
const SortableMenuItem = ({ item, index, onUpdate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 bg-white border rounded-lg ${isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''}`}
    >
      <button {...attributes} {...listeners} className="p-1 hover:bg-gray-100 rounded cursor-grab">
        <FiMove className="text-gray-400" size={16} />
      </button>
      <input
        type="text"
        value={item.label}
        onChange={(e) => onUpdate(index, 'label', e.target.value)}
        className="flex-1 px-3 py-1.5 border rounded text-sm"
        placeholder="Menu Label"
      />
      <input
        type="text"
        value={item.anchor || ''}
        onChange={(e) => onUpdate(index, 'anchor', e.target.value)}
        className="w-32 px-3 py-1.5 border rounded text-sm"
        placeholder="#section-id"
      />
      <input
        type="text"
        value={item.metaTitle || ''}
        onChange={(e) => onUpdate(index, 'metaTitle', e.target.value)}
        className="w-40 px-3 py-1.5 border rounded text-sm"
        placeholder="SEO Title"
      />
      <label className="flex items-center gap-1 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={item.enabled !== false}
          onChange={(e) => onUpdate(index, 'enabled', e.target.checked)}
          className="rounded"
        />
        Active
      </label>
      <button onClick={() => onRemove(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
        <FiTrash2 size={16} />
      </button>
    </div>
  );
};

// SEO Content Area with Hide/Show and Drag-Drop
const SEOContentArea = ({ value, onChange, title }) => {
  const [expanded, setExpanded] = useState(true);
  const [data, setData] = useState(value || { visible: true, blocks: [] });

  const handleBlocksChange = (blocks) => {
    const newData = { ...data, blocks };
    setData(newData);
    onChange(newData);
  };

  const toggleVisibility = () => {
    const newData = { ...data, visible: !data.visible };
    setData(newData);
    onChange(newData);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm mb-6">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <span className="text-xl">📝</span>
          <span className="font-semibold text-gray-800">{title || 'SEO Content Area'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVisibility}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
              data.visible 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {data.visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
            {data.visible ? 'Visible' : 'Hidden'}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            {expanded ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="p-6">
          <ContentBuilder
            value={data.blocks}
            onChange={handleBlocksChange}
            title="Drag & Drop SEO Content Blocks"
          />
        </div>
      )}
    </div>
  );
};

// Image Gallery with Upload
const ImageGallery = ({ value, onChange }) => {
  const [images, setImages] = useState(value || []);

  const addImage = () => {
    const newImages = [...images, { id: `img-${Date.now()}`, url: '', alt: '', caption: '' }];
    setImages(newImages);
    onChange(newImages);
  };

  const updateImage = (index, field, fieldValue) => {
    const newImages = [...images];
    newImages[index][field] = fieldValue;
    setImages(newImages);
    onChange(newImages);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange(newImages);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiImage className="text-gray-600" size={20} />
          <h3 className="font-semibold text-gray-800">Image Gallery</h3>
        </div>
        <button
          onClick={addImage}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <FiPlus size={16} />
          Add Image
        </button>
      </div>
      
      {images.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <FiImage className="mx-auto text-gray-300 mb-2" size={40} />
          <p className="text-gray-500">No images added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div key={img.id} className="border rounded-lg p-3 relative group">
              <button
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX size={14} />
              </button>
              {img.url ? (
                <img src={img.url} alt={img.alt} className="w-full h-24 object-cover rounded mb-2" />
              ) : (
                <div className="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <FiUpload className="text-gray-400" size={24} />
                </div>
              )}
              <input
                type="text"
                value={img.url}
                onChange={(e) => updateImage(idx, 'url', e.target.value)}
                className="w-full px-2 py-1 border rounded text-xs mb-1"
                placeholder="Image URL"
              />
              <input
                type="text"
                value={img.alt}
                onChange={(e) => updateImage(idx, 'alt', e.target.value)}
                className="w-full px-2 py-1 border rounded text-xs"
                placeholder="Alt text"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Logo & Banner Uploader
const LogoBannerUploader = ({ value, onChange }) => {
  const [data, setData] = useState(value || { logo: '', banner: '', favicon: '' });

  const handleChange = (field, fieldValue) => {
    const newData = { ...data, [field]: fieldValue };
    setData(newData);
    onChange(newData);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiImage className="text-gray-600" size={20} />
        <h3 className="font-semibold text-gray-800">Logo & Banner</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            {data.logo ? (
              <div className="relative inline-block">
                <img src={data.logo} alt="Logo" className="h-16 object-contain mx-auto" />
                <button
                  onClick={() => handleChange('logo', '')}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <FiUpload className="mx-auto text-gray-400 mb-2" size={32} />
            )}
          </div>
          <input
            type="text"
            value={data.logo}
            onChange={(e) => handleChange('logo', e.target.value)}
            className="w-full mt-2 px-3 py-2 border rounded-lg text-sm"
            placeholder="Logo URL"
          />
        </div>

        {/* Banner */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center min-h-[120px]">
            {data.banner ? (
              <div className="relative">
                <img src={data.banner} alt="Banner" className="w-full h-24 object-cover rounded" />
                <button
                  onClick={() => handleChange('banner', '')}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                >
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-20">
                <FiUpload className="text-gray-400 mb-2" size={32} />
                <span className="text-sm text-gray-500">Recommended: 1200x300px</span>
              </div>
            )}
          </div>
          <input
            type="text"
            value={data.banner}
            onChange={(e) => handleChange('banner', e.target.value)}
            className="w-full mt-2 px-3 py-2 border rounded-lg text-sm"
            placeholder="Banner URL"
          />
        </div>
      </div>
    </div>
  );
};

// Widget Manager
const WidgetManager = ({ value, onChange }) => {
  const [widgets, setWidgets] = useState(value || []);

  const widgetOptions = [
    { type: 'apply_now', label: 'Apply Now CTA', icon: '📝' },
    { type: 'book_seat', label: 'Book Your Seat', icon: '🎟️' },
    { type: 'download_brochure', label: 'Download Brochure', icon: '📄' },
    { type: 'contact_form', label: 'Contact Form', icon: '📧' },
    { type: 'comparison', label: 'Comparison Widget', icon: '⚖️' },
    { type: 'ranking', label: 'Ranking Display', icon: '🏆' },
    { type: 'fee_calculator', label: 'Fee Calculator', icon: '🧮' },
    { type: 'admission_predictor', label: 'Admission Predictor', icon: '🎯' },
  ];

  const addWidget = (type) => {
    const option = widgetOptions.find(w => w.type === type);
    const newWidget = {
      id: `widget-${Date.now()}`,
      type,
      label: option?.label || type,
      enabled: true,
      config: {}
    };
    const newWidgets = [...widgets, newWidget];
    setWidgets(newWidgets);
    onChange(newWidgets);
  };

  const toggleWidget = (index) => {
    const newWidgets = [...widgets];
    newWidgets[index].enabled = !newWidgets[index].enabled;
    setWidgets(newWidgets);
    onChange(newWidgets);
  };

  const removeWidget = (index) => {
    const newWidgets = widgets.filter((_, i) => i !== index);
    setWidgets(newWidgets);
    onChange(newWidgets);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiGrid className="text-gray-600" size={20} />
        <h3 className="font-semibold text-gray-800">Widget Management</h3>
      </div>
      
      {/* Available Widgets */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Add widgets:</p>
        <div className="flex flex-wrap gap-2">
          {widgetOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => addWidget(option.type)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              <span>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Widgets */}
      {widgets.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Active Widgets:</p>
          {widgets.map((widget, idx) => (
            <div key={widget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={widget.enabled}
                  onChange={() => toggleWidget(idx)}
                  className="rounded"
                />
                <span className="text-sm font-medium">{widget.label}</span>
              </div>
              <button onClick={() => removeWidget(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Badge Manager
const BadgeManager = ({ value, onChange }) => {
  const [selectedBadges, setSelectedBadges] = useState(value || []);

  const badgeOptions = [
    { id: 'featured', label: 'Featured', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { id: 'verified', label: 'Verified', color: 'bg-green-100 text-green-800 border-green-300' },
    { id: 'admission_open', label: 'Admission Open', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { id: 'admission_partner', label: 'Admission Partner', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { id: 'no_cost_emi', label: 'No Cost EMI', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { id: 'scholarship', label: 'Scholarship Available', color: 'bg-pink-100 text-pink-800 border-pink-300' },
    { id: 'top_rated', label: 'Top Rated', color: 'bg-red-100 text-red-800 border-red-300' },
    { id: 'trending', label: 'Trending', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    { id: 'new', label: 'New', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  ];

  const toggleBadge = (badgeId) => {
    const newBadges = selectedBadges.includes(badgeId)
      ? selectedBadges.filter(b => b !== badgeId)
      : [...selectedBadges, badgeId];
    setSelectedBadges(newBadges);
    onChange(newBadges);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiTag className="text-gray-600" size={20} />
        <h3 className="font-semibold text-gray-800">Badge Management</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {badgeOptions.map((badge) => (
          <button
            key={badge.id}
            onClick={() => toggleBadge(badge.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
              selectedBadges.includes(badge.id)
                ? `${badge.color} border-current`
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedBadges.includes(badge.id) && '✓ '}
            {badge.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Dynamic Menu Builder with SEO
const DynamicMenuBuilder = ({ value, onChange }) => {
  const [menuItems, setMenuItems] = useState(value?.items || []);
  const [menuType, setMenuType] = useState(value?.type || 'tabs');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = menuItems.findIndex(item => item.id === active.id);
      const newIndex = menuItems.findIndex(item => item.id === over.id);
      const newItems = arrayMove(menuItems, oldIndex, newIndex);
      setMenuItems(newItems);
      onChange({ items: newItems, type: menuType });
    }
  };

  const addMenuItem = () => {
    const newItem = {
      id: `menu-${Date.now()}`,
      label: '',
      anchor: '',
      metaTitle: '',
      metaDescription: '',
      enabled: true
    };
    const newItems = [...menuItems, newItem];
    setMenuItems(newItems);
    onChange({ items: newItems, type: menuType });
  };

  const updateMenuItem = (index, field, fieldValue) => {
    const newItems = [...menuItems];
    newItems[index][field] = fieldValue;
    setMenuItems(newItems);
    onChange({ items: newItems, type: menuType });
  };

  const removeMenuItem = (index) => {
    const newItems = menuItems.filter((_, i) => i !== index);
    setMenuItems(newItems);
    onChange({ items: newItems, type: menuType });
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiMenu className="text-gray-600" size={20} />
          <h3 className="font-semibold text-gray-800">Dynamic Menu with SEO</h3>
        </div>
        <select
          value={menuType}
          onChange={(e) => {
            setMenuType(e.target.value);
            onChange({ items: menuItems, type: e.target.value });
          }}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="tabs">Horizontal Tabs</option>
          <option value="sidebar">Sidebar Navigation</option>
          <option value="dropdown">Dropdown Menu</option>
          <option value="sticky">Sticky Nav</option>
        </select>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={menuItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 mb-4">
            {menuItems.map((item, index) => (
              <SortableMenuItem
                key={item.id}
                item={item}
                index={index}
                onUpdate={updateMenuItem}
                onRemove={removeMenuItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={addMenuItem}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
      >
        <FiPlus size={16} />
        Add Menu Item
      </button>
    </div>
  );
};

// Content Team Section
const ContentTeamSection = ({ value, onChange }) => {
  const [team, setTeam] = useState(value || {
    author: '',
    authorImage: '',
    authorBio: '',
    reviewedBy: '',
    reviewerImage: '',
    publishDate: '',
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  const handleChange = (field, fieldValue) => {
    const newTeam = { ...team, [field]: fieldValue };
    setTeam(newTeam);
    onChange(newTeam);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiUsers className="text-gray-600" size={20} />
        <h3 className="font-semibold text-gray-800">Content Team</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Author Details</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Author Name</label>
              <input
                type="text"
                value={team.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Author Image URL</label>
              <input
                type="text"
                value={team.authorImage}
                onChange={(e) => handleChange('authorImage', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Author Bio</label>
              <textarea
                value={team.authorBio}
                onChange={(e) => handleChange('authorBio', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
                placeholder="Short bio..."
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-3">Review & Dates</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Reviewed By</label>
              <input
                type="text"
                value={team.reviewedBy}
                onChange={(e) => handleChange('reviewedBy', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Expert Name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Publish Date</label>
              <input
                type="date"
                value={team.publishDate}
                onChange={(e) => handleChange('publishDate', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Last Updated</label>
              <input
                type="date"
                value={team.lastUpdated}
                onChange={(e) => handleChange('lastUpdated', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Advanced Content Form Component
const AdvancedContentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    slug: '',
    status: 'draft',
    pageType: 'custom',
    
    // Logo & Banner
    logoBanner: { logo: '', banner: '', favicon: '' },
    
    // Main Content with Drag-Drop
    contentBlocks: [],
    
    // SEO Content Area (separate, with hide/show)
    seoContentArea: { visible: true, blocks: [] },
    
    // Dynamic Menu with SEO
    menu: { items: [], type: 'tabs' },
    
    // Table of Contents (connected to content)
    tableOfContents: { autoGenerate: true, items: [] },
    
    // Widgets
    widgets: [],
    
    // Badges
    badges: [],
    
    // Content Team
    contentTeam: {},
    
    // Image Gallery
    gallery: [],
    
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
      structuredData: ''
    }
  });

  // Load existing content if editing
  useEffect(() => {
    if (id) {
      loadContent();
    }
  }, [id]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/advanced-content/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const url = isEditing 
        ? `${API_URL}/api/advanced-content/${id}`
        : `${API_URL}/api/advanced-content`;
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Content saved successfully!');
        if (!isEditing) {
          const data = await response.json();
          navigate(`/admin/advanced-content/edit/${data.id}`);
        }
      } else {
        alert('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Generate preview data
  const getPreviewData = () => ({
    logoBanner: formData.logoBanner,
    seo: formData.seo,
    badges: formData.badges,
    contentTeam: formData.contentTeam,
    menu: formData.menu,
    toc: formData.tableOfContents,
    contentBlocks: formData.contentBlocks,
    widget: formData.widgets[0] || null,
    gallery: formData.gallery
  });

  const tabs = [
    { id: 'content', label: 'Content', icon: FiFileText },
    { id: 'seo-content', label: 'SEO Content', icon: FiLayout },
    { id: 'menu', label: 'Menu & TOC', icon: FiMenu },
    { id: 'media', label: 'Media', icon: FiImage },
    { id: 'widgets', label: 'Widgets & Badges', icon: FiGrid },
    { id: 'team', label: 'Team', icon: FiUsers },
    { id: 'seo', label: 'SEO Settings', icon: FiSettings },
  ];

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
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {isEditing ? 'Edit Content' : 'Create Advanced Content'}
            </h1>
            <p className="text-sm text-gray-500">Build rich content pages with drag-and-drop</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <FiEye size={16} />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <select
              value={formData.status}
              onChange={(e) => updateFormData('status', e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="published">Published</option>
            </select>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              <FiSave size={16} />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r`}>
            {/* Tab Navigation */}
            <div className="bg-gray-50 border-b px-4 py-2 flex gap-1 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'bg-white shadow-sm text-orange-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {/* Basic Info (Always Visible) */}
              <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter page title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => updateFormData('slug', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="page-url-slug"
                    />
                  </div>
                </div>
              </div>

              {/* Content Tab */}
              {activeTab === 'content' && (
                <ContentBuilder
                  value={formData.contentBlocks}
                  onChange={(blocks) => updateFormData('contentBlocks', blocks)}
                  title="Main Content Area (Drag & Drop)"
                />
              )}

              {/* SEO Content Tab */}
              {activeTab === 'seo-content' && (
                <SEOContentArea
                  value={formData.seoContentArea}
                  onChange={(data) => updateFormData('seoContentArea', data)}
                  title="SEO Content Area"
                />
              )}

              {/* Menu & TOC Tab */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  <DynamicMenuBuilder
                    value={formData.menu}
                    onChange={(menu) => updateFormData('menu', menu)}
                  />
                  
                  {/* Table of Contents Settings */}
                  <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Table of Contents</h3>
                    <label className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={formData.tableOfContents.autoGenerate}
                        onChange={(e) => updateFormData('tableOfContents', {
                          ...formData.tableOfContents,
                          autoGenerate: e.target.checked
                        })}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Auto-generate from content headings</span>
                    </label>
                    <p className="text-sm text-gray-500">
                      The Table of Contents will automatically link to sections in your main content area based on heading anchors.
                    </p>
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <LogoBannerUploader
                    value={formData.logoBanner}
                    onChange={(data) => updateFormData('logoBanner', data)}
                  />
                  <ImageGallery
                    value={formData.gallery}
                    onChange={(gallery) => updateFormData('gallery', gallery)}
                  />
                </div>
              )}

              {/* Widgets & Badges Tab */}
              {activeTab === 'widgets' && (
                <div className="space-y-6">
                  <WidgetManager
                    value={formData.widgets}
                    onChange={(widgets) => updateFormData('widgets', widgets)}
                  />
                  <BadgeManager
                    value={formData.badges}
                    onChange={(badges) => updateFormData('badges', badges)}
                  />
                </div>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <ContentTeamSection
                  value={formData.contentTeam}
                  onChange={(team) => updateFormData('contentTeam', team)}
                />
              )}

              {/* SEO Settings Tab */}
              {activeTab === 'seo' && (
                <SEOSection
                  value={formData.seo}
                  onChange={(seo) => updateFormData('seo', seo)}
                />
              )}
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 bg-gray-100">
              <LivePreview data={getPreviewData()} />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdvancedContentForm;
