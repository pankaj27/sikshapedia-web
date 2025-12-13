import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiBook, FiBriefcase, FiDollarSign, FiClock, FiAward } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Course not found</p>
          <Link to="/courses">
            <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/courses" className="text-purple-100 hover:text-white">Courses</Link>
            <span>/</span>
            <span>{course.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{course.name}</h1>
          <p className="text-xl text-purple-100 mb-4">{course.full_name}</p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">{course.degree_type}</span>
            <span className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">{course.stream}</span>
            <span className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">{course.duration}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">About {course.name}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiClock className="text-purple-600" />
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                  <p className="text-xl font-bold">{course.duration}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiDollarSign className="text-green-600" />
                    <p className="text-sm text-gray-600">Average Fees</p>
                  </div>
                  <p className="text-xl font-bold">₹{(course.average_fees / 100000).toFixed(1)}L</p>
                </div>
                {course.average_salary && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiBriefcase className="text-blue-600" />
                      <p className="text-sm text-gray-600">Average Salary</p>
                    </div>
                    <p className="text-xl font-bold">₹{(course.average_salary / 100000).toFixed(1)}L</p>
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiBook className="text-orange-600" />
                    <p className="text-sm text-gray-600">Total Colleges</p>
                  </div>
                  <p className="text-xl font-bold">{course.total_colleges || 0}</p>
                </div>
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiAward className="text-orange-600" /> Eligibility Criteria
              </h2>
              <p className="text-gray-700">{course.eligibility}</p>
            </div>

            {/* Curriculum */}
            {course.subjects && course.subjects.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FiBook className="text-orange-600" /> Curriculum & Subjects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.subjects.map((subject, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specializations */}
            {course.specializations && course.specializations.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {course.specializations.map((spec, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Career Options */}
            {course.career_options && course.career_options.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FiBriefcase className="text-orange-600" /> Career Opportunities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.career_options.map((career, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Recruiters */}
            {course.top_recruiters && course.top_recruiters.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Top Recruiters</h2>
                <div className="flex flex-wrap gap-2">
                  {course.top_recruiters.map((recruiter, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
                      {recruiter}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-purple-100 text-sm">Degree Type</p>
                  <p className="text-lg font-bold">{course.degree_type}</p>
                </div>
                <div>
                  <p className="text-purple-100 text-sm">Stream</p>
                  <p className="text-lg font-bold">{course.stream}</p>
                </div>
                <div>
                  <p className="text-purple-100 text-sm">Duration</p>
                  <p className="text-lg font-bold">{course.duration}</p>
                </div>
                {course.difficulty_level && (
                  <div>
                    <p className="text-purple-100 text-sm">Difficulty Level</p>
                    <p className="text-lg font-bold">{course.difficulty_level}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Fees Range */}
            {course.fee_range && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Fee Range</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum:</span>
                    <span className="font-semibold">₹{(course.fee_range.min / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maximum:</span>
                    <span className="font-semibold">₹{(course.fee_range.max / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Average:</span>
                    <span className="font-bold text-purple-600">₹{(course.average_fees / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </div>
            )}

            {/* Entrance Exams */}
            {course.entrance_exams && course.entrance_exams.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Entrance Exams</h3>
                <div className="space-y-2">
                  {course.entrance_exams.map((examId, idx) => (
                    <Link
                      key={idx}
                      to={`/exams/${examId}`}
                      className="block px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
                    >
                      {examId.replace('exam_', '').toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <Link to="/colleges">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">Find Colleges Offering This Course</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;