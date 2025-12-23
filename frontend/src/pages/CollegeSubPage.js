import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiInfo, FiBook, FiFileText, FiBarChart2, FiBriefcase, FiAward, FiDollarSign, FiMessageSquare, FiBookmark, FiImage, FiUsers, FiCalendar, FiMapPin, FiHelpCircle, FiPhone } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineLibrary } from 'react-icons/hi';
import api from '../api/axios';
import CollegeSidebar from '../components/CollegeSidebar';
import ApplyNowModal from '../components/ApplyNowModal';

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
  
  // Determine institution type from URL (plural paths)
  const getInstitutionType = () => {
    const path = location.pathname;
    if (path.startsWith('/colleges/')) return 'College';
    if (path.startsWith('/universities/')) return 'University';
    if (path.startsWith('/schools/')) return 'School';
    return 'College';
  };
  
  const institutionType = getInstitutionType();
  
  // Parse the idSlug - ONLY accepts new format: {number}-{slug}
  // Old format like "aiims-delhi-001" is NOT supported
  const parseIdSlug = (slug) => {
    if (!slug) return { numericId: null, slugPart: null, isValidFormat: false };
    const match = slug.match(/^(\d+)-(.+)$/);
    if (match) {
      return { numericId: parseInt(match[1], 10), slugPart: match[2], isValidFormat: true };
    }
    // Invalid format - old URLs are no longer supported
    return { numericId: null, slugPart: null, isValidFormat: false };
  };

  // Resolve the idSlug to actual college ID
  useEffect(() => {
    const resolveInstitution = async () => {
      // Parse the new idSlug format
      const { numericId, isValidFormat } = parseIdSlug(idSlug);
      
      // Reject invalid URL format (old URLs like "aiims-delhi-001")
      if (!isValidFormat) {
        setInvalidFormat(true);
        setResolvedId(null);
        return;
      }
      
      setInvalidFormat(false);
      
      try {
        // Search by serial_number only
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
          <p className="text-gray-600 mb-4">The institution you're looking for doesn't exist.</p>
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
  const currentSlug = idSlug || id; // Use idSlug if available, fallback to id
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

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
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
                  
                  {/* SECTION-SPECIFIC CONTENT */}
                  {/* INFO Section */}
                  {section === 'info' && (
                    <div className="space-y-6">
                      {college.description && (
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: college.description }} />
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {college.established_year && (
                          <div className="bg-orange-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-orange-600">{college.established_year}</p>
                            <p className="text-sm text-gray-600">Established</p>
                          </div>
                        )}
                        {college.total_students && (
                          <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">{college.total_students?.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Students</p>
                          </div>
                        )}
                        {college.type && (
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">{college.type}</p>
                            <p className="text-sm text-gray-600">Type</p>
                          </div>
                        )}
                        {college.average_fees && (
                          <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-purple-600">₹{(college.average_fees / 100000).toFixed(1)}L</p>
                            <p className="text-sm text-gray-600">Avg. Fees</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* COURSES Section */}
                  {section === 'courses' && (
                    <div className="space-y-4">
                      {college.courses && college.courses.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-orange-50">
                                <th className="border p-3 text-left">Course Name</th>
                                <th className="border p-3 text-left">Duration</th>
                                <th className="border p-3 text-right">1st Year Fee</th>
                                <th className="border p-3 text-right">Total Fee</th>
                              </tr>
                            </thead>
                            <tbody>
                              {college.courses.map((course, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="border p-3 font-medium">{course.name}</td>
                                  <td className="border p-3">{course.duration}</td>
                                  <td className="border p-3 text-right">₹{course.first_year_fee?.toLocaleString() || '-'}</td>
                                  <td className="border p-3 text-right font-semibold">₹{course.total_fee?.toLocaleString() || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Course information coming soon.</p>
                      )}
                    </div>
                  )}

                  {/* ADMISSION Section */}
                  {section === 'admission' && (
                    <div className="space-y-6">
                      {college.admission_dates && college.admission_dates.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Important Dates</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {college.admission_dates.map((date, idx) => (
                              <div key={idx} className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                                <span className="font-medium">{date.event}</span>
                                <span className="text-blue-600 font-semibold">{date.date}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {college.admission_process && (
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: college.admission_process }} />
                      )}
                      {!college.admission_dates?.length && !college.admission_process && (
                        <p className="text-gray-500 italic">Admission information coming soon.</p>
                      )}
                    </div>
                  )}

                  {/* PLACEMENT Section */}
                  {section === 'placement' && (
                    <div className="space-y-6">
                      {(college.placement || college.placements) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(college.placement?.highest || college.placements?.highest_package) && (
                            <div className="bg-green-50 p-6 rounded-lg text-center">
                              <p className="text-3xl font-bold text-green-600">
                                ₹{((college.placement?.highest || college.placements?.highest_package) / 100000).toFixed(1)}L
                              </p>
                              <p className="text-gray-600">Highest Package</p>
                            </div>
                          )}
                          {(college.placement?.average || college.placements?.average_package) && (
                            <div className="bg-blue-50 p-6 rounded-lg text-center">
                              <p className="text-3xl font-bold text-blue-600">
                                ₹{((college.placement?.average || college.placements?.average_package) / 100000).toFixed(1)}L
                              </p>
                              <p className="text-gray-600">Average Package</p>
                            </div>
                          )}
                          {(college.placement?.median || college.placements?.median_package) && (
                            <div className="bg-purple-50 p-6 rounded-lg text-center">
                              <p className="text-3xl font-bold text-purple-600">
                                ₹{((college.placement?.median || college.placements?.median_package) / 100000).toFixed(1)}L
                              </p>
                              <p className="text-gray-600">Median Package</p>
                            </div>
                          )}
                        </div>
                      )}
                      {!college.placement && !college.placements && (
                        <p className="text-gray-500 italic">Placement information coming soon.</p>
                      )}
                    </div>
                  )}

                  {/* RANKING Section */}
                  {section === 'ranking' && (
                    <div className="space-y-4">
                      {college.rankings && college.rankings.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-yellow-50">
                                <th className="border p-3 text-left">Agency</th>
                                <th className="border p-3 text-left">Category</th>
                                <th className="border p-3 text-center">Year</th>
                                <th className="border p-3 text-center">Rank</th>
                              </tr>
                            </thead>
                            <tbody>
                              {college.rankings.map((ranking, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="border p-3 font-medium">{ranking.agency}</td>
                                  <td className="border p-3">{ranking.category || '-'}</td>
                                  <td className="border p-3 text-center">{ranking.year}</td>
                                  <td className="border p-3 text-center font-bold text-orange-600">#{ranking.rank}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Ranking information coming soon.</p>
                      )}
                    </div>
                  )}

                  {/* CUTOFF Section */}
                  {section === 'cutoff' && (
                    <div className="space-y-4">
                      {college.cutoff_data && college.cutoff_data.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-red-50">
                                <th className="border p-3 text-left">Course</th>
                                <th className="border p-3 text-left">Category</th>
                                <th className="border p-3 text-center">Year</th>
                                <th className="border p-3 text-center">Cutoff</th>
                              </tr>
                            </thead>
                            <tbody>
                              {college.cutoff_data.map((cutoff, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="border p-3 font-medium">{cutoff.course}</td>
                                  <td className="border p-3">{cutoff.category}</td>
                                  <td className="border p-3 text-center">{cutoff.year}</td>
                                  <td className="border p-3 text-center font-bold">{cutoff.cutoff}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Cutoff information coming soon.</p>
                      )}
                    </div>
                  )}

                  {/* SCHOLARSHIP Section */}
                  {section === 'scholarship' && (
                    <div className="space-y-4">
                      {college.scholarships && college.scholarships.length > 0 ? (
                        <div className="grid gap-4">
                          {college.scholarships.map((scholarship, idx) => (
                            <div key={idx} className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h4 className="font-semibold text-lg text-green-800">{scholarship.name}</h4>
                              {scholarship.amount && <p className="text-green-600 font-medium">Amount: ₹{scholarship.amount.toLocaleString()}</p>}
                              {scholarship.eligibility && <p className="text-gray-600 mt-2">{scholarship.eligibility}</p>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Scholarship information coming soon.</p>
                      )}
                    </div>
                  )}

                  {/* FACILITIES Section */}
                  {section === 'facilities' && (
                    <div className="space-y-4">
                      {college.facilities && college.facilities.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {college.facilities.map((facility, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg text-center">
                              <span className="text-2xl">🏢</span>
                              <p className="font-medium mt-2">{typeof facility === 'string' ? facility : facility.name}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Facilities information coming soon.</p>
                      )}
                    </div>
                  )}

                  {/* GALLERY Section */}
                  {section === 'gallery' && (
                    <div className="space-y-4">
                      {college.gallery && college.gallery.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {college.gallery.map((image, idx) => (
                            <div key={idx} className="aspect-video rounded-lg overflow-hidden">
                              <img 
                                src={image.url || image} 
                                alt={image.caption || `Gallery ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Gallery images coming soon.</p>
                      )}
                    </div>
                  )}

                  {/* REVIEWS Section */}
                  {section === 'reviews' && (
                    <div className="space-y-4">
                      <p className="text-gray-600">Student reviews and ratings for {college.name}.</p>
                      {/* Reviews component would go here */}
                      <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <p className="text-gray-500">Reviews section - Coming soon</p>
                      </div>
                    </div>
                  )}

                  {/* Custom Content from menu_config */}
                  {currentSection.content && !['info', 'courses', 'admission', 'placement', 'ranking', 'cutoff', 'scholarship', 'facilities', 'gallery', 'reviews'].includes(section) && (
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
                  <p className="text-gray-600 mb-6">The requested section "{section}" does not exist.</p>
                  <Link 
                    to={basePath}
                    className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
                  >
                    <FiHome size={16} /> Back to {college.name}
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Navigation */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiBookmark className="text-orange-500" size={18} /> Quick Navigation
                </h3>
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={`${basePath}/${item.id}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        section === item.id
                          ? 'bg-orange-100 text-orange-700 font-semibold'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span className={section === item.id ? 'text-orange-600' : 'text-gray-400'}>{getMenuIcon(item.id)}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* College Quick Facts */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HiOutlineOfficeBuilding className="text-orange-500" size={18} /> Quick Facts
                </h3>
                <div className="space-y-3 text-sm">
                  {college.established && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Established</span>
                      <span className="font-semibold">{college.established}</span>
                    </div>
                  )}
                  {college.institution_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-semibold">{college.institution_type}</span>
                    </div>
                  )}
                  {college.ownership && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ownership</span>
                      <span className="font-semibold">{college.ownership}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <FiHelpCircle size={18} /> Need Help?
                </h3>
                <p className="text-sm text-orange-100 mb-4">Get free counseling from our experts</p>
                <button className="w-full bg-white text-orange-600 py-2 rounded-lg font-semibold hover:bg-orange-50 flex items-center justify-center gap-2">
                  <FiPhone size={16} /> Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollegeSubPage;
