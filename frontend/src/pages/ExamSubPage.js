import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiBook, FiFileText, FiCheckCircle, FiCalendar, FiBriefcase, FiDollarSign, FiImage, FiHelpCircle, FiTrendingUp, FiMapPin, FiStar, FiChevronRight, FiChevronDown, FiChevronUp, FiDownload, FiLoader } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineLightBulb, HiOutlineDocumentText } from 'react-icons/hi';
import api from '../api/axios';
import { ApplyNowWidget, AskQuestionWidget, CounsellingWidget } from '../components/widgets/ActionWidgets';
import { SidebarSponsoredAd } from '../components/SponsoredAds';
import ReviewsSection from '../components/ReviewsSection';

import { Link } from '../components/CustomLink';

// Icon mapping for menu
const iconMap = {
  'overview': <FiBook size={16} />,
  'dates': <FiCalendar size={16} />,
  'eligibility': <FiCheckCircle size={16} />,
  'application': <FiFileText size={16} />,
  'pattern': <HiOutlineDocumentText size={16} />,
  'syllabus': <HiOutlineDocumentText size={16} />,
  'preparation': <FiTrendingUp size={16} />,
  'cutoff': <FiStar size={16} />,
  'result': <FiCheckCircle size={16} />,
  'counseling': <HiOutlineLightBulb size={16} />,
  'admit-card': <FiFileText size={16} />,
  'answer-key': <FiFileText size={16} />,
  'colleges': <HiOutlineOfficeBuilding size={16} />,
  'default': <FiBook size={16} />,
};

// Large icons for headers
const iconMapLarge = {
  'overview': <FiBook size={28} />,
  'dates': <FiCalendar size={28} />,
  'eligibility': <FiCheckCircle size={28} />,
  'application': <FiFileText size={28} />,
  'pattern': <HiOutlineDocumentText size={28} />,
  'syllabus': <HiOutlineDocumentText size={28} />,
  'preparation': <FiTrendingUp size={28} />,
  'cutoff': <FiStar size={28} />,
  'result': <FiCheckCircle size={28} />,
  'counseling': <HiOutlineLightBulb size={28} />,
  'admit-card': <FiFileText size={28} />,
  'answer-key': <FiFileText size={28} />,
  'colleges': <HiOutlineOfficeBuilding size={28} />,
  'default': <FiBook size={28} />,
};

const getMenuIcon = (iconId) => iconMap[iconId] || iconMap['default'];
const getMenuIconLarge = (iconId) => iconMapLarge[iconId] || iconMapLarge['default'];

