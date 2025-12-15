import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiDownload, FiCalendar, FiFileText, FiInfo, FiBook, FiAward, FiCheckCircle } from 'react-icons/fi';
import { Button } from '../components/ui/button';

const ExamSubPages = () => {
  const { id, section } = useParams();
  const navigate = useNavigate();

  // Mock exam data
  const examData = {
    'jee-main': {
      name: 'JEE Main',
      fullName: 'Joint Entrance Examination Main'
    },
    'neet': {
      name: 'NEET',
      fullName: 'National Eligibility cum Entrance Test'
    }
  };

  const exam = examData[id] || examData['jee-main'];
  const activeSection = section || 'question-paper';

  const renderContent = () => {
    switch (activeSection) {
      case 'admit-card':
        return <AdmitCardContent exam={exam} />;
      case 'answer-key':
        return <AnswerKeyContent exam={exam} />;
      case 'result':
        return <ResultContent exam={exam} />;
      case 'cutoff':
        return <CutoffContent exam={exam} />;
      case 'syllabus':
        return <SyllabusContent exam={exam} />;
      case 'exam-pattern':
        return <ExamPatternContent exam={exam} />;
      case 'application-form':
        return <ApplicationFormContent exam={exam} />;
      case 'counseling':
        return <CounselingContent exam={exam} />;
      default:
        return <QuestionPaperContent exam={exam} />;
    }
  };

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
            <Link to={`/exams/${id}`} className="hover:text-orange-600 transition-colors">{exam.name}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium capitalize">{activeSection.replace('-', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold">{exam.name} {activeSection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>
          <p className="text-lg mt-2">Complete information about {exam.name} {activeSection.replace('-', ' ')}</p>
        </div>
      </div>

      {/* Exam Menu */}
      <div className="bg-white border-b shadow-sm sticky top-16 z-30">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 overflow-x-auto py-3">
            <Link
              to={`/exams/${id}/question-paper`}
              className={`text-sm font-medium pb-3 whitespace-nowrap transition-colors ${
                activeSection === 'question-paper' ? 'text-orange-600 border-b-2 border-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Question Paper
            </Link>
            <Link
              to={`/exams/${id}/admit-card`}
              className={`text-sm font-medium pb-3 whitespace-nowrap transition-colors ${
                activeSection === 'admit-card' ? 'text-orange-600 border-b-2 border-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Admit Card
            </Link>
            <Link
              to={`/exams/${id}/answer-key`}
              className={`text-sm font-medium pb-3 whitespace-nowrap transition-colors ${
                activeSection === 'answer-key' ? 'text-orange-600 border-b-2 border-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Answer Key
            </Link>
            <Link
              to={`/exams/${id}/result`}
              className={`text-sm font-medium pb-3 whitespace-nowrap transition-colors ${
                activeSection === 'result' ? 'text-orange-600 border-b-2 border-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Result
            </Link>
            <Link
              to={`/exams/${id}/cutoff`}
              className={`text-sm font-medium pb-3 whitespace-nowrap transition-colors ${
                activeSection === 'cutoff' ? 'text-orange-600 border-b-2 border-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Cut Off
            </Link>
            <Link
              to={`/exams/${id}/syllabus`}
              className={`text-sm font-medium pb-3 whitespace-nowrap transition-colors ${
                activeSection === 'syllabus' ? 'text-orange-600 border-b-2 border-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Syllabus
            </Link>
            <Link
              to={`/exams/${id}/exam-pattern`}
              className={`text-sm font-medium pb-3 whitespace-nowrap transition-colors ${
                activeSection === 'exam-pattern' ? 'text-orange-600 border-b-2 border-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Exam Pattern
            </Link>
            <Link
              to={`/exams/${id}/application-form`}
              className={`text-sm font-medium pb-3 whitespace-nowrap transition-colors ${
                activeSection === 'application-form' ? 'text-orange-600 border-b-2 border-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Application Form
            </Link>
            <Link
              to={`/exams/${id}/counseling`}
              className={`text-sm font-medium pb-3 whitespace-nowrap transition-colors ${
                activeSection === 'counseling' ? 'text-orange-600 border-b-2 border-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Counseling
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

// Admit Card Component
const AdmitCardContent = ({ exam }) => (
  <div className="max-w-5xl mx-auto space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FiFileText className="text-orange-600" />
        {exam.name} Admit Card 2025
      </h2>
      <p className="text-gray-700 mb-6">
        The {exam.name} admit card is a crucial document that candidates must carry to the examination center. 
        It contains important details such as candidate name, roll number, exam center, date, and timing.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h3 className="font-bold text-blue-900 mb-2">Important Dates</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex justify-between">
            <span>Admit Card Release Date:</span>
            <span className="font-semibold">March 15, 2025</span>
          </li>
          <li className="flex justify-between">
            <span>Exam Date:</span>
            <span className="font-semibold">April 2-10, 2025</span>
          </li>
        </ul>
      </div>

      <Button className="bg-orange-500 hover:bg-orange-600 text-white mb-6">
        <FiDownload className="mr-2" />
        Download {exam.name} Admit Card 2025
      </Button>

      <div className="border-t pt-6">
        <h3 className="font-bold text-lg mb-3">How to Download Admit Card?</h3>
        <ol className="space-y-3 text-gray-700">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <span>Visit the official website</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <span>Click on "{exam.name} Admit Card" link</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <span>Enter your Application Number and Date of Birth</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <span>Click on Submit and download your admit card</span>
          </li>
        </ol>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-4">Details on Admit Card</h3>
      <div className="grid grid-cols-2 gap-4">
        {['Candidate Name', 'Roll Number', 'Exam Center Details', 'Exam Date & Time', 'Category', 'Photograph', 'Signature', 'Important Instructions'].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <FiCheckCircle className="text-green-500" size={18} />
            <span className="text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Answer Key Component
const AnswerKeyContent = ({ exam }) => (
  <div className="max-w-5xl mx-auto space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FiFileText className="text-orange-600" />
        {exam.name} Answer Key 2025
      </h2>
      <p className="text-gray-700 mb-6">
        The official answer key for {exam.name} will be released after the exam. Candidates can download it and 
        calculate their expected scores. Objections can also be raised against the answer key if any discrepancies are found.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-3 text-left font-bold">Session</th>
              <th className="border px-4 py-3 text-left font-bold">Release Date</th>
              <th className="border px-4 py-3 text-center font-bold">Download Link</th>
            </tr>
          </thead>
          <tbody>
            {['Session 1 - April 2', 'Session 2 - April 4', 'Session 3 - April 6'].map((session, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-3">{session}</td>
                <td className="border px-4 py-3">April {10 + idx * 2}, 2025</td>
                <td className="border px-4 py-3 text-center">
                  <Link to="#" className="text-blue-600 hover:text-orange-600 font-medium inline-flex items-center gap-1">
                    <FiDownload size={16} />
                    Download
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <h3 className="font-bold text-yellow-900 mb-2">How to Challenge Answer Key?</h3>
        <p className="text-sm text-yellow-800">
          Candidates can raise objections against the answer key within the specified time period by paying a processing fee.
          Each challenge requires supporting documents and valid reasoning.
        </p>
      </div>
    </div>
  </div>
);

// Result Component
const ResultContent = ({ exam }) => (
  <div className="max-w-5xl mx-auto space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FiAward className="text-orange-600" />
        {exam.name} Result 2025
      </h2>
      <p className="text-gray-700 mb-6">
        The {exam.name} result will be announced on the official website. Candidates can check their scores, ranks, and percentiles online.
      </p>

      <Button className="bg-orange-500 hover:bg-orange-600 text-white mb-6">
        <FiCheckCircle className="mr-2" />
        Check {exam.name} Result 2025
      </Button>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Result Statistics 2024</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">12.5L+</p>
            <p className="text-sm text-gray-600 mt-1">Total Candidates</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">99.9%</p>
            <p className="text-sm text-gray-600 mt-1">Top Percentile</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">300</p>
            <p className="text-sm text-gray-600 mt-1">Perfect Score</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-bold text-lg mb-3">How to Check Result?</h3>
        <ol className="space-y-3 text-gray-700">
          {['Visit official website', 'Click on Result link', 'Enter Roll Number and Date of Birth', 'View and download your scorecard'].map((step, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </div>
);

// Cutoff Component
const CutoffContent = ({ exam }) => (
  <div className="max-w-5xl mx-auto space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{exam.name} Cut Off 2025</h2>
      <p className="text-gray-700 mb-6">
        The cutoff marks vary based on category, number of candidates, difficulty level, and number of seats available.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-orange-100">
            <tr>
              <th className="border px-4 py-3 text-left font-bold">Category</th>
              <th className="border px-4 py-3 text-center font-bold">2024</th>
              <th className="border px-4 py-3 text-center font-bold">2023</th>
              <th className="border px-4 py-3 text-center font-bold">2022</th>
            </tr>
          </thead>
          <tbody>
            {[
              { category: 'General', 2024: '88', 2023: '90', 2022: '88' },
              { category: 'EWS', 2024: '66', 2023: '68', 2022: '66' },
              { category: 'OBC-NCL', 2024: '66', 2023: '68', 2022: '66' },
              { category: 'SC', 2024: '44', 2023: '45', 2022: '44' },
              { category: 'ST', 2024: '39', 2023: '40', 2022: '39' }
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-3 font-medium">{row.category}</td>
                <td className="border px-4 py-3 text-center">{row[2024]}</td>
                <td className="border px-4 py-3 text-center">{row[2023]}</td>
                <td className="border px-4 py-3 text-center">{row[2022]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Syllabus Component  
const SyllabusContent = ({ exam }) => (
  <div className="max-w-5xl mx-auto space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FiBook className="text-orange-600" />
        {exam.name} Syllabus 2025
      </h2>
      <p className="text-gray-700 mb-6">
        Complete syllabus with topic-wise weightage and important chapters for {exam.name} preparation.
      </p>

      <div className="space-y-4">
        {['Physics', 'Chemistry', 'Mathematics'].map((subject, idx) => (
          <div key={idx} className="border rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3">
              <h3 className="font-bold">{subject}</h3>
            </div>
            <div className="p-4">
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                {subject === 'Physics' && ['Mechanics', 'Thermodynamics', 'Electrostatics', 'Optics', 'Modern Physics', 'SHM & Waves'].map((topic, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" size={16} />
                    {topic}
                  </li>
                ))}
                {subject === 'Chemistry' && ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Atomic Structure', 'Chemical Bonding', 'Equilibrium'].map((topic, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" size={16} />
                    {topic}
                  </li>
                ))}
                {subject === 'Mathematics' && ['Algebra', 'Calculus', 'Trigonometry', 'Coordinate Geometry', 'Vectors', 'Statistics'].map((topic, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" size={16} />
                    {topic}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-4 border-blue-500 text-blue-600 hover:bg-blue-50 text-sm">
                Download {subject} Syllabus PDF
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Exam Pattern Component
const ExamPatternContent = ({ exam }) => (
  <div className="max-w-5xl mx-auto space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{exam.name} Exam Pattern 2025</h2>
      <div className="grid grid-cols-2 gap-6 mb-6">
        {[
          { label: 'Exam Mode', value: 'Computer Based Test (CBT)' },
          { label: 'Duration', value: '3 Hours' },
          { label: 'Total Questions', value: '90 Questions' },
          { label: 'Total Marks', value: '300 Marks' },
          { label: 'Marking Scheme', value: '+4 for correct, -1 for incorrect' },
          { label: 'Language', value: 'English, Hindi & 11 regional languages' }
        ].map((item, idx) => (
          <div key={idx} className="border-l-4 border-orange-500 pl-4">
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <tr>
              <th className="border border-orange-400 px-4 py-3 text-left">Subject</th>
              <th className="border border-orange-400 px-4 py-3 text-center">Questions</th>
              <th className="border border-orange-400 px-4 py-3 text-center">Marks</th>
            </tr>
          </thead>
          <tbody>
            {[
              { subject: 'Physics', questions: '30', marks: '120' },
              { subject: 'Chemistry', questions: '30', marks: '120' },
              { subject: 'Mathematics', questions: '30', marks: '120' }
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-3 font-medium">{row.subject}</td>
                <td className="border px-4 py-3 text-center">{row.questions}</td>
                <td className="border px-4 py-3 text-center">{row.marks}</td>
              </tr>
            ))}
            <tr className="bg-orange-50 font-bold">
              <td className="border px-4 py-3">Total</td>
              <td className="border px-4 py-3 text-center">90</td>
              <td className="border px-4 py-3 text-center">300</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Application Form Component
const ApplicationFormContent = ({ exam }) => (
  <div className="max-w-5xl mx-auto space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{exam.name} Application Form 2025</h2>
      <p className="text-gray-700 mb-6">
        Apply online for {exam.name} 2025. Fill the application form carefully and submit before the deadline.
      </p>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <h3 className="font-bold text-red-900 mb-2">Important Dates</h3>
        <ul className="space-y-2 text-sm text-red-800">
          <li className="flex justify-between">
            <span>Application Start Date:</span>
            <span className="font-semibold">February 1, 2025</span>
          </li>
          <li className="flex justify-between">
            <span>Application End Date:</span>
            <span className="font-semibold">March 10, 2025</span>
          </li>
          <li className="flex justify-between">
            <span>Last Date with Late Fee:</span>
            <span className="font-semibold">March 15, 2025</span>
          </li>
        </ul>
      </div>

      <Button className="bg-orange-500 hover:bg-orange-600 text-white mb-6">
        Apply Now for {exam.name} 2025
      </Button>

      <div className="border-t pt-6">
        <h3 className="font-bold text-lg mb-3">Application Process</h3>
        <ol className="space-y-3 text-gray-700">
          {[
            'Register on the official website',
            'Fill in personal and academic details',
            'Upload required documents (Photo, Signature)',
            'Pay application fee online',
            'Submit form and take printout'
          ].map((step, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-bold mb-3">Application Fee</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-600">General/OBC:</span> <span className="font-semibold">₹1000</span></div>
          <div><span className="text-gray-600">SC/ST/PWD:</span> <span className="font-semibold">₹500</span></div>
        </div>
      </div>
    </div>
  </div>
);

// Counseling Component
const CounselingContent = ({ exam }) => (
  <div className="max-w-5xl mx-auto space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{exam.name} Counseling 2025</h2>
      <p className="text-gray-700 mb-6">
        After the results are declared, qualified candidates can participate in the counseling process for admission to various colleges.
      </p>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <h3 className="font-bold text-green-900 mb-2">Counseling Schedule</h3>
        <ul className="space-y-2 text-sm text-green-800">
          <li className="flex justify-between">
            <span>Registration Start:</span>
            <span className="font-semibold">June 15, 2025</span>
          </li>
          <li className="flex justify-between">
            <span>Choice Filling:</span>
            <span className="font-semibold">June 20-25, 2025</span>
          </li>
          <li className="flex justify-between">
            <span>Seat Allotment:</span>
            <span className="font-semibold">June 30, 2025</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-3">Counseling Process</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            {[
              'Register for counseling on official website',
              'Fill and lock choices of colleges/courses',
              'Seat allotment based on rank and choices',
              'Pay seat acceptance fee and freeze allocation',
              'Report to allotted college with documents'
            ].map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="font-bold text-orange-600">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-3">Required Documents</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {['10th Marksheet', '12th Marksheet', 'Rank Card', 'Admit Card', 'Category Certificate', 'ID Proof', 'Photographs', 'Domicile Certificate'].map((doc, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <FiCheckCircle className="text-green-500" size={16} />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button className="bg-orange-500 hover:bg-orange-600 text-white mt-4">
        Register for Counseling
      </Button>
    </div>
  </div>
);

// Question Paper Component (redirects to ExamDetailPage)
const QuestionPaperContent = ({ exam }) => (
  <div className="max-w-5xl mx-auto">
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
      <p className="text-blue-800">Redirecting to Question Paper page...</p>
    </div>
  </div>
);

export default ExamSubPages;
