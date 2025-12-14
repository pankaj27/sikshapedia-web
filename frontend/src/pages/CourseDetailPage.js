import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiChevronRight, FiClock, FiBookOpen, FiDollarSign, FiAward, FiUsers, FiBriefcase, FiChevronDown, FiChevronUp, FiCalendar, FiCheckCircle } from 'react-icons/fi';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [showContent, setShowContent] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Course data
  const courseData = {
    name: 'Bachelor of Technology [B.Tech] (Computer Science and Engineering)',
    shortName: 'B.Tech CSE',
    duration: '4 Years',
    type: 'Full Time',
    level: 'Undergraduate',
    averageFee: 'INR 2 - 10 Lakhs',
    averageSalary: 'INR 3 - 8 Lakhs',
    
    tableOfContents: [
      { id: 'overview', label: 'B.Tech CSE Overview', number: '1' },
      { id: 'why-study', label: 'Why Study B.Tech CSE?', number: '1.1' },
      { id: 'eligibility', label: 'B.Tech CSE Eligibility', number: '2' },
      { id: 'admission', label: 'B.Tech CSE Admission', number: '3' },
      { id: 'entrance-exams', label: 'B.Tech CSE Entrance Exams', number: '4' },
      { id: 'syllabus', label: 'B.Tech CSE Syllabus', number: '5' },
      { id: 'colleges', label: 'Top B.Tech CSE Colleges', number: '6' },
      { id: 'career', label: 'B.Tech CSE Career & Jobs', number: '7' },
      { id: 'faqs', label: 'B.Tech CSE FAQs', number: '8' }
    ],

    highlights: [
      { label: 'Course Type', value: 'Undergraduate' },
      { label: 'Duration', value: '4 years (8 semesters)' },
      { label: 'Examination Type', value: 'Semester System' },
      { label: 'Eligibility', value: '10+2 with Physics, Chemistry, Mathematics' },
      { label: 'Admission Process', value: 'Entrance Exam / Merit Based' },
      { label: 'Course Fees', value: 'INR 2 Lakhs - INR 10 Lakhs' },
      { label: 'Average Starting Salary', value: 'INR 3 Lakhs - INR 8 Lakhs per annum' },
      { label: 'Top Recruiters', value: 'TCS, Infosys, Wipro, Accenture, Amazon' },
      { label: 'Job Positions', value: 'Software Engineer, Data Analyst, System Administrator' }
    ],

    eligibilityCriteria: [
      {
        type: 'Merit Based Admission',
        criteria: [
          'Candidates must have passed 10+2 with minimum 50% aggregate marks',
          'Must have studied Physics, Chemistry and Mathematics as compulsory subjects',
          'Some institutes accept 10+2 with PCM and Computer Science',
          'Reserved category candidates get 5% relaxation in minimum marks'
        ]
      },
      {
        type: 'Entrance Based Admission',
        criteria: [
          'Must qualify national level entrance exams like JEE Main, JEE Advanced',
          'State level exams: WBJEE, MHT CET, KCET, EAMCET accepted by respective state colleges',
          'University level exams: BITSAT, VITEEE, SRMJEEE for private institutions',
          'Minimum percentile requirements vary from 75-95 based on institution tier'
        ]
      }
    ],

    entranceExams: [
      { name: 'JEE Main', conducting: 'NTA', applicants: '12 Lakh+', difficulty: 'Moderate to High' },
      { name: 'JEE Advanced', conducting: 'IITs', applicants: '2.5 Lakh+', difficulty: 'High' },
      { name: 'BITSAT', conducting: 'BITS Pilani', applicants: '2 Lakh+', difficulty: 'Moderate to High' },
      { name: 'VITEEE', conducting: 'VIT University', applicants: '5 Lakh+', difficulty: 'Moderate' },
      { name: 'WBJEE', conducting: 'WBJEEB', applicants: '2 Lakh+', difficulty: 'Moderate' }
    ],

    syllabus: {
      year1: {
        semester1: ['Mathematics-I', 'Physics', 'Basic Electrical Engineering', 'Engineering Graphics', 'Programming in C', 'Communication Skills'],
        semester2: ['Mathematics-II', 'Chemistry', 'Basic Electronics Engineering', 'Engineering Mechanics', 'Data Structures', 'Professional Ethics']
      },
      year2: {
        semester3: ['Mathematics-III', 'Discrete Mathematics', 'Computer Organization', 'Object Oriented Programming', 'Database Management Systems', 'Operating Systems'],
        semester4: ['Mathematics-IV', 'Theory of Computation', 'Computer Networks', 'Design and Analysis of Algorithms', 'Software Engineering', 'Microprocessors']
      },
      year3: {
        semester5: ['Compiler Design', 'Machine Learning', 'Computer Graphics', 'Web Technologies', 'Artificial Intelligence', 'Open Elective-I'],
        semester6: ['Distributed Systems', 'Cryptography and Network Security', 'Mobile Computing', 'Cloud Computing', 'Big Data Analytics', 'Open Elective-II']
      },
      year4: {
        semester7: ['Internet of Things', 'Blockchain Technology', 'Natural Language Processing', 'Project Work-I', 'Professional Elective-I', 'Professional Elective-II'],
        semester8: ['Cyber Security', 'DevOps', 'Quantum Computing', 'Project Work-II', 'Professional Elective-III', 'Internship']
      }
    },

    topColleges: [
      { name: 'IIT Madras', location: 'Chennai, Tamil Nadu', fee: 'INR 8.5 Lakhs', rank: '#1' },
      { name: 'IIT Delhi', location: 'New Delhi', fee: 'INR 9 Lakhs', rank: '#2' },
      { name: 'IIT Bombay', location: 'Mumbai, Maharashtra', fee: 'INR 9.2 Lakhs', rank: '#3' },
      { name: 'IIT Kanpur', location: 'Kanpur, UP', fee: 'INR 8.8 Lakhs', rank: '#4' },
      { name: 'IIT Kharagpur', location: 'Kharagpur, WB', fee: 'INR 8.6 Lakhs', rank: '#5' },
      { name: 'BITS Pilani', location: 'Pilani, Rajasthan', fee: 'INR 19 Lakhs', rank: '#6' }
    ],

    careerOptions: [
      { title: 'Software Developer', salary: 'INR 3-8 LPA', description: 'Design, develop and maintain software applications' },
      { title: 'Data Scientist', salary: 'INR 6-15 LPA', description: 'Analyze complex data and derive insights using ML/AI' },
      { title: 'System Administrator', salary: 'INR 3-6 LPA', description: 'Manage and maintain IT infrastructure' },
      { title: 'Network Engineer', salary: 'INR 3-7 LPA', description: 'Design and implement computer networks' },
      { title: 'Database Administrator', salary: 'INR 4-9 LPA', description: 'Manage and secure organizational databases' },
      { title: 'Cyber Security Analyst', salary: 'INR 5-12 LPA', description: 'Protect systems from security threats' }
    ],

    faqs: [
      { 
        question: 'What is the duration of B.Tech CSE?', 
        answer: 'B.Tech in Computer Science and Engineering is a 4-year full-time undergraduate program divided into 8 semesters.' 
      },
      { 
        question: 'What are the eligibility criteria for B.Tech CSE?', 
        answer: 'Candidates need to pass 10+2 with Physics, Chemistry, and Mathematics with minimum 50% marks. Admission is through entrance exams or merit-based.' 
      },
      { 
        question: 'Which entrance exams are accepted for B.Tech CSE admission?', 
        answer: 'Major entrance exams include JEE Main, JEE Advanced, BITSAT, VITEEE, and various state-level exams like WBJEE, MHT CET, KCET.' 
      },
      { 
        question: 'What is the average salary after B.Tech CSE?', 
        answer: 'The average starting salary for B.Tech CSE graduates ranges from INR 3 to 8 Lakhs per annum, depending on skills and company tier.' 
      },
      { 
        question: 'What are the career options after B.Tech CSE?', 
        answer: 'Graduates can work as Software Developers, Data Scientists, System Administrators, Network Engineers, Database Administrators, and Cyber Security Analysts.' 
      }
    ]
  };

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
          <h1 className="text-3xl font-bold mb-3">{courseData.name}</h1>
          <p className="text-blue-100 text-sm mb-5">Complete Guide: Eligibility, Admission, Syllabus, Career & Salary</p>
          <div className="flex flex-wrap gap-6 text-sm mb-6">
            <div className="flex items-center gap-2">
              <FiClock className="text-blue-200" />
              <span>{courseData.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiBookOpen className="text-blue-200" />
              <span>{courseData.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-blue-200" />
              <span>Fees: {courseData.averageFee}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiBriefcase className="text-blue-200" />
              <span>Avg Salary: {courseData.averageSalary}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-lg transition-colors">
              Apply Now
            </button>
            <button className="px-6 py-2.5 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg shadow-lg transition-colors">
              Check Eligibility
            </button>
            <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 backdrop-blur-sm transition-colors">
              Download Brochure
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <main className="flex-1">
            {/* Table of Contents */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {courseData.tableOfContents.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-blue-600 hover:text-blue-800 hover:underline text-sm py-1"
                  >
                    {item.number}. {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Highlights */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{courseData.shortName}: Course Highlights</h2>
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

            {/* Overview Section */}
            <div id="overview" className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. {courseData.shortName}: Course Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                B.Tech in Computer Science and Engineering is a comprehensive 4-year undergraduate program focusing on computer systems, software development, and emerging technologies. The curriculum covers fundamental concepts in programming, data structures, algorithms, database systems, and advanced topics like artificial intelligence and machine learning.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This program prepares students for diverse career opportunities in the rapidly evolving IT industry, enabling them to work on cutting-edge technologies and contribute to digital transformation across sectors.
              </p>
            </div>

            {/* Why Study Section */}
            <div id="why-study" className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">1.1 Why Study B.Tech CSE?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">High Demand Industry</h4>
                    <p className="text-gray-700 text-sm">The IT sector consistently shows strong growth with abundant job opportunities for skilled professionals in software development, data science, and cybersecurity.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Competitive Salaries</h4>
                    <p className="text-gray-700 text-sm">CSE graduates command attractive salary packages, with starting salaries ranging from INR 3-8 LPA and experienced professionals earning significantly higher.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Innovation & Creativity</h4>
                    <p className="text-gray-700 text-sm">Work on groundbreaking technologies like AI, blockchain, IoT, and cloud computing, contributing to innovations that shape the future.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Global Opportunities</h4>
                    <p className="text-gray-700 text-sm">Computer Science skills are universally valued, opening doors to international career opportunities with leading tech companies worldwide.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility Section */}
            <div id="eligibility" className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. {courseData.shortName}: Eligibility Criteria</h2>
              {courseData.eligibilityCriteria.map((section, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-semibold text-blue-600 mb-3">{section.type}</h3>
                  <ul className="space-y-2">
                    {section.criteria.map((criterion, critIdx) => (
                      <li key={critIdx} className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold mt-1">•</span>
                        <span className="text-gray-700 text-sm">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Admission Section */}
            <div id="admission" className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. {courseData.shortName}: Admission Process</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-2">Step 1: Entrance Exam Registration</h4>
                  <p className="text-gray-700 text-sm">Register for national or state-level entrance examinations like JEE Main, JEE Advanced, or university-specific tests.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-2">Step 2: Appear for Entrance Exam</h4>
                  <p className="text-gray-700 text-sm">Prepare thoroughly and appear for the chosen entrance examinations to secure qualifying marks or percentile.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-2">Step 3: Counseling & College Selection</h4>
                  <p className="text-gray-700 text-sm">Participate in centralized counseling process, select colleges based on rank, and submit preference list.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-2">Step 4: Document Verification & Admission</h4>
                  <p className="text-gray-700 text-sm">Complete document verification, pay admission fees, and confirm your seat at the allotted institution.</p>
                </div>
              </div>
            </div>

            {/* Entrance Exams Section */}
            <div id="entrance-exams" className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. {courseData.shortName}: Entrance Exams</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">Exam Name</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">Conducting Body</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">Applicants</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">Difficulty Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.entranceExams.map((exam, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-sm font-semibold text-blue-600">{exam.name}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{exam.conducting}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{exam.applicants}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{exam.difficulty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Syllabus Section */}
            <div id="syllabus" className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. {courseData.shortName}: Syllabus</h2>
              
              {/* Year 1 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-blue-600 mb-4">First Year</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Semester I</h4>
                    <ul className="space-y-2">
                      {courseData.syllabus.year1.semester1.map((subject, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Semester II</h4>
                    <ul className="space-y-2">
                      {courseData.syllabus.year1.semester2.map((subject, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Year 2 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-blue-600 mb-4">Second Year</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Semester III</h4>
                    <ul className="space-y-2">
                      {courseData.syllabus.year2.semester3.map((subject, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Semester IV</h4>
                    <ul className="space-y-2">
                      {courseData.syllabus.year2.semester4.map((subject, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Year 3 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-blue-600 mb-4">Third Year</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Semester V</h4>
                    <ul className="space-y-2">
                      {courseData.syllabus.year3.semester5.map((subject, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Semester VI</h4>
                    <ul className="space-y-2">
                      {courseData.syllabus.year3.semester6.map((subject, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Year 4 */}
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-4">Fourth Year</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Semester VII</h4>
                    <ul className="space-y-2">
                      {courseData.syllabus.year4.semester7.map((subject, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Semester VIII</h4>
                    <ul className="space-y-2">
                      {courseData.syllabus.year4.semester8.map((subject, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Colleges Section */}
            <div id="colleges" className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Top {courseData.shortName} Colleges In India</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">Rank</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">College Name</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">Location</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">Total Fees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.topColleges.map((college, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-sm font-semibold text-orange-600">{college.rank}</td>
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

            {/* Career & Jobs Section */}
            <div id="career" className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. {courseData.shortName}: Career Options & Jobs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseData.careerOptions.map((career, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-2">
                      <FiBriefcase className="text-orange-600 mt-1" size={20} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{career.title}</h3>
                        <p className="text-sm text-green-600 font-medium mt-1">{career.salary}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">{career.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Section */}
            <div id="faqs" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. {courseData.shortName}: Frequently Asked Questions</h2>
              <div className="space-y-3">
                {courseData.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      {expandedFaq === idx ? (
                        <FiChevronUp className="text-gray-600 flex-shrink-0" size={20} />
                      ) : (
                        <FiChevronDown className="text-gray-600 flex-shrink-0" size={20} />
                      )}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-4 pb-4 text-gray-700 text-sm border-t border-gray-200 pt-3 bg-gray-50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors">
                  Apply Now
                </button>
                <button className="w-full px-4 py-2.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors">
                  Download Brochure
                </button>
                <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors">
                  Compare Courses
                </button>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold text-sm mb-4 text-gray-800">Course Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <FiClock size={18} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Duration</div>
                      <div className="text-gray-600">{courseData.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiDollarSign size={18} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Course Fees</div>
                      <div className="text-gray-600">{courseData.averageFee}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiBriefcase size={18} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Average Salary</div>
                      <div className="text-gray-600">{courseData.averageSalary}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiAward size={18} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Level</div>
                      <div className="text-gray-600">{courseData.level}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold text-sm mb-3 text-gray-800">Related Courses</h3>
                <div className="space-y-2 text-sm">
                  <Link to="/courses/detail/btech-it" className="block text-blue-600 hover:underline">B.Tech Information Technology</Link>
                  <Link to="/courses/detail/bca" className="block text-blue-600 hover:underline">BCA - Computer Applications</Link>
                  <Link to="/courses/detail/mtech-cse" className="block text-blue-600 hover:underline">M.Tech Computer Science</Link>
                  <Link to="/courses/detail/btech-ai" className="block text-blue-600 hover:underline">B.Tech Artificial Intelligence</Link>
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
