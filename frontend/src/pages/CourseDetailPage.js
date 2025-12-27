import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiChevronRight, FiChevronDown, FiChevronUp, FiClock, FiDollarSign, FiBook, FiUsers, FiSend, FiMessageCircle, FiPhone, FiMapPin, FiCalendar, FiAward, FiTrendingUp, FiCheckCircle, FiDownload, FiShare2, FiHeart, FiStar, FiBriefcase, FiLayers } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineLightBulb, HiOutlineDocumentText } from 'react-icons/hi';
import api from '../api/axios';
import { ApplyNowWidget, AskQuestionWidget, CounsellingWidget } from '../components/widgets/ActionWidgets';
import { SidebarSponsoredAd } from '../components/SponsoredAds';
import ReviewsSection from '../components/ReviewsSection';
import QuestionsSection from '../components/QuestionsSection';
import CommentsSection from '../components/CommentsSection';
import AuthorInfo from '../components/AuthorInfo';

import { Link } from '../components/CustomLink';
const CourseDetailPage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeWidget, setActiveWidget] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const detailResponse = await api.get('/courses-detail');
        const detailCourses = detailResponse.data || [];
        let foundCourse = detailCourses.find(c => 
          c.slug === slug || c.id === slug ||
          c.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
        );
        
        if (!foundCourse) {
          const quickResponse = await api.get('/courses');
          const quickCourses = quickResponse.data || [];
          foundCourse = quickCourses.find(c => 
            c.slug === slug || c.id === slug ||
            c.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug ||
            c.name?.toLowerCase() === slug.toLowerCase()
          );
        }
        
        if (foundCourse) setCourse(foundCourse);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiBook className="text-orange-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you are looking for does not exist or has been moved.</p>
          <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors">
            <FiBook size={18} /> Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  const courseName = course.name || 'Course';
  const fullName = course.full_name || courseName;
  const duration = course.duration || '';
  const degreeType = course.degree_type || '';
  const avgFees = course.average_fees || course.avg_fees || 0;
  const totalColleges = course.total_colleges_offering || course.total_colleges || 0;
  const eligibility = course.eligibility || '';
  const description = course.description || '';

  // Dynamic navigation tabs - only show tabs that have data
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: FiBook, show: true },
    { id: 'eligibility', label: 'Eligibility', icon: FiCheckCircle, show: !!eligibility },
    { id: 'syllabus', label: 'Syllabus', icon: HiOutlineDocumentText, show: course.syllabus && course.syllabus.length > 0 },
    { id: 'colleges', label: 'Top Colleges', icon: HiOutlineOfficeBuilding, show: course.top_colleges && course.top_colleges.length > 0 },
    { id: 'career', label: 'Career & Jobs', icon: FiBriefcase, show: (course.job_opportunities && course.job_opportunities.length > 0) || course.career_prospects },
    { id: 'faqs', label: 'FAQs', icon: HiOutlineLightBulb, show: course.faqs && course.faqs.length > 0 },
  ].filter(tab => tab.show);

  // Syllabus data - only from database, no fallback
  const syllabusData = course.syllabus && course.syllabus.length > 0 ? course.syllabus : [];

  // Highlights/Badges - only from database, no fallback
  const highlights = course.highlights && course.highlights.length > 0 ? course.highlights : [];

  // Related Courses - only from database, no fallback
  const relatedCourses = course.related_courses && course.related_courses.length > 0 
    ? course.related_courses 
    : [];

  // Top Colleges - only from database
  const topColleges = course.top_colleges || [];

  // Age Limit - only from database
  const ageLimit = course.age_limit || '';

  // Job Opportunities & Career - only from database
  const jobOpportunities = course.job_opportunities || [];
  const careerProspects = course.career_prospects || '';

  // FAQs - only from database
  const faqs = course.faqs || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
        
        <div className="relative container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <FiChevronRight size={14} />
            <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
            <FiChevronRight size={14} />
            <span className="text-white font-medium">{courseName}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-bold uppercase">{degreeType}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{duration}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                {fullName}
              </h1>
              
              <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                {description.substring(0, 200)}...
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <FiClock className="text-yellow-400 mb-2" size={24} />
                  <p className="text-2xl font-bold">{duration}</p>
                  <p className="text-blue-200 text-sm">Duration</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <FiDollarSign className="text-green-400 mb-2" size={24} />
                  <p className="text-2xl font-bold">₹{avgFees > 0 ? (avgFees/100000).toFixed(1) + 'L' : 'Varies'}</p>
                  <p className="text-blue-200 text-sm">Avg. Fees/Year</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <HiOutlineOfficeBuilding className="text-purple-400 mb-2" size={24} />
                  <p className="text-2xl font-bold">{totalColleges}+</p>
                  <p className="text-blue-200 text-sm">Colleges</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <FiTrendingUp className="text-orange-400 mb-2" size={24} />
                  <p className="text-2xl font-bold">High</p>
                  <p className="text-blue-200 text-sm">Job Demand</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setActiveWidget('apply')} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-orange-500/30">
                  <FiSend size={18} /> Apply Now
                </button>
                <button onClick={() => setActiveWidget('counselling')} className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm">
                  <FiPhone size={18} /> Free Counselling
                </button>
                <button className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2">
                  <FiDownload size={18} /> Brochure
                </button>
                <button onClick={() => setIsSaved(!isSaved)} className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${isSaved ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                  <FiHeart size={18} fill={isSaved ? 'white' : 'none'} />
                </button>
              </div>
            </div>

            {/* Right Side - Quick Apply Card */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl p-6 shadow-2xl text-gray-900">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Enquiry</h3>
                <form className="space-y-3">
                  <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-600">
                    <option>Select City</option>
                    <option>Delhi</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Chennai</option>
                  </select>
                  <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors">
                    Submit Enquiry
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-3 text-center">By submitting, you agree to our Terms & Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); scrollToSection(tab.id); }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview Section */}
            <section id="overview" className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiBook className="text-blue-600" size={20} />
                  </span>
                  About {courseName}
                </h2>
                <AuthorInfo
                  name={course?.author_name}
                  photo={course?.author_image}
                  role={course?.author_role || 'Content Writer'}
                  updatedAt={course?.updated_at}
                  createdAt={course?.created_at}
                  showLink={true}
                  size="sm"
                />
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">{description}</p>
                <p className="text-gray-700 leading-relaxed">
                  This program is designed to equip students with both theoretical knowledge and practical skills required in the industry. 
                  Graduates are well-prepared for diverse career opportunities in various sectors.
                </p>
              </div>

              {/* Highlights/Badges - Dynamic */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {highlights.slice(0, 4).map((highlight, idx) => {
                  const colors = [
                    'text-green-600 bg-green-50',
                    'text-blue-600 bg-blue-50',
                    'text-purple-600 bg-purple-50',
                    'text-orange-600 bg-orange-50',
                  ];
                  const icons = [FiAward, FiUsers, FiBriefcase, HiOutlineLightBulb];
                  const IconComponent = icons[idx % icons.length];
                  const colorClass = colors[idx % colors.length];
                  return (
                    <div key={idx} className={`flex items-center gap-2 p-3 rounded-xl ${colorClass.split(' ')[1]}`}>
                      <IconComponent className={colorClass.split(' ')[0]} size={20} />
                      <span className="text-sm font-medium text-gray-700">{highlight}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Eligibility Section */}
            <section id="eligibility" className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiCheckCircle className="text-green-600" size={20} />
                </span>
                Eligibility Criteria
              </h2>
              <div className="space-y-4">
                {[
                  { title: 'Educational Qualification', desc: eligibility },
                  { title: 'Entrance Exam', desc: course.entrance_exams?.join(', ') || '' },
                  { title: 'Age Limit', desc: ageLimit },
                ].map((item, idx) => (
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
              </div>
            </section>

            {/* Syllabus Section */}
            <section id="syllabus" className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <HiOutlineDocumentText className="text-purple-600" size={20} />
                </span>
                Course Syllabus
              </h2>
              <div className="space-y-4">
                {syllabusData.map((sem, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-900 flex items-center justify-between">
                      <span>{sem.semester}</span>
                      <span className="text-sm text-gray-500">{sem.subjects.length} Subjects</span>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-2">
                      {sem.subjects.map((subject, sidx) => (
                        <div key={sidx} className="flex items-center gap-2 text-sm text-gray-700">
                          <FiCheckCircle className="text-green-500" size={14} />
                          {subject}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Colleges Section - Only show if data exists */}
            {topColleges.length > 0 && (
              <section id="colleges" className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <HiOutlineOfficeBuilding className="text-indigo-600" size={20} />
                  </span>
                  Top Colleges for {courseName}
                </h2>
                <div className="space-y-4">
                  {topColleges.map((college, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {college.rank}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 hover:text-orange-600">{college.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><FiMapPin size={12} /> {college.location}</span>
                          {college.rating > 0 && <span className="flex items-center gap-1"><FiStar size={12} className="text-yellow-500" /> {college.rating}</span>}
                          {college.fees && <span>{college.fees}</span>}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors">
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
                <Link to="/colleges" className="mt-6 inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700">
                  View All Colleges <FiChevronRight />
                </Link>
              </section>
            )}

            {/* Career Section - Only show if data exists */}
            {careerOptions.length > 0 && (
              <section id="career" className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <FiBriefcase className="text-amber-600" size={20} />
                  </span>
                  Career Options & Salary
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {careerOptions.slice(0, 4).map((career, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">{typeof career === 'string' ? career : career.title}</h4>
                      {typeof career !== 'string' && career.salary && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-green-600 font-medium">{career.salary}</span>
                          {career.growth && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">{career.growth}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs Section - Only show if data exists */}
            {faqs.length > 0 && (
              <section id="faqs" className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <HiOutlineLightBulb className="text-teal-600" size={20} />
                  </span>
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.q}</span>
                        {expandedFaq === idx ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
                      </button>
                    {expandedFaq === idx && (
                      <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
            )}

            {/* Reviews Section */}
            <section id="reviews" className="mt-8">
              <ReviewsSection 
                entityId={course?.id || slug} 
                entityType="course" 
                entityName={courseName}
              />
            </section>

            {/* Questions & Answers */}
            <section id="questions" className="mt-8">
              <QuestionsSection 
                entityId={course?.id || slug} 
                entityType="course" 
                entityName={courseName}
              />
            </section>

            {/* Comments & Discussion */}
            <section id="comments" className="mt-8">
              <CommentsSection 
                entityId={course?.id || slug} 
                entityType="course" 
                entityName={courseName}
              />
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => setActiveWidget('apply')} className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                  <FiSend size={18} /> Apply Now
                </button>
                <button onClick={() => setActiveWidget('question')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                  <FiMessageCircle size={18} /> Ask Question
                </button>
                <button onClick={() => setActiveWidget('counselling')} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                  <FiPhone size={18} /> Free Counselling
                </button>
              </div>

              {/* Compare & Share */}
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-3">
                <button className="py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                  <FiLayers size={16} /> Compare
                </button>
                <button className="py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                  <FiShare2 size={16} /> Share
                </button>
              </div>
            </div>

            {/* Sponsored Colleges for this Course */}
            <SidebarSponsoredAd 
              placementId="course_detail_sidebar" 
              title="Top Colleges for this Course"
            />

            {/* Related Courses - Dynamic */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Related Courses</h3>
              <div className="space-y-3">
                {relatedCourses.slice(0, 5).map((relCourse, idx) => {
                  const courseName = typeof relCourse === 'string' ? relCourse : relCourse.name;
                  const courseSlug = typeof relCourse === 'string' 
                    ? relCourse.toLowerCase().replace(/\s+/g, '-').replace('.', '')
                    : relCourse.slug || relCourse.name.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link 
                      key={idx} 
                      to={`/courses/${courseSlug}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <HiOutlineAcademicCap className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{courseName}</h4>
                        <p className="text-xs text-gray-500">View Details</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
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
    </div>
  );
};

export default CourseDetailPage;
