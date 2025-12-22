import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { CollegeProvider } from './contexts/CollegeContext';
import { YearProvider } from './hooks/useYear';
import LayoutWrapper from './components/LayoutWrapper';
import ScrollToTop from './components/ScrollToTop';
import SimpleAutoPopup from './components/SimpleAutoPopup';

// Critical pages - loaded immediately
import HomePage from './pages/HomePage';
import CollegeDetailPage from './pages/CollegeDetailPage';

// Lazy loaded pages for better initial load performance
const CollegeSubPage = lazy(() => import('./pages/CollegeSubPage'));
const SchoolsPage = lazy(() => import('./pages/SchoolsPage'));
const UniversitiesPage = lazy(() => import('./pages/UniversitiesPage'));
const ExamsPage = lazy(() => import('./pages/ExamsPage'));
const ExamPage = lazy(() => import('./pages/ExamPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const WriteReviewPage = lazy(() => import('./pages/WriteReviewPage'));
const ExamDetailPage = lazy(() => import('./pages/ExamDetailPage'));
const ExamSubPages = lazy(() => import('./pages/ExamSubPages'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CoursesAfter10thPage = lazy(() => import('./pages/CoursesAfter10thPage'));
const CoursesAfter12thPage = lazy(() => import('./pages/CoursesAfter12thPage'));
const DiplomaCoursesPage = lazy(() => import('./pages/DiplomaCoursesPage'));
const DynamicCourseListingPage = lazy(() => import('./pages/DynamicCourseListingPage'));
const CourseListingPage = lazy(() => import('./pages/CourseListingPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const CourseFinderPage = lazy(() => import('./pages/CourseFinderPage'));
const StudentDashboard = lazy(() => import('./pages/EnhancedStudentDashboardV2'));
const GlobalSearchPage = lazy(() => import('./pages/GlobalSearchPage'));
const EligibilityChecker = lazy(() => import('./pages/EligibilityChecker'));
const StudyAbroadPage = lazy(() => import('./pages/StudyAbroadPage'));
const ScholarshipsPage = lazy(() => import('./pages/EnhancedScholarshipsPage'));
const EducationLoansPage = lazy(() => import('./pages/EducationLoansPage'));
const StudyMaterialsPage = lazy(() => import('./pages/StudyMaterialsPage'));
const CounselingPage = lazy(() => import('./pages/CounselingPage'));
const PremiumPage = lazy(() => import('./pages/PremiumPage'));
const PremiumSuccess = lazy(() => import('./pages/PremiumSuccess'));
const InstitutionDashboard = lazy(() => import('./pages/InstitutionDashboard'));
const CompareCollegesPage = lazy(() => import('./pages/CompareCollegesPage'));
// New User & Institute Dashboards
const UserSignup = lazy(() => import('./pages/UserSignup'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const InstituteLogin = lazy(() => import('./pages/InstituteLogin'));
const InstituteDashboardNew = lazy(() => import('./pages/InstituteDashboard'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const CollegeAdmissionPage = lazy(() => import('./pages/CollegeAdmissionPage'));
const SchoolAdmissionPage = lazy(() => import('./pages/SchoolAdmissionPage'));
const UniversityAdmissionPage = lazy(() => import('./pages/UniversityAdmissionPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
// New SEO-friendly URL pages
const DynamicListingPage = lazy(() => import('./pages/DynamicListingPage'));
const InstitutionDetailPage = lazy(() => import('./pages/InstitutionDetailPage'));
const InstitutionRouter = lazy(() => import('./pages/InstitutionRouter'));
import LegacyCollegeRedirect from './components/LegacyCollegeRedirect';

// Admin pages - all lazy loaded
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const TeamManagement = lazy(() => import('./pages/admin/TeamManagement'));
const PendingApprovals = lazy(() => import('./pages/admin/PendingApprovals'));
const AddCollege = lazy(() => import('./pages/admin/AddCollege'));
const CollegeForm = lazy(() => import('./pages/admin/CollegeForm'));
const UniversityForm = lazy(() => import('./pages/admin/UniversityForm'));
const SchoolForm = lazy(() => import('./pages/admin/SchoolForm'));
const CollegesListManagement = lazy(() => import('./pages/admin/CollegesListManagement'));
const NewsManagement = lazy(() => import('./pages/admin/NewsManagement'));
const NewsForm = lazy(() => import('./pages/admin/NewsForm'));
const ReviewsModeration = lazy(() => import('./pages/admin/ReviewsModeration'));
const QuestionsModeration = lazy(() => import('./pages/admin/QuestionsModeration'));
const CommentsModeration = lazy(() => import('./pages/admin/CommentsModeration'));
const StreamsManagement = lazy(() => import('./pages/admin/StreamsManagement'));
const SubStreamsManagement = lazy(() => import('./pages/admin/SubStreamsManagement'));
const BoardsManagement = lazy(() => import('./pages/admin/BoardsManagement'));
const CollegeTypesManagement = lazy(() => import('./pages/admin/CollegeTypesManagement'));
const AffiliationsManagement = lazy(() => import('./pages/admin/AffiliationsManagement'));
const RecognitionsManagement = lazy(() => import('./pages/admin/RecognitionsManagement'));
const AccreditationsManagement = lazy(() => import('./pages/admin/AccreditationsManagement'));
const AccreditationLevelsManagement = lazy(() => import('./pages/admin/AccreditationLevelsManagement'));
const RankingsManagement = lazy(() => import('./pages/admin/RankingsManagement'));
const RankCategoriesManagement = lazy(() => import('./pages/admin/RankCategoriesManagement'));
const ScholarshipsManagement = lazy(() => import('./pages/admin/ScholarshipsManagement'));
const LoansManagement = lazy(() => import('./pages/admin/LoansManagement'));
const CommentsManagement = lazy(() => import('./pages/admin/CommentsManagement'));
const TagCoursesColleges = lazy(() => import('./pages/admin/TagCoursesColleges'));
const TagExamsCourses = lazy(() => import('./pages/admin/TagExamsCourses'));
const NewsletterManagement = lazy(() => import('./pages/admin/NewsletterManagement'));
const EmailSettings = lazy(() => import('./pages/admin/EmailSettings'));
const FooterSettings = lazy(() => import('./pages/admin/FooterSettings'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
const BlogsManagement = lazy(() => import('./pages/admin/BlogsManagement'));
const BlogForm = lazy(() => import('./pages/admin/BlogForm'));
const BannersManagement = lazy(() => import('./pages/admin/BannersManagement'));
const TestimonialsManagement = lazy(() => import('./pages/admin/TestimonialsManagement'));
const FAQsManagement = lazy(() => import('./pages/admin/FAQsManagement'));
const CitiesManagement = lazy(() => import('./pages/admin/CitiesManagement'));
const StatesManagement = lazy(() => import('./pages/admin/StatesManagement'));
const ContactInquiriesManagement = lazy(() => import('./pages/admin/ContactInquiriesManagement'));
const CoursesManagement = lazy(() => import('./pages/admin/CoursesManagement'));
const ExamsManagement = lazy(() => import('./pages/admin/ExamsManagement'));
const AdvertisementsManagement = lazy(() => import('./pages/admin/AdvertisementsManagement'));
const AdvertisementReports = lazy(() => import('./pages/admin/AdvertisementReports'));
const CourseDetailForm = lazy(() => import('./pages/admin/CourseDetailForm'));
const CoursesDetailManagement = lazy(() => import('./pages/admin/CoursesDetailManagement'));
const ExamDetailForm = lazy(() => import('./pages/admin/ExamDetailForm'));
const ExamsDetailManagement = lazy(() => import('./pages/admin/ExamsDetailManagement'));
const LoansListingSettings = lazy(() => import('./pages/admin/LoansListingSettings'));
const ScholarshipsListingSettings = lazy(() => import('./pages/admin/ScholarshipsListingSettings'));
const StudyMaterialsListingSettings = lazy(() => import('./pages/admin/StudyMaterialsListingSettings'));
const StudyMaterialsManagement = lazy(() => import('./pages/admin/StudyMaterialsManagement'));
const ScholarshipForm = lazy(() => import('./pages/admin/ScholarshipForm'));
const LoanForm = lazy(() => import('./pages/admin/LoanForm'));
const ExamListingSettings = lazy(() => import('./pages/admin/ExamListingSettings'));
const CourseListingSettings = lazy(() => import('./pages/admin/CourseListingSettings'));
const NewsListingSettings = lazy(() => import('./pages/admin/NewsListingSettings'));
const BlogListingSettings = lazy(() => import('./pages/admin/BlogListingSettings'));
const CoursePagesManagement = lazy(() => import('./pages/admin/CoursePagesManagement'));
const CoursePageForm = lazy(() => import('./pages/admin/CoursePageForm'));
const ListingPagesManagement = lazy(() => import('./pages/admin/ListingPagesManagement'));
const StaticPagesManagement = lazy(() => import('./pages/admin/StaticPagesManagement'));
const StaticPageForm = lazy(() => import('./pages/admin/StaticPageForm'));
const StudyAbroadManagement = lazy(() => import('./pages/admin/StudyAbroadManagement'));
const StudyAbroadForm = lazy(() => import('./pages/admin/StudyAbroadForm'));
const StudyAbroadListingSettings = lazy(() => import('./pages/admin/StudyAbroadListingSettings'));
const HomepageSettings = lazy(() => import('./pages/admin/HomepageSettings'));
const WriteReviewSettings = lazy(() => import('./pages/admin/WriteReviewSettings'));
const YearSettings = lazy(() => import('./pages/admin/YearSettings'));
const SEOSettings = lazy(() => import('./pages/admin/SEOSettings'));
const ListingPageForm = lazy(() => import('./pages/admin/ListingPageForm'));
const SponsoredAdsManagement = lazy(() => import('./pages/admin/SponsoredAdsManagement'));
const AdvertisementManagement = lazy(() => import('./pages/admin/AdvertisementManagement'));
const LeadsList = lazy(() => import('./pages/admin/LeadsList'));
const LeadSettings = lazy(() => import('./pages/admin/LeadSettings'));
const AdmissionBookingsManagement = lazy(() => import('./pages/admin/AdmissionBookingsManagement'));
const AdmissionPartnersList = lazy(() => import('./pages/admin/AdmissionPartnersList'));
const RewardsDashboard = lazy(() => import('./pages/admin/RewardsDashboard'));
const PendingReviews = lazy(() => import('./pages/admin/PendingReviews'));
const PendingAnswers = lazy(() => import('./pages/admin/PendingAnswers'));
const RedemptionManagement = lazy(() => import('./pages/admin/RedemptionManagement'));
const PaymentHistory = lazy(() => import('./pages/admin/PaymentHistory'));
const UsersPointsReport = lazy(() => import('./pages/admin/UsersPointsReport'));
const CounselorsManagement = lazy(() => import('./pages/admin/CounselorsManagement'));
const AuthPagesManagement = lazy(() => import('./pages/admin/AuthPagesManagement'));
const LeadFormsManagement = lazy(() => import('./pages/admin/LeadFormsManagement'));
const CounsellingRequestsManagement = lazy(() => import('./pages/admin/CounsellingRequestsManagement'));
const AdvancedContentForm = lazy(() => import('./pages/admin/AdvancedContentForm'));
const AdvancedContentManagement = lazy(() => import('./pages/admin/AdvancedContentManagement'));
import FloatingApplyButton from './components/FloatingApplyButton';
// Admission Partner Pages
const AdmissionPartnersPage = lazy(() => import('./pages/AdmissionPartnersPage'));
// Review Link Page
const ReviewLinkPage = lazy(() => import('./pages/ReviewLinkPage'));
const UniversityDetailPage = lazy(() => import('./pages/UniversityDetailPage'));
import './App.css';

// Loading spinner component for lazy loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CollegeProvider>
          <YearProvider>
          <BrowserRouter>
            <ScrollToTop />
            <SimpleAutoPopup />
          <Suspense fallback={<PageLoader />}>
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
            <Route path="/admin/universities/new" element={<UniversityForm />} />
            <Route path="/admin/universities/edit/:id" element={<UniversityForm />} />
            <Route path="/admin/schools" element={<CollegesListManagement type="schools" />} />
            <Route path="/admin/schools/add" element={<SchoolForm />} />
            <Route path="/admin/schools/new" element={<SchoolForm />} />
            <Route path="/admin/schools/edit/:id" element={<SchoolForm />} />
            <Route path="/admin/news" element={<NewsManagement />} />
            <Route path="/admin/news/new" element={<NewsForm />} />
            <Route path="/admin/news/edit/:id" element={<NewsForm />} />
            <Route path="/admin/newsletter" element={<NewsletterManagement />} />
            <Route path="/admin/email-settings" element={<EmailSettings />} />
            <Route path="/admin/footer-settings" element={<FooterSettings />} />
            <Route path="/admin/reviews" element={<ReviewsModeration />} />
            <Route path="/admin/questions" element={<QuestionsModeration />} />
            <Route path="/admin/comments" element={<CommentsModeration />} />
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
            <Route path="/admin/states" element={<StatesManagement />} />
            <Route path="/admin/cities" element={<CitiesManagement />} />
            <Route path="/admin/contact-inquiries" element={<ContactInquiriesManagement />} />
            <Route path="/admin/lead-forms" element={<LeadFormsManagement />} />
            <Route path="/admin/counseling-sessions" element={<CounsellingRequestsManagement />} />
            <Route path="/admin/listing-pages" element={<ListingPagesManagement />} />
            <Route path="/admin/listing-pages/new" element={<ListingPageForm />} />
            <Route path="/admin/listing-pages/edit/:id" element={<ListingPageForm />} />
            <Route path="/admin/homepage-settings" element={<HomepageSettings />} />
            <Route path="/admin/write-review-settings" element={<WriteReviewSettings />} />
            <Route path="/admin/year-settings" element={<YearSettings />} />
            <Route path="/admin/seo-settings" element={<SEOSettings />} />
            <Route path="/admin/static-pages" element={<StaticPagesManagement />} />
            <Route path="/admin/static-pages/edit/:slug" element={<StaticPageForm />} />
            <Route path="/admin/advanced-content" element={<AdvancedContentManagement />} />
            <Route path="/admin/advanced-content/new" element={<AdvancedContentForm />} />
            <Route path="/admin/advanced-content/edit/:id" element={<AdvancedContentForm />} />
            <Route path="/admin/study-abroad" element={<StudyAbroadManagement />} />
            <Route path="/admin/study-abroad/new" element={<StudyAbroadForm />} />
            <Route path="/admin/study-abroad/edit/:id" element={<StudyAbroadForm />} />
            <Route path="/admin/study-abroad-listing-settings" element={<StudyAbroadListingSettings />} />
            <Route path="/admin/sponsored-ads" element={<SponsoredAdsManagement />} />
            <Route path="/admin/leads" element={<LeadsList />} />
            <Route path="/admin/lead-settings" element={<LeadSettings />} />
            <Route path="/admin/admission-bookings" element={<AdmissionBookingsManagement />} />
            <Route path="/admin/admission-partners/:type" element={<AdmissionPartnersList />} />
            
            {/* Rewards & Payments Routes */}
            <Route path="/admin/rewards" element={<RewardsDashboard />} />
            <Route path="/admin/rewards/pending-reviews" element={<PendingReviews />} />
            <Route path="/admin/rewards/pending-answers" element={<PendingAnswers />} />
            <Route path="/admin/rewards/redemptions" element={<RedemptionManagement />} />
            <Route path="/admin/counselors" element={<CounselorsManagement />} />
            <Route path="/admin/auth-pages" element={<AuthPagesManagement />} />
            <Route path="/admin/rewards/payments" element={<PaymentHistory />} />
            <Route path="/admin/rewards/users-report" element={<UsersPointsReport />} />

            {/* Public Routes - With Layout */}
            <Route element={<LayoutWrapper />}>
              <Route path="/" element={<HomePage />} />
              
              {/* ============================================ */}
              {/* SPECIFIC ROUTES - Must come BEFORE dynamic routes */}
              {/* ============================================ */}
              
              {/* Institution Listing Pages - handled by new dynamic routes */}
              {/* Sub-pages (sections) are handled by checking if first segment has numeric prefix */}
                  
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
                  
              {/* User & Dashboard - Old dashboard moved to /old-dashboard */}
              <Route path="/old-dashboard" element={<StudentDashboard />} />
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
              {/* New User Dashboard Routes */}
              {/* ============================================ */}
              <Route path="/signup" element={<UserSignup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              
              {/* Review Link Page (Public) */}
              <Route path="/review/:linkCode" element={<ReviewLinkPage />} />
                  
              {/* ============================================ */}
              {/* Institute Dashboard Routes */}
              {/* ============================================ */}
              <Route path="/institute/login" element={<InstituteLogin />} />
              <Route path="/institute/dashboard" element={<InstituteDashboardNew />} />
                  
              {/* ============================================ */}
              {/* SEO-FRIENDLY DYNAMIC ROUTES - Must come LAST */}
              {/* These are catch-all routes that match patterns */}
              {/* ============================================ */}
                  
              {/* NEW URL STRUCTURE - Institution Listings */}
              {/* /university, /colleges, /schools base routes */}
              <Route path="/university" element={<DynamicListingPage />} />
              <Route path="/university/:seg1" element={<InstitutionRouter />} />
              <Route path="/university/:seg1/:seg2" element={<InstitutionRouter />} />
              <Route path="/university/:seg1/:seg2/:seg3" element={<DynamicListingPage />} />
              <Route path="/university/:seg1/:seg2/:seg3/:seg4" element={<DynamicListingPage />} />
              
              <Route path="/colleges" element={<DynamicListingPage />} />
              <Route path="/colleges/:seg1" element={<InstitutionRouter />} />
              <Route path="/colleges/:seg1/:seg2" element={<InstitutionRouter />} />
              <Route path="/colleges/:seg1/:seg2/:seg3" element={<DynamicListingPage />} />
              <Route path="/colleges/:seg1/:seg2/:seg3/:seg4" element={<DynamicListingPage />} />
              
              <Route path="/schools" element={<DynamicListingPage />} />
              <Route path="/schools/:seg1" element={<InstitutionRouter />} />
              <Route path="/schools/:seg1/:seg2" element={<InstitutionRouter />} />
              <Route path="/schools/:seg1/:seg2/:seg3" element={<DynamicListingPage />} />
              <Route path="/schools/:seg1/:seg2/:seg3/:seg4" element={<DynamicListingPage />} />
              
              <Route path="/universities" element={<DynamicListingPage />} />
              <Route path="/university/:seg1" element={<InstitutionRouter />} />
              <Route path="/university/:seg1/:seg2" element={<InstitutionRouter />} />
              
              {/* Legacy routes with stream - handled by DynamicListingPage */}
              <Route path="/colleges/:stream" element={<DynamicListingPage />} />
              <Route path="/schools/:stream" element={<DynamicListingPage />} />
              <Route path="/university/:stream" element={<DynamicListingPage />} />
                  
              {/* Stream-based Listings (3 segments) - e.g., /btech/computer-science/west-bengal */}
              <Route path="/:stream/:subStream/:location" element={<DynamicListingPage />} />
                  
              {/* Stream-based Listings (2 segments) - e.g., /btech/computer-science or /btech/west-bengal */}
              <Route path="/:stream/:subStreamOrLocation" element={<DynamicListingPage />} />
                  
              {/* Single segment dynamic routes - e.g., /delhi-colleges, /btech, /engineering */}
              <Route path="/:locationOrStream" element={<DynamicListingPage />} />
            </Route>
          </Routes>
          </Suspense>
          <FloatingApplyButton />
          </BrowserRouter>
          </YearProvider>
        </CollegeProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
