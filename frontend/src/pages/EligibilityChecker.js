import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiAward, FiUsers, FiCalendar, FiMapPin, FiTarget, FiBookOpen, FiTrendingUp, FiX, FiCheckCircle, FiStar } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';
import api from '../api/axios';

import { Link } from '../components/CustomLink';
const EligibilityChecker = () => {
  const [searchParams] = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [showPredictorModal, setShowPredictorModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [predictorData, setPredictorData] = useState({
    rank: '',
    marks: '',
    percentile: '',
    category: 'General',
    homeState: '',
    preferences: []
  });
  const [predictedColleges, setPredictedColleges] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const examPredictors = [
    {
      id: 1,
      name: 'JEE Main 2026',
      colleges: 1698,
      examDate: '21 Jan 2026',
      level: 'National',
      category: 'Engineering',
      icon: '🎓',
      inputType: 'rank', // rank, marks, percentile
      maxValue: 250000,
      links: {
        examInfo: '/exams/jee-main',
        cutoff: '/exams/jee-main/cutoff',
        practice: '/exams/jee-main/practice'
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
      inputType: 'marks',
      maxValue: 720,
      links: {
        examInfo: '/exams/neet',
        cutoff: '/exams/neet/cutoff',
        practice: '/exams/neet/practice'
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
      inputType: 'percentile',
      maxValue: 100,
      links: {
        examInfo: '/exams/cat',
        cutoff: '/exams/cat/cutoff',
        practice: '/exams/cat/practice'
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
      inputType: 'marks',
      maxValue: 800,
      links: {
        examInfo: '/exams/cuet',
        cutoff: '/exams/cuet/cutoff',
        practice: '/exams/cuet/practice'
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
      inputType: 'rank',
      maxValue: 20000,
      links: {
        examInfo: '/exams/jee-advanced',
        cutoff: '/exams/jee-advanced/cutoff',
        practice: '/exams/jee-advanced/practice'
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
      inputType: 'marks',
      maxValue: 100,
      links: {
        examInfo: '/exams/gate',
        cutoff: '/exams/gate/cutoff',
        practice: '/exams/gate/practice'
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
      inputType: 'marks',
      maxValue: 150,
      links: {
        examInfo: '/exams/clat',
        cutoff: '/exams/clat/cutoff',
        practice: '/exams/clat/practice'
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
      inputType: 'percentile',
      maxValue: 100,
      links: {
        examInfo: '/exams/mht-cet',
        cutoff: '/exams/mht-cet/cutoff',
        practice: '/exams/mht-cet/practice'
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
      inputType: 'marks',
      maxValue: 450,
      links: {
        examInfo: '/exams/bitsat',
        cutoff: '/exams/bitsat/cutoff',
        practice: '/exams/bitsat/practice'
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
      inputType: 'rank',
      maxValue: 50000,
      links: {
        examInfo: '/exams/viteee',
        cutoff: '/exams/viteee/cutoff',
        practice: '/exams/viteee/practice'
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
      inputType: 'marks',
      maxValue: 360,
      links: {
        examInfo: '/exams/nmat',
        cutoff: '/exams/nmat/cutoff',
        practice: '/exams/nmat/practice'
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
      inputType: 'rank',
      maxValue: 100000,
      links: {
        examInfo: '/exams/wbjee',
        cutoff: '/exams/wbjee/cutoff',
        practice: '/exams/wbjee/practice'
      }
    }
  ];

  const courses = ['All', 'Engineering', 'Medical', 'Management', 'University', 'Law'];
  const states = ['All', 'National', 'Maharashtra', 'West Bengal', 'Delhi NCR'];

  useEffect(() => {
    const exam = searchParams.get('exam');
    if (exam) {
      const examData = examPredictors.find(e => e.name.toLowerCase().includes(exam.toLowerCase()));
      if (examData) {
        handlePredictClick(examData);
      }
    }
  }, [searchParams]);

  const filteredExams = examPredictors.filter(exam => {
    const courseMatch = selectedCourse === 'all' || exam.category.toLowerCase() === selectedCourse.toLowerCase();
    const stateMatch = selectedState === 'all' || exam.level.toLowerCase() === selectedState.toLowerCase();
    return courseMatch && stateMatch;
  });

  const handlePredictClick = (exam) => {
    setSelectedExam(exam);
    setShowPredictorModal(true);
    setShowResults(false);
    setPredictedColleges([]);
    setPredictorData({
      rank: '',
      marks: '',
      percentile: '',
      category: 'General',
      homeState: exam.level !== 'National' ? exam.level : '',
      preferences: []
    });
  };

  const handlePredictorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call to get predicted colleges
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock college predictions based on input
      const mockColleges = generateMockColleges(selectedExam, predictorData);
      setPredictedColleges(mockColleges);
      setShowResults(true);
    } catch (error) {
      console.error('Error predicting colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockColleges = (exam, data) => {
    // Generate mock colleges based on exam type and scores
    const inputValue = data.rank || data.marks || data.percentile;
    const numericValue = parseFloat(inputValue);

    const colleges = [
      { id: 1, name: 'Indian Institute of Technology Delhi', location: 'New Delhi', type: 'IIT', rating: 4.5, fees: 200000, placement: '18 LPA' },
      { id: 2, name: 'Indian Institute of Technology Bombay', location: 'Mumbai', type: 'IIT', rating: 4.6, fees: 210000, placement: '20 LPA' },
      { id: 3, name: 'National Institute of Technology Trichy', location: 'Tiruchirappalli', type: 'NIT', rating: 4.3, fees: 150000, placement: '12 LPA' },
      { id: 4, name: 'Delhi Technological University', location: 'Delhi', type: 'State', rating: 4.2, fees: 120000, placement: '10 LPA' },
      { id: 5, name: 'Birla Institute of Technology and Science', location: 'Pilani', type: 'Private', rating: 4.4, fees: 400000, placement: '15 LPA' },
      { id: 6, name: 'Vellore Institute of Technology', location: 'Vellore', type: 'Private', rating: 4.1, fees: 180000, placement: '8 LPA' },
      { id: 7, name: 'SRM Institute of Science and Technology', location: 'Chennai', type: 'Private', rating: 4.0, fees: 250000, placement: '7 LPA' },
      { id: 8, name: 'Manipal Institute of Technology', location: 'Manipal', type: 'Private', rating: 4.0, fees: 300000, placement: '9 LPA' },
    ];

    // Filter based on performance (better scores = more colleges)
    const eligibleCount = exam.inputType === 'rank' 
      ? Math.min(8, Math.floor((exam.maxValue - numericValue) / exam.maxValue * 8) + 1)
      : Math.min(8, Math.floor(numericValue / exam.maxValue * 8));

    return colleges.slice(0, Math.max(3, eligibleCount));
  };

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
                  <button 
                    onClick={() => handlePredictClick(exam)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white h-7 text-xs rounded transition"
                  >
                    Predict Now
                  </button>
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
                Select your exam from the list and click "Predict Now"
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiTarget className="text-purple-600 text-xl" />
              </div>
              <h3 className="font-bold text-sm mb-2">Step 2: Enter Your Score</h3>
              <p className="text-xs text-gray-600">
                Enter your rank, marks or percentile and other details
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiTrendingUp className="text-green-600 text-xl" />
              </div>
              <h3 className="font-bold text-sm mb-2">Step 3: Get Predictions</h3>
              <p className="text-xs text-gray-600">
                View list of colleges you can get admission to
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Predictor Modal */}
      {showPredictorModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>{selectedExam.icon}</span>
                  {selectedExam.name} College Predictor
                </h2>
                <p className="text-xs text-gray-600 mt-1">Enter your details to predict colleges</p>
              </div>
              <button
                onClick={() => setShowPredictorModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {!showResults ? (
                <form onSubmit={handlePredictorSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dynamic Input based on exam type */}
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        {selectedExam.inputType === 'rank' && 'Your Expected Rank *'}
                        {selectedExam.inputType === 'marks' && 'Your Expected Marks *'}
                        {selectedExam.inputType === 'percentile' && 'Your Expected Percentile *'}
                      </label>
                      <Input
                        type="number"
                        value={
                          selectedExam.inputType === 'rank' ? predictorData.rank :
                          selectedExam.inputType === 'marks' ? predictorData.marks :
                          predictorData.percentile
                        }
                        onChange={(e) => setPredictorData({
                          ...predictorData,
                          [selectedExam.inputType]: e.target.value
                        })}
                        placeholder={`Enter your ${selectedExam.inputType}`}
                        max={selectedExam.maxValue}
                        required
                        className="h-8 text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Max: {selectedExam.maxValue}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Category *</label>
                      <select
                        value={predictorData.category}
                        onChange={(e) => setPredictorData({...predictorData, category: e.target.value})}
                        className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                      </select>
                    </div>

                    {selectedExam.level !== 'National' && (
                      <div>
                        <label className="block text-xs font-medium mb-1">Home State</label>
                        <Input
                          type="text"
                          value={predictorData.homeState}
                          onChange={(e) => setPredictorData({...predictorData, homeState: e.target.value})}
                          placeholder="Enter your home state"
                          className="h-8 text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> This is a college prediction tool based on previous year cutoffs. 
                      Actual admission depends on various factors including seat availability and counseling rounds.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 h-9 text-sm"
                    >
                      {loading ? 'Predicting...' : 'Predict Colleges'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPredictorModal(false)}
                      className="flex-1 h-9 text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  {/* Results Header */}
                  <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCheckCircle className="text-green-600 text-xl" />
                      <h3 className="font-bold text-base">Prediction Results</h3>
                    </div>
                    <p className="text-xs text-gray-700">
                      Based on your {selectedExam.inputType}: <strong>
                        {predictorData.rank || predictorData.marks || predictorData.percentile}
                      </strong> and category: <strong>{predictorData.category}</strong>
                    </p>
                  </div>

                  {/* Predicted Colleges */}
                  <h4 className="font-bold text-sm mb-3">
                    {predictedColleges.length} Colleges You Can Get
                  </h4>
                  <div className="space-y-3">
                    {predictedColleges.map((college, index) => (
                      <div key={college.id} className="border rounded-lg p-3 hover:shadow-md transition">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">
                                #{index + 1}
                              </span>
                              <h5 className="font-bold text-sm">{college.name}</h5>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <FiMapPin className="text-xs" /> {college.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiStar className="text-yellow-500 text-xs" /> {college.rating}
                              </span>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {college.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Annual Fees:</span>
                            <span className="font-semibold ml-1">₹{(college.fees/100000).toFixed(1)}L</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Placement:</span>
                            <span className="font-semibold ml-1">{college.placement}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => {
                        setShowResults(false);
                        setPredictorData({
                          rank: '',
                          marks: '',
                          percentile: '',
                          category: 'General',
                          homeState: selectedExam.level !== 'National' ? selectedExam.level : '',
                          preferences: []
                        });
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 h-9 text-sm"
                    >
                      Predict Again
                    </Button>
                    <Button
                      onClick={() => setShowPredictorModal(false)}
                      variant="outline"
                      className="flex-1 h-9 text-sm"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;
