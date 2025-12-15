import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiDownload, FiFileText, FiCalendar, FiInfo, FiBook, FiAward, FiDollarSign } from 'react-icons/fi';
import { Button } from '../components/ui/button';

const ExamDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('questionPapers');

  // Mock exam data - replace with API call
  const examData = {
    'jee-main': {
      name: 'JEE Main',
      fullName: 'Joint Entrance Examination Main',
      description: 'JEE Main is a national level entrance exam for admission to engineering colleges across India.',
      conductor: 'NTA (National Testing Agency)',
      
      questionPapers: {
        '2025': [
          { date: '2 April Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '2 April Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '3 April Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '3 April Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '4 April Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '4 April Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '22 Jan Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '22 Jan Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '23 Jan Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '23 Jan Shift 2', downloadLink: '#', solutionLink: '#' },
        ],
        '2024': [
          { date: '4 April Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '4 April Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '5 April Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '5 April Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '6 April Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '6 April Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '27 Jan Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '27 Jan Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '29 Jan Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '29 Jan Shift 2', downloadLink: '#', solutionLink: '#' },
        ],
        '2023': [
          { date: '6 April Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '6 April Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '8 April Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '8 April Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '10 April Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '10 April Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '24 Jan Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '24 Jan Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '25 Jan Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '25 Jan Shift 2', downloadLink: '#', solutionLink: '#' },
        ],
        '2022': [
          { date: '24 June Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '24 June Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '25 June Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '25 June Shift 2', downloadLink: '#', solutionLink: '#' },
          { date: '26 June Shift 1', downloadLink: '#', solutionLink: '#' },
          { date: '26 June Shift 2', downloadLink: '#', solutionLink: '#' },
        ],
      },
      
      examInfo: {
        examMode: 'Computer Based Test (CBT)',
        examDuration: '3 Hours',
        totalQuestions: '90 Questions',
        totalMarks: '300 Marks',
        examLevel: 'National Level',
        examFrequency: 'Twice a Year (January & April)',
        eligibility: '10+2 with Physics, Chemistry & Mathematics',
        officialWebsite: 'jeemain.nta.nic.in'
      },
      
      keyHighlights: [
        'In JEE Main 2025, 20-25% questions were more higher-order thinking skills (HOTS) and application-based',
        'In JEE Main 2024, Maths was difficult with an increase in algebra based problems',
        'In JEE Main 2023, Calculus and Coordinate Geometry questions were tricky'
      ]
    },
    'neet': {
      name: 'NEET',
      fullName: 'National Eligibility cum Entrance Test',
      description: 'NEET is the single entrance exam for admission to medical colleges across India.',
      conductor: 'NTA (National Testing Agency)',
      
      questionPapers: {
        '2025': [
          { date: '4 May 2025', downloadLink: '#', solutionLink: '#' },
        ],
        '2024': [
          { date: '5 May 2024', downloadLink: '#', solutionLink: '#' },
        ],
        '2023': [
          { date: '7 May 2023', downloadLink: '#', solutionLink: '#' },
        ],
        '2022': [
          { date: '17 July 2022', downloadLink: '#', solutionLink: '#' },
        ],
      },
      
      examInfo: {
        examMode: 'Pen & Paper Based (Offline)',
        examDuration: '3 Hours 20 Minutes',
        totalQuestions: '200 Questions',
        totalMarks: '720 Marks',
        examLevel: 'National Level',
        examFrequency: 'Once a Year',
        eligibility: '10+2 with Physics, Chemistry & Biology',
        officialWebsite: 'neet.nta.nic.in'
      },
      
      keyHighlights: [
        'Physics section tends to be calculation-intensive',
        'Chemistry has a good balance of organic, inorganic and physical chemistry',
        'Biology questions are mostly NCERT-based'
      ]
    }
  };

  const exam = examData[id] || examData['jee-main'];

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-3xl font-bold mb-2">{exam.name} Previous Years Question Paper with Solution PDF and Answer Key</h1>
          <p className="text-lg">Download {exam.name} Question Papers from 2025-2022 with detailed solutions</p>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="bg-blue-50 border-t border-b border-blue-200 py-4">
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