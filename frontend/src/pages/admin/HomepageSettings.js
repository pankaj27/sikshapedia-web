import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiHome, FiSettings, FiSearch, FiGrid, FiImage, FiEye, FiEyeOff, FiChevronUp, FiChevronDown, FiStar } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const TABS = [
  { id: 'hero', label: 'Hero & Slider', icon: FiHome },
  { id: 'sections', label: 'Page Sections', icon: FiGrid },
  { id: 'content', label: 'Content Blocks', icon: FiImage },
  { id: 'seo', label: 'SEO Settings', icon: FiSearch },
];

const HomepageSettings = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Search states for college and school autocomplete
  const [collegeSearchQuery, setCollegeSearchQuery] = useState('');
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [collegeSearchResults, setCollegeSearchResults] = useState([]);
  const [schoolSearchResults, setSchoolSearchResults] = useState([]);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  
  // Featured colleges for Top Universities section
  const [featuredCollegeSearch, setFeaturedCollegeSearch] = useState('');
  const [featuredCollegeResults, setFeaturedCollegeResults] = useState([]);
  const [showFeaturedDropdown, setShowFeaturedDropdown] = useState(false);
  const [featuredColleges, setFeaturedColleges] = useState([]);
  
  // Featured schools for Top Schools section
  const [featuredSchoolSearch, setFeaturedSchoolSearch] = useState('');
  const [featuredSchoolResults, setFeaturedSchoolResults] = useState([]);
  const [showSchoolFeaturedDropdown, setShowSchoolFeaturedDropdown] = useState(false);
  const [featuredSchoolsList, setFeaturedSchoolsList] = useState([]);
  
  // Featured exams for Top Exams section
  const [featuredExamSearch, setFeaturedExamSearch] = useState('');
  const [featuredExamResults, setFeaturedExamResults] = useState([]);
  const [showExamFeaturedDropdown, setShowExamFeaturedDropdown] = useState(false);
  const [featuredExamsList, setFeaturedExamsList] = useState([]);
  
  // Featured news for Latest News section
  const [featuredNewsSearch, setFeaturedNewsSearch] = useState('');
  const [featuredNewsResults, setFeaturedNewsResults] = useState([]);
  const [showNewsFeaturedDropdown, setShowNewsFeaturedDropdown] = useState(false);
  const [featuredNewsList, setFeaturedNewsList] = useState([]);
  
  // Stream colleges management
  const [streamColleges, setStreamColleges] = useState({
    Engineering: [], Medical: [], Management: [], Law: []
  });
  const [activeStream, setActiveStream] = useState('Engineering');
  const [streamSearch, setStreamSearch] = useState('');
  const [streamSearchResults, setStreamSearchResults] = useState([]);
  const [showStreamDropdown, setShowStreamDropdown] = useState(false);
  const [settings, setSettings] = useState({
    // Hero Section
    hero_title: 'Find Your Dream',
    hero_rotating_texts: ['Exams', 'Colleges', 'Courses', 'Schools', 'Universities', 'Scholarships'],
    hero_subtitle: 'Explore 10,000+ Colleges, Universities & Schools across India',
    hero_bg_gradient: 'from-purple-900 via-indigo-900 to-blue-900',
    
    // Hero Slides
    hero_slides: [],
    
    // Study Goals
    study_goals_title: 'What do you want to study?',
    study_goals: [],
    
    // Programs
    programs_title: 'Explore Programs',
    programs: [],
    
    // Cities
    cities_title: 'Top Study Destinations',
    cities: [],
    
    // Ranking Agencies
    ranking_agencies: ['India Today', 'NIRF', 'The Week', 'Outlook'],
    
    // Quick Links
    quick_links: [],
    
    // Quick Actions
    quick_actions: [
      { id: 'apply', title: 'Apply Now', subtitle: 'Quick admission', icon: 'FiSend', gradient: 'from-orange-500 to-orange-600' },
      { id: 'question', title: 'Ask Question', subtitle: 'Get expert help', icon: 'FiMessageCircle', gradient: 'from-blue-500 to-blue-600' },
      { id: 'counselling', title: 'Counselling', subtitle: 'Free guidance', icon: 'FiPhone', gradient: 'from-purple-500 to-purple-600' }
    ],
    
    // Top Universities
    top_universities_title: 'Top Universities & Colleges',
    featured_colleges_ids: [],
    
    // Top Schools
    top_schools_title: 'Top Schools in India',
    top_schools: [],
    featured_schools_ids: [],
    
    // Top Exams
    featured_exams_ids: [],
    
    // Latest News
    featured_news_ids: [],
    
    // Colleges by Stream
    stream_colleges: {
      Engineering: [], Medical: [], Management: [], Law: []
    },
    
    // College Rankings
    college_rankings_title: 'College Rankings',
    college_rankings_years: ['2024', '2023', '2022'],
    college_rankings_data: [
      { rank: 1, name: 'IIT Bombay', location: 'Mumbai', rating: 4.9, fees: '2.5L', type: 'Engineering' },
      { rank: 2, name: 'IIT Delhi', location: 'New Delhi', rating: 4.8, fees: '2.5L', type: 'Engineering' },
      { rank: 3, name: 'IIT Madras', location: 'Chennai', rating: 4.8, fees: '2.5L', type: 'Engineering' },
      { rank: 4, name: 'IIT Kanpur', location: 'Kanpur', rating: 4.7, fees: '2.5L', type: 'Engineering' },
      { rank: 5, name: 'IIT Kharagpur', location: 'Kharagpur', rating: 4.7, fees: '2.5L', type: 'Engineering' }
    ],
    
    // Newsletter
    newsletter_title: 'Subscribe to Our Newsletter',
    newsletter_subtitle: 'Get the latest updates on college admissions, exams, and education news',
    
    // Section Visibility - All 15 sections
    show_hero_slider: true,
    show_quick_links: true,
    show_quick_actions: true,
    show_study_goals: true,
    show_programs: true,
    show_top_universities: true,
    show_top_schools: true,
    show_college_rankings: true,
    show_cities: true,
    show_newsletter: true,
    show_sponsored_colleges: true,
    show_top_colleges_by_stream: true,
    show_top_exams: true,
    show_location_search: true,
    show_latest_news: true,
    
    // Location Search Settings
    location_search_title: 'Find Colleges by Location',
    location_states: [
      { name: 'Maharashtra', icon: '🏛️', link: '/colleges?state=Maharashtra' },
      { name: 'Tamil Nadu', icon: '🏛️', link: '/colleges?state=Tamil Nadu' },
      { name: 'Karnataka', icon: '🏛️', link: '/colleges?state=Karnataka' },
      { name: 'Delhi', icon: '🏛️', link: '/colleges?state=Delhi' },
      { name: 'Uttar Pradesh', icon: '🏛️', link: '/colleges?state=Uttar Pradesh' },
      { name: 'West Bengal', icon: '🏛️', link: '/colleges?state=West Bengal' },
      { name: 'Gujarat', icon: '🏛️', link: '/colleges?state=Gujarat' },
      { name: 'Rajasthan', icon: '🏛️', link: '/colleges?state=Rajasthan' },
      { name: 'Madhya Pradesh', icon: '🏛️', link: '/colleges?state=Madhya Pradesh' },
      { name: 'Kerala', icon: '🏛️', link: '/colleges?state=Kerala' },
      { name: 'Telangana', icon: '🏛️', link: '/colleges?state=Telangana' },
      { name: 'Punjab', icon: '🏛️', link: '/colleges?state=Punjab' }
    ],
    location_cities: [
      { name: 'Mumbai', icon: '🌆', link: '/colleges?city=Mumbai' },
      { name: 'Delhi', icon: '🌆', link: '/colleges?city=Delhi' },
      { name: 'Bangalore', icon: '🌆', link: '/colleges?city=Bangalore' },
      { name: 'Hyderabad', icon: '🌆', link: '/colleges?city=Hyderabad' },
      { name: 'Chennai', icon: '🌆', link: '/colleges?city=Chennai' },
      { name: 'Pune', icon: '🌆', link: '/colleges?city=Pune' },
      { name: 'Kolkata', icon: '🌆', link: '/colleges?city=Kolkata' },
      { name: 'Ahmedabad', icon: '🌆', link: '/colleges?city=Ahmedabad' }
    ],
    location_countries: [
      { name: 'USA', icon: '🇺🇸', link: '/study-abroad?country=USA' },
      { name: 'UK', icon: '🇬🇧', link: '/study-abroad?country=UK' },
      { name: 'Canada', icon: '🇨🇦', link: '/study-abroad?country=Canada' },
      { name: 'Australia', icon: '🇦🇺', link: '/study-abroad?country=Australia' },
      { name: 'Germany', icon: '🇩🇪', link: '/study-abroad?country=Germany' },
      { name: 'Singapore', icon: '🇸🇬', link: '/study-abroad?country=Singapore' }
    ],
    
    // CTA
    cta_enabled: true,
    cta_title: 'Start Your Journey Today',
    cta_subtitle: 'Join millions of students who found their dream college through Admissionbuddy',
    cta_button_text: 'Explore Colleges',
    cta_button_link: '/colleges',
    
    // SEO
    auto_generate_seo: true,
    meta_title: 'Admissionbuddy - Top Colleges, Universities & Institutes in India | Admission 2025',
    meta_description: 'Find detailed information about 10,000+ colleges, universities, courses, exams in India.',
    meta_keywords: [],
    canonical_url: '',
    og_image: ''
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [rotatingTextInput, setRotatingTextInput] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  // Default data for when arrays are empty
  const defaultTopSchools = [
    { name: 'Delhi Public School (DPS)', location: 'Multiple Locations', board: 'CBSE', rating: 4.8, fees: '2.5L', type: 'Day School', rank: 1 },
    { name: 'The Doon School', location: 'Dehradun', board: 'ICSE', rating: 4.9, fees: '8L', type: 'Boarding', rank: 2 },
    { name: 'Mayo College', location: 'Ajmer', board: 'CBSE', rating: 4.8, fees: '7.5L', type: 'Boarding', rank: 3 },
    { name: 'Scindia School', location: 'Gwalior', board: 'CBSE', rating: 4.8, fees: '7L', type: 'Boarding', rank: 4 }
  ];

  const defaultRankingsData = [
    { rank: 1, name: 'IIT Bombay', location: 'Mumbai', rating: 4.9, fees: '2.5L', type: 'Engineering' },
    { rank: 2, name: 'IIT Delhi', location: 'New Delhi', rating: 4.8, fees: '2.5L', type: 'Engineering' },
    { rank: 3, name: 'IIT Madras', location: 'Chennai', rating: 4.8, fees: '2.5L', type: 'Engineering' },
    { rank: 4, name: 'IIT Kanpur', location: 'Kanpur', rating: 4.7, fees: '2.5L', type: 'Engineering' },
    { rank: 5, name: 'IIT Kharagpur', location: 'Kharagpur', rating: 4.7, fees: '2.5L', type: 'Engineering' }
  ];

  const fetchSettings = async () => {
    try {
      const response = await api.get('/homepage-settings');
      if (response.data) {
        // Merge with defaults for empty arrays
        const data = {
          ...response.data,
          top_schools: response.data.top_schools?.length > 0 ? response.data.top_schools : defaultTopSchools,
          college_rankings_data: response.data.college_rankings_data?.length > 0 ? response.data.college_rankings_data : defaultRankingsData,
          college_rankings_years: response.data.college_rankings_years?.length > 0 ? response.data.college_rankings_years : ['2024', '2023', '2022']
        };
        setSettings(prev => ({ ...prev, ...data }));
        
        // Fetch full data for all featured sections
        if (response.data.featured_colleges_ids?.length > 0) {
          fetchFeaturedData('colleges', response.data.featured_colleges_ids, setFeaturedColleges);
        }
        if (response.data.featured_schools_ids?.length > 0) {
          fetchFeaturedData('schools', response.data.featured_schools_ids, setFeaturedSchoolsList);
        }
        if (response.data.featured_exams_ids?.length > 0) {
          fetchFeaturedData('exams', response.data.featured_exams_ids, setFeaturedExamsList);
        }
        if (response.data.featured_news_ids?.length > 0) {
          fetchFeaturedData('news', response.data.featured_news_ids, setFeaturedNewsList);
        }
        // Load stream colleges
        if (response.data.stream_colleges) {
          fetchStreamCollegesData(response.data.stream_colleges);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generic fetch function for featured items
  const fetchFeaturedData = async (type, ids, setterFn) => {
    try {
      const items = [];
      for (const id of ids) {
        const res = await api.get(`/${type}/${id}`);
        if (res.data) items.push(res.data);
      }
      setterFn(items);
    } catch (error) {
      console.error(`Error fetching featured ${type}:`, error);
    }
  };

  // Search colleges for featured section
  const searchFeaturedColleges = async (query) => {
    if (!query || query.length < 2) {
      setFeaturedCollegeResults([]);
      setShowFeaturedDropdown(false);
      return;
    }
    try {
      const response = await api.get(`/colleges?search=${encodeURIComponent(query)}&limit=10`);
      setFeaturedCollegeResults(response.data || []);
      setShowFeaturedDropdown(true);
    } catch (error) {
      console.error('Error searching colleges:', error);
    }
  };

  // Add college to featured list
  const addFeaturedCollege = (college) => {
    // Check if already added
    if (featuredColleges.find(c => c.id === college.id)) {
      alert('This college is already in the list');
      return;
    }
    const newFeatured = [...featuredColleges, college];
    setFeaturedColleges(newFeatured);
    setSettings(prev => ({
      ...prev,
      featured_colleges_ids: newFeatured.map(c => c.id)
    }));
    setFeaturedCollegeSearch('');
    setFeaturedCollegeResults([]);
    setShowFeaturedDropdown(false);
  };

  // Remove college from featured list
  const removeFeaturedCollege = (collegeId) => {
    const newFeatured = featuredColleges.filter(c => c.id !== collegeId);
    setFeaturedColleges(newFeatured);
    setSettings(prev => ({
      ...prev,
      featured_colleges_ids: newFeatured.map(c => c.id)
    }));
  };

  // Move college up in the list
  const moveFeaturedCollegeUp = (index) => {
    if (index === 0) return;
    const newFeatured = [...featuredColleges];
    [newFeatured[index - 1], newFeatured[index]] = [newFeatured[index], newFeatured[index - 1]];
    setFeaturedColleges(newFeatured);
    setSettings(prev => ({
      ...prev,
      featured_colleges_ids: newFeatured.map(c => c.id)
    }));
  };

  // Move college down in the list
  const moveFeaturedCollegeDown = (index) => {
    if (index === featuredColleges.length - 1) return;
    const newFeatured = [...featuredColleges];
    [newFeatured[index], newFeatured[index + 1]] = [newFeatured[index + 1], newFeatured[index]];
    setFeaturedColleges(newFeatured);
    setSettings(prev => ({
      ...prev,
      featured_colleges_ids: newFeatured.map(c => c.id)
    }));
  };

  // ========== SCHOOLS ==========
  const searchFeaturedSchools = async (query) => {
    if (!query || query.length < 2) { setFeaturedSchoolResults([]); setShowSchoolFeaturedDropdown(false); return; }
    try {
      const response = await api.get(`/schools?search=${encodeURIComponent(query)}&limit=10`);
      setFeaturedSchoolResults(response.data || []);
      setShowSchoolFeaturedDropdown(true);
    } catch (error) { console.error('Error:', error); }
  };
  const addFeaturedSchool = (school) => {
    if (featuredSchoolsList.find(s => s.id === school.id)) { alert('Already added'); return; }
    const newList = [...featuredSchoolsList, school];
    setFeaturedSchoolsList(newList);
    setSettings(prev => ({ ...prev, featured_schools_ids: newList.map(s => s.id) }));
    setFeaturedSchoolSearch(''); setFeaturedSchoolResults([]); setShowSchoolFeaturedDropdown(false);
  };
  const removeFeaturedSchool = (id) => {
    const newList = featuredSchoolsList.filter(s => s.id !== id);
    setFeaturedSchoolsList(newList);
    setSettings(prev => ({ ...prev, featured_schools_ids: newList.map(s => s.id) }));
  };
  const moveFeaturedSchool = (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= featuredSchoolsList.length) return;
    const newList = [...featuredSchoolsList];
    [newList[index], newList[newIdx]] = [newList[newIdx], newList[index]];
    setFeaturedSchoolsList(newList);
    setSettings(prev => ({ ...prev, featured_schools_ids: newList.map(s => s.id) }));
  };

  // ========== EXAMS ==========
  const searchFeaturedExams = async (query) => {
    if (!query || query.length < 2) { setFeaturedExamResults([]); setShowExamFeaturedDropdown(false); return; }
    try {
      const response = await api.get(`/exams?search=${encodeURIComponent(query)}&limit=10`);
      setFeaturedExamResults(response.data || []);
      setShowExamFeaturedDropdown(true);
    } catch (error) { console.error('Error:', error); }
  };
  const addFeaturedExam = (exam) => {
    if (featuredExamsList.find(e => e.id === exam.id)) { alert('Already added'); return; }
    const newList = [...featuredExamsList, exam];
    setFeaturedExamsList(newList);
    setSettings(prev => ({ ...prev, featured_exams_ids: newList.map(e => e.id) }));
    setFeaturedExamSearch(''); setFeaturedExamResults([]); setShowExamFeaturedDropdown(false);
  };
  const removeFeaturedExam = (id) => {
    const newList = featuredExamsList.filter(e => e.id !== id);
    setFeaturedExamsList(newList);
    setSettings(prev => ({ ...prev, featured_exams_ids: newList.map(e => e.id) }));
  };
  const moveFeaturedExam = (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= featuredExamsList.length) return;
    const newList = [...featuredExamsList];
    [newList[index], newList[newIdx]] = [newList[newIdx], newList[index]];
    setFeaturedExamsList(newList);
    setSettings(prev => ({ ...prev, featured_exams_ids: newList.map(e => e.id) }));
  };

  // ========== NEWS ==========
  const searchFeaturedNews = async (query) => {
    if (!query || query.length < 2) { setFeaturedNewsResults([]); setShowNewsFeaturedDropdown(false); return; }
    try {
      const response = await api.get(`/news?search=${encodeURIComponent(query)}&limit=10`);
      setFeaturedNewsResults(response.data || []);
      setShowNewsFeaturedDropdown(true);
    } catch (error) { console.error('Error:', error); }
  };
  const addFeaturedNews = (news) => {
    if (featuredNewsList.find(n => n.id === news.id)) { alert('Already added'); return; }
    const newList = [...featuredNewsList, news];
    setFeaturedNewsList(newList);
    setSettings(prev => ({ ...prev, featured_news_ids: newList.map(n => n.id) }));
    setFeaturedNewsSearch(''); setFeaturedNewsResults([]); setShowNewsFeaturedDropdown(false);
  };
  const removeFeaturedNews = (id) => {
    const newList = featuredNewsList.filter(n => n.id !== id);
    setFeaturedNewsList(newList);
    setSettings(prev => ({ ...prev, featured_news_ids: newList.map(n => n.id) }));
  };
  const moveFeaturedNews = (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= featuredNewsList.length) return;
    const newList = [...featuredNewsList];
    [newList[index], newList[newIdx]] = [newList[newIdx], newList[index]];
    setFeaturedNewsList(newList);
    setSettings(prev => ({ ...prev, featured_news_ids: newList.map(n => n.id) }));
  };

  // ========== STREAM COLLEGES ==========
  const fetchStreamCollegesData = async (streamData) => {
    const result = { Engineering: [], Medical: [], Management: [], Law: [] };
    for (const stream of Object.keys(streamData)) {
      if (streamData[stream]?.length > 0) {
        const colleges = [];
        for (const id of streamData[stream]) {
          try {
            const res = await api.get(`/colleges/${id}`);
            if (res.data) colleges.push(res.data);
          } catch (e) {}
        }
        result[stream] = colleges;
      }
    }
    setStreamColleges(result);
  };

  const searchStreamColleges = async (query) => {
    if (!query || query.length < 2) { setStreamSearchResults([]); setShowStreamDropdown(false); return; }
    try {
      const response = await api.get(`/colleges?search=${encodeURIComponent(query)}&limit=10`);
      setStreamSearchResults(response.data || []);
      setShowStreamDropdown(true);
    } catch (error) { console.error('Error:', error); }
  };

  const addStreamCollege = (college) => {
    if (streamColleges[activeStream].find(c => c.id === college.id)) { alert('Already added'); return; }
    if (streamColleges[activeStream].length >= 4) { alert('Maximum 4 colleges per stream'); return; }
    const newList = [...streamColleges[activeStream], college];
    const newStreamColleges = { ...streamColleges, [activeStream]: newList };
    setStreamColleges(newStreamColleges);
    // Update settings with IDs only
    const streamIds = {};
    Object.keys(newStreamColleges).forEach(s => {
      streamIds[s] = newStreamColleges[s].map(c => c.id);
    });
    setSettings(prev => ({ ...prev, stream_colleges: streamIds }));
    setStreamSearch(''); setStreamSearchResults([]); setShowStreamDropdown(false);
  };

  const removeStreamCollege = (stream, collegeId) => {
    const newList = streamColleges[stream].filter(c => c.id !== collegeId);
    const newStreamColleges = { ...streamColleges, [stream]: newList };
    setStreamColleges(newStreamColleges);
    const streamIds = {};
    Object.keys(newStreamColleges).forEach(s => {
      streamIds[s] = newStreamColleges[s].map(c => c.id);
    });
    setSettings(prev => ({ ...prev, stream_colleges: streamIds }));
  };

  const moveStreamCollege = (stream, index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= streamColleges[stream].length) return;
    const newList = [...streamColleges[stream]];
    [newList[index], newList[newIdx]] = [newList[newIdx], newList[index]];
    const newStreamColleges = { ...streamColleges, [stream]: newList };
    setStreamColleges(newStreamColleges);
    const streamIds = {};
    Object.keys(newStreamColleges).forEach(s => {
      streamIds[s] = newStreamColleges[s].map(c => c.id);
    });
    setSettings(prev => ({ ...prev, stream_colleges: streamIds }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/homepage-settings', settings);
      alert('Homepage settings saved successfully!');
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

  // Rotating Texts
  const addRotatingText = () => {
    if (rotatingTextInput.trim() && !settings.hero_rotating_texts.includes(rotatingTextInput.trim())) {
      handleChange('hero_rotating_texts', [...settings.hero_rotating_texts, rotatingTextInput.trim()]);
      setRotatingTextInput('');
    }
  };

  const removeRotatingText = (text) => {
    handleChange('hero_rotating_texts', settings.hero_rotating_texts.filter(t => t !== text));
  };

  // Hero Slides
  const addSlide = () => {
    setSettings(prev => ({
      ...prev,
      hero_slides: [...prev.hero_slides, { 
        image: '', type: 'college', name: '', rating: 4.5, reviews: 0, location: '', slug: '' 
      }]
    }));
  };

  const updateSlide = (index, field, value) => {
    const newSlides = [...settings.hero_slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    handleChange('hero_slides', newSlides);
  };

  const removeSlide = (index) => {
    handleChange('hero_slides', settings.hero_slides.filter((_, i) => i !== index));
  };

  // Study Goals
  const addStudyGoal = () => {
    setSettings(prev => ({
      ...prev,
      study_goals: [...prev.study_goals, { 
        name: 'New Stream', icon: 'FiBookOpen', courses: '', count: '0+', color: 'text-gray-600' 
      }]
    }));
  };

  const updateStudyGoal = (index, field, value) => {
    const newGoals = [...settings.study_goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    handleChange('study_goals', newGoals);
  };

  const removeStudyGoal = (index) => {
    handleChange('study_goals', settings.study_goals.filter((_, i) => i !== index));
  };

  // Programs
  const addProgram = () => {
    setSettings(prev => ({
      ...prev,
      programs: [...prev.programs, { 
        title: 'New Program', subtitle: '', icon: 'FiGrid', color: 'bg-gray-100', iconColor: 'text-gray-600', link: '/' 
      }]
    }));
  };

  const updateProgram = (index, field, value) => {
    const newPrograms = [...settings.programs];
    newPrograms[index] = { ...newPrograms[index], [field]: value };
    handleChange('programs', newPrograms);
  };

  const removeProgram = (index) => {
    handleChange('programs', settings.programs.filter((_, i) => i !== index));
  };

  // Cities
  const addCity = () => {
    setSettings(prev => ({
      ...prev,
      cities: [...prev.cities, { name: 'New City', image: '' }]
    }));
  };

  const updateCity = (index, field, value) => {
    const newCities = [...settings.cities];
    newCities[index] = { ...newCities[index], [field]: value };
    handleChange('cities', newCities);
  };

  const removeCity = (index) => {
    handleChange('cities', settings.cities.filter((_, i) => i !== index));
  };

  // Quick Actions
  const updateQuickAction = (index, field, value) => {
    const newActions = [...(settings.quick_actions || [])];
    newActions[index] = { ...newActions[index], [field]: value };
    handleChange('quick_actions', newActions);
  };

  // Search colleges from database
  const searchColleges = async (query) => {
    if (!query || query.length < 2) {
      setCollegeSearchResults([]);
      setShowCollegeDropdown(false);
      return;
    }
    try {
      const response = await api.get(`/colleges?search=${encodeURIComponent(query)}&limit=10`);
      setCollegeSearchResults(response.data || []);
      setShowCollegeDropdown(true);
    } catch (error) {
      console.error('Error searching colleges:', error);
      setCollegeSearchResults([]);
    }
  };

  // Search schools from database
  const searchSchools = async (query) => {
    if (!query || query.length < 2) {
      setSchoolSearchResults([]);
      setShowSchoolDropdown(false);
      return;
    }
    try {
      const response = await api.get(`/schools?search=${encodeURIComponent(query)}&limit=10`);
      setSchoolSearchResults(response.data || []);
      setShowSchoolDropdown(true);
    } catch (error) {
      console.error('Error searching schools:', error);
      setSchoolSearchResults([]);
    }
  };

  // Add college from search result
  const addCollegeFromSearch = (college) => {
    const currentData = settings.college_rankings_data || [];
    const nextRank = currentData.length > 0 ? Math.max(...currentData.map(c => c.rank)) + 1 : 1;
    const location = college.location?.city || college.city || '';
    setSettings(prev => ({
      ...prev,
      college_rankings_data: [...(prev.college_rankings_data || []), {
        rank: nextRank,
        name: college.name,
        location: location,
        rating: college.rating || 4.5,
        fees: college.fees?.amount ? `${(college.fees.amount / 100000).toFixed(1)}L` : '2L',
        type: college.type || 'Engineering'
      }]
    }));
    setCollegeSearchQuery('');
    setCollegeSearchResults([]);
    setShowCollegeDropdown(false);
  };

  // Add school from search result
  const addSchoolFromSearch = (school) => {
    const currentSchools = settings.top_schools || [];
    const nextRank = currentSchools.length > 0 ? Math.max(...currentSchools.map(s => s.rank || 0)) + 1 : 1;
    setSettings(prev => ({
      ...prev,
      top_schools: [...(prev.top_schools || []), {
        name: school.name,
        location: school.location?.city || school.city || school.address?.city || '',
        board: school.board || 'CBSE',
        rating: school.rating || 4.5,
        fees: school.fees ? `${(school.fees / 100000).toFixed(1)}L` : '2L',
        type: school.type || 'Day School',
        rank: nextRank
      }]
    }));
    setSchoolSearchQuery('');
    setSchoolSearchResults([]);
    setShowSchoolDropdown(false);
  };

  // Top Schools
  const addTopSchool = () => {
    setSettings(prev => ({
      ...prev,
      top_schools: [...(prev.top_schools || []), { name: 'New School', location: '', board: 'CBSE', rating: 4.5, fees: '2L', type: 'Day School', rank: 1 }]
    }));
  };

  const updateTopSchool = (index, field, value) => {
    const newSchools = [...(settings.top_schools || [])];
    newSchools[index] = { ...newSchools[index], [field]: value };
    handleChange('top_schools', newSchools);
  };

  const removeTopSchool = (index) => {
    handleChange('top_schools', (settings.top_schools || []).filter((_, i) => i !== index));
  };

  // College Rankings
  const addRankingCollege = () => {
    const currentData = settings.college_rankings_data || [];
    const nextRank = currentData.length > 0 ? Math.max(...currentData.map(c => c.rank)) + 1 : 1;
    setSettings(prev => ({
      ...prev,
      college_rankings_data: [...(prev.college_rankings_data || []), { rank: nextRank, name: 'New College', location: '', rating: 4.5, fees: '2L', type: 'Engineering' }]
    }));
  };

  const updateRankingCollege = (index, field, value) => {
    const newData = [...(settings.college_rankings_data || [])];
    newData[index] = { ...newData[index], [field]: value };
    handleChange('college_rankings_data', newData);
  };

  const removeRankingCollege = (index) => {
    handleChange('college_rankings_data', (settings.college_rankings_data || []).filter((_, i) => i !== index));
  };

  // Ranking Years
  const [yearInput, setYearInput] = useState('');
  const addRankingYear = () => {
    if (yearInput.trim() && !(settings.college_rankings_years || []).includes(yearInput.trim())) {
      handleChange('college_rankings_years', [...(settings.college_rankings_years || []), yearInput.trim()]);
      setYearInput('');
    }
  };
  const removeRankingYear = (year) => {
    handleChange('college_rankings_years', (settings.college_rankings_years || []).filter(y => y !== year));
  };

  // Keywords
  const addKeyword = () => {
    if (keywordInput.trim() && !settings.meta_keywords.includes(keywordInput.trim())) {
      handleChange('meta_keywords', [...settings.meta_keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    handleChange('meta_keywords', settings.meta_keywords.filter(k => k !== keyword));
  };

  // Ranking Agencies
  const [agencyInput, setAgencyInput] = useState('');
  const addAgency = () => {
    if (agencyInput.trim() && !settings.ranking_agencies.includes(agencyInput.trim())) {
      handleChange('ranking_agencies', [...settings.ranking_agencies, agencyInput.trim()]);
      setAgencyInput('');
    }
  };

  const removeAgency = (agency) => {
    handleChange('ranking_agencies', settings.ranking_agencies.filter(a => a !== agency));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Homepage Settings</h1>
            <p className="text-gray-600">Control the homepage content and appearance</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
            <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                activeTab === tab.id 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border p-6">
          
          {/* Hero & Slider Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Hero Section</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={settings.hero_title}
                    onChange={(e) => handleChange('hero_title', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Find Your Dream"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Background Gradient</label>
                  <input
                    type="text"
                    value={settings.hero_bg_gradient}
                    onChange={(e) => handleChange('hero_bg_gradient', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="from-purple-900 via-indigo-900 to-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={settings.hero_subtitle}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                />
              </div>

              {/* Rotating Texts */}
              <div>
                <label className="block text-sm font-medium mb-2">Rotating Texts (animated)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={rotatingTextInput}
                    onChange={(e) => setRotatingTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRotatingText())}
                    className="flex-1 border rounded-lg px-4 py-2"
                    placeholder="Add text and press Enter"
                  />
                  <Button variant="outline" onClick={addRotatingText}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.hero_rotating_texts?.map((text, index) => (
                    <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {text}
                      <button onClick={() => removeRotatingText(text)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Hero Slides */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Hero Slider Images</h3>
                  <Button variant="outline" size="sm" onClick={addSlide}>
                    <FiPlus className="mr-1" /> Add Slide
                  </Button>
                </div>
                <div className="space-y-4">
                  {settings.hero_slides?.map((slide, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-medium">Slide {index + 1}</span>
                        <button onClick={() => removeSlide(index)} className="text-red-500 hover:text-red-700">
                          <FiTrash2 />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3">
                          <label className="block text-xs text-gray-500 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={slide.image}
                            onChange={(e) => updateSlide(index, 'image', e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Name</label>
                          <input
                            type="text"
                            value={slide.name}
                            onChange={(e) => updateSlide(index, 'name', e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Type</label>
                          <select
                            value={slide.type}
                            onChange={(e) => updateSlide(index, 'type', e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                          >
                            <option value="college">College</option>
                            <option value="school">School</option>
                            <option value="university">University</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Location</label>
                          <input
                            type="text"
                            value={slide.location}
                            onChange={(e) => updateSlide(index, 'location', e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Rating</label>
                          <input
                            type="number"
                            value={slide.rating}
                            onChange={(e) => updateSlide(index, 'rating', parseFloat(e.target.value) || 0)}
                            className="w-full border rounded px-3 py-2 text-sm"
                            step="0.1"
                            min="0"
                            max="5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Slug (URL)</label>
                          <input
                            type="text"
                            value={slide.slug}
                            onChange={(e) => updateSlide(index, 'slug', e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {settings.hero_slides?.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No slides added. Click "Add Slide" to add hero images.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Page Sections Tab */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Section Visibility</h2>
              <p className="text-sm text-gray-600 mb-4">Toggle which sections appear on the homepage</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'show_hero_slider', label: '1. Hero Slider' },
                  { key: 'show_quick_links', label: '2. Quick Links Bar' },
                  { key: 'show_quick_actions', label: '3. Quick Actions' },
                  { key: 'show_study_goals', label: '4. Study Goals' },
                  { key: 'show_programs', label: '5. Explore Programs' },
                  { key: 'show_top_universities', label: '6. Top Universities' },
                  { key: 'show_top_schools', label: '7. Top Schools' },
                  { key: 'show_college_rankings', label: '8. Rankings Table' },
                  { key: 'show_cities', label: '9. Popular Cities' },
                  { key: 'show_newsletter', label: '10. Newsletter' },
                  { key: 'show_sponsored_colleges', label: '11. Sponsored Colleges' },
                  { key: 'show_top_colleges_by_stream', label: '12. Colleges by Stream' },
                  { key: 'show_top_exams', label: '13. Top Exams' },
                  { key: 'show_location_search', label: '14. Location Search' },
                  { key: 'show_latest_news', label: '15. Latest News' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={settings[key]}
                      onChange={(e) => handleChange(key, e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span className="font-medium">{label}</span>
                    {settings[key] ? <FiEye className="ml-auto text-green-500" /> : <FiEyeOff className="ml-auto text-gray-400" />}
                  </label>
                ))}
              </div>

              {/* Featured Colleges for Top Universities Section */}
              <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FiStar className="text-indigo-600" />
                  Featured Colleges (Top Universities Section)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Search and add colleges to display in the "Top Universities" section. Drag to reorder - Position #1 will appear first on homepage.
                </p>
                
                {/* Search Input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={featuredCollegeSearch}
                    onChange={(e) => {
                      setFeaturedCollegeSearch(e.target.value);
                      searchFeaturedColleges(e.target.value);
                    }}
                    onFocus={() => featuredCollegeResults.length > 0 && setShowFeaturedDropdown(true)}
                    className="w-full border-2 border-indigo-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:outline-none"
                    placeholder="Search college by name to add..."
                  />
                  <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  
                  {/* Search Dropdown */}
                  {showFeaturedDropdown && featuredCollegeResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-indigo-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {featuredCollegeResults.map((college, idx) => (
                        <div
                          key={idx}
                          onClick={() => addFeaturedCollege(college)}
                          className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium text-gray-900">{college.name}</div>
                            <div className="text-xs text-gray-500">{college.location?.city} • {college.type}</div>
                          </div>
                          <FiPlus className="text-indigo-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Featured Colleges List */}
                {featuredColleges.length > 0 ? (
                  <div className="space-y-2">
                    {featuredColleges.map((college, index) => (
                      <div key={college.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{college.name}</div>
                          <div className="text-xs text-gray-500">{college.location?.city} • NIRF: {college.nirf_ranking || 'N/A'}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveFeaturedCollegeUp(index)}
                            disabled={index === 0}
                            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                            title="Move Up"
                          >
                            <FiChevronUp />
                          </button>
                          <button
                            onClick={() => moveFeaturedCollegeDown(index)}
                            disabled={index === featuredColleges.length - 1}
                            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                            title="Move Down"
                          >
                            <FiChevronDown />
                          </button>
                          <button
                            onClick={() => removeFeaturedCollege(college.id)}
                            className="p-1.5 rounded hover:bg-red-100 text-red-600"
                            title="Remove"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
                    <FiStar className="mx-auto text-4xl text-gray-300 mb-2" />
                    <p className="text-gray-500">No colleges added yet</p>
                    <p className="text-sm text-gray-400">Search and add colleges above</p>
                  </div>
                )}
              </div>

              {/* Featured Schools Section */}
              <div className="mt-6 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FiStar className="text-emerald-600" />
                  Featured Schools (Top Schools Section)
                </h3>
                <p className="text-sm text-gray-600 mb-4">Search and add schools - Position #1 appears first</p>
                <div className="relative mb-4">
                  <input type="text" value={featuredSchoolSearch}
                    onChange={(e) => { setFeaturedSchoolSearch(e.target.value); searchFeaturedSchools(e.target.value); }}
                    className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none"
                    placeholder="Search school by name..." />
                  <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  {showSchoolFeaturedDropdown && featuredSchoolResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-emerald-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {featuredSchoolResults.map((s, i) => (
                        <div key={i} onClick={() => addFeaturedSchool(s)} className="px-4 py-3 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0 flex justify-between">
                          <div><div className="font-medium">{s.name}</div><div className="text-xs text-gray-500">{s.board} • {s.city}</div></div>
                          <FiPlus className="text-emerald-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {featuredSchoolsList.length > 0 ? (
                  <div className="space-y-2">
                    {featuredSchoolsList.map((s, i) => (
                      <div key={s.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border">
                        <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</span>
                        <div className="flex-1"><div className="font-medium">{s.name}</div><div className="text-xs text-gray-500">{s.board}</div></div>
                        <button onClick={() => moveFeaturedSchool(i, 'up')} disabled={i === 0} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"><FiChevronUp /></button>
                        <button onClick={() => moveFeaturedSchool(i, 'down')} disabled={i === featuredSchoolsList.length - 1} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"><FiChevronDown /></button>
                        <button onClick={() => removeFeaturedSchool(s.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded"><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed"><p className="text-gray-500">No schools added</p></div>}
              </div>

              {/* Featured Exams Section */}
              <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FiStar className="text-blue-600" />
                  Featured Exams (Top Exams Section)
                </h3>
                <p className="text-sm text-gray-600 mb-4">Search and add exams - Position #1 appears first</p>
                <div className="relative mb-4">
                  <input type="text" value={featuredExamSearch}
                    onChange={(e) => { setFeaturedExamSearch(e.target.value); searchFeaturedExams(e.target.value); }}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                    placeholder="Search exam by name..." />
                  <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  {showExamFeaturedDropdown && featuredExamResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-blue-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {featuredExamResults.map((e, i) => (
                        <div key={i} onClick={() => addFeaturedExam(e)} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 flex justify-between">
                          <div><div className="font-medium">{e.name}</div><div className="text-xs text-gray-500">{e.level} • {e.conducting_body}</div></div>
                          <FiPlus className="text-blue-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {featuredExamsList.length > 0 ? (
                  <div className="space-y-2">
                    {featuredExamsList.map((e, i) => (
                      <div key={e.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</span>
                        <div className="flex-1"><div className="font-medium">{e.name}</div><div className="text-xs text-gray-500">{e.level}</div></div>
                        <button onClick={() => moveFeaturedExam(i, 'up')} disabled={i === 0} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"><FiChevronUp /></button>
                        <button onClick={() => moveFeaturedExam(i, 'down')} disabled={i === featuredExamsList.length - 1} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"><FiChevronDown /></button>
                        <button onClick={() => removeFeaturedExam(e.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded"><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed"><p className="text-gray-500">No exams added</p></div>}
              </div>

              {/* Featured News Section */}
              <div className="mt-6 p-6 bg-orange-50 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FiStar className="text-orange-600" />
                  Featured News (Latest News Section)
                </h3>
                <p className="text-sm text-gray-600 mb-4">Search and add news - Position #1 appears first</p>
                <div className="relative mb-4">
                  <input type="text" value={featuredNewsSearch}
                    onChange={(e) => { setFeaturedNewsSearch(e.target.value); searchFeaturedNews(e.target.value); }}
                    className="w-full border-2 border-orange-200 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none"
                    placeholder="Search news by title..." />
                  <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  {showNewsFeaturedDropdown && featuredNewsResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-orange-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {featuredNewsResults.map((n, i) => (
                        <div key={i} onClick={() => addFeaturedNews(n)} className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b last:border-b-0 flex justify-between">
                          <div><div className="font-medium">{n.title}</div><div className="text-xs text-gray-500">{n.category}</div></div>
                          <FiPlus className="text-orange-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {featuredNewsList.length > 0 ? (
                  <div className="space-y-2">
                    {featuredNewsList.map((n, i) => (
                      <div key={n.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border">
                        <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</span>
                        <div className="flex-1"><div className="font-medium line-clamp-1">{n.title}</div><div className="text-xs text-gray-500">{n.category}</div></div>
                        <button onClick={() => moveFeaturedNews(i, 'up')} disabled={i === 0} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"><FiChevronUp /></button>
                        <button onClick={() => moveFeaturedNews(i, 'down')} disabled={i === featuredNewsList.length - 1} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"><FiChevronDown /></button>
                        <button onClick={() => removeFeaturedNews(n.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded"><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed"><p className="text-gray-500">No news added</p></div>}
              </div>

              {/* Colleges by Stream Section */}
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FiGrid className="text-gray-700" />
                  Colleges by Stream (Top Colleges by Stream Section)
                </h3>
                <p className="text-sm text-gray-600 mb-4">Select up to 4 colleges for each stream. These will appear in the "Top Colleges by Stream" section.</p>
                
                {/* Stream Tabs */}
                <div className="flex gap-2 mb-4">
                  {['Engineering', 'Medical', 'Management', 'Law'].map(stream => (
                    <button
                      key={stream}
                      onClick={() => setActiveStream(stream)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        activeStream === stream 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-white text-gray-600 hover:bg-gray-100 border'
                      }`}
                    >
                      {stream} ({streamColleges[stream]?.length || 0}/4)
                    </button>
                  ))}
                </div>

                {/* Search for active stream */}
                <div className="relative mb-4">
                  <input type="text" value={streamSearch}
                    onChange={(e) => { setStreamSearch(e.target.value); searchStreamColleges(e.target.value); }}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none"
                    placeholder={`Search ${activeStream} college to add...`} />
                  <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  {showStreamDropdown && streamSearchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {streamSearchResults.map((c, i) => (
                        <div key={i} onClick={() => addStreamCollege(c)} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex justify-between">
                          <div><div className="font-medium">{c.name}</div><div className="text-xs text-gray-500">{c.location?.city} • {c.type}</div></div>
                          <FiPlus className="text-gray-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Display colleges for active stream */}
                {streamColleges[activeStream]?.length > 0 ? (
                  <div className="space-y-2">
                    {streamColleges[activeStream].map((c, i) => (
                      <div key={c.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border">
                        <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</span>
                        <div className="flex-1"><div className="font-medium">{c.name}</div><div className="text-xs text-gray-500">{c.location?.city}</div></div>
                        <button onClick={() => moveStreamCollege(activeStream, i, 'up')} disabled={i === 0} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"><FiChevronUp /></button>
                        <button onClick={() => moveStreamCollege(activeStream, i, 'down')} disabled={i === streamColleges[activeStream].length - 1} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"><FiChevronDown /></button>
                        <button onClick={() => removeStreamCollege(activeStream, c.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded"><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed"><p className="text-gray-500">No {activeStream} colleges added</p></div>}
              </div>

              {/* CTA Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Call to Action Section</h3>
                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.cta_enabled}
                    onChange={(e) => handleChange('cta_enabled', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-medium">Enable CTA Section</span>
                </label>
                {settings.cta_enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">CTA Title</label>
                      <input
                        type="text"
                        value={settings.cta_title}
                        onChange={(e) => handleChange('cta_title', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Button Text</label>
                      <input
                        type="text"
                        value={settings.cta_button_text}
                        onChange={(e) => handleChange('cta_button_text', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CTA Subtitle</label>
                      <input
                        type="text"
                        value={settings.cta_subtitle}
                        onChange={(e) => handleChange('cta_subtitle', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Button Link</label>
                      <input
                        type="text"
                        value={settings.cta_button_link}
                        onChange={(e) => handleChange('cta_button_link', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Ranking Agencies */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Ranking Agencies</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={agencyInput}
                    onChange={(e) => setAgencyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAgency())}
                    className="flex-1 border rounded-lg px-4 py-2"
                    placeholder="Add agency name"
                  />
                  <Button variant="outline" onClick={addAgency}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.ranking_agencies?.map((agency, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {agency}
                      <button onClick={() => removeAgency(agency)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Blocks Tab */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              {/* Study Goals */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">Study Goals / Streams</h2>
                    <input
                      type="text"
                      value={settings.study_goals_title}
                      onChange={(e) => handleChange('study_goals_title', e.target.value)}
                      className="text-sm text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-purple-500 outline-none mt-1"
                      placeholder="Section title..."
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={addStudyGoal}>
                    <FiPlus className="mr-1" /> Add Stream
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {settings.study_goals?.map((goal, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg flex gap-3 items-center">
                      <input
                        type="text"
                        value={goal.name}
                        onChange={(e) => updateStudyGoal(index, 'name', e.target.value)}
                        className="flex-1 border rounded px-3 py-1.5 text-sm"
                        placeholder="Stream Name"
                      />
                      <input
                        type="text"
                        value={goal.courses}
                        onChange={(e) => updateStudyGoal(index, 'courses', e.target.value)}
                        className="w-32 border rounded px-3 py-1.5 text-sm"
                        placeholder="Courses"
                      />
                      <input
                        type="text"
                        value={goal.count}
                        onChange={(e) => updateStudyGoal(index, 'count', e.target.value)}
                        className="w-20 border rounded px-3 py-1.5 text-sm"
                        placeholder="Count"
                      />
                      <button onClick={() => removeStudyGoal(index)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Programs */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">Quick Programs</h2>
                    <input
                      type="text"
                      value={settings.programs_title}
                      onChange={(e) => handleChange('programs_title', e.target.value)}
                      className="text-sm text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-purple-500 outline-none mt-1"
                      placeholder="Section title..."
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={addProgram}>
                    <FiPlus className="mr-1" /> Add Program
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {settings.programs?.map((program, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={program.title}
                          onChange={(e) => updateProgram(index, 'title', e.target.value)}
                          className="flex-1 border rounded px-3 py-1.5 text-sm"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={program.subtitle}
                          onChange={(e) => updateProgram(index, 'subtitle', e.target.value)}
                          className="flex-1 border rounded px-3 py-1.5 text-sm"
                          placeholder="Subtitle"
                        />
                        <input
                          type="text"
                          value={program.link}
                          onChange={(e) => updateProgram(index, 'link', e.target.value)}
                          className="w-28 border rounded px-3 py-1.5 text-sm"
                          placeholder="/link"
                        />
                        <button onClick={() => removeProgram(index)} className="text-red-500 hover:text-red-700">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Quick Actions (Apply, Ask, Counselling)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {settings.quick_actions?.map((action, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={action.title}
                        onChange={(e) => updateQuickAction(index, 'title', e.target.value)}
                        className="w-full border rounded px-3 py-1.5 text-sm mb-2"
                        placeholder="Button Title"
                      />
                      <input
                        type="text"
                        value={action.subtitle}
                        onChange={(e) => updateQuickAction(index, 'subtitle', e.target.value)}
                        className="w-full border rounded px-3 py-1.5 text-sm"
                        placeholder="Subtitle"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* College Rankings */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">College Rankings Table</h2>
                    <input
                      type="text"
                      value={settings.college_rankings_title}
                      onChange={(e) => handleChange('college_rankings_title', e.target.value)}
                      className="text-sm text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-purple-500 outline-none mt-1"
                      placeholder="Section title..."
                    />
                  </div>
                  {/* Search and Add College */}
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={collegeSearchQuery}
                          onChange={(e) => {
                            setCollegeSearchQuery(e.target.value);
                            searchColleges(e.target.value);
                          }}
                          onFocus={() => collegeSearchResults.length > 0 && setShowCollegeDropdown(true)}
                          className="w-64 border rounded px-3 py-1.5 text-sm"
                          placeholder="Search college by name..."
                        />
                        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        {/* Dropdown */}
                        {showCollegeDropdown && collegeSearchResults.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {collegeSearchResults.map((college, idx) => (
                              <div
                                key={idx}
                                onClick={() => addCollegeFromSearch(college)}
                                className="px-3 py-2 hover:bg-purple-50 cursor-pointer border-b last:border-b-0"
                              >
                                <div className="font-medium text-sm">{college.name}</div>
                                <div className="text-xs text-gray-500">{college.location?.city || college.type || ''}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Years */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Year Options</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={yearInput}
                      onChange={(e) => setYearInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRankingYear())}
                      className="w-24 border rounded px-3 py-1.5 text-sm"
                      placeholder="2025"
                    />
                    <Button variant="outline" size="sm" onClick={addRankingYear}>Add Year</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(settings.college_rankings_years || []).map((year, idx) => (
                      <span key={idx} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {year}
                        <button onClick={() => removeRankingYear(year)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rankings Data */}
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {(settings.college_rankings_data || []).map((college, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg flex gap-2 items-center">
                      <input
                        type="number"
                        value={college.rank}
                        onChange={(e) => updateRankingCollege(index, 'rank', parseInt(e.target.value) || 1)}
                        className="w-14 border rounded px-2 py-1 text-sm text-center"
                        placeholder="#"
                      />
                      <input
                        type="text"
                        value={college.name}
                        onChange={(e) => updateRankingCollege(index, 'name', e.target.value)}
                        className="flex-1 border rounded px-2 py-1 text-sm"
                        placeholder="College Name"
                      />
                      <input
                        type="text"
                        value={college.location}
                        onChange={(e) => updateRankingCollege(index, 'location', e.target.value)}
                        className="w-24 border rounded px-2 py-1 text-sm"
                        placeholder="Location"
                      />
                      <input
                        type="number"
                        value={college.rating}
                        onChange={(e) => updateRankingCollege(index, 'rating', parseFloat(e.target.value) || 0)}
                        className="w-16 border rounded px-2 py-1 text-sm"
                        placeholder="Rating"
                        step="0.1"
                      />
                      <input
                        type="text"
                        value={college.fees}
                        onChange={(e) => updateRankingCollege(index, 'fees', e.target.value)}
                        className="w-16 border rounded px-2 py-1 text-sm"
                        placeholder="Fees"
                      />
                      <select
                        value={college.type}
                        onChange={(e) => updateRankingCollege(index, 'type', e.target.value)}
                        className="w-28 border rounded px-2 py-1 text-sm"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Medical">Medical</option>
                        <option value="Management">Management</option>
                        <option value="Law">Law</option>
                        <option value="Arts">Arts</option>
                        <option value="Science">Science</option>
                      </select>
                      <button onClick={() => removeRankingCollege(index)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Schools */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">Top Schools</h2>
                    <input
                      type="text"
                      value={settings.top_schools_title}
                      onChange={(e) => handleChange('top_schools_title', e.target.value)}
                      className="text-sm text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-purple-500 outline-none mt-1"
                      placeholder="Section title..."
                    />
                  </div>
                  {/* Search and Add School */}
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={schoolSearchQuery}
                          onChange={(e) => {
                            setSchoolSearchQuery(e.target.value);
                            searchSchools(e.target.value);
                          }}
                          onFocus={() => schoolSearchResults.length > 0 && setShowSchoolDropdown(true)}
                          className="w-64 border rounded px-3 py-1.5 text-sm"
                          placeholder="Search school by name..."
                        />
                        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        {/* Dropdown */}
                        {showSchoolDropdown && schoolSearchResults.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {schoolSearchResults.map((school, idx) => (
                              <div
                                key={idx}
                                onClick={() => addSchoolFromSearch(school)}
                                className="px-3 py-2 hover:bg-purple-50 cursor-pointer border-b last:border-b-0"
                              >
                                <div className="font-medium text-sm">{school.name}</div>
                                <div className="text-xs text-gray-500">{school.board || ''} {school.location?.city || ''}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {settings.top_schools?.map((school, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg flex gap-2 items-center">
                      <input
                        type="text"
                        value={school.name}
                        onChange={(e) => updateTopSchool(index, 'name', e.target.value)}
                        className="flex-1 border rounded px-2 py-1 text-sm"
                        placeholder="School Name"
                      />
                      <input
                        type="text"
                        value={school.location}
                        onChange={(e) => updateTopSchool(index, 'location', e.target.value)}
                        className="w-28 border rounded px-2 py-1 text-sm"
                        placeholder="Location"
                      />
                      <select
                        value={school.board}
                        onChange={(e) => updateTopSchool(index, 'board', e.target.value)}
                        className="w-20 border rounded px-2 py-1 text-sm"
                      >
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="IB">IB</option>
                        <option value="State">State</option>
                      </select>
                      <input
                        type="text"
                        value={school.fees}
                        onChange={(e) => updateTopSchool(index, 'fees', e.target.value)}
                        className="w-16 border rounded px-2 py-1 text-sm"
                        placeholder="Fees"
                      />
                      <button onClick={() => removeTopSchool(index)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">Cities</h2>
                    <input
                      type="text"
                      value={settings.cities_title}
                      onChange={(e) => handleChange('cities_title', e.target.value)}
                      className="text-sm text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-purple-500 outline-none mt-1"
                      placeholder="Section title..."
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={addCity}>
                    <FiPlus className="mr-1" /> Add City
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {settings.cities?.map((city, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={city.name}
                          onChange={(e) => updateCity(index, 'name', e.target.value)}
                          className="flex-1 border rounded px-3 py-1.5 text-sm"
                          placeholder="City Name"
                        />
                        <button onClick={() => removeCity(index)} className="text-red-500 hover:text-red-700">
                          <FiTrash2 />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={city.image}
                        onChange={(e) => updateCity(index, 'image', e.target.value)}
                        className="w-full border rounded px-3 py-1.5 text-sm mt-2"
                        placeholder="Image URL"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Auto Generate Toggle */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.auto_generate_seo}
                    onChange={(e) => handleChange('auto_generate_seo', e.target.checked)}
                    className="w-5 h-5 rounded border-purple-300 text-purple-600"
                  />
                  <div>
                    <span className="font-semibold text-purple-900">Auto-Generate SEO</span>
                    <p className="text-sm text-purple-700">Automatically generate SEO fields based on hero content</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meta Title</label>
                <input
                  type="text"
                  value={settings.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  disabled={settings.auto_generate_seo}
                />
                <p className="text-xs text-gray-500 mt-1">{settings.meta_title?.length || 0}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={settings.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5"
                  rows="3"
                  disabled={settings.auto_generate_seo}
                />
                <p className="text-xs text-gray-500 mt-1">{settings.meta_description?.length || 0}/160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meta Keywords</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    className="flex-1 border rounded-lg px-4 py-2"
                    placeholder="Add keyword and press Enter"
                  />
                  <Button variant="outline" onClick={addKeyword}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.meta_keywords?.map((keyword, index) => (
                    <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {keyword}
                      <button onClick={() => removeKeyword(keyword)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Canonical URL</label>
                  <input
                    type="text"
                    value={settings.canonical_url || ''}
                    onChange={(e) => handleChange('canonical_url', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="https://admissionbuddy.co/"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">OG Image URL</label>
                  <input
                    type="text"
                    value={settings.og_image || ''}
                    onChange={(e) => handleChange('og_image', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default HomepageSettings;
