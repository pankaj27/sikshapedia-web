import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCalendar, FiClock, FiFileText, FiAward, FiBook, FiDollarSign } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const ExamDetailPage = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamDetails();
  }, [id]);

  const fetchExamDetails = async () => {
    try {
      const response = await api.get(`/exams/${id}`);
      setExam(response.data);
    } catch (error) {
      console.error('Error fetching exam details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Exam not found</p>
          <Link to="/exams">
            <Button className="mt-4 bg-orange-600 hover:bg-orange-700">Back to Exams</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/exams" className="text-blue-100 hover:text-white">Exams</Link>
            <span>/</span>
            <span>{exam.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{exam.name}</h1>
          <p className="text-xl text-blue-100 mb-4">{exam.full_name}</p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">{exam.exam_level} Level</span>
            <span className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">{exam.streams.join(', ')}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">About {exam.name}</h2>
              <p className="text-gray-700 leading-relaxed">{exam.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-600">Conducting Body</p>
                  <p className="font-semibold">{exam.conducting_body}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exam Mode</p>
                  <p className="font-semibold">{exam.exam_mode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{exam.exam_duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Marks</p>
                  <p className="font-semibold">{exam.total_marks}</p>
                </div>
              </div>
            </div>

            {/* Exam Pattern */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiFileText className="text-orange-600" /> Exam Pattern
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Questions:</span>
                  <span className="font-semibold">{exam.num_questions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Marks:</span>
                  <span className="font-semibold">{exam.total_marks}</span>
                </div>
                {exam.exam_pattern.sections && (
                  <div>
                    <p className="font-semibold mb-2">Sections:</p>
                    <ul className="list-disc list-inside text-gray-700">
                      {exam.exam_pattern.sections.map((section, idx) => (
                        <li key={idx}>{section}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiAward className="text-orange-600" /> Eligibility Criteria
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Qualification</p>
                  <p className="font-semibold">{exam.eligibility.qualification}</p>
                </div>
                {exam.eligibility.min_percentage && (
                  <div>
                    <p className="text-sm text-gray-600">Minimum Percentage</p>
                    <p className="font-semibold">{exam.eligibility.min_percentage}</p>
                  </div>
                )}
                {exam.age_limit && (
                  <div>
                    <p className="text-sm text-gray-600">Age Limit</p>
                    <p className="font-semibold">{exam.age_limit}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Syllabus */}
            {exam.syllabus && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FiBook className="text-orange-600" /> Syllabus
                </h2>
                <p className="text-gray-700">{exam.syllabus}</p>
                {exam.important_topics && exam.important_topics.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Important Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {exam.important_topics.map((topic, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cutoffs */}
            {exam.previous_year_cutoffs && exam.previous_year_cutoffs.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Previous Year Cutoffs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Year</th>
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-left">Cutoff</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exam.previous_year_cutoffs.map((cutoff, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">{cutoff.year}</td>
                          <td className="px-4 py-2">{cutoff.category}</td>
                          <td className="px-4 py-2 font-semibold">{cutoff.cutoff || cutoff.percentile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Important Dates */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiCalendar className="text-orange-600" /> Important Dates
              </h3>
              <div className="space-y-3">
                {exam.application_start_date && (
                  <div>
                    <p className="text-sm text-gray-600">Application Start</p>
                    <p className="font-semibold">{exam.application_start_date}</p>
                  </div>
                )}
                {exam.application_end_date && (
                  <div>
                    <p className="text-sm text-gray-600">Application End</p>
                    <p className="font-semibold">{exam.application_end_date}</p>
                  </div>
                )}
                {exam.exam_date && (
                  <div>
                    <p className="text-sm text-gray-600">Exam Date</p>
                    <p className="font-semibold">{exam.exam_date}</p>
                  </div>
                )}
                {exam.result_date && (
                  <div>
                    <p className="text-sm text-gray-600">Result Date</p>
                    <p className="font-semibold">{exam.result_date}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Application Fee */}
            {exam.application_fee && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiDollarSign className="text-orange-600" /> Application Fee
                </h3>
                <div className="space-y-2">
                  {Object.entries(exam.application_fee).map(([category, fee]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-gray-600">{category}:</span>
                      <span className="font-semibold">₹{fee}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {exam.total_applicants && (
                  <div>
                    <p className="text-orange-100 text-sm">Total Applicants</p>
                    <p className="text-2xl font-bold">{(exam.total_applicants / 100000).toFixed(1)}L+</p>
                  </div>
                )}
                {exam.total_seats && (
                  <div>
                    <p className="text-orange-100 text-sm">Total Seats</p>
                    <p className="text-2xl font-bold">{(exam.total_seats / 1000).toFixed(1)}K+</p>
                  </div>
                )}
                {exam.difficulty_level && (
                  <div>
                    <p className="text-orange-100 text-sm">Difficulty</p>
                    <p className="text-xl font-bold">{exam.difficulty_level}</p>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            {exam.official_website && (
              <a href={exam.official_website} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Visit Official Website</Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;