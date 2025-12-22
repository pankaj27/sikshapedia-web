/**
 * SimpleMenuConfig - Simplified menu configuration for data entry operators
 * 
 * Features:
 * - Single checkbox to enable/disable each menu item
 * - Simple reordering (up/down arrows)
 * - Clear visual feedback
 * - Auto-linking to TOC sections
 */
import React, { useState, useEffect } from 'react';
import {
  FiChevronUp, FiChevronDown, FiEye, FiEyeOff, FiInfo,
  FiBook, FiFileText, FiBarChart2, FiBriefcase, FiAward,
  FiDollarSign, FiHome, FiMessageSquare, FiImage, FiUsers,
  FiCalendar, FiMapPin, FiHelpCircle, FiMail, FiBookmark, FiSettings
} from 'react-icons/fi';

// Predefined menu items with icons
const MENU_PRESETS = [
  { id: 'overview', label: 'Overview', icon: FiInfo, description: 'General information about the institution' },
  { id: 'courses', label: 'Courses & Fees', icon: FiBook, description: 'Course details and fee structure' },
  { id: 'admission', label: 'Admission', icon: FiFileText, description: 'Admission process and eligibility' },
  { id: 'cutoff', label: 'Cutoff', icon: FiBarChart2, description: 'Previous year cutoffs' },
  { id: 'placement', label: 'Placement', icon: FiBriefcase, description: 'Placement statistics and companies' },
  { id: 'ranking', label: 'Ranking', icon: FiAward, description: 'Rankings and accreditations' },
  { id: 'scholarship', label: 'Scholarship', icon: FiDollarSign, description: 'Available scholarships' },
  { id: 'facilities', label: 'Facilities', icon: FiHome, description: 'Campus facilities and infrastructure' },
  { id: 'reviews', label: 'Reviews', icon: FiMessageSquare, description: 'Student reviews and ratings' },
  { id: 'gallery', label: 'Gallery', icon: FiImage, description: 'Photos and videos' },
  { id: 'faculty', label: 'Faculty', icon: FiUsers, description: 'Faculty information' },
  { id: 'events', label: 'Events', icon: FiCalendar, description: 'Events and news' },
  { id: 'location', label: 'Location', icon: FiMapPin, description: 'Location and how to reach' },
  { id: 'faq', label: 'FAQ', icon: FiHelpCircle, description: 'Frequently asked questions' },
  { id: 'contact', label: 'Contact', icon: FiMail, description: 'Contact information' },
];

