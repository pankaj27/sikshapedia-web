import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CollegeListingPage from './pages/CollegeListingPage';
import CollegeDetailPage from './pages/CollegeDetailPage';
import ExamsPage from './pages/ExamsPage';
import ExamDetailPage from './pages/ExamDetailPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import StudentDashboard from './pages/EnhancedStudentDashboardV2';
import GlobalSearchPage from './pages/GlobalSearchPage';
import EligibilityChecker from './pages/EligibilityChecker';
import StudyAbroadPage from './pages/StudyAbroadPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import CompareCollegesPage from './pages/CompareCollegesPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
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
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/exams/:id" element={<ExamDetailPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/search" element={<GlobalSearchPage />} />
            <Route path="/eligibility-checker" element={<EligibilityChecker />} />
            <Route path="/study-abroad" element={<StudyAbroadPage />} />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route path="/compare" element={<CompareCollegesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
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
