import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiUsers, FiCalendar, FiMapPin, FiTarget, FiBookOpen, FiTrendingUp } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import MetaTags from '../components/SEO/MetaTags';

const EligibilityChecker = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

  const examPredictors = [
    {
      id: 1,
      name: 'JEE Main 2026',
      colleges: 1698,
      examDate: '21 Jan 2026',
      level: 'National',
      category: 'Engineering',
      icon: '🎓',
      links: {
        examInfo: '/exams/jee-main',
        cutoff: '/exams/jee-main/cutoff',
        practice: '/exams/jee-main/practice',
        predict: '/eligibility-checker?exam=jee-main'
      }
    },
    {
      id: 2,
      name: 'NEET 2025',
      colleges: 1175,
      examDate: '3 May 2025',
      level: 'National',
      category: 'Medical',
      icon: '⚕️',
      links: {
        examInfo: '/exams/neet',
        cutoff: '/exams/neet/cutoff',
        practice: '/exams/neet/practice',
        predict: '/eligibility-checker?exam=neet'
      }
    },
    {
      id: 3,
      name: 'CAT 2025',
      colleges: 1446,
      examDate: '29 Nov 2025',
      level: 'National',
      category: 'Management',
      icon: '💼',
      links: {
        examInfo: '/exams/cat',
        cutoff: '/exams/cat/cutoff',
        practice: '/exams/cat/practice',
        predict: '/eligibility-checker?exam=cat'
      }
    },
    {
      id: 4,
      name: 'CUET 2025',
      colleges: 298,
      examDate: '12 May 2025',
      level: 'National',
      category: 'University',
      icon: '🏛️',
      links: {
        examInfo: '/exams/cuet',
        cutoff: '/exams/cuet/cutoff',
        practice: '/exams/cuet/practice',
        predict: '/eligibility-checker?exam=cuet'
      }
    },
    {
      id: 5,
      name: 'JEE Advanced 2025',
      colleges: 69,
      examDate: '17 May 2025',
      level: 'National',
      category: 'Engineering',
      icon: '🎓',
      links: {
        examInfo: '/exams/jee-advanced',
        cutoff: '/exams/jee-advanced/cutoff',
        practice: '/exams/jee-advanced/practice',
        predict: '/eligibility-checker?exam=jee-advanced'
      }
    },
    {
      id: 6,
      name: 'GATE 2026',
      colleges: 110,
      examDate: '7 Feb 2026',
      level: 'National',
      category: 'Engineering',
      icon: '🎓',
      links: {
        examInfo: '/exams/gate',
        cutoff: '/exams/gate/cutoff',
        practice: '/exams/gate/practice',
        predict: '/eligibility-checker?exam=gate'
      }
    },
    {
      id: 7,
      name: 'CLAT 2025',
      colleges: 98,
      examDate: '6 Dec 2025',
      level: 'National',
      category: 'Law',
      icon: '⚖️',
      links: {
        examInfo: '/exams/clat',
        cutoff: '/exams/clat/cutoff',
        practice: '/exams/clat/practice',
        predict: '/eligibility-checker?exam=clat'
      }
    },
    {
      id: 8,
      name: 'MHT CET 2025',
      colleges: 604,
      examDate: '8 Apr 2025',
      level: 'Maharashtra',
      category: 'Engineering',
      icon: '🎓',
      links: {
        examInfo: '/exams/mht-cet',
        cutoff: '/exams/mht-cet/cutoff',
        practice: '/exams/mht-cet/practice',
        predict: '/eligibility-checker?exam=mht-cet'
      }
    },
    {
      id: 9,
      name: 'BITSAT 2025',
      colleges: 3,
      examDate: '25 May 2025',
      level: 'National',
      category: 'Engineering',
      icon: '🎓',
      links: {
        examInfo: '/exams/bitsat',
        cutoff: '/exams/bitsat/cutoff',
        practice: '/exams/bitsat/practice',
        predict: '/eligibility-checker?exam=bitsat'
      }
    },
    {
      id: 10,
      name: 'VITEEE 2025',
      colleges: 5,
      examDate: '19 Apr 2025',
      level: 'National',
      category: 'Engineering',
      icon: '🎓',
      links: {
        examInfo: '/exams/viteee',
        cutoff: '/exams/viteee/cutoff',
        practice: '/exams/viteee/practice',
        predict: '/eligibility-checker?exam=viteee'
      }
    },
    {
      id: 11,
      name: 'NMAT 2025',
      colleges: 110,
      examDate: '4 Nov 2025',
      level: 'National',
      category: 'Management',
      icon: '💼',
      links: {
        examInfo: '/exams/nmat',
        cutoff: '/exams/nmat/cutoff',
        practice: '/exams/nmat/practice',
        predict: '/eligibility-checker?exam=nmat'
      }
    },
    {
      id: 12,
      name: 'WBJEE 2025',
      colleges: 121,
      examDate: '26 Apr 2025',
      level: 'West Bengal',
      category: 'Engineering',
      icon: '🎓',
      links: {
        examInfo: '/exams/wbjee',
        cutoff: '/exams/wbjee/cutoff',
        practice: '/exams/wbjee/practice',
        predict: '/eligibility-checker?exam=wbjee'
      }
    }
  ];

  const courses = ['All', 'Engineering', 'Medical', 'Management', 'University', 'Law'];
  const states = ['All', 'National', 'Maharashtra', 'West Bengal', 'Delhi NCR'];

  const filteredExams = examPredictors.filter(exam => {
    const courseMatch = selectedCourse === 'all' || exam.category.toLowerCase() === selectedCourse.toLowerCase();
    const stateMatch = selectedState === 'all' || exam.level.toLowerCase() === selectedState.toLowerCase();
    return courseMatch && stateMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title="College Predictor 2026 - Find Best Colleges | AdmissionBuddy"
        description="Find colleges based on your exam scores. College predictor for JEE Main, NEET, CAT, CUET and other exams."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
            College Predictor 2026
          </h1>
          <p className="text-sm md:text-base text-center text-purple-100 mb-4">
            For JEE Main, NEET, CUET and other top Universities and Exams
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Course:</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-white"
              >
                {courses.map((course) => (
                  <option key={course} value={course.toLowerCase()}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">State:</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-white"
              >
                {states.map((state) => (
                  <option key={state} value={state.toLowerCase()}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Top Exams Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiAward className="text-orange-600" />
            Top Exam Predictors
          </h2>

          {/* Exam Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
              >
                {/* Exam Icon */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">{exam.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      {exam.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="flex items-center gap-1 text-gray-600">
                        <FiUsers className="text-sm" />
                        {exam.colleges} Colleges
                      </span>
                      {exam.examDate && (
                        <span className="flex items-center gap-1 text-gray-600">
                          <FiCalendar className="text-sm" />
                          {exam.examDate}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-gray-600">
                        <FiMapPin className="text-sm" />
                        {exam.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Links */}
                <div className="grid grid-cols-2 gap-2">
                  <Link to={exam.links.examInfo}>
                    <button className="w-full px-2 py-1.5 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition">
                      Exam Info
                    </button>
                  </Link>
                  <Link to={exam.links.cutoff}>
                    <button className="w-full px-2 py-1.5 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition">
                      Cutoff
                    </button>
                  </Link>
                  <Link to={exam.links.practice}>
                    <button className="w-full px-2 py-1.5 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition">
                      Practice Tests
                    </button>
                  </Link>
                  <Link to={exam.links.predict}>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 h-7 text-xs">
                      Predict Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-sm text-gray-600">No exams found for the selected filters</p>
            </div>
          )}
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-4 text-center">
            How to use College Predictor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiBookOpen className="text-orange-600 text-xl" />
              </div>
              <h3 className="font-bold text-sm mb-2">Step 1: Choose Your Exam</h3>
              <p className="text-xs text-gray-600">
                Select your exam from the list above
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiTarget className="text-purple-600 text-xl" />
              </div>
              <h3 className="font-bold text-sm mb-2">Step 2: Provide Your Details</h3>
              <p className="text-xs text-gray-600">
                Enter your expected marks and preferences
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiTrendingUp className="text-green-600 text-xl" />
              </div>
              <h3 className="font-bold text-sm mb-2">Step 3: Predict Your Rank</h3>
              <p className="text-xs text-gray-600">
                Get your rank and list of colleges you can get
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EligibilityChecker;
