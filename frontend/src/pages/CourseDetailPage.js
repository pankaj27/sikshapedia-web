import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiChevronRight, FiClock, FiBookOpen, FiDollarSign, FiAward, FiUsers, FiBriefcase, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Sample B.Tech CSE data
  const courseData = {
    name: 'Bachelor of Technology [B.Tech] (Computer Science and Engineering)',
    shortName: 'BTech CSE',
    duration: '4 Years',
    type: 'Full Time',
    level: 'Undergraduate',
    averageFee: 'INR 2 - 10 Lakhs',
    averageSalary: 'INR 1.5 - 4.5 Lakhs',
    eligibility: '10+2 with minimum 55% marks',
    admissionProcess: 'Merit based or Entrance exam',
    topRecruiters: ['Syntel', 'TCS', 'Hexaware', 'Infosys', 'Wipro'],
    jobProfiles: ['Game developer', 'Software developer', 'Testing engineer', 'Database administrator', 'Data Analyst', 'Networking engineer'],
    description: 'BTech CSE is a 4 year UG course that studies practical and theoretical knowledge of computer hardware and software. This course lays emphasis on the basics of computer programming and networking while also comprising a plethora of topics.',
    
    highlights: [
      { label: 'Course Type', value: 'Undergraduate' },
      { label: 'Duration', value: '4 years' },
      { label: 'Examination Type', value: 'Semester-Wise' },
      { label: 'Eligibility', value: '10+2 with minimum 55% marks' },
      { label: 'Admission Process', value: 'Merit based or Entrance exam' },
      { label: 'Course Fees', value: 'INR 2 lakhs- INR 10 lakhs' },
      { label: 'Average Salary', value: 'INR 1.5 lakhs – INR 4.5 lakhs' },
      { label: 'Top Recruiting Companies', value: 'Syntel, TCS, Hexaware, Infosys, Wipro' },
      { label: 'Job Profiles', value: 'Game developer, Software developer, Testing engineer, Database administrator' }
    ],

    syllabus: [
      {
        semester: 'Semester 1',
        subjects: ['Computational mathematics -I', 'Digital logic', 'Communication skill', 'Systems programming']
      },
      {
        semester: 'Semester 2',
        subjects: ['Computational mathematics -II', 'Computer organization', 'Operating systems', 'Microprocessor & microcontroller']
      },
      {
        semester: 'Semester 3',
        subjects: ['Computer architecture', 'Compiler design', 'Database management systems', 'Design & analysis of algorithms']
      },
      {
        semester: 'Semester 4',
        subjects: ['Software engineering -I', 'Object oriented system', 'Optimization techniques', 'Computer networks']
      }
    ],

    topColleges: [
      { name: 'IIT Madras - Indian Institute of Technology - [IITM]', location: 'Chennai, Tamil Nadu', fee: 'INR 75,116', rank: 1 },
      { name: 'IIT New Delhi - Indian Institute of Technology [IITD]', location: 'New Delhi, Delhi NCR', fee: 'INR 220,300', rank: 2 },
      { name: 'IIT Bombay - Indian Institute of Technology [IITB]', location: 'Mumbai, Maharashtra', fee: 'INR 228,000', rank: 3 },
      { name: 'IIT Kanpur - Indian Institute of Technology - [IITK]', location: 'Kanpur, Uttar Pradesh', fee: 'INR 215,600', rank: 4 },
      { name: 'IIT Kharagpur - Indian Institute of Technology - [IITKGP]', location: 'Kharagpur, West Bengal', fee: 'INR 82,070', rank: 5 },
      { name: 'IIT Roorkee - Indian Institute of Technology - [IITR]', location: 'Roorkee, Uttarakhand', fee: 'INR 221,700', rank: 6 }
    ],

    faqs: [
      { question: 'Is BTech CSE easy?', answer: 'Students who have passion for programming languages and want to work in the related field, pursuing BTech in CSE will seemingly be easy for them.' },
      { question: 'How can I get admission in BTech CSE?', answer: 'To get admission in Btech CSE, the student needs to have passed class 12 or equivalent examination with at least 45% aggregate. Further eligibility requirements include studying Physics, Chemistry, Mathematics and Computer Science as compulsory subjects in 10+2.' },
      { question: 'Can I do BTech CSE without JEE?', answer: 'Yes, there are some colleges in India that do not require the students to submit the JEE marks to take admission in BTech CSE.' },
      { question: 'Is BTech CSE good for the future?', answer: 'With the world getting digital at every step, the IT sector has been blooming impressively. Hence pursuing BTech in CSE and qualifying with standard grades definitely has a brilliant future to give you.' },
      { question: 'What is the duration for BTech CSE?', answer: 'B.Tech CSE is a full time 4 years course.' }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'highlights', label: 'Course Details' },
    { id: 'admission', label: 'Admission' },
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'colleges', label: 'Top Colleges' },
    { id: 'career', label: 'Career & Jobs' },
    { id: 'faq', label: 'FAQs' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <FiChevronRight size={14} className="mx-2" />
            <Link to="/courses" className="hover:text-orange-600">Courses</Link>
            <FiChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 font-medium">{courseData.shortName}</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">{courseData.name}</h1>
          <p className="text-blue-100 text-sm mb-4">Course Details, Admission, Fees, Eligibility, Syllabus, Jobs & Salary</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FiClock />
              <span>{courseData.duration}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <FiBookOpen />
              <span>{courseData.type}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <FiDollarSign />
              <span>{courseData.averageFee}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded shadow-lg">
              Apply Now
            </button>
            <button className="px-6 py-2 bg-white text-blue-600 hover:bg-gray-100 font-medium rounded shadow-lg">
              Check Eligibility
            </button>
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded border border-white/30">
              Get Updates
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <main className="flex-1">
            {/* Overview Section */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{courseData.shortName}: Course Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{courseData.description}</p>
                <p className="text-gray-700 leading-relaxed">
                  The admission process for the B.tech CSE is to clear entrance exams such as JEE at a national or state level. 
                  BTech CSE Entrance Exams are JEE Mains, SRMJEEE, etc. The eligibility criteria for the course B.tech CSE is 
                  students have to qualify 10+2 with a minimum of 55% marks from the science stream.
                </p>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Why Study BTech CSE?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-orange-600 font-bold">•</span>
                      <div>
                        <strong className="text-gray-900">Good Compensation</strong> - Candidates having a BTech CSE degree, earn a good amount of compensation. The average annual salary of a BTech CSE graduate is INR 3 lakhs.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-600 font-bold">•</span>
                      <div>
                        <strong className="text-gray-900">Multiple Opportunities</strong> - There are a lot of opportunities for BTech CSE graduates. Candidates can work in renowned job positions.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-600 font-bold">•</span>
                      <div>
                        <strong className="text-gray-900">Job Security</strong> - Candidates holding the BTech cse degree have great job security. In this digital world, the value of a computer expert who has a degree is extreme.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Course Details/Highlights Section */}
            {activeTab === 'highlights' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">BTech CSE: Course Details</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {courseData.highlights.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 w-1/3">{item.label}</td>
                          <td className="py-3 px-4 text-gray-900">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Syllabus Section */}
            {activeTab === 'syllabus' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">BTech CSE Syllabus</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courseData.syllabus.map((sem, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{sem.semester}</h3>
                      <ul className="space-y-2">
                        {sem.subjects.map((subject, subIdx) => (
                          <li key={subIdx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>{subject}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded">
                  View Full Syllabus
                </button>
              </div>
            )}

            {/* Top Colleges Section */}
            {activeTab === 'colleges' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Top BTech CSE Colleges In India</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">NIRF Ranking</th>
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">College Name</th>
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">Location</th>
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">Average Fees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseData.topColleges.map((college, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900">{college.rank}</td>
                          <td className="border border-gray-200 px-4 py-3">
                            <Link to={`/colleges/${idx + 1}`} className="text-sm text-blue-600 hover:underline font-medium">
                              {college.name}
                            </Link>
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{college.location}</td>
                          <td className="border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900">{college.fee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Career & Jobs Section */}
            {activeTab === 'career' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">BTech CSE: Career Options & Jobs</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseData.jobProfiles.map((job, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <FiBriefcase className="text-orange-600" size={20} />
                          <h3 className="font-semibold text-gray-900">{job}</h3>
                        </div>
                        <p className="text-sm text-gray-600">Average Salary: INR 3-6 LPA</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Top Recruiting Companies</h3>
                    <div className="flex flex-wrap gap-3">
                      {courseData.topRecruiters.map((company, idx) => (
                        <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQs Section */}
            {activeTab === 'faq' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">BTech CSE: Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {courseData.faqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 text-left">{faq.question}</span>
                        {expandedFaq === idx ? <FiChevronUp className="text-gray-600" /> : <FiChevronDown className="text-gray-600" />}
                      </button>
                      {expandedFaq === idx && (
                        <div className="px-4 pb-4 text-gray-700 text-sm border-t border-gray-200 pt-4">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded">
                  Apply Now
                </button>
                <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded">
                  Download Brochure
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded">
                  Compare Courses
                </button>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold text-sm mb-3 text-gray-800">Course Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiClock size={16} className="text-orange-600" />
                    <span>Duration: {courseData.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiDollarSign size={16} className="text-orange-600" />
                    <span>Fees: {courseData.averageFee}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiBriefcase size={16} className="text-orange-600" />
                    <span>Avg Salary: {courseData.averageSalary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiAward size={16} className="text-orange-600" />
                    <span>Level: {courseData.level}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold text-sm mb-3 text-gray-800">Related Courses</h3>
                <div className="space-y-2 text-sm">
                  <Link to="/courses/btech-it" className="block text-blue-600 hover:underline">B.Tech Information Technology</Link>
                  <Link to="/courses/bca" className="block text-blue-600 hover:underline">BCA - Bachelor of Computer Applications</Link>
                  <Link to="/courses/mtech-cse" className="block text-blue-600 hover:underline">M.Tech Computer Science</Link>
                  <Link to="/courses/mca" className="block text-blue-600 hover:underline">MCA - Master of Computer Applications</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
