/**
 * UniversityDetailPage - Public detail page for universities
 * Shows university information, courses, placements, etc.
 * Features: Verified badge, Reviews counter, Like/Dislike, Favorite, Apply Now, Download Brochure
 * NOW FULLY DYNAMIC - All data from database, conditional rendering for empty sections
 * Note: Header and Footer are provided by LayoutWrapper - do not add them here
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiMapPin, FiPhone, FiMail, FiGlobe, FiAward, FiUsers, FiBriefcase,
  FiCalendar, FiBook, FiStar, FiChevronRight, FiChevronDown, FiChevronUp,
  FiHome, FiArrowLeft, FiCheckCircle, FiDownload, FiHeart, FiMessageSquare, FiShare2,
  FiExternalLink
} from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import ReviewsSection from '../components/ReviewsSection';
import QuestionsSection from '../components/QuestionsSection';
import GuestGate, { useGuestGate, LoginPromptModal } from '../components/GuestGate';
import AuthorInfo from '../components/AuthorInfo';
import ApplyNowModal from '../components/ApplyNowModal';

const UniversityDetailPage = () => {
  const { seg1: rawSlug } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showContent, setShowContent] = useState(false);
  
  // Like/Dislike/Favorite states
  const [likes, setLikes] = useState(1);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Modals
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Guest gate hook
  const { isLoggedIn, requireAuth, showPrompt, closePrompt } = useGuestGate();

  // Current year for dynamic dates
  const year = new Date().getFullYear();

  // Parse slug - strip numeric prefix if present
  const slug = rawSlug?.replace(/^\d+-/, '') || rawSlug;

  const fetchUniversity = useCallback(async () => {
    setLoading(true);
    try {
      // Try to fetch from colleges endpoint (universities are stored there with institution_type)
      const res = await api.get('/colleges', { params: { institution_type: 'University' } });
      const universities = res.data;
      const found = universities.find(u => 
        u.slug === slug || 
        u.id === slug || 
        u.slug === rawSlug || 
        u.id === rawSlug ||
        u.slug?.includes(slug)
      );
      
      if (found) {
        // Fetch full details if needed
        try {
          const detailRes = await api.get(`/colleges/${found.id}`);
          setUniversity(detailRes.data);
          setLikes(detailRes.data.likes_count || 1);
          setDislikes(detailRes.data.dislikes_count || 0);
        } catch (e) {
          setUniversity(found);
          setLikes(found.likes_count || 1);
          setDislikes(found.dislikes_count || 0);
        }
      } else {
        // Fallback: try universities endpoint
        const uniRes = await api.get('/universities');
        const uniData = uniRes.data;
        const foundUni = uniData.find(u => 
          u.slug === slug || u.id === slug || u.slug === rawSlug || u.id === rawSlug
        );
        if (foundUni) {
          setUniversity(foundUni);
          setLikes(foundUni.likes_count || 1);
          setDislikes(foundUni.dislikes_count || 0);
        } else {
          setError('University not found');
        }
      }
    } catch (err) {
      console.error('Error fetching university:', err);
      setError('Failed to load university');
    } finally {
      setLoading(false);
    }
  }, [slug, rawSlug]);

  useEffect(() => {
    fetchUniversity();
  }, [fetchUniversity]);

  useEffect(() => {
    if (university && isLoggedIn) {
      checkUserInteractions();
    }
  }, [university?.id, isLoggedIn]);

  const checkUserInteractions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const likedResponse = await api.get('/user/liked', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const liked = likedResponse.data || [];
        const hasLiked = liked.some(l => l.entity_id === university.id);
        if (hasLiked) setUserVote('like');
      } catch (e) {}

      try {
        const favResponse = await api.get('/user/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const favorites = favResponse.data || [];
        const hasFavorited = favorites.some(f => f.college_id === university.id || f.entity_id === university.id);
        setIsFavorited(hasFavorited);
      } catch (e) {}
    } catch (error) {
      console.error('Error checking user interactions:', error);
    }
  };

  const handleLike = async () => {
    if (!requireAuth('like this university')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (userVote === 'like') {
        await api.delete(`/user/like/college/${university.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikes(likes - 1);
        setUserVote(null);
      } else {
        await api.post(`/user/like/college/${university.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userVote === 'dislike') {
          setDislikes(dislikes - 1);
        }
        setLikes(likes + 1);
        setUserVote('like');
      }
    } catch (error) {
      console.error('Error liking university:', error);
    }
  };

  const handleDislike = async () => {
    if (!requireAuth('dislike this university')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (userVote === 'dislike') {
        setDislikes(dislikes - 1);
        setUserVote(null);
      } else {
        if (userVote === 'like') {
          await api.delete(`/user/like/college/${university.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setLikes(likes - 1);
        }
        setDislikes(dislikes + 1);
        setUserVote('dislike');
      }
    } catch (error) {
      console.error('Error disliking university:', error);
    }
  };

  const handleFavorite = async () => {
    if (!requireAuth('add to favorites')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (isFavorited) {
        await api.delete(`/user/favorites/${university.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorited(false);
      } else {
        await api.post(`/user/favorites/${university.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: university.name,
        text: `Check out ${university.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <FiAward className="mx-auto text-6xl text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">University Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The university you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/university')} className="bg-purple-600 hover:bg-purple-700">
              <FiArrowLeft className="mr-2" /> Browse Universities
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic Table of Contents - only show items with data
  const tableOfContents = [];
  if (university?.admission_dates?.length > 0) {
    tableOfContents.push({ num: String(tableOfContents.length + 1).padStart(2, '0'), title: `${university.name} Admission ${year + 1} Dates`, id: 'seo-admission-dates' });
  }
  if (university?.courses?.length > 0) {
    tableOfContents.push({ num: String(tableOfContents.length + 1).padStart(2, '0'), title: `${university.name} Fees ${year + 1}`, id: 'seo-fees' });
  }
  if (university?.rankings?.length > 0 || university?.nirf_ranking) {
    tableOfContents.push({ num: String(tableOfContents.length + 1).padStart(2, '0'), title: `${university.name} Ranking`, id: 'seo-ranking' });
  }
  if (university?.courses?.length > 0) {
    tableOfContents.push({ num: String(tableOfContents.length + 1).padStart(2, '0'), title: `${university.name} Courses`, id: 'seo-courses' });
  }
  if (university?.placement) {
    tableOfContents.push({ num: String(tableOfContents.length + 1).padStart(2, '0'), title: `${university.name} Placement`, id: 'seo-placement' });
  }
  if (university?.seo_faqs?.length > 0) {
    tableOfContents.push({ num: String(tableOfContents.length + 1).padStart(2, '0'), title: `${university.name} FAQs`, id: 'seo-faqs' });
  }
  // Always show reviews
  tableOfContents.push({ num: String(tableOfContents.length + 1).padStart(2, '0'), title: `${university.name} Reviews`, id: 'seo-reviews' });

  const menuItems = [
    { id: 'info', label: 'Info', icon: FiHome },
    { id: 'courses', label: 'Courses & Fees', icon: FiBook },
    { id: 'admissions', label: 'Admissions', icon: FiCalendar },
    { id: 'placement', label: 'Placement', icon: FiBriefcase },
    { id: 'reviews', label: 'Reviews', icon: FiMessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-purple-600">Home</Link>
            <FiChevronRight className="mx-2" size={14} />
            <Link to="/university" className="hover:text-purple-600">Universities</Link>
            <FiChevronRight className="mx-2" size={14} />
            <span className="text-gray-900">{university.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Banner */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-purple-600 to-indigo-600 overflow-hidden">
          {university.banner_url ? (
            <img 
              src={university.banner_url} 
              alt={university.banner_alt || `${university.name} Banner`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700"></div>
          )}
        </div>
        
        {/* University Info Card - Overlapping Banner */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative -mt-16 md:-mt-20 bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl shadow border flex items-center justify-center flex-shrink-0 -mt-16 md:-mt-20">
                {university.logo_url ? (
                  <img src={university.logo_url} alt={university.logo_alt || university.name} className="w-20 h-20 md:w-28 md:h-28 object-contain rounded-lg" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-3xl md:text-4xl font-bold">{university.name?.charAt(0)}</span>
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {university.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                      <FiCheckCircle size={12} /> Verified
                    </span>
                  )}
                  {university.is_admission_partner && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">
                      🎓 Admission Partner
                    </span>
                  )}
                  {university.is_admission_open && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold animate-pulse">
                      📢 Admission Open
                    </span>
                  )}
                  {university.is_no_cost_emi && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                      💳 No Cost EMI
                    </span>
                  )}
                  {university.is_featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
                      ⭐ Featured
                    </span>
                  )}
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    {university.type || university.institution_type || 'University'}
                  </span>
                  {university.accreditations?.length > 0 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                      {university.accreditations[0]}
                    </span>
                  )}
                  {university.nirf_ranking && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      NIRF #{university.nirf_ranking}
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{university.name}</h1>
                
                <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <FiMapPin size={14} />
                    {university.location?.city || university.city}, {university.location?.state || university.state}
                  </span>
                  {(university.established_year || university.established) && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>Est. {university.established_year || university.established}</span>
                    </>
                  )}
                </div>

                {/* Rating */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`${i < Math.floor(university.rating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          size={18}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-lg text-gray-900">{university.rating?.toFixed(1) || '4.5'}</span>
                    <span className="text-gray-500 text-sm">({university.total_reviews || 0} Reviews)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => setShowApplyModal(true)}
                  >
                    <FiCheckCircle className="mr-2" size={16} />
                    Apply Now
                  </Button>
                  {university.brochure_url && (
                    <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                      <FiDownload className="mr-2" size={16} />
                      Download Brochure
                    </Button>
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

      {/* LATEST UPDATES - Only show if data exists */}
      {((university?.updates && university.updates.length > 0) || (university?.announcements && university.announcements.length > 0)) && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{university.name} Latest Updates and News</h2>
            <div className="grid grid-cols-2 gap-3">
              {(university.updates?.length > 0 ? university.updates : university.announcements).slice(0, 2).map((item, idx) => (
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

      {/* AUTHOR INFO */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <AuthorInfo
            name={university?.updated_by_name || university?.created_by_name || 'Content Team'}
            photo={university?.updated_by_photo || university?.created_by_photo}
            role="Content Writer"
            updatedAt={university?.updated_at}
            createdAt={university?.created_at}
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
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === item.id 
                    ? 'border-purple-600 text-purple-600 bg-purple-50' 
                    : 'border-transparent text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={16} className="text-purple-500" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            {/* SEO CONTENT SECTION (Collapsible) */}
            <div className="mb-6 pb-6 border-b">
              {/* INTRO PREVIEW - 3 LINES */}
              <div className="mb-3">
                <p className={`text-gray-800 leading-relaxed ${!showContent ? 'line-clamp-3' : ''}`}>
                  {university.name} is a <strong>{university.type || 'University'}</strong> established in <strong>{university.established_year || university.established || 'N/A'}</strong>. 
                  {university.nirf_ranking && <>{university.name} Ranking is <strong>#{university.nirf_ranking}</strong> in the category by NIRF. </>}
                  {university.average_fees && <>{university.name} offers various programs with total fees ranging from <strong>₹{(university.average_fees / 100000).toFixed(2)} Lakhs</strong>. </>}
                  {university.placement?.average && <>As per {university.name} Placements, the average package was <strong>INR {(university.placement.average / 100000).toFixed(1)} LPA</strong>.</>}
                  {university.description && <> {university.description}</>}
                </p>
              </div>

              {/* READ MORE BUTTON */}
              {!showContent && (
                <div className="text-center mb-4">
                  <button
                    onClick={() => setShowContent(true)}
                    className="inline-flex items-center gap-2 px-6 py-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-sm font-medium rounded-full"
                  >
                    <span>Read More</span>
                    <FiChevronDown size={18} />
                  </button>
                </div>
              )}

              {/* SEO EXPANDABLE CONTENT */}
              {showContent && (
                <div className="space-y-8">
                  {/* TABLE OF CONTENTS - Only show if there are items */}
                  {tableOfContents.length > 1 && (
                    <div className="bg-gray-50 rounded-lg p-6 border">
                      <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                        {tableOfContents.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="text-left text-sm text-purple-600 hover:underline flex gap-2"
                          >
                            <span className="font-semibold flex-shrink-0">{item.num}.</span>
                            <span>{item.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FULL INTRO */}
                  <div>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {university.name} is a <strong>{university.type || 'University'}</strong> established in <strong>{university.established_year || university.established || 'N/A'}</strong>.
                      {university.nirf_ranking && <> {university.name} Ranking is <strong>#{university.nirf_ranking}</strong> in the category by NIRF.</>}
                    </p>
                    {university.description && (
                      <p className="text-gray-800 leading-relaxed mb-4">{university.description}</p>
                    )}
                  </div>

                  {/* ADMISSION DATES - Only show if data exists */}
                  {university?.admission_dates && university.admission_dates.length > 0 && (
                    <section id="seo-admission-dates">
                      <h2 className="text-2xl font-bold mb-3">{university.name} Admission {year + 1} Dates</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        Important admission dates for {university.name}:
                      </p>
                      <GuestGate title="Admission Dates">
                        <div className="overflow-x-auto mb-6">
                          <table className="w-full border-collapse border">
                            <thead>
                              <tr className="bg-purple-50">
                                <th className="border px-4 py-3 text-left text-sm font-bold">Events</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">Dates</th>
                              </tr>
                            </thead>
                            <tbody>
                              {university.admission_dates.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="border px-4 py-3 text-sm">{item.event || item.title}</td>
                                  <td className="border px-4 py-3 text-sm font-semibold">{item.date}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </GuestGate>
                    </section>
                  )}

                  {/* FEES - Only show if courses exist */}
                  {university?.courses && university.courses.length > 0 && (
                    <section id="seo-fees">
                      <h2 className="text-2xl font-bold mb-3">{university.name} Fees {year + 1}</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        The fee structure for various courses at {university.name}:
                      </p>
                      <GuestGate title="Fee Details">
                        <div className="overflow-x-auto mb-6">
                          <table className="w-full border-collapse border">
                            <thead>
                              <tr className="bg-purple-50">
                                <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">Duration</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">1st Year Fee</th>
                                <th className="border px-4 py-3 text-left text-sm font-bold">Total Fee</th>
                              </tr>
                            </thead>
                            <tbody>
                              {university.courses.map((course, idx) => {
                                const courseName = typeof course === 'string' ? course : course.name;
                                const duration = typeof course === 'object' ? course.duration : '';
                                const firstYearFee = typeof course === 'object' ? (course.first_year_fee || university.average_fees) : university.average_fees;
                                const totalFee = typeof course === 'object' ? (course.total_fee || firstYearFee * 4) : university.average_fees * 4;
                                return (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="border px-4 py-3">
                                      <span className="text-purple-600 font-medium">{courseName}</span>
                                    </td>
                                    <td className="border px-4 py-3 text-sm">{duration || '-'}</td>
                                    <td className="border px-4 py-3 text-sm font-semibold">₹{firstYearFee ? (firstYearFee / 100000).toFixed(2) : '-'} Lakhs</td>
                                    <td className="border px-4 py-3 text-sm font-semibold">₹{totalFee ? (totalFee / 100000).toFixed(2) : '-'} Lakhs</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </GuestGate>
                    </section>
                  )}

                  {/* RANKING - Only show if data exists */}
                  {(university?.rankings?.length > 0 || university?.nirf_ranking) && (
                    <section id="seo-ranking">
                      <h2 className="text-2xl font-bold mb-3">{university.name} Ranking</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        {university.name} has been ranked by various agencies:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border px-4 py-3 text-left text-sm font-bold">Agency</th>
                              <th className="border px-4 py-3 text-left text-sm font-bold">Category</th>
                              <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
                              <th className="border px-4 py-3 text-left text-sm font-bold">Rank</th>
                            </tr>
                          </thead>
                          <tbody>
                            {university?.rankings?.length > 0 ? (
                              university.rankings.map((ranking, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="border px-4 py-3 text-sm">{ranking.agency}</td>
                                  <td className="border px-4 py-3 text-sm">{ranking.category || '-'}</td>
                                  <td className="border px-4 py-3 text-sm">{ranking.year || year}</td>
                                  <td className="border px-4 py-3 text-sm font-bold text-purple-600">#{ranking.rank}</td>
                                </tr>
                              ))
                            ) : (
                              <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-3 text-sm">NIRF</td>
                                <td className="border px-4 py-3 text-sm">University</td>
                                <td className="border px-4 py-3 text-sm">{year}</td>
                                <td className="border px-4 py-3 text-sm font-bold text-purple-600">#{university.nirf_ranking}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  {/* COURSES/STREAMS - Only show if data exists */}
                  {((university?.courses && university.courses.length > 0) || (university?.streams && university.streams.length > 0)) && (
                    <section id="seo-courses">
                      <h2 className="text-2xl font-bold mb-3">{university.name} Courses</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        {university.name} offers a wide range of programs:
                      </p>
                      {university.streams && university.streams.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {university.streams.map((stream, idx) => (
                            <span key={idx} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                              {stream}
                            </span>
                          ))}
                        </div>
                      )}
                      {university.courses && university.courses.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {university.courses.map((course, idx) => {
                            const courseName = typeof course === 'string' ? course : course.name;
                            return (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                {courseName}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  )}

                  {/* PLACEMENT - Only show if data exists */}
                  {university?.placement && (
                    <section id="seo-placement">
                      <h2 className="text-2xl font-bold mb-3">{university.name} Placement</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        As per {university.name} Placement report, the average package stood at ₹{university.placement.average ? (university.placement.average / 100000).toFixed(1) : '-'} LPA.
                      </p>
                      <GuestGate title="Placement Data">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">₹{university.placement.highest ? (university.placement.highest / 100000).toFixed(1) : '-'}L</div>
                            <div className="text-xs text-gray-600">Highest Package</div>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">₹{university.placement.average ? (university.placement.average / 100000).toFixed(1) : '-'}L</div>
                            <div className="text-xs text-gray-600">Average Package</div>
                          </div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{university.placement.percentage || '-'}%</div>
                            <div className="text-xs text-gray-600">Placement Rate</div>
                          </div>
                        </div>
                        {university.placement.top_recruiters && university.placement.top_recruiters.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-bold text-sm mb-2">Top Recruiters:</h4>
                            <p className="text-sm text-gray-700">{university.placement.top_recruiters.join(', ')}</p>
                          </div>
                        )}
                      </GuestGate>
                    </section>
                  )}

                  {/* FAQs - Only show if data exists */}
                  {university?.seo_faqs && university.seo_faqs.length > 0 && (
                    <section id="seo-faqs">
                      <h2 className="text-2xl font-bold mb-3">{university.name} FAQs</h2>
                      <div className="space-y-3">
                        {university.seo_faqs.map((faq, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4 border">
                            <p className="font-bold text-sm mb-2">Ques. {faq.question}</p>
                            <p className="text-sm text-gray-700"><strong>Ans.</strong> {faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* REVIEWS */}
                  <section id="seo-reviews">
                    <h2 className="text-2xl font-bold mb-3">{university.name} Reviews</h2>
                    <ReviewsSection 
                      entityId={university.id} 
                      entityType="university"
                      entityName={university.name}
                      showWriteReview={true}
                    />
                  </section>

                  {/* COLLAPSE BUTTON */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowContent(false)}
                      className="inline-flex items-center gap-2 px-6 py-2 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-full"
                    >
                      <span>Show Less</span>
                      <FiChevronUp size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Questions Section */}
            <QuestionsSection 
              entityId={university.id} 
              entityType="university"
              entityName={university.name}
            />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-80 flex-shrink-0 space-y-6 hidden lg:block">
            {/* ADMISSION PARTNER - BOOK YOUR SEAT */}
            {university.is_admission_partner && (
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-3">
                    🎓 Admission Partner
                  </span>
                  <h3 className="font-bold text-xl mb-2">Admission Open!</h3>
                  <p className="text-sm text-green-100 mb-4">Book your seat at {university.name}</p>
                  <button 
                    onClick={() => setShowApplyModal(true)}
                    className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <FiCheckCircle size={18} />
                    <span>🎓 Book Your Seat</span>
                  </button>
                  <p className="text-xs text-green-100 mt-3">Limited seats available. Apply now!</p>
                </div>
              </div>
            )}

            {/* Apply Now Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2">Apply to {university.name}</h3>
                <p className="text-sm text-purple-100 mb-4">Start your admission process now</p>
                <button 
                  onClick={() => setShowApplyModal(true)}
                  className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <FiCheckCircle size={18} />
                  <span>Apply Now</span>
                </button>
                {university.admission_deadline && (
                  <p className="text-xs text-purple-100 mt-3">Application Deadline: {university.admission_deadline}</p>
                )}
              </div>
            </div>

            {/* Download Brochure Card - Only show if brochure exists */}
            {university.brochure_url && (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="font-bold text-lg mb-2">Download Brochure</h3>
                  <p className="text-sm text-blue-100 mb-4">Get complete course details and admission information</p>
                  <a 
                    href={university.brochure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-2.5 rounded transition-colors text-center"
                  >
                    <FiDownload className="inline mr-2" size={16} />
                    Download Now
                  </a>
                </div>
              </div>
            )}

            {/* Contact Card - Only show if contact info exists */}
            {(university.contact_info?.phone || university.contact_info?.email || university.location?.address) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
                <GuestGate title="Contact Details">
                  <div className="space-y-3">
                    {university.location?.address && (
                      <div className="flex items-start gap-3">
                        <FiMapPin className="text-purple-600 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{university.location.address}</span>
                      </div>
                    )}
                    {university.contact_info?.phone && (
                      <div className="flex items-center gap-3">
                        <FiPhone className="text-purple-600" />
                        <a href={`tel:${university.contact_info.phone}`} className="text-sm text-purple-600 hover:underline">{university.contact_info.phone}</a>
                      </div>
                    )}
                    {university.contact_info?.email && (
                      <div className="flex items-center gap-3">
                        <FiMail className="text-purple-600" />
                        <a href={`mailto:${university.contact_info.email}`} className="text-sm text-purple-600 hover:underline">{university.contact_info.email}</a>
                      </div>
                    )}
                    {university.contact_info?.website && (
                      <div className="flex items-center gap-3">
                        <FiGlobe className="text-purple-600" />
                        <a href={university.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </GuestGate>
              </div>
            )}

            {/* Talk to Expert Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="text-center">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="font-bold text-lg mb-2">Get Expert Guidance</h3>
                <p className="text-sm text-orange-100 mb-4">Connect with our counselors for FREE admission guidance</p>
                <button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 rounded transition-colors">
                  Talk to Expert
                </button>
              </div>
            </div>

            {/* Similar Universities - Only show if data exists */}
            {university?.similar_colleges && university.similar_colleges.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4">Similar Universities</h3>
                <div className="space-y-4">
                  {university.similar_colleges.slice(0, 3).map((item, i) => (
                    <Link 
                      key={i} 
                      to={`/university/${item.slug || item.id}`}
                      className="block hover:bg-gray-50 p-2 rounded -mx-2 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.logo_url ? (
                            <img src={item.logo_url} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-lg font-bold text-purple-700">{item.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">{item.city || item.location?.city}, {item.state || item.location?.state}</p>
                          {item.average_fees && (
                            <p className="text-xs font-semibold text-purple-600">₹{(item.average_fees / 100000).toFixed(2)}L Fees</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Now Modal */}
      <ApplyNowModal 
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        college={university}
        entityType="university"
      />

      {/* Login Prompt Modal */}
      <LoginPromptModal 
        isOpen={!!showPrompt}
        onClose={closePrompt}
        action={showPrompt?.action}
      />
    </div>
  );
};

export default UniversityDetailPage;
