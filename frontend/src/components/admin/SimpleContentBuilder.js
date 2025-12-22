/**
 * SimpleContentBuilder - A simplified drag-and-drop content builder for data entry operators
 * Features:
 * - Easy drag-and-drop blocks (text, tables, images, videos)
 * - Auto-generates Table of Contents
 * - Simple menu configuration
 * - Visual feedback for all actions
 */
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
  FiTable, FiList, FiFileText, FiChevronDown, FiChevronUp, FiEdit,
  FiCheck, FiX, FiCopy, FiAlertCircle
} from 'react-icons/fi';

// ===========================================
// SORTABLE CONTENT BLOCK WRAPPER
// ===========================================
const SortableBlock = ({ id, children, title, type, onRemove, onToggleVisibility, isVisible }) => {
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

  const blockIcons = {
    text: <FiFileText className="text-blue-500" />,
    table: <FiTable className="text-teal-500" />,
    image: <FiImage className="text-purple-500" />,
    video: <FiVideo className="text-red-500" />,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border-2 rounded-xl mb-4 ${
        isDragging ? 'shadow-2xl ring-2 ring-orange-500' : 'shadow-sm'
      } ${!isVisible ? 'opacity-50 bg-gray-50' : ''}`}
    >
      {/* Block Header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${
        type === 'text' ? 'bg-blue-50 border-b border-blue-100' :
        type === 'table' ? 'bg-teal-50 border-b border-teal-100' :
        type === 'image' ? 'bg-purple-50 border-b border-purple-100' :
        'bg-red-50 border-b border-red-100'
      }`}>
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-2 hover:bg-white/50 rounded-lg cursor-grab active:cursor-grabbing transition"
            title="Drag to reorder"
          >
            <FiMove className="text-gray-600" size={18} />
          </button>
          
          {/* Block Type Icon & Title */}
          <div className="flex items-center gap-2">
            {blockIcons[type]}
            <span className="font-semibold text-gray-700">{title}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleVisibility(id)}
            className={`p-2 rounded-lg transition ${
              isVisible 
                ? 'text-green-600 hover:bg-green-100' 
                : 'text-gray-400 hover:bg-gray-200'
            }`}
            title={isVisible ? 'Hide this section' : 'Show this section'}
          >
            {isVisible ? <FiEye size={18} /> : <FiEyeOff size={18} />}
          </button>
          <button
            onClick={() => onRemove(id)}
            className="p-2 rounded-lg text-red-500 hover:bg-red-100 transition"
            title="Remove this block"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
      
      {/* Block Content */}
      {isVisible && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

// ===========================================
// TEXT BLOCK COMPONENT
// ===========================================
const TextBlock = ({ data, onChange }) => {
  const [localData, setLocalData] = useState(data || {
    heading: '',
    anchorId: '',
    content: ''
  });

  const handleUpdate = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  // Auto-generate anchor from heading
  const autoGenerateAnchor = () => {
    if (localData.heading) {
      const anchor = localData.heading
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
      handleUpdate('anchorId', anchor);
    }
  };

  return (
    <div className="space-y-4">
      {/* Heading Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section Heading <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={localData.heading}
            onChange={(e) => handleUpdate('heading', e.target.value)}
            onBlur={autoGenerateAnchor}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="e.g., About the College, Admission Process"
          />
          <p className="text-xs text-gray-500 mt-1">This will appear as a heading in the page</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anchor ID <span className="text-gray-400">(auto-generated)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={localData.anchorId}
              onChange={(e) => handleUpdate('anchorId', e.target.value)}
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              placeholder="about-college"
            />
            <button
              type="button"
              onClick={autoGenerateAnchor}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              title="Auto-generate from heading"
            >
              <FiCheck size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Used for Table of Contents links</p>
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          value={localData.content}
          onChange={(e) => handleUpdate('content', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          placeholder="Write your content here. You can use basic HTML tags like <strong>, <em>, <ul>, <li>, <p>, etc."
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">HTML tags supported for formatting</p>
          <span className="text-xs text-gray-400">{localData.content?.length || 0} characters</span>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// TABLE BLOCK COMPONENT (Simplified)
// ===========================================
const TableBlock = ({ data, onChange }) => {
  // Initialize with default values, ensuring headers and rows are always arrays
  const getInitialData = () => {
    if (data && data.headers && data.rows) {
      return data;
    }
    return {
      title: data?.title || '',
      headers: ['Column 1', 'Column 2', 'Column 3'],
      rows: [['', '', ''], ['', '', '']]
    };
  };

  const [localData, setLocalData] = useState(getInitialData);

  const updateData = (newData) => {
    setLocalData(newData);
    onChange(newData);
  };

  const addRow = () => {
    const headers = localData.headers || [];
    const newRows = [...(localData.rows || []), new Array(headers.length).fill('')];
    updateData({ ...localData, rows: newRows });
  };

  const addColumn = () => {
    const headers = localData.headers || [];
    const rows = localData.rows || [];
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newRows = rows.map(row => [...(row || []), '']);
    updateData({ ...localData, headers: newHeaders, rows: newRows });
  };

  const removeRow = (rowIndex) => {
    const rows = localData.rows || [];
    if (rows.length > 1) {
      const newRows = rows.filter((_, i) => i !== rowIndex);
      updateData({ ...localData, rows: newRows });
    }
  };

  const removeColumn = (colIndex) => {
    const headers = localData.headers || [];
    const rows = localData.rows || [];
    if (headers.length > 1) {
      const newHeaders = headers.filter((_, i) => i !== colIndex);
      const newRows = rows.map(row => (row || []).filter((_, i) => i !== colIndex));
      updateData({ ...localData, headers: newHeaders, rows: newRows });
    }
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const rows = localData.rows || [];
    const newRows = [...rows];
    if (!newRows[rowIndex]) newRows[rowIndex] = [];
    newRows[rowIndex][colIndex] = value;
    updateData({ ...localData, rows: newRows });
  };

  const updateHeader = (colIndex, value) => {
    const headers = localData.headers || [];
    const newHeaders = [...headers];
    newHeaders[colIndex] = value;
    updateData({ ...localData, headers: newHeaders });
  };

  // Ensure we always have valid arrays for rendering
  const headers = localData.headers || ['Column 1', 'Column 2', 'Column 3'];
  const rows = localData.rows || [['', '', ''], ['', '', '']];

  return (
    <div className="space-y-4">
      {/* Table Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Table Title
        </label>
        <input
          type="text"
          value={localData.title}
          onChange={(e) => updateData({ ...localData, title: e.target.value })}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
          placeholder="e.g., Fee Structure, Placement Statistics"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition text-sm font-medium"
        >
          <FiPlus size={14} /> Add Row
        </button>
        <button
          type="button"
          onClick={addColumn}
          className="flex items-center gap-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition text-sm font-medium"
        >
          <FiPlus size={14} /> Add Column
        </button>
      </div>

      {/* Table Editor */}
      <div className="overflow-x-auto border-2 border-teal-200 rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="bg-teal-100">
              {headers.map((header, colIndex) => (
                <th key={colIndex} className="border-r border-teal-200 last:border-r-0 p-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={header || ''}
                      onChange={(e) => updateHeader(colIndex, e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-teal-300 rounded text-sm font-semibold text-center"
                      placeholder="Header"
                    />
                    {headers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColumn(colIndex)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                        title="Remove column"
                      >
                        <FiX size={12} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-10 bg-teal-50"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-teal-50">
                {(row || []).map((cell, colIndex) => (
                  <td key={colIndex} className="border-t border-r border-teal-200 last:border-r-0 p-2">
                    <input
                      type="text"
                      value={cell || ''}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-teal-400 focus:outline-none"
                      placeholder="Enter data"
                    />
                  </td>
                ))}
                <td className="border-t border-teal-200 p-1 text-center">
                  {localData.rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(rowIndex)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded"
                      title="Remove row"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Stats */}
      <div className="flex gap-4 text-sm text-gray-500">
        <span>{headers.length} columns</span>
        <span>•</span>
        <span>{rows.length} rows</span>
      </div>
    </div>
  );
};

// ===========================================
// IMAGE BLOCK COMPONENT
// ===========================================
const ImageBlock = ({ data, onChange }) => {
  const [localData, setLocalData] = useState(data || {
    url: '',
    alt: '',
    caption: '',
    alignment: 'center'
  });

  const handleUpdate = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={localData.url}
          onChange={(e) => handleUpdate('url', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Preview */}
      {localData.url && (
        <div className="border-2 border-purple-200 rounded-xl p-4 bg-purple-50">
          <img
            src={localData.url}
            alt={localData.alt || 'Preview'}
            className="max-h-48 mx-auto rounded-lg shadow-md"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><rect fill="%23f3f4f6" width="200" height="100"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle" dy=".3em">Image not found</text></svg>';
            }}
          />
        </div>
      )}

      {/* Alt Text & Caption */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alt Text (for SEO)
          </label>
          <input
            type="text"
            value={localData.alt}
            onChange={(e) => handleUpdate('alt', e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            placeholder="Describe the image"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alignment
          </label>
          <select
            value={localData.alignment}
            onChange={(e) => handleUpdate('alignment', e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
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
          value={localData.caption}
          onChange={(e) => handleUpdate('caption', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
          placeholder="Image caption (appears below the image)"
        />
      </div>
    </div>
  );
};

// ===========================================
// VIDEO BLOCK COMPONENT
// ===========================================
const VideoBlock = ({ data, onChange }) => {
  const [localData, setLocalData] = useState(data || {
    url: '',
    title: '',
    description: ''
  });

  const handleUpdate = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(localData.url);

  return (
    <div className="space-y-4">
      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          YouTube Video URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={localData.url}
          onChange={(e) => handleUpdate('url', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="text-xs text-gray-500 mt-1">Paste YouTube video URL (supports youtube.com/watch?v= and youtu.be/ formats)</p>
      </div>

      {/* Video Preview */}
      {videoId && (
        <div className="border-2 border-red-200 rounded-xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={localData.title || 'Video'}
          />
        </div>
      )}

      {/* Title & Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
        <input
          type="text"
          value={localData.title}
          onChange={(e) => handleUpdate('title', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          placeholder="e.g., Campus Tour, Student Testimonials"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={localData.description}
          onChange={(e) => handleUpdate('description', e.target.value)}
          rows={2}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          placeholder="Brief description of the video"
        />
      </div>
    </div>
  );
};

// ===========================================
// MAIN SIMPLE CONTENT BUILDER COMPONENT
// ===========================================
const SimpleContentBuilder = ({ 
  value = [], 
  onChange, 
  onTocChange,
  title = "Content Sections",
  showTocPreview = true 
}) => {
  const [blocks, setBlocks] = useState(value);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate TOC from text blocks
  const generateToc = useCallback((currentBlocks) => {
    const toc = currentBlocks
      .filter(b => b.type === 'text' && b.visible && b.data?.heading && b.data?.anchorId)
      .map(b => ({
        title: b.data.heading,
        anchor: b.data.anchorId
      }));
    
    if (onTocChange) {
      onTocChange(toc);
    }
    return toc;
  }, [onTocChange]);

  // Update blocks and notify parent
  const updateBlocks = useCallback((newBlocks) => {
    setBlocks(newBlocks);
    onChange(newBlocks);
    generateToc(newBlocks);
  }, [onChange, generateToc]);

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      updateBlocks(newBlocks);
    }
  };

  // Add new block
  const addBlock = (type) => {
    const blockTitles = {
      text: 'Text Section',
      table: 'Data Table',
      image: 'Image',
      video: 'Video'
    };
    
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      title: blockTitles[type],
      data: {},
      visible: true,
    };
    updateBlocks([...blocks, newBlock]);
  };

  // Remove block
  const removeBlock = (id) => {
    if (window.confirm('Are you sure you want to remove this block?')) {
      updateBlocks(blocks.filter(b => b.id !== id));
    }
  };

  // Toggle visibility
  const toggleVisibility = (id) => {
    updateBlocks(blocks.map(b => 
      b.id === id ? { ...b, visible: !b.visible } : b
    ));
  };

  // Update block data
  const updateBlockData = (id, data) => {
    const newBlocks = blocks.map(b => {
      if (b.id === id) {
        // Update title for text blocks based on heading
        let title = b.title;
        if (b.type === 'text' && data.heading) {
          title = data.heading || 'Text Section';
        }
        return { ...b, data, title };
      }
      return b;
    });
    updateBlocks(newBlocks);
  };

  // Get block component
  const getBlockComponent = (block) => {
    switch (block.type) {
      case 'text':
        return <TextBlock data={block.data} onChange={(data) => updateBlockData(block.id, data)} />;
      case 'table':
        return <TableBlock data={block.data} onChange={(data) => updateBlockData(block.id, data)} />;
      case 'image':
        return <ImageBlock data={block.data} onChange={(data) => updateBlockData(block.id, data)} />;
      case 'video':
        return <VideoBlock data={block.data} onChange={(data) => updateBlockData(block.id, data)} />;
      default:
        return null;
    }
  };

  // Current TOC items
  const tocItems = blocks
    .filter(b => b.type === 'text' && b.visible && b.data?.heading && b.data?.anchorId)
    .map(b => ({ title: b.data.heading, anchor: b.data.anchorId }));

  return (
    <div className="space-y-6">
      {/* Header with Add Buttons */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-orange-100 text-sm mb-4">
          Add content blocks below. Drag to reorder. Text sections automatically create Table of Contents.
        </p>
        
        {/* Add Block Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => addBlock('text')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium shadow-lg"
          >
            <FiFileText size={18} /> Add Text Section
          </button>
          <button
            type="button"
            onClick={() => addBlock('table')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition font-medium shadow-lg"
          >
            <FiTable size={18} /> Add Table
          </button>
          <button
            type="button"
            onClick={() => addBlock('image')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition font-medium shadow-lg"
          >
            <FiImage size={18} /> Add Image
          </button>
          <button
            type="button"
            onClick={() => addBlock('video')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-lg hover:bg-red-50 transition font-medium shadow-lg"
          >
            <FiVideo size={18} /> Add Video
          </button>
        </div>
      </div>

      {/* Auto-Generated TOC Preview */}
      {showTocPreview && tocItems.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <FiList className="text-green-600" size={20} />
            <h4 className="font-semibold text-green-800">Auto-Generated Table of Contents</h4>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
              {tocItems.length} items
            </span>
          </div>
          <ul className="space-y-1.5">
            {tocItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 flex items-center justify-center bg-green-200 text-green-800 rounded-full text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="text-gray-700">{item.title}</span>
                <span className="text-gray-400 text-xs">#{item.anchor}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-green-600 mt-3">
            ✓ This TOC is automatically created from your text sections and will appear on the detail page
          </p>
        </div>
      )}

      {/* Content Blocks */}
      {blocks.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
          <FiPlus className="mx-auto text-gray-400 mb-4" size={48} />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Content Blocks Yet</h4>
          <p className="text-gray-500 mb-4">Click the buttons above to add text, tables, images, or videos</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                id={block.id}
                title={block.title}
                type={block.type}
                onRemove={removeBlock}
                onToggleVisibility={toggleVisibility}
                isVisible={block.visible}
              >
                {getBlockComponent(block)}
              </SortableBlock>
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* Stats */}
      {blocks.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 px-2">
          <span>
            {blocks.length} content block{blocks.length !== 1 ? 's' : ''} • 
            {blocks.filter(b => b.visible).length} visible
          </span>
          <span className="flex items-center gap-1">
            <FiMove size={14} />
            Drag blocks to reorder
          </span>
        </div>
      )}
    </div>
  );
};

export default SimpleContentBuilder;
