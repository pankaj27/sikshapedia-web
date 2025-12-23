import React, { useState } from 'react';
import { FiInfo, FiBook, FiFileText, FiBarChart2, FiBriefcase, FiAward, FiDollarSign, FiMessageSquare, FiImage, FiChevronDown, FiChevronUp, FiZap, FiSettings } from 'react-icons/fi';
import { HiOutlineOfficeBuilding, HiOutlineCurrencyRupee } from 'react-icons/hi';

// Menu items configuration with icons
const MENU_ITEMS = [
  { id: 'info', label: 'Info', icon: FiInfo, description: 'General information about the institution' },
  { id: 'courses', label: 'Courses & Fees', icon: FiBook, description: 'Course details and fee structure' },
  { id: 'gallery', label: 'Gallery', icon: FiImage, description: 'Photos and videos of the institution' },
  { id: 'reviews', label: 'Reviews', icon: FiMessageSquare, description: 'Student reviews and ratings' },
  { id: 'admission', label: 'Admissions', icon: FiFileText, description: 'Admission process and requirements' },
  { id: 'cutoff', label: 'Cutoff', icon: FiBarChart2, description: 'Cutoff ranks and scores' },
  { id: 'placement', label: 'Placement', icon: FiBriefcase, description: 'Placement statistics and recruiters' },
  { id: 'ranking', label: 'Ranking', icon: FiAward, description: 'Rankings and accreditations' },
  { id: 'scholarship', label: 'Scholarship', icon: HiOutlineCurrencyRupee, description: 'Available scholarships' },
  { id: 'facilities', label: 'Facilities', icon: HiOutlineOfficeBuilding, description: 'Campus facilities and amenities' },
];

// Auto-generate SEO content based on college name and menu type
const generateSEO = (collegeName, menuItem) => {
  const name = collegeName || 'Institution';
  const menuLabel = menuItem.label;
  
  const templates = {
    info: {
      title: `${name} - Overview, Courses, Fees, Admission 2025 | AdmissionBuddy`,
      description: `Get complete information about ${name}. Explore courses offered, fee structure, admission process, placements, rankings, and more.`,
      keywords: `${name}, ${name} admission, ${name} courses, ${name} fees, ${name} reviews`
    },
    courses: {
      title: `${name} Courses & Fees 2025 - Full List with Fee Structure | AdmissionBuddy`,
      description: `Explore all courses offered by ${name}. Get detailed fee structure, eligibility criteria, and duration for each program.`,
      keywords: `${name} courses, ${name} fees, ${name} programs, ${name} fee structure`
    },
    gallery: {
      title: `${name} Gallery - Campus Photos & Videos | AdmissionBuddy`,
      description: `View ${name} campus photos, infrastructure, classrooms, hostels, and facilities. Explore the campus through our gallery.`,
      keywords: `${name} photos, ${name} campus, ${name} gallery, ${name} images`
    },
    reviews: {
      title: `${name} Reviews - Student Reviews & Ratings | AdmissionBuddy`,
      description: `Read genuine student reviews of ${name}. Get insights about academics, placements, faculty, and campus life.`,
      keywords: `${name} reviews, ${name} ratings, ${name} student feedback, ${name} experience`
    },
    admission: {
      title: `${name} Admission 2025 - Process, Dates, Eligibility | AdmissionBuddy`,
      description: `Get complete ${name} admission details. Know about eligibility criteria, application process, important dates, and how to apply.`,
      keywords: `${name} admission, ${name} application, ${name} eligibility, ${name} apply`
    },
    cutoff: {
      title: `${name} Cutoff 2025 - Category Wise Cutoff Ranks | AdmissionBuddy`,
      description: `Check ${name} cutoff for all categories. Get previous year cutoffs, opening & closing ranks for different courses.`,
      keywords: `${name} cutoff, ${name} cutoff ranks, ${name} closing rank, ${name} opening rank`
    },
    placement: {
      title: `${name} Placements 2025 - Packages, Recruiters, Statistics | AdmissionBuddy`,
      description: `Know about ${name} placement record. Get details on highest package, average salary, top recruiters, and placement statistics.`,
      keywords: `${name} placements, ${name} salary, ${name} recruiters, ${name} package`
    },
    ranking: {
      title: `${name} Ranking 2025 - NIRF, NAAC, QS Rankings | AdmissionBuddy`,
      description: `Check ${name} rankings by NIRF, NAAC, and other bodies. Know about accreditations, grades, and national rankings.`,
      keywords: `${name} ranking, ${name} NIRF, ${name} NAAC, ${name} accreditation`
    },
    scholarship: {
      title: `${name} Scholarships 2025 - Available Scholarships & Eligibility | AdmissionBuddy`,
      description: `Explore scholarships available at ${name}. Get details on merit-based, need-based scholarships and how to apply.`,
      keywords: `${name} scholarship, ${name} financial aid, ${name} fee waiver, ${name} merit scholarship`
    },
    facilities: {
      title: `${name} Facilities - Campus, Hostel, Library, Sports | AdmissionBuddy`,
      description: `Explore ${name} campus facilities including hostels, library, sports complex, labs, and other amenities.`,
      keywords: `${name} facilities, ${name} hostel, ${name} campus, ${name} infrastructure`
    }
  };
  
  return templates[menuItem.id] || {
    title: `${name} - ${menuLabel} | AdmissionBuddy`,
    description: `Get ${menuLabel.toLowerCase()} details of ${name}. Complete information and updates.`,
    keywords: `${name}, ${name} ${menuLabel.toLowerCase()}`
  };
};

