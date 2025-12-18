import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiCheckCircle, FiCalendar, FiTrash2, FiPlus, FiSave, FiSearch, FiX, FiHome, FiBook, FiFileText, FiDollarSign, FiAward, FiBookOpen, FiImage, FiLink, FiEdit2 } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';

// Define all ad placements/pages
const AD_PLACEMENTS = [
  { 
    id: 'home_banner', 
    name: 'Home Page Banner', 
    icon: FiImage, 
    color: 'from-purple-500 to-indigo-500',
    description: 'Main banner ads on homepage',
    contentType: 'banner'
  },
  { 
    id: 'home_featured', 
    name: 'Home Page Featured', 
    icon: FiHome, 
    color: 'from-blue-500 to-cyan-500',
    description: 'Featured colleges section on homepage',
    contentType: 'college'
  },
  { 
    id: 'college_listing_featured', 
    name: 'College Listing - Featured', 
    icon: FiStar, 
    color: 'from-orange-500 to-amber-500',
    description: 'Featured colleges in college listing page',
    contentType: 'college'
  },
  { 
    id: 'college_listing_admission', 
    name: 'College Listing - Admissions Open', 
    icon: FiCheckCircle, 
    color: 'from-green-500 to-emerald-500',
    description: 'Admissions open section in college listing',
    contentType: 'college'
  },
  { 
    id: 'college_detail_sidebar', 
    name: 'College Detail - Sidebar', 
    icon: FiHome, 
    color: 'from-blue-600 to-blue-700',
    description: 'Sidebar ads on college detail pages',
    contentType: 'college'
  },
  { 
    id: 'school_listing_featured', 
    name: 'School Listing - Featured', 
    icon: FiBookOpen, 
    color: 'from-green-600 to-teal-600',
    description: 'Featured schools in school listing page',
    contentType: 'school'
  },
  { 
    id: 'school_listing_admission', 
    name: 'School Listing - Admissions Open', 
    icon: FiCheckCircle, 
    color: 'from-teal-500 to-cyan-500',
    description: 'Admissions open section in school listing',
    contentType: 'school'
  },
  { 
    id: 'school_detail_sidebar', 
    name: 'School Detail - Sidebar', 
    icon: FiBookOpen, 
    color: 'from-green-700 to-green-800',
    description: 'Sidebar ads on school detail pages',
    contentType: 'school'
  },
  { 
    id: 'university_listing_featured', 
    name: 'University Listing - Featured', 
    icon: FiAward, 
    color: 'from-purple-600 to-violet-600',
    description: 'Featured universities in listing page',
    contentType: 'university'
  },
  { 
    id: 'university_detail_sidebar', 
    name: 'University Detail - Sidebar', 
    icon: FiAward, 
    color: 'from-violet-600 to-purple-700',
    description: 'Sidebar ads on university detail pages',
    contentType: 'university'
  },
  { 
    id: 'course_listing_featured', 
    name: 'Course Listing - Featured', 
    icon: FiBook, 
    color: 'from-indigo-500 to-blue-500',
    description: 'Featured courses in course listing page',
    contentType: 'course'
  },
  { 
    id: 'course_detail_sidebar', 
    name: 'Course Detail - Sidebar', 
    icon: FiBook, 
    color: 'from-indigo-600 to-indigo-700',
    description: 'Sidebar ads on course detail pages',
    contentType: 'college'
  },
  { 
    id: 'exam_listing_featured', 
    name: 'Exam Listing - Featured', 
    icon: FiFileText, 
    color: 'from-red-500 to-rose-500',
    description: 'Featured exams in exam listing page',
    contentType: 'exam'
  },
  { 
    id: 'exam_detail_sidebar', 
    name: 'Exam Detail - Sidebar', 
    icon: FiFileText, 
    color: 'from-red-600 to-red-700',
    description: 'Sidebar ads on exam detail pages',
    contentType: 'college'
  },
  { 
    id: 'scholarship_featured', 
    name: 'Scholarship Page - Featured', 
    icon: FiDollarSign, 
    color: 'from-yellow-500 to-amber-500',
    description: 'Featured scholarships/colleges on scholarship page',
    contentType: 'college'
  },
  { 
    id: 'loan_featured', 
    name: 'Loan Page - Featured', 
    icon: FiDollarSign, 
    color: 'from-emerald-500 to-green-500',
    description: 'Featured loans/colleges on loan page',
    contentType: 'college'
  },
  { 
    id: 'study_materials_featured', 
    name: 'Study Materials - Featured', 
    icon: FiBook, 
    color: 'from-cyan-500 to-blue-500',
    description: 'Featured content on study materials page',
    contentType: 'college'
  },
];