const ExamSubPage = () => {
  const { id, section } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Fetch exam data - Only from Exam Details Entry Form (exams-detail)
  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        // If preview mode, fetch all exams, otherwise only published
        // Only fetch from exams-detail (detailed exams from Exam Details Entry Form)
        const apiUrl = isPreview ? '/exams-detail?limit=100' : '/exams-detail?status=published&limit=100';
        const response = await api.get(apiUrl);
        const exams = response.data || [];
        
        // Find exam by slug or id
        let foundExam = exams.find(e => e.slug === id);
        
        if (!foundExam) {
          foundExam = exams.find(e => 
            e.id === id ||
            e.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === id
          );
        }
        
        if (foundExam) {
          setExam(foundExam);
          
          // Find current section from menu_config
          const menuItems = foundExam.menu_config?.items || foundExam.menuConfig?.items || [];
          const found = menuItems.find(item => item.id === section);
          
          if (found) {
            setCurrentSection(found);
          } else {
            // Create default section
            const defaultLabels = {
              'overview': 'Overview',
              'dates': 'Important Dates',
              'eligibility': 'Eligibility',
              'application': 'Application',
              'pattern': 'Exam Pattern',
              'syllabus': 'Syllabus',
              'preparation': 'Preparation',
              'cutoff': 'Cutoff',
              'result': 'Result',
              'counseling': 'Counseling',
              'admit-card': 'Admit Card',
              'answer-key': 'Answer Key',
            };
            setCurrentSection({
              id: section,
              label: defaultLabels[section] || section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' '),
              content: '',
              page_heading: `${foundExam.name} ${defaultLabels[section] || section}`,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExam();
  }, [id, section, isPreview]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Not Found</h1>
          <p className="text-gray-600 mb-4">The exam you're looking for doesn't exist.</p>
          <Link to="/exams" className="text-blue-600 hover:underline">Browse All Exams</Link>
        </div>
      </div>
    );
  }

  // Get menu items from backend config or use default fallback
  const backendMenuItems = (exam.menu_config?.items || exam.menuConfig?.items || []).filter(item => item.enabled !== false);
  
  // Default menu items if no menu_config exists
  const defaultMenuItems = [
    { id: 'overview', label: 'Overview', enabled: true },
    { id: 'dates', label: 'Important Dates', enabled: true },
    { id: 'eligibility', label: 'Eligibility', enabled: true },
    { id: 'application', label: 'Application', enabled: true },
    { id: 'pattern', label: 'Exam Pattern', enabled: true },
    { id: 'syllabus', label: 'Syllabus', enabled: true },
    { id: 'preparation', label: 'Preparation', enabled: true },
    { id: 'cutoff', label: 'Cutoff', enabled: true },
    { id: 'result', label: 'Result', enabled: true },
    { id: 'counseling', label: 'Counseling', enabled: true },
  ];
  
  const menuItems = backendMenuItems.length > 0 ? backendMenuItems : defaultMenuItems;
  
  // Get page heading and meta info
  const pageHeading = currentSection?.page_heading || `${exam.name} ${currentSection?.label || section}`;
  const metaTitle = currentSection?.meta_title || `${pageHeading} | AdmissionBuddy`;
  const metaDescription = currentSection?.meta_description || `Get complete information about ${exam.name} ${currentSection?.label || section}. Updated for 2025.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white border-b py-3">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
              <FiHome size={14} /> Home
            </Link>
            <FiChevronRight size={14} />
            <Link to="/exams" className="hover:text-orange-600 transition-colors">Exams</Link>
            <FiChevronRight size={14} />
            <Link to={`/exams/${exam.slug || id}`} className="hover:text-orange-600 transition-colors">{exam.name}</Link>
            <FiChevronRight size={14} />
            <span className="text-gray-900 font-medium">{currentSection?.label || section}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white/80">{getMenuIconLarge(section)}</span>
            <h1 className="text-2xl md:text-3xl font-bold">{pageHeading}</h1>
          </div>
          <p className="text-white/90">{exam.full_name || exam.fullName || exam.name}</p>
          {exam.streams?.length > 0 && (
            <div className="flex gap-2 mt-3">
              {exam.streams.map((stream, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm">{stream}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white border-b shadow-sm sticky top-16 z-30">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto py-3 scrollbar-hide">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={`/exams/${exam.slug || id}/${item.id}${isPreview ? '?preview=true' : ''}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  item.id === section
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {getMenuIcon(item.id)}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main Content Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {getMenuIconLarge(section)}
                {currentSection?.label || section}
              </h2>
              
              {/* Dynamic Content from Backend */}
              {currentSection?.content ? (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentSection.content }}
                />
              ) : (
                <p className="text-gray-600">
                  Content for {exam.name} {currentSection?.label || section} will be available soon.
                </p>
              )}

              {/* Tables if any */}
              {currentSection?.tables?.length > 0 && (
                <div className="mt-6 space-y-6">
                  {currentSection.tables.map((table, idx) => (
                    <div key={idx}>
                      {table.title && <h3 className="font-bold text-lg mb-3">{table.title}</h3>}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          {table.headers?.length > 0 && (
                            <thead className="bg-gray-100">
                              <tr>
                                {table.headers.map((header, hIdx) => (
                                  <th key={hIdx} className="border border-gray-200 px-4 py-2 text-left font-semibold">{header}</th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {table.rows?.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="border border-gray-200 px-4 py-2">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TOC if any */}
              {currentSection?.toc?.length > 0 && (
                <div className="mt-6 space-y-6">
                  {currentSection.toc.map((item, idx) => (
                    <div key={idx} id={item.anchor} className="scroll-mt-20">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      {item.content && (
                        <div 
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* FAQs if any */}
              {currentSection?.faqs?.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-lg mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {currentSection.faqs.map((faq, idx) => (
                      <div key={idx} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {expandedFaq === idx ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {expandedFaq === idx && (
                          <div className="p-4 bg-white border-t">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <ReviewsSection 
              entityType="exam" 
              entityId={exam.id} 
              entityName={exam.name}
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Quick Navigation */}
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-28">
              <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Quick Links</h3>
              <nav className="space-y-1">
                {menuItems.slice(0, 8).map((item) => (
                  <Link
                    key={item.id}
                    to={`/exams/${exam.slug || id}/${item.id}${isPreview ? '?preview=true' : ''}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                      item.id === section 
                        ? 'bg-orange-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {getMenuIcon(item.id)}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Apply Now Widget */}
            <ApplyNowWidget 
              collegeName={exam.name}
              courseName={exam.name}
              onClose={() => {}}
            />

            {/* Counselling Widget */}
            <CounsellingWidget onClose={() => {}} />

            {/* Ask Question Widget */}
            <AskQuestionWidget 
              context={`Regarding ${exam.name} ${currentSection?.label || section}`}
              onClose={() => {}}
            />

            {/* Sponsored Ads */}
            <SidebarSponsoredAd placementId="exam_subpage_sidebar" title="Recommended Colleges" />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ExamSubPage;