const MenuConfigSection = ({ formData, setFormData }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  
  // Initialize menu config if not present
  React.useEffect(() => {
    if (!formData.menu_config?.items || formData.menu_config.items.length === 0) {
      const defaultItems = MENU_ITEMS.map((item, index) => ({
        id: item.id,
        label: item.label,
        icon: item.id,
        enabled: true,
        order: index,
        content: '',
        page_heading: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_title: '',
        og_description: ''
      }));
      setFormData(prev => ({
        ...prev,
        menu_config: { ...prev.menu_config, items: defaultItems }
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Get menu items (with fallback)
  const menuItems = formData.menu_config?.items || MENU_ITEMS.map((item, index) => ({
    id: item.id,
    label: item.label,
    icon: item.id,
    enabled: true,
    order: index,
    content: '',
    page_heading: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: ''
  }));
  
  // Update a specific menu item
  const updateMenuItem = (menuId, updates) => {
    const newItems = menuItems.map(item => 
      item.id === menuId ? { ...item, ...updates } : item
    );
    setFormData({
      ...formData,
      menu_config: { ...formData.menu_config, items: newItems }
    });
  };
  
  // Toggle menu enabled/disabled
  const toggleMenu = (menuId) => {
    const item = menuItems.find(i => i.id === menuId);
    updateMenuItem(menuId, { enabled: !item?.enabled });
  };
  
  // Auto-generate SEO for a menu item
  const autoGenerateSEO = (menuId) => {
    const menuDef = MENU_ITEMS.find(m => m.id === menuId);
    if (!menuDef) return;
    
    const seo = generateSEO(formData.name, menuDef);
    updateMenuItem(menuId, {
      meta_title: seo.title,
      meta_description: seo.description,
      meta_keywords: seo.keywords,
      og_title: seo.title,
      og_description: seo.description
    });
  };
  
  // Auto-generate SEO for all enabled menus
  const autoGenerateAllSEO = () => {
    const newItems = menuItems.map(item => {
      if (!item.enabled) return item;
      const menuDef = MENU_ITEMS.find(m => m.id === item.id);
      if (!menuDef) return item;
      const seo = generateSEO(formData.name, menuDef);
      return {
        ...item,
        meta_title: seo.title,
        meta_description: seo.description,
        meta_keywords: seo.keywords,
        og_title: seo.title,
        og_description: seo.description
      };
    });
    setFormData({
      ...formData,
      menu_config: { ...formData.menu_config, items: newItems }
    });
  };
  
  // Get menu item data
  const getMenuItem = (menuId) => {
    return menuItems.find(i => i.id === menuId) || { enabled: false };
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-indigo-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <FiSettings className="text-indigo-600 text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Menu Configuration</h3>
            <p className="text-sm text-gray-500">Configure which pages to show and their SEO settings</p>
          </div>
        </div>
        <button
          type="button"
          onClick={autoGenerateAllSEO}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md"
        >
          <FiZap size={16} />
          Auto-Generate All SEO
        </button>
      </div>
      
      {/* Info Banner */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 How it works:</strong> Toggle menus ON/OFF. Each enabled menu will have its own page 
          (e.g., <code className="bg-blue-100 px-1 rounded">/colleges/your-college/courses</code>). 
          Content entered in the main page will be shown with the sidebar.
        </p>
      </div>
      
      {/* Menu Items List */}
      <div className="space-y-3">
        {MENU_ITEMS.map((menuDef) => {
          const item = getMenuItem(menuDef.id);
          const isExpanded = expandedMenu === menuDef.id;
          const Icon = menuDef.icon;
          
          return (
            <div 
              key={menuDef.id}
              className={`border-2 rounded-xl transition-all ${
                item.enabled 
                  ? 'border-green-200 bg-green-50/50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Menu Item Header */}
              <div className="flex items-center gap-4 p-4">
                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => toggleMenu(menuDef.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
                
                {/* Icon & Label */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${item.enabled ? 'text-gray-800' : 'text-gray-500'}`}>
                    {menuDef.label}
                  </h4>
                  <p className="text-xs text-gray-500">{menuDef.description}</p>
                </div>
                
                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.enabled 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {item.enabled ? 'ON' : 'OFF'}
                </span>
                
                {/* Expand/Collapse Button */}
                {item.enabled && (
                  <button
                    type="button"
                    onClick={() => setExpandedMenu(isExpanded ? null : menuDef.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </button>
                )}
              </div>
              
              {/* Expanded SEO Settings */}
              {item.enabled && isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-700 flex items-center gap-2">
                      🔍 SEO Settings for {menuDef.label} Page
                    </h5>
                    <button
                      type="button"
                      onClick={() => autoGenerateSEO(menuDef.id)}
                      className="text-xs flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <FiZap size={12} />
                      Auto-Generate
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Meta Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Meta Title
                        <span className="text-xs text-gray-400 ml-2">({(item.meta_title || '').length}/60 chars)</span>
                      </label>
                      <input
                        type="text"
                        value={item.meta_title || ''}
                        onChange={(e) => updateMenuItem(menuDef.id, { meta_title: e.target.value })}
                        placeholder={`${formData.name || 'College'} - ${menuDef.label} | AdmissionBuddy`}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                    
                    {/* Meta Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Meta Description
                        <span className="text-xs text-gray-400 ml-2">({(item.meta_description || '').length}/160 chars)</span>
                      </label>
                      <textarea
                        value={item.meta_description || ''}
                        onChange={(e) => updateMenuItem(menuDef.id, { meta_description: e.target.value })}
                        placeholder={`Explore ${menuDef.label.toLowerCase()} details of ${formData.name || 'this institution'}...`}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                    
                    {/* Meta Keywords */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Meta Keywords
                        <span className="text-xs text-gray-400 ml-2">(comma separated)</span>
                      </label>
                      <input
                        type="text"
                        value={item.meta_keywords || ''}
                        onChange={(e) => updateMenuItem(menuDef.id, { meta_keywords: e.target.value })}
                        placeholder={`${formData.name || 'college'}, ${menuDef.label.toLowerCase()}, admission`}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                    
                    {/* Page Heading (H1) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Page Heading (H1)
                        <span className="text-xs text-gray-400 ml-2">(Leave empty for auto)</span>
                      </label>
                      <input
                        type="text"
                        value={item.page_heading || ''}
                        onChange={(e) => updateMenuItem(menuDef.id, { page_heading: e.target.value })}
                        placeholder={`${formData.name || 'College'} ${menuDef.label}`}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                  </div>
                  
                  {/* Preview */}
                  {(item.meta_title || item.meta_description) && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Google Preview:</p>
                      <div className="font-medium text-blue-700 text-sm truncate">
                        {item.meta_title || `${formData.name} - ${menuDef.label} | AdmissionBuddy`}
                      </div>
                      <div className="text-green-700 text-xs truncate">
                        admissionbuddy.co/colleges/{formData.slug || 'college-name'}/{menuDef.id}
                      </div>
                      <div className="text-gray-600 text-xs line-clamp-2 mt-1">
                        {item.meta_description || `Explore ${menuDef.label.toLowerCase()} details...`}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {menuItems.filter(i => i.enabled).length} of {MENU_ITEMS.length} menus enabled
            </p>
            <p className="text-xs text-gray-500">
              Enabled menus: {menuItems.filter(i => i.enabled).map(i => MENU_ITEMS.find(m => m.id === i.id)?.label).join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuConfigSection;
