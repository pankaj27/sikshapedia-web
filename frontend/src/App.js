import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
// DEPRECATED: CollegeListingPage - now redirects to DynamicListingPage
// import CollegeListingPage from './pages/CollegeListingPage';
import CollegeDetailPage from './pages/CollegeDetailPage';
import CollegeSubPage from './pages/CollegeSubPage';
import SchoolsPage from './pages/SchoolsPage';
import UniversitiesPage from './pages/UniversitiesPage';
import ExamsPage from './pages/ExamsPage';
import ExamPage from './pages/ExamPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import WriteReviewPage from './pages/WriteReviewPage';
import ExamDetailPage from './pages/ExamDetailPage';
import ExamSubPages from './pages/ExamSubPages';
import CoursesPage from './pages/CoursesPage';
import CoursesAfter10thPage from './pages/CoursesAfter10thPage';
import CoursesAfter12thPage from './pages/CoursesAfter12thPage';
import DiplomaCoursesPage from './pages/DiplomaCoursesPage';
import DynamicCourseListingPage from './pages/DynamicCourseListingPage';
import CourseListingPage from './pages/CourseListingPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseFinderPage from './pages/CourseFinderPage';
import StudentDashboard from './pages/EnhancedStudentDashboardV2';
import GlobalSearchPage from './pages/GlobalSearchPage';
import EligibilityChecker from './pages/EligibilityChecker';
import StudyAbroadPage from './pages/StudyAbroadPage';
import ScholarshipsPage from './pages/EnhancedScholarshipsPage';
import EducationLoansPage from './pages/EducationLoansPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import CounselingPage from './pages/CounselingPage';
import PremiumPage from './pages/PremiumPage';
import PremiumSuccess from './pages/PremiumSuccess';
import InstitutionDashboard from './pages/InstitutionDashboard';
import CompareCollegesPage from './pages/CompareCollegesPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CollegeAdmissionPage from './pages/CollegeAdmissionPage';
import SchoolAdmissionPage from './pages/SchoolAdmissionPage';
import UniversityAdmissionPage from './pages/UniversityAdmissionPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
// New SEO-friendly URL pages
import DynamicListingPage from './pages/DynamicListingPage';
import InstitutionDetailPage from './pages/InstitutionDetailPage';
import LegacyCollegeRedirect from './components/LegacyCollegeRedirect';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProfile from './pages/admin/AdminProfile';
import TeamManagement from './pages/admin/TeamManagement';
import PendingApprovals from './pages/admin/PendingApprovals';
import AddCollege from './pages/admin/AddCollege';
import CollegeForm from './pages/admin/CollegeForm';
import CollegesListManagement from './pages/admin/CollegesListManagement';
import NewsManagement from './pages/admin/NewsManagement';
import NewsForm from './pages/admin/NewsForm';
import ReviewsModeration from './pages/admin/ReviewsModeration';
import StreamsManagement from './pages/admin/StreamsManagement';
import SubStreamsManagement from './pages/admin/SubStreamsManagement';
import BoardsManagement from './pages/admin/BoardsManagement';
import CollegeTypesManagement from './pages/admin/CollegeTypesManagement';
import AffiliationsManagement from './pages/admin/AffiliationsManagement';
import RecognitionsManagement from './pages/admin/RecognitionsManagement';
import AccreditationsManagement from './pages/admin/AccreditationsManagement';
import AccreditationLevelsManagement from './pages/admin/AccreditationLevelsManagement';
import RankingsManagement from './pages/admin/RankingsManagement';
import RankCategoriesManagement from './pages/admin/RankCategoriesManagement';
import ScholarshipsManagement from './pages/admin/ScholarshipsManagement';
import LoansManagement from './pages/admin/LoansManagement';
import CommentsManagement from './pages/admin/CommentsManagement';
import TagCoursesColleges from './pages/admin/TagCoursesColleges';
import TagExamsCourses from './pages/admin/TagExamsCourses';
import UsersManagement from './pages/admin/UsersManagement';
import BlogsManagement from './pages/admin/BlogsManagement';
import BlogForm from './pages/admin/BlogForm';
import BannersManagement from './pages/admin/BannersManagement';
import TestimonialsManagement from './pages/admin/TestimonialsManagement';
import FAQsManagement from './pages/admin/FAQsManagement';
import CitiesManagement from './pages/admin/CitiesManagement';
import ContactInquiriesManagement from './pages/admin/ContactInquiriesManagement';
import CoursesManagement from './pages/admin/CoursesManagement';
import ExamsManagement from './pages/admin/ExamsManagement';
import AdvertisementsManagement from './pages/admin/AdvertisementsManagement';
import AdvertisementReports from './pages/admin/AdvertisementReports';
import CourseDetailForm from './pages/admin/CourseDetailForm';
import CoursesDetailManagement from './pages/admin/CoursesDetailManagement';
import ExamDetailForm from './pages/admin/ExamDetailForm';
import ExamsDetailManagement from './pages/admin/ExamsDetailManagement';
import LoansListingSettings from './pages/admin/LoansListingSettings';
import ScholarshipsListingSettings from './pages/admin/ScholarshipsListingSettings';
import StudyMaterialsListingSettings from './pages/admin/StudyMaterialsListingSettings';
import StudyMaterialsManagement from './pages/admin/StudyMaterialsManagement';
import ScholarshipForm from './pages/admin/ScholarshipForm';
import LoanForm from './pages/admin/LoanForm';
import ExamListingSettings from './pages/admin/ExamListingSettings';
import CourseListingSettings from './pages/admin/CourseListingSettings';
import NewsListingSettings from './pages/admin/NewsListingSettings';
import BlogListingSettings from './pages/admin/BlogListingSettings';
import CoursePagesManagement from './pages/admin/CoursePagesManagement';
import CoursePageForm from './pages/admin/CoursePageForm';
import ListingPagesManagement from './pages/admin/ListingPagesManagement';
import StaticPagesManagement from './pages/admin/StaticPagesManagement';
import StaticPageForm from './pages/admin/StaticPageForm';
import StudyAbroadManagement from './pages/admin/StudyAbroadManagement';
import StudyAbroadForm from './pages/admin/StudyAbroadForm';
import StudyAbroadListingSettings from './pages/admin/StudyAbroadListingSettings';
import HomepageSettings from './pages/admin/HomepageSettings';
import ListingPageForm from './pages/admin/ListingPageForm';
import SponsoredAdsManagement from './pages/admin/SponsoredAdsManagement';
import AdvertisementManagement from './pages/admin/AdvertisementManagement';
import LeadsList from './pages/admin/LeadsList';
import LeadSettings from './pages/admin/LeadSettings';
import FloatingApplyButton from './components/FloatingApplyButton';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Routes - Without Layout */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/team" element={<TeamManagement />} />
            <Route path="/admin/pending-approvals" element={<PendingApprovals />} />
            <Route path="/admin/colleges" element={<CollegesListManagement />} />
            <Route path="/admin/colleges/add" element={<CollegeForm />} />
            <Route path="/admin/colleges/new" element={<CollegeForm />} />
            <Route path="/admin/colleges/edit/:id" element={<CollegeForm />} />
            <Route path="/admin/news" element={<NewsManagement />} />
            <Route path="/admin/news/new" element={<NewsForm />} />
            <Route path="/admin/news/edit/:id" element={<NewsForm />} />
            <Route path="/admin/reviews" element={<ReviewsModeration />} />
            <Route path="/admin/streams" element={<StreamsManagement />} />
            <Route path="/admin/sub-streams" element={<SubStreamsManagement />} />
            <Route path="/admin/boards" element={<BoardsManagement />} />
            <Route path="/admin/college-types" element={<CollegeTypesManagement />} />
            <Route path="/admin/affiliations" element={<AffiliationsManagement />} />
            <Route path="/admin/recognitions" element={<RecognitionsManagement />} />
            <Route path="/admin/accreditations" element={<AccreditationsManagement />} />
            <Route path="/admin/accreditation-levels" element={<AccreditationLevelsManagement />} />
            <Route path="/admin/rankings" element={<RankingsManagement />} />
            <Route path="/admin/rank-categories" element={<RankCategoriesManagement />} />
            <Route path="/admin/scholarships" element={<ScholarshipsManagement />} />
            <Route path="/admin/scholarships-listing-settings" element={<ScholarshipsListingSettings />} />
            <Route path="/admin/loans" element={<LoansManagement />} />
            <Route path="/admin/loans-listing-settings" element={<LoansListingSettings />} />
            <Route path="/admin/study-materials" element={<StudyMaterialsManagement />} />
            <Route path="/admin/study-materials-listing-settings" element={<StudyMaterialsListingSettings />} />
            <Route path="/admin/scholarships/new" element={<ScholarshipForm />} />
            <Route path="/admin/scholarships/edit/:id" element={<ScholarshipForm />} />
            <Route path="/admin/loans/new" element={<LoanForm />} />
            <Route path="/admin/loans/edit/:id" element={<LoanForm />} />
            <Route path="/admin/courses" element={<CoursesManagement />} />
            <Route path="/admin/courses-detail" element={<CoursesDetailManagement />} />
            <Route path="/admin/courses-detail/new" element={<CourseDetailForm />} />
            <Route path="/admin/courses-detail/edit/:id" element={<CourseDetailForm />} />
            <Route path="/admin/exams" element={<ExamsManagement />} />
            <Route path="/admin/exams-detail" element={<ExamsDetailManagement />} />
            <Route path="/admin/exams-detail/new" element={<ExamDetailForm />} />
            <Route path="/admin/exams-detail/edit/:id" element={<ExamDetailForm />} />
            <Route path="/admin/exam-listing-settings" element={<ExamListingSettings />} />
            <Route path="/admin/course-listing-settings" element={<CourseListingSettings />} />
            <Route path="/admin/news-listing-settings" element={<NewsListingSettings />} />
            <Route path="/admin/blog-listing-settings" element={<BlogListingSettings />} />
            <Route path="/admin/course-pages" element={<CoursePagesManagement />} />
            <Route path="/admin/course-pages/edit/:id" element={<CoursePageForm />} />
            <Route path="/admin/advertisements" element={<AdvertisementsManagement />} />
            <Route path="/admin/advertisements/reports" element={<AdvertisementReports />} />
            <Route path="/admin/comments" element={<CommentsManagement />} />
            <Route path="/admin/tag-courses-colleges" element={<TagCoursesColleges />} />
            <Route path="/admin/tag-exams-courses" element={<TagExamsCourses />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/blogs" element={<BlogsManagement />} />
            <Route path="/admin/blogs/new" element={<BlogForm />} />
            <Route path="/admin/blogs/edit/:id" element={<BlogForm />} />
            <Route path="/admin/banners" element={<BannersManagement />} />
            <Route path="/admin/testimonials" element={<TestimonialsManagement />} />
            <Route path="/admin/faqs" element={<FAQsManagement />} />
            <Route path="/admin/cities" element={<CitiesManagement />} />
            <Route path="/admin/contact-inquiries" element={<ContactInquiriesManagement />} />
            <Route path="/admin/listing-pages" element={<ListingPagesManagement />} />
            <Route path="/admin/listing-pages/new" element={<ListingPageForm />} />
            <Route path="/admin/listing-pages/edit/:id" element={<ListingPageForm />} />
            <Route path="/admin/homepage-settings" element={<HomepageSettings />} />
            <Route path="/admin/static-pages" element={<StaticPagesManagement />} />
            <Route path="/admin/static-pages/edit/:slug" element={<StaticPageForm />} />
            <Route path="/admin/study-abroad" element={<StudyAbroadManagement />} />
            <Route path="/admin/study-abroad/new" element={<StudyAbroadForm />} />
            <Route path="/admin/study-abroad/edit/:id" element={<StudyAbroadForm />} />
            <Route path="/admin/study-abroad-listing-settings" element={<StudyAbroadListingSettings />} />
            <Route path="/admin/sponsored-ads" element={<SponsoredAdsManagement />} />
            <Route path="/admin/leads" element={<LeadsList />} />
            <Route path="/admin/lead-settings" element={<LeadSettings />} />

            {/* Public Routes - With Layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  
                  {/* ============================================ */}
                  {/* SPECIFIC ROUTES - Must come BEFORE dynamic routes */}
                  {/* ============================================ */}
                  
                  {/* Institution Listing Pages */}
                  {/* DEPRECATED: Old /colleges route now redirects to /india-colleges */}
                  <Route path="/colleges" element={<Navigate to="/india-colleges" replace />} />
                  <Route path="/schools" element={<SchoolsPage />} />
                  <Route path="/universities" element={<UniversitiesPage />} />
                  
                  {/* Institution Detail Pages: /colleges/{number}-{slug} */}
                  <Route path="/colleges/:idSlug/:section" element={<CollegeSubPage />} />
                  <Route path="/colleges/:idSlug" element={<InstitutionDetailPage />} />
                  <Route path="/universities/:idSlug/:section" element={<CollegeSubPage />} />
                  <Route path="/universities/:idSlug" element={<InstitutionDetailPage />} />
                  <Route path="/schools/:idSlug/:section" element={<CollegeSubPage />} />
                  <Route path="/schools/:idSlug" element={<InstitutionDetailPage />} />
                  
                  {/* Exams */}
                  <Route path="/exams" element={<ExamPage />} />
                  <Route path="/exams-old" element={<ExamsPage />} />
                  <Route path="/exams/:id/:section" element={<ExamSubPages />} />
                  <Route path="/exams/:id" element={<ExamDetailPage />} />
                  
                  {/* News */}
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/news/:id" element={<NewsDetailPage />} />
                  
                  {/* Courses */}
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/after-10th" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/after-12th" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/diploma" element={<DynamicCourseListingPage />} />
                  {/* Dynamic course listing pages */}
                  <Route path="/courses/pg" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/phd" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/certificate" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/engineering" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/medical" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/management" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/science" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/commerce" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/arts" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/computer" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/law" element={<DynamicCourseListingPage />} />
                  <Route path="/courses/education" element={<DynamicCourseListingPage />} />
                  <Route path="/course-finder" element={<CourseFinderPage />} />
                  <Route path="/courses/listing/:category" element={<CourseListingPage />} />
                  <Route path="/courses/:stream/:subStream" element={<CourseListingPage />} />
                  <Route path="/courses/:slug" element={<CourseDetailPage />} />
                  
                  {/* User & Dashboard */}
                  <Route path="/dashboard" element={<StudentDashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/search" element={<GlobalSearchPage />} />
                  <Route path="/write-review" element={<WriteReviewPage />} />
                  
                  {/* Tools & Services */}
                  <Route path="/eligibility-checker" element={<EligibilityChecker />} />
                  <Route path="/study-abroad" element={<StudyAbroadPage />} />
                  <Route path="/scholarships" element={<ScholarshipsPage />} />
                  <Route path="/loans" element={<EducationLoansPage />} />
                  <Route path="/study-materials" element={<StudyMaterialsPage />} />
                  <Route path="/counseling" element={<CounselingPage />} />
                  <Route path="/premium" element={<PremiumPage />} />
                  <Route path="/premium/success" element={<PremiumSuccess />} />
                  <Route path="/institution/dashboard" element={<InstitutionDashboard />} />
                  <Route path="/compare" element={<CompareCollegesPage />} />
                  
                  {/* Blog */}
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  
                  {/* Admissions */}
                  <Route path="/admission/colleges" element={<CollegeAdmissionPage />} />
                  <Route path="/admission/schools" element={<SchoolAdmissionPage />} />
                  <Route path="/admission/universities" element={<UniversityAdmissionPage />} />
                  
                  {/* Static Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* ============================================ */}
                  {/* SEO-FRIENDLY DYNAMIC ROUTES - Must come LAST */}
                  {/* These are catch-all routes that match patterns */}
                  {/* ============================================ */}
                  
                  {/* India-wide Institution Listings */}
                  <Route path="/india-colleges" element={<DynamicListingPage />} />
                  <Route path="/india-schools" element={<DynamicListingPage />} />
                  <Route path="/india-universities" element={<DynamicListingPage />} />
                  
                  {/* Stream-based Listings (3 segments) - e.g., /btech/computer-science/west-bengal */}
                  <Route path="/:stream/:subStream/:location" element={<DynamicListingPage />} />
                  
                  {/* Stream-based Listings (2 segments) - e.g., /btech/computer-science or /btech/west-bengal */}
                  <Route path="/:stream/:subStreamOrLocation" element={<DynamicListingPage />} />
                  
                  {/* Single segment dynamic routes - e.g., /delhi-colleges, /btech, /engineering */}
                  <Route path="/:locationOrStream" element={<DynamicListingPage />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
