import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiDownload, FiFileText, FiCalendar, FiInfo, FiBook, FiAward, FiDollarSign } from 'react-icons/fi';
import { Button } from '../components/ui/button';

const ExamDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('questionPapers');
  const [activeSection, setActiveSection] = useState('overview');

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
      ],
      
      contentTeam: {
        author: 'Shivam Yadav',
        profileImage: 'https://via.placeholder.com/40',
        updatedDate: 'Nov 18, 2025'
      },
      
      tableOfContents: [
        { id: 'overview', title: 'JEE Main Question Paper 2025' },
        { id: '2024', title: 'JEE Main Question Paper 2024' },
        { id: '2023', title: 'JEE Main Question Paper 2023' },
        { id: '2022', title: 'JEE Main Question Paper 2022' },
        { id: 'chapterwise', title: 'Download JEE Main PYQs ChapterWise' },
        { id: 'pattern', title: 'JEE Main Paper Pattern' },
        { id: 'studynotes', title: 'JEE Main Study Notes' }
      ],
      
      videos: [
        { title: 'JEE Main 2025 Strategy', thumbnail: 'https://via.placeholder.com/300x180', duration: '15:30' },
        { title: 'How to Solve Previous Year Papers', thumbnail: 'https://via.placeholder.com/300x180', duration: '12:45' }
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

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Quick Navigation</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('questionPapers')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeTab === 'questionPapers' ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Question Papers
                </button>
                <button
                  onClick={() => setActiveTab('examInfo')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeTab === 'examInfo' ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Exam Information
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'questionPapers' && (
              <div className="space-y-6">
                {Object.keys(exam.questionPapers).map((year) => (
                  <div key={year} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FiBook />
                        {exam.name} Question Paper {year}
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                              {exam.name} Paper Name
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">
                              Question Paper PDF
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">
                              Solution PDF
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {exam.questionPapers[year].map((paper, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-gray-800">
                                {exam.name} {year} Question Paper {paper.date}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Link
                                  to={paper.downloadLink}
                                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  <FiDownload size={16} />
                                  Download PDF
                                </Link>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Link
                                  to={paper.solutionLink}
                                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 text-sm font-medium"
                                >
                                  <FiFileText size={16} />
                                  View Solution
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'examInfo' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FiInfo className="text-orange-600" />
                  {exam.name} Exam Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(exam.examInfo).map(([key, value]) => (
                    <div key={key} className="border-l-4 border-orange-500 pl-4">
                      <p className="text-sm text-gray-600 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-blue-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-3">About {exam.name}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{exam.description}</p>
                  <p className="text-gray-700 text-sm mt-2">
                    <span className="font-semibold">Conducted by:</span> {exam.conductor}
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                    Apply Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
