import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiUser, FiChevronDown, FiChevronUp, FiChevronRight, FiDownload, FiCheckCircle, FiPhone, FiMail, FiGlobe, FiExternalLink, FiHome, FiInfo, FiBook, FiFileText, FiBarChart2, FiBriefcase, FiAward, FiDollarSign, FiGrid, FiMessageSquare, FiBookmark, FiLayers, FiUsers, FiCalendar, FiMapPin as FiLocation, FiImage, FiHelpCircle, FiWifi, FiCoffee, FiActivity, FiShield, FiTruck, FiDroplet, FiSun, FiMonitor, FiHeadphones, FiPackage, FiHeart, FiCpu, FiSettings, FiZap } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineClipboardList, HiOutlineTrendingUp, HiOutlineUserGroup, HiOutlineLibrary, HiOutlineSparkles } from 'react-icons/hi';
import { MdOutlineSportsBasketball, MdOutlinePool, MdOutlineFitnessCenter, MdOutlineLocalHospital, MdOutlineRestaurant, MdOutlineLocalParking, MdOutlineAtm, MdOutlineTheaters, MdOutlinePark, MdOutlineAir, MdOutlineBed, MdOutlineScience, MdOutlineComputer, MdOutlineWifi, MdOutlineLocalLaundryService, MdOutlineSecurity, MdOutlineLocalCafe } from 'react-icons/md';
import api from '../api/axios';
import { useYear } from '../hooks/useYear';
import { Button } from '../components/ui/button';
import AdBanner from '../components/AdBanner';
import ApplyNowModal from '../components/ApplyNowModal';
import AdmissionBookingModal from '../components/AdmissionBookingModal';
import AdmissionPartnerBadge from '../components/AdmissionPartnerBadge';
import GuestGate, { useGuestGate, LoginPromptModal } from '../components/GuestGate';
import { getInstitutionDetailUrl } from '../utils/urlHelpers';
import { SidebarSponsoredAd } from '../components/SponsoredAds';
import { useCollegeContext } from '../contexts/CollegeContext';
import ReviewsSection from '../components/ReviewsSection';
import QuestionsSection from '../components/QuestionsSection';
import CommentsSection from '../components/CommentsSection';
import AuthorInfo from '../components/AuthorInfo';

import { Link } from '../components/CustomLink';

// Helper function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = null;
  
  // youtu.be/VIDEO_ID format
  const shortUrlMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortUrlMatch) {
    videoId = shortUrlMatch[1];
  }
  
  // youtube.com/watch?v=VIDEO_ID format
  const watchUrlMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchUrlMatch) {
    videoId = watchUrlMatch[1];
  }
  
  // youtube.com/v/VIDEO_ID format
  const vUrlMatch = url.match(/youtube\.com\/v\/([a-zA-Z0-9_-]+)/);
  if (vUrlMatch) {
    videoId = vUrlMatch[1];
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Return original URL if not a YouTube URL (might be Vimeo or other)
  return url;
};

// Facility icon mapping for icon-based display
const facilityIconMap = {
  // Library & Academic
  'library': { icon: HiOutlineLibrary, color: 'bg-blue-500', label: 'Library' },
  'digital library': { icon: MdOutlineComputer, color: 'bg-blue-600', label: 'Digital Library' },
  'research labs': { icon: MdOutlineScience, color: 'bg-purple-500', label: 'Research Labs' },
  'computer lab': { icon: MdOutlineComputer, color: 'bg-indigo-500', label: 'Computer Lab' },
  'incubation center': { icon: FiCpu, color: 'bg-violet-500', label: 'Incubation Center' },
  
  // Sports & Fitness
  'sports': { icon: MdOutlineSportsBasketball, color: 'bg-orange-500', label: 'Sports' },
  'sports complex': { icon: MdOutlineSportsBasketball, color: 'bg-orange-500', label: 'Sports Complex' },
  'swimming pool': { icon: MdOutlinePool, color: 'bg-cyan-500', label: 'Swimming Pool' },
  'gymnasium': { icon: MdOutlineFitnessCenter, color: 'bg-red-500', label: 'Gymnasium' },
  'gym': { icon: MdOutlineFitnessCenter, color: 'bg-red-500', label: 'Gym' },
  'playground': { icon: MdOutlinePark, color: 'bg-green-500', label: 'Playground' },
  
  // Accommodation
  'hostel': { icon: MdOutlineBed, color: 'bg-teal-500', label: 'Hostel' },
  'hostels': { icon: MdOutlineBed, color: 'bg-teal-500', label: 'Hostels' },
  'boys hostel': { icon: MdOutlineBed, color: 'bg-blue-500', label: 'Boys Hostel' },
  'girls hostel': { icon: MdOutlineBed, color: 'bg-pink-500', label: 'Girls Hostel' },
  
  // Food & Dining
  'cafeteria': { icon: MdOutlineLocalCafe, color: 'bg-amber-500', label: 'Cafeteria' },
  'canteen': { icon: MdOutlineRestaurant, color: 'bg-amber-600', label: 'Canteen' },
  'mess': { icon: MdOutlineRestaurant, color: 'bg-yellow-600', label: 'Mess' },
  'food court': { icon: MdOutlineRestaurant, color: 'bg-orange-400', label: 'Food Court' },
  
  // Healthcare
  'hospital': { icon: MdOutlineLocalHospital, color: 'bg-red-600', label: 'Hospital' },
  'medical': { icon: MdOutlineLocalHospital, color: 'bg-red-500', label: 'Medical Facility' },
  'health center': { icon: FiHeart, color: 'bg-rose-500', label: 'Health Center' },
  
  // Technology & IT
  'wifi': { icon: MdOutlineWifi, color: 'bg-blue-400', label: 'WiFi Campus' },
  'wi-fi': { icon: MdOutlineWifi, color: 'bg-blue-400', label: 'WiFi Campus' },
  'it infrastructure': { icon: FiMonitor, color: 'bg-slate-600', label: 'IT Infrastructure' },
  'smart classrooms': { icon: FiMonitor, color: 'bg-indigo-600', label: 'Smart Classrooms' },
  
  // Services
  'laundry': { icon: MdOutlineLocalLaundryService, color: 'bg-cyan-600', label: 'Laundry' },
  'parking': { icon: MdOutlineLocalParking, color: 'bg-gray-600', label: 'Parking' },
  'atm': { icon: MdOutlineAtm, color: 'bg-green-600', label: 'ATM' },
  'bank': { icon: MdOutlineAtm, color: 'bg-emerald-600', label: 'Bank' },
  'transport': { icon: FiTruck, color: 'bg-slate-500', label: 'Transport' },
  'bus service': { icon: FiTruck, color: 'bg-slate-500', label: 'Bus Service' },
  
  // Recreation & Culture
  'auditorium': { icon: MdOutlineTheaters, color: 'bg-purple-600', label: 'Auditorium' },
  'theater': { icon: MdOutlineTheaters, color: 'bg-purple-500', label: 'Theater' },
  'cultural center': { icon: HiOutlineSparkles, color: 'bg-pink-600', label: 'Cultural Center' },
  
  // Safety & Security
  'security': { icon: MdOutlineSecurity, color: 'bg-gray-700', label: '24/7 Security' },
  '24x7 security': { icon: MdOutlineSecurity, color: 'bg-gray-700', label: '24/7 Security' },
  'cctv': { icon: FiShield, color: 'bg-slate-700', label: 'CCTV Surveillance' },
  
  // Environment
  'air conditioning': { icon: MdOutlineAir, color: 'bg-sky-500', label: 'Air Conditioning' },
  'ac': { icon: MdOutlineAir, color: 'bg-sky-500', label: 'Air Conditioning' },
  'solar power': { icon: FiSun, color: 'bg-yellow-500', label: 'Solar Power' },
  'green campus': { icon: MdOutlinePark, color: 'bg-green-600', label: 'Green Campus' },
  
  // Default
  'default': { icon: FiPackage, color: 'bg-gray-500', label: 'Facility' }
};

// Helper function to get facility icon and color
const getFacilityIcon = (facilityName) => {
  const name = facilityName?.toLowerCase().trim() || '';
  
  // Check for exact match first
  if (facilityIconMap[name]) {
    return facilityIconMap[name];
  }
  
  // Check for partial matches
  for (const key of Object.keys(facilityIconMap)) {
    if (name.includes(key) || key.includes(name)) {
      return facilityIconMap[key];
    }
  }
  
  return { ...facilityIconMap['default'], label: facilityName };
};

// Icon mapping for professional icons
const iconMap = {
  'info': <FiInfo size={16} />,
  'courses': <FiBook size={16} />,
  'admission': <FiFileText size={16} />,
  'cutoff': <FiBarChart2 size={16} />,
  'placement': <FiBriefcase size={16} />,
  'ranking': <FiAward size={16} />,
  'scholarship': <HiOutlineCurrencyRupee size={16} />,
  'facilities': <HiOutlineOfficeBuilding size={16} />,
  'reviews': <FiMessageSquare size={16} />,
  'overview': <FiHome size={16} />,
  'programs': <HiOutlineAcademicCap size={16} />,
  'fees': <FiDollarSign size={16} />,
  'campus': <HiOutlineLibrary size={16} />,
  'gallery': <FiImage size={16} />,
  'faculty': <FiUsers size={16} />,
  'events': <FiCalendar size={16} />,
  'location': <FiMapPin size={16} />,
  'faq': <FiHelpCircle size={16} />,
  'default': <FiBookmark size={16} />,
};

// Helper function to get icon component
const getMenuIcon = (iconId, emojiIcon) => {
  if (iconMap[iconId]) return iconMap[iconId];
  // If no mapping found, return a default icon
  return iconMap['default'];
};

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

