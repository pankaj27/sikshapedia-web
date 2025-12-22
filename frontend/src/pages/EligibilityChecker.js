import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiAward, FiUsers, FiCalendar, FiMapPin, FiTarget, FiBookOpen, FiTrendingUp, FiX, FiCheckCircle, FiStar, FiLoader } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';
import api from '../api/axios';
import { Link } from '../components/CustomLink';

const EligibilityChecker = () => {
  const [searchParams] = useSearchParams();
  
  // Exam list state
  const [exams, setExams] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [examLevels, setExamLevels] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  
  // Filter state
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  
  // Predictor modal state
  const [showPredictorModal, setShowPredictorModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [predictorData, setPredictorData] = useState({
    rank: '',
    marks: '',
    percentile: '',
    category: 'General',
    homeState: '',
  });
  
  // Results state
  const [predictedColleges, setPredictedColleges] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch exams from API
  useEffect(() => {
    const fetchExams = async () => {
      setLoadingExams(true);
      try {
        const [examsRes, typesRes, levelsRes] = await Promise.all([
          api.get('/eligibility/exams?limit=100'),
          api.get('/eligibility/exam-types'),
          api.get('/eligibility/exam-levels')
        ]);
        
        setExams(examsRes.data || []);
        setExamTypes(typesRes.data || []);
        setExamLevels(levelsRes.data || []);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoadingExams(false);
      }
    };
    
    fetchExams();
  }, []);

  // Handle exam param from URL
  useEffect(() => {
    const examParam = searchParams.get('exam');
    if (examParam && exams.length > 0) {
      const examData = exams.find(e => 
        e.name.toLowerCase().includes(examParam.toLowerCase())
      );
      if (examData) {
        handlePredictClick(examData);
      }
    }
  }, [searchParams, exams]);

  // Filter exams based on selection
  const filteredExams = exams.filter(exam => {
    const typeMatch = selectedType === 'all' || 
      (exam.type && exam.type.toLowerCase() === selectedType.toLowerCase());
    const levelMatch = selectedLevel === 'all' || 
      (exam.level && exam.level.toLowerCase().includes(selectedLevel.toLowerCase()));
    return typeMatch && levelMatch;
  });

  const handlePredictClick = (exam) => {
    setSelectedExam(exam);
    setShowPredictorModal(true);
    setShowResults(false);
    setPredictedColleges([]);
    setPredictionResult(null);
    setPredictorData({
      rank: '',
      marks: '',
      percentile: '',
      category: 'General',
      homeState: exam.level !== 'National' ? exam.level : '',
    });
  };

  const handlePredictorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the score value based on input type
      const scoreValue = selectedExam.input_type === 'rank' ? predictorData.rank :
                        selectedExam.input_type === 'marks' ? predictorData.marks :
                        predictorData.percentile;
      
      // Call the predict API
      const response = await api.post('/eligibility/predict', {
        exam_id: selectedExam.id,
        score: parseFloat(scoreValue),
        score_type: selectedExam.input_type,
        category: predictorData.category,
        home_state: predictorData.homeState || null
      });
      
      setPredictionResult(response.data);
      setPredictedColleges(response.data.colleges || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error predicting colleges:', error);
      alert('Error predicting colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title="College Predictor 2026 - Find Best Colleges | admissionbuddy"
        description="Find colleges based on your exam scores. College predictor for various entrance exams."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
            College Predictor 2026
          </h1>
          <p className="text-sm md:text-base text-center text-purple-100 mb-4">
            For various entrance exams and top Universities
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Course:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-white"
              >
                <option value="all">All Courses</option>
                {examTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Level:</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-white"
              >
                <option value="all">All Levels</option>
                {examLevels.map((level) => (
                  <option key={level} value={level.toLowerCase()}>
                    {level}
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
            {loadingExams && <FiLoader className="animate-spin text-gray-500" />}
          </h2>

          {loadingExams ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <>
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
                            {exam.total_colleges || 0} Colleges
                          </span>
                          {exam.exam_date && (
                            <span className="flex items-center gap-1 text-gray-600">
                              <FiCalendar className="text-sm" />
                              {exam.exam_date}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-gray-600">
                            <FiMapPin className="text-sm" />
                            {exam.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                        {exam.type}
                      </span>
                      <span className="inline-block ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        Input: {exam.input_type}
                      </span>
                    </div>

                    {/* Action Links */}
                    <div className="grid grid-cols-2 gap-2">
                      {exam.links?.exam_info && (
                        <Link to={exam.links.exam_info}>
                          <button className="w-full px-2 py-1.5 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition">
                            Exam Info
                          </button>
                        </Link>
                      )}
                      {exam.links?.cutoff && (
                        <Link to={exam.links.cutoff}>
                          <button className="w-full px-2 py-1.5 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition">
                            Cutoff
                          </button>
                        </Link>
                      )}
                      <button 
                        onClick={() => handlePredictClick(exam)}
                        className="col-span-2 w-full bg-orange-600 hover:bg-orange-700 text-white h-8 text-xs rounded transition font-medium"
                      >
                        🎯 Predict Colleges
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
            </>
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
                Select your exam from the list and click "Predict Colleges"
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
                        {selectedExam.input_type === 'rank' && 'Your Expected Rank *'}
                        {selectedExam.input_type === 'marks' && 'Your Expected Marks *'}
                        {selectedExam.input_type === 'percentile' && 'Your Expected Percentile *'}
                      </label>
                      <Input
                        type="number"
                        value={
                          selectedExam.input_type === 'rank' ? predictorData.rank :
                          selectedExam.input_type === 'marks' ? predictorData.marks :
                          predictorData.percentile
                        }
                        onChange={(e) => setPredictorData({
                          ...predictorData,
                          [selectedExam.input_type]: e.target.value
                        })}
                        placeholder={`Enter your ${selectedExam.input_type}`}
                        max={selectedExam.max_value}
                        required
                        className="h-8 text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Max: {selectedExam.max_value?.toLocaleString()}
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
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <FiLoader className="animate-spin" /> Predicting...
                        </span>
                      ) : 'Predict Colleges'}
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
                      Based on your {selectedExam.input_type}: <strong>
                        {predictorData.rank || predictorData.marks || predictorData.percentile}
                      </strong> and category: <strong>{predictorData.category}</strong>
                    </p>
                    {predictionResult?.eligibility_score && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Eligibility Score:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${predictionResult.eligibility_score}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-green-600">
                            {predictionResult.eligibility_score.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Predicted Colleges */}
                  <h4 className="font-bold text-sm mb-3">
                    {predictedColleges.length} Colleges You Can Get
                  </h4>
                  <div className="space-y-3">
                    {predictedColleges.map((college, index) => (
                      <div key={college.id || index} className="border rounded-lg p-3 hover:shadow-md transition">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                college.admission_probability === 'High' ? 'bg-green-100 text-green-700' :
                                college.admission_probability === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                #{index + 1} • {college.admission_probability}
                              </span>
                              <span className="text-xs text-gray-500">
                                Match: {college.match_score}%
                              </span>
                            </div>
                            <h5 className="font-bold text-sm">{college.name}</h5>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <FiMapPin className="text-xs" /> {college.location}
                              </span>
                              {college.rating && (
                                <span className="flex items-center gap-1">
                                  <FiStar className="text-yellow-500 text-xs" /> {college.rating}
                                </span>
                              )}
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {college.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Annual Fees:</span>
                            <span className="font-semibold ml-1">
                              {college.fees ? `₹${(college.fees/100000).toFixed(1)}L` : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Placement:</span>
                            <span className="font-semibold ml-1">{college.placement || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {predictedColleges.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No colleges found for your score. Try adjusting your inputs.</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => {
                        setShowResults(false);
                        setPredictionResult(null);
                        setPredictorData({
                          rank: '',
                          marks: '',
                          percentile: '',
                          category: 'General',
                          homeState: selectedExam.level !== 'National' ? selectedExam.level : '',
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
