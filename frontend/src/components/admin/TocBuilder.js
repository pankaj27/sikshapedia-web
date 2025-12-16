import React from 'react';
import { FiPlus, FiTrash2, FiCopy, FiChevronUp, FiChevronDown } from 'react-icons/fi';

/**
 * Reusable Table of Contents Builder Component
 */
const TocBuilder = ({
  items = [],
  onChange,
  title = 'Table of Contents',
  showQuickTemplates = true,
  showPreview = true,
  compact = false
}) => {
  const addItem = () => {
    onChange([...items, { title: 'New Section', anchor: `section-${Date.now()}`, content: '' }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'title') {
      newItems[index].anchor = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    onChange(newItems);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index, direction) => {
    const newItems = [...items];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < items.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      onChange(newItems);
    }
  };

  const quickTemplates = [
    { label: 'Overview', sections: ['About', 'Highlights', 'Quick Facts'] },
    { label: 'Admission', sections: ['Eligibility', 'Application Process', 'Important Dates', 'Documents Required'] },
    { label: 'Academics', sections: ['Courses Offered', 'Fee Structure', 'Syllabus', 'Faculty'] },
    { label: 'Campus', sections: ['Infrastructure', 'Facilities', 'Hostel', 'Library'] }
  ];

  const applyTemplate = (sections) => {
    const newItems = sections.map(title => ({
      title,
      anchor: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: ''
    }));
    onChange([...items, ...newItems]);
  };

  const copyTocHtml = () => {
    const html = `<nav class="toc">\n  <ul>\n${items.map(item => `    <li><a href="#${item.anchor}">${item.title}</a></li>`).join('\n')}\n  </ul>\n</nav>`;
    navigator.clipboard.writeText(html);
  };

  const copySectionHtml = (item) => {
    const html = `<section id="${item.anchor}">\n  <h2>${item.title}</h2>\n  <div>${item.content || 'Content here...'}</div>\n</section>`;
    navigator.clipboard.writeText(html);
  };

  return (
    <div className={compact ? '' : 'space-y-4'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className={compact ? 'text-xs font-semibold text-gray-700' : 'text-sm font-medium'}>
          {title}
        </p>
        <button
          type="button"
          onClick={addItem}
          className={compact ? 'text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600' : 'px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600'}
        >
          <FiPlus className="inline mr-1" /> Add Section
        </button>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-xs text-gray-500 italic">No sections added. Click "+ Add Section" to add.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded p-2 border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  placeholder="Section Title"
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />
                <span className="text-xs text-gray-400">#{item.anchor}</span>
                <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                  <FiChevronUp size={14} />
                </button>
                <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                  <FiChevronDown size={14} />
                </button>
                <button type="button" onClick={() => copySectionHtml(item)} className="p-1 hover:bg-gray-200 rounded text-blue-600" title="Copy HTML">
                  <FiCopy size={14} />
                </button>
                <button type="button" onClick={() => removeItem(index)} className="p-1 hover:bg-red-100 rounded text-red-500">
                  <FiTrash2 size={14} />
                </button>
              </div>
              {!compact && (
                <textarea
                  value={item.content || ''}
                  onChange={(e) => updateItem(index, 'content', e.target.value)}
                  placeholder="Section content (supports HTML)..."
                  rows={2}
                  className="w-full mt-2 border rounded px-2 py-1 text-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Templates */}
      {showQuickTemplates && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-600 mb-2">💡 Quick Templates:</p>
          <div className="flex flex-wrap gap-2">
            {quickTemplates.map((template, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(template.sections)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                + {template.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview & Copy */}
      {showPreview && items.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium">Preview</p>
            <button
              type="button"
              onClick={copyTocHtml}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <FiCopy size={12} /> Copy TOC HTML
            </button>
          </div>
          <div className="bg-white rounded border p-2">
            <ul className="text-xs space-y-1">
              {items.map((item, idx) => (
                <li key={idx} className="text-blue-600 hover:underline cursor-pointer">
                  → {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TocBuilder;