const CollegeDetailPage = ({ overrideId, institutionType = 'College' }) => {
  const { id: paramId } = useParams();
  // Use overrideId if provided (from InstitutionDetailPage), otherwise use URL param
  const id = overrideId || paramId;
  // Determine API endpoint based on institution type
  const apiEndpoint = institutionType === 'School' ? '/schools' : '/colleges';
  const { year } = useYear(); // Get current year from settings
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [likes, setLikes] = useState(1);
  const [dislikes, setDislikes] = useState(1);
  const [userVote, setUserVote] = useState(null); // 'like', 'dislike', or null
  const [isFavorited, setIsFavorited] = useState(false); // Track if college is favorited
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [similarColleges, setSimilarColleges] = useState([]); // Auto-populated similar colleges
  
  // Guest gate hook for action restrictions
  const { isLoggedIn, requireAuth, showPrompt, closePrompt } = useGuestGate();
  
  // Use college context to share data with AutoApplyPopup
  const { setCollegeData, clearCollegeData } = useCollegeContext();

  useEffect(() => {
    if (id) {
      fetchCollegeDetails();
    }
    // Clear college data when leaving the page
    return () => {
      clearCollegeData();
    };
  }, [id]);

  // Check if user has liked/favorited this college
  useEffect(() => {
    const checkUserStatus = async () => {
      // Set like/dislike counts from college data
      if (college) {
        if (college.likes_count !== undefined) {
          setLikes(college.likes_count);
        }
        if (college.dislikes_count !== undefined) {
          setDislikes(college.dislikes_count);
        }
      }
      
      const token = localStorage.getItem('token');
      if (!token || !college) return;
      
      try {
        // Check liked status - backend returns entity_id not college_id
        const likedResponse = await api.get('/user/liked', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const likedColleges = likedResponse.data || [];
        const hasLiked = likedColleges.some(l => l.entity_id === college.id);
        if (hasLiked) {
          setUserVote('like');
        } else {
          setUserVote(null);
        }
        
        // Check favorited status - backend returns college_id
        const favResponse = await api.get('/user/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const favData = favResponse.data;
        // Handle both array format and object format with favorites key
        const favorites = Array.isArray(favData) ? favData : (favData?.favorites || []);
        const hasFavorited = favorites.some(f => f.college_id === college.id);
        setIsFavorited(hasFavorited);
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    };
    
    if (college) {
      checkUserStatus();
    }
  }, [college]);

  const fetchCollegeDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${apiEndpoint}/${id}`);
      setCollege(response.data);
      // Set college data in context for AutoApplyPopup to use
      setCollegeData(response.data);
    } catch (error) {
      console.error('Error fetching college details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use similar colleges from the main college API response (already included by backend)
  useEffect(() => {
    if (college?.similar_colleges && college.similar_colleges.length > 0) {
      setSimilarColleges(college.similar_colleges);
    } else {
      setSimilarColleges([]);
    }
  }, [college]);

  // Generate SEO-friendly URL for menu sections
  // Format: /colleges/012-aiims-delhi/admissions
  const getSectionUrl = useMemo(() => {
    if (!college) return (sectionId) => `#${sectionId}`;
    
    const baseUrl = getInstitutionDetailUrl(
      college.institution_type || 'college',
      college.id,
      college.name,
      college.location?.city,
      college.serial_number
    );
    
    return (sectionId) => `${baseUrl}/${sectionId}`;
  }, [college]);

  // Default menu items with professional icons
  const defaultMenuItems = [
    { id: 'info', label: 'Info', enabled: true, order: 0 },
    { id: 'courses', label: 'Courses & Fees', enabled: true, order: 1 },
    { id: 'gallery', label: 'Gallery', enabled: true, order: 2 },
    { id: 'reviews', label: 'Reviews', enabled: true, order: 3 },
    { id: 'admission', label: 'Admissions', enabled: true, order: 4 },
    { id: 'cutoff', label: 'Cutoff', enabled: true, order: 5 },
    { id: 'placement', label: 'Placement', enabled: true, order: 6 },
    { id: 'ranking', label: 'Ranking', enabled: true, order: 7 },
    { id: 'scholarship', label: 'Scholarship', enabled: true, order: 8 },
    { id: 'facilities', label: 'Facilities', enabled: true, order: 9 },
  ];

  // Dynamic menu items based on college configuration
  const getMenuItems = () => {
    const menuConfig = college?.menu_config;
    
    // If menu_config has items, use those (filter by enabled)
    if (menuConfig?.items?.length > 0) {
      return menuConfig.items
        .filter(item => item.enabled)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    
    // If auto from TOC is enabled and Detail Page TOC exists (legacy support)
    if (menuConfig?.auto_from_toc && college?.detail_page_toc?.length > 0) {
      return college.detail_page_toc.map((item, index) => ({
        id: item.anchor || `toc-${index}`,
        label: item.title,
        icon: item.icon || 'default',
        enabled: true,
        order: index + 1
      }));
    }
    
    // Default menu (all enabled)
    return defaultMenuItems;
  };

  const menuItems = getMenuItems();
  
  // Helper function to check if a menu section is enabled
  const isMenuEnabled = (menuId) => {
    const menuConfig = college?.menu_config;
    if (!menuConfig?.items || menuConfig.items.length === 0) {
      return true; // Default: all enabled if no config
    }
    const menuItem = menuConfig.items.find(item => item.id === menuId);
    return menuItem ? menuItem.enabled : true;
  };

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 160;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleLike = async () => {
    // Check if user is logged in
    if (!requireAuth('like this institution')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (userVote === 'like') {
        // Remove like - call API to unlike
        await api.delete(`/user/like/college/${college.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikes(likes - 1);
        setUserVote(null);
      } else {
        // Add like - call API to like
        await api.post(`/user/like/college/${college.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userVote === 'dislike') {
          setDislikes(dislikes - 1);
        }
        setLikes(likes + 1);
        setUserVote('like');
      }
    } catch (error) {
      console.error('Error liking college:', error);
    }
  };

  const handleDislike = async () => {
    // Check if user is logged in
    if (!requireAuth('dislike this institution')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (userVote === 'dislike') {
        // Remove dislike
        setDislikes(dislikes - 1);
        setUserVote(null);
      } else {
        // Add dislike
        if (userVote === 'like') {
          // Remove the like first
          await api.delete(`/user/like/college/${college.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setLikes(likes - 1);
        }
        setDislikes(dislikes + 1);
        setUserVote('dislike');
      }
    } catch (error) {
      console.error('Error disliking college:', error);
    }
  };

  const handleWriteReview = () => {
    // Check if user is logged in
    if (!requireAuth('write a review')) return;
    
    // Navigate to review form with new URL format
    // Format: /write-review?type=school&serial=017&slug=delhi-public-school
    const instType = (college.institution_type || 'college').toLowerCase();
    const serial = college.serial_number || '';
    const slug = college.slug || college.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
    
    window.location.href = `/write-review?type=${instType}&serial=${serial}&slug=${slug}`;
  };

  const [questionText, setQuestionText] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const handleAskQuestion = async () => {
    // Check if user is logged in
    if (!requireAuth('ask a question')) return;
    
    if (!questionText.trim()) {
      alert('Please enter your question');
      return;
    }
    
    setSubmittingQuestion(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/questions', {
        college_id: college.id,
        question: questionText.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setQuestionText('');
      setQuestionSubmitted(true);
      setTimeout(() => setQuestionSubmitted(false), 5000);
      
      // Refresh the page to show new question
      window.location.reload();
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Failed to submit question. Please try again.');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleReply = () => {
    // Check if user is logged in
    if (!requireAuth('reply to questions')) return;
    // TODO: Reply functionality
    alert('Reply functionality coming soon!');
  };

  const handleFavorite = async () => {
    // Check if user is logged in
    if (!requireAuth('add to favorites')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (isFavorited) {
        // Remove from favorites
        await api.delete(`/user/favorites/${college.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorited(false);
      } else {
        // Add to favorites
        await api.post(`/user/favorites/${college.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleQALike = () => {
    // Check if user is logged in
    if (!requireAuth('like this answer')) return;
    // TODO: Like answer functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">College Not Found</h2>
          <Link to="/colleges" className="text-blue-600 hover:underline">Back to Colleges</Link>
        </div>
      </div>
    );
  }

  // ⚠️ IMPORTANT: Table of Contents is NEVER auto-generated
  // TOC only shows items manually created in SEO Content → Visual Block Editor (seo_toc)
  // DO NOT add auto-generated items like Fees, Ranking, Placement, etc.

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      {/* Top Ad Banner */}
      <AdBanner pageName="college-detail" position="top" />

      {/* BREADCRUMB */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <FiChevronRight className="mx-2" size={14} />
            <Link to="/colleges" className="hover:text-orange-600">Colleges</Link>
            <FiChevronRight className="mx-2" size={14} />
            <span className="text-gray-900">{college.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Banner */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-40 md:h-56 lg:h-64 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
          {college.banner_url ? (
            <img 
              src={college.banner_url} 
              alt={college.banner_alt || `${college.name} Banner`}
              className="w-full h-full object-cover opacity-90"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
            </div>
          )}
        </div>
        
        {/* College Info Card - Overlapping Banner */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative -mt-20 md:-mt-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Logo */}
              <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white rounded-xl shadow-lg border-2 border-gray-100 flex items-center justify-center flex-shrink-0 -mt-10 md:-mt-14 lg:-mt-16 overflow-hidden">
                {(college.logo_url || college.images?.[0]) ? (
                  <img loading="lazy" src={college.logo_url || college.images[0]} alt={college.logo_alt || college.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">{college.name?.charAt(0)}</span>
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-3">
                  {college.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                      <FiCheckCircle size={12} /> Verified
                    </span>
                  )}
                  {college.is_admission_partner && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                      🎓 Admission Partner
                    </span>
                  )}
                  {college.is_admission_open && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                      📢 Admission Open
                    </span>
                  )}
                  {college.is_no_cost_emi && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                      💳 No Cost EMI
                    </span>
                  )}
                  {college.is_featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                      ⭐ Featured
                    </span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    {college.type || college.institution_type || 'College'}
                  </span>
                  {college.accreditations?.length > 0 && (
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
                      {college.accreditations[0]}
                    </span>
                  )}
                  {college.nirf_ranking && (
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-200">
                      NIRF #{college.nirf_ranking}
                    </span>
                  )}
                </div>
                
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">{college.name}</h1>
                
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-gray-500 text-sm mb-3">
                  <span className="flex items-center gap-1">
                    <FiMapPin size={14} className="text-gray-400" />
                    {college.location?.city || college.city}, {college.location?.state || college.state}
                  </span>
                  {(college.established_year || college.established) && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span>Est. {college.established_year || college.established}</span>
                    </>
                  )}
                </div>

                {/* Recognized by & Affiliated to */}
                {(college.recognized_by?.length > 0 || college.affiliated_to) && (
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 p-2.5 bg-gray-50 rounded-lg">
                    {college.recognized_by?.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Recognized:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {college.recognized_by.map((org, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white text-blue-600 text-xs font-medium rounded border border-blue-100">{org}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {college.affiliated_to && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Affiliated:</span>
                        {Array.isArray(college.affiliated_to) ? (
                          college.affiliated_to.map((aff, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white text-orange-600 text-xs font-medium rounded border border-orange-100">{aff}</span>
                          ))
                        ) : (
                          <span className="px-2 py-0.5 bg-white text-orange-600 text-xs font-medium rounded border border-orange-100">{college.affiliated_to}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* School-Specific Info - Board, Medium, Classes, Streams */}
                {college.institution_type === 'School' && (college.board || college.medium || college.classes_offered?.length > 0 || college.streams_offered?.length > 0) && (
                  <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-blue-50 rounded-lg">
                    {college.board && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">Board:</span>
                        <span className="px-2 py-0.5 bg-white text-blue-700 text-xs font-medium rounded border border-blue-200">{college.board}</span>
                      </div>
                    )}
                    {college.medium && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">Medium:</span>
                        <span className="px-2 py-0.5 bg-white text-green-700 text-xs font-medium rounded border border-green-200">{college.medium}</span>
                      </div>
                    )}
                    {college.classes_offered?.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">Classes:</span>
                        <span className="px-2 py-0.5 bg-white text-purple-700 text-xs font-medium rounded border border-purple-200">
                          {college.classes_offered[0]} to {college.classes_offered[college.classes_offered.length - 1]}
                        </span>
                      </div>
                    )}
                    {college.streams_offered?.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">Streams:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {college.streams_offered.map((stream, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white text-orange-700 text-xs font-medium rounded border border-orange-200">{stream}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Rating - Only show if there are actual user reviews */}
                {(college.reviews_count > 0 || college.total_reviews > 0) && college.average_rating > 0 && (
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`${i < Math.floor(college.average_rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            size={18}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-lg text-gray-900">{college.average_rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">({college.reviews_count || college.total_reviews || 0} Reviews)</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => setShowApplyModal(true)}
                  >
                    <FiCheckCircle className="mr-2" size={16} />
                    Apply Now
                  </Button>
                  {college.brochure_url && (
                    <a 
                      href={college.brochure_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      download
                    >
                      <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                        <FiDownload className="mr-2" size={16} />
                        Download Brochure
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Like/Dislike/Favorite Buttons */}
              <div className="flex lg:flex-col items-center gap-2">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    userVote === 'like' 
                      ? 'bg-green-50 border-green-500 text-green-700' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <span className="text-xl">👍</span>
                  <span className="text-sm font-semibold">{Math.max(1, likes)}</span>
                </button>
                <button 
                  onClick={handleDislike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    userVote === 'dislike' 
                      ? 'bg-red-50 border-red-500 text-red-700' 
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <span className="text-xl">👎</span>
                  <span className="text-sm font-semibold">{Math.max(0, dislikes)}</span>
                </button>
                <button 
                  onClick={handleFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    isFavorited 
                      ? 'bg-pink-50 border-pink-500 text-pink-700' 
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                  title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <FiHeart className={isFavorited ? "fill-pink-500 text-pink-500" : "text-pink-500"} size={18} />
                  <span className="text-sm font-semibold">{isFavorited ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AUTHOR INFO */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <AuthorInfo
            name={college?.updated_by_name || college?.created_by_name || 'Content Team'}
            photo={college?.updated_by_photo || college?.created_by_photo}
            role="Content Writer"
            updatedAt={college?.updated_at}
            createdAt={college?.created_at}
            showLink={true}
            size="md"
            variant="light"
          />
        </div>
      </div>

      {/* STICKY NAVIGATION MENU */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={getSectionUrl(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === item.id
                    ? 'border-orange-600 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                <span className={activeTab === item.id ? 'text-orange-600' : 'text-gray-500'}>{getMenuIcon(item.id)}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* LATEST UPDATES AND NEWS - Below Menu */}
      {((college?.updates && college.updates.length > 0) || (college?.announcements && college.announcements.length > 0)) && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{college.name} Latest Updates and News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(college.updates?.length > 0 ? college.updates : college.announcements).slice(0, 2).map((item, idx) => (
                <div key={idx} className={`${idx === 0 ? 'bg-blue-50 border-l-4 border-blue-600' : 'bg-green-50 border-l-4 border-green-600'} p-3 rounded`}>
                  <div className="flex items-start gap-2">
                    <span className={`text-[10px] font-bold ${idx === 0 ? 'text-blue-600 bg-blue-200' : 'text-green-600 bg-green-200'} px-2 py-0.5 rounded flex-shrink-0`}>
                      {item.date ? new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    </span>
                    <p className="text-xs text-gray-800">
                      <strong>{item.title}</strong> {item.content || item.description || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6 overflow-hidden">
        {/* Sponsor Ad - Content Top */}
        <AdBanner pageName="college-detail" position="content-top" />
        
        <div className="flex gap-6">
          {/* LEFT CONTENT */}
          <div className="flex-1 min-w-0">
            {/* SEO CONTENT SECTION (Collapsible) - 100% DYNAMIC */}
            <div className="mb-6 pb-6 border-b">
              {/* SEO INTRO PREVIEW */}
              <div className="mb-3">
                {college.seo_intro ? (
                  <div 
                    className={`text-gray-800 leading-relaxed prose max-w-none break-words ${!showContent ? 'line-clamp-3' : ''}`}
                    dangerouslySetInnerHTML={{ __html: college.seo_intro }}
                  />
                ) : (
                  <p className={`text-gray-800 leading-relaxed ${!showContent ? 'line-clamp-3' : ''}`}>
                    {college.name} is a {college.type || college.institution_type || 'institution'}
                    {(college.established_year || college.established) && <> established in {college.established_year || college.established}</>}.
                    {college.location?.city && college.location?.state && <> Located in {college.location.city}, {college.location.state}.</>}
                  </p>
                )}
              </div>

              {/* READ MORE BUTTON - Show when collapsed and there's SEO content */}
              {!showContent && (college.seo_full_content || college.seo_toc?.length > 0 || college.seo_images?.length > 0 || college.seo_tables?.length > 0) && (
                <div className="text-center mb-4">
                  <button
                    onClick={() => setShowContent(true)}
                    className="inline-flex items-center gap-2 px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium rounded-full"
                  >
                    <span>Read More</span>
                    <FiChevronDown size={18} />
                  </button>
                </div>
              )}

              {/* SEO EXPANDABLE CONTENT - ONLY SEO Content (NOT Menu Tab Content) */}
              {showContent && (
                <div className="space-y-8">
                  
                  {/* TABLE OF CONTENTS - Only from SEO Content (Visual Block Editor) */}
                  {college.seo_toc?.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 border">
                      <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                        {college.seo_toc.map((section, idx) => {
                          const anchorId = section.anchor || `seo-section-${idx}`;
                          return (
                            <a
                              key={`seo-${idx}`}
                              href={`#${anchorId}`}
                              onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById(anchorId);
                                if (element) {
                                  const offset = 160;
                                  const elementPosition = element.getBoundingClientRect().top;
                                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                                  window.history.pushState(null, '', `#${anchorId}`);
                                }
                              }}
                              className="text-left text-sm text-orange-600 hover:underline flex gap-2"
                            >
                              <span className="font-semibold flex-shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                              <span>{section.title}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* SEO FULL CONTENT - If exists in database */}
                  {college.seo_full_content && (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: college.seo_full_content }} />
                  )}

                  {/* SEO TOC SECTIONS (Visual Block Editor Content) */}
                  {college.seo_toc?.length > 0 && (
                    <div className="space-y-8">
                      {college.seo_toc.map((tocSection, sectionIdx) => (
                        <section key={sectionIdx} id={tocSection.anchor || `seo-section-${sectionIdx}`} className="scroll-mt-40">
                          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">{tocSection.title}</h2>
                          
                          {/* Render blocks */}
                          {tocSection.blocks?.map((block, blockIdx) => (
                            <div key={blockIdx} className="mb-4">
                              {/* Text Block */}
                              {block.type === 'text' && (
                                <div className="prose max-w-none">
                                  {block.heading && <h3 className="text-xl font-semibold mb-2">{block.heading}</h3>}
                                  <div dangerouslySetInnerHTML={{ __html: block.content || '' }} />
                                </div>
                              )}
                              
                              {/* Image Block */}
                              {block.type === 'image' && block.url && (
                                <figure style={{ width: block.width || '100%' }} className="mx-auto">
                                  <img loading="lazy" src={block.url} alt={block.alt || ''} title={block.title || ''} className="rounded-lg w-full" />
                                  {block.caption && <figcaption className="text-center text-sm text-gray-600 mt-2">{block.caption}</figcaption>}
                                </figure>
                              )}
                              
                              {/* Video Block */}
                              {block.type === 'video' && block.url && (
                                <div className="aspect-video rounded-lg overflow-hidden">
                                  <iframe
                                    src={block.url.includes('youtube.com/watch') 
                                      ? `https://www.youtube.com/embed/${block.url.split('v=')[1]?.split('&')[0]}`
                                      : block.url}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title={block.title || 'Video'}
                                  />
                                </div>
                              )}
                              
                              {/* Table Block */}
                              {block.type === 'table' && (
                                <div className="overflow-x-auto">
                                  {block.title && <h4 className="font-semibold mb-2">{block.title}</h4>}
                                  <table className="w-full border-collapse border">
                                    <thead>
                                      <tr className="bg-orange-50">
                                        {block.headers?.map((header, hi) => (
                                          <th key={hi} className="border px-4 py-3 text-left text-sm font-bold">{header}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {block.rows?.map((row, ri) => (
                                        <tr key={ri} className="hover:bg-gray-50">
                                          {row.map((cell, ci) => (
                                            <td key={ci} className="border px-4 py-3 text-sm">{cell}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                              
                              {/* Quick Facts Block */}
                              {block.type === 'facts' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  {block.title && <h4 className="font-bold text-blue-800 mb-3">{block.title}</h4>}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {block.items?.map((fact, fi) => (
                                      <div key={fi} className="flex justify-between gap-2">
                                        <span className="text-gray-600 text-sm">{fact.label}</span>
                                        <span className="font-semibold text-sm break-words text-right">{fact.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Key Stats Block */}
                              {block.type === 'stats' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                  {block.items?.map((stat, si) => (
                                    <div key={si} className={`rounded-lg p-3 sm:p-4 text-center ${
                                      stat.color === 'yellow' ? 'bg-yellow-100' :
                                      stat.color === 'green' ? 'bg-green-100' :
                                      stat.color === 'blue' ? 'bg-blue-100' :
                                      stat.color === 'pink' ? 'bg-pink-100' : 'bg-gray-100'
                                    }`}>
                                      <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                                      <div className="text-sm text-gray-600">{stat.label}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* List Block */}
                              {block.type === 'list' && (
                                <div>
                                  {block.title && <h4 className="font-semibold mb-2">{block.title}</h4>}
                                  {block.listType === 'numbered' ? (
                                    <ol className="list-decimal list-inside space-y-1">
                                      {block.items?.map((item, li) => <li key={li}>{item}</li>)}
                                    </ol>
                                  ) : (
                                    <ul className="list-disc list-inside space-y-1">
                                      {block.items?.map((item, li) => <li key={li}>{item}</li>)}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </section>
                      ))}
                    </div>
                  )}

                  {/* VIDEO - Only show if video URL exists */}
                  {(college?.campus_video_url || college?.seo_video_url || college?.videos?.[0]) && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-3">{college.campus_video_title || college.seo_video_title || `${college.name} Video`}</h3>
                      {(college.campus_video_description || college.seo_video_description) && (
                        <p className="text-gray-600 text-sm mb-3">{college.campus_video_description || college.seo_video_description}</p>
                      )}
                      <div className="rounded-lg aspect-video overflow-hidden border">
                        <iframe
                          src={getYouTubeEmbedUrl(college.campus_video_url || college.seo_video_url || college.videos?.[0])}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={college.campus_video_title || college.seo_video_title || `${college.name} Video`}
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* SEO IMAGES - Only show if exists */}
                  {college.seo_images?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {college.seo_images.map((img, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden border">
                          <img loading="lazy" src={typeof img === 'string' ? img : img.url} alt={typeof img === 'object' ? img.alt : `${college.name} Image ${idx + 1}`} className="w-full h-48 object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SEO TABLES - Only show if exists */}
                  {college.seo_tables?.length > 0 && college.seo_tables.map((table, idx) => (
                    <div key={idx} className="overflow-x-auto">
                      {table.title && <h3 className="text-lg font-bold mb-3">{table.title}</h3>}
                      <table className="w-full border-collapse border">
                        {table.headers && (
                          <thead>
                            <tr className="bg-orange-50">
                              {table.headers.map((header, hIdx) => (
                                <th key={hIdx} className="border px-4 py-3 text-left text-sm font-bold">{header}</th>
                              ))}
                            </tr>
                          </thead>
                        )}
                        <tbody>
                          {table.rows?.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-gray-50">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="border px-4 py-3 text-sm">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}

                  {/* SEO FAQs - Only in Read More if exists */}
                  {college.seo_faqs && college.seo_faqs.length > 0 && (
                    <section id="seo-faqs-content">
                      <h2 className="text-xl sm:text-2xl font-bold mb-3">Frequently Asked Questions</h2>
                      <div className="space-y-3">
                        {college.seo_faqs.map((faq, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4 border">
                            <p className="font-bold text-sm mb-2">Q. {faq.question}</p>
                            <p className="text-sm text-gray-700"><strong>Ans.</strong> {faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* READ LESS BUTTON - Show at the end when expanded */}
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setShowContent(false)}
                      className="inline-flex items-center gap-2 px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium rounded-full"
                    >
                      <span>Read Less</span>
                      <FiChevronUp size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ===== MENU TAB CONTENT SECTIONS (Always Visible - NOT in Read More) ===== */}
            <div className="space-y-8 mt-8">
              
              {/* DESCRIPTION & HIGHLIGHTS - Main Content Area (AFTER Read More) */}
              {(college.description || (college.highlights && college.highlights.length > 0)) && (
                <section id="about-description" className="scroll-mt-40">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 break-words">About {college.name}</h2>
                  
                  {/* Description */}
                  {college.description && (
                    <div className="text-gray-800 leading-relaxed prose max-w-none mb-4 break-words" 
                      dangerouslySetInnerHTML={{ 
                        __html: college.description
                          .replace(/&lt;/g, '<')
                          .replace(/&gt;/g, '>')
                          .replace(/&amp;/g, '&')
                          .replace(/&quot;/g, '"')
                      }} 
                    />
                  )}
                  
                  {/* Highlights */}
                  {college.highlights && college.highlights.length > 0 && (
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-5">
                      <h3 className="font-bold text-lg mb-3 text-orange-800 flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        Key Highlights
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {college.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-orange-500 mt-1">✓</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {/* QUICK FACTS & KEY STATISTICS - Main Content Area (AFTER Description & Highlights) */}
              {/* Render from description_tables (Quick Facts / Key Statistics tables from form) */}
              {college.description_tables?.length > 0 && (
                <section id="quick-facts-stats" className="scroll-mt-40 space-y-6">
                  {college.description_tables.map((table, tableIdx) => (
                    <div key={tableIdx}>
                      {/* Quick Facts Table */}
                      {table.title?.toLowerCase().includes('quick facts') && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-5">
                          <h3 className="font-bold text-base sm:text-lg mb-4 text-blue-800 flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">📋</span>
                            {table.title || `${college.name} Quick Facts`}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {table.rows?.map((row, ri) => (
                              <div key={ri} className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="text-xs text-gray-500 uppercase tracking-wide">{row[0]}</div>
                                <div className="font-bold text-gray-900 mt-1 break-words">{row[1]}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Key Statistics Table */}
                      {table.title?.toLowerCase().includes('key statistics') && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 sm:p-5">
                          <h3 className="font-bold text-base sm:text-lg mb-4 text-purple-800 flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">📈</span>
                            {table.title || `${college.name} Key Statistics`}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {table.rows?.map((row, ri) => (
                              <div key={ri} className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm border border-purple-100">
                                <div className="text-xl sm:text-2xl font-bold text-gray-900">{row[1]}</div>
                                <div className="text-sm text-gray-600 mt-1">{row[0]}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Other tables (not Quick Facts or Key Statistics) */}
                      {!table.title?.toLowerCase().includes('quick facts') && !table.title?.toLowerCase().includes('key statistics') && (
                        <div className="bg-white border rounded-lg overflow-hidden">
                          {table.title && <h3 className="font-bold text-lg p-4 bg-gray-50 border-b">{table.title}</h3>}
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-orange-50">
                                  {table.headers?.map((header, hi) => (
                                    <th key={hi} className="border-b px-4 py-3 text-left text-sm font-bold">{header}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {table.rows?.map((row, ri) => (
                                  <tr key={ri} className="hover:bg-gray-50">
                                    {row.map((cell, ci) => (
                                      <td key={ci} className="border-b px-4 py-3 text-sm">{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* ADMISSION DATES section removed - Now combined with ADMISSIONS section below */}

              {/* COURSES & FEES - Menu Tab Content */}
              {college?.courses && college.courses.length > 0 && (
                <section id="courses-fees" className="scroll-mt-40">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Courses & Fees {year}</h2>
                  <p className="text-gray-700 text-sm mb-4">Fee structure for various courses:</p>
                  <GuestGate title="Fee Details">
                    <div className="overflow-x-auto -mx-4 px-4 mb-6">
                      <table className="w-full border-collapse border min-w-[400px]">
                        <thead>
                          <tr className="bg-orange-50">
                            <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Course</th>
                            <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Duration</th>
                            <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">1st Year</th>
                            <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {college.courses.map((course, idx) => {
                            const courseName = typeof course === 'string' ? course : course.name;
                            const duration = typeof course === 'object' ? (course.duration || course.course_duration || '4 Years') : '4 Years';
                            const firstYearFee = typeof course === 'object' ? (course.fee || course.first_year_fee || college.average_fees || 0) : (college.average_fees || 0);
                            const totalFee = typeof course === 'object' ? (course.total_fee || firstYearFee * 4) : ((college.average_fees || 0) * 4);
                            return (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="border px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"><span className="text-blue-600 font-medium break-words">{courseName}</span></td>
                                <td className="border px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{duration}</td>
                                <td className="border px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold">₹{(firstYearFee / 100000).toFixed(1)}L</td>
                                <td className="border px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold">₹{(totalFee / 100000).toFixed(1)}L</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </GuestGate>
                </section>
              )}

              {/* RANKING - Menu Tab Content */}
              {college?.rankings?.length > 0 && (
                <section id="ranking" className="scroll-mt-40">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Ranking</h2>
                  <p className="text-gray-700 text-sm mb-4">{college.name} has been ranked by various agencies:</p>
                  <div className="overflow-x-auto -mx-4 px-4">
                    <table className="w-full border-collapse border min-w-[350px]">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Agency</th>
                          <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Category</th>
                          <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Year</th>
                          <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {college.rankings.map((ranking, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm break-words">{ranking.agency}</td>
                            <td className="border px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{ranking.category || '-'}</td>
                            <td className="border px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{ranking.year || year}</td>
                            <td className="border px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-orange-600">#{ranking.rank}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* ADMISSION PROCESS - Removed duplicate, using only the isMenuEnabled controlled one below */}

              {/* CUTOFF - Menu Tab Content */}
              {college?.cutoff_data && college.cutoff_data.length > 0 && (
                <section id="cutoff" className="scroll-mt-40">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Cutoff {college.cutoff_data[0]?.year || (year - 1)}</h2>
                  <p className="text-gray-700 text-sm mb-4">Latest cutoff ranks for various programs:</p>
                  <div className="overflow-x-auto -mx-4 px-4">
                    <table className="w-full border-collapse border min-w-[400px]">
                      <thead>
                        <tr className="bg-orange-50">
                          <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Course</th>
                          <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Category</th>
                          <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Opening</th>
                          <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Closing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {college.cutoff_data.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm break-words">{item.course || item.program}</td>
                            <td className="border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{item.category || 'General'}</td>
                            <td className="border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-blue-600">{item.opening_rank || item.cutoff || '-'}</td>
                            <td className="border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-orange-600">{item.closing_rank_current || item.rank || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* PLACEMENT - Menu Tab Content */}
              {college?.placement && (
                <section id="placement" className="scroll-mt-40">
                  <h2 className="text-xl sm:text-xl sm:text-2xl font-bold mb-3">{college.name} Placement {year}</h2>
                  <p className="text-gray-700 text-sm mb-4">Placement statistics and top recruiters:</p>
                  <GuestGate title="Placement Data">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                      {college.placement.highest > 0 && (
                        <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center border border-green-200">
                          <div className="text-xl sm:text-2xl font-bold text-green-700">₹{(college.placement.highest / 100000).toFixed(1)}L</div>
                          <div className="text-sm text-gray-600">Highest Package</div>
                        </div>
                      )}
                      {college.placement.average > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center border border-blue-200">
                          <div className="text-xl sm:text-2xl font-bold text-blue-700">₹{(college.placement.average / 100000).toFixed(1)}L</div>
                          <div className="text-sm text-gray-600">Average Package</div>
                        </div>
                      )}
                      {college.placement.percentage > 0 && (
                        <div className="bg-orange-50 rounded-lg p-3 sm:p-4 text-center border border-orange-200">
                          <div className="text-xl sm:text-2xl font-bold text-orange-700">{college.placement.percentage}%</div>
                          <div className="text-sm text-gray-600">Placement Rate</div>
                        </div>
                      )}
                      {college.placement.students_participated > 0 && (
                        <div className="bg-purple-50 rounded-lg p-3 sm:p-4 text-center border border-purple-200">
                          <div className="text-xl sm:text-2xl font-bold text-purple-700">{college.placement.students_participated}+</div>
                          <div className="text-sm text-gray-600">Students Placed</div>
                        </div>
                      )}
                    </div>
                    {college.placement.top_recruiters && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <h4 className="font-bold mb-3">Top Recruiters</h4>
                        <div className="flex flex-wrap gap-2">
                          {(typeof college.placement.top_recruiters === 'string' 
                            ? college.placement.top_recruiters.split(',') 
                            : college.placement.top_recruiters
                          ).map((company, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white border rounded-full text-sm">{company.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </GuestGate>
                </section>
              )}

              {/* SCHOLARSHIP - Menu Tab Content */}
              {isMenuEnabled('scholarship') && college?.scholarships && college.scholarships.length > 0 && (
                <section id="scholarship" className="scroll-mt-40">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Scholarships</h2>
                  <p className="text-gray-700 text-sm mb-4">Available scholarships for students:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Scholarship Name</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Description</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {college.scholarships.map((scholarship, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border px-4 py-3 text-sm font-medium">{scholarship.name}</td>
                            <td className="border px-4 py-3 text-sm">{scholarship.description || scholarship.details || '-'}</td>
                            <td className="border px-4 py-3 text-sm font-bold text-green-600">{scholarship.amount || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* FACILITIES - Menu Tab Content */}
              {isMenuEnabled('facilities') && college.facilities && college.facilities.length > 0 && (
                <section id="facilities" className="scroll-mt-40">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Facilities</h2>
                  <p className="text-gray-700 text-sm mb-4">Campus provides world-class facilities:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {college.facilities.map((facility, idx) => {
                      const facilityStr = typeof facility === 'string' ? facility : facility.name;
                      const facilityData = facilityIconMap[facilityStr?.toLowerCase()] || { icon: FiGrid, label: facilityStr, color: 'bg-gray-500' };
                      const IconComponent = facilityData.icon;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow group">
                          <div className={`w-12 h-12 ${facilityData.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <IconComponent className="text-white" size={26} />
                          </div>
                          <span className="text-sm font-medium text-gray-700 text-center">{facilityData.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* COLLEGE MENU INFORMATION (Always Visible) */}
            <div className="space-y-8">
              
              {/* DYNAMIC TOC SECTIONS - Rendered when auto_from_toc is enabled */}
              {college?.menu_config?.auto_from_toc && college?.detail_page_toc?.length > 0 && (
                <div className="space-y-8">
                  {college.detail_page_toc.map((tocItem, index) => (
                    <section key={index} id={tocItem.anchor || `toc-${index}`} className="scroll-mt-40">
                      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                        <span className="text-orange-500">{getMenuIcon(tocItem.icon || tocItem.anchor)}</span>
                        {tocItem.title}
                      </h2>
                      {tocItem.content && (
                        <div className="prose max-w-none text-gray-700 leading-relaxed">
                          <div dangerouslySetInnerHTML={{ __html: tocItem.content.replace(/\n/g, '<br/>') }} />
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              )}

              {/* CUSTOM MENU INFO BOX - Show when use_custom_menu is enabled (content is on separate pages) */}
              {college?.menu_config?.use_custom_menu && college?.menu_config?.items?.length > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 sm:p-6 mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <FiLayers className="text-orange-600" size={22} />
                    Explore More About {college.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">Click on the sections below to learn more:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {college.menu_config.items
                      .filter(item => item.enabled)
                      .sort((a, b) => a.order - b.order)
                      .map((menuItem, index) => (
                      <Link
                        key={index}
                        to={getSectionUrl(menuItem.id)}
                        className="flex items-center gap-3 bg-white border-2 border-orange-200 rounded-lg px-3 sm:px-4 py-3 hover:bg-orange-100 hover:border-orange-400 transition-all group"
                      >
                        <span className="text-orange-500 group-hover:text-orange-600">{getMenuIcon(menuItem.id)}</span>
                        <span className="font-medium text-gray-800 text-sm sm:text-base">{menuItem.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* INFO SECTION - Show when NOT using auto_from_toc AND menu is enabled */}
              {isMenuEnabled('info') && (
              <section id="info" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                
                {college.seo_full_content && (
                  <div className="text-gray-700 leading-relaxed prose max-w-none mb-4">
                    <div dangerouslySetInnerHTML={{ __html: college.seo_full_content }} />
                  </div>
                )}

                {/* Recognized by & Affiliated to - Detailed Section - Only show if data exists */}
                {(college?.recognized_by?.length > 0 || college?.affiliation) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {college?.recognized_by?.length > 0 && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
                        <h3 className="font-bold text-lg mb-3 text-blue-900 flex items-center gap-2">
                          <span className="text-2xl">✅</span>
                          Recognized by
                        </h3>
                        <div className="space-y-3">
                          {college.recognized_by.map((org, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">🎓</span>
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-gray-900">{org}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {college?.affiliation && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
                        <h3 className="font-bold text-lg mb-3 text-orange-900 flex items-center gap-2">
                          <span className="text-2xl">🔗</span>
                          Affiliated to
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-xl">🏛️</span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{college.affiliation}</p>
                              <p className="text-xs text-gray-600">Primary Affiliation</p>
                            </div>
                          </div>
                        </div>

                        {college?.memberships && college.memberships.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-orange-300">
                            <h4 className="font-semibold text-sm text-gray-900 mb-2">Memberships</h4>
                            <div className="flex flex-wrap gap-2">
                              {college.memberships.map((m, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white border border-orange-300 text-xs rounded">{m}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold mb-3">Key Highlights</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Type:</strong> {college.type || '-'}</li>
                    <li>• <strong>Established:</strong> {college.established_year || college.established || '-'}</li>
                    <li>• <strong>Location:</strong> {college.location?.city || college.city}, {college.location?.state || college.state}</li>
                    <li>• <strong>Average Fees:</strong> ₹{college.average_fees ? (college.average_fees / 100000).toFixed(2) : '-'} Lakhs per year</li>
                    {college.average_rating > 0 && (college.reviews_count > 0 || college.total_reviews > 0) && <li>• <strong>Rating:</strong> {college.average_rating.toFixed(1)}/5 ({college.reviews_count || college.total_reviews} reviews)</li>}
                    {college.total_students && <li>• <strong>Students:</strong> {college.total_students.toLocaleString()}</li>}
                  </ul>
                </div>
              </section>
              )}

              {/* COURSES & FEES - Removed duplicate, using only the GuestGate protected one above */}

                {/* ADMISSIONS - Combined section for Admission Process and Dates */}
                {isMenuEnabled('admission') && (college?.admission_process || college?.admission_dates?.length > 0 || college?.courses?.filter(c => typeof c === 'object' && c.eligibility && c.selection_criteria).length > 0) && (
                  <section id="admission" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                    <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Admission {year}</h2>
                    <p className="text-gray-700 text-sm mb-4">
                      Admission details and eligibility criteria for {college.name}:
                    </p>

                    {/* Admission Dates - Show first if available */}
                    {college?.admission_dates && college.admission_dates.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3">Important Dates</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border">
                            <thead>
                              <tr className="bg-orange-50">
                                <th className="border px-4 py-3 text-left text-sm font-bold">Events</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">Dates</th>
                              </tr>
                            </thead>
                            <tbody>
                              {college.admission_dates.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="border px-4 py-3 text-sm">{item.event || item.title}</td>
                                  <td className="border px-4 py-3 text-sm font-semibold">{item.date}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Admission Process */}
                    {college?.admission_process && (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3">Admission Process</h3>
                        <div 
                          className="prose max-w-none text-gray-700 bg-orange-50 border border-orange-200 rounded-lg p-4"
                          dangerouslySetInnerHTML={{ __html: college.admission_process }}
                        />
                      </div>
                    )}

                    {college?.courses && college.courses.filter(c => typeof c === 'object' && c.eligibility && c.selection_criteria).length > 0 && (
                      <>
                        <h3 className="text-xl font-bold mb-3">Eligibility & Selection Criteria</h3>
                        <div className="overflow-x-auto mb-6">
                          <table className="w-full border-collapse border">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">Eligibility</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">Selection Criteria</th>
                              </tr>
                            </thead>
                            <tbody>
                              {college.courses.filter(c => typeof c === 'object' && c.eligibility && c.selection_criteria).map((course, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="border px-4 py-3 text-sm font-semibold">{course.name}</td>
                                  <td className="border px-4 py-3 text-sm">{course.eligibility}</td>
                                  <td className="border px-4 py-3 text-sm">{course.selection_criteria}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </section>
                )}

                {/* CUTOFF - Only show if menu enabled AND cutoff data exists */}
                {isMenuEnabled('cutoff') && college?.cutoff_data && college.cutoff_data.length > 0 && (
                  <section id="cutoff" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                    <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Cutoff {year}</h2>
                    <p className="text-gray-700 text-sm mb-4">
                      The cutoff varies for different programs and categories:
                    </p>

                    <div className="overflow-x-auto mb-6">
                      <table className="w-full border-collapse border">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border px-4 py-3 text-left text-sm font-bold">Course/Program</th>
                            <th className="border px-4 py-3 text-left text-sm font-bold">Category</th>
                            <th className="border px-4 py-3 text-left text-sm font-bold">Cutoff</th>
                            <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
                          </tr>
                        </thead>
                        <tbody>
                          {college.cutoff_data.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="border px-4 py-3 text-sm">{item.course || item.program}</td>
                              <td className="border px-4 py-3 text-sm">{item.category || 'General'}</td>
                              <td className="border px-4 py-3 text-sm font-bold text-blue-600">{item.cutoff || item.rank}</td>
                              <td className="border px-4 py-3 text-sm">{item.year || year}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* PLACEMENT - Only show if menu enabled AND placement data exists */}
                {isMenuEnabled('placement') && (college.placement || college.placements) && (
                  <section id="placement" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                    <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Placement</h2>
                    
                    <p className="text-gray-700 text-sm mb-4">
                      As per the {college.name} Placement report, the average package stood at <strong>₹{college.placement?.average ? (college.placement.average / 100000).toFixed(1) : college.placements?.average ? (college.placements.average / 100000).toFixed(1) : '-'} LPA</strong>.
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {(college.placement?.highest || college.placements?.highest) && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            ₹{((college.placement?.highest || college.placements?.highest) / 100000).toFixed(1)}L
                          </div>
                          <div className="text-sm text-gray-600">Highest Package</div>
                        </div>
                      )}
                      {(college.placement?.average || college.placements?.average) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            ₹{((college.placement?.average || college.placements?.average) / 100000).toFixed(1)}L
                          </div>
                          <div className="text-sm text-gray-600">Average Package</div>
                        </div>
                      )}
                      {(college.placement?.percentage || college.placements?.percentage) && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {college.placement?.percentage || college.placements?.percentage}%
                          </div>
                          <div className="text-sm text-gray-600">Placement Rate</div>
                        </div>
                      )}
                    </div>

                    {college.placement?.top_recruiters && college.placement.top_recruiters.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-bold text-sm mb-2">Top Recruiters:</h4>
                        <div className="flex flex-wrap gap-2">
                          {college.placement.top_recruiters.map((r, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-full">{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* RANKING - Only show if menu enabled */}
                {isMenuEnabled('ranking') && (
                <section id="ranking" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                  <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Ranking {year}</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    {college.name} has been ranked by various agencies including NIRF, IIRF, India Today, and more. The ranking details are mentioned below:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Agency</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Category</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {college.rankings && college.rankings.length > 0 ? (
                          college.rankings.map((rank, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="border px-4 py-3 text-sm font-semibold">{rank.agency || rank.source}</td>
                              <td className="border px-4 py-3 text-sm">{rank.year}</td>
                              <td className="border px-4 py-3 text-sm">{rank.category || 'Overall'}</td>
                              <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{rank.rank}</td>
                            </tr>
                          ))
                        ) : (
                          <>
                            {college.nirf_ranking && (
                              <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-3 text-sm font-semibold">NIRF</td>
                                <td className="border px-4 py-3 text-sm">{year}</td>
                                <td className="border px-4 py-3 text-sm">Overall</td>
                                <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{college.nirf_ranking}</td>
                              </tr>
                            )}
                            {college.india_today_ranking && (
                              <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-3 text-sm font-semibold">India Today</td>
                                <td className="border px-4 py-3 text-sm">{year}</td>
                                <td className="border px-4 py-3 text-sm">Overall</td>
                                <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{college.india_today_ranking}</td>
                              </tr>
                            )}
                            {!college.nirf_ranking && !college.india_today_ranking && (
                              <tr>
                                <td colSpan="4" className="border px-4 py-3 text-sm text-center text-gray-500">
                                  No ranking data available
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
                )}

                {/* SCHOLARSHIP - Only show if data exists AND menu is enabled */}
                {isMenuEnabled('scholarship') && college?.scholarships && college.scholarships.length > 0 && (
                  <section id="scholarship" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                    <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Scholarships {year}</h2>
                    <p className="text-gray-700 text-sm mb-4">
                      {college.name} offers various scholarships to support students financially. The details are mentioned below:
                    </p>
                    <div className="space-y-4">
                      {college.scholarships.map((scholarship, idx) => (
                        <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <h3 className="font-bold text-lg mb-2">{scholarship.name || scholarship.title}</h3>
                          <p className="text-sm text-gray-700">
                            {scholarship.description || scholarship.details}
                          </p>
                          {scholarship.amount && (
                            <p className="text-sm font-semibold text-blue-600 mt-2">
                              Amount: ₹{scholarship.amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* CAMPUS IMAGES & VIDEO - Only show if data exists */}
                {((college.campus_images?.length > 0 || college.images?.length > 1) || (college.campus_video_url || college.seo_video_url || college.videos?.[0])) && (
                  <section id="campus-media" className="scroll-mt-40">
                    {/* Campus Images */}
                    {(college.campus_images?.length > 0 || college.images?.length > 1) && (
                      <>
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">{college.name} Campus Gallery</h2>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          {(college.campus_images || college.images.slice(1)).slice(0, 6).map((img, i) => {
                            // Handle both string URLs and object format {url: '...', alt: '...'}
                            const imgUrl = typeof img === 'string' ? img : img?.url;
                            const imgAlt = typeof img === 'object' && img?.alt ? img.alt : `Campus ${i + 1}`;
                            if (!imgUrl) return null;
                            return (
                              <div key={i} className="rounded-lg aspect-video overflow-hidden border">
                                <img loading="lazy" src={imgUrl} alt={imgAlt} className="w-full h-full object-cover" />
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* CAMPUS VIDEO */}
                    {(college.campus_video_url || college.seo_video_url || college.videos?.[0]) && (
                      <div className="mt-4">
                        <h3 className="text-xl sm:text-2xl font-bold mb-4">{college.video_title || 'Campus Video Tour'}</h3>
                        <div className="rounded-lg aspect-video overflow-hidden border">
                          <iframe
                            src={getYouTubeEmbedUrl(college.campus_video_url || college.seo_video_url || college.videos?.[0])}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={college.video_title || 'Campus Video Tour'}
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* Q&A SECTION */}
                <section id="qna">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Questions & Answers</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    Have questions about {college.name}? Ask here and get answers from students, alumni, and experts.
                  </p>

                  {/* Ask Question Form */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4">Ask Your Question</h3>
                    {questionSubmitted && (
                      <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
                        ✅ Your question has been submitted successfully!
                      </div>
                    )}
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Type your question about this institution..."
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="3"
                      disabled={submittingQuestion}
                    ></textarea>
                    <Button 
                      onClick={handleAskQuestion}
                      disabled={submittingQuestion || !questionText.trim()}
                      className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingQuestion ? 'Submitting...' : 'Submit Question'}
                    </Button>
                  </div>
                </section>

                {/* FAQ SECTION - Only show if data exists */}
                {college?.seo_faqs && college.seo_faqs.length > 0 && (
                  <section id="faq">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Frequently Asked Questions (FAQs)</h2>
                    <p className="text-gray-700 text-sm mb-4">
                      Find answers to commonly asked questions about {college.name}:
                    </p>

                    <div className="space-y-3">
                      {college.seo_faqs.map((faq, index) => (
                        <details key={index} className="bg-white border rounded-lg">
                          <summary className="font-semibold text-gray-900 p-5 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
                            <span className="flex-1">Ques. {faq.question}</span>
                            <FiChevronDown className="text-orange-600 flex-shrink-0" />
                          </summary>
                          <div className="px-5 pb-5 text-sm text-gray-700 border-t pt-4">
                            <p><strong>Ans.</strong> {faq.answer}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                {/* REVIEWS - Only show if menu enabled */}
                {isMenuEnabled('reviews') && (
                <section id="reviews" className="mt-8">
                  <ReviewsSection 
                    entityId={college?.id} 
                    entityType={college?.institution_type || 'college'} 
                    entityName={college?.name}
                    serialNumber={college?.serial_number}
                    slug={college?.slug || college?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                  />
                </section>
                )}

                {/* QUESTIONS & ANSWERS */}
                <section id="questions" className="mt-8">
                  <QuestionsSection 
                    entityId={college?.id} 
                    entityType="college" 
                    entityName={college?.name}
                  />
                </section>

                {/* COMMENTS & DISCUSSION */}
                <section id="comments" className="mt-8">
                  <CommentsSection 
                    entityId={college?.id} 
                    entityType="college" 
                    entityName={college?.name}
                  />
                </section>

                {/* HOW TO REACH - Separate Card above Location */}
                {college?.how_to_reach && (college.how_to_reach.by_metro || college.how_to_reach.by_bus || college.how_to_reach.by_train || college.how_to_reach.by_road || college.how_to_reach.by_air) && (
                  <section id="how-to-reach" className="scroll-mt-40 mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">How to Reach {college.name}</h2>
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {college.how_to_reach.by_train && (
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">🚂</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">By Train</h4>
                                <p className="text-sm text-gray-600">{college.how_to_reach.by_train}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {college.how_to_reach.by_road && (
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">🚗</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">By Road</h4>
                                <p className="text-sm text-gray-600">{college.how_to_reach.by_road}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {college.how_to_reach.by_air && (
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">✈️</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">By Air</h4>
                                <p className="text-sm text-gray-600">{college.how_to_reach.by_air}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {college.how_to_reach.by_metro && (
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">🚇</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">By Metro</h4>
                                <p className="text-sm text-gray-600">{college.how_to_reach.by_metro}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {college.how_to_reach.by_bus && (
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">🚌</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">By Bus</h4>
                                <p className="text-sm text-gray-600">{college.how_to_reach.by_bus}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* LOCATION & MAP */}
                <section id="location">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3">{college.name} Location & Address</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    Find {college.name} on the map and get complete address details:
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Address Details */}
                    <div className="lg:col-span-1">
                      <div className="bg-white border rounded-lg p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg mb-3 text-gray-900">Address</h3>
                          
                          {/* ENTIRE Address & Contact Details - Blurred for non-registered users */}
                          <GuestGate title="Address & Contact Details">
                            <div className="space-y-3">
                              <div className="flex gap-3">
                                <FiMapPin className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                                <div>
                                  <p className="text-sm text-gray-700 font-medium">{college.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {college.location?.address || `${college.location?.city}, ${college.location?.state}`}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {college.location?.city}, {college.location?.state}
                                  </p>
                                  {college.location?.pincode && (
                                    <p className="text-sm text-gray-600">India - {college.location.pincode}</p>
                                  )}
                                </div>
                              </div>

                              {college.contact_info?.phone && (
                              <div className="flex gap-3">
                                <FiPhone className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                                <div>
                                  <p className="text-sm text-gray-700 font-medium">Phone</p>
                                  <p className="text-sm text-gray-600">{college.contact_info.phone}</p>
                                </div>
                              </div>
                              )}

                              {college.contact_info?.email && (
                              <div className="flex gap-3">
                                <FiMail className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                                <div>
                                  <p className="text-sm text-gray-700 font-medium">Email</p>
                                  <p className="text-sm text-gray-600">{college.contact_info.email}</p>
                                </div>
                              </div>
                              )}

                              {college.contact_info?.website && (
                              <div className="flex gap-3">
                                <FiGlobe className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                                <div>
                                  <p className="text-sm text-gray-700 font-medium">Website</p>
                                  <a href={college.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                    {college.contact_info.website}
                                  </a>
                                </div>
                              </div>
                              )}
                            </div>
                          </GuestGate>
                        </div>

                        <Button 
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={() => {
                            const address = college.location?.address || college.name;
                            const city = college.location?.city || '';
                            const searchQuery = encodeURIComponent(`${address}, ${city}`);
                            window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
                          }}
                        >
                          <FiExternalLink className="mr-2" />
                          Get Directions
                        </Button>
                      </div>
                    </div>

                    {/* Google Map - Takes 2 columns */}
                    <div className="lg:col-span-2">
                      <div className="bg-white border rounded-lg overflow-hidden h-full min-h-[400px]">
                        <iframe
                          title="College Location Map"
                          src={college.location?.map_embed_url || `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.9!3d19.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA2JzAwLjAiTiA3MsKwNTQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890`}
                          width="100%"
                          height="100%"
                          style={{ border: 0, minHeight: '400px' }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  {/* Nearby Places / Landmarks - Only show if data exists */}
                  {((college?.nearby_places && college.nearby_places.length > 0) || (college?.location?.nearby_places && college.location.nearby_places.length > 0)) && (
                    <div className="mt-6 bg-gray-50 border rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-4">Nearby Places / Landmarks</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(college.nearby_places || college.location?.nearby_places || []).map((place, idx) => {
                          // Handle both string format ("METRO - 2 KM") and object format ({type, name, distance})
                          const isString = typeof place === 'string';
                          let placeName, placeDistance, placeType;
                          
                          if (isString) {
                            // Parse string format: "METRO - 2 KM" or "AIRPORT-10 KM"
                            const parts = place.split(/[-–]/);
                            placeName = parts[0]?.trim() || place;
                            placeDistance = parts.slice(1).join('-').trim() || '';
                            placeType = placeName.toLowerCase();
                          } else {
                            placeName = place.name || '';
                            placeDistance = place.distance || '';
                            placeType = (place.type || placeName || '').toLowerCase();
                          }
                          
                          // Icon and color mapping
                          const iconMap = { 
                            hospital: '🏥', bank: '🏦', market: '🏪', metro: '🚉', airport: '✈️', 
                            restaurant: '🍽️', bus: '🚌', train: '🚂', station: '🚂', atm: '🏧', 
                            pharmacy: '💊', mall: '🏬', school: '🏫', college: '🎓', temple: '🛕',
                            church: '⛪', mosque: '🕌', park: '🌳', cinema: '🎬', hotel: '🏨'
                          };
                          const colorMap = { 
                            hospital: 'bg-red-100', bank: 'bg-green-100', market: 'bg-purple-100', 
                            metro: 'bg-orange-100', airport: 'bg-blue-100', restaurant: 'bg-yellow-100', 
                            bus: 'bg-teal-100', train: 'bg-indigo-100', station: 'bg-indigo-100',
                            atm: 'bg-pink-100', pharmacy: 'bg-cyan-100', mall: 'bg-violet-100',
                            school: 'bg-amber-100', college: 'bg-emerald-100', temple: 'bg-orange-100',
                            church: 'bg-gray-100', mosque: 'bg-green-100', park: 'bg-lime-100',
                            cinema: 'bg-fuchsia-100', hotel: 'bg-sky-100'
                          };
                          
                          // Find matching icon/color by checking if placeType contains any key
                          let icon = '📍';
                          let color = 'bg-gray-100';
                          for (const key of Object.keys(iconMap)) {
                            if (placeType.includes(key)) {
                              icon = iconMap[key];
                              color = colorMap[key];
                              break;
                            }
                          }
                          
                          return (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                              <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                                <span className="text-xl">{icon}</span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{placeName}</p>
                                {placeDistance && <p className="text-xs text-gray-600">{placeDistance}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Sponsor Ad - Sidebar */}
              <AdBanner pageName="college-detail" position="sidebar" />
              
              {/* ADMISSION PARTNER - BOOK YOUR SEAT */}
              {college.is_admission_partner && (
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
                  <div className="text-center">
                    <AdmissionPartnerBadge size="lg" className="mb-3 justify-center" />
                    <h3 className="font-bold text-xl mb-2">Admission Open!</h3>
                    <p className="text-sm text-green-100 mb-4">Book your seat at {college.name}</p>
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <FiCheckCircle size={18} />
                      <span>🎓 Book Your Seat</span>
                    </button>
                    <p className="text-xs text-green-100 mt-3">Limited seats available. Apply now!</p>
                  </div>
                </div>
              )}
              
              {/* APPLY NOW BUTTON */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 text-white shadow-lg">
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">Apply to {college.name}</h3>
                  <p className="text-sm text-orange-100 mb-4">Start your admission process now</p>
                  <button 
                    onClick={() => setShowApplyModal(true)}
                    className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <FiCheckCircle size={18} />
                    <span>Apply Now</span>
                  </button>
                  {college?.admission_deadline && (
                    <p className="text-xs text-orange-100 mt-3">Application Deadline: {college.admission_deadline}</p>
                  )}
                </div>
              </div>

              {/* IMPORTANT DATES WIDGET - From sidebar_widgets configuration */}
              {college?.sidebar_widgets?.important_dates?.enabled && college?.sidebar_widgets?.important_dates?.dates?.length > 0 && (
                <div className="bg-white border rounded-lg shadow-sm p-5">
                  <h3 className="font-bold text-base mb-4 text-gray-900 flex items-center gap-2">
                    <FiCalendar className="text-orange-500" />
                    Important Dates
                  </h3>
                  <div className="space-y-3">
                    {college.sidebar_widgets.important_dates.dates.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                        <div className="bg-orange-100 text-orange-600 rounded-lg p-2 text-center min-w-[50px]">
                          <div className="text-xs font-bold">{new Date(item.date).toLocaleDateString('en-IN', { month: 'short' })}</div>
                          <div className="text-lg font-bold">{new Date(item.date).getDate()}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                          {item.description && <div className="text-xs text-gray-500">{item.description}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QUICK FACTS WIDGET - From sidebar_widgets configuration */}
              {college?.sidebar_widgets?.quick_facts?.enabled && (
                <div className="bg-white border rounded-lg shadow-sm p-5">
                  <h3 className="font-bold text-base mb-4 text-gray-900 flex items-center gap-2">
                    <FiInfo className="text-blue-500" />
                    Quick Facts
                  </h3>
                  <div className="space-y-2">
                    {college.sidebar_widgets.quick_facts.show_established && college.established_year && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Established</span>
                        <span className="font-semibold">{college.established_year}</span>
                      </div>
                    )}
                    {college.sidebar_widgets.quick_facts.show_type && college.type && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type</span>
                        <span className="font-semibold">{college.type}</span>
                      </div>
                    )}
                    {college.sidebar_widgets.quick_facts.show_approval && college.approved_by && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Approved By</span>
                        <span className="font-semibold">{college.approved_by}</span>
                      </div>
                    )}
                    {college.sidebar_widgets.quick_facts.show_student_count && college.total_students > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Students</span>
                        <span className="font-semibold">{college.total_students.toLocaleString()}</span>
                      </div>
                    )}
                    {college.sidebar_widgets.quick_facts.show_faculty_count && college.faculty_count > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Faculty</span>
                        <span className="font-semibold">{college.faculty_count}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SOCIAL LINKS WIDGET - Links to college's social media pages */}
              {college?.social_links && (college.social_links.facebook || college.social_links.twitter || college.social_links.instagram || college.social_links.linkedin || college.social_links.youtube) && (
                <div className="bg-white border rounded-lg shadow-sm p-5">
                  <h3 className="font-bold text-base mb-4 text-gray-900">Follow {college.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {college.social_links.facebook && (
                      <a
                        href={college.social_links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook
                      </a>
                    )}
                    {college.social_links.twitter && (
                      <a
                        href={college.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        Twitter
                      </a>
                    )}
                    {college.social_links.instagram && (
                      <a
                        href={college.social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        Instagram
                      </a>
                    )}
                    {college.social_links.linkedin && (
                      <a
                        href={college.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                      </a>
                    )}
                    {college.social_links.youtube && (
                      <a
                        href={college.social_links.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* SHARE PAGE WIDGET - From sidebar_widgets configuration */}
              {college?.sidebar_widgets?.social_share?.enabled && college?.sidebar_widgets?.social_share?.platforms?.length > 0 && (
                <div className="bg-white border rounded-lg shadow-sm p-5">
                  <h3 className="font-bold text-base mb-4 text-gray-900">Share This Page</h3>
                  <div className="flex flex-wrap gap-2">
                    {college.sidebar_widgets.social_share.platforms.includes('facebook') && (
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition-colors"
                      >
                        Share on Facebook
                      </a>
                    )}
                    {college.sidebar_widgets.social_share.platforms.includes('twitter') && (
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(college.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
                      >
                        Share on Twitter
                      </a>
                    )}
                    {college.sidebar_widgets.social_share.platforms.includes('whatsapp') && (
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(college.name + ' - ' + window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium transition-colors"
                      >
                        Share on WhatsApp
                      </a>
                    )}
                    {college.sidebar_widgets.social_share.platforms.includes('linkedin') && (
                      <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(college.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs font-medium transition-colors"
                      >
                        Share on LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* AD BANNER WIDGET - From sidebar_widgets configuration */}
              {college?.sidebar_widgets?.ad_banner?.enabled && college?.sidebar_widgets?.ad_banner?.image_url && (
                <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  {/* Banner Image - clickable if cta_url exists */}
                  {college.sidebar_widgets.ad_banner.cta_url ? (
                    <a 
                      href={college.sidebar_widgets.ad_banner.cta_url.startsWith('http') 
                        ? college.sidebar_widgets.ad_banner.cta_url 
                        : `https://${college.sidebar_widgets.ad_banner.cta_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img 
                        src={college.sidebar_widgets.ad_banner.image_url.startsWith('/') 
                          ? `${process.env.REACT_APP_BACKEND_URL}${college.sidebar_widgets.ad_banner.image_url}` 
                          : college.sidebar_widgets.ad_banner.image_url} 
                        alt={college.sidebar_widgets.ad_banner.title || 'Advertisement'} 
                        className="w-full h-auto"
                      />
                    </a>
                  ) : (
                    <img 
                      src={college.sidebar_widgets.ad_banner.image_url.startsWith('/') 
                        ? `${process.env.REACT_APP_BACKEND_URL}${college.sidebar_widgets.ad_banner.image_url}` 
                        : college.sidebar_widgets.ad_banner.image_url} 
                      alt={college.sidebar_widgets.ad_banner.title || 'Advertisement'} 
                      className="w-full h-auto"
                    />
                  )}
                  
                  {/* Title, Description, and CTA Button */}
                  {(college.sidebar_widgets.ad_banner.title || college.sidebar_widgets.ad_banner.description || (college.sidebar_widgets.ad_banner.show_cta_button !== false && college.sidebar_widgets.ad_banner.cta_url)) && (
                    <div className="p-4">
                      {college.sidebar_widgets.ad_banner.title && (
                        <h4 className="font-bold text-gray-900 mb-1">{college.sidebar_widgets.ad_banner.title}</h4>
                      )}
                      {college.sidebar_widgets.ad_banner.description && (
                        <p className="text-sm text-gray-600 mb-3">{college.sidebar_widgets.ad_banner.description}</p>
                      )}
                      {college.sidebar_widgets.ad_banner.show_cta_button !== false && college.sidebar_widgets.ad_banner.cta_url && (
                        <a 
                          href={college.sidebar_widgets.ad_banner.cta_url.startsWith('http') 
                            ? college.sidebar_widgets.ad_banner.cta_url 
                            : `https://${college.sidebar_widgets.ad_banner.cta_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block w-full text-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded transition-colors"
                        >
                          {college.sidebar_widgets.ad_banner.cta_text || 'Learn More'}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* COUNSELOR CTA - From sidebar_widgets configuration */}
              {college?.sidebar_widgets?.counselor_cta?.enabled && (
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🎓</div>
                    <h3 className="font-bold text-lg mb-2">{college.sidebar_widgets.counselor_cta.title || 'Need Help?'}</h3>
                    <p className="text-sm text-orange-100 mb-4">{college.sidebar_widgets.counselor_cta.subtitle || 'Talk to our expert counselor'}</p>
                    {college.sidebar_widgets.counselor_cta.phone ? (
                      <a 
                        href={`tel:${college.sidebar_widgets.counselor_cta.phone}`}
                        className="block w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 rounded transition-colors text-center"
                      >
                        📞 Talk to Expert
                      </a>
                    ) : (
                      <a 
                        href={`https://wa.me/919830122122?text=Hi, I need help with admission for ${college.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 rounded transition-colors text-center"
                      >
                        Talk to Expert
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* ADVERTISEMENT 1 - Show only if counselor_cta is disabled */}
              {!college?.sidebar_widgets?.counselor_cta?.enabled && (
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🎓</div>
                    <h3 className="font-bold text-lg mb-2">Get Expert Guidance</h3>
                    <p className="text-sm text-orange-100 mb-4">Connect with our counselors for FREE admission guidance</p>
                    <a 
                      href="https://wa.me/919830122122?text=Hi, I need help with college admission"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 rounded transition-colors text-center"
                    >
                      Talk to Expert
                    </a>
                  </div>
                </div>
              )}

              {/* POPULAR COURSES - Dynamic from college.courses */}
              <div className="bg-white border rounded-lg shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 text-gray-900">Popular Full Time Courses</h3>
                <div className="space-y-4">
                  {college?.courses && college.courses.length > 0 ? (
                    college.courses.slice(0, 5).map((course, i) => {
                      const courseName = typeof course === 'string' ? course : course.name || 'Course';
                      const courseFees = typeof course === 'object' ? (course.first_year_fee || course.total_fee || college.average_fees) : college.average_fees;
                      return (
                        <div key={i} className={`pb-4 ${i !== Math.min(college.courses.length, 5) - 1 ? 'border-b border-gray-200' : ''}`}>
                          <div className="flex items-start justify-between mb-2">
                            <Link to="#courses" className="text-sm font-bold text-blue-600 hover:underline">
                              {courseName}
                            </Link>
                          </div>
                          {courseFees > 0 && (
                            <p className="text-xs text-gray-700 mb-3 font-medium">
                              ₹{(courseFees / 100000).toFixed(2)} Lakhs
                            </p>
                          )}
                          <button 
                            onClick={() => setShowApplyModal(true)}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2.5 rounded transition-colors"
                          >
                            Apply Now
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No courses available</p>
                  )}
                </div>
              </div>

              {/* DOWNLOAD BROCHURE WIDGET - Connected to brochure_url */}
              {college.brochure_url && (
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-3">📚</div>
                    <h3 className="font-bold text-lg mb-2">Download Brochure</h3>
                    <p className="text-sm text-blue-100 mb-4">Get complete course details and admission information</p>
                    <a 
                      href={college.brochure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="block w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-2.5 rounded transition-colors text-center"
                    >
                      Download Now
                    </a>
                  </div>
                </div>
              )}

              {/* SIMILAR COLLEGES - Auto-populated based on same city/state/type */}
              <div className="bg-white border rounded-lg shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 text-gray-900">Similar Colleges</h3>
                <div className="space-y-4">
                  {similarColleges && similarColleges.length > 0 ? (
                    similarColleges.slice(0, 3).map((item, i) => (
                      <div key={i} className={`${i !== 2 ? 'pb-4 border-b border-gray-200' : ''}`}>
                        <Link to={getInstitutionDetailUrl(item.institution_type || 'college', item.id, item.name, item.city, item.serial_number)} className="block hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
                          <div className="flex gap-3">
                            {item.logo_url ? (
                              <img loading="lazy" src={item.logo_url} alt={item.name} className="w-16 h-16 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-xl font-bold text-blue-700">{item.name?.charAt(0)}</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 mb-1 truncate">{item.name}</p>
                              <p className="text-[11px] text-gray-600 mb-1">{item.city}, {item.state}</p>
                              {item.type && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{item.type}</span>}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No similar colleges found</p>
                  )}
                </div>
              </div>

              {/* CAREER COUNSELING WIDGET - From sidebar_widgets configuration */}
              {college?.sidebar_widgets?.career_counseling?.enabled !== false && (
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-3">💼</div>
                    <h3 className="font-bold text-lg mb-2">
                      {college?.sidebar_widgets?.career_counseling?.title || 'Career Counseling'}
                    </h3>
                    <p className="text-sm text-green-100 mb-4">
                      {college?.sidebar_widgets?.career_counseling?.subtitle || 'Get personalized career guidance from experts'}
                    </p>
                    {college?.sidebar_widgets?.career_counseling?.booking_type === 'link' && college?.sidebar_widgets?.career_counseling?.booking_url ? (
                      <a 
                        href={college.sidebar_widgets.career_counseling.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-white text-green-600 hover:bg-green-50 font-bold py-2.5 rounded transition-colors text-center"
                      >
                        {college?.sidebar_widgets?.career_counseling?.button_text || 'Book Session'}
                      </a>
                    ) : college?.sidebar_widgets?.career_counseling?.booking_type === 'phone' && college?.sidebar_widgets?.career_counseling?.booking_phone ? (
                      <a 
                        href={`tel:${college.sidebar_widgets.career_counseling.booking_phone}`}
                        className="block w-full bg-white text-green-600 hover:bg-green-50 font-bold py-2.5 rounded transition-colors text-center"
                      >
                        📞 {college?.sidebar_widgets?.career_counseling?.button_text || 'Call Now'}
                      </a>
                    ) : college?.sidebar_widgets?.career_counseling?.booking_type === 'whatsapp' && college?.sidebar_widgets?.career_counseling?.booking_whatsapp ? (
                      <a 
                        href={`https://wa.me/${college.sidebar_widgets.career_counseling.booking_whatsapp}?text=Hi, I would like to book a career counseling session for ${college.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-white text-green-600 hover:bg-green-50 font-bold py-2.5 rounded transition-colors text-center"
                      >
                        💬 {college?.sidebar_widgets?.career_counseling?.button_text || 'Chat on WhatsApp'}
                      </a>
                    ) : (
                      <button 
                        onClick={() => alert('Please configure booking settings in the admin panel')}
                        className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-2.5 rounded transition-colors"
                      >
                        {college?.sidebar_widgets?.career_counseling?.button_text || 'Book Session'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* LATEST NEWS - Dynamic from college announcements */}
              <div className="bg-white border rounded-lg shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 text-gray-900">Latest News</h3>
                <div className="space-y-4">
                  {college?.announcements && college.announcements.length > 0 ? (
                    college.announcements.slice(0, 3).map((news, i) => (
                      <div key={i} className={`${i !== college.announcements.slice(0, 3).length - 1 ? 'pb-4 border-b border-gray-200' : ''}`}>
                        <Link to={news.link || '#'} className="block hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
                          <p className="text-sm text-blue-600 hover:underline font-medium mb-1 line-clamp-2">
                            {news.title}
                          </p>
                          <p className="text-[11px] text-gray-500">{news.date || new Date(news.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </Link>
                      </div>
                    ))
                  ) : (
                    // Fallback to generated news
                    [
                      { title: `Admission ${year} Opens`, date: `Dec 12, ${year - 1}` },
                      { title: 'Placement Results Announced', date: `Dec 6, ${year}` },
                      { title: 'New Course Launch', date: `Nov 28, ${year}` }
                    ].map((news, i) => (
                      <div key={i} className={`${i !== 2 ? 'pb-4 border-b border-gray-200' : ''}`}>
                        <Link to="#" className="block hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
                          <p className="text-sm text-blue-600 hover:underline font-medium mb-1 line-clamp-2">
                            {college.name} {news.title}
                          </p>
                          <p className="text-[11px] text-gray-500">{news.date}</p>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Apply Now Modal */}
      <ApplyNowModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        collegeId={college?.id}
        collegeName={college?.name}
        collegeLogoUrl={college?.logo_url}
        collegeCourses={college?.courses?.map(c => typeof c === 'object' ? c.name : c) || []}
        source={college?.institution_type?.toLowerCase() || 'college'}
        isSchool={college?.institution_type === 'School'}
      />
      
      {/* Admission Booking Modal (for Admission Partners) */}
      <AdmissionBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        institution={{
          id: college?.id,
          name: college?.name,
          type: college?.institution_type?.toLowerCase() || 'college',
          city: college?.city,
          state: college?.state
        }}
        institutionType={college?.institution_type?.toLowerCase() === 'school' ? 'school' : 
                         college?.institution_type?.toLowerCase() === 'university' ? 'university' : 'college'}
      />
      
      {/* Login Prompt Modal (for guest action restrictions) */}
      <LoginPromptModal 
        isOpen={!!showPrompt} 
        onClose={closePrompt} 
        action={showPrompt?.action || 'perform this action'}
      />
    </div>
  );
};

export default CollegeDetailPage;
