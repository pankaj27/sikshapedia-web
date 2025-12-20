import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiFileText, FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';

import { Link } from './CustomLink';
const TopExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      // Use featured endpoint which prioritizes admin-selected exams
      const response = await api.get('/exams/featured?limit=6');
      setExams(response.data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const getExamColor = (index) => {
    const colors = [
      'bg-blue-50 border-blue-200',
      'bg-red-50 border-red-200',
      'bg-green-50 border-green-200',
      'bg-purple-50 border-purple-200',
      'bg-orange-50 border-orange-200',
      'bg-indigo-50 border-indigo-200'
    ];
    return colors[index % colors.length];
  };

  const formatApplicants = (count) => {
    if (!count) return 'N/A';
    if (count >= 100000) return `${(count / 100000).toFixed(1)} Lakh+`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K+`;
    return `${count}+`;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-100 rounded-xl p-6 h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (exams.length === 0) {
    return null; // Don't show section if no exams
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Top Exams in India</h2>
            <p className="text-lg text-gray-600">Find information about popular entrance exams</p>
          </div>
          <Link 
            to="/exams" 
            className="hidden md:flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            View All Exams <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, idx) => (
            <Link
              key={exam.id || idx}
              to={`/exams/${exam.slug || exam.id}`}
              className={`rounded-xl p-6 border-2 hover:shadow-lg transition-all duration-300 ${getExamColor(idx)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{exam.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{exam.full_name || exam.description?.substring(0, 50)}</p>
                </div>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700">
                  {exam.level || 'UG'}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <FiUsers className="text-gray-500" />
                  <span className="text-sm">
                    <strong>{formatApplicants(exam.total_applicants || exam.applicants)}</strong> Applicants
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FiCalendar className="text-gray-500" />
                  <span className="text-sm">
                    {exam.exam_date || exam.important_dates?.exam_date || 'Date TBA'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FiFileText className="text-gray-500" />
                  <span className="text-sm">
                    {exam.conducting_body || 'National Level'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link 
            to="/exams"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            View All Exams <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopExams;
