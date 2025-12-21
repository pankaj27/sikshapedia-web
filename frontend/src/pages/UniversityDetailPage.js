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
  FiCalendar, FiBook, FiStar, FiChevronRight, FiHome, FiArrowLeft,
  FiCheckCircle, FiDownload, FiHeart, FiMessageSquare, FiShare2
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
  const [activeTab, setActiveTab] = useState('overview');
  
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'courses', label: 'Courses', icon: FiBook },
    { id: 'fees', label: 'Fees', icon: FiCalendar },
    { id: 'placements', label: 'Placements', icon: FiBriefcase },
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

      {/* Stats Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{university.total_colleges || '-'}</div>
              <div className="text-xs text-gray-500">Affiliated Colleges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{university.total_courses || '-'}</div>
              <div className="text-xs text-gray-500">Courses Offered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{university.total_students?.toLocaleString() || '-'}</div>
              <div className="text-xs text-gray-500">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{university.total_faculty?.toLocaleString() || '-'}</div>
              <div className="text-xs text-gray-500">Faculty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{university.placement_percentage || '-'}%</div>
              <div className="text-xs text-gray-500">Placement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <div className="flex border-b overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition ${
                      activeTab === tab.id 
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-3">About {university.name}</h2>
                      <p className="text-gray-600 leading-relaxed">
                        {university.description || `${university.name} is a ${university.university_type || 'prestigious'} university located in ${university.city}, ${university.state}. ${university.established_year ? `Established in ${university.established_year}, it` : 'It'} offers various undergraduate, postgraduate, and doctoral programs across multiple disciplines.`}
                      </p>
                    </div>

                    {/* SEO Content Section */}
                    {university.seo_content && (
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: university.seo_content }} />
                      </div>
                    )}

                    {/* Streams */}
                    {university.streams && university.streams.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Streams Offered</h3>
                        <div className="flex flex-wrap gap-2">
                          {university.streams.map(stream => (
                            <span key={stream} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                              {stream}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Facts */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Facts</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">Type</div>
                          <div className="font-semibold">{university.university_type || 'University'}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">Accreditation</div>
                          <div className="font-semibold">{university.accreditation || 'N/A'}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">Established</div>
                          <div className="font-semibold">{university.established_year || 'N/A'}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">NIRF Rank</div>
                          <div className="font-semibold">{university.nirf_rank ? `#${university.nirf_rank}` : 'N/A'}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-semibold">{university.city}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">State</div>
                          <div className="font-semibold">{university.state}</div>
                        </div>
                      </div>
                    </div>

                    {/* Author/Content Team Info */}
                    <AuthorInfo 
                      author={university.author}
                      updatedAt={university.updated_at}
                      contentTeam={university.content_team}
                    />
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Courses Offered</h2>
                    {university.courses && university.courses.length > 0 ? (
                      <div className="grid gap-4">
                        {university.courses.map((course, i) => (
                          <div key={i} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                            <h3 className="font-semibold">{typeof course === 'string' ? course : course.name}</h3>
                            {typeof course !== 'string' && course.duration && (
                              <p className="text-sm text-gray-500">Duration: {course.duration}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Course information will be updated soon.</p>
                    )}
                  </div>
                )}

                {activeTab === 'fees' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Fee Structure</h2>
                    <GuestGate title="Fee Details">
                      <div className="bg-white rounded-lg border overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-purple-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course/Program</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Annual Fee</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {university.fee_structure && university.fee_structure.length > 0 ? (
                              university.fee_structure.map((fee, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{fee.course || fee.program}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{fee.duration || '-'}</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">₹{fee.annual_fee?.toLocaleString() || fee.fee?.toLocaleString() || '-'}</td>
                                </tr>
                              ))
                            ) : (
                              <>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">B.Tech</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">4 Years</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">₹{university.avg_fee?.toLocaleString() || '1,50,000'}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">M.Tech</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">2 Years</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">₹{Math.round((university.avg_fee || 150000) * 1.2).toLocaleString()}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">MBA</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">2 Years</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">₹{Math.round((university.avg_fee || 150000) * 1.5).toLocaleString()}</td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">* Fees mentioned are approximate and subject to change. Contact university for exact fees.</p>
                    </GuestGate>
                  </div>
                )}

                {activeTab === 'placements' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Placement Statistics</h2>
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
                      
                      {/* Top Recruiters */}
                      {university.top_recruiters && university.top_recruiters.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Recruiters</h3>
                          <div className="flex flex-wrap gap-3">
                            {university.top_recruiters.map((recruiter, i) => (
                              <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                {recruiter}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </GuestGate>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewsSection 
                    entityId={university.id} 
                    entityType="university"
                    entityName={university.name}
                    showWriteReview={true}
                  />
                )}
              </div>
            </div>

            {/* Questions Section */}
            <QuestionsSection 
              entityId={university.id} 
              entityType="university"
              entityName={university.name}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-80 space-y-6">
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