// Section types for custom URL placements
const SECTION_TYPES = [
  { id: 'featured', name: 'Featured', icon: FiStar, color: 'from-orange-500 to-amber-500' },
  { id: 'admission', name: 'Admissions Open', icon: FiCheckCircle, color: 'from-green-500 to-emerald-500' },
  { id: 'sponsored', name: 'Sponsored', icon: FiDollarSign, color: 'from-blue-500 to-indigo-500' },
];

const SponsoredAdsManagement = () => {
  const [adsConfig, setAdsConfig] = useState({});
  const [customPlacements, setCustomPlacements] = useState([]);
  const [allColleges, setAllColleges] = useState([]);
  const [allSchools, setAllSchools] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('college_listing_featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showCustomPlacementModal, setShowCustomPlacementModal] = useState(false);
  const [newCustomPlacement, setNewCustomPlacement] = useState({ url: '', sectionType: 'featured', name: '' });
  const [editingPlacement, setEditingPlacement] = useState(null); // For editing existing custom placements
  const [selectedSectionTypes, setSelectedSectionTypes] = useState(['featured']); // For multi-select section types

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch sponsored ads config
      const configRes = await api.get('/sponsored-ads-multi');
      if (configRes.data && configRes.data.placements) {
        setAdsConfig(configRes.data.placements);
      }
      if (configRes.data && configRes.data.custom_placements) {
        setCustomPlacements(configRes.data.custom_placements);
      }
      
      // Fetch all content for selection
      const [collegesRes, schoolsRes, coursesRes, examsRes] = await Promise.all([
        api.get('/colleges?limit=500').catch(() => ({ data: [] })),
        api.get('/schools?limit=500').catch(() => ({ data: [] })),
        api.get('/courses-detail?limit=500').catch(() => ({ data: [] })),
        api.get('/exams-detail?limit=500').catch(() => ({ data: [] })),
      ]);
      
      setAllColleges(collegesRes.data || []);
      setAllSchools(schoolsRes.data || []);
      setAllCourses(coursesRes.data || []);
      setAllExams(examsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentList = (contentType) => {
    switch (contentType) {
      case 'school': return allSchools;
      case 'university': return allColleges.filter(c => c.institution_type === 'University');
      case 'course': return allCourses;
      case 'exam': return allExams;
      default: return allColleges;
    }
  };

  const getCurrentPlacement = () => {
    // Check if it's a custom placement first
    const customPlacement = customPlacements.find(p => p.id === activeTab);
    if (customPlacement) {
      const sectionType = SECTION_TYPES.find(s => s.id === customPlacement.sectionType);
      return {
        ...customPlacement,
        icon: sectionType?.icon || FiLink,
        color: sectionType?.color || 'from-gray-500 to-gray-600',
        description: `Custom ads for ${customPlacement.url}`
      };
    }
    return AD_PLACEMENTS.find(p => p.id === activeTab);
  };
  
  const getCurrentAds = () => adsConfig[activeTab] || [];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const placement = getCurrentPlacement();
    const contentList = getContentList(placement?.contentType);
    
    const results = contentList.filter(item => 
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.location?.city?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
    setSearchResults(results);
  };

  const addItem = (item) => {
    const placement = getCurrentPlacement();
    const currentAds = getCurrentAds();
    
    // Check if already exists
    if (currentAds.some(a => a.item_id === item.id)) {
      alert('This item is already in the list');
      return;
    }
    
    const newEntry = {
      item_id: item.id,
      item_name: item.name || item.title,
      item_image: item.logo_url || item.banner_url || item.image_url,
      item_location: item.location ? `${item.location.city || ''}, ${item.location.state || ''}` : '',
      item_type: item.type || item.institution_type,
      item_rating: item.rating,
      item_fees: item.average_fees,
      content_type: placement.contentType,
      serial_order: currentAds.length + 1,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: true
    };

    setAdsConfig(prev => ({
      ...prev,
      [activeTab]: [...currentAds, newEntry]
    }));
    
    setShowAddModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeItem = (index) => {
    const currentAds = getCurrentAds();
    const updated = currentAds.filter((_, i) => i !== index);
    updated.forEach((item, i) => item.serial_order = i + 1);
    
    setAdsConfig(prev => ({
      ...prev,
      [activeTab]: updated
    }));
  };

  const updateItem = (index, field, value) => {
    const currentAds = [...getCurrentAds()];
    currentAds[index][field] = value;
    
    setAdsConfig(prev => ({
      ...prev,
      [activeTab]: currentAds
    }));
  };

  const moveItem = (index, direction) => {
    const currentAds = [...getCurrentAds()];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= currentAds.length) return;
    
    [currentAds[index], currentAds[newIndex]] = [currentAds[newIndex], currentAds[index]];
    currentAds.forEach((item, i) => item.serial_order = i + 1);
    
    setAdsConfig(prev => ({
      ...prev,
      [activeTab]: currentAds
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/sponsored-ads-multi', { placements: adsConfig, custom_placements: customPlacements });
      alert('Sponsored ads saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving sponsored ads');
    } finally {
      setSaving(false);
    }
  };

  // Custom URL Placement functions
  const addCustomPlacement = () => {
    if (!newCustomPlacement.url) {
      alert('Please enter URL path');
      return;
    }
    
    if (editingPlacement) {
      // Editing existing placement - single section type
      const placementId = `custom_${newCustomPlacement.url.replace(/\//g, '_')}_${newCustomPlacement.sectionType}`;
      const placementName = newCustomPlacement.name || `${newCustomPlacement.url} - ${SECTION_TYPES.find(s => s.id === newCustomPlacement.sectionType)?.name}`;
      
      const updatedPlacement = {
        id: placementId,
        url: newCustomPlacement.url,
        sectionType: newCustomPlacement.sectionType,
        name: placementName,
        contentType: 'college'
      };
      
      const oldId = editingPlacement.id;
      const existingAds = adsConfig[oldId] || [];
      
      setCustomPlacements(customPlacements.map(p => p.id === oldId ? updatedPlacement : p));
      
      const newConfig = { ...adsConfig };
      if (oldId !== placementId) {
        delete newConfig[oldId];
        newConfig[placementId] = existingAds;
      } else {
        newConfig[placementId] = existingAds;
      }
      setAdsConfig(newConfig);
      setActiveTab(placementId);
    } else {
      // Adding new placement(s) - can be multiple section types
      if (selectedSectionTypes.length === 0) {
        alert('Please select at least one section type');
        return;
      }
      
      const newPlacements = [];
      const newAdsConfig = { ...adsConfig };
      let firstNewId = null;
      
      for (const sectionType of selectedSectionTypes) {
        const placementId = `custom_${newCustomPlacement.url.replace(/\//g, '_')}_${sectionType}`;
        
        // Skip if already exists
        if (customPlacements.find(p => p.id === placementId)) {
          continue;
        }
        
        const sectionName = SECTION_TYPES.find(s => s.id === sectionType)?.name;
        const placementName = newCustomPlacement.name 
          ? `${newCustomPlacement.name} - ${sectionName}`
          : `${newCustomPlacement.url} - ${sectionName}`;
        
        newPlacements.push({
          id: placementId,
          url: newCustomPlacement.url,
          sectionType: sectionType,
          name: placementName,
          contentType: 'college'
        });
        
        newAdsConfig[placementId] = [];
        if (!firstNewId) firstNewId = placementId;
      }
      
      if (newPlacements.length === 0) {
        alert('All selected section types already exist for this URL!');
        return;
      }
      
      setCustomPlacements([...customPlacements, ...newPlacements]);
      setAdsConfig(newAdsConfig);
      if (firstNewId) setActiveTab(firstNewId);
    }
    
    setShowCustomPlacementModal(false);
    setNewCustomPlacement({ url: '', sectionType: 'featured', name: '' });
    setSelectedSectionTypes(['featured']);
    setEditingPlacement(null);
  };

  const editCustomPlacement = (placement) => {
    setEditingPlacement(placement);
    setNewCustomPlacement({
      url: placement.url,
      sectionType: placement.sectionType,
      name: placement.name
    });
    setShowCustomPlacementModal(true);
  };

  const deleteCustomPlacement = (placementId) => {
    if (!window.confirm('Are you sure you want to delete this custom placement and all its ads?')) return;
    setCustomPlacements(customPlacements.filter(p => p.id !== placementId));
    const newConfig = { ...adsConfig };
    delete newConfig[placementId];
    setAdsConfig(newConfig);
    setActiveTab('college_listing_featured');
  };

  const isCustomPlacement = (tabId) => tabId.startsWith('custom_');

  const getCustomPlacementInfo = (tabId) => customPlacements.find(p => p.id === tabId);

  const isExpired = (endDate) => new Date(endDate) < new Date();
  
  const isActive = (entry) => {
    const now = new Date();
    const start = new Date(entry.start_date);
    const end = new Date(entry.end_date);
    return entry.is_active && now >= start && now <= end;
  };

  const currentPlacement = getCurrentPlacement();
  const currentAds = getCurrentAds();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2 hover:bg-gray-200 rounded-lg">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sponsored Ads Management</h1>
            <p className="text-sm text-gray-500">Manage ads across all pages - {AD_PLACEMENTS.length} placements available</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
          <FiSave className="mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Placement List */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-900">Ad Placements</h3>
              <p className="text-xs text-gray-500">Select a page to manage</p>
            </div>
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
              {AD_PLACEMENTS.map(placement => {
                const Icon = placement.icon;
                const count = (adsConfig[placement.id] || []).length;
                const activeCount = (adsConfig[placement.id] || []).filter(a => isActive(a)).length;
                
                return (
                  <button
                    key={placement.id}
                    onClick={() => setActiveTab(placement.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                      activeTab === placement.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${placement.color} flex items-center justify-center`}>
                      <Icon className="text-white" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">{placement.name}</h4>
                      <p className="text-xs text-gray-500">
                        {count} items {activeCount > 0 && <span className="text-green-600">({activeCount} live)</span>}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom URL Placements Section */}
            <div className="border-t border-gray-200">
              <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">🔗 Custom URL Placements</h3>
                  <p className="text-xs text-gray-500">Link-specific ads</p>
                </div>
                <button 
                  onClick={() => setShowCustomPlacementModal(true)}
                  className="text-purple-600 hover:text-purple-800 p-1"
                  title="Add custom placement"
                >
                  <FiPlus size={18} />
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto overflow-x-visible">
                {customPlacements.length === 0 ? (
                  <div className="px-4 py-3 text-center text-gray-400 text-xs">
                    No custom placements yet.<br/>Click + to add one.
                  </div>
                ) : (
                  customPlacements.map(placement => {
                    const sectionType = SECTION_TYPES.find(s => s.id === placement.sectionType);
                    const Icon = sectionType?.icon || FiLink;
                    const count = (adsConfig[placement.id] || []).length;
                    const activeCount = (adsConfig[placement.id] || []).filter(a => isActive(a)).length;
                    
                    return (
                      <div
                        key={placement.id}
                        className={`w-full px-4 py-3 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          activeTab === placement.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                        }`}
                      >
                        <button
                          onClick={() => setActiveTab(placement.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${sectionType?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                            <Icon className="text-white" size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{placement.name}</h4>
                            <p className="text-xs text-purple-600 truncate">/{placement.url}</p>
                            <p className="text-xs text-gray-500">
                              {count} items {activeCount > 0 && <span className="text-green-600">({activeCount} live)</span>}
                            </p>
                          </div>
                        </button>
                        <div className="flex flex-col gap-0.5 flex-shrink-0 ml-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); editCustomPlacement(placement); }}
                            className="text-blue-400 hover:text-blue-600 p-0.5 rounded hover:bg-blue-50"
                            title="Edit placement"
                          >
                            <FiEdit2 size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteCustomPlacement(placement.id); }}
                            className="text-red-400 hover:text-red-600 p-0.5 rounded hover:bg-red-50"
                            title="Delete placement"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Ad List */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Placement Header */}
            <div className={`bg-gradient-to-r ${currentPlacement?.color} px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-3 text-white">
                {currentPlacement && <currentPlacement.icon size={20} />}
                <div>
                  <h3 className="font-bold">{currentPlacement?.name}</h3>
                  <p className="text-xs text-white/80">{currentPlacement?.description}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => setShowAddModal(true)}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <FiPlus className="mr-1" /> Add {currentPlacement?.contentType}
              </Button>
            </div>

            {/* Ad List */}
            <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {currentAds.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FiStar size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No ads configured for this placement</p>
                  <p className="text-sm">Click "Add" to add sponsored content</p>
                </div>
              ) : (
                currentAds.map((item, idx) => (
                  <div 
                    key={item.item_id + idx} 
                    className={`border rounded-lg p-3 ${
                      isActive(item) ? 'border-green-300 bg-green-50' : 
                      isExpired(item.end_date) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Serial & Move */}
                      <div className="flex flex-col items-center gap-1">
                        <span className={`w-8 h-8 bg-gradient-to-br ${currentPlacement?.color} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
                          {item.serial_order}
                        </span>
                        <button 
                          onClick={() => moveItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 text-xs"
                        >▲</button>
                        <button 
                          onClick={() => moveItem(idx, 'down')}
                          disabled={idx === currentAds.length - 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 text-xs"
                        >▼</button>
                      </div>
                      
                      {/* Image */}
                      <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.item_image ? (
                          <img src={item.item_image} alt={item.item_name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xl font-bold text-gray-400">{item.item_name?.charAt(0)}</span>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.item_name}</h4>
                        {item.item_location && <p className="text-xs text-gray-500">{item.item_location}</p>}
                        
                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <label className="text-xs text-gray-500">Start</label>
                            <input
                              type="date"
                              value={item.start_date}
                              onChange={(e) => updateItem(idx, 'start_date', e.target.value)}
                              className="w-full text-xs border rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">End</label>
                            <input
                              type="date"
                              value={item.end_date}
                              onChange={(e) => updateItem(idx, 'end_date', e.target.value)}
                              className="w-full text-xs border rounded px-2 py-1"
                            />
                          </div>
                        </div>
                        
                        {/* Status */}
                        <div className="flex items-center gap-2 mt-2">
                          <label className="flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.is_active}
                              onChange={(e) => updateItem(idx, 'is_active', e.target.checked)}
                              className="rounded"
                            />
                            Active
                          </label>
                          {isActive(item) && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Live</span>}
                          {isExpired(item.end_date) && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Expired</span>}
                        </div>
                      </div>
                      
                      {/* Delete */}
                      <button 
                        onClick={() => removeItem(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className={`px-4 py-3 rounded-t-xl flex items-center justify-between bg-gradient-to-r ${currentPlacement?.color}`}>
              <h3 className="font-bold text-white">
                Add to {currentPlacement?.name}
              </h3>
              <button onClick={() => { setShowAddModal(false); setSearchQuery(''); setSearchResults([]); }} className="text-white/80 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={`Search ${currentPlacement?.contentType}s...`}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {searchQuery.length < 2 ? (
                  <p className="text-center text-gray-500 py-4">Type at least 2 characters</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No results found</p>
                ) : (
                  searchResults.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => addItem(item)}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {(item.logo_url || item.banner_url || item.image_url) ? (
                          <img src={item.logo_url || item.banner_url || item.image_url} alt={item.name || item.title} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-lg font-bold text-gray-400">{(item.name || item.title)?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.name || item.title}</h4>
                        <p className="text-xs text-gray-500">
                          {item.location?.city && `${item.location.city}, ${item.location.state}`}
                          {item.type && ` • ${item.type}`}
                        </p>
                      </div>
                      <FiPlus className="text-blue-600" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Placement Modal */}
      {showCustomPlacementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
              <h3 className="text-white font-bold">{editingPlacement ? 'Edit Custom URL Placement' : 'Create Custom URL Placement'}</h3>
              <button onClick={() => { setShowCustomPlacementModal(false); setEditingPlacement(null); setNewCustomPlacement({ url: '', sectionType: 'featured', name: '' }); }} className="text-white/80 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Path *</label>
                <div className="flex items-center">
                  <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">/</span>
                  <input
                    type="text"
                    placeholder="e.g., colleges/mumbai or india-colleges?city=kolkata"
                    value={newCustomPlacement.url}
                    onChange={(e) => setNewCustomPlacement({...newCustomPlacement, url: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter the URL path without leading slash</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {SECTION_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setNewCustomPlacement({...newCustomPlacement, sectionType: type.id})}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                        newCustomPlacement.sectionType === type.id 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon className={newCustomPlacement.sectionType === type.id ? 'text-purple-600' : 'text-gray-400'} size={20} />
                      <span className={`text-xs font-medium ${newCustomPlacement.sectionType === type.id ? 'text-purple-600' : 'text-gray-600'}`}>
                        {type.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai Colleges - Featured"
                  value={newCustomPlacement.name}
                  onChange={(e) => setNewCustomPlacement({...newCustomPlacement, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => { setShowCustomPlacementModal(false); setEditingPlacement(null); setNewCustomPlacement({ url: '', sectionType: 'featured', name: '' }); }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={addCustomPlacement}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {editingPlacement ? (
                    <><FiEdit2 className="mr-1" /> Update Placement</>
                  ) : (
                    <><FiPlus className="mr-1" /> Create Placement</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsoredAdsManagement;
