/**
 * UniversityDetailPage - Public detail page for universities
 * Shows university information, courses, placements, etc.
 * Features: Verified badge, Reviews counter, Like/Dislike, Favorite, Apply Now, Download Brochure
 * Note: Header and Footer are provided by LayoutWrapper - do not add them here
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiMapPin, FiPhone, FiMail, FiGlobe, FiAward, FiUsers, FiBriefcase,
  FiCalendar, FiBook, FiStar, FiChevronRight, FiChevronDown, FiChevronUp,
  FiHome, FiArrowLeft, FiCheckCircle, FiDownload, FiHeart, FiMessageSquare, FiShare2
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
  const [showContent, setShowContent] = useState(false); // For SEO content expand/collapse
  
  // Like/Dislike/Favorite states
  const [likes, setLikes] = useState(1);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Modals
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Guest gate hook
  const { isLoggedIn, requireAuth, showPrompt, closePrompt } = useGuestGate();

  // Parse slug - strip numeric prefix if present (e.g., "000-test-university" -> "test-university")
  const slug = rawSlug?.replace(/^\d+-/, '') || rawSlug;

  useEffect(() => {
    fetchUniversity();
  }, [slug]);

  useEffect(() => {
    if (university && isLoggedIn) {
      checkUserInteractions();
    }
  }, [university, isLoggedIn]);

  const fetchUniversity = async () => {
    setLoading(true);
    try {
      const res = await api.get('/universities');
      const universities = res.data;
      const found = universities.find(u => 
        u.slug === slug || 
        u.id === slug || 
        u.slug === rawSlug || 
        u.id === rawSlug
      );
      
      if (found) {
        setUniversity(found);
        setLikes(found.likes_count || 1);
        setDislikes(found.dislikes_count || 0);
      } else {
        setError('University not found');
      }
    } catch (err) {
      console.error('Error fetching university:', err);
      setError('Failed to load university');
    } finally {
      setLoading(false);
    }
  };

  const checkUserInteractions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Check liked status
      try {
        const likedResponse = await api.get('/user/liked', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const liked = likedResponse.data || [];
        const hasLiked = liked.some(l => l.entity_id === university.id);
        if (hasLiked) setUserVote('like');
      } catch (e) {}

      // Check favorited status
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

  // Table of Contents for SEO
  const tableOfContents = [
    { num: '01', title: `${university.name} Admission 2026 Dates`, id: 'seo-admission-dates' },
    { num: '02', title: `${university.name} Fees 2026`, id: 'seo-fees' },
    { num: '03', title: `${university.name} Ranking`, id: 'seo-ranking' },
    { num: '04', title: `${university.name} Courses`, id: 'seo-courses' },
    { num: '05', title: `${university.name} Placement`, id: 'seo-placement' },
    { num: '06', title: `${university.name} Reviews`, id: 'seo-reviews' },
  ];

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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-28 h-28 bg-white rounded-xl shadow-lg flex items-center justify-center flex-shrink-0">
              {university.logo ? (
                <img src={university.logo} alt={university.name} className="w-24 h-24 object-contain rounded-lg" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{university.name?.charAt(0)}</span>
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {/* Verified Badge */}
                {university.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 rounded text-xs font-semibold">
                    <FiCheckCircle size={12} /> Verified
                  </span>
                )}
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                  {university.university_type || 'University'}
                </span>
                {university.accreditation && (
                  <span className="px-2 py-1 bg-yellow-500/30 rounded text-xs font-medium">
                    {university.accreditation}
                  </span>
                )}
                {university.nirf_rank && (
                  <span className="px-2 py-1 bg-orange-500/30 rounded text-xs font-medium">
                    NIRF #{university.nirf_rank}
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{university.name}</h1>
              
              <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm mb-4">
                <span className="flex items-center gap-1">
                  <FiMapPin size={14} />
                  {university.city}, {university.state}
                </span>
                {university.established_year && (
                  <>
                    <span className="text-white/50">|</span>
                    <span>Est. {university.established_year}</span>
                  </>
                )}
              </div>

              {/* Rating & Review Count */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`${i < Math.floor(university.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'}`}
                        size={18}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{university.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-white/80 text-sm">({university.total_reviews || 0} Reviews)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button 
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  onClick={() => setShowApplyModal(true)}
                >
                  <FiCheckCircle className="mr-2" size={16} />
                  Apply Now
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <FiDownload className="mr-2" size={16} />
                  Download Brochure
                </Button>
              </div>
            </div>

            {/* Like/Dislike/Favorite Buttons */}
            <div className="flex lg:flex-col items-center gap-2">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  userVote === 'like' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <span className="text-xl">👍</span>
                <span className="text-sm font-semibold">{Math.max(1, likes)}</span>
              </button>
              <button 
                onClick={handleDislike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  userVote === 'dislike' 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <span className="text-xl">👎</span>
                <span className="text-sm font-semibold">{Math.max(0, dislikes)}</span>
              </button>
              <button 
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isFavorited 
                    ? 'bg-pink-500 text-white shadow-md' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              >
                <FiHeart className={isFavorited ? "fill-white" : ""} size={18} />
                <span className="text-sm font-semibold">{isFavorited ? 'Saved' : 'Save'}</span>
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                <FiShare2 size={18} />
                <span className="text-sm font-semibold">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AUTHOR INFO - Above Menu */}
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
                  {university.name} is a <strong>{university.university_type || 'University'}</strong> established in <strong>{university.established_year || 'N/A'}</strong>. 
                  As per the data, the university is one of the preferred institutions for students. 
                  {university.name} Ranking is <strong>#{university.nirf_rank || Math.floor(Math.random() * 50) + 1}</strong> in the category by various ranking agencies. 
                  {university.name} offers various programs with total fees ranging from <strong>₹{((university.avg_fee || 150000) / 100000).toFixed(2)} Lakhs</strong>. 
                  Admission is based on national-level entrance exams followed by counselling. 
                  As per {university.name} Placements, the average package was <strong>INR {university.average_package || '8'} LPA</strong>. 
                  The top recruiters included leading companies from various sectors.
                </p>
              </div>

              {/* READ MORE BUTTON - Show when collapsed */}
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
                  {/* TABLE OF CONTENTS */}
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

                  {/* FULL INTRO PARAGRAPHS */}
                  <div>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {university.name} is a <strong>{university.university_type || 'University'}</strong> established in <strong>{university.established_year || 'N/A'}</strong>. 
                      As per the data, the university is one of the preferred institutions for students. 
                      {university.name} Ranking is <strong>#{university.nirf_rank || Math.floor(Math.random() * 50) + 1}</strong> in the category by various ranking agencies.
                    </p>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {university.name} offers various programs with total fees ranging from <strong>₹{((university.avg_fee || 150000) / 100000).toFixed(2)} Lakhs</strong>. 
                      Admission is based on national-level entrance exams followed by counselling.
                    </p>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      As per {university.name} Placements, the average package was <strong>INR {university.average_package || '8'} LPA</strong>. 
                      The top recruiters included leading companies from various sectors.
                    </p>
                    {university.description && (
                      <p className="text-gray-800 leading-relaxed mb-4">
                        {university.description}
                      </p>
                    )}
                  </div>

                  {/* VIDEO PLACEHOLDER */}
                  <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center border">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                      </div>
                      <p className="text-sm text-gray-600">Video: Complete Guide to {university.name}</p>
                    </div>
                  </div>

                  {/* ADMISSION DATES - Guest Gated */}
                  <section id="seo-admission-dates">
                    <h2 className="text-2xl font-bold mb-3">{university.name} Admission 2026 Dates</h2>
                    <p className="text-gray-700 text-sm mb-4">
                      {university.name} offers admission to various programs through national-level entrance exams followed by counselling rounds. The important dates are:
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

                  {/* FEES - Guest Gated */}
                  <section id="seo-fees">
                    <h2 className="text-2xl font-bold mb-3">{university.name} Fees 2026</h2>
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
                            <tr className="hover:bg-gray-50">
                              <td className="border px-4 py-3">
                                <span className="text-purple-600 font-medium">B.Tech</span>
                              </td>
                              <td className="border px-4 py-3 text-sm">4 Years</td>
                              <td className="border px-4 py-3 text-sm font-semibold">INR {((university.avg_fee || 150000) / 100000).toFixed(2)} Lakhs</td>
                              <td className="border px-4 py-3 text-sm font-semibold">INR {(((university.avg_fee || 150000) * 4) / 100000).toFixed(2)} Lakhs</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="border px-4 py-3">
                                <span className="text-purple-600 font-medium">M.Tech</span>
                              </td>
                              <td className="border px-4 py-3 text-sm">2 Years</td>
                              <td className="border px-4 py-3 text-sm font-semibold">INR {((university.avg_fee || 150000) * 1.2 / 100000).toFixed(2)} Lakhs</td>
                              <td className="border px-4 py-3 text-sm font-semibold">INR {(((university.avg_fee || 150000) * 1.2 * 2) / 100000).toFixed(2)} Lakhs</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="border px-4 py-3">
                                <span className="text-purple-600 font-medium">MBA</span>
                              </td>
                              <td className="border px-4 py-3 text-sm">2 Years</td>
                              <td className="border px-4 py-3 text-sm font-semibold">INR {((university.avg_fee || 150000) * 1.5 / 100000).toFixed(2)} Lakhs</td>
                              <td className="border px-4 py-3 text-sm font-semibold">INR {(((university.avg_fee || 150000) * 1.5 * 2) / 100000).toFixed(2)} Lakhs</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </GuestGate>
                  </section>

                  {/* RANKING */}
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
                            <th className="border px-4 py-3 text-left text-sm font-bold">Ranking</th>
                            <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-50">
                            <td className="border px-4 py-3 text-sm font-medium">NIRF</td>
                            <td className="border px-4 py-3 text-sm font-semibold">#{university.nirf_rank || 'N/A'}</td>
                            <td className="border px-4 py-3 text-sm">2025</td>
                          </tr>
                          {university.naac_grade && (
                            <tr className="hover:bg-gray-50">
                              <td className="border px-4 py-3 text-sm font-medium">NAAC</td>
                              <td className="border px-4 py-3 text-sm font-semibold">{university.naac_grade}</td>
                              <td className="border px-4 py-3 text-sm">2025</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* COURSES */}
                  <section id="seo-courses">
                    <h2 className="text-2xl font-bold mb-3">{university.name} Courses</h2>
                    <p className="text-gray-700 text-sm mb-4">
                      {university.name} offers a wide range of undergraduate, postgraduate, and doctoral programs:
                    </p>
                    {university.streams && university.streams.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {university.streams.map(stream => (
                          <span key={stream} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                            {stream}
                          </span>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* PLACEMENT - Guest Gated */}
                  <section id="seo-placement">
                    <h2 className="text-2xl font-bold mb-3">{university.name} Placement</h2>
                    <p className="text-gray-700 text-sm mb-4">
                      {university.name} has excellent placement records with top companies visiting the campus.
                    </p>
                    <GuestGate title="Placement Data">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
                          <div className="text-4xl font-bold text-green-600">{university.placement_percentage || '-'}%</div>
                          <div className="text-sm text-gray-600 mt-1">Placement Rate</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 text-center">
                          <div className="text-4xl font-bold text-purple-600">₹{university.highest_package || '-'} LPA</div>
                          <div className="text-sm text-gray-600 mt-1">Highest Package</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
                          <div className="text-4xl font-bold text-blue-600">₹{university.average_package || '-'} LPA</div>
                          <div className="text-sm text-gray-600 mt-1">Average Package</div>
                        </div>
                      </div>
                    </GuestGate>
                  </section>

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
                <p className="text-xs text-purple-100 mt-3">Application Deadline: March 2026</p>
              </div>
            </div>

            {/* Download Brochure Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="text-center">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-bold text-lg mb-2">Download Brochure</h3>
                <p className="text-sm text-blue-100 mb-4">Get complete course details and admission information</p>
                <button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-2.5 rounded transition-colors">
                  <FiDownload className="inline mr-2" size={16} />
                  Download Now
                </button>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
              <GuestGate title="Contact Details">
                <div className="space-y-3">
                  {university.address && (
                    <div className="flex items-start gap-3">
                      <FiMapPin className="text-purple-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{university.address}</span>
                    </div>
                  )}
                  {university.phone && (
                    <div className="flex items-center gap-3">
                      <FiPhone className="text-purple-600" />
                      <a href={`tel:${university.phone}`} className="text-sm text-purple-600 hover:underline">{university.phone}</a>
                    </div>
                  )}
                  {university.email && (
                    <div className="flex items-center gap-3">
                      <FiMail className="text-purple-600" />
                      <a href={`mailto:${university.email}`} className="text-sm text-purple-600 hover:underline">{university.email}</a>
                    </div>
                  )}
                  {university.website && (
                    <div className="flex items-center gap-3">
                      <FiGlobe className="text-purple-600" />
                      <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </GuestGate>
            </div>

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

            {/* Similar Universities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Similar Universities</h3>
              <div className="space-y-4">
                {[
                  { name: 'JNU Delhi', location: 'New Delhi', fees: '50K' },
                  { name: 'University of Mumbai', location: 'Mumbai', fees: '45K' },
                  { name: 'Delhi University', location: 'Delhi', fees: '30K' }
                ].map((item, i) => (
                  <Link 
                    key={i} 
                    to={`/university/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block hover:bg-gray-50 p-2 rounded -mx-2 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-purple-700">{item.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.location}</p>
                        <p className="text-xs font-semibold text-purple-600">₹{item.fees} Fees</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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