const SimpleMenuConfig = ({ 
  value = { mode: 'default', items: [] }, 
  onChange,
  tocItems = [] // Auto-generated TOC items from content
}) => {
  const [menuMode, setMenuMode] = useState(value.mode || 'default');
  const [menuItems, setMenuItems] = useState([]);

  // Initialize menu items
  useEffect(() => {
    if (value.items && value.items.length > 0) {
      setMenuItems(value.items);
    } else {
      // Initialize with default presets
      const defaultItems = MENU_PRESETS.slice(0, 8).map((preset, index) => ({
        id: preset.id,
        label: preset.label,
        enabled: true,
        order: index,
        linkedToToc: false,
        tocAnchor: ''
      }));
      setMenuItems(defaultItems);
    }
  }, [value.items]);

  // Update parent when mode or items change
  const updateParent = (newMode, newItems) => {
    onChange({ mode: newMode, items: newItems });
  };

  // Toggle menu item
  const toggleItem = (itemId) => {
    const newItems = menuItems.map(item => 
      item.id === itemId ? { ...item, enabled: !item.enabled } : item
    );
    setMenuItems(newItems);
    updateParent(menuMode, newItems);
  };

  // Move item up
  const moveUp = (index) => {
    if (index > 0) {
      const newItems = [...menuItems];
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      newItems.forEach((item, i) => item.order = i);
      setMenuItems(newItems);
      updateParent(menuMode, newItems);
    }
  };

  // Move item down
  const moveDown = (index) => {
    if (index < menuItems.length - 1) {
      const newItems = [...menuItems];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      newItems.forEach((item, i) => item.order = i);
      setMenuItems(newItems);
      updateParent(menuMode, newItems);
    }
  };

  // Link to TOC section
  const linkToToc = (itemId, tocAnchor) => {
    const newItems = menuItems.map(item => 
      item.id === itemId ? { ...item, linkedToToc: !!tocAnchor, tocAnchor } : item
    );
    setMenuItems(newItems);
    updateParent(menuMode, newItems);
  };

  // Add new menu item from preset
  const addMenuItem = (preset) => {
    if (!menuItems.find(item => item.id === preset.id)) {
      const newItem = {
        id: preset.id,
        label: preset.label,
        enabled: true,
        order: menuItems.length,
        linkedToToc: false,
        tocAnchor: ''
      };
      const newItems = [...menuItems, newItem];
      setMenuItems(newItems);
      updateParent(menuMode, newItems);
    }
  };

  // Remove menu item
  const removeItem = (itemId) => {
    const newItems = menuItems.filter(item => item.id !== itemId);
    newItems.forEach((item, i) => item.order = i);
    setMenuItems(newItems);
    updateParent(menuMode, newItems);
  };

  // Change menu mode
  const handleModeChange = (newMode) => {
    setMenuMode(newMode);
    updateParent(newMode, menuItems);
  };

  // Get icon component for item
  const getIcon = (itemId) => {
    const preset = MENU_PRESETS.find(p => p.id === itemId);
    if (preset) {
      const IconComponent = preset.icon;
      return <IconComponent size={18} />;
    }
    return <FiBookmark size={18} />;
  };

  // Available presets not yet added
  const availablePresets = MENU_PRESETS.filter(p => !menuItems.find(item => item.id === p.id));

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <FiSettings size={24} />
          Menu Configuration
        </h3>
        <p className="text-blue-100 text-sm mb-4">
          Choose how the navigation menu appears on the detail page
        </p>

        {/* Mode Options */}
        <div className="grid grid-cols-3 gap-3">
          {/* Default Menu */}
          <button
            type="button"
            onClick={() => handleModeChange('default')}
            className={`p-4 rounded-xl text-left transition ${
              menuMode === 'default' 
                ? 'bg-white text-blue-600 shadow-lg' 
                : 'bg-blue-600/30 text-white hover:bg-blue-600/50'
            }`}
          >
            <div className="font-bold mb-1">📋 Default Menu</div>
            <div className={`text-sm ${menuMode === 'default' ? 'text-gray-600' : 'text-blue-100'}`}>
              Standard menu based on form sections
            </div>
          </button>

          {/* Auto from TOC */}
          <button
            type="button"
            onClick={() => handleModeChange('auto_toc')}
            className={`p-4 rounded-xl text-left transition ${
              menuMode === 'auto_toc' 
                ? 'bg-white text-blue-600 shadow-lg' 
                : 'bg-blue-600/30 text-white hover:bg-blue-600/50'
            }`}
          >
            <div className="font-bold mb-1">🔗 Auto from TOC</div>
            <div className={`text-sm ${menuMode === 'auto_toc' ? 'text-gray-600' : 'text-blue-100'}`}>
              Menu from your content sections
            </div>
            {tocItems.length > 0 && (
              <div className={`text-xs mt-1 ${menuMode === 'auto_toc' ? 'text-green-600' : 'text-green-300'}`}>
                ✓ {tocItems.length} sections available
              </div>
            )}
          </button>

          {/* Custom Menu */}
          <button
            type="button"
            onClick={() => handleModeChange('custom')}
            className={`p-4 rounded-xl text-left transition ${
              menuMode === 'custom' 
                ? 'bg-white text-blue-600 shadow-lg' 
                : 'bg-blue-600/30 text-white hover:bg-blue-600/50'
            }`}
          >
            <div className="font-bold mb-1">✏️ Custom Menu</div>
            <div className={`text-sm ${menuMode === 'custom' ? 'text-gray-600' : 'text-blue-100'}`}>
              Full control over menu items
            </div>
          </button>
        </div>
      </div>

      {/* Auto TOC Mode - Show TOC items */}
      {menuMode === 'auto_toc' && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <h4 className="font-semibold text-green-800 mb-3">Menu Items (from your content)</h4>
          {tocItems.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>No content sections found.</p>
              <p className="text-sm mt-1">Add Text Sections with headings in the Content Builder above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tocItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <span className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded-lg font-bold text-sm">
                    {idx + 1}
                  </span>
                  <span className="flex-1 font-medium text-gray-700">{item.title}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">#{item.anchor}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Default/Custom Mode - Menu Items */}
      {(menuMode === 'default' || menuMode === 'custom') && (
        <>
          {/* Current Menu Items */}
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800">Active Menu Items</h4>
              <p className="text-xs text-gray-500">Toggle visibility and reorder as needed</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              {menuItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-3 px-4 py-3 transition ${
                    item.enabled ? 'bg-white' : 'bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Order Number */}
                  <span className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-700 rounded-lg font-bold text-sm">
                    {index + 1}
                  </span>

                  {/* Icon */}
                  <span className={`p-2 rounded-lg ${item.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    {getIcon(item.id)}
                  </span>

                  {/* Label */}
                  <span className={`flex-1 font-medium ${item.enabled ? 'text-gray-700' : 'text-gray-400'}`}>
                    {item.label}
                  </span>

                  {/* Link to TOC (Custom mode only) */}
                  {menuMode === 'custom' && tocItems.length > 0 && (
                    <select
                      value={item.tocAnchor || ''}
                      onChange={(e) => linkToToc(item.id, e.target.value)}
                      className="text-sm border border-gray-200 rounded px-2 py-1"
                    >
                      <option value="">No link</option>
                      {tocItems.map((toc, i) => (
                        <option key={i} value={toc.anchor}>→ {toc.title}</option>
                      ))}
                    </select>
                  )}

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`p-2 rounded-lg transition ${
                      item.enabled 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={item.enabled ? 'Hide this menu item' : 'Show this menu item'}
                  >
                    {item.enabled ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </button>

                  {/* Reorder Buttons */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded transition ${
                        index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      title="Move up"
                    >
                      <FiChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === menuItems.length - 1}
                      className={`p-1 rounded transition ${
                        index === menuItems.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      title="Move down"
                    >
                      <FiChevronDown size={16} />
                    </button>
                  </div>

                  {/* Remove Button (Custom mode only) */}
                  {menuMode === 'custom' && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Remove from menu"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add More Items (Custom mode only) */}
          {menuMode === 'custom' && availablePresets.length > 0 && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-3">Add More Menu Items</h4>
              <div className="flex flex-wrap gap-2">
                {availablePresets.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => addMenuItem(preset)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-sm"
                  >
                    <preset.icon size={16} className="text-gray-500" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Preview */}
      <div className="bg-gray-100 rounded-xl p-4">
        <h4 className="font-semibold text-gray-700 mb-3">Menu Preview</h4>
        <div className="bg-white rounded-lg p-3 flex flex-wrap gap-2">
          {menuMode === 'auto_toc' ? (
            tocItems.length > 0 ? (
              tocItems.map((item, idx) => (
                <span key={idx} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                  {item.title}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No menu items (add content sections)</span>
            )
          ) : (
            menuItems.filter(item => item.enabled).map((item, idx) => (
              <span key={idx} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2">
                {getIcon(item.id)}
                {item.label}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleMenuConfig;
