import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiInfo, FiBook, FiFileText, FiBarChart2, FiBriefcase, FiAward, FiDollarSign, FiMessageSquare, FiBookmark, FiImage, FiUsers, FiCalendar, FiMapPin, FiHelpCircle, FiPhone } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineLibrary } from 'react-icons/hi';
import api from '../api/axios';
import CollegeSidebar from '../components/CollegeSidebar';
import ApplyNowModal from '../components/ApplyNowModal';
import { 
  CoursesSection, 
  AdmissionSection, 
  CutoffSection, 
  PlacementSection, 
  RankingSection, 
  ScholarshipSection, 
  FacilitiesSection, 
  GallerySection,
  InfoSection,
  LocationSection 
} from '../components/CollegeSections';
import ReviewsSection from '../components/ReviewsSection';

import { Link } from '../components/CustomLink';
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

// Icon mapping for larger icons (headers)
const iconMapLarge = {
  'info': <FiInfo size={28} />,
  'courses': <FiBook size={28} />,
  'admission': <FiFileText size={28} />,
  'cutoff': <FiBarChart2 size={28} />,
  'placement': <FiBriefcase size={28} />,
  'ranking': <FiAward size={28} />,
  'scholarship': <HiOutlineCurrencyRupee size={28} />,
  'facilities': <HiOutlineOfficeBuilding size={28} />,
  'reviews': <FiMessageSquare size={28} />,
  'overview': <FiHome size={28} />,
  'programs': <HiOutlineAcademicCap size={28} />,
  'fees': <FiDollarSign size={28} />,
  'campus': <HiOutlineLibrary size={28} />,
  'gallery': <FiImage size={28} />,
  'faculty': <FiUsers size={28} />,
  'events': <FiCalendar size={28} />,
  'location': <FiMapPin size={28} />,
  'faq': <FiHelpCircle size={28} />,
  'default': <FiBookmark size={28} />,
};

// Helper function to get icon component
const getMenuIcon = (iconId) => iconMap[iconId] || iconMap['default'];
const getMenuIconLarge = (iconId) => iconMapLarge[iconId] || iconMapLarge['default'];

