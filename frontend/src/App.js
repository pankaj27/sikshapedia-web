import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CollegeListingPage from './pages/CollegeListingPage';
import CollegeDetailPage from './pages/CollegeDetailPage';
import SchoolsPage from './pages/SchoolsPage';
import UniversitiesPage from './pages/UniversitiesPage';
import ExamsPage from './pages/ExamsPage';
import ExamPage from './pages/ExamPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
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
import AddCollege from './pages/admin/AddCollege';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/colleges" element={<CollegeListingPage />} />
            <Route path="/colleges/:id" element={<CollegeDetailPage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/universities" element={<UniversitiesPage />} />
            <Route path="/exams" element={<ExamPage />} />
            <Route path="/exams-old" element={<ExamsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/colleges/add" element={<AddCollege />} />
          </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
