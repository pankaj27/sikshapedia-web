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

      {/* Exam Menu */}
      <div className="bg-white border-b shadow-sm sticky top-16 z-30">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 overflow-x-auto py-3">
            <Link to={`/exams/${id}`} className="text-sm font-semibold text-orange-600 border-b-2 border-orange-600 pb-3 whitespace-nowrap">
              Question Paper
            </Link>
            <Link to={`/exams/${id}/admit-card`} className="text-sm font-medium text-gray-700 hover:text-orange-600 pb-3 whitespace-nowrap">
              Admit Card
            </Link>
            <Link to={`/exams/${id}/answer-key`} className="text-sm font-medium text-gray-700 hover:text-orange-600 pb-3 whitespace-nowrap">
              Answer Key
            </Link>
            <Link to={`/exams/${id}/result`} className="text-sm font-medium text-gray-700 hover:text-orange-600 pb-3 whitespace-nowrap">
              Result
            </Link>
            <Link to={`/exams/${id}/cutoff`} className="text-sm font-medium text-gray-700 hover:text-orange-600 pb-3 whitespace-nowrap">
              Cut Off
            </Link>
            <Link to={`/exams/${id}/syllabus`} className="text-sm font-medium text-gray-700 hover:text-orange-600 pb-3 whitespace-nowrap">
              Syllabus
            </Link>
            <Link to={`/exams/${id}/exam-pattern`} className="text-sm font-medium text-gray-700 hover:text-orange-600 pb-3 whitespace-nowrap">
              Exam Pattern
            </Link>
            <Link to={`/exams/${id}/application-form`} className="text-sm font-medium text-gray-700 hover:text-orange-600 pb-3 whitespace-nowrap">
              Application Form
            </Link>
            <Link to={`/exams/${id}/counseling`} className="text-sm font-medium text-gray-700 hover:text-orange-600 pb-3 whitespace-nowrap">
              Counseling
            </Link>
          </div>
        </div>
      </div>

      {/* Author Info */}
      <div className="bg-white border-b py-3">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <img src={exam.contentTeam.profileImage} alt={exam.contentTeam.author} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{exam.contentTeam.author}</p>
              <p className="text-xs text-gray-600">Updated on - {exam.contentTeam.updatedDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Table of Contents */}
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Table of Contents</h3>
              <nav className="space-y-1">
                {exam.tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(item.id);
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`block px-3 py-2 rounded text-sm transition-colors ${
                      activeSection === item.id ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-md p-4 text-white">
              <h3 className="font-bold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 text-sm">
                  <FiDownload className="mr-2" size={16} />
                  Download All Papers
                </Button>
                <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 text-sm">
                  <FiFileText className="mr-2" size={16} />
                  Ask a Question
                </Button>
                <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 text-sm">
                  <FiInfo className="mr-2" size={16} />
                  Get More Info
                </Button>
              </div>
            </div>

            {/* College Predictor Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-md p-4 text-white text-center">
              <FiAward className="mx-auto mb-2" size={32} />
              <h3 className="font-bold mb-2">College Predictor</h3>
              <p className="text-sm mb-3 opacity-90">Know your chances of admission</p>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 text-sm font-semibold">
                Predict Now
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Section */}
            <div id="overview" className="mb-8 scroll-mt-20">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-700 leading-relaxed mb-4">{exam.description}</p>
                <div className="flex gap-3">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <FiDownload className="mr-2" />
                    Download All Question Papers
                  </Button>
                  <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                    <FiInfo className="mr-2" />
                    Get Counseling
                  </Button>
                </div>
              </div>
            </div>

            {/* Question Paper Sections by Year */}
            <div className="space-y-6">
              {Object.keys(exam.questionPapers).map((year) => (
                <div key={year} id={year} className="bg-white rounded-lg shadow-md overflow-hidden scroll-mt-20">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FiBook />
                      {exam.name} Question Paper {year}
                    </h2>
                    <Button className="bg-white text-orange-600 hover:bg-gray-100 text-sm">
                      <FiDownload className="mr-2" size={14} />
                      Download All {year}
                    </Button>
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

            {/* ChapterWise PYQs Section */}
            <div id="chapterwise" className="bg-white rounded-lg shadow-md p-6 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiBook className="text-orange-600" />
                Download {exam.name} PYQs ChapterWise
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Mole Concept', 'Organic Chemistry', 'Friction', 'Projectile Motion', 'Vectors', 'Circular Motion', 'Determinants', 'Electrostatics'].map((chapter, idx) => (
                  <Link key={idx} to="#" className="text-blue-600 hover:text-orange-600 text-sm hover:underline">
                    {chapter} {exam.name} PYQs
                  </Link>
                ))}
              </div>
            </div>

            {/* Paper Pattern Section */}
            <div id="pattern" className="bg-white rounded-lg shadow-md p-6 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiFileText className="text-orange-600" />
                {exam.name} Paper Pattern
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(exam.examInfo).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-orange-500 pl-4">
                    <p className="text-sm text-gray-600 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Notes Section */}
            <div id="studynotes" className="bg-white rounded-lg shadow-md p-6 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiBook className="text-orange-600" />
                {exam.name} Study Notes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Trigonometry', 'Thermodynamics', 'Atomic Structure', 'Statistics', 'Elasticity', 'Rotational Motion'].map((topic, idx) => (
                  <Link key={idx} to="#" className="text-blue-600 hover:text-orange-600 text-sm hover:underline">
                    {topic} Study Notes
                  </Link>
                ))}
              </div>
            </div>

            {/* Video Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FiBook className="text-orange-600" />
                Related Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exam.videos.map((video, idx) => (
                  <div key={idx} className="cursor-pointer group">
                    <div className="relative rounded-lg overflow-hidden shadow-md">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-orange-600 border-b-[12px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                        {video.duration}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800 mt-3">{video.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">Watch expert analysis and preparation tips</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ask Question Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Have Questions About {exam.name}?</h3>
              <p className="text-gray-600 mb-4">Get your doubts cleared by our expert counselors</p>
              <div className="flex gap-3">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Ask a Question
                </Button>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  Talk to Counselor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
