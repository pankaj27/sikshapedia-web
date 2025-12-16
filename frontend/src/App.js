import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CollegeListingPage from './pages/CollegeListingPage';
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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
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
            <Route path="/admin/loans" element={<LoansManagement />} />
            <Route path="/admin/courses" element={<CoursesManagement />} />
            <Route path="/admin/courses-detail" element={<CoursesDetailManagement />} />
            <Route path="/admin/courses-detail/new" element={<CourseDetailForm />} />
            <Route path="/admin/courses-detail/edit/:id" element={<CourseDetailForm />} />
            <Route path="/admin/exams" element={<ExamsManagement />} />
            <Route path="/admin/exams-detail" element={<ExamsDetailManagement />} />
            <Route path="/admin/exams-detail/new" element={<ExamDetailForm />} />
            <Route path="/admin/exams-detail/edit/:id" element={<ExamDetailForm />} />
            <Route path="/admin/advertisements" element={<AdvertisementsManagement />} />
            <Route path="/admin/advertisements/reports" element={<AdvertisementReports />} />
            <Route path="/admin/comments" element={<CommentsManagement />} />
            <Route path="/admin/tag-courses-colleges" element={<TagCoursesColleges />} />
            <Route path="/admin/tag-exams-courses" element={<TagExamsCourses />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/blogs" element={<BlogsManagement />} />
            <Route path="/admin/banners" element={<BannersManagement />} />
            <Route path="/admin/testimonials" element={<TestimonialsManagement />} />
            <Route path="/admin/faqs" element={<FAQsManagement />} />
            <Route path="/admin/cities" element={<CitiesManagement />} />
            <Route path="/admin/contact-inquiries" element={<ContactInquiriesManagement />} />

            {/* Public Routes - With Layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/colleges" element={<CollegeListingPage />} />
                  <Route path="/colleges/:id" element={<CollegeDetailPage />} />
                  <Route path="/colleges/:id/:section" element={<CollegeSubPage />} />
                  <Route path="/schools" element={<SchoolsPage />} />
                  <Route path="/universities" element={<UniversitiesPage />} />
                  <Route path="/exams" element={<ExamPage />} />
                  <Route path="/exams-old" element={<ExamsPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/news/:id" element={<NewsDetailPage />} />
                  <Route path="/write-review" element={<WriteReviewPage />} />
                  <Route path="/exams/:id" element={<ExamDetailPage />} />
                  <Route path="/exams/:id/:section" element={<ExamSubPages />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/course-finder" element={<CourseFinderPage />} />
                  <Route path="/courses/listing/:category" element={<CourseListingPage />} />
                  <Route path="/courses/detail/:id" element={<CourseDetailPage />} />
                  <Route path="/dashboard" element={<StudentDashboard />} />
                  <Route path="/search" element={<GlobalSearchPage />} />
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
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/admission/colleges" element={<CollegeAdmissionPage />} />
                  <Route path="/admission/schools" element={<SchoolAdmissionPage />} />
                  <Route path="/admission/universities" element={<UniversityAdmissionPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
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
