import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiStar, FiMapPin, FiBookOpen, FiFileText, FiAward, FiTrendingUp, FiZap, FiTool, FiBriefcase, FiActivity, FiFeather, FiCpu, FiShield, FiLayout, FiBarChart2, FiCompass, FiUsers, FiBook, FiCheckCircle, FiDownload, FiArrowRight, FiSend, FiMessageCircle, FiPhone } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';
import { OrganizationSchema, WebsiteSchema } from '../components/SEO/StructuredData';
import LocationSearch from '../components/LocationSearch';
import LatestNews from '../components/LatestNews';
import TopCollegesByStream from '../components/TopCollegesByStream';
import TopExams from '../components/TopExams';
import { AskQuestionWidget, CounsellingWidget, SponsorAdWidget } from '../components/widgets/ActionWidgets';
import ApplyNowModal from '../components/ApplyNowModal';
import { getInstitutionDetailUrl } from '../utils/urlHelpers';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CollegeDuniaHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [featuredSchools, setFeaturedSchools] = useState([]); // Featured schools from admin
  const [sponsoredFeatured, setSponsoredFeatured] = useState([]); // Sponsored ads from admin
  const [homeBannerAd, setHomeBannerAd] = useState(null); // Home banner sponsor ad
  const [stats, setStats] = useState({ total_colleges: 0, total_reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRankingYear, setActiveRankingYear] = useState('2024');
  const [activeWidget, setActiveWidget] = useState(null); // For widget modals
  const [pageSettings, setPageSettings] = useState(null);
  
  // Animated text rotation
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const rotatingTexts = pageSettings?.hero_rotating_texts || ['Exams', 'Colleges', 'Courses', 'Schools', 'Universities', 'Scholarships'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
    }, 2000); // Change every 2 seconds
    
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  // Icon component mapper
  const iconComponents = {
    FiTool, FiBriefcase, FiActivity, FiTrendingUp, FiFeather, FiCpu, FiShield, FiLayout,
    FiAward, FiFileText, FiBarChart2, FiCompass
  };

  const getIconComponent = (iconName) => {
    return iconComponents[iconName] || FiBookOpen;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collegesRes, schoolsRes, statsRes, sponsoredRes, bannerRes, settingsRes] = await Promise.all([
        api.get('/colleges/featured?limit=12'),
        api.get('/schools/featured?limit=8').catch(() => ({ data: [] })),
        api.get('/stats'),
        api.get('/sponsored-ads-multi/home_featured?limit=6').catch(() => ({ data: [] })),
        api.get('/sponsored-ads-multi/home_banner?limit=1').catch(() => ({ data: [] })),
        api.get('/homepage-settings').catch(() => ({ data: null }))
      ]);
      setFeaturedColleges(collegesRes.data);
      setFeaturedSchools(schoolsRes.data || []);
      setStats(statsRes.data);
      setSponsoredFeatured(sponsoredRes.data || []);
      setHomeBannerAd(bannerRes.data?.[0] || null);
      if (settingsRes.data) {
        setPageSettings(settingsRes.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/india-colleges?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Use settings from API or fallback to defaults
  const studyGoals = pageSettings?.study_goals?.length > 0 ? pageSettings.study_goals : [
    { name: 'Engineering', icon: 'FiTool', courses: 'B.Tech, M.Tech', count: '5000+', color: 'text-blue-600' },
    { name: 'Management', icon: 'FiBriefcase', courses: 'MBA, PGDM', count: '3000+', color: 'text-purple-600' },
    { name: 'Medical', icon: 'FiActivity', courses: 'MBBS, BDS', count: '2000+', color: 'text-red-600' },
    { name: 'Commerce', icon: 'FiTrendingUp', courses: 'B.Com, M.Com', count: '2500+', color: 'text-green-600' },
    { name: 'Arts', icon: 'FiFeather', courses: 'BA, MA', count: '1800+', color: 'text-pink-600' },
    { name: 'Science', icon: 'FiCpu', courses: 'B.Sc, M.Sc', count: '2200+', color: 'text-indigo-600' },
    { name: 'Law', icon: 'FiShield', courses: 'LLB, LLM', count: '1000+', color: 'text-yellow-600' },
    { name: 'Design', icon: 'FiLayout', courses: 'B.Des, M.Des', count: '800+', color: 'text-orange-600' }
  ];

  const programs = pageSettings?.programs?.length > 0 ? pageSettings.programs : [
    { title: 'College Ranking', subtitle: 'Find Top Colleges', icon: 'FiAward', color: 'bg-orange-100', iconColor: 'text-orange-600', link: '/colleges' },
    { title: 'Exams', subtitle: 'JEE, NEET, CAT', icon: 'FiFileText', color: 'bg-blue-100', iconColor: 'text-blue-600', link: '/exams' },
    { title: 'Compare Colleges', subtitle: 'Side by Side', icon: 'FiBarChart2', color: 'bg-green-100', iconColor: 'text-green-600', link: '/compare' },
    { title: 'Course Finder', subtitle: 'Find Best Courses', icon: 'FiCompass', color: 'bg-purple-100', iconColor: 'text-purple-600', link: '/course-finder' }
  ];

  const cities = pageSettings?.cities?.length > 0 ? pageSettings.cities : [
    { name: 'Delhi', image: '/assets/cities/New Delhi.svg' },
    { name: 'Mumbai', image: '/assets/cities/Mumbai.svg' },
    { name: 'Bangalore', image: '/assets/cities/Bangalore.svg' },
    { name: 'Hyderabad', image: '/assets/cities/Hyderabad.svg' },
    { name: 'Chennai', image: '/assets/cities/Chennai.svg' },
    { name: 'Pune', image: '/assets/cities/Pune.svg' },
    { name: 'Kolkata', image: '/assets/cities/Kolkata.svg' },
    { name: 'Bhopal', image: '/assets/cities/Bhopal.svg' }
  ];

  const rankingAgencies = pageSettings?.ranking_agencies?.length > 0 ? pageSettings.ranking_agencies : ['India Today', 'NIRF', 'The Week', 'Outlook'];
  
  // Hero slides from settings or generate from featured colleges/schools
  const defaultHeroSlides = [
    { image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&h=400&fit=crop', type: 'college', name: 'IIT Bombay - Indian Institute of Technology', rating: 4.8, reviews: 2847, location: 'Mumbai, Maharashtra', slug: 'iit-bombay-002' },
    { image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=400&fit=crop', type: 'school', name: 'Delhi Public School, R.K. Puram', rating: 4.6, reviews: 1523, location: 'New Delhi, Delhi', slug: 'dps-rk-puram-001' },
    { image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=400&fit=crop', type: 'university', name: 'Delhi University', rating: 4.5, reviews: 3256, location: 'New Delhi, Delhi', slug: 'delhi-university-001' },
    { image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&h=400&fit=crop', type: 'college', name: 'AIIMS Delhi - All India Institute of Medical Sciences', rating: 4.9, reviews: 2134, location: 'New Delhi, Delhi', slug: 'aiims-delhi-001' }
  ];
  
  // Generate hero slides from featured colleges dynamically
  const heroSlides = React.useMemo(() => {
    // Use custom slides from settings if available
    if (pageSettings?.hero_slides?.length > 0) {
      return pageSettings.hero_slides;
    }
    
    // Generate from featured colleges if available
    if (featuredColleges.length > 0) {
      const defaultImages = [
        'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=400&fit=crop',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=400&fit=crop',
        'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&h=400&fit=crop'
      ];
      
      return featuredColleges.slice(0, 4).map((college, idx) => ({
        image: college.banner_url || college.images?.[0] || defaultImages[idx % defaultImages.length],
        type: (college.institution_type || 'college').toLowerCase(),
        name: college.name,
        rating: college.rating || 4.5,
        reviews: college.total_reviews || 1000,
        location: `${college.location?.city || ''}, ${college.location?.state || ''}`,
        id: college.id,
        serial_number: college.serial_number,
        city: college.location?.city
      }));
    }
    
    return defaultHeroSlides;
  }, [featuredColleges, pageSettings?.hero_slides]);
  
  // Section visibility from settings - ALL 15 SECTIONS
  const showHeroSlider = pageSettings?.show_hero_slider !== false;
  const showQuickLinks = pageSettings?.show_quick_links !== false;
  const showQuickActions = pageSettings?.show_quick_actions !== false;
  const showStudyGoals = pageSettings?.show_study_goals !== false;
  const showPrograms = pageSettings?.show_programs !== false;
  const showTopUniversities = pageSettings?.show_top_universities !== false;
  const showTopSchools = pageSettings?.show_top_schools !== false;
  const showCollegeRankings = pageSettings?.show_college_rankings !== false;
  const showCities = pageSettings?.show_cities !== false;
  const showNewsletter = pageSettings?.show_newsletter !== false;
  const showSponsoredColleges = pageSettings?.show_sponsored_colleges !== false;
  const showTopCollegesByStream = pageSettings?.show_top_colleges_by_stream !== false;
  const showTopExams = pageSettings?.show_top_exams !== false;
  const showLocationSearch = pageSettings?.show_location_search !== false;
  const showLatestNews = pageSettings?.show_latest_news !== false;
  
  // Section Titles from settings
  const heroTitle = pageSettings?.hero_title || 'Find Your Dream';
  const heroSubtitle = pageSettings?.hero_subtitle || 'Explore 10,000+ Colleges, Universities & Schools across India';
  const topUniversitiesTitle = pageSettings?.top_universities_title || 'Top Universities & Colleges';
  const topSchoolsTitle = pageSettings?.top_schools_title || 'Top Schools in India';
  const collegeRankingsTitle = pageSettings?.college_rankings_title || 'College Rankings';
  const collegeRankingsYears = (pageSettings?.college_rankings_years?.length > 0) ? pageSettings.college_rankings_years : ['2024', '2023', '2022'];
  const defaultRankingsData = [
    { rank: 1, name: 'IIT Bombay', location: 'Mumbai', rating: 4.9, fees: '2.5L', type: 'Engineering' },
    { rank: 2, name: 'IIT Delhi', location: 'New Delhi', rating: 4.8, fees: '2.5L', type: 'Engineering' },
    { rank: 3, name: 'IIT Madras', location: 'Chennai', rating: 4.8, fees: '2.5L', type: 'Engineering' },
    { rank: 4, name: 'IIT Kanpur', location: 'Kanpur', rating: 4.7, fees: '2.5L', type: 'Engineering' },
    { rank: 5, name: 'IIT Kharagpur', location: 'Kharagpur', rating: 4.7, fees: '2.5L', type: 'Engineering' },
    { rank: 6, name: 'IIT Roorkee', location: 'Roorkee', rating: 4.6, fees: '2.5L', type: 'Engineering' },
    { rank: 7, name: 'IIT Guwahati', location: 'Guwahati', rating: 4.6, fees: '2.5L', type: 'Engineering' },
    { rank: 8, name: 'BITS Pilani', location: 'Pilani', rating: 4.5, fees: '4.5L', type: 'Engineering' },
    { rank: 9, name: 'NIT Trichy', location: 'Trichy', rating: 4.5, fees: '1.5L', type: 'Engineering' },
    { rank: 10, name: 'VIT Vellore', location: 'Vellore', rating: 4.4, fees: '3.5L', type: 'Engineering' }
  ];
  const collegeRankingsData = (pageSettings?.college_rankings_data?.length > 0) ? pageSettings.college_rankings_data : defaultRankingsData;
  const newsletterTitle = pageSettings?.newsletter_title || 'Subscribe to Our Newsletter';
  const newsletterSubtitle = pageSettings?.newsletter_subtitle || 'Get the latest updates on college admissions, exams, and education news';
  
  // Quick Links from settings - check for empty array too
  const defaultQuickLinks = [
    {name: 'Top Colleges', icon: 'FiBookOpen', link: '/india-colleges', bg_color: 'bg-blue-100', icon_color: 'text-blue-600'},
    {name: 'Top Schools', icon: 'FiBook', link: '/india-schools', bg_color: 'bg-red-100', icon_color: 'text-red-600'},
    {name: 'Top Exams', icon: 'FiFileText', link: '/exams', bg_color: 'bg-green-100', icon_color: 'text-green-600'},
    {name: 'Top Courses', icon: 'FiBookOpen', link: '/courses', bg_color: 'bg-purple-100', icon_color: 'text-purple-600'},
    {name: 'Education Loans', icon: 'FiTrendingUp', link: '/loans', bg_color: 'bg-pink-100', icon_color: 'text-pink-600'},
    {name: 'Study Materials', icon: 'FiZap', link: '/study-materials', bg_color: 'bg-indigo-100', icon_color: 'text-indigo-600'}
  ];
  const quickLinks = (pageSettings?.quick_links?.length > 0) ? pageSettings.quick_links : defaultQuickLinks;
  
  // Quick Actions from settings - check for empty array too
  const defaultQuickActions = [
    { id: 'apply', title: 'Apply Now', subtitle: 'Quick admission', icon: 'FiSend', gradient: 'from-orange-500 to-orange-600' },
    { id: 'question', title: 'Ask Question', subtitle: 'Get expert help', icon: 'FiMessageCircle', gradient: 'from-blue-500 to-blue-600' },
    { id: 'counselling', title: 'Counselling', subtitle: 'Free guidance', icon: 'FiPhone', gradient: 'from-purple-500 to-purple-600' }
  ];
  const quickActions = (pageSettings?.quick_actions?.length > 0) ? pageSettings.quick_actions : defaultQuickActions;
  
  // Top Schools from settings - check for empty array too
  const defaultTopSchools = [
    { name: 'Delhi Public School (DPS)', location: 'Multiple Locations', board: 'CBSE', rating: 4.8, fees: '2.5L', type: 'Day School', rank: 1 },
    { name: 'Sanskriti School', location: 'New Delhi', board: 'CBSE', rating: 4.7, fees: '3.2L', type: 'Day School', rank: 5 },
    { name: 'The Doon School', location: 'Dehradun', board: 'ICSE', rating: 4.9, fees: '8L', type: 'Boarding', rank: 2 },
    { name: 'Mayo College', location: 'Ajmer', board: 'CBSE', rating: 4.8, fees: '7.5L', type: 'Boarding', rank: 3 },
    { name: 'Bishop Cotton School', location: 'Shimla', board: 'ICSE', rating: 4.6, fees: '6L', type: 'Boarding', rank: 8 },
    { name: 'La Martiniere College', location: 'Kolkata', board: 'ICSE', rating: 4.7, fees: '1.5L', type: 'Day School', rank: 6 },
    { name: 'Modern School', location: 'New Delhi', board: 'CBSE', rating: 4.6, fees: '2.8L', type: 'Day School', rank: 10 },
    { name: 'Scindia School', location: 'Gwalior', board: 'CBSE', rating: 4.8, fees: '7L', type: 'Boarding', rank: 4 }
  ];
  // Use featured schools from API (admin-controlled), fallback to pageSettings, then defaults
  const topSchoolsData = featuredSchools.length > 0 ? featuredSchools : 
    (pageSettings?.top_schools?.length > 0 ? pageSettings.top_schools : defaultTopSchools);
  
  // SEO
  const metaTitle = pageSettings?.meta_title || 'AdmissionBuddy - Top Colleges, Universities & Institutes in India | Admission 2024';
  const metaDescription = pageSettings?.meta_description || 'Find detailed information about 10,000+ colleges, universities, courses, exams in India.';
  const metaKeywords = pageSettings?.meta_keywords?.join(', ') || 'colleges in india, top universities, engineering colleges, medical colleges, MBA colleges';

  return (
    <div className="min-h-screen bg-white -mt-20 pt-20">
      <MetaTags 
        title={metaTitle}
        description={metaDescription}
        keywords={metaKeywords}
        canonical="/"
      />
      <OrganizationSchema />
      <WebsiteSchema />
      {/* Hero Section with Background Slider - Compact */}
      <section className="relative h-[460px] overflow-hidden -mt-20">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          loop
          className="h-full"
        >
          {heroSlides.map((slide, idx) => {
            // Generate proper URL using serial_number if available, otherwise use slug as-is
            const institutionUrl = slide.serial_number 
              ? getInstitutionDetailUrl(
                  slide.type === 'school' ? 'school' : slide.type === 'university' ? 'university' : 'college',
                  slide.id || slide.slug,
                  slide.name,
                  slide.city || slide.location?.split(',')[0],
                  slide.serial_number
                )
              : `/${slide.type === 'school' ? 'schools' : slide.type === 'university' ? 'universities' : 'colleges'}/${slide.slug}`;
            
            return (
            <SwiperSlide key={idx}>
              <Link to={institutionUrl} className="block h-full relative z-0">
                <div className="relative h-full cursor-pointer group">
                  <img 
                    src={slide.image} 
                    alt={slide.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                  
                  {/* Institution Info Overlay - Smaller */}
                  <div className="absolute bottom-4 left-4 text-white z-20 max-w-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-semibold rounded-full uppercase">
                        {slide.type}
                      </span>
                      <div className="flex items-center gap-0.5 bg-green-600 px-1.5 py-0.5 rounded">
                        <FiStar className="text-white" size={10} />
                        <span className="text-[10px] font-bold">{slide.rating}</span>
                        <span className="text-[9px]">({slide.reviews})</span>
                      </div>
                    </div>
                    <h2 className="text-base md:text-lg font-medium mb-0.5 drop-shadow-lg group-hover:text-orange-400 transition-colors">
                      {slide.name}
                    </h2>
                    <div className="flex items-center gap-1 text-[11px] text-white/90">
                      <FiMapPin size={12} />
                      <span>{slide.location}</span>
                    </div>
                  </div>
                  
                  {/* Click to View Indicator - Smaller */}
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[11px] font-semibold flex items-center gap-1">
                      View Details <FiArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Search Overlay - Compact with Animated Title */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center text-white max-w-4xl px-4 w-full pointer-events-auto">
            {/* Animated Title */}
            <div className="mb-2">
              <h1 className="text-2xl md:text-4xl font-bold drop-shadow-lg">
                {heroTitle}{' '}
                <span 
                  key={currentTextIndex}
                  className="inline-block text-white animate-fade-in-up"
                  style={{
                    animation: 'fadeInUp 0.5s ease-in-out'
                  }}
                >
                  {rotatingTexts[currentTextIndex]}
                </span>
              </h1>
            </div>
            
            {/* Subtitle */}
            <p className="text-base md:text-lg text-white/90 mb-5 drop-shadow">
              {heroSubtitle}
            </p>
            
            {/* Single Search Input - Compact */}
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearch}>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Search for colleges, exams, courses and more.."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 text-sm pl-10 pr-4 bg-white border-0 rounded-lg shadow-xl focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg pointer-events-none" />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 h-12 px-8 text-sm font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Need Counselling Button - Compact */}
            <div className="mt-4">
              <Link to="/counseling">
                <Button 
                  type="button" 
                  className="bg-white text-orange-600 hover:bg-gray-50 h-10 px-6 text-sm font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Need Counselling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section - Compact */}
      {showQuickLinks && (
      <section className="py-5 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickLinks.map((item, idx) => {
              const IconComponent = getIconComponent(item.icon);
              return (
                <Link key={idx} to={item.link} className="flex flex-col items-center p-3 rounded-lg hover:bg-orange-50 transition group">
                  <div className={`w-12 h-12 ${item.bg_color} rounded-full flex items-center justify-center mb-1.5 group-hover:opacity-80 transition`}>
                    <IconComponent className={`${item.icon_color} text-xl`} />
                  </div>
                  <span className="text-xs font-semibold text-center">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Quick Action Widgets */}
      {showQuickActions && (
      <section className="py-6 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Quick Action Buttons - Dynamic from Backend */}
            {quickActions.map((action, idx) => {
              const IconComponent = getIconComponent(action.icon);
              return (
                <button
                  key={idx}
                  onClick={() => setActiveWidget(action.id)}
                  className={`flex items-center gap-3 p-4 bg-gradient-to-r ${action.gradient} text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <IconComponent size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm">{action.title}</h3>
                    <p className="text-xs text-white/80">{action.subtitle}</p>
                  </div>
                </button>
              );
            })}

            {/* Sponsor Ad Card - Dynamic from Admin */}
            {homeBannerAd ? (
              <Link 
                to={getInstitutionDetailUrl(homeBannerAd.institution_type || 'college', homeBannerAd.id, homeBannerAd.name, homeBannerAd.location?.city, homeBannerAd.serial_number)}
                className="relative p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl shadow-md overflow-hidden hover:from-gray-700 hover:to-gray-800 transition-all"
              >
                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-yellow-500 text-yellow-900 text-[8px] font-bold rounded uppercase">Ad</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center overflow-hidden">
                    {homeBannerAd.logo_url ? (
                      <img src={homeBannerAd.logo_url} alt={homeBannerAd.name} className="w-full h-full object-contain" />
                    ) : (
                      <HiOutlineSparkles size={20} className="text-yellow-400" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm line-clamp-1">{homeBannerAd.name}</h3>
                    <p className="text-xs text-gray-400">
                      {homeBannerAd.type || 'Featured'} • {homeBannerAd.location?.city || 'India'}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="relative p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl shadow-md overflow-hidden">
                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-yellow-500 text-yellow-900 text-[8px] font-bold rounded uppercase">Ad</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <HiOutlineSparkles size={20} className="text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm">Featured Programs</h3>
                    <p className="text-xs text-gray-400">Add from Admin Panel</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Widget Modals */}
      {activeWidget && activeWidget !== 'apply' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setActiveWidget(null)}>
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            {activeWidget === 'question' && <AskQuestionWidget onClose={() => setActiveWidget(null)} />}
            {activeWidget === 'counselling' && <CounsellingWidget onClose={() => setActiveWidget(null)} />}
          </div>
        </div>
      )}

      {/* Main Apply Now Modal */}
      <ApplyNowModal
        isOpen={activeWidget === 'apply'}
        onClose={() => setActiveWidget(null)}
        source="homepage"
      />

      {/* Study Goals Carousel - Compact */}
      {showStudyGoals && (
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">{pageSettings?.study_goals_title || 'Select Your Study Goal'}</h2>
              <div className="flex gap-2">
                <button className="swiper-button-prev-goals w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 shadow-sm">
                  <FiChevronDown className="transform rotate-90 text-gray-600" size={16} />
                </button>
                <button className="swiper-button-next-goals w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 shadow-sm">
                  <FiChevronDown className="transform -rotate-90 text-gray-600" size={16} />
                </button>
              </div>
            </div>
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.swiper-button-next-goals',
                prevEl: '.swiper-button-prev-goals',
              }}
              spaceBetween={15}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 6 }
              }}
            >
              {studyGoals.map((goal, idx) => {
                const IconComponent = getIconComponent(goal.icon);
                return (
                  <SwiperSlide key={idx}>
                    <Link to={`/india-colleges?course=${encodeURIComponent(goal.name)}`} className="block bg-white rounded-lg p-4 text-center hover:shadow-lg transition border group">
                      <div className="flex justify-center mb-2">
                        <IconComponent className={`text-4xl ${goal.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <h3 className="font-bold text-base mb-0.5">{goal.name}</h3>
                      <p className="text-xs text-gray-600 mb-1.5">{goal.courses}</p>
                      <span className="text-[10px] text-orange-600 font-semibold">{goal.count} Colleges</span>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
      )}

      {/* Programs Exploration - Compact */}
      {showPrograms && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-5">{pageSettings?.programs_title || 'Explore Programs'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {programs.map((program, idx) => {
                const IconComponent = getIconComponent(program.icon);
                return (
                  <Link key={idx} to={program.link} className={`${program.color} rounded-xl p-4 text-center hover:shadow-lg transition cursor-pointer group block`}>
                    <div className="flex justify-center mb-2">
                      <IconComponent className={`text-4xl ${program.iconColor} group-hover:scale-110 transition-transform`} />
                    </div>
                    <h3 className="font-bold text-base mb-1">{program.title}</h3>
                    <p className="text-gray-600 text-sm">{program.subtitle}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Top Universities Carousel */}
      {showTopUniversities && (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{topUniversitiesTitle}</h2>
            <div className="flex items-center gap-4">
              {/* Custom Navigation Arrows */}
              <div className="flex gap-2">
                <button className="swiper-button-prev-custom w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 shadow-sm">
                  <FiChevronDown className="transform rotate-90 text-gray-600" />
                </button>
                <button className="swiper-button-next-custom w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 shadow-sm">
                  <FiChevronDown className="transform -rotate-90 text-gray-600" />
                </button>
              </div>
              <Link to="/india-colleges">
                <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">View All</Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }}
              className="college-carousel"
            >
              {featuredColleges.map((college, idx) => (
                <SwiperSlide key={college.id}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 h-[340px] flex flex-col">
                    {/* Modern Header with Gradient Overlay - Uses banner_url first, then images[0] */}
                    <div className="relative h-28">
                      {(college.banner_url || college.images?.[0]) ? (
                        <img 
                          src={college.banner_url || college.images[0]} 
                          alt={college.banner_alt || college.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Top Badges - Modern Pills */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
                        {college.nirf_ranking && (
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-gray-800">
                            #{college.nirf_ranking} NIRF
                          </span>
                        )}
                        {college.is_featured && (
                          <span className="px-2 py-1 bg-amber-400 rounded-full text-[10px] font-semibold text-amber-900">
                            Featured
                          </span>
                        )}
                        {college.is_admission_partner && (
                          <span className="px-2 py-1 bg-green-500 rounded-full text-[10px] font-semibold text-white">
                            🤝 Partner
                          </span>
                        )}
                        {college.is_no_cost_emi && (
                          <span className="px-2 py-1 bg-blue-500 rounded-full text-[10px] font-semibold text-white">
                            💳 No Cost EMI
                          </span>
                        )}
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                        <FiStar className="text-amber-400 text-xs fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-800">{college.rating || '4.5'}</span>
                      </div>
                      
                      {/* College Initial - Bottom Left */}
                      <div className="absolute -bottom-5 left-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-white">
                        <span className="text-xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {college.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 pt-8 flex-1 flex flex-col">
                      <Link to={getInstitutionDetailUrl(college.institution_type || 'college', college.id, college.name, college.location?.city, college.serial_number)}>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {college.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <FiMapPin className="text-[10px]" />
                        {college.location?.city}, {college.location?.state}
                      </p>
                      
                      {/* Stats Row - Modern */}
                      <div className="flex items-center gap-3 mt-3 py-2 border-y border-gray-100">
                        <div className="flex-1 text-center">
                          <p className="text-sm font-bold text-indigo-600">₹{(college.average_fees / 100000).toFixed(1)}L</p>
                          <p className="text-[10px] text-gray-400">Avg. Fee</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="flex-1 text-center">
                          <p className="text-sm font-bold text-gray-700">{college.courses?.length || '50'}+</p>
                          <p className="text-[10px] text-gray-400">Courses</p>
                        </div>
                      </div>
                      
                      {/* Action Buttons - Modern */}
                      <div className="mt-auto pt-3 flex gap-2">
                        <Button 
                          onClick={(e) => { e.preventDefault(); navigate(getInstitutionDetailUrl(college.institution_type || 'college', college.id, college.name, college.location?.city, college.serial_number)); }}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2.5 h-auto rounded-xl font-medium transition-all"
                        >
                          View Details
                        </Button>
                        <Button 
                          onClick={(e) => { e.preventDefault(); setActiveWidget('apply'); }}
                          variant="outline"
                          className="flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs py-2.5 h-auto rounded-xl font-medium"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
      )}

      {/* Top Schools Section */}
      {showTopSchools && (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{topSchoolsTitle}</h2>
            <Link to="/colleges?type=school">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">View All Schools</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topSchoolsData.map((school, idx) => (
              <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 h-[320px] flex flex-col">
                {/* Modern Header */}
                <div className="relative h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
                  
                  {/* Top Badges - Modern Pills */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {school.rank && (
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-gray-800">
                        #{school.rank} Rank
                      </span>
                    )}
                    <span className="px-2 py-1 bg-emerald-400 rounded-full text-[10px] font-semibold text-emerald-900">
                      {school.board}
                    </span>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                    <FiStar className="text-amber-400 text-xs fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-800">{school.rating}</span>
                  </div>
                  
                  {/* School Icon - Bottom Left */}
                  <div className="absolute -bottom-5 left-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-white">
                    <FiBook className="text-xl text-emerald-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 pt-8 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors cursor-pointer">
                    {school.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <FiMapPin className="text-[10px]" />
                    {school.location}
                  </p>
                  
                  {/* Stats Row - Modern */}
                  <div className="flex items-center gap-3 mt-3 py-2 border-y border-gray-100">
                    <div className="flex-1 text-center">
                      <p className="text-sm font-bold text-emerald-600">₹{school.fees}</p>
                      <p className="text-[10px] text-gray-400">Annual Fee</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="flex-1 text-center">
                      <p className="text-sm font-bold text-gray-700">{school.type || 'Day'}</p>
                      <p className="text-[10px] text-gray-400">Type</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Modern */}
                  <div className="mt-auto pt-3 flex gap-2">
                    <Button 
                      onClick={() => navigate(`/schools/${encodeURIComponent(school.name)}`)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2.5 h-auto rounded-xl font-medium transition-all"
                    >
                      View Details
                    </Button>
                    <Button 
                      onClick={() => navigate(`/schools/${encodeURIComponent(school.name)}/apply`)}
                      variant="outline"
                      className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs py-2.5 h-auto rounded-xl font-medium"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Ranking Table */}
      {showCollegeRankings && (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">{collegeRankingsTitle} {activeRankingYear}</h2>
            <select
              value={activeRankingYear}
              onChange={(e) => setActiveRankingYear(e.target.value)}
              className="border rounded px-4 py-2"
            >
              {collegeRankingsYears.map((year, idx) => (
                <option key={idx} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {rankingAgencies.map((agency, idx) => (
              <button
                key={idx}
                className="px-4 py-2 bg-white border rounded-full hover:border-orange-600 hover:text-orange-600 whitespace-nowrap"
              >
                {agency}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {collegeRankingsData.map((college, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">#{college.rank}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">{college.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {college.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-500" />
                        <span className="font-semibold">{college.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ₹{college.fees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">{college.type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}

      {/* Popular Cities */}
      {showCities && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">{pageSettings?.cities_title || 'Explore Colleges in Popular Places'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {cities.map((city, idx) => (
                <Link
                  key={idx}
                  to={`/colleges?city=${city.name}`}
                  className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition group"
                >
                  <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <img src={city.image} alt={city.name} className="w-14 h-14 object-contain" />
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-orange-600 transition">{city.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Subscription - Perfect Button Height */}
      {showNewsletter && (
      <section className="py-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg font-bold mb-2">{newsletterTitle}</h2>
          <p className="text-sm mb-3 text-white">{newsletterSubtitle}</p>
          <form className="max-w-md mx-auto flex gap-2 items-center">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white text-gray-900 text-sm px-4 h-10 border-0 focus:ring-2 focus:ring-white rounded-lg"
            />
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100 px-6 h-10 text-sm font-semibold whitespace-nowrap rounded-lg">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
      )}

      {/* Sponsored Featured Colleges - From Admin */}
      {showSponsoredColleges && sponsoredFeatured.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <FiStar className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Featured Colleges</h2>
                  <p className="text-sm text-gray-500">Sponsored recommendations for you</p>
                </div>
              </div>
              <span className="text-xs text-orange-600 bg-orange-100 px-3 py-1 rounded-full font-medium">Sponsored</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsoredFeatured.map((college, idx) => (
                <Link 
                  key={college.id || idx}
                  to={getInstitutionDetailUrl(college.institution_type || 'college', college.id, college.name, college.location?.city, college.serial_number)}
                  className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-xl hover:border-orange-300 transition-all group"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-orange-200 group-hover:border-orange-400 transition-colors">
                        {college.logo_url ? (
                          <img src={college.logo_url} alt={college.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="text-2xl font-bold text-orange-600">{college.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {college.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <FiMapPin size={12} />
                          {college.location?.city}, {college.location?.state}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {college.type && (
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                              college.type === 'Government' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>{college.type}</span>
                          )}
                          {college.nirf_ranking && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                              NIRF #{college.nirf_ranking}
                            </span>
                          )}
                          {college.rating > 0 && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium flex items-center gap-0.5">
                              <FiStar size={10} className="fill-current" /> {college.rating?.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      {college.average_fees > 0 && (
                        <span className="text-sm text-gray-600">
                          <span className="text-gray-400">Fees:</span>{' '}
                          <strong className="text-gray-900">
                            ₹{college.average_fees >= 100000 ? `${(college.average_fees / 100000).toFixed(1)}L` : `${(college.average_fees / 1000).toFixed(0)}K`}/yr
                          </strong>
                        </span>
                      )}
                      <span className="text-sm text-orange-600 font-medium group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link 
                to="/india-colleges" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
              >
                View All Featured Colleges <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Top Colleges by Stream */}
      {showTopCollegesByStream && <TopCollegesByStream />}

      {/* Top Entrance Exams */}
      {showTopExams && <TopExams />}

      {/* Location-based Search */}
      {showLocationSearch && <LocationSearch />}

      {/* Latest News & Alerts */}
      {showLatestNews && <LatestNews />}

    </div>
  );
};

export default CollegeDuniaHome;