const CollegeSubPage = () => {
  // Support both idSlug (legacy) and seg1 (new router)
  const params = useParams();
  const idSlug = params.idSlug || params.seg1;
  const section = params.section || params.seg2;
  const navigate = useNavigate();
  const location = useLocation();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);
  const [resolvedId, setResolvedId] = useState(null);
  const [invalidFormat, setInvalidFormat] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Determine institution type from URL
  const getInstitutionType = () => {
    const path = location.pathname;
    if (path.startsWith('/colleges/')) return 'College';
    if (path.startsWith('/university/')) return 'University';
    if (path.startsWith('/schools/')) return 'School';
    return 'College';
  };
  
  const institutionType = getInstitutionType();
  
  // Parse the idSlug - accepts both formats:
  // 1. {number}-{slug} e.g., "001-iit-bombay"
  // 2. slug-only e.g., "iim-ahmedabad"
  const parseIdSlug = (slug) => {
    if (!slug) return { numericId: null, slugPart: null, isValidFormat: false, isSlugOnly: false };
    
    // Check for numeric prefix format: {number}-{slug}
    const match = slug.match(/^(\d+)-(.+)$/);
    if (match) {
      return { numericId: parseInt(match[1], 10), slugPart: match[2], isValidFormat: true, isSlugOnly: false };
    }
    
    // Accept slug-only format (no numeric prefix)
    if (slug && !slug.match(/^\d+$/)) {
      return { numericId: null, slugPart: slug, isValidFormat: true, isSlugOnly: true };
    }
    
    // Invalid format
    return { numericId: null, slugPart: null, isValidFormat: false, isSlugOnly: false };
  };

  // Resolve the idSlug to actual college ID
  useEffect(() => {
    const resolveInstitution = async () => {
      // Parse the idSlug format
      const { numericId, slugPart, isValidFormat, isSlugOnly } = parseIdSlug(idSlug);
      
      // Reject invalid URL format
      if (!isValidFormat) {
        setInvalidFormat(true);
        setResolvedId(null);
        return;
      }
      
      setInvalidFormat(false);
      
      try {
        // If slug-only format, try to fetch by slug directly
        if (isSlugOnly && slugPart) {
          const response = await api.get(`/colleges/${slugPart}`);
          if (response.data && response.data.id) {
            setResolvedId(response.data.id);
            return;
          }
        }
        
        // Search by serial_number (numeric prefix format)
        if (numericId) {
          const response = await api.get(`/colleges?institution_type=${institutionType}&limit=100`);
          if (response.data && response.data.length > 0) {
            const institution = response.data.find(inst => inst.serial_number === numericId);
            if (institution) {
              setResolvedId(institution.id);
              return;
            }
          }
        }
        
        setResolvedId(null);
      } catch (error) {
        console.error('Error resolving institution:', error);
        setResolvedId(null);
      }
    };
    
    resolveInstitution();
  }, [idSlug, institutionType]);

  // Then fetch the college data once we have the resolved ID
  useEffect(() => {
    if (!resolvedId) return;
    
    const fetchCollege = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/colleges/${resolvedId}`);
        setCollege(response.data);
        
        // Find the current section from menu_config items
        const menuItems = response.data.menu_config?.items || [];
        const found = menuItems.find(item => item.id === section);
        
        // If found in menu_config, use it; otherwise create a default section object
        if (found) {
          setCurrentSection(found);
        } else {
          // Create default section for standard sections
          const defaultLabels = {
            'info': 'Info',
            'courses': 'Courses & Fees',
            'gallery': 'Gallery',
            'reviews': 'Reviews',
            'admission': 'Admissions',
            'cutoff': 'Cutoff',
            'placement': 'Placement',
            'ranking': 'Ranking',
            'scholarship': 'Scholarship',
            'facilities': 'Facilities'
          };
          setCurrentSection({
            id: section,
            label: defaultLabels[section] || section,
            enabled: true
          });
        }
      } catch (error) {
        console.error('Error fetching college:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [resolvedId, section]);

  // Show error for invalid URL format
  if (invalidFormat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid URL format</h1>
          <p className="text-gray-600 mb-4">The URL format is not valid. Please use the correct format.</p>
          <Link to="/colleges" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-block">
            Browse All Colleges
          </Link>
        </div>
      </div>
    );
  }

  // Show loading while resolving ID or fetching college
  if (loading || (!resolvedId && idSlug)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">College not found</h1>
          <p className="text-gray-600 mb-4">The institution you are looking for does not exist.</p>
          <Link to="/colleges" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-block">
            Browse All Colleges
          </Link>
        </div>
      </div>
    );
  }

  // Get menu items - use new simplified menu_config
  const menuItems = (college.menu_config?.items || [])
    .filter(item => item.enabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Get SEO values with fallbacks
  const pageTitle = currentSection?.meta_title || `${currentSection?.label || section} - ${college.name}`;
  const pageDescription = currentSection?.meta_description || `${currentSection?.label || section} information for ${college.name}`;
  const pageKeywords = currentSection?.meta_keywords || '';
  const ogTitle = currentSection?.og_title || pageTitle;
  const ogDescription = currentSection?.og_description || pageDescription;
  const pageHeading = currentSection?.page_heading || currentSection?.label || section;
  
  // Determine the base URL path for links (use plural form)
  const typePathMap = { 'College': 'colleges', 'University': 'universities', 'School': 'schools' };
  const typePath = typePathMap[institutionType] || 'colleges';
  const currentSlug = idSlug || college.id; // Use idSlug if available, fallback to college.id
  const basePath = `/${typePath}/${currentSlug}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle} | Admissionbuddy</title>
        <meta name="description" content={pageDescription} />
        {pageKeywords && <meta name="keywords" content={pageKeywords} />}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}${basePath}/${section}`} />
        {college.logo_url && <meta property="og:image" content={college.logo_url.startsWith('/api') ? `${window.location.origin}${college.logo_url}` : `${window.location.origin}/api${college.logo_url}`} />}
        <link rel="canonical" href={`${window.location.origin}${basePath}/${section}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header with College Info */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4">
              {college.logo_url && (
                <img 
                  src={college.logo_url.startsWith('/api') ? college.logo_url : `/api${college.logo_url}`}
                  alt={college.name}
                  className="w-16 h-16 rounded-lg bg-white p-1 object-contain"
                />
              )}
              <div>
                <Link to={basePath} className="hover:underline">
                  <h1 className="text-2xl font-bold">{college.name}</h1>
                </Link>
                <p className="text-orange-100">{college.location?.city}, {college.location?.state}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-2">
              {/* Main Page Link */}
              <Link
                to={basePath}
                className="px-4 py-2 rounded-lg text-sm whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
              >
                <FiHome size={14} /> Main
              </Link>
              
              {/* Menu Items */}
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={`${basePath}/${item.id}`}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
                    section === item.id 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getMenuIcon(item.id)} {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area with Sidebar */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Content - takes remaining space */}
            <div className="flex-1 min-w-0">
              {currentSection ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  {/* Page Heading (H1) */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="text-orange-500">{getMenuIconLarge(currentSection.id || section)}</span>
                    {pageHeading}
                  </h1>
                  
                  {/* Search Heading (if different from page heading) */}
                  {currentSection.search_heading && currentSection.search_heading !== pageHeading && (
                    <h2 className="text-xl text-gray-600 mb-4 -mt-4">{currentSection.search_heading}</h2>
                  )}
                  
                  {/* SECTION-SPECIFIC CONTENT - Using shared components (SAME as main page) */}
                  
                  {/* INFO Section */}
                  {section === 'info' && <InfoSection college={college} />}

                  {/* COURSES Section */}
                  {section === 'courses' && <CoursesSection college={college} />}

                  {/* ADMISSION Section */}
                  {section === 'admission' && <AdmissionSection college={college} />}

                  {/* PLACEMENT Section */}
                  {section === 'placement' && <PlacementSection college={college} />}

                  {/* RANKING Section */}
                  {section === 'ranking' && <RankingSection college={college} />}

                  {/* CUTOFF Section */}
                  {section === 'cutoff' && <CutoffSection college={college} />}

                  {/* SCHOLARSHIP Section */}
                  {section === 'scholarship' && <ScholarshipSection college={college} />}

                  {/* FACILITIES Section */}
                  {section === 'facilities' && <FacilitiesSection college={college} />}

                  {/* GALLERY Section */}
                  {section === 'gallery' && <GallerySection college={college} />}

                  {/* LOCATION Section */}
                  {section === 'location' && <LocationSection college={college} />}

                  {/* REVIEWS Section */}
                  {section === 'reviews' && (
                    <ReviewsSection 
                      entityId={college?.id} 
                      entityType="college" 
                      entityName={college?.name}
                    />
                  )}

                  {/* Custom Content from menu_config */}
                  {currentSection.content && !['info', 'courses', 'admission', 'placement', 'ranking', 'cutoff', 'scholarship', 'facilities', 'gallery', 'location', 'reviews'].includes(section) && (
                    <div 
                      className="prose prose-lg max-w-none text-gray-700 mb-8"
                      dangerouslySetInnerHTML={{ __html: currentSection.content.replace(/\n/g, '<br/>') }}
                    />
                  )}
                  
                  {/* Table of Contents Navigation */}
                  {currentSection.toc && currentSection.toc.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 mt-6">
                      <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        <FiBookmark size={16} /> Table of Contents
                      </h3>
                      <nav className="space-y-1">
                        {currentSection.toc.map((tocItem, tocIndex) => (
                          <a
                            key={tocIndex}
                            href={`#${tocItem.anchor}`}
                            className="block text-sm text-orange-700 hover:text-orange-900 hover:bg-orange-100 px-3 py-1.5 rounded transition-colors"
                          >
                            {tocIndex + 1}. {tocItem.title}
                          </a>
                        ))}
                      </nav>
                    </div>
                  )}
                  
                  {/* TOC Sections Content */}
                  {currentSection.toc && currentSection.toc.length > 0 && (
                    <div className="space-y-8">
                      {currentSection.toc.map((tocItem, tocIndex) => (
                        <section key={tocIndex} id={tocItem.anchor} className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                            {tocItem.title}
                          </h2>
                          {tocItem.content ? (
                            <div 
                              className="prose max-w-none text-gray-700"
                              dangerouslySetInnerHTML={{ __html: tocItem.content.replace(/\n/g, '<br/>') }}
                            />
                          ) : (
                            <p className="text-gray-400 italic">Content coming soon...</p>
                          )}
                        </section>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Section Not Found</h2>
                  <p className="text-gray-600 mb-6">The requested section &quot;{section}&quot; does not exist.</p>
                  <Link 
                    to={basePath}
                    className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
                  >
                    <FiHome size={16} /> Back to {college.name}
                  </Link>
                </div>
              )}
            </div>
        
            {/* Shared Sidebar from Main Page - on the RIGHT */}
            <CollegeSidebar 
              college={college}
              onApplyClick={() => setShowApplyModal(true)}
              onBookingClick={() => {}}
              sectionWidgets={currentSection?.sidebar_widgets}
            />
          </div>
        </div>
      </div>
      
      {/* Apply Now Modal */}
      <ApplyNowModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        collegeName={college?.name}
        collegeId={college?.id}
        courses={college?.courses || []}
      />
    </>
  );
};

export default CollegeSubPage;
