import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiDownload, FiFileText, FiCalendar, FiInfo, FiBook, FiAward, FiDollarSign, FiLoader, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import { SidebarSponsoredAd } from '../components/SponsoredAds';
import { ApplyNowWidget, AskQuestionWidget, CounsellingWidget } from '../components/widgets/ActionWidgets';
import api from '../api/axios';
import ReviewsSection from '../components/ReviewsSection';
import QuestionsSection from '../components/QuestionsSection';
import CommentsSection from '../components/CommentsSection';
import AuthorInfo from '../components/AuthorInfo';

import { Link } from '../components/CustomLink';
const ExamDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [activeTab, setActiveTab] = useState('questionPapers');
  const [activeSection, setActiveSection] = useState(null); // Start with null, will be set to first item
  const [examFromApi, setExamFromApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSeoContent, setShowSeoContent] = useState(false); // For Read More toggle

  // Fetch exam data from API
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        // If preview mode, fetch all exams (including draft/pending), otherwise only published
        // Only fetch from exams-detail (detailed exams from Exam Details Entry Form)
        const apiUrl = isPreview ? '/exams-detail?limit=100' : '/exams-detail?status=published&limit=100';
        let response = await api.get(apiUrl);
        let exam = response.data?.find(e => e.slug === id || e.id === id || e.name?.toLowerCase().replace(/\s+/g, '-') === id);
        
        if (exam) {
          setExamFromApi(exam);
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExam();
  }, [id, isPreview]);

  // Transform API data - No fallback mock data
  const exam = examFromApi ? {
    name: examFromApi.name,
    fullName: examFromApi.full_name || examFromApi.name,
    description: examFromApi.description || '',
    conductor: examFromApi.conducting_body || '',
    logoUrl: examFromApi.logo_url || '',
    questionPapers: examFromApi.question_papers?.reduce((acc, paper) => {
      const year = paper.year || '2024';
      if (!acc[year]) acc[year] = [];
      acc[year].push({ date: paper.name, downloadLink: paper.file_url || paper.external_link || '#', solutionLink: '#' });
      return acc;
    }, {}) || {},
    examInfo: {
      examMode: examFromApi.exam_mode ? `${examFromApi.exam_mode} Based Test` : '',
      examDuration: examFromApi.exam_duration || '',
      totalQuestions: examFromApi.num_questions ? `${examFromApi.num_questions} Questions` : '',
      totalMarks: examFromApi.total_marks ? `${examFromApi.total_marks} Marks` : '',
      examLevel: examFromApi.exam_level || '',
      examFrequency: examFromApi.exam_frequency || '',
      eligibility: examFromApi.eligibility || '',
      officialWebsite: examFromApi.official_website || ''
    },
    keyHighlights: examFromApi.key_summary || [],
    menuConfig: examFromApi.menu_config,
    sidebarWidgets: examFromApi.sidebar_widgets,
    metaTitle: examFromApi.meta_title,
    metaDescription: examFromApi.meta_description,
    streams: examFromApi.streams || [],
    examDate: examFromApi.exam_date,
    applicationStart: examFromApi.application_start_date,
    applicationEnd: examFromApi.application_end_date,
    resultDate: examFromApi.result_date,
    contentTeam: {
      author: 'Admissionbuddy Team',
      profileImage: 'https://ui-avatars.com/api/?name=AB&background=f97316&color=fff&size=40',
      updatedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    tableOfContents: examFromApi.menu_config?.items?.map(item => ({
      id: item.id,
      title: item.label
    })) || [],
    // SEO Content fields
    seoIntro: examFromApi.seo_intro,
    seoFullContent: examFromApi.seo_full_content,
    seoToc: examFromApi.seo_toc || [],
    seoTables: examFromApi.seo_tables || [],
    seoImages: examFromApi.seo_images || [],
    seoVideoUrl: examFromApi.seo_video_url,
    seoVideoTitle: examFromApi.seo_video_title,
    seoVideoDescription: examFromApi.seo_video_description,
    seoFaqs: examFromApi.seo_faqs || []
  } : null;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-3 text-gray-600">Loading exam details...</span>
      </div>
    );
  }

  // Show not found state when exam doesn't exist
  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b py-2">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/exams" className="hover:text-orange-600 transition-colors">Exams</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{id}</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-16 text-center">
          <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Not Found</h1>
          <p className="text-gray-600 mb-6">The exam you're looking for doesn't exist in our database yet.</p>
          <Link to="/exams" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Browse All Exams
          </Link>
        </div>
      </div>
    );
  }

  // Get current active menu item for SEO
  const activeMenuItem = exam.menuConfig?.items?.find(item => 
    activeSection ? item.id === activeSection : item.enabled !== false
  ) || exam.menuConfig?.items?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{activeMenuItem?.meta_title || exam.metaTitle || `${exam.name} - Admissionbuddy`}</title>
        <meta name="description" content={activeMenuItem?.meta_description || exam.metaDescription || exam.description} />
        <meta property="og:title" content={activeMenuItem?.meta_title || exam.metaTitle || exam.name} />
        <meta property="og:description" content={activeMenuItem?.meta_description || exam.metaDescription || exam.description} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://admissionbuddy.com/exams/${id}`} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white border-b py-2">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/exams" className="hover:text-orange-600 transition-colors">Exams</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{exam.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-start gap-6">
            {/* Exam Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {exam.logoUrl ? (
                <img 
                  src={exam.logoUrl.startsWith('http') ? exam.logoUrl : (exam.logoUrl.startsWith('/api') ? exam.logoUrl : `/api${exam.logoUrl}`)} 
                  alt={`${exam.name} logo`} 
                  className="w-full h-full object-contain p-2"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div className={`w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center ${exam.logoUrl ? 'hidden' : ''}`}>
                <span className="text-white text-2xl md:text-3xl font-bold">{exam.name?.charAt(0)}</span>
              </div>
            </div>
            
            {/* Exam Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{exam.fullName || exam.name}</h1>
              {exam.conductor && (
                <p className="text-blue-100 text-sm mb-2">Conducted by: {exam.conductor}</p>
              )}
              {exam.description ? (
                <div 
                  className="prose prose-invert prose-sm max-w-none text-lg opacity-90"
                  dangerouslySetInnerHTML={{ __html: exam.description }}
                />
              ) : (
                <p className="text-lg opacity-90">Complete information about {exam.name}</p>
              )}
              {exam.streams?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {exam.streams.map((stream, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm">{stream}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exam Menu */}
      {/* Dynamic Menu Tabs from Backend - Links to separate sub-pages */}
      <div className="bg-white border-b shadow-sm sticky top-16 z-30">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 overflow-x-auto py-3">
            {(exam.menuConfig?.items || []).filter(item => item.enabled !== false).map((item, idx) => {
              const enabledItems = (exam.menuConfig?.items || []).filter(i => i.enabled !== false);
              const isFirstItem = idx === 0;
              const isActive = activeSection ? activeSection === item.id : isFirstItem;
              // First menu item (Overview) links to main page, others to sub-pages
              const linkTo = isFirstItem 
                ? `/exams/${examFromApi?.slug || id}` 
                : `/exams/${examFromApi?.slug || id}/${item.id}`;
              return (
                <Link 
                  key={item.id} 
                  to={linkTo}
                  className={`text-sm font-medium pb-3 whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'font-semibold text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {/* Fallback if no menu items from backend */}
            {(!exam.menuConfig?.items || exam.menuConfig.items.length === 0) && (
              <>
                <Link to={`/exams/${examFromApi?.slug || id}`} className={`text-sm pb-3 whitespace-nowrap ${!activeSection ? 'font-semibold text-orange-600 border-b-2 border-orange-600' : 'font-medium text-gray-700 hover:text-orange-600'}`}>Overview</Link>
                <Link to={`/exams/${examFromApi?.slug || id}/eligibility`} className={`text-sm pb-3 whitespace-nowrap ${activeSection === 'eligibility' ? 'font-semibold text-orange-600 border-b-2 border-orange-600' : 'font-medium text-gray-700 hover:text-orange-600'}`}>Eligibility</Link>
                <Link to={`/exams/${examFromApi?.slug || id}/syllabus`} className={`text-sm pb-3 whitespace-nowrap ${activeSection === 'syllabus' ? 'font-semibold text-orange-600 border-b-2 border-orange-600' : 'font-medium text-gray-700 hover:text-orange-600'}`}>Syllabus</Link>
                <Link to={`/exams/${examFromApi?.slug || id}/exam-pattern`} className={`text-sm pb-3 whitespace-nowrap ${activeSection === 'exam-pattern' ? 'font-semibold text-orange-600 border-b-2 border-orange-600' : 'font-medium text-gray-700 hover:text-orange-600'}`}>Exam Pattern</Link>
                <Link to={`/exams/${examFromApi?.slug || id}/result`} className={`text-sm pb-3 whitespace-nowrap ${activeSection === 'result' ? 'font-semibold text-orange-600 border-b-2 border-orange-600' : 'font-medium text-gray-700 hover:text-orange-600'}`}>Result</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Author Info */}
      {exam.contentTeam && (
        <div className="bg-white border-b py-3">
          <div className="container mx-auto px-6">
            <AuthorInfo
              name={exam.contentTeam.author}
              photo={exam.contentTeam.profileImage}
              role="Content Writer"
              updatedAt={exam.contentTeam.updatedDate}
              showLink={true}
              size="md"
              variant="light"
            />
          </div>
        </div>
      )}

      {/* Key Highlights */}
      {exam.keyHighlights?.length > 0 && (
      <div className="bg-blue-50 border-b border-blue-200 py-4">
        <div className="container mx-auto px-6">
          <h3 className="font-bold text-gray-800 mb-2">Key Summary</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {exam.keyHighlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}

      {/* SEO Content Section - Dynamic from Admin Panel (Collapsible) */}
      {(exam.seoIntro || exam.seoFullContent || exam.seoToc?.length > 0 || exam.seoTables?.length > 0 || exam.seoFaqs?.length > 0 || exam.seoVideoUrl) && (
        <div className="bg-white border-b py-6">
          <div className="container mx-auto px-6">
            {/* SEO Intro Preview - Always visible, truncated when collapsed */}
            {exam.seoIntro && (
              <div className="mb-4">
                <div 
                  className={`text-gray-700 text-lg leading-relaxed prose prose-lg max-w-none ${!showSeoContent ? 'line-clamp-3' : ''}`}
                  dangerouslySetInnerHTML={{ __html: exam.seoIntro }}
                />
              </div>
            )}

            {/* Read More Button - Show when collapsed */}
            {!showSeoContent && (
              <div className="text-center mb-4">
                <button
                  onClick={() => setShowSeoContent(true)}
                  className="inline-flex items-center gap-2 px-6 py-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 text-sm font-medium rounded-full transition-colors"
                >
                  <span>Read More</span>
                  <FiChevronDown size={18} />
                </button>
              </div>
            )}

            {/* Expandable SEO Content - Show when expanded */}
            {showSeoContent && (
              <div className="space-y-6">
                {/* SEO Table of Contents */}
                {exam.seoToc?.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">📑 Table of Contents</h3>
                    <nav className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1">
                      {exam.seoToc.map((item, idx) => (
                        <a
                          key={idx}
                          href={`#${item.anchor || item.title?.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-blue-600 hover:text-orange-600 text-sm py-1 hover:underline"
                        >
                          {idx + 1}. {item.title}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* SEO Full Content (HTML) */}
                {exam.seoFullContent && (
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: exam.seoFullContent }}
                  />
                )}

                {/* SEO TOC Content Sections */}
                {exam.seoToc?.filter(item => item.content)?.length > 0 && (
                  <div className="space-y-6">
                    {exam.seoToc.filter(item => item.content).map((item, idx) => (
                      <div 
                        key={idx} 
                        id={item.anchor || item.title?.toLowerCase().replace(/\s+/g, '-')}
                        className="scroll-mt-24"
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-orange-500 pl-4">
                          {item.title}
                        </h3>
                        <div 
                          className="prose max-w-none text-gray-600"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* SEO Tables */}
                {exam.seoTables?.length > 0 && (
                  <div className="space-y-6">
                    {exam.seoTables.map((table, tIdx) => (
                      <div key={tIdx} className="overflow-x-auto">
                        {table.title && (
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">{table.title}</h3>
                        )}
                        <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                          <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            <tr>
                              {table.headers?.map((header, hIdx) => (
                                <th key={hIdx} className="border border-orange-400 px-4 py-3 text-left font-semibold">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.rows?.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="border border-gray-200 px-4 py-3 text-gray-700">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

                {/* SEO Images */}
                {exam.seoImages?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exam.seoImages.map((img, iIdx) => (
                      <figure key={iIdx} className="bg-gray-50 rounded-lg overflow-hidden">
                        <img 
                          src={img.url} 
                          alt={img.alt || img.title || `${exam.name} image`} 
                          className="w-full h-auto object-cover"
                        />
                        {(img.title || img.caption) && (
                          <figcaption className="text-sm text-gray-600 p-3 text-center">
                            {img.caption || img.title}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                )}

                {/* SEO Video */}
                {exam.seoVideoUrl && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      🎬 {exam.seoVideoTitle || `${exam.name} Video Guide`}
                    </h3>
                    <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                      <iframe 
                        src={exam.seoVideoUrl} 
                        title={exam.seoVideoTitle || exam.name}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    {exam.seoVideoDescription && (
                      <p className="text-sm text-gray-600 mt-2">{exam.seoVideoDescription}</p>
                    )}
                  </div>
                )}

                {/* SEO FAQs */}
                {exam.seoFaqs?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">❓ Frequently Asked Questions</h3>
                    <div className="space-y-3">
                      {exam.seoFaqs.map((faq, fIdx) => (
                        <div key={fIdx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
                          <p className="font-semibold text-gray-800 mb-2">Q: {faq.question}</p>
                          <p className="text-gray-600">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Read Less Button - Show at the end when expanded */}
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowSeoContent(false)}
                    className="inline-flex items-center gap-2 px-6 py-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 text-sm font-medium rounded-full transition-colors"
                  >
                    <span>Read Less</span>
                    <FiChevronUp size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area with Sidebar */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4 order-2 lg:order-1">
            {/* Quick Links / Table of Contents */}
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Quick Links</h3>
              <nav className="space-y-1">
                {(exam.menuConfig?.items || []).filter(i => i.enabled !== false).map((item, idx) => {
                  const isFirstItem = idx === 0;
                  const isActive = activeSection ? activeSection === item.id : isFirstItem;
                  return (
                    <a
                      key={item.id}
                      href={isFirstItem ? `/exams/${examFromApi?.slug || id}` : `/exams/${examFromApi?.slug || id}/${item.id}`}
                      className={`block px-3 py-2 rounded text-sm transition-colors ${
                        isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Apply Now Widget - Connected to System */}
            <ApplyNowWidget 
              collegeName={exam.name}
              courseName={exam.name}
              onClose={() => {}}
            />

            {/* Counselling Widget - Connected to System */}
            <CounsellingWidget onClose={() => {}} />

            {/* Ask Question Widget - Connected to System */}
            <AskQuestionWidget 
              context={`Regarding ${exam.name} exam`}
              onClose={() => {}}
            />

            {/* Sponsored Sidebar Ads */}
            <SidebarSponsoredAd placementId="exam_detail_sidebar" title="Recommended Colleges" />
          </aside>

          {/* Main Content - Dynamic based on activeSection */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Dynamic Content from Backend Menu Config */}
            {exam.menuConfig?.items && exam.menuConfig.items.length > 0 && (
              <div id="exam-content-section" className="mb-8 scroll-mt-32">
                {exam.menuConfig.items
                  .filter(item => {
                    // Show first enabled item (Overview) on main page
                    const firstEnabledItem = exam.menuConfig.items.find(i => i.enabled !== false);
                    return item.id === firstEnabledItem?.id;
                  })
                  .map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                      {/* Page Content (HTML) - includes its own heading */}
                      {item.content && (
                        <div 
                          className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-xl prose-h3:font-semibold prose-ul:list-disc prose-li:marker:text-orange-500"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      )}
                      
                      {/* Tables */}
                      {item.tables?.length > 0 && (
                        <div className="mb-6 space-y-4">
                          {item.tables.map((table, tIdx) => (
                            <div key={tIdx} className="overflow-x-auto">
                              {table.title && <h3 className="text-lg font-semibold text-gray-800 mb-2">{table.title}</h3>}
                              <table className="w-full border-collapse border border-gray-200">
                                <thead className="bg-orange-50">
                                  <tr>
                                    {table.headers?.map((header, hIdx) => (
                                      <th key={hIdx} className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-700">{header}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {table.rows?.map((row, rIdx) => (
                                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="border border-gray-200 px-4 py-2 text-gray-600">{cell}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* FAQs */}
                      {item.faqs?.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Frequently Asked Questions</h3>
                          <div className="space-y-3">
                            {item.faqs.map((faq, fIdx) => (
                              <div key={fIdx} className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium text-gray-800 mb-1">Q: {faq.question}</p>
                                <p className="text-gray-600">A: {faq.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Images */}
                      {item.images?.length > 0 && (
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {item.images.map((img, iIdx) => (
                            <div key={iIdx}>
                              <img src={img.url} alt={img.alt || img.title} className="rounded-lg w-full" />
                              {img.title && <p className="text-sm text-gray-500 mt-1">{img.title}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Videos */}
                      {item.videos?.length > 0 && (
                        <div className="mb-6 space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800">Videos</h3>
                          {item.videos.map((video, vIdx) => (
                            <div key={vIdx} className="aspect-video">
                              <iframe src={video.url} title={video.title} className="w-full h-full rounded-lg" allowFullScreen />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Fallback Overview if no menu config */}
            {!exam.menuConfig?.items && (
              <div id="overview" className="mb-8 scroll-mt-20">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div 
                    className="prose max-w-none text-gray-700 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: exam.description }}
                  />
                  <div className="flex gap-3">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      <FiDownload className="mr-2" />
                      Download All Question Papers
                    </Button>
                    <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                      <FiInfo className="mr-2" />
                      Get Counseling
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Question Paper Sections by Year - Only show if data exists */}
            {exam.questionPapers && Object.keys(exam.questionPapers).length > 0 && (
            <div className="space-y-6">
              {Object.keys(exam.questionPapers).map((year) => (
                <div key={year} id={year} className="bg-white rounded-lg shadow-md overflow-hidden scroll-mt-20">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FiBook />
                      {exam.name} Question Paper {year}
                    </h2>
                    <Button className="bg-white text-orange-600 hover:bg-gray-100 text-sm">
                      <FiDownload className="mr-2" size={14} />
                      Download All {year}
                    </Button>
                  </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                              {exam.name} Paper Name
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">
                              Question Paper PDF
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">
                              Solution PDF
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {(exam.questionPapers?.[year] || []).map((paper, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-gray-800">
                                {exam.name} {year} Question Paper {paper.date}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Link
                                  to={paper.downloadLink}
                                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  <FiDownload size={16} />
                                  Download PDF
                                </Link>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Link
                                  to={paper.solutionLink}
                                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 text-sm font-medium"
                                >
                                  <FiFileText size={16} />
                                  View Solution
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mid Content Advertisement */}
            <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg shadow-md p-8 text-center text-white">
              <p className="text-xs uppercase tracking-wide mb-2 opacity-90">Sponsored</p>
              <h3 className="text-xl font-bold mb-3">Master {exam.name} with Live Classes</h3>
              <p className="mb-4 opacity-95">Join India&apos;s top educators and ace your exam</p>
              <div className="flex gap-3 justify-center">
                <Button className="bg-white text-orange-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>

            {/* ChapterWise PYQs Section - Dynamic from Backend */}
            {examFromApi?.chapter_wise_pyqs?.length > 0 && (
            <div id="chapterwise" className="bg-white rounded-lg shadow-md p-6 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiBook className="text-orange-600" />
                Download {exam.name} PYQs ChapterWise
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {examFromApi.chapter_wise_pyqs.map((chapter, idx) => (
                  <Link key={idx} to={chapter.link || '#'} className="text-blue-600 hover:text-orange-600 text-sm hover:underline">
                    {chapter.name} {exam.name} PYQs
                  </Link>
                ))}
              </div>
            </div>
            )}

            {/* Paper Pattern Section - Only show if examInfo has data */}
            {exam.examInfo && Object.values(exam.examInfo).some(v => v) && (
            <div id="pattern" className="bg-white rounded-lg shadow-md p-6 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiFileText className="text-orange-600" />
                {exam.name} Paper Pattern
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(exam.examInfo).filter(([key, value]) => value).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-orange-500 pl-4">
                    <p className="text-sm text-gray-600 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Study Notes Section - Dynamic from Backend */}
            {examFromApi?.study_materials?.length > 0 && (
            <div id="studynotes" className="bg-white rounded-lg shadow-md p-6 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiBook className="text-orange-600" />
                {exam.name} Study Notes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {examFromApi.study_materials.map((material, idx) => (
                  <Link key={idx} to={material.link || material.file_url || '#'} className="text-blue-600 hover:text-orange-600 text-sm hover:underline">
                    {material.name || material.title} Study Notes
                  </Link>
                ))}
              </div>
            </div>
            )}

            {/* Advertisement - Rectangular Banner */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide mb-2 opacity-90">Featured</p>
                  <h3 className="text-xl font-bold mb-2">Download {exam.name} Mobile App</h3>
                  <p className="text-sm opacity-95">Practice anytime, anywhere with 10,000+ questions</p>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 text-sm">
                    Download App
                  </Button>
                </div>
              </div>
            </div>

            {/* Video Section - Only show if videos data exists */}
            {exam.videos && exam.videos.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FiBook className="text-orange-600" />
                Related Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exam.videos.map((video, idx) => (
                  <div key={idx} className="cursor-pointer group">
                    <div className="relative rounded-lg overflow-hidden shadow-md">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-orange-600 border-b-[12px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                        {video.duration}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800 mt-3">{video.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">Watch expert analysis and preparation tips</p>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Ask Question Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Have Questions About {exam.name}?</h3>
              <p className="text-gray-600 mb-4">Get your doubts cleared by our expert counselors</p>
              <div className="flex gap-3">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Ask a Question
                </Button>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  Talk to Counselor
                </Button>
              </div>
            </div>

            {/* Reviews Section */}
            <section id="reviews" className="mt-8">
              <ReviewsSection 
                entityId={examFromApi?.id || id} 
                entityType="exam" 
                entityName={exam.name}
              />
            </section>

            {/* Questions & Answers */}
            <section id="questions" className="mt-8">
              <QuestionsSection 
                entityId={examFromApi?.id || id} 
                entityType="exam" 
                entityName={exam.name}
              />
            </section>

            {/* Comments & Discussion */}
            <section id="comments" className="mt-8">
              <CommentsSection 
                entityId={examFromApi?.id || id} 
                entityType="exam" 
                entityName={exam.name}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
