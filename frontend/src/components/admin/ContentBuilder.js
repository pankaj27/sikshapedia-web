import React, { useState, useCallback } from 'react';
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
import {
  FiMove, FiTrash2, FiEye, FiEyeOff, FiPlus, FiImage, FiVideo,
  FiTable, FiList, FiFileText, FiUser, FiAward, FiSettings,
  FiLayout, FiGrid, FiLink, FiChevronDown, FiChevronUp, FiEdit
} from 'react-icons/fi';

// Sortable Item Component
const SortableItem = ({ id, children, onRemove, onToggleVisibility, isVisible, title }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg mb-3 ${isDragging ? 'shadow-lg ring-2 ring-blue-500' : 'shadow-sm'} ${!isVisible ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b rounded-t-lg">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing"
          >
            <FiMove className="text-gray-500" />
          </button>
          <span className="font-medium text-gray-700">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleVisibility(id)}
            className={`p-1.5 rounded hover:bg-gray-200 ${isVisible ? 'text-green-600' : 'text-gray-400'}`}
            title={isVisible ? 'Hide section' : 'Show section'}
          >
            {isVisible ? <FiEye size={16} /> : <FiEyeOff size={16} />}
          </button>
          <button
            onClick={() => onRemove(id)}
            className="p-1.5 rounded hover:bg-red-100 text-red-500"
            title="Remove section"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      <div className={`p-4 ${!isVisible ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
};

// Content Block Components
const TableBlock = ({ data, onChange }) => {
  const [rows, setRows] = useState(data?.rows || [['', ''], ['', '']]);
  const [headers, setHeaders] = useState(data?.headers || ['Column 1', 'Column 2']);

  const addRow = () => {
    const newRows = [...rows, headers.map(() => '')];
    setRows(newRows);
    onChange({ headers, rows: newRows });
  };

  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newRows = rows.map(row => [...row, '']);
    setHeaders(newHeaders);
    setRows(newRows);
    onChange({ headers: newHeaders, rows: newRows });
  };

  const updateCell = (rowIdx, colIdx, value) => {
    const newRows = [...rows];
    newRows[rowIdx][colIdx] = value;
    setRows(newRows);
    onChange({ headers, rows: newRows });
  };

  const updateHeader = (idx, value) => {
    const newHeaders = [...headers];
    newHeaders[idx] = value;
    setHeaders(newHeaders);
    onChange({ headers: newHeaders, rows });
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, idx) => (
                <th key={idx} className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => updateHeader(idx, e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm font-semibold"
                    placeholder="Header"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Cell value"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={addRow} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
          + Add Row
        </button>
        <button onClick={addColumn} className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
          + Add Column
        </button>
      </div>
    </div>
  );
};

const TableOfContentsBlock = ({ data, onChange, allBlocks }) => {
  const [items, setItems] = useState(data?.items || []);
  const [autoGenerate, setAutoGenerate] = useState(data?.autoGenerate ?? true);

  const addItem = () => {
    const newItems = [...items, { id: `toc-${Date.now()}`, title: '', anchor: '' }];
    setItems(newItems);
    onChange({ items: newItems, autoGenerate });
  };

  const updateItem = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    setItems(newItems);
    onChange({ items: newItems, autoGenerate });
  };

  const removeItem = (idx) => {
    const newItems = items.filter((_, i) => i !== idx);
    setItems(newItems);
    onChange({ items: newItems, autoGenerate });
  };

  return (
    <div>
      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={autoGenerate}
          onChange={(e) => {
            setAutoGenerate(e.target.checked);
            onChange({ items, autoGenerate: e.target.checked });
          }}
          className="rounded"
        />
        <span className="text-sm">Auto-generate from content headings</span>
      </label>
      
      {!autoGenerate && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="flex gap-2">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(idx, 'title', e.target.value)}
                className="flex-1 px-3 py-2 border rounded text-sm"
                placeholder="Title"
              />
              <input
                type="text"
                value={item.anchor}
                onChange={(e) => updateItem(idx, 'anchor', e.target.value)}
                className="w-32 px-3 py-2 border rounded text-sm"
                placeholder="#anchor"
              />
              <button onClick={() => removeItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
          <button onClick={addItem} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
            + Add Item
          </button>
        </div>
      )}
    </div>
  );
};

const ImageBlock = ({ data, onChange }) => {
  const [imageData, setImageData] = useState(data || { url: '', alt: '', caption: '', alignment: 'center' });

  const handleChange = (field, value) => {
    const newData = { ...imageData, [field]: value };
    setImageData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="text"
          value={imageData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      {imageData.url && (
        <div className="border rounded-lg p-2">
          <img src={imageData.url} alt={imageData.alt} className="max-h-40 mx-auto rounded" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
          <input
            type="text"
            value={imageData.alt}
            onChange={(e) => handleChange('alt', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Image description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
          <select
            value={imageData.alignment}
            onChange={(e) => handleChange('alignment', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="full">Full Width</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
        <input
          type="text"
          value={imageData.caption}
          onChange={(e) => handleChange('caption', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          placeholder="Image caption (optional)"
        />
      </div>
    </div>
  );
};

const VideoBlock = ({ data, onChange }) => {
  const [videoData, setVideoData] = useState(data || { url: '', title: '', description: '' });

  const handleChange = (field, value) => {
    const newData = { ...videoData, [field]: value };
    setVideoData(newData);
    onChange(newData);
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    return url;
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube)</label>
        <input
          type="text"
          value={videoData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      {videoData.url && (
        <div className="border rounded-lg overflow-hidden">
          <iframe
            src={getEmbedUrl(videoData.url)}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={videoData.title}
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
        <input
          type="text"
          value={videoData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          placeholder="Video title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={videoData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          rows={2}
          placeholder="Video description"
        />
      </div>
    </div>
  );
};

const RichTextBlock = ({ data, onChange }) => {
  const [content, setContent] = useState(data?.content || '');
  const [heading, setHeading] = useState(data?.heading || '');
  const [anchorId, setAnchorId] = useState(data?.anchorId || '');

  const handleChange = (field, value) => {
    const newData = { content, heading, anchorId, [field]: value };
    if (field === 'content') setContent(value);
    if (field === 'heading') setHeading(value);
    if (field === 'anchorId') setAnchorId(value);
    onChange(newData);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
          <input
            type="text"
            value={heading}
            onChange={(e) => handleChange('heading', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Section heading"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anchor ID (for TOC)</label>
          <input
            type="text"
            value={anchorId}
            onChange={(e) => handleChange('anchorId', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="section-id"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML supported)</label>
        <textarea
          value={content}
          onChange={(e) => handleChange('content', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
          rows={6}
          placeholder="<p>Your content here...</p>"
        />
      </div>
    </div>
  );
};

const GalleryBlock = ({ data, onChange }) => {
  const [images, setImages] = useState(data?.images || []);
  const [layout, setLayout] = useState(data?.layout || 'grid');

  const addImage = () => {
    const newImages = [...images, { url: '', alt: '', caption: '' }];
    setImages(newImages);
    onChange({ images: newImages, layout });
  };

  const updateImage = (idx, field, value) => {
    const newImages = [...images];
    newImages[idx][field] = value;
    setImages(newImages);
    onChange({ images: newImages, layout });
  };

  const removeImage = (idx) => {
    const newImages = images.filter((_, i) => i !== idx);
    setImages(newImages);
    onChange({ images: newImages, layout });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Layout</label>
        <select
          value={layout}
          onChange={(e) => {
            setLayout(e.target.value);
            onChange({ images, layout: e.target.value });
          }}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          <option value="grid">Grid (3 columns)</option>
          <option value="masonry">Masonry</option>
          <option value="carousel">Carousel</option>
          <option value="single">Single Row</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="border rounded-lg p-3 relative">
            <button
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <FiTrash2 size={12} />
            </button>
            {img.url && <img src={img.url} alt={img.alt} className="w-full h-20 object-cover rounded mb-2" />}
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
      <button onClick={addImage} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
        + Add Image
      </button>
    </div>
  );
};

const BadgeBlock = ({ data, onChange }) => {
  const [badges, setBadges] = useState(data?.badges || []);

  const badgeOptions = [
    { value: 'featured', label: 'Featured', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'verified', label: 'Verified', color: 'bg-green-100 text-green-800' },
    { value: 'admission_open', label: 'Admission Open', color: 'bg-blue-100 text-blue-800' },
    { value: 'admission_partner', label: 'Admission Partner', color: 'bg-purple-100 text-purple-800' },
    { value: 'no_cost_emi', label: 'No Cost EMI', color: 'bg-orange-100 text-orange-800' },
    { value: 'scholarship', label: 'Scholarship Available', color: 'bg-pink-100 text-pink-800' },
    { value: 'top_rated', label: 'Top Rated', color: 'bg-red-100 text-red-800' },
  ];

  const toggleBadge = (badgeValue) => {
    const newBadges = badges.includes(badgeValue)
      ? badges.filter(b => b !== badgeValue)
      : [...badges, badgeValue];
    setBadges(newBadges);
    onChange({ badges: newBadges });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Select badges to display:</p>
      <div className="flex flex-wrap gap-2">
        {badgeOptions.map((badge) => (
          <button
            key={badge.value}
            onClick={() => toggleBadge(badge.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
              badges.includes(badge.value)
                ? `${badge.color} border-current`
                : 'bg-gray-100 text-gray-500 border-transparent'
            }`}
          >
            {badges.includes(badge.value) && '✓ '}{badge.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const ContentTeamBlock = ({ data, onChange }) => {
  const [teamData, setTeamData] = useState(data || {
    author: '',
    authorImage: '',
    authorBio: '',
    reviewedBy: '',
    updatedDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (field, value) => {
    const newData = { ...teamData, [field]: value };
    setTeamData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
          <input
            type="text"
            value={teamData.author}
            onChange={(e) => handleChange('author', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author Image URL</label>
          <input
            type="text"
            value={teamData.authorImage}
            onChange={(e) => handleChange('authorImage', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="https://..."
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Author Bio</label>
        <textarea
          value={teamData.authorBio}
          onChange={(e) => handleChange('authorBio', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          rows={2}
          placeholder="Short author biography..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reviewed By</label>
          <input
            type="text"
            value={teamData.reviewedBy}
            onChange={(e) => handleChange('reviewedBy', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Expert name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
          <input
            type="date"
            value={teamData.updatedDate}
            onChange={(e) => handleChange('updatedDate', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

const MenuConfigBlock = ({ data, onChange }) => {
  const [menuItems, setMenuItems] = useState(data?.items || []);
  const [menuType, setMenuType] = useState(data?.type || 'tabs');

  const addMenuItem = () => {
    const newItems = [...menuItems, { id: `menu-${Date.now()}`, label: '', anchor: '', enabled: true }];
    setMenuItems(newItems);
    onChange({ items: newItems, type: menuType });
  };

  const updateMenuItem = (idx, field, value) => {
    const newItems = [...menuItems];
    newItems[idx][field] = value;
    setMenuItems(newItems);
    onChange({ items: newItems, type: menuType });
  };

  const removeMenuItem = (idx) => {
    const newItems = menuItems.filter((_, i) => i !== idx);
    setMenuItems(newItems);
    onChange({ items: newItems, type: menuType });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Menu Type</label>
        <select
          value={menuType}
          onChange={(e) => {
            setMenuType(e.target.value);
            onChange({ items: menuItems, type: e.target.value });
          }}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          <option value="tabs">Horizontal Tabs</option>
          <option value="sidebar">Sidebar Navigation</option>
          <option value="dropdown">Dropdown Menu</option>
        </select>
      </div>
      <div className="space-y-2">
        {menuItems.map((item, idx) => (
          <div key={item.id} className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => updateMenuItem(idx, 'enabled', e.target.checked)}
              className="rounded"
            />
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateMenuItem(idx, 'label', e.target.value)}
              className="flex-1 px-3 py-2 border rounded text-sm"
              placeholder="Menu Label"
            />
            <input
              type="text"
              value={item.anchor}
              onChange={(e) => updateMenuItem(idx, 'anchor', e.target.value)}
              className="w-32 px-3 py-2 border rounded text-sm"
              placeholder="#anchor"
            />
            <button onClick={() => removeMenuItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded">
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addMenuItem} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
        + Add Menu Item
      </button>
    </div>
  );
};

const WidgetBlock = ({ data, onChange }) => {
  const [widgetData, setWidgetData] = useState(data || { type: 'cta', config: {} });

  const widgetTypes = [
    { value: 'cta', label: 'Call to Action' },
    { value: 'apply_now', label: 'Apply Now Button' },
    { value: 'book_seat', label: 'Book Your Seat' },
    { value: 'download_brochure', label: 'Download Brochure' },
    { value: 'contact_form', label: 'Contact Form' },
    { value: 'comparison', label: 'Comparison Widget' },
    { value: 'ranking', label: 'Ranking Widget' },
  ];

  const handleChange = (field, value) => {
    const newData = { ...widgetData, [field]: value };
    setWidgetData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Widget Type</label>
        <select
          value={widgetData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {widgetTypes.map(w => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
      </div>
      {widgetData.type === 'cta' && (
        <div className="space-y-2">
          <input
            type="text"
            value={widgetData.config?.title || ''}
            onChange={(e) => handleChange('config', { ...widgetData.config, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="CTA Title"
          />
          <input
            type="text"
            value={widgetData.config?.buttonText || ''}
            onChange={(e) => handleChange('config', { ...widgetData.config, buttonText: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Button Text"
          />
          <input
            type="text"
            value={widgetData.config?.buttonLink || ''}
            onChange={(e) => handleChange('config', { ...widgetData.config, buttonLink: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Button Link"
          />
        </div>
      )}
    </div>
  );
};

const LogoBannerBlock = ({ data, onChange }) => {
  const [logoData, setLogoData] = useState(data || { logoUrl: '', bannerUrl: '', bannerAlt: '' });

  const handleChange = (field, value) => {
    const newData = { ...logoData, [field]: value };
    setLogoData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
        <input
          type="text"
          value={logoData.logoUrl}
          onChange={(e) => handleChange('logoUrl', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="https://example.com/logo.png"
        />
        {logoData.logoUrl && (
          <div className="mt-2 p-2 bg-gray-100 rounded inline-block">
            <img src={logoData.logoUrl} alt="Logo preview" className="h-16 object-contain" />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Banner URL</label>
        <input
          type="text"
          value={logoData.bannerUrl}
          onChange={(e) => handleChange('bannerUrl', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="https://example.com/banner.jpg"
        />
        {logoData.bannerUrl && (
          <div className="mt-2 border rounded overflow-hidden">
            <img src={logoData.bannerUrl} alt="Banner preview" className="w-full h-32 object-cover" />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Alt Text</label>
        <input
          type="text"
          value={logoData.bannerAlt}
          onChange={(e) => handleChange('bannerAlt', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          placeholder="Banner description for SEO"
        />
      </div>
    </div>
  );
};

// Block type configuration
const BLOCK_TYPES = {
  table: { label: 'Table', icon: FiTable, component: TableBlock },
  toc: { label: 'Table of Contents', icon: FiList, component: TableOfContentsBlock },
  image: { label: 'Image', icon: FiImage, component: ImageBlock },
  video: { label: 'Video', icon: FiVideo, component: VideoBlock },
  richtext: { label: 'Rich Text Content', icon: FiFileText, component: RichTextBlock },
  gallery: { label: 'Gallery', icon: FiGrid, component: GalleryBlock },
  badge: { label: 'Badges', icon: FiAward, component: BadgeBlock },
  contentTeam: { label: 'Content Team', icon: FiUser, component: ContentTeamBlock },
  menu: { label: 'Dynamic Menu', icon: FiLayout, component: MenuConfigBlock },
  widget: { label: 'Widget', icon: FiSettings, component: WidgetBlock },
  logoBanner: { label: 'Logo & Banner', icon: FiImage, component: LogoBannerBlock },
};

// Main Content Builder Component
const ContentBuilder = ({ value, onChange, title = 'Content Builder' }) => {
  const [blocks, setBlocks] = useState(value || []);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      setBlocks(newBlocks);
      onChange(newBlocks);
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      data: {},
      visible: true,
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    onChange(newBlocks);
    setShowAddMenu(false);
  };

  const removeBlock = (id) => {
    const newBlocks = blocks.filter(b => b.id !== id);
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const toggleBlockVisibility = (id) => {
    const newBlocks = blocks.map(b =>
      b.id === id ? { ...b, visible: !b.visible } : b
    );
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const updateBlockData = (id, data) => {
    const newBlocks = blocks.map(b =>
      b.id === id ? { ...b, data } : b
    );
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus size={18} />
            Add Block
          </button>
          {showAddMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border z-50 w-64 max-h-96 overflow-y-auto">
              {Object.entries(BLOCK_TYPES).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => addBlock(type)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b last:border-b-0"
                >
                  <config.icon className="text-gray-500" size={18} />
                  <span className="text-sm font-medium text-gray-700">{config.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <FiPlus className="mx-auto text-gray-400 mb-3" size={32} />
          <p className="text-gray-500">No content blocks yet. Click "Add Block" to get started.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => {
              const BlockComponent = BLOCK_TYPES[block.type]?.component;
              return (
                <SortableItem
                  key={block.id}
                  id={block.id}
                  title={BLOCK_TYPES[block.type]?.label || block.type}
                  onRemove={removeBlock}
                  onToggleVisibility={toggleBlockVisibility}
                  isVisible={block.visible}
                >
                  {BlockComponent && (
                    <BlockComponent
                      data={block.data}
                      onChange={(data) => updateBlockData(block.id, data)}
                      allBlocks={blocks}
                    />
                  )}
                </SortableItem>
              );
            })}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ContentBuilder;
export { BLOCK_TYPES };
