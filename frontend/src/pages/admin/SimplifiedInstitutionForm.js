/**
 * SimplifiedInstitutionForm v2 - Menu-wise Content Builder
 * 
 * Structure:
 * - Step 1: Info Page (Basic info, Contact, Google Map - all together)
 * - Step 2: Menu Setup (Define custom menu items)
 * - Step 3: Menu Content (Add content for EACH menu item separately)
 * - Step 4: SEO (Meta info + Full SEO content area)
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
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
  FiSave, FiArrowLeft, FiArrowRight, FiCheck, FiImage,
  FiMapPin, FiPhone, FiGlobe, FiMail, FiStar, FiAward,
  FiDollarSign, FiCalendar, FiBook, FiInfo, FiEye, FiMenu,
  FiPlus, FiTrash2, FiMove, FiVideo, FiTable, FiFileText,
  FiChevronDown, FiChevronUp, FiSettings, FiEyeOff, FiX
} from 'react-icons/fi';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// ===========================================
// CONTENT BLOCK COMPONENTS
// ===========================================

// Sortable Block Wrapper
const SortableBlock = ({ id, children, title, type, onRemove, isVisible, onToggleVisibility }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const colors = {
    text: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500' },
    table: { bg: 'bg-teal-50', border: 'border-teal-200', icon: 'text-teal-500' },
    image: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-500' },
    video: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500' },
  };

  const c = colors[type] || colors.text;
  const icons = { text: FiFileText, table: FiTable, image: FiImage, video: FiVideo };
  const Icon = icons[type] || FiFileText;

  return (
    <div ref={setNodeRef} style={style} className={`bg-white border-2 ${c.border} rounded-xl mb-3 ${isDragging ? 'shadow-xl ring-2 ring-orange-500' : ''}`}>
      <div className={`flex items-center justify-between px-4 py-2 ${c.bg} rounded-t-xl border-b ${c.border}`}>
        <div className="flex items-center gap-2">
          <button {...attributes} {...listeners} className="p-1.5 hover:bg-white/50 rounded cursor-grab">
            <FiMove className="text-gray-500" size={16} />
          </button>
          <Icon className={c.icon} size={16} />
          <span className="font-medium text-gray-700 text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onToggleVisibility(id)} className={`p-1.5 rounded ${isVisible ? 'text-green-600' : 'text-gray-400'}`}>
            {isVisible ? <FiEye size={16} /> : <FiEyeOff size={16} />}
          </button>
          <button onClick={() => onRemove(id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      {isVisible && <div className="p-4">{children}</div>}
    </div>
  );
};

// Text Block
const TextBlock = ({ data, onChange }) => {
  const [d, setD] = useState(data || { heading: '', content: '' });
  const update = (field, value) => { const n = { ...d, [field]: value }; setD(n); onChange(n); };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
        <input type="text" value={d.heading || ''} onChange={(e) => update('heading', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:border-blue-500" placeholder="e.g., About, Overview" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea value={d.content || ''} onChange={(e) => update('content', e.target.value)} rows={5}
          className="w-full px-3 py-2 border rounded-lg focus:border-blue-500" placeholder="Write content here. HTML tags like <strong>, <ul>, <li> supported." />
      </div>
    </div>
  );
};

// Table Block
const TableBlock = ({ data, onChange }) => {
  const getInit = () => data?.headers ? data : { title: '', headers: ['Column 1', 'Column 2', 'Column 3'], rows: [['', '', ''], ['', '', '']] };
  const [d, setD] = useState(getInit);
  const update = (newD) => { setD(newD); onChange(newD); };

  const headers = d.headers || [];
  const rows = d.rows || [];

  return (
    <div className="space-y-3">
      <input type="text" value={d.title || ''} onChange={(e) => update({ ...d, title: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg" placeholder="Table Title (e.g., Fee Structure)" />
      <div className="flex gap-2">
        <button type="button" onClick={() => update({ ...d, rows: [...rows, new Array(headers.length).fill('')] })}
          className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm">+ Row</button>
        <button type="button" onClick={() => update({ ...d, headers: [...headers, `Col ${headers.length + 1}`], rows: rows.map(r => [...r, '']) })}
          className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm">+ Column</button>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-teal-50">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="border-r p-2">
                  <input type="text" value={h} onChange={(e) => { const nh = [...headers]; nh[i] = e.target.value; update({ ...d, headers: nh }); }}
                    className="w-full px-2 py-1 border rounded text-center font-semibold" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {(row || []).map((cell, ci) => (
                  <td key={ci} className="border-t border-r p-2">
                    <input type="text" value={cell || ''} onChange={(e) => { const nr = [...rows]; nr[ri][ci] = e.target.value; update({ ...d, rows: nr }); }}
                      className="w-full px-2 py-1 border rounded" placeholder="Data" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Image Block
const ImageBlock = ({ data, onChange }) => {
  const [d, setD] = useState(data || { url: '', alt: '', caption: '' });
  const update = (field, value) => { const n = { ...d, [field]: value }; setD(n); onChange(n); };

  return (
    <div className="space-y-3">
      <input type="text" value={d.url || ''} onChange={(e) => update('url', e.target.value)}
        className="w-full px-3 py-2 border rounded-lg" placeholder="Image URL (https://...)" />
      {d.url && <img src={d.url} alt={d.alt} className="max-h-32 rounded-lg border mx-auto" onError={(e) => e.target.style.display = 'none'} />}
      <div className="grid grid-cols-2 gap-3">
        <input type="text" value={d.alt || ''} onChange={(e) => update('alt', e.target.value)}
          className="px-3 py-2 border rounded-lg" placeholder="Alt text (SEO)" />
        <input type="text" value={d.caption || ''} onChange={(e) => update('caption', e.target.value)}
          className="px-3 py-2 border rounded-lg" placeholder="Caption" />
      </div>
    </div>
  );
};

// Video Block
const VideoBlock = ({ data, onChange }) => {
  const [d, setD] = useState(data || { url: '', title: '' });
  const update = (field, value) => { const n = { ...d, [field]: value }; setD(n); onChange(n); };
  const getYtId = (url) => { const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/); return m ? m[1] : null; };
  const ytId = getYtId(d.url);

  return (
    <div className="space-y-3">
      <input type="text" value={d.url || ''} onChange={(e) => update('url', e.target.value)}
        className="w-full px-3 py-2 border rounded-lg" placeholder="YouTube URL (https://youtube.com/watch?v=...)" />
      {ytId && <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full aspect-video rounded-lg" allowFullScreen />}
      <input type="text" value={d.title || ''} onChange={(e) => update('title', e.target.value)}
        className="w-full px-3 py-2 border rounded-lg" placeholder="Video Title" />
    </div>
  );
};

// Menu Content Builder (for one menu item)
const MenuContentBuilder = ({ menuItem, content, onChange }) => {
  const [blocks, setBlocks] = useState(content || []);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const updateBlocks = (newBlocks) => { setBlocks(newBlocks); onChange(newBlocks); };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIdx = blocks.findIndex(b => b.id === active.id);
      const newIdx = blocks.findIndex(b => b.id === over.id);
      updateBlocks(arrayMove(blocks, oldIdx, newIdx));
    }
  };

  const addBlock = (type) => {
    const titles = { text: 'Text Section', table: 'Data Table', image: 'Image', video: 'Video' };
    updateBlocks([...blocks, { id: `${type}-${Date.now()}`, type, title: titles[type], data: {}, visible: true }]);
  };

  const removeBlock = (id) => updateBlocks(blocks.filter(b => b.id !== id));
  const toggleVisibility = (id) => updateBlocks(blocks.map(b => b.id === id ? { ...b, visible: !b.visible } : b));
  const updateBlockData = (id, data) => updateBlocks(blocks.map(b => b.id === id ? { ...b, data } : b));

  const getComponent = (block) => {
    const props = { data: block.data, onChange: (d) => updateBlockData(block.id, d) };
    switch (block.type) {
      case 'text': return <TextBlock {...props} />;
      case 'table': return <TableBlock {...props} />;
      case 'image': return <ImageBlock {...props} />;
      case 'video': return <VideoBlock {...props} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-white">
        <h4 className="font-bold text-lg">{menuItem.label}</h4>
        <p className="text-orange-100 text-sm">Add content for this menu section</p>
      </div>

      {/* Add Buttons */}
      <div className="px-4 py-3 bg-gray-50 border-b flex flex-wrap gap-2">
        <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
          <FiFileText size={14} /> Text
        </button>
        <button type="button" onClick={() => addBlock('table')} className="flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm hover:bg-teal-200">
          <FiTable size={14} /> Table
        </button>
        <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200">
          <FiImage size={14} /> Image
        </button>
        <button type="button" onClick={() => addBlock('video')} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
          <FiVideo size={14} /> Video
        </button>
      </div>

      {/* Content Blocks */}
      <div className="p-4">
        {blocks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-xl text-gray-400">
            <FiPlus className="mx-auto mb-2" size={32} />
            <p>Click buttons above to add content</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map(block => (
                <SortableBlock key={block.id} id={block.id} title={block.title} type={block.type}
                  onRemove={removeBlock} isVisible={block.visible} onToggleVisibility={toggleVisibility}>
                  {getComponent(block)}
                </SortableBlock>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

// ===========================================
// STEP COMPONENTS
// ===========================================

// Step 1: Info Page (Basic Info + Contact + Google Map)
const InfoPageStep = ({ formData, setFormData, entityType }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📄 Info Page</h2>
        <p className="text-blue-100">This is the main information page that appears first. All basic details, contact info, and map go here.</p>
      </div>

      {/* Basic Details */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiInfo className="text-blue-500" /> Basic Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{entityType} Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl focus:border-blue-500" placeholder={`Enter ${entityType} name`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
            <input type="text" name="slug" value={formData.slug || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl bg-gray-50" placeholder="auto-generated" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
            <textarea name="short_description" value={formData.short_description || ''} onChange={handleChange} rows={3}
              className="w-full px-4 py-2.5 border-2 rounded-xl focus:border-blue-500" placeholder="Brief description (2-3 lines)" />
          </div>
        </div>
        
        {/* Logo & Cover */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input type="text" name="logo" value={formData.logo || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="https://..." />
            {formData.logo && <img src={formData.logo} alt="Logo" className="mt-2 h-12 object-contain" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input type="text" name="cover_image" value={formData.cover_image || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="https://..." />
            {formData.cover_image && <img src={formData.cover_image} alt="Cover" className="mt-2 h-16 w-full object-cover rounded-lg" />}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-xl border-2 border-green-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiPhone className="text-green-500" /> Contact Details
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="+91 1234567890" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="info@college.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input type="url" name="website" value={formData.website || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="https://www.college.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Helpline</label>
            <input type="text" name="admission_phone" value={formData.admission_phone || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="+91 9876543210" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Email</label>
            <input type="email" name="admission_email" value={formData.admission_email || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="admissions@college.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
            <input type="text" name="fax" value={formData.fax || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="+91 22 12345678" />
          </div>
        </div>
      </div>

      {/* Location & Google Map */}
      <div className="bg-white rounded-xl border-2 border-orange-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiMapPin className="text-orange-500" /> Location & Google Map
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
            <input type="text" name="city" value={formData.city || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="Mumbai" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
            <input type="text" name="state" value={formData.state || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="Maharashtra" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
            <input type="text" name="pincode" value={formData.pincode || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="400001" />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
            <textarea name="address" value={formData.address || ''} onChange={handleChange} rows={2}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="Complete street address" />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiMapPin className="inline mr-1" /> Google Map Embed URL
            </label>
            <input type="text" name="google_map_url" value={formData.google_map_url || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="https://www.google.com/maps/embed?pb=..." />
            <p className="text-xs text-gray-500 mt-1">Go to Google Maps → Share → Embed → Copy the src URL from iframe</p>
            {formData.google_map_url && (
              <div className="mt-3 rounded-xl overflow-hidden border-2 border-orange-200">
                <iframe src={formData.google_map_url} className="w-full h-48" loading="lazy" allowFullScreen />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiStar className="text-purple-500" /> Quick Stats
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
            <input type="number" name="established_year" value={formData.established_year || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="1990" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
            <input type="number" name="rating" value={formData.rating || ''} onChange={handleChange}
              min="0" max="5" step="0.1" className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="4.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institute Type</label>
            <select name="institute_type" value={formData.institute_type || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl">
              <option value="">Select</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="deemed">Deemed</option>
              <option value="autonomous">Autonomous</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation</label>
            <select name="accreditation" value={formData.accreditation || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl">
              <option value="">Select</option>
              <option value="A++">NAAC A++</option>
              <option value="A+">NAAC A+</option>
              <option value="A">NAAC A</option>
              <option value="B++">NAAC B++</option>
              <option value="B+">NAAC B+</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Range Min (₹)</label>
            <input type="number" name="fee_range_min" value={formData.fee_range_min || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="50000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Range Max (₹)</label>
            <input type="number" name="fee_range_max" value={formData.fee_range_max || ''} onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="500000" />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">📊 Status</h3>
        <div className="flex gap-4">
          {['draft', 'pending', 'published'].map(status => (
            <label key={status} className={`flex-1 p-4 rounded-xl border-2 cursor-pointer ${
              formData.status === status 
                ? status === 'published' ? 'border-green-500 bg-green-50' : status === 'pending' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-500 bg-gray-100'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input type="radio" name="status" value={status} checked={formData.status === status} onChange={handleChange} className="sr-only" />
              <p className="font-bold capitalize">{status}</p>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Step 2: Menu Setup
const MenuSetupStep = ({ formData, setFormData }) => {
  const [menuItems, setMenuItems] = useState(formData.custom_menu || [
    { id: 'courses', label: 'Courses & Fees', enabled: true },
    { id: 'admission', label: 'Admission', enabled: true },
    { id: 'placements', label: 'Placements', enabled: true },
    { id: 'cutoff', label: 'Cutoff', enabled: false },
    { id: 'scholarship', label: 'Scholarship', enabled: false },
    { id: 'facilities', label: 'Facilities', enabled: false },
    { id: 'reviews', label: 'Reviews', enabled: false },
    { id: 'gallery', label: 'Gallery', enabled: false },
    { id: 'faq', label: 'FAQ', enabled: false },
  ]);

  const [newItemLabel, setNewItemLabel] = useState('');

  const updateMenu = (items) => {
    setMenuItems(items);
    setFormData(prev => ({ ...prev, custom_menu: items }));
  };

  const toggleItem = (id) => {
    updateMenu(menuItems.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const moveUp = (index) => {
    if (index > 0) {
      const items = [...menuItems];
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
      updateMenu(items);
    }
  };

  const moveDown = (index) => {
    if (index < menuItems.length - 1) {
      const items = [...menuItems];
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      updateMenu(items);
    }
  };

  const addNewItem = () => {
    if (newItemLabel.trim()) {
      const id = newItemLabel.toLowerCase().replace(/\s+/g, '-');
      if (!menuItems.find(m => m.id === id)) {
        updateMenu([...menuItems, { id, label: newItemLabel.trim(), enabled: true }]);
        setNewItemLabel('');
      }
    }
  };

  const removeItem = (id) => {
    updateMenu(menuItems.filter(m => m.id !== id));
  };

  const updateLabel = (id, label) => {
    updateMenu(menuItems.map(m => m.id === id ? { ...m, label } : m));
  };

  const enabledCount = menuItems.filter(m => m.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📑 Menu Setup</h2>
        <p className="text-purple-100">Define which menu items to show. Each enabled item will have its own content page.</p>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <p className="text-blue-800">
          <strong>ℹ️ How it works:</strong> Enable the menu items you want to show. In the next step, you'll add content for each enabled menu item.
          The "Info" page is always shown first with the basic details you filled in Step 1.
        </p>
      </div>

      {/* Add New Menu Item */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Add Custom Menu Item</h4>
        <div className="flex gap-3">
          <input type="text" value={newItemLabel} onChange={(e) => setNewItemLabel(e.target.value)}
            placeholder="e.g., Hostel, Transportation, Alumni"
            className="flex-1 px-4 py-2.5 border-2 rounded-xl" />
          <button type="button" onClick={addNewItem}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium">
            <FiPlus className="inline mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
          <h4 className="font-semibold text-gray-800">Menu Items</h4>
          <span className="text-sm text-gray-500">{enabledCount} enabled</span>
        </div>
        <div className="divide-y">
          {menuItems.map((item, index) => (
            <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${item.enabled ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
              {/* Order Number */}
              <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
                item.enabled ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'
              }`}>{index + 1}</span>

              {/* Label (Editable) */}
              <input type="text" value={item.label} onChange={(e) => updateLabel(item.id, e.target.value)}
                className={`flex-1 px-3 py-1.5 border rounded-lg ${item.enabled ? 'bg-white' : 'bg-gray-100'}`} />

              {/* Toggle */}
              <button type="button" onClick={() => toggleItem(item.id)}
                className={`px-4 py-1.5 rounded-lg font-medium text-sm ${
                  item.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                }`}>
                {item.enabled ? '✓ Enabled' : 'Disabled'}
              </button>

              {/* Reorder */}
              <div className="flex flex-col">
                <button type="button" onClick={() => moveUp(index)} disabled={index === 0}
                  className={`p-1 ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'} rounded`}>
                  <FiChevronUp size={16} />
                </button>
                <button type="button" onClick={() => moveDown(index)} disabled={index === menuItems.length - 1}
                  className={`p-1 ${index === menuItems.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'} rounded`}>
                  <FiChevronDown size={16} />
                </button>
              </div>

              {/* Remove */}
              <button type="button" onClick={() => removeItem(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-100 rounded-xl p-4">
        <h4 className="font-semibold text-gray-700 mb-3">Menu Preview</h4>
        <div className="bg-white rounded-lg p-3 flex flex-wrap gap-2">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Info</span>
          {menuItems.filter(m => m.enabled).map((m, i) => (
            <span key={i} className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium">{m.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Step 3: Menu Content
const MenuContentStep = ({ formData, setFormData }) => {
  const enabledMenus = (formData.custom_menu || []).filter(m => m.enabled);
  const [activeMenu, setActiveMenu] = useState(enabledMenus[0]?.id || '');
  const [menuContents, setMenuContents] = useState(formData.menu_contents || {});

  useEffect(() => {
    if (!activeMenu && enabledMenus.length > 0) {
      setActiveMenu(enabledMenus[0].id);
    }
  }, [enabledMenus, activeMenu]);

  const handleContentChange = (menuId, content) => {
    const newContents = { ...menuContents, [menuId]: content };
    setMenuContents(newContents);
    setFormData(prev => ({ ...prev, menu_contents: newContents }));
  };

  if (enabledMenus.length === 0) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
        <FiMenu className="mx-auto text-yellow-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-yellow-800 mb-2">No Menu Items Enabled</h3>
        <p className="text-yellow-600">Go back to Step 2 and enable at least one menu item to add content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📝 Menu Content</h2>
        <p className="text-green-100">Add content for each menu item. Select a menu tab below and add text, tables, images, or videos.</p>
      </div>

      {/* Menu Tabs */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-2 flex flex-wrap gap-2">
        {enabledMenus.map((menu) => (
          <button key={menu.id} type="button" onClick={() => setActiveMenu(menu.id)}
            className={`px-4 py-2.5 rounded-lg font-medium transition ${
              activeMenu === menu.id 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {menu.label}
            {menuContents[menu.id]?.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {menuContents[menu.id].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Builder for Active Menu */}
      {activeMenu && enabledMenus.find(m => m.id === activeMenu) && (
        <MenuContentBuilder
          menuItem={enabledMenus.find(m => m.id === activeMenu)}
          content={menuContents[activeMenu] || []}
          onChange={(content) => handleContentChange(activeMenu, content)}
        />
      )}
    </div>
  );
};

// Step 4: SEO
const SEOStep = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [seoBlocks, setSeoBlocks] = useState(formData.seo_content_blocks || []);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const updateSeoBlocks = (newBlocks) => {
    setSeoBlocks(newBlocks);
    setFormData(prev => ({ ...prev, seo_content_blocks: newBlocks }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIdx = seoBlocks.findIndex(b => b.id === active.id);
      const newIdx = seoBlocks.findIndex(b => b.id === over.id);
      updateSeoBlocks(arrayMove(seoBlocks, oldIdx, newIdx));
    }
  };

  const addBlock = (type) => {
    const titles = { text: 'Text Section', table: 'Data Table', image: 'Image', video: 'Video' };
    updateSeoBlocks([...seoBlocks, { id: `seo-${type}-${Date.now()}`, type, title: titles[type], data: {}, visible: true }]);
  };

  const removeBlock = (id) => updateSeoBlocks(seoBlocks.filter(b => b.id !== id));
  const toggleVisibility = (id) => updateSeoBlocks(seoBlocks.map(b => b.id === id ? { ...b, visible: !b.visible } : b));
  const updateBlockData = (id, data) => updateSeoBlocks(seoBlocks.map(b => b.id === id ? { ...b, data } : b));

  const getComponent = (block) => {
    const props = { data: block.data, onChange: (d) => updateBlockData(block.id, d) };
    switch (block.type) {
      case 'text': return <TextBlock {...props} />;
      case 'table': return <TableBlock {...props} />;
      case 'image': return <ImageBlock {...props} />;
      case 'video': return <VideoBlock {...props} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🔍 SEO Settings</h2>
        <p className="text-pink-100">Optimize for search engines with meta tags and additional SEO content.</p>
      </div>

      {/* Meta Tags */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Meta Tags</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input type="text" value={formData.meta_title || ''} onChange={(e) => handleChange('meta_title', e.target.value)}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="Page title for search results (50-60 characters)" />
            <span className={`text-xs ${(formData.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-400'}`}>
              {formData.meta_title?.length || 0}/60
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea value={formData.meta_description || ''} onChange={(e) => handleChange('meta_description', e.target.value)} rows={3}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="Brief description for search results (150-160 characters)" />
            <span className={`text-xs ${(formData.meta_description?.length || 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
              {formData.meta_description?.length || 0}/160
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
            <input type="text" value={formData.meta_keywords || ''} onChange={(e) => handleChange('meta_keywords', e.target.value)}
              className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="keyword1, keyword2, keyword3" />
          </div>
        </div>
      </div>

      {/* SEO Content Area */}
      <div className="bg-white rounded-xl border-2 border-pink-200 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 text-white">
          <h3 className="font-bold text-lg">📄 SEO Content Area</h3>
          <p className="text-pink-100 text-sm">Additional content for SEO (appears in "Read More" section)</p>
        </div>
        
        {/* SEO Intro */}
        <div className="p-6 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-1">SEO Introduction (Short Preview)</label>
          <textarea value={formData.seo_intro || ''} onChange={(e) => handleChange('seo_intro', e.target.value)} rows={3}
            className="w-full px-4 py-2.5 border-2 rounded-xl" placeholder="Short intro that appears before 'Read More' button (2-3 lines)" />
        </div>

        {/* Add Buttons */}
        <div className="px-6 py-3 bg-gray-50 border-b flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Add SEO Content:</span>
          <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
            <FiFileText size={14} /> Text
          </button>
          <button type="button" onClick={() => addBlock('table')} className="flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm hover:bg-teal-200">
            <FiTable size={14} /> Table
          </button>
          <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200">
            <FiImage size={14} /> Image
          </button>
          <button type="button" onClick={() => addBlock('video')} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
            <FiVideo size={14} /> Video
          </button>
        </div>

        {/* SEO Content Blocks */}
        <div className="p-6">
          {seoBlocks.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-xl text-gray-400">
              <p>Add content blocks above for SEO (optional)</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={seoBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {seoBlocks.map(block => (
                  <SortableBlock key={block.id} id={block.id} title={block.title} type={block.type}
                    onRemove={removeBlock} isVisible={block.visible} onToggleVisibility={toggleVisibility}>
                    {getComponent(block)}
                  </SortableBlock>
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Search Preview */}
      <div className="bg-gray-100 rounded-xl p-4">
        <h4 className="font-semibold text-gray-700 mb-3">Search Result Preview</h4>
        <div className="bg-white rounded-lg p-4 border">
          <p className="text-blue-600 text-lg hover:underline">{formData.meta_title || formData.name || 'Page Title'}</p>
          <p className="text-green-700 text-sm">www.yoursite.com/{formData.slug || 'page-url'}</p>
          <p className="text-gray-600 text-sm mt-1">{formData.meta_description || formData.short_description || 'Page description...'}</p>
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
    custom_menu: [],
    menu_contents: {},
    seo_content_blocks: []
  });

  const steps = [
    { id: 1, title: 'Info Page', icon: FiInfo, description: 'Basic details, contact, map' },
    { id: 2, title: 'Menu Setup', icon: FiMenu, description: 'Define menu items' },
    { id: 3, title: 'Menu Content', icon: FiFileText, description: 'Add content per menu' },
    { id: 4, title: 'SEO', icon: FiStar, description: 'Meta tags & SEO content' },
  ];

  useEffect(() => { if (id) loadData(); }, [id]);

  useEffect(() => {
    if (!formData.slug && formData.name) {
      setFormData(prev => ({ ...prev, slug: formData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 100) }));
    }
  }, [formData.name]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = entityType === 'college' ? 'colleges' : entityType === 'school' ? 'schools' : 'universities';
      const response = await fetch(`${API_URL}/api/${endpoint}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) setFormData(await response.json());
    } catch (error) {
      console.error('Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = entityType === 'college' ? 'colleges' : entityType === 'school' ? 'schools' : 'universities';
      const url = isEditing ? `${API_URL}/api/${endpoint}/${id}` : `${API_URL}/api/${endpoint}`;
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('✅ Saved successfully!');
        if (!isEditing) {
          const data = await response.json();
          navigate(`/admin/${entityType}s/simple/edit/${data.id}`);
        }
      } else {
        const err = await response.json().catch(() => ({}));
        alert(`❌ Failed: ${err.detail || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? `Edit ${entityType}` : `Add ${entityType}`}
              </h1>
              {formData.name && <p className="text-gray-500">{formData.name}</p>}
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 font-medium shadow-lg">
              <FiSave size={20} />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

          {/* Steps */}
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <button onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                      currentStep === step.id ? 'bg-orange-500 text-white shadow-lg' 
                        : currentStep > step.id ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === step.id ? 'bg-white/20' : currentStep > step.id ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {currentStep > step.id ? <FiCheck size={18} /> : <step.icon size={18} />}
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="font-semibold">{step.title}</p>
                      <p className={`text-xs ${currentStep === step.id ? 'text-orange-100' : 'text-gray-400'}`}>{step.description}</p>
                    </div>
                  </button>
                  {idx < steps.length - 1 && <div className={`flex-1 h-1 rounded-full ${currentStep > step.id ? 'bg-green-400' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {currentStep === 1 && <InfoPageStep formData={formData} setFormData={setFormData} entityType={entityType} />}
          {currentStep === 2 && <MenuSetupStep formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <MenuContentStep formData={formData} setFormData={setFormData} />}
          {currentStep === 4 && <SEOStep formData={formData} setFormData={setFormData} />}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)} disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${currentStep === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              <FiArrowLeft size={20} /> Previous
            </button>
            <p className="text-center"><span className="text-sm text-gray-500">Step {currentStep} of 4</span><br /><strong>{steps[currentStep - 1].title}</strong></p>
            {currentStep < 4 ? (
              <button onClick={() => setCurrentStep(currentStep + 1)} className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium">
                Next <FiArrowRight size={20} />
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 font-medium">
                <FiCheck size={20} /> {saving ? 'Saving...' : 'Save & Finish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SimplifiedInstitutionForm;
