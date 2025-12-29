import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiBook, FiFileText, FiCheckCircle, FiCalendar, FiBriefcase, FiDollarSign, FiImage, FiHelpCircle, FiTrendingUp, FiMapPin, FiStar, FiChevronRight } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineLightBulb, HiOutlineDocumentText } from 'react-icons/hi';
import api from '../api/axios';
import { ApplyNowWidget, AskQuestionWidget, CounsellingWidget } from '../components/widgets/ActionWidgets';
import { SidebarSponsoredAd } from '../components/SponsoredAds';
import ReviewsSection from '../components/ReviewsSection';

import { Link } from '../components/CustomLink';

// Icon mapping for menu
const iconMap = {
  'overview': <FiBook size={16} />,
  'syllabus': <HiOutlineDocumentText size={16} />,
  'eligibility': <FiCheckCircle size={16} />,
  'admission': <FiCalendar size={16} />,
  'colleges': <HiOutlineOfficeBuilding size={16} />,
  'career': <FiBriefcase size={16} />,
  'fees': <FiDollarSign size={16} />,
  'salary': <FiDollarSign size={16} />,
  'faqs': <HiOutlineLightBulb size={16} />,
  'gallery': <FiImage size={16} />,
  'default': <FiBook size={16} />,
};

// Large icons for headers
const iconMapLarge = {
  'overview': <FiBook size={28} />,
  'syllabus': <HiOutlineDocumentText size={28} />,
  'eligibility': <FiCheckCircle size={28} />,
  'admission': <FiCalendar size={28} />,
  'colleges': <HiOutlineOfficeBuilding size={28} />,
  'career': <FiBriefcase size={28} />,
  'fees': <FiDollarSign size={28} />,
  'salary': <FiDollarSign size={28} />,
  'faqs': <HiOutlineLightBulb size={28} />,
  'gallery': <FiImage size={28} />,
  'default': <FiBook size={28} />,
};

const getMenuIcon = (iconId) => iconMap[iconId] || iconMap['default'];
const getMenuIconLarge = (iconId) => iconMapLarge[iconId] || iconMapLarge['default'];

