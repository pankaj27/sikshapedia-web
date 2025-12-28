import React, { useState } from 'react';
import { FiInfo, FiBook, FiFileText, FiBarChart2, FiBriefcase, FiAward, FiDollarSign, FiMessageSquare, FiImage, FiChevronDown, FiChevronUp, FiZap, FiSettings, FiHelpCircle, FiHome, FiLock } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineCurrencyRupee, HiOutlineOfficeBuilding } from 'react-icons/hi';

// Course-specific menu items configuration
const COURSE_MENU_ITEMS = [
  // 4 Mandatory Menus (cannot be turned off)
  { id: 'overview', label: 'Overview', icon: FiInfo, description: 'General course information', mandatory: true },
  { id: 'syllabus', label: 'Syllabus', icon: FiBook, description: 'Course curriculum and subjects', mandatory: true },
  { id: 'career', label: 'Career Options', icon: FiBriefcase, description: 'Career scope and job opportunities', mandatory: true },
  { id: 'fees', label: 'Fee Structure', icon: HiOutlineCurrencyRupee, description: 'Course fee details', mandatory: true },
  
  // Optional Menus (can be toggled on/off)
  { id: 'eligibility', label: 'Eligibility', icon: FiFileText, description: 'Eligibility criteria', mandatory: false },
  { id: 'admission', label: 'Admission Process', icon: HiOutlineAcademicCap, description: 'How to apply for this course', mandatory: false },
  { id: 'colleges', label: 'Top Colleges', icon: HiOutlineOfficeBuilding, description: 'Best colleges offering this course', mandatory: false },
  { id: 'salary', label: 'Salary & Scope', icon: FiDollarSign, description: 'Expected salary packages', mandatory: false },
  { id: 'faqs', label: 'FAQs', icon: FiHelpCircle, description: 'Frequently asked questions', mandatory: false },
  { id: 'gallery', label: 'Gallery', icon: FiImage, description: 'Course related images/videos', mandatory: false },
];

// Auto-generate SEO content based on course name and menu type
const generateCourseSEO = (courseName, menuItem) => {
  const name = courseName || 'Course';
  const menuLabel = menuItem.label;
  
  const templates = {
    overview: {
      title: `${name} - Course Details, Eligibility, Fees, Colleges 2025 | AdmissionBuddy`,
      description: `Get complete information about ${name}. Explore eligibility, fee structure, top colleges, career options, and admission process.`,
      keywords: `${name}, ${name} course, ${name} eligibility, ${name} fees, ${name} colleges`
    },
    syllabus: {
      title: `${name} Syllabus 2025 - Subjects, Curriculum, Semester Wise | AdmissionBuddy`,
      description: `Check ${name} syllabus and curriculum. Get semester wise subjects, practical components, and course structure.`,
      keywords: `${name} syllabus, ${name} subjects, ${name} curriculum, ${name} course structure`
    },
    career: {
      title: `${name} Career Options 2025 - Jobs, Scope, Opportunities | AdmissionBuddy`,
      description: `Explore career options after ${name}. Know about job roles, industries, government jobs, and future scope.`,
      keywords: `${name} career, ${name} jobs, ${name} scope, ${name} opportunities, after ${name}`
    },
    fees: {
      title: `${name} Fee Structure 2025 - College Wise Fees | AdmissionBuddy`,
      description: `Check ${name} fee structure in top colleges. Get details on tuition fees, hostel charges, and other expenses.`,
      keywords: `${name} fees, ${name} fee structure, ${name} college fees, ${name} cost`
    },
    eligibility: {
      title: `${name} Eligibility Criteria 2025 - Qualification, Age Limit | AdmissionBuddy`,
      description: `Know ${name} eligibility criteria. Check educational qualification, age limit, and entrance exam requirements.`,
      keywords: `${name} eligibility, ${name} qualification, ${name} requirements, ${name} criteria`
    },
    admission: {
      title: `${name} Admission Process 2025 - How to Apply, Dates | AdmissionBuddy`,
      description: `Complete guide to ${name} admission. Know application process, important dates, documents required, and how to apply.`,
      keywords: `${name} admission, ${name} apply, ${name} application, ${name} how to apply`
    },
    colleges: {
      title: `Top ${name} Colleges in India 2025 - Best Institutes | AdmissionBuddy`,
      description: `Find top colleges for ${name} in India. Compare fees, placements, rankings, and admission process of best institutes.`,
      keywords: `${name} colleges, best ${name} colleges, top ${name} institutes, ${name} college list`
    },
    salary: {
      title: `${name} Salary 2025 - Average Package, Highest Salary | AdmissionBuddy`,
      description: `Know ${name} salary in India. Get details on average package, highest salary, starting salary, and salary growth.`,
      keywords: `${name} salary, ${name} package, ${name} income, ${name} earnings`
    },
    faqs: {
      title: `${name} FAQs - Frequently Asked Questions | AdmissionBuddy`,
      description: `Get answers to frequently asked questions about ${name}. Know about eligibility, fees, duration, scope, and more.`,
      keywords: `${name} FAQs, ${name} questions, ${name} doubts, about ${name}`
    },
    gallery: {
      title: `${name} Gallery - Images & Videos | AdmissionBuddy`,
      description: `View ${name} related images and videos. Explore classrooms, labs, campus life, and student activities.`,
      keywords: `${name} gallery, ${name} images, ${name} photos, ${name} videos`
    }
  };
  
  return templates[menuItem.id] || {
    title: `${name} - ${menuLabel} | AdmissionBuddy`,
    description: `Get ${menuLabel.toLowerCase()} details of ${name}. Complete information and updates.`,
    keywords: `${name}, ${name} ${menuLabel.toLowerCase()}`
  };
};

