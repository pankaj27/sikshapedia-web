import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiFileText } from 'react-icons/fi';

const TopExams = () => {
  const exams = [
    {
      name: 'JEE Main',
      fullName: 'Joint Entrance Examination Main',
      level: 'UG',
      applicants: '12 Lakh+',
      date: 'Jan & April 2024',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      name: 'NEET',
      fullName: 'National Eligibility cum Entrance Test',
      level: 'UG',
      applicants: '18 Lakh+',
      date: 'May 2024',
      color: 'bg-red-50 border-red-200'
    },
    {
      name: 'CAT',
      fullName: 'Common Admission Test',
      level: 'PG',
      applicants: '2.5 Lakh+',
      date: 'Nov 2024',
      color: 'bg-green-50 border-green-200'
    },
    {
      name: 'GATE',
      fullName: 'Graduate Aptitude Test in Engineering',
      level: 'PG',
      applicants: '9 Lakh+',
      date: 'Feb 2024',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      name: 'CUET',
      fullName: 'Common University Entrance Test',
      level: 'UG',
      applicants: '15 Lakh+',
      date: 'May 2024',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      name: 'JEE Advanced',
      fullName: 'Joint Entrance Examination Advanced',
      level: 'UG',
      applicants: '2 Lakh+',
      date: 'May 2024',
      color: 'bg-indigo-50 border-indigo-200'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Top Entrance Exams 2024
            </h2>
            <p className="text-lg text-gray-600">
              Prepare for the most popular entrance exams in India
            </p>
          </div>
          <Link
            to="/exams"
            className="hidden md:block text-orange-600 hover:text-orange-700 font-semibold"
          >
            View All Exams →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, idx) => (
            <Link
              key={idx}
              to="/exams"
              className={`${exam.color} border-2 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{exam.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{exam.fullName}</p>
                </div>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                  {exam.level}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <FiUsers className="text-orange-600" />
                  <span>{exam.applicants} Applicants</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-orange-600" />
                  <span>{exam.date}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-300">
                <span className="text-orange-600 font-semibold text-sm flex items-center gap-2">
                  <FiFileText />
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link
            to="/exams"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            View All Exams →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopExams;