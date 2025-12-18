import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiLoader, FiPlus, FiTrash2, FiSettings, FiEdit3, FiSearch, FiBarChart2, FiFileText, FiHelpCircle, FiGrid, FiLayers, FiBookOpen } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const CourseListingSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [settings, setSettings] = useState({
    // Hero Section
    hero_title: 'Discover Your Perfect Course Journey',
    hero_subtitle: 'Explore 10,000+ courses across 50+ streams. Find the right path for your career.',
    hero_search_placeholder: 'Search for courses, streams, or colleges...',
    
    // Popular Tags
    popular_tags: [
      { name: 'B.Tech', link: '/courses/engineering', color: 'bg-blue-500' },
      { name: 'MBA', link: '/courses/management', color: 'bg-purple-500' },
      { name: 'MBBS', link: '/courses/medical', color: 'bg-red-500' },
      { name: 'B.Sc', link: '/courses/science', color: 'bg-green-500' },
      { name: 'B.Com', link: '/courses/commerce', color: 'bg-yellow-500' },
      { name: 'BA', link: '/courses/arts', color: 'bg-pink-500' },
      { name: 'BCA', link: '/courses/computer', color: 'bg-indigo-500' },
      { name: 'LLB', link: '/courses/law', color: 'bg-gray-600' }
    ],
    
    // Level Courses
    level_courses: [
      { title: 'After 10th', subtitle: 'Diploma & Vocational', icon: '🎓', gradient: 'from-emerald-400 to-cyan-500', link: '/courses/after-10th', stats: '200+ Courses', popular: ['ITI', 'Polytechnic', 'Vocational'] },
      { title: 'After 12th', subtitle: 'Undergraduate Programs', icon: '📚', gradient: 'from-blue-500 to-purple-600', link: '/courses/after-12th', stats: '500+ Courses', popular: ['B.Tech', 'MBBS', 'B.Com', 'BA'] },
      { title: 'Diploma', subtitle: 'Professional Certifications', icon: '📜', gradient: 'from-orange-400 to-pink-500', link: '/courses/diploma', stats: '150+ Courses', popular: ['Engineering', 'Pharmacy', 'Nursing'] },
      { title: 'Postgraduate', subtitle: 'Masters & PG Programs', icon: '🎯', gradient: 'from-purple-500 to-indigo-600', link: '/courses/pg', stats: '400+ Courses', popular: ['MBA', 'M.Tech', 'M.Sc', 'MA'] },
      { title: 'PhD & Research', subtitle: 'Doctoral Programs', icon: '🔬', gradient: 'from-rose-400 to-red-500', link: '/courses/phd', stats: '100+ Programs', popular: ['Science', 'Engineering', 'Arts'] },
      { title: 'Certificate', subtitle: 'Short-term Courses', icon: '✨', gradient: 'from-amber-400 to-orange-500', link: '/courses/certificate', stats: '300+ Courses', popular: ['IT', 'Management', 'Design'] }
    ],
    
    // Stream Categories
    stream_categories: [
      { name: 'Engineering', icon: 'HiOutlineDesktopComputer', link: '/courses/engineering', courses: ['B.Tech', 'B.E', 'M.Tech', 'Polytechnic'], count: '250+' },
      { name: 'Medical', icon: 'HiOutlineHeart', link: '/courses/medical', courses: ['MBBS', 'BDS', 'BAMS', 'Nursing'], count: '150+' },
      { name: 'Management', icon: 'HiOutlineOfficeBuilding', link: '/courses/management', courses: ['MBA', 'BBA', 'PGDM', 'BMS'], count: '200+' },
      { name: 'Science', icon: 'HiOutlineBeaker', link: '/courses/science', courses: ['B.Sc', 'M.Sc', 'BCA', 'MCA'], count: '180+' },
      { name: 'Commerce', icon: 'HiOutlineCurrencyRupee', link: '/courses/commerce', courses: ['B.Com', 'M.Com', 'CA', 'CS'], count: '120+' },
      { name: 'Arts', icon: 'HiOutlinePencilAlt', link: '/courses/arts', courses: ['BA', 'MA', 'BFA', 'Journalism'], count: '150+' },
      { name: 'Law', icon: 'HiOutlineScale', link: '/courses/law', courses: ['LLB', 'BA LLB', 'LLM'], count: '80+' },
      { name: 'Computer', icon: 'HiOutlineDesktopComputer', link: '/courses/computer', courses: ['BCA', 'MCA', 'B.Tech CSE'], count: '100+' },
      { name: 'Education', icon: 'HiOutlineAcademicCap', link: '/courses/education', courses: ['B.Ed', 'M.Ed', 'D.El.Ed', 'B.P.Ed'], count: '50+' }
    ],
    
    // Trending Section
    trending_badge: '🔥 TRENDING NOW',
    trending_title: 'High-Demand Courses',
    trending_subtitle: 'Courses with the highest career growth potential in 2025',
    trending_courses: [
      { name: 'Data Science', growth: '+45%', icon: '📊', link: '/courses/search?q=Data%20Science' },
      { name: 'Artificial Intelligence', growth: '+62%', icon: '🤖', link: '/courses/search?q=Artificial%20Intelligence' },
      { name: 'Digital Marketing', growth: '+38%', icon: '📱', link: '/courses/search?q=Digital%20Marketing' },
      { name: 'Cyber Security', growth: '+52%', icon: '🔒', link: '/courses/search?q=Cyber%20Security' },
      { name: 'Cloud Computing', growth: '+41%', icon: '☁️', link: '/courses/search?q=Cloud%20Computing' },
      { name: 'Machine Learning', growth: '+58%', icon: '🧠', link: '/courses/search?q=Machine%20Learning' }
    ],
    
    // Quick Stats
    stats_courses: '10,000+',
    stats_colleges: '5,000+',
    stats_streams: '50+',
    stats_students: '2M+',
    
    // SEO
    meta_title: 'Courses in India 2025 - UG, PG, Diploma, PhD Programs',
    meta_description: 'Explore 1000+ courses in India across Engineering, Medical, Management, Science, Commerce, Arts, Law and more.',
    meta_keywords: [],
    
    // Content
    intro_content: '',
    bottom_content: '',
    faqs: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/course-listing-settings');
      if (response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/course-listing-settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Popular Tags
  const addPopularTag = () => {
    setSettings(prev => ({
      ...prev,
      popular_tags: [...(prev.popular_tags || []), { name: '', link: '', color: 'bg-blue-500' }]
    }));
  };

  const updatePopularTag = (index, field, value) => {
    const newTags = [...(settings.popular_tags || [])];
    newTags[index] = { ...newTags[index], [field]: value };
    setSettings(prev => ({ ...prev, popular_tags: newTags }));
  };

  const removePopularTag = (index) => {
    setSettings(prev => ({
      ...prev,
      popular_tags: (prev.popular_tags || []).filter((_, i) => i !== index)
    }));
  };

  // Level Courses
  const updateLevelCourse = (index, field, value) => {
    const newLevels = [...(settings.level_courses || [])];
    newLevels[index] = { ...newLevels[index], [field]: value };
    setSettings(prev => ({ ...prev, level_courses: newLevels }));
  };

  const updateLevelPopular = (index, value) => {
    const newLevels = [...(settings.level_courses || [])];
    newLevels[index] = { ...newLevels[index], popular: value.split(',').map(s => s.trim()) };
    setSettings(prev => ({ ...prev, level_courses: newLevels }));
  };

  // Stream Categories
  const addStreamCategory = () => {
    setSettings(prev => ({
      ...prev,
      stream_categories: [...(prev.stream_categories || []), { name: '', icon: 'HiOutlineDesktopComputer', link: '', courses: [], count: '0+' }]
    }));
  };

  const updateStreamCategory = (index, field, value) => {
    const newStreams = [...(settings.stream_categories || [])];
    newStreams[index] = { ...newStreams[index], [field]: value };
    setSettings(prev => ({ ...prev, stream_categories: newStreams }));
  };

  const updateStreamCourses = (index, value) => {
    const newStreams = [...(settings.stream_categories || [])];
    newStreams[index] = { ...newStreams[index], courses: value.split(',').map(s => s.trim()) };
    setSettings(prev => ({ ...prev, stream_categories: newStreams }));
  };

  const removeStreamCategory = (index) => {
    setSettings(prev => ({
      ...prev,
      stream_categories: (prev.stream_categories || []).filter((_, i) => i !== index)
    }));
  };

  // FAQs
  const addFaq = () => {
    setSettings(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }]
    }));
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...(settings.faqs || [])];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setSettings(prev => ({ ...prev, faqs: newFaqs }));
  };

  const removeFaq = (index) => {
    setSettings(prev => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index)
    }));
  };

  // Trending Courses
  const addTrendingCourse = () => {
    setSettings(prev => ({
      ...prev,
      trending_courses: [...(prev.trending_courses || []), { name: '', growth: '+0%', icon: '📊', link: '' }]
    }));
  };

  const updateTrendingCourse = (index, field, value) => {
    const newCourses = [...(settings.trending_courses || [])];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setSettings(prev => ({ ...prev, trending_courses: newCourses }));
  };

  const removeTrendingCourse = (index) => {
    setSettings(prev => ({
      ...prev,
      trending_courses: (prev.trending_courses || []).filter((_, i) => i !== index)
    }));
  };

  const colorOptions = [
    'bg-blue-500', 'bg-purple-500', 'bg-red-500', 'bg-green-500', 
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-600',
    'bg-orange-500', 'bg-teal-500', 'bg-cyan-500', 'bg-rose-500'
  ];

  const iconOptions = [
    'HiOutlineDesktopComputer', 'HiOutlineHeart', 'HiOutlineOfficeBuilding',
    'HiOutlineBeaker', 'HiOutlineCurrencyRupee', 'HiOutlinePencilAlt',
    'HiOutlineScale', 'HiOutlineAcademicCap'
  ];

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: FiEdit3 },
    { id: 'levels', label: 'Education Levels', icon: FiLayers },
    { id: 'streams', label: 'Stream Categories', icon: FiGrid },
    { id: 'trending', label: 'Trending & Stats', icon: FiBarChart2 },
    { id: 'seo', label: 'SEO Settings', icon: FiSearch },
    { id: 'faqs', label: 'FAQs', icon: FiHelpCircle }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <FiLoader className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10 px-6 py-4 mb-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Listing Page Settings</h1>
              <p className="text-sm text-gray-500">Customize the /courses page content from here</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.open('/courses', '_blank')}>
                <FiFileText className="mr-2 w-4 h-4" /> Preview Page
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                {saving ? <FiLoader className="mr-2 w-4 h-4 animate-spin" /> : <FiSave className="mr-2 w-4 h-4" />}
                Save Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-600 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Hero Section Tab */}
          {activeTab === 'hero' && (
            <>
              {/* Hero Content */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiEdit3 className="text-orange-600" /> Hero Section
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Title (H1)</label>
                    <input
                      type="text"
                      value={settings.hero_title}
                      onChange={(e) => handleChange('hero_title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      placeholder="Discover Your Perfect Course Journey"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <textarea
                      value={settings.hero_subtitle}
                      onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Placeholder</label>
                    <input
                      type="text"
                      value={settings.hero_search_placeholder}
                      onChange={(e) => handleChange('hero_search_placeholder', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiBookOpen className="text-blue-600" /> Popular Course Tags
                  </h2>
                  <Button variant="outline" size="sm" onClick={addPopularTag}>
                    <FiPlus className="w-4 h-4 mr-1" /> Add Tag
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mb-4">These tags appear below the search bar in the hero section</p>
                <div className="space-y-3">
                  {(settings.popular_tags || []).map((tag, index) => (
                    <div key={index} className="flex gap-3 items-center bg-gray-50 rounded-lg p-3">
                      <input
                        type="text"
                        value={tag.name}
                        onChange={(e) => updatePopularTag(index, 'name', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="Tag name (e.g., B.Tech)"
                      />
                      <input
                        type="text"
                        value={tag.link}
                        onChange={(e) => updatePopularTag(index, 'link', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="Link (e.g., /courses/engineering)"
                      />
                      <select
                        value={tag.color}
                        onChange={(e) => updatePopularTag(index, 'color', e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        {colorOptions.map(color => (
                          <option key={color} value={color}>{color.replace('bg-', '').replace('-500', '')}</option>
                        ))}
                      </select>
                      <div className={`w-8 h-8 rounded ${tag.color}`}></div>
                      <button onClick={() => removePopularTag(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Levels Tab */}
          {activeTab === 'levels' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiLayers className="text-purple-600" /> Education Levels
              </h2>
              <p className="text-sm text-gray-500 mb-4">Configure the "Choose by Level" cards (After 10th, After 12th, etc.)</p>
              <div className="space-y-4">
                {(settings.level_courses || []).map((level, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{level.icon}</span>
                      <span className="font-semibold text-gray-800">{level.title}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Title</label>
                        <input
                          type="text"
                          value={level.title}
                          onChange={(e) => updateLevelCourse(index, 'title', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={level.subtitle}
                          onChange={(e) => updateLevelCourse(index, 'subtitle', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Stats Text</label>
                        <input
                          type="text"
                          value={level.stats}
                          onChange={(e) => updateLevelCourse(index, 'stats', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="200+ Courses"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Link</label>
                        <input
                          type="text"
                          value={level.link}
                          onChange={(e) => updateLevelCourse(index, 'link', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Icon (emoji)</label>
                        <input
                          type="text"
                          value={level.icon}
                          onChange={(e) => updateLevelCourse(index, 'icon', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Popular Courses (comma-separated)</label>
                        <input
                          type="text"
                          value={(level.popular || []).join(', ')}
                          onChange={(e) => updateLevelPopular(index, e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="B.Tech, MBA, MBBS"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Streams Tab */}
          {activeTab === 'streams' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiGrid className="text-green-600" /> Stream Categories
                </h2>
                <Button variant="outline" size="sm" onClick={addStreamCategory}>
                  <FiPlus className="w-4 h-4 mr-1" /> Add Stream
                </Button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Configure the "Browse by Interest" stream cards</p>
              <div className="space-y-4">
                {(settings.stream_categories || []).map((stream, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border relative">
                    <button
                      onClick={() => removeStreamCategory(index)}
                      className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Stream Name</label>
                        <input
                          type="text"
                          value={stream.name}
                          onChange={(e) => updateStreamCategory(index, 'name', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Link</label>
                        <input
                          type="text"
                          value={stream.link}
                          onChange={(e) => updateStreamCategory(index, 'link', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Count</label>
                        <input
                          type="text"
                          value={stream.count}
                          onChange={(e) => updateStreamCategory(index, 'count', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="250+"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Icon</label>
                        <select
                          value={stream.icon}
                          onChange={(e) => updateStreamCategory(index, 'icon', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon.replace('HiOutline', '')}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2 md:col-span-4">
                        <label className="block text-xs text-gray-500 mb-1">Course Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={(stream.courses || []).join(', ')}
                          onChange={(e) => updateStreamCourses(index, e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="B.Tech, M.Tech, B.E"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending & Stats Tab */}
          {activeTab === 'trending' && (
            <>
              {/* Trending Section Header */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiBarChart2 className="text-yellow-600" /> Trending Section Header
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={settings.trending_badge || '🔥 TRENDING NOW'}
                      onChange={(e) => handleChange('trending_badge', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      placeholder="🔥 TRENDING NOW"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={settings.trending_title || 'High-Demand Courses'}
                      onChange={(e) => handleChange('trending_title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      placeholder="High-Demand Courses"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={settings.trending_subtitle || ''}
                      onChange={(e) => handleChange('trending_subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      placeholder="Courses with the highest career growth..."
                    />
                  </div>
                </div>
              </div>

              {/* Trending Courses */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🔥 Trending Courses
                  </h2>
                  <Button variant="outline" size="sm" onClick={addTrendingCourse}>
                    <FiPlus className="w-4 h-4 mr-1" /> Add Course
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Add high-demand/trending courses that appear in the dark section</p>
                <div className="space-y-3">
                  {(settings.trending_courses || []).map((course, index) => (
                    <div key={index} className="flex gap-3 items-center bg-gray-50 rounded-lg p-3">
                      <input
                        type="text"
                        value={course.icon || '📊'}
                        onChange={(e) => updateTrendingCourse(index, 'icon', e.target.value)}
                        className="w-16 border border-gray-300 rounded px-2 py-2 text-center text-xl"
                        placeholder="📊"
                      />
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => updateTrendingCourse(index, 'name', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="Course name (e.g., Data Science)"
                      />
                      <input
                        type="text"
                        value={course.growth || '+0%'}
                        onChange={(e) => updateTrendingCourse(index, 'growth', e.target.value)}
                        className="w-20 border border-gray-300 rounded px-3 py-2 text-sm text-center"
                        placeholder="+45%"
                      />
                      <input
                        type="text"
                        value={course.link || ''}
                        onChange={(e) => updateTrendingCourse(index, 'link', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="/courses/search?q=Data%20Science"
                      />
                      <button onClick={() => removeTrendingCourse(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📊 Quick Stats (Orange Bar)
                </h2>
                <p className="text-sm text-gray-500 mb-4">These stats appear in the orange statistics bar below trending section</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Courses</label>
                    <input
                      type="text"
                      value={settings.stats_courses || '10,000+'}
                      onChange={(e) => handleChange('stats_courses', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      placeholder="10,000+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Colleges</label>
                    <input
                      type="text"
                      value={settings.stats_colleges || '5,000+'}
                      onChange={(e) => handleChange('stats_colleges', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      placeholder="5,000+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Streams</label>
                    <input
                      type="text"
                      value={settings.stats_streams || '50+'}
                      onChange={(e) => handleChange('stats_streams', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      placeholder="50+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
                    <input
                      type="text"
                      value={settings.stats_students || '2M+'}
                      onChange={(e) => handleChange('stats_students', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                      placeholder="2M+"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiSearch className="text-purple-600" /> SEO Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={settings.meta_title}
                    onChange={(e) => handleChange('meta_title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.meta_title?.length || 0}/60 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    value={settings.meta_description}
                    onChange={(e) => handleChange('meta_description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    rows="3"
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.meta_description?.length || 0}/160 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords (comma separated)</label>
                  <input
                    type="text"
                    value={(settings.meta_keywords || []).join(', ')}
                    onChange={(e) => handleChange('meta_keywords', e.target.value.split(',').map(k => k.trim()))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    placeholder="courses in india, ug courses, pg courses..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Introduction Content (HTML)</label>
                  <textarea
                    value={settings.intro_content || ''}
                    onChange={(e) => handleChange('intro_content', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm"
                    rows="4"
                    placeholder="<p>Introduction content...</p>"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bottom Content (HTML)</label>
                  <textarea
                    value={settings.bottom_content || ''}
                    onChange={(e) => handleChange('bottom_content', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm"
                    rows="4"
                    placeholder="<p>Content at bottom of page...</p>"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiHelpCircle className="text-blue-600" /> FAQs
                </h2>
                <Button variant="outline" size="sm" onClick={addFaq}>
                  <FiPlus className="w-4 h-4 mr-1" /> Add FAQ
                </Button>
              </div>
              <div className="space-y-4">
                {(settings.faqs || []).map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 relative">
                    <button
                      onClick={() => removeFaq(index)}
                      className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 font-medium"
                        placeholder="Question..."
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        rows="2"
                        placeholder="Answer..."
                      />
                    </div>
                  </div>
                ))}
                {(settings.faqs || []).length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">No FAQs. Click "Add FAQ" to add questions.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseListingSettings;