const CourseMenuConfigSection = ({ formData, setFormData }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize menu config if not present
  React.useEffect(() => {
    if (initialized) return;
    
    if (!formData.menu_config?.items || formData.menu_config.items.length === 0) {
      const defaultItems = COURSE_MENU_ITEMS.map((item, index) => ({
        id: item.id,
        label: item.label,
        icon: item.id,
        enabled: item.mandatory ? true : false, // Mandatory are ON by default, optional are OFF
        mandatory: item.mandatory,
        order: index,
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
    setInitialized(true);
  }, [formData.menu_config?.items, setFormData, initialized]);
  
  // Get menu items (with fallback)
  const menuItems = formData.menu_config?.items || COURSE_MENU_ITEMS.map((item, index) => ({
    id: item.id,
    label: item.label,
    icon: item.id,
    enabled: item.mandatory,
    mandatory: item.mandatory,
    order: index,
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
  
  // Toggle menu enabled/disabled (only for non-mandatory)
  const toggleMenu = (menuId) => {
    const menuDef = COURSE_MENU_ITEMS.find(m => m.id === menuId);
    if (menuDef?.mandatory) return; // Cannot toggle mandatory menus
    
    const item = menuItems.find(i => i.id === menuId);
    updateMenuItem(menuId, { enabled: !item?.enabled });
  };
  
  // Auto-generate SEO for a menu item
  const autoGenerateSEO = (menuId) => {
    const menuDef = COURSE_MENU_ITEMS.find(m => m.id === menuId);
    if (!menuDef) return;
    
    const seo = generateCourseSEO(formData.name, menuDef);
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
      const menuDef = COURSE_MENU_ITEMS.find(m => m.id === item.id);
      if (!menuDef) return item;
      const seo = generateCourseSEO(formData.name, menuDef);
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
  
  // Count enabled menus
  const enabledCount = menuItems.filter(i => i.enabled).length;
  const mandatoryCount = COURSE_MENU_ITEMS.filter(m => m.mandatory).length;
  
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-indigo-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <FiSettings className="text-indigo-600 text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Course Page Menu Configuration</h3>
            <p className="text-sm text-gray-500">
              {enabledCount} menus enabled ({mandatoryCount} mandatory)
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={autoGenerateAllSEO}
          disabled={!formData.name}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-md ${
            formData.name 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FiZap size={16} />
          Auto-Generate All SEO
        </button>
      </div>
      
      {/* Info Banner */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 How it works:</strong> Each enabled menu creates a separate page for this course 
          (e.g., <code className="bg-blue-100 px-1 rounded">/courses/your-course/syllabus</code>). 
          <span className="text-orange-600 font-medium"> 4 menus are mandatory and cannot be turned off.</span>
        </p>
      </div>
      
      {/* Mandatory Menus Section */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <FiLock className="text-orange-500" />
          Mandatory Menus (Always ON)
        </h4>
        <div className="space-y-3">
          {COURSE_MENU_ITEMS.filter(m => m.mandatory).map((menuDef) => {
            const item = getMenuItem(menuDef.id);
            const isExpanded = expandedMenu === menuDef.id;
            const Icon = menuDef.icon;
            
            return (
              <div 
                key={menuDef.id}
                className="border-2 rounded-xl border-orange-200 bg-orange-50/50"
              >
                {/* Menu Item Header */}
                <div className="flex items-center gap-4 p-4">
                  {/* Locked Toggle */}
                  <div className="relative inline-flex items-center" title="This menu is mandatory">
                    <div className="w-11 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                      <FiLock className="text-white" size={12} />
                    </div>
                  </div>
                  
                  {/* Icon & Label */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-100 text-orange-600">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {menuDef.label}
                      <span className="ml-2 text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded">MANDATORY</span>
                    </h4>
                    <p className="text-xs text-gray-500">{menuDef.description}</p>
                  </div>
                  
                  {/* Expand/Collapse Button */}
                  <button
                    type="button"
                    onClick={() => setExpandedMenu(isExpanded ? null : menuDef.id)}
                    className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </button>
                </div>
                
                {/* Expanded SEO Settings */}
                {isExpanded && (
                  <div className="border-t border-orange-200 p-4 bg-white rounded-b-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-gray-700 flex items-center gap-2">
                        🔍 SEO Settings for {menuDef.label} Page
                      </h5>
                      <button
                        type="button"
                        onClick={() => autoGenerateSEO(menuDef.id)}
                        disabled={!formData.name}
                        className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                          formData.name 
                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FiZap size={12} />
                        Auto-Generate
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Page Heading</label>
                        <input
                          type="text"
                          value={item.page_heading || ''}
                          onChange={(e) => updateMenuItem(menuDef.id, { page_heading: e.target.value })}
                          placeholder={`${formData.name || 'Course'} - ${menuDef.label}`}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                        <input
                          type="text"
                          value={item.meta_title || ''}
                          onChange={(e) => updateMenuItem(menuDef.id, { meta_title: e.target.value })}
                          placeholder="SEO title for this page"
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                        <textarea
                          value={item.meta_description || ''}
                          onChange={(e) => updateMenuItem(menuDef.id, { meta_description: e.target.value })}
                          placeholder="SEO description for this page"
                          rows={2}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Meta Keywords</label>
                        <input
                          type="text"
                          value={item.meta_keywords || ''}
                          onChange={(e) => updateMenuItem(menuDef.id, { meta_keywords: e.target.value })}
                          placeholder="keyword1, keyword2, keyword3"
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Optional Menus Section */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <FiSettings className="text-green-500" />
          Optional Menus (Toggle ON/OFF)
        </h4>
        <div className="space-y-3">
          {COURSE_MENU_ITEMS.filter(m => !m.mandatory).map((menuDef) => {
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
                        disabled={!formData.name}
                        className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                          formData.name 
                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FiZap size={12} />
                        Auto-Generate
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Page Heading</label>
                        <input
                          type="text"
                          value={item.page_heading || ''}
                          onChange={(e) => updateMenuItem(menuDef.id, { page_heading: e.target.value })}
                          placeholder={`${formData.name || 'Course'} - ${menuDef.label}`}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                        <input
                          type="text"
                          value={item.meta_title || ''}
                          onChange={(e) => updateMenuItem(menuDef.id, { meta_title: e.target.value })}
                          placeholder="SEO title for this page"
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                        <textarea
                          value={item.meta_description || ''}
                          onChange={(e) => updateMenuItem(menuDef.id, { meta_description: e.target.value })}
                          placeholder="SEO description for this page"
                          rows={2}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Meta Keywords</label>
                        <input
                          type="text"
                          value={item.meta_keywords || ''}
                          onChange={(e) => updateMenuItem(menuDef.id, { meta_keywords: e.target.value })}
                          placeholder="keyword1, keyword2, keyword3"
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseMenuConfigSection;
