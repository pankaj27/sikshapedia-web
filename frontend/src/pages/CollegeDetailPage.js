import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiUser, FiChevronDown, FiChevronUp, FiDownload, FiCheckCircle, FiPhone, FiMail, FiGlobe, FiExternalLink, FiHome, FiInfo, FiBook, FiFileText, FiBarChart2, FiBriefcase, FiAward, FiDollarSign, FiGrid, FiMessageSquare, FiBookmark, FiLayers, FiUsers, FiCalendar, FiMapPin as FiLocation, FiImage, FiHelpCircle, FiWifi, FiCoffee, FiActivity, FiShield, FiTruck, FiDroplet, FiSun, FiMonitor, FiHeadphones, FiPackage, FiHeart, FiCpu, FiSettings, FiZap } from 'react-icons/fi';
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

import { Link } from '../components/CustomLink';
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

const CollegeDetailPage = ({ overrideId }) => {
  const { id: paramId } = useParams();
  // Use overrideId if provided (from InstitutionDetailPage), otherwise use URL param
  const id = overrideId || paramId;
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
      const response = await api.get(`/colleges/${id}`);
      setCollege(response.data);
      // Set college data in context for AutoApplyPopup to use
      setCollegeData(response.data);
    } catch (error) {
      console.error('Error fetching college details:', error);
    } finally {
      setLoading(false);
    }
  };

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
    { id: 'info', label: 'Info', enabled: true, order: 1 },
    { id: 'courses', label: 'Courses & Fees', enabled: true, order: 2 },
    { id: 'admission', label: 'Admissions', enabled: true, order: 3 },
    { id: 'cutoff', label: 'Cutoff', enabled: true, order: 4 },
    { id: 'placement', label: 'Placement', enabled: true, order: 5 },
    { id: 'ranking', label: 'Ranking', enabled: true, order: 6 },
    { id: 'scholarship', label: 'Scholarship', enabled: true, order: 7 },
    { id: 'facilities', label: 'Facilities', enabled: true, order: 8 },
    { id: 'reviews', label: 'Reviews', enabled: true, order: 9 },
  ];

  // Dynamic menu items based on college configuration
  const getMenuItems = () => {
    const menuConfig = college?.menu_config;
    
    // If auto from TOC is enabled and Detail Page TOC exists
    if (menuConfig?.auto_from_toc && college?.detail_page_toc?.length > 0) {
      return college.detail_page_toc.map((item, index) => ({
        id: item.anchor || `toc-${index}`,
        label: item.title,
        icon: item.icon || 'default',
        enabled: true,
        order: index + 1
      }));
    }
    
    // If custom menu is enabled
    if (menuConfig?.use_custom_menu && menuConfig?.items?.length > 0) {
      return menuConfig.items
        .filter(item => item.enabled)
        .sort((a, b) => a.order - b.order);
    }
    
    // Default menu
    return defaultMenuItems;
  };

  const menuItems = getMenuItems();

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
    // TODO: Navigate to review form or open review modal
    alert('Review form coming soon!');
  };

  const handleAskQuestion = () => {
    // Check if user is logged in
    if (!requireAuth('ask a question')) return;
    // TODO: Submit question functionality
    alert('Question submission coming soon!');
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

  const tableOfContents = [
    { num: '01', title: `${college.name} Admission 2026 Dates`, id: 'seo-admission-dates' },
    { num: '02', title: `${college.name} Fees 2026`, id: 'seo-fees' },
    { num: '03', title: `${college.name} Ranking`, id: 'seo-ranking' },
    { num: '04', title: `${college.name} Admission 2026`, id: 'seo-admission' },
    { num: '05', title: `${college.name} Cutoff`, id: 'seo-cutoff' },
    { num: '06', title: `${college.name} Placement`, id: 'seo-placement' },
    { num: '07', title: `${college.name} vs Other Colleges`, id: 'seo-comparison' },
    { num: '08', title: `${college.name} Campus & Facilities`, id: 'seo-facilities' },
    { num: '09', title: `${college.name} FAQs`, id: 'seo-faqs' },
  ];

  return (
    <div className="min-h-screen bg-white pt-2">
      {/* Top Ad Banner */}
      <AdBanner pageName="college-detail" position="top" />

      {/* BREADCRUMB */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <Link to="/colleges" className="hover:text-orange-600">Colleges</Link>
            <span>/</span>
            <span className="text-gray-900">{college.name}</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              {college.images?.[0] ? (
                <img src={college.images[0]} alt={college.name} className="w-28 h-28 rounded border object-cover" />
              ) : (
                <div className="w-28 h-28 rounded bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold">
                  {college.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{college.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-orange-600" size={14} />
                      <span>{college.location?.city}, {college.location?.state}</span>
                    </div>
                    <span>|</span>
                    <span className="font-medium">{college.type}</span>
                    <span>|</span>
                    <span>Estd. {college.established_year || college.established || 'N/A'}</span>
                  </div>
                  
                  {/* Recognized by & Affiliated to */}
                  {(college.recognized_by?.length > 0 || college.affiliated_to) && (
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {college.recognized_by?.length > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700">Recognized by:</span>
                            <div className="flex items-center gap-2">
                              {college.recognized_by.map((org, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">{org}</span>
                              ))}
                            </div>
                          </div>
                          {college.affiliated_to && <span className="text-gray-400">|</span>}
                        </>
                      )}
                      {college.affiliated_to && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-700">Affiliated to:</span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">{college.affiliated_to}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`${i < Math.floor(college.rating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            size={18}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-lg">{college.rating || '4.5'}</span>
                      <span className="text-gray-600 text-sm">({college.reviews || 344} Reviews)</span>
                    </div>
                    
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => setShowApplyModal(true)}
                    >
                      <FiCheckCircle className="mr-2" size={16} />
                      Apply Now
                    </Button>
                    <Button variant="outline">
                      <FiDownload className="mr-2" size={16} />
                      Download Brochure
                    </Button>
                  </div>
                </div>

                {/* LIKE/DISLIKE/FAVORITE */}
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                      userVote === 'like' 
                        ? 'border-green-500 bg-green-50 shadow-md' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{userVote === 'like' ? '👍' : '👍'}</span>
                    <span className={`text-sm font-semibold ${userVote === 'like' ? 'text-green-600' : 'text-gray-700'}`}>
                      {Math.max(1, likes)}
                    </span>
                  </button>
                  <button 
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                      userVote === 'dislike' 
                        ? 'border-red-500 bg-red-50 shadow-md' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{userVote === 'dislike' ? '👎' : '👎'}</span>
                    <span className={`text-sm font-semibold ${userVote === 'dislike' ? 'text-red-600' : 'text-gray-700'}`}>
                      {Math.max(1, dislikes)}
                    </span>
                  </button>
                  <button 
                    onClick={handleFavorite}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                      isFavorited 
                        ? 'border-pink-500 bg-pink-50 shadow-md' 
                        : 'border-gray-300 hover:bg-pink-50 hover:border-pink-500'
                    }`}
                    title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <FiHeart className={isFavorited ? "text-pink-500 fill-pink-500" : "text-pink-500"} size={18} style={isFavorited ? {fill: '#ec4899'} : {}} />
                    <span className={`text-sm font-semibold ${isFavorited ? 'text-pink-600' : 'text-gray-700'}`}>
                      {isFavorited ? 'Saved' : 'Save'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY NAVIGATION MENU */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {menuItems.map((item) => (
              college?.menu_config?.use_custom_menu ? (
                // Custom Menu: Link to separate pages with SEO-friendly URLs
                <Link
                  key={item.id}
                  to={getSectionUrl(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-transparent text-gray-600 hover:text-orange-600 hover:bg-gray-50`}
                >
                  <span className="text-orange-500">{getMenuIcon(item.id)}</span>
                  <span>{item.label}</span>
                </Link>
              ) : (
                // Default/TOC Menu: Scroll on same page
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === item.id
                      ? 'border-orange-600 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={activeTab === item.id ? 'text-orange-600' : 'text-gray-500'}>{getMenuIcon(item.id)}</span>
                  <span>{item.label}</span>
                </button>
              )
            ))}
          </div>
        </div>
      </div>

      {/* LATEST UPDATES */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{college.name} Latest Updates and News</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-200 px-2 py-0.5 rounded flex-shrink-0">12 Dec, 2025</span>
                <p className="text-xs text-gray-800">
                  <strong>Admission 2026</strong> applications are now open. Apply before the deadline.
                </p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded">
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-green-600 bg-green-200 px-2 py-0.5 rounded flex-shrink-0">06 Dec, 2025</span>
                <p className="text-xs text-gray-800">
                  <strong>Placement Results 2024</strong> announced with highest package of ₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : '50'}L
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AUTHOR INFO */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              {college?.updated_by_photo || college?.created_by_photo ? (
                <img 
                  src={college?.updated_by_photo || college?.created_by_photo} 
                  alt={college?.updated_by_name || 'Author'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                  <FiUser size={18} />
                </div>
              )}
            </div>
            <div>
              <Link to={`/author/${college?.updated_by_name?.toLowerCase().replace(/\s+/g, '-') || 'content-team'}`} className="text-sm font-semibold text-gray-900 hover:text-orange-600">
                {college?.updated_by_name || college?.created_by_name || 'Content Team'}
              </Link>
              <p className="text-[13px] text-gray-600">
                Content Writer | {college?.updated_at ? `Updated ${formatTimeAgo(college.updated_at)}` : (college?.created_at ? `Added ${formatTimeAgo(college.created_at)}` : 'Updated recently')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Sponsor Ad - Content Top */}
        <AdBanner pageName="college-detail" position="content-top" />
        
        <div className="flex gap-6">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            {/* SEO CONTENT SECTION (Collapsible) */}
            <div className="mb-6 pb-6 border-b">
              {/* INTRO PREVIEW - 3 LINES */}
              <div className="mb-3">
                <p className={`text-gray-800 leading-relaxed ${!showContent ? 'line-clamp-3' : ''}`}>
                  {college.name} is a <strong>{college.type}</strong> established in <strong>{college.established || 'N/A'}</strong>. 
                  As per the data, the college is one of the preferred institutions for students. 
                  {college.name} Ranking is <strong>#{Math.floor(Math.random() * 50) + 1}</strong> in the category by various ranking agencies. 
                  {college.name} offers various programs with total fees ranging from <strong>₹{(college.average_fees / 100000).toFixed(2)} Lakhs</strong>. 
                  Admission is based on national-level entrance exams followed by counselling. 
                  As per {college.name} Placements, the average package was <strong>INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '15'} LPA</strong>. 
                  The top recruiters included leading companies from various sectors.
                </p>
              </div>

              {/* READ MORE BUTTON - Show when collapsed */}
              {!showContent && (
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

              {/* SEO EXPANDABLE CONTENT */}
              {showContent && (
                <div className="space-y-8">
                  {/* TABLE OF CONTENTS */}
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                      {tableOfContents.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className="text-left text-sm text-blue-600 hover:underline flex gap-2"
                        >
                          <span className="font-semibold flex-shrink-0">{item.num}.</span>
                          <span>{item.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* FULL INTRO PARAGRAPHS */}
                  <div>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {college.name} is a <strong>{college.type}</strong> established in <strong>{college.established || 'N/A'}</strong>. 
                      As per the data, the college is one of the preferred institutions for students. 
                      {college.name} Ranking is <strong>#{Math.floor(Math.random() * 50) + 1}</strong> in the category by various ranking agencies.
                    </p>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {college.name} offers various programs with total fees ranging from <strong>₹{(college.average_fees / 100000).toFixed(2)} Lakhs</strong>. 
                      Admission is based on national-level entrance exams followed by counselling.
                    </p>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      As per {college.name} Placements, the average package was <strong>INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '15'} LPA</strong>. 
                      The top recruiters included leading companies from various sectors.
                    </p>
                  </div>

                  {/* VIDEO */}
                  <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center border">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                      </div>
                      <p className="text-sm text-gray-600">Video: Complete Guide to {college.name}</p>
                    </div>
                  </div>

                  {/* ALL DETAILED CONTENT SECTIONS - NOW INSIDE EXPANDABLE AREA */}
                  <div className="space-y-8">
                    {/* ADMISSION DATES - Guest Gated */}
                    <section id="seo-admission-dates">
                      <h2 className="text-2xl font-bold mb-3">{college.name} Admission 2026 Dates</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        {college.name} offers admission to various programs through national-level entrance exams followed by counselling rounds. The important dates are:
                      </p>

                      <GuestGate title="Admission Dates">
                        <h3 className="text-xl font-bold mb-3">B.Tech Admission Dates 2026</h3>
                        <div className="overflow-x-auto mb-6">
                          <table className="w-full border-collapse border">
                            <thead>
                              <tr className="bg-orange-50">
                                <th className="border px-4 py-3 text-left text-sm font-bold">Events</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">Dates</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-3 text-sm">Application Start Date</td>
                                <td className="border px-4 py-3 text-sm font-semibold">January 2026</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-3 text-sm">Application Deadline</td>
                                <td className="border px-4 py-3 text-sm font-semibold">March 2026</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-3 text-sm">Exam Date</td>
                                <td className="border px-4 py-3 text-sm font-semibold">April-May 2026</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-3 text-sm">Result Announcement</td>
                                <td className="border px-4 py-3 text-sm font-semibold">June 2026</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </GuestGate>
                    </section>

                    {/* FEES - FROM TOC #02 - Guest Gated */}
                    <section id="seo-fees">
                      <h2 className="text-2xl font-bold mb-3">{college.name} Fees 2026</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        The fee structure for various courses at {college.name}:
                      </p>

                      <GuestGate title="Fee Details">
                        <div className="overflow-x-auto mb-6">
                          <table className="w-full border-collapse border">
                            <thead>
                              <tr className="bg-orange-50">
                                <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">Duration</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">1st Year Fee</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">Total Fee</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-3">
                                  <Link to="#" className="text-blue-600 hover:underline font-medium">B.Tech</Link>
                                </td>
                                <td className="border px-4 py-3 text-sm">4 Years</td>
                                <td className="border px-4 py-3 text-sm font-semibold">INR {(college.average_fees / 100000).toFixed(2)} Lakhs</td>
                                <td className="border px-4 py-3 text-sm font-semibold">INR {((college.average_fees * 4) / 100000).toFixed(2)} Lakhs</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </GuestGate>
                    </section>

                    {/* RANKING - FROM TOC #03 */}
                    <section id="seo-ranking">
                      <h2 className="text-2xl font-bold mb-3">{college.name} Ranking</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        {college.name} has been ranked by various agencies:
                      </p>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border px-4 py-3 text-left text-sm font-bold">Agency</th>
                              <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
                              <th className="border px-4 py-3 text-left text-sm font-bold">Rank</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-gray-50">
                              <td className="border px-4 py-3 text-sm">NIRF</td>
                              <td className="border px-4 py-3 text-sm">2025</td>
                              <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{Math.floor(Math.random() * 20) + 1}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* ADMISSION - FROM TOC #04 */}
                    <section id="seo-admission">
                      <h2 className="text-2xl font-bold mb-3">{college.name} Admission 2026</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        Admission process and eligibility criteria for {college.name}:
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                        <h3 className="font-bold mb-2">Admission Criteria</h3>
                        <p className="text-sm text-gray-700">
                          Admission is based on merit in national level entrance exams followed by counselling rounds.
                        </p>
                      </div>
                    </section>

                    {/* Content Middle Ad */}
                    <div className="my-6">
                      <AdBanner pageName="college-detail" position="content-middle" />
                    </div>

                    {/* CUTOFF - FROM TOC #05 */}
                    <section id="seo-cutoff">
                      <h2 className="text-2xl font-bold mb-3">{college.name} Cutoff</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        Latest cutoff ranks for various programs:
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700">Cutoff details will be updated soon after official announcement.</p>
                      </div>
                    </section>

                    {/* PLACEMENT - FROM TOC #06 - Guest Gated */}
                    <section id="seo-placement">
                      <h2 className="text-2xl font-bold mb-3">{college.name} Placement</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        As per {college.name} Placement report, the average package stood at INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '23.5'} LPA.
                      </p>
                      <GuestGate title="Placement Data">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : '50'}L</div>
                            <div className="text-xs text-gray-600">Highest</div>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">₹{college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '23.5'}L</div>
                            <div className="text-xs text-gray-600">Average</div>
                          </div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">95%</div>
                            <div className="text-xs text-gray-600">Placed</div>
                          </div>
                        </div>
                      </GuestGate>
                    </section>

                    {/* VS OTHER COLLEGES - FROM TOC #07 */}
                    <section id="seo-comparison">
                      <h2 className="text-2xl font-bold mb-3">{college.name} vs Other Colleges</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        Comparison with other top institutes:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border px-4 py-3 text-left text-sm font-bold">Particulars</th>
                              <th className="border px-4 py-3 text-left text-sm font-bold">{college.name}</th>
                              <th className="border px-4 py-3 text-left text-sm font-bold">College 2</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-gray-50">
                              <td className="border px-4 py-3 text-sm font-semibold">Established</td>
                              <td className="border px-4 py-3 text-sm">{college.established}</td>
                              <td className="border px-4 py-3 text-sm">1961</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="border px-4 py-3 text-sm font-semibold">Fees</td>
                              <td className="border px-4 py-3 text-sm">INR {(college.average_fees / 100000).toFixed(2)}L</td>
                              <td className="border px-4 py-3 text-sm">INR 2.28L</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* CAMPUS & FACILITIES - FROM TOC #08 */}
                    <section id="seo-facilities">
                      <h2 className="text-2xl font-bold mb-3">{college.name} Campus & Facilities</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        {college.name} campus provides world-class facilities:
                      </p>
                      {college.facilities && college.facilities.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {college.facilities.map((facility, idx) => {
                            const isObject = typeof facility === 'object';
                            const facilityName = isObject ? facility.name : facility;
                            const facilityData = getFacilityIcon(facilityName);
                            const IconComponent = facilityData.icon;
                            
                            return (
                              <div 
                                key={idx} 
                                className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                              >
                                <div className={`w-14 h-14 ${facilityData.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                  <IconComponent className="text-white" size={26} />
                                </div>
                                <span className="text-sm font-medium text-gray-700 text-center group-hover:text-orange-600 transition-colors">
                                  {facilityData.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* Default facilities when no data */
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {[
                            { name: 'Library', icon: HiOutlineLibrary, color: 'bg-blue-500' },
                            { name: 'Sports Complex', icon: MdOutlineSportsBasketball, color: 'bg-orange-500' },
                            { name: 'Hostel', icon: MdOutlineBed, color: 'bg-teal-500' },
                            { name: 'Cafeteria', icon: MdOutlineLocalCafe, color: 'bg-amber-500' },
                            { name: 'WiFi Campus', icon: MdOutlineWifi, color: 'bg-blue-400' },
                            { name: 'Medical', icon: MdOutlineLocalHospital, color: 'bg-red-500' },
                            { name: 'Gymnasium', icon: MdOutlineFitnessCenter, color: 'bg-red-600' },
                            { name: 'Auditorium', icon: MdOutlineTheaters, color: 'bg-purple-500' }
                          ].map((item, idx) => (
                            <div 
                              key={idx} 
                              className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                              <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                <item.icon className="text-white" size={26} />
                              </div>
                              <span className="text-sm font-medium text-gray-700 text-center group-hover:text-orange-600 transition-colors">
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>

                    {/* FAQs - FROM TOC #09 */}
                    <section id="seo-faqs">
                      <h2 className="text-2xl font-bold mb-3">{college.name} FAQs</h2>
                      {college.seo_faqs && college.seo_faqs.length > 0 ? (
                        <div className="space-y-3">
                          {college.seo_faqs.map((faq, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-4 border">
                              <p className="font-bold text-sm mb-2">Ques. {faq.question}</p>
                              <p className="text-sm text-gray-700"><strong>Ans.</strong> {faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          No FAQs available
                        </div>
                      )}
                    </section>
                  </div>

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

            {/* COLLEGE MENU INFORMATION (Always Visible) */}
            <div className="space-y-8">
              
              {/* DYNAMIC TOC SECTIONS - Rendered when auto_from_toc is enabled */}
              {college?.menu_config?.auto_from_toc && college?.detail_page_toc?.length > 0 && (
                <div className="space-y-8">
                  {college.detail_page_toc.map((tocItem, index) => (
                    <section key={index} id={tocItem.anchor || `toc-${index}`} className="scroll-mt-40">
                      <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
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
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <FiLayers className="text-orange-600" size={22} />
                    Explore More About {college.name}
                  </h3>
                  <p className="text-gray-600 mb-4">Click on the sections below to learn more:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {college.menu_config.items
                      .filter(item => item.enabled)
                      .sort((a, b) => a.order - b.order)
                      .map((menuItem, index) => (
                      <Link
                        key={index}
                        to={getSectionUrl(menuItem.id)}
                        className="flex items-center gap-3 bg-white border-2 border-orange-200 rounded-lg px-4 py-3 hover:bg-orange-100 hover:border-orange-400 transition-all group"
                      >
                        <span className="text-orange-500 group-hover:text-orange-600">{getMenuIcon(menuItem.id)}</span>
                        <span className="font-medium text-gray-800">{menuItem.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* INFO SECTION - Show when NOT using auto_from_toc */}
              <section id="info" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                <h2 className="text-2xl font-bold mb-3">About {college.name}</h2>
                <p className="text-gray-800 leading-relaxed mb-4">
                  {college.seo_intro || `${college.name} is a premier ${college.type} institution established in ${college.established_year || college.established || 'N/A'} and located in ${college.location?.city}, ${college.location?.state}.`}
                </p>
                {college.seo_full_content && (
                  <div className="text-gray-700 leading-relaxed prose max-w-none mb-4">
                    <div dangerouslySetInnerHTML={{ __html: college.seo_full_content.replace(/\n/g, '<br/>') }} />
                  </div>
                )}

                {/* Recognized by & Affiliated to - Detailed Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
                    <h3 className="font-bold text-lg mb-3 text-blue-900 flex items-center gap-2">
                      <span className="text-2xl">✅</span>
                      Recognized by
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🎓</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">UGC</p>
                          <p className="text-xs text-gray-600">University Grants Commission</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">📚</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">AICTE</p>
                          <p className="text-xs text-gray-600">All India Council for Technical Education</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🏆</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">NBA</p>
                          <p className="text-xs text-gray-600">National Board of Accreditation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">⭐</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">NAAC</p>
                          <p className="text-xs text-gray-600">A+ Grade Accreditation</p>
                        </div>
                      </div>
                    </div>
                  </div>

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
                          <p className="font-semibold text-sm text-gray-900">Mumbai University</p>
                          <p className="text-xs text-gray-600">Primary Affiliation</p>
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <p className="text-xs text-gray-700 leading-relaxed">
                          The institute is affiliated to Mumbai University and follows its curriculum for undergraduate and postgraduate programs. All degrees are awarded by the university.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-orange-300">
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Memberships</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-white border border-orange-300 text-xs rounded">AIU</span>
                        <span className="px-2 py-1 bg-white border border-orange-300 text-xs rounded">ACU</span>
                        <span className="px-2 py-1 bg-white border border-orange-300 text-xs rounded">IUAC</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold mb-3">Key Highlights</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Type:</strong> {college.type}</li>
                    <li>• <strong>Established:</strong> {college.established || 'N/A'}</li>
                    <li>• <strong>Location:</strong> {college.location?.city}, {college.location?.state}</li>
                    <li>• <strong>Average Fees:</strong> ₹{(college.average_fees / 100000).toFixed(2)} Lakhs per year</li>
                    <li>• <strong>Rating:</strong> {college.rating || '4.5'}/5 ({college.reviews || 344} Reviews)</li>
                  </ul>
                </div>
              </section>

              {/* COURSES & FEES - Hide when using TOC menu */}
                <section id="courses" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                  <h2 className="text-2xl font-bold mb-3">{college.name} Courses & Fees 2026</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    {college.name} offers various undergraduate and postgraduate programs. The fee structure for different courses is mentioned below:
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-orange-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Duration</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">1st Year Fee</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Total Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3">
                            <Link to="#" className="text-blue-600 hover:underline font-medium">B.Tech</Link>
                          </td>
                          <td className="border px-4 py-3 text-sm">4 Years</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR {(college.average_fees / 100000).toFixed(2)} Lakhs</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR {((college.average_fees * 4) / 100000).toFixed(2)} Lakhs</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3">
                            <Link to="#" className="text-blue-600 hover:underline font-medium">M.Tech</Link>
                          </td>
                          <td className="border px-4 py-3 text-sm">2 Years</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR 72,000</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR 1.44 Lakhs</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3">
                            <Link to="#" className="text-blue-600 hover:underline font-medium">MBA</Link>
                          </td>
                          <td className="border px-4 py-3 text-sm">2 Years</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR 7.68 Lakhs</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR 15.36 Lakhs</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Q&A */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-sm font-bold mb-2">Ques. Is pursuing a degree at {college.name} worth the investment?</p>
                    <p className="text-sm text-gray-700">
                      <strong>Ans.</strong> Yes, {college.name} offers quality education with excellent placement opportunities, experienced faculty, and state-of-the-art infrastructure. The ROI is quite competitive.
                    </p>
                  </div>
                </section>

                {/* ADMISSIONS */}
                <section id="admission" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                  <h2 className="text-2xl font-bold mb-3">{college.name} Admission 2026</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    {college.name} offers admission to various programs through national-level entrance exams followed by counselling rounds. The eligibility criteria and selection process are mentioned below:
                  </p>

                  <h3 className="text-xl font-bold mb-3">Admission Dates 2026</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-orange-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Events</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Dates</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Application Start Date</td>
                          <td className="border px-4 py-3 text-sm font-semibold">January 2026</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Application Deadline</td>
                          <td className="border px-4 py-3 text-sm font-semibold">March 2026</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Exam Date</td>
                          <td className="border px-4 py-3 text-sm font-semibold">April-May 2026</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Result Announcement</td>
                          <td className="border px-4 py-3 text-sm font-semibold">June 2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm font-semibold">B.Tech</td>
                          <td className="border px-4 py-3 text-sm">10+2 with 75% in PCM</td>
                          <td className="border px-4 py-3 text-sm">JEE Advanced + JoSAA Counselling</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm font-semibold">M.Tech</td>
                          <td className="border px-4 py-3 text-sm">BE/B.Tech with 60% marks</td>
                          <td className="border px-4 py-3 text-sm">GATE + COAP Counselling</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm font-semibold">MBA</td>
                          <td className="border px-4 py-3 text-sm">Bachelor's degree with 60%</td>
                          <td className="border px-4 py-3 text-sm">CAT + GD/PI</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Q&A */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <p className="text-sm font-bold mb-2">Ques. What is the admission process for {college.name}?</p>
                    <p className="text-sm text-gray-700">
                      <strong>Ans.</strong> Admission is primarily through entrance exams. The process includes application submission, entrance exam, cutoff determination, counselling, and document verification.
                    </p>
                  </div>
                </section>

                {/* CUTOFF */}
                <section id="cutoff" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                  <h2 className="text-2xl font-bold mb-3">{college.name} Cutoff {year}</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    The cutoff varies for different programs and categories. Below are the cutoff ranks for General Category:
                  </p>

                  <h3 className="text-xl font-bold mb-3">JEE Advanced Cutoff 2025</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Opening Rank 2025</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Closing Rank 2025</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Closing Rank 2024</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Computer Science Engineering</td>
                          <td className="border px-4 py-3 text-sm font-bold text-green-600">1</td>
                          <td className="border px-4 py-3 text-sm font-bold text-blue-600">66</td>
                          <td className="border px-4 py-3 text-sm">68</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Electrical Engineering</td>
                          <td className="border px-4 py-3 text-sm font-bold text-green-600">100</td>
                          <td className="border px-4 py-3 text-sm font-bold text-blue-600">418</td>
                          <td className="border px-4 py-3 text-sm">464</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Mechanical Engineering</td>
                          <td className="border px-4 py-3 text-sm font-bold text-green-600">800</td>
                          <td className="border px-4 py-3 text-sm font-bold text-blue-600">1766</td>
                          <td className="border px-4 py-3 text-sm">1685</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* PLACEMENT */}
                <section id="placement" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                  <h2 className="text-2xl font-bold mb-3">{college.name} Placement 2024</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    As per the {college.name} Placement report, the average package stood at <strong>INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '23.5'} LPA</strong>. 
                    The institute secured offers from top recruiters across various sectors.
                  </p>

                  {(college.placement || college.placements) && (
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
                  )}

                  <h3 className="text-xl font-bold mb-3">Placement Statistics</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Particulars</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">2024</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(college.placement?.students_participated || college.placements?.students_participated) && (
                          <tr className="hover:bg-gray-50">
                            <td className="border px-4 py-3 text-sm">Students Participated</td>
                            <td className="border px-4 py-3 text-sm font-semibold">
                              {college.placement?.students_participated || college.placements?.students_participated}
                            </td>
                          </tr>
                        )}
                        {(college.placement?.companies_participated || college.placements?.companies_participated) && (
                          <tr className="hover:bg-gray-50">
                            <td className="border px-4 py-3 text-sm">Companies Participated</td>
                            <td className="border px-4 py-3 text-sm font-semibold">
                              {college.placement?.companies_participated || college.placements?.companies_participated}
                            </td>
                          </tr>
                        )}
                        {(college.placement?.total_offers || college.placements?.total_offers) && (
                          <tr className="hover:bg-gray-50">
                            <td className="border px-4 py-3 text-sm">Total Offers</td>
                            <td className="border px-4 py-3 text-sm font-semibold">
                              {college.placement?.total_offers || college.placements?.total_offers}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {(college.placement?.top_recruiters || college.placements?.top_recruiters)?.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold mb-3">Top Recruiters</h3>
                      <div className="flex flex-wrap gap-2">
                        {(college.placement?.top_recruiters || college.placements?.top_recruiters).map((company, idx) => (
                          <span key={idx} className="px-4 py-2 bg-gray-100 border rounded-lg text-sm font-medium text-gray-700">
                            {company}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </section>

                {/* RANKING */}
                <section id="ranking" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                  <h2 className="text-2xl font-bold mb-3">{college.name} Ranking 2025</h2>
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
                                <td className="border px-4 py-3 text-sm">2025</td>
                                <td className="border px-4 py-3 text-sm">Overall</td>
                                <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{college.nirf_ranking}</td>
                              </tr>
                            )}
                            {college.india_today_ranking && (
                              <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-3 text-sm font-semibold">India Today</td>
                                <td className="border px-4 py-3 text-sm">2025</td>
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

                {/* SCHOLARSHIP */}
                <section id="scholarship" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                  <h2 className="text-2xl font-bold mb-3">{college.name} Scholarships 2026</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    {college.name} offers various scholarships to support students financially. The details are mentioned below:
                  </p>

                  {college.scholarships && college.scholarships.length > 0 ? (
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
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No scholarship information available
                    </div>
                  )}

                  {/* Q&A */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
                    <p className="text-sm font-bold mb-2">Ques. How to apply for scholarships at {college.name}?</p>
                    <p className="text-sm text-gray-700">
                      <strong>Ans.</strong> Students can apply for scholarships through the institute's portal. Most scholarships are automatically considered based on JEE rank and family income.
                    </p>
                  </div>
                </section>

                {/* FACILITIES */}
                <section id="facilities" className={college?.menu_config?.auto_from_toc ? 'hidden' : ''}>
                  <h2 className="text-2xl font-bold mb-3">{college.name} Campus & Facilities</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    {college.name} campus provides world-class facilities and infrastructure for students. Major facilities are highlighted below:
                  </p>

                  {college.facilities && college.facilities.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {college.facilities.map((facility, idx) => {
                        const isObject = typeof facility === 'object';
                        const facilityName = isObject ? facility.name : facility;
                        const facilityData = getFacilityIcon(facilityName);
                        const IconComponent = facilityData.icon;
                        
                        return (
                          <div 
                            key={idx} 
                            className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                          >
                            <div className={`w-14 h-14 ${facilityData.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                              <IconComponent className="text-white" size={26} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 text-center group-hover:text-orange-600 transition-colors">
                              {facilityData.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No facility information available
                    </div>
                  )}

                  {/* Campus Images */}
                  {(college.campus_images?.length > 0 || college.images?.length > 1) && (
                    <div className="grid grid-cols-3 gap-4 mt-6 mb-8">
                      {(college.campus_images || college.images.slice(1)).slice(0, 6).map((img, i) => (
                        <div key={i} className="rounded-lg aspect-video overflow-hidden border">
                          <img src={img} alt={`Campus ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CAMPUS VIDEO */}
                  {(college.campus_video_url || college.seo_video_url || college.videos?.[0]) && (
                    <div className="mt-8">
                      <h3 className="text-2xl font-bold mb-4">Campus Video Tour</h3>
                      <div className="rounded-lg aspect-video overflow-hidden border">
                        <iframe
                          src={college.campus_video_url || college.seo_video_url || college.videos?.[0]}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </section>

                {/* Q&A SECTION */}
                <section id="qna">
                  <h2 className="text-2xl font-bold mb-3">{college.name} Questions & Answers</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    Have questions about {college.name}? Ask here and get answers from students, alumni, and experts.
                  </p>

                  {/* Ask Question Form */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4">Ask Your Question</h3>
                    <textarea
                      placeholder="Type your question here..."
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="3"
                    ></textarea>
                    <Button 
                      onClick={handleAskQuestion}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Submit Question
                    </Button>
                  </div>

                  {/* Recent Q&A */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Recent Questions</h3>
                    
                    <div className="bg-white border rounded-lg p-5">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            S
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">What is the hostel fee structure?</p>
                          <p className="text-xs text-gray-500 mb-3">Asked by Student123 • 2 days ago</p>
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Answer:</strong> The hostel fee is approximately INR 17,250 per semester which includes accommodation and basic facilities. Mess charges are separate and vary between INR 3,000-4,000 per month.
                            </p>
                            <p className="text-xs text-gray-500">Answered by Alumni • 1 day ago</p>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <button onClick={handleReply} className="text-sm text-blue-600 hover:underline">Reply</button>
                            <button onClick={handleQALike} className="text-sm text-gray-600 hover:text-gray-800">👍 12</button>
                            <button className="text-sm text-gray-600 hover:text-gray-800">Share</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-5">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                            R
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">How is the placement scenario for CSE branch?</p>
                          <p className="text-xs text-gray-500 mb-3">Asked by Rahul • 5 days ago</p>
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Answer:</strong> CSE branch has excellent placements with average package of 25+ LPA. Top companies like Google, Microsoft, Amazon regularly visit for placements.
                            </p>
                            <p className="text-xs text-gray-500">Answered by Current Student • 4 days ago</p>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <button onClick={handleReply} className="text-sm text-blue-600 hover:underline">Reply</button>
                            <button onClick={handleQALike} className="text-sm text-gray-600 hover:text-gray-800">👍 28</button>
                            <button className="text-sm text-gray-600 hover:text-gray-800">Share</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                        View All Questions
                      </Button>
                    </div>
                  </div>
                </section>

                {/* FAQ SECTION */}
                <section id="faq">
                  <h2 className="text-2xl font-bold mb-3">{college.name} Frequently Asked Questions (FAQs)</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    Find answers to commonly asked questions about {college.name}:
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        question: 'What is the admission process for B.Tech?',
                        answer: 'Admission to B.Tech is through JEE Advanced followed by JoSAA counselling. Candidates must have 75% marks in 10+2 with PCM.'
                      },
                      {
                        question: 'What are the hostel facilities available?',
                        answer: 'The institute has 17 hostels with separate facilities for boys and girls. Each hostel has mess, recreation room, and 24/7 security. Hostel fee is approximately INR 17,250 per semester.'
                      },
                      {
                        question: 'What is the fee structure for different courses?',
                        answer: 'B.Tech: ₹2.00 Lakhs per year, M.Tech: ₹72,000 per year, MBA: ₹7.68 Lakhs per year. Additional charges for hostel and mess are separate.'
                      },
                      {
                        question: 'How are the placement opportunities?',
                        answer: 'The institute has excellent placement record with average package of INR 23.5 LPA and highest package going up to INR 50+ LPA. Top companies like Google, Microsoft, Amazon visit regularly.'
                      },
                      {
                        question: 'What scholarships are available?',
                        answer: 'Various scholarships including Merit Cum Means Scholarship, SC/ST/OBC scholarships, Aditya Birla Scholarship, and INSPIRE Scholarship are available for deserving students.'
                      },
                      {
                        question: 'Is there any entrance exam for MBA admission?',
                        answer: 'Yes, admission to MBA program is through CAT exam followed by Group Discussion and Personal Interview rounds.'
                      },
                      {
                        question: 'What is the student-faculty ratio?',
                        answer: 'The institute maintains an excellent student-faculty ratio of approximately 10:1 ensuring personalized attention and quality education.'
                      },
                      {
                        question: 'Are there research opportunities for students?',
                        answer: 'Yes, the institute provides extensive research opportunities with state-of-the-art labs and funding support for innovative projects.'
                      }
                    ].map((faq, index) => (
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

                {/* REVIEWS */}
                <section id="reviews" className="mt-8">
                  <ReviewsSection 
                    entityId={college?.id} 
                    entityType="college" 
                    entityName={college?.name}
                  />
                </section>

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

                {/* LOCATION & MAP */}
                <section id="location">
                  <h2 className="text-2xl font-bold mb-3">{college.name} Location & Address</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    Find {college.name} on the map and get complete address details:
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Address Details */}
                    <div className="lg:col-span-1">
                      <div className="bg-white border rounded-lg p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg mb-3 text-gray-900">Address</h3>
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
                                <p className="text-sm text-gray-600">India - {college.location?.pincode || '400076'}</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <FiPhone className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                              <div>
                                <p className="text-sm text-gray-700 font-medium">Phone</p>
                                <p className="text-sm text-gray-600">{college.contact_info?.phone || '+91 22-2576-7000'}</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <FiMail className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                              <div>
                                <p className="text-sm text-gray-700 font-medium">Email</p>
                                <p className="text-sm text-gray-600">
                                  {college.contact_info?.email || `info@${college.name.toLowerCase().replace(/\s+/g, '')}.edu`}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <FiGlobe className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                              <div>
                                <p className="text-sm text-gray-700 font-medium">Website</p>
                                <a href={college.contact_info?.website || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                  {college.contact_info?.website || `www.${college.name.toLowerCase().replace(/\s+/g, '')}.ac.in`}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="font-bold text-sm mb-2 text-gray-900">How to Reach</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>• <strong>By Metro:</strong> Nearest metro station is 2 km away</p>
                            <p>• <strong>By Bus:</strong> Well connected by local buses</p>
                            <p>• <strong>By Train:</strong> {college.location?.city} Railway Station - 5 km</p>
                          </div>
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

                  {/* Nearby Places */}
                  <div className="mt-6 bg-gray-50 border rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">Nearby Places</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🏥</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Hospital</p>
                          <p className="text-xs text-gray-600">City Hospital - 1.5 km</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🏦</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Bank</p>
                          <p className="text-xs text-gray-600">SBI Bank - 800 m</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🏪</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Market</p>
                          <p className="text-xs text-gray-600">Shopping Complex - 2 km</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🚉</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Metro Station</p>
                          <p className="text-xs text-gray-600">Central Metro - 2 km</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">✈️</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Airport</p>
                          <p className="text-xs text-gray-600">International Airport - 15 km</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🍽️</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Restaurants</p>
                          <p className="text-xs text-gray-600">Food Court - 500 m</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <p className="text-xs text-orange-100 mt-3">Application Deadline: March 2026</p>
                </div>
              </div>

              {/* ADVERTISEMENT 1 */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="font-bold text-lg mb-2">Get Expert Guidance</h3>
                  <p className="text-sm text-orange-100 mb-4">Connect with our counselors for FREE admission guidance</p>
                  <button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 rounded transition-colors">
                    Talk to Expert
                  </button>
                </div>
              </div>

              {/* POPULAR COURSES */}
              <div className="bg-white border rounded-lg shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 text-gray-900">Popular Full Time Courses</h3>
                <div className="space-y-4">
                  {[
                    { name: 'B.Tech', views: '14.4K', fees: college.average_fees },
                    { name: 'M.Tech', views: '14.4K', fees: 144000 },
                    { name: 'MBA', views: '14.4K', fees: 768000 }
                  ].map((course, i) => (
                    <div key={course.name} className={`pb-4 ${i !== 2 ? 'border-b border-gray-200' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <Link to="#" className="text-sm font-bold text-blue-600 hover:underline">
                          {course.name}
                        </Link>
                        <span className="text-[11px] text-gray-500">({course.views} Views)</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-3 font-medium">
                        ₹{(course.fees / 100000).toFixed(2)} Lakhs
                      </p>
                      <button 
                        onClick={() => setShowApplyModal(true)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2.5 rounded transition-colors"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADVERTISEMENT 2 */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="font-bold text-lg mb-2">Download Brochure</h3>
                  <p className="text-sm text-blue-100 mb-4">Get complete course details and admission information</p>
                  <button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-2.5 rounded transition-colors">
                    Download Now
                  </button>
                </div>
              </div>

              {/* SIMILAR COLLEGES */}
              <div className="bg-white border rounded-lg shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 text-gray-900">Similar Colleges</h3>
                <div className="space-y-4">
                  {[
                    { name: 'IIT Delhi', location: 'New Delhi, Delhi', fees: '2.54' },
                    { name: 'IIT Madras', location: 'Chennai, Tamil Nadu', fees: '2.25' },
                    { name: 'IIT Kanpur', location: 'Kanpur, Uttar Pradesh', fees: '2.18' }
                  ].map((item, i) => (
                    <div key={i} className={`${i !== 2 ? 'pb-4 border-b border-gray-200' : ''}`}>
                      <Link to="#" className="block hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-blue-700">{item.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 mb-1 truncate">{item.name}</p>
                            <p className="text-[11px] text-gray-600 mb-1">{item.location}</p>
                            <p className="text-xs font-semibold text-orange-600">₹{item.fees}L Fees</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADVERTISEMENT 3 */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-3">💼</div>
                  <h3 className="font-bold text-lg mb-2">Career Counseling</h3>
                  <p className="text-sm text-green-100 mb-4">Get personalized career guidance from experts</p>
                  <button className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-2.5 rounded transition-colors">
                    Book Session
                  </button>
                </div>
              </div>

              {/* LATEST NEWS */}
              <div className="bg-white border rounded-lg shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 text-gray-900">Latest News</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Admission 2026 Opens', date: 'Dec 12, 2025' },
                    { title: 'Placement Results Announced', date: 'Dec 6, 2025' },
                    { title: 'New Course Launch', date: 'Nov 28, 2025' }
                  ].map((news, i) => (
                    <div key={i} className={`${i !== 2 ? 'pb-4 border-b border-gray-200' : ''}`}>
                      <Link to="#" className="block hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
                        <p className="text-sm text-blue-600 hover:underline font-medium mb-1 line-clamp-2">
                          {college.name} {news.title}
                        </p>
                        <p className="text-[11px] text-gray-500">{news.date}</p>
                      </Link>
                    </div>
                  ))}
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