const CourseSubPage = () => {
  const { slug, section } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);
  const [activeWidget, setActiveWidget] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Try to get published courses
        const detailResponse = await api.get('/courses-detail?status=published');
        const detailCourses = detailResponse.data || [];
        
        // Find course by slug
        let foundCourse = detailCourses.find(c => c.slug === slug);
        
        if (!foundCourse) {
          foundCourse = detailCourses.find(c => 
            c.id === slug ||
            c.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
          );
        }
        
        // Fallback to quick courses endpoint
        if (!foundCourse) {
          const quickResponse = await api.get('/courses');
          const quickCourses = quickResponse.data || [];
          foundCourse = quickCourses.find(c => 
            c.slug === slug || c.id === slug ||
            c.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
          );
        }
        
        if (foundCourse) {
          setCourse(foundCourse);
          
          // Find current section from menu_config
          const menuItems = foundCourse.menu_config?.items || [];
          const found = menuItems.find(item => item.id === section);
          
          if (found) {
            setCurrentSection(found);
          } else {
            // Create default section
            const defaultLabels = {
              'overview': 'Overview',
              'syllabus': 'Syllabus',
              'eligibility': 'Eligibility',
              'admission': 'Admission Process',
              'colleges': 'Top Colleges',
              'career': 'Career Options',
              'fees': 'Fee Structure',
              'salary': 'Salary & Scope',
              'faqs': 'FAQs',
              'gallery': 'Gallery'
            };
            setCurrentSection({
              id: section,
              label: defaultLabels[section] || section,
              enabled: true
            });
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [slug, section]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiBook className="text-orange-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you are looking for does not exist.</p>
          <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700">
            <FiBook size={18} /> Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  // Course data
  const courseName = course.name || 'Course';
  const fullName = course.full_name || courseName;
  const duration = course.duration || '';
  const degreeType = course.degree_type || '';
  const basePath = `/courses/${slug}`;

  // Menu items
  const defaultMenuItems = [
    { id: 'overview', label: 'Overview', enabled: true },
    { id: 'syllabus', label: 'Syllabus', enabled: true },
    { id: 'career', label: 'Career Options', enabled: true },
    { id: 'fees', label: 'Fee Structure', enabled: true },
    { id: 'eligibility', label: 'Eligibility', enabled: true },
    { id: 'admission', label: 'Admission Process', enabled: true },
    { id: 'colleges', label: 'Top Colleges', enabled: true },
    { id: 'salary', label: 'Salary & Scope', enabled: true },
    { id: 'faqs', label: 'FAQs', enabled: true },
    { id: 'gallery', label: 'Gallery', enabled: true },
  ];

  const menuItems = (course.menu_config?.items?.length > 0 ? course.menu_config.items : defaultMenuItems)
    .filter(item => item.enabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // SEO values
  const getSeoValues = () => {
    const year = new Date().getFullYear();
    const defaults = {
      overview: {
        title: `${fullName} - Course Details, Eligibility, Fees ${year} | AdmissionBuddy`,
        description: `Get complete information about ${fullName}. Explore eligibility, fee structure, top colleges, career options.`,
        heading: fullName
      },
      syllabus: {
        title: `${courseName} Syllabus ${year} - Subjects, Curriculum | AdmissionBuddy`,
        description: `Check ${courseName} syllabus and curriculum. Get semester wise subjects and course structure.`,
        heading: `${courseName} Syllabus`
      },
      eligibility: {
        title: `${courseName} Eligibility ${year} - Qualification, Age Limit | AdmissionBuddy`,
        description: `Know ${courseName} eligibility criteria. Check educational qualification and entrance exam requirements.`,
        heading: `${courseName} Eligibility Criteria`
      },
      admission: {
        title: `${courseName} Admission Process ${year} - How to Apply | AdmissionBuddy`,
        description: `Complete guide to ${courseName} admission. Know application process and important dates.`,
        heading: `${courseName} Admission Process`
      },
      colleges: {
        title: `Top ${courseName} Colleges in India ${year} | AdmissionBuddy`,
        description: `Find top colleges for ${courseName} in India. Compare fees, placements, rankings.`,
        heading: `Top Colleges for ${courseName}`
      },
      career: {
        title: `${courseName} Career Options ${year} - Jobs, Salary, Scope | AdmissionBuddy`,
        description: `Explore career options after ${courseName}. Know about job roles, salary packages, and future scope.`,
        heading: `${courseName} Career Options & Jobs`
      },
      fees: {
        title: `${courseName} Fee Structure ${year} - College Wise Fees | AdmissionBuddy`,
        description: `Check ${courseName} fee structure in top colleges. Get details on tuition fees and expenses.`,
        heading: `${courseName} Fee Structure`
      },
      salary: {
        title: `${courseName} Salary ${year} - Average Package, Highest Salary | AdmissionBuddy`,
        description: `Know ${courseName} salary in India. Get details on average package and salary growth.`,
        heading: `${courseName} Salary & Scope`
      },
      faqs: {
        title: `${courseName} FAQs - Frequently Asked Questions | AdmissionBuddy`,
        description: `Get answers to frequently asked questions about ${courseName}.`,
        heading: `${courseName} - FAQs`
      },
      gallery: {
        title: `${courseName} Gallery - Images & Videos | AdmissionBuddy`,
        description: `View ${courseName} related images and videos.`,
        heading: `${courseName} Gallery`
      }
    };

    const sectionDefaults = defaults[section] || defaults.overview;
    
    return {
      title: currentSection?.meta_title || sectionDefaults.title,
      description: currentSection?.meta_description || sectionDefaults.description,
      keywords: currentSection?.meta_keywords || `${courseName}, ${courseName} ${section}`,
      heading: currentSection?.page_heading || sectionDefaults.heading
    };
  };

  const seo = getSeoValues();

  // Section content components
  const renderSectionContent = () => {
    switch (section) {
      case 'overview':
        return (
          <div className="space-y-6">
            {course.description && (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.description }} />
            )}
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {duration && (
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{duration}</p>
                  <p className="text-sm text-gray-600">Duration</p>
                </div>
              )}
              {course.average_fees > 0 && (
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">₹{(course.average_fees/100000).toFixed(1)}L</p>
                  <p className="text-sm text-gray-600">Avg. Fees/Year</p>
                </div>
              )}
              {course.total_colleges_offering > 0 && (
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">{course.total_colleges_offering}+</p>
                  <p className="text-sm text-gray-600">Colleges</p>
                </div>
              )}
              {degreeType && (
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-orange-700">{degreeType}</p>
                  <p className="text-sm text-gray-600">Degree Type</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'syllabus':
        const syllabusData = course.syllabus || [];
        return (
          <div className="space-y-4">
            {syllabusData.length > 0 ? (
              syllabusData.map((sem, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-900 flex items-center justify-between">
                    <span>{sem.semester}</span>
                    <span className="text-sm text-gray-500">{sem.subjects?.length || 0} Subjects</span>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {(sem.subjects || []).map((subject, sidx) => (
                      <div key={sidx} className="flex items-center gap-2 text-sm text-gray-700">
                        <FiCheckCircle className="text-green-500" size={14} />
                        {subject}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Syllabus information will be updated soon.</p>
            )}
          </div>
        );

      case 'eligibility':
        return (
          <div className="space-y-4">
            {[
              { title: 'Educational Qualification', desc: course.eligibility },
              { title: 'Entrance Exam', desc: course.entrance_exams?.join(', ') },
              { title: 'Age Limit', desc: course.age_limit },
            ].filter(item => item.desc).map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
            {!course.eligibility && !course.age_limit && (
              <p className="text-gray-500 italic">Eligibility information will be updated soon.</p>
            )}
          </div>
        );

      case 'admission':
        return (
          <div className="space-y-6">
            {course.admission_process && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Apply</h3>
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: course.admission_process }} />
              </div>
            )}
            {course.selection_criteria && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Selection Criteria</h3>
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: course.selection_criteria }} />
              </div>
            )}
            {!course.admission_process && !course.selection_criteria && (
              <p className="text-gray-500 italic">Admission process information will be updated soon.</p>
            )}
          </div>
        );

      case 'colleges':
        const topColleges = course.top_colleges || [];
        return (
          <div className="space-y-4">
            {topColleges.length > 0 ? (
              topColleges.map((college, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {college.rank || idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{college.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      {college.location && <span className="flex items-center gap-1"><FiMapPin size={12} /> {college.location}</span>}
                      {college.rating > 0 && <span className="flex items-center gap-1"><FiStar size={12} className="text-yellow-500" /> {college.rating}</span>}
                      {college.fees && <span>{college.fees}</span>}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200">
                    Apply
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Top colleges information will be updated soon.</p>
            )}
            <Link to="/colleges" className="mt-4 inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700">
              View All Colleges <FiChevronRight />
            </Link>
          </div>
        );

      case 'career':
        const jobOpportunities = course.job_opportunities || [];
        const careerProspects = course.career_prospects || '';
        const careerOptions = course.career_options || [];
        const jobRoles = course.job_roles || [];
        
        return (
          <div className="space-y-6">
            {careerProspects && (
              <div className="p-4 bg-amber-50 rounded-xl">
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: careerProspects }} />
              </div>
            )}
            
            {careerOptions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Career Options</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {careerOptions.map((option, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                      <FiTrendingUp className="text-blue-600" />
                      <span className="text-gray-800">{typeof option === 'string' ? option : option.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {jobRoles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Roles</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {jobRoles.map((role, idx) => (
                    <div key={idx} className="p-3 bg-green-50 rounded-lg flex items-center gap-2">
                      <FiBriefcase className="text-green-600" />
                      <span className="text-gray-800">{typeof role === 'string' ? role : role.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {jobOpportunities.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {jobOpportunities.map((job, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center">
                      <FiBriefcase size={18} />
                    </div>
                    <h4 className="font-semibold text-gray-900">{typeof job === 'string' ? job : job.title}</h4>
                  </div>
                ))}
              </div>
            )}
            
            {(course.salary_range?.min > 0 || course.salary_range?.max > 0) && (
              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Expected Salary Range</h4>
                <p className="text-green-700 text-lg font-bold">
                  ₹{course.salary_range?.min ? (course.salary_range.min/100000).toFixed(1) : '0'}L - ₹{course.salary_range?.max ? (course.salary_range.max/100000).toFixed(1) : '0'}L per annum
                </p>
              </div>
            )}
            
            {!careerProspects && careerOptions.length === 0 && jobRoles.length === 0 && jobOpportunities.length === 0 && (
              <p className="text-gray-500 italic">Career information will be updated soon.</p>
            )}
          </div>
        );

      case 'fees':
        return (
          <div className="space-y-6">
            {course.average_fees > 0 && (
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Fee Structure</h3>
                <p className="text-3xl font-bold text-green-700">₹{(course.average_fees/100000).toFixed(2)} Lakhs</p>
                <p className="text-sm text-gray-600 mt-1">Per Year (Approximate)</p>
              </div>
            )}
            {course.fee_details && (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.fee_details }} />
            )}
            {!course.average_fees && !course.fee_details && (
              <p className="text-gray-500 italic">Fee structure information will be updated soon.</p>
            )}
          </div>
        );

      case 'salary':
        return (
          <div className="space-y-6">
            {(course.salary_range?.min > 0 || course.salary_range?.max > 0) && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expected Salary Range</h3>
                <p className="text-3xl font-bold text-blue-700">
                  ₹{course.salary_range?.min ? (course.salary_range.min/100000).toFixed(1) : '0'}L - ₹{course.salary_range?.max ? (course.salary_range.max/100000).toFixed(1) : '0'}L
                </p>
                <p className="text-sm text-gray-600 mt-1">Per Annum</p>
              </div>
            )}
            {course.salary_details && (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.salary_details }} />
            )}
            {!course.salary_range?.min && !course.salary_range?.max && !course.salary_details && (
              <p className="text-gray-500 italic">Salary information will be updated soon.</p>
            )}
          </div>
        );

      case 'faqs':
        const faqs = course.faqs || [];
        return (
          <div className="space-y-3">
            {faqs.length > 0 ? (
              faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.q}</span>
                    <FiChevronRight className={`text-gray-500 transition-transform ${expandedFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">FAQs will be updated soon.</p>
            )}
          </div>
        );

      case 'gallery':
        const images = course.gallery_images || course.images || [];
        return (
          <div className="space-y-6">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border">
                    <img 
                      src={typeof img === 'string' ? img : img.url} 
                      alt={typeof img === 'object' ? img.alt : `${courseName} Image ${idx + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Gallery images will be updated soon.</p>
            )}
          </div>
        );

      default:
        return (
          <p className="text-gray-500 italic">Content for this section will be updated soon.</p>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}${basePath}/${section}`} />
        <link rel="canonical" href={`${window.location.origin}${basePath}/${section}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header with Course Info */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <HiOutlineAcademicCap className="text-blue-900" size={32} />
              </div>
              <div>
                <Link to={basePath} className="hover:underline">
                  <h1 className="text-2xl font-bold">{fullName}</h1>
                </Link>
                <div className="flex items-center gap-3 text-blue-200 text-sm mt-1">
                  {degreeType && <span className="bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded text-xs font-bold">{degreeType}</span>}
                  {duration && <span>{duration}</span>}
                </div>
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                {/* Page Heading */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-orange-500">{getMenuIconLarge(section)}</span>
                  {seo.heading}
                </h1>
                
                {/* Section Content */}
                {renderSectionContent()}
              </div>

              {/* Reviews Section - Show on all pages */}
              {section !== 'reviews' && (
                <div className="mt-8">
                  <ReviewsSection 
                    entityId={course?.id || slug} 
                    entityType="course" 
                    entityName={courseName}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={() => setActiveWidget('apply')} className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <FiChevronRight size={18} /> Apply Now
                  </button>
                  <button onClick={() => setActiveWidget('question')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <FiHelpCircle size={18} /> Ask Question
                  </button>
                  <button onClick={() => setActiveWidget('counselling')} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <HiOutlineAcademicCap size={18} /> Free Counselling
                  </button>
                </div>
              </div>

              {/* Sponsored Ad */}
              <SidebarSponsoredAd 
                placementId="course_detail_sidebar" 
                title="Top Colleges for this Course"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Widget Modals */}
      {activeWidget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setActiveWidget(null)}>
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            {activeWidget === 'apply' && <ApplyNowWidget courseName={courseName} onClose={() => setActiveWidget(null)} />}
            {activeWidget === 'question' && <AskQuestionWidget context={courseName} onClose={() => setActiveWidget(null)} />}
            {activeWidget === 'counselling' && <CounsellingWidget onClose={() => setActiveWidget(null)} />}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseSubPage;
