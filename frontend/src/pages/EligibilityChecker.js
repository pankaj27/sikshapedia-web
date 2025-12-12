import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const EligibilityChecker = () => {
  const [formData, setFormData] = useState({
    class_10_percentage: '',
    class_12_percentage: '',
    stream: '',
    entrance_exam: '',
    entrance_score: '',
    category: 'General'
  });
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const eligibility = {
      engineering: checkEngineering(),
      medical: checkMedical(),
      management: checkManagement(),
      commerce: checkCommerce(),
      arts: checkArts()
    };

    setResults(eligibility);
    setShowResults(true);
  };

  const checkEngineering = () => {
    const class12 = parseFloat(formData.class_12_percentage);
    const stream = formData.stream;
    const examScore = parseFloat(formData.entrance_score) || 0;
    
    if (stream !== 'Science') {
      return { eligible: false, reason: 'Science stream in Class 12 is required', confidence: 0 };
    }
    if (class12 < 75) {
      return { eligible: false, reason: 'Minimum 75% in Class 12 required (65% for SC/ST)', confidence: 0 };
    }
    if (examScore < 60) {
      return { eligible: true, reason: 'Eligible but competitive score recommended (JEE Main 90+)', confidence: 50 };
    }
    return { eligible: true, reason: 'Fully eligible for top engineering colleges', confidence: 100 };
  };

  const checkMedical = () => {
    const class12 = parseFloat(formData.class_12_percentage);
    const stream = formData.stream;
    const examScore = parseFloat(formData.entrance_score) || 0;
    
    if (stream !== 'Science') {
      return { eligible: false, reason: 'Biology in Class 12 is required', confidence: 0 };
    }
    if (class12 < 50) {
      return { eligible: false, reason: 'Minimum 50% in Class 12 required (40% for SC/ST/OBC)', confidence: 0 };
    }
    if (examScore < 500) {
      return { eligible: true, reason: 'Eligible but NEET score above 600 recommended for top colleges', confidence: 60 };
    }
    return { eligible: true, reason: 'Excellent eligibility for medical colleges', confidence: 100 };
  };

  const checkManagement = () => {
    const class12 = parseFloat(formData.class_12_percentage);
    const graduation = true; // Assuming graduation for management
    
    if (class12 < 50) {
      return { eligible: false, reason: 'Minimum 50% in graduation required', confidence: 0 };
    }
    return { eligible: true, reason: 'Eligible for MBA programs', confidence: 85 };
  };

  const checkCommerce = () => {
    const class12 = parseFloat(formData.class_12_percentage);
    return { eligible: true, reason: 'Eligible for B.Com, BBA, CA, CS programs', confidence: 100 };
  };

  const checkArts = () => {
    return { eligible: true, reason: 'Eligible for BA, humanities, social sciences programs', confidence: 100 };
  };

  const getIcon = (result) => {
    if (!result.eligible) return <FiXCircle className="text-red-500 text-3xl" />;
    if (result.confidence < 70) return <FiAlertCircle className="text-yellow-500 text-3xl" />;
    return <FiCheckCircle className="text-green-500 text-3xl" />;
  };

  const getColor = (result) => {
    if (!result.eligible) return 'border-red-200 bg-red-50';
    if (result.confidence < 70) return 'border-yellow-200 bg-yellow-50';
    return 'border-green-200 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/admissionbuddy-logo.png" alt="AdmissionBuddy" className="h-10" />
            </Link>
            <div className="flex gap-4">
              <Link to="/"><Button variant="ghost">Home</Button></Link>
              <Link to="/colleges"><Button variant="ghost">Colleges</Button></Link>
              <Link to="/exams"><Button variant="ghost">Exams</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Eligibility Checker</h1>
            <p className="text-xl text-gray-600">Check your eligibility for different courses and colleges</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Your Academic Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Class 10 Percentage *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.class_10_percentage}
                    onChange={(e) => setFormData({...formData, class_10_percentage: e.target.value})}
                    placeholder="85.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Class 12 Percentage *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.class_12_percentage}
                    onChange={(e) => setFormData({...formData, class_12_percentage: e.target.value})}
                    placeholder="90.0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Class 12 Stream *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({...formData, stream: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select Stream</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Entrance Exam (Optional)</label>
                  <Input
                    value={formData.entrance_exam}
                    onChange={(e) => setFormData({...formData, entrance_exam: e.target.value})}
                    placeholder="JEE Main, NEET, CAT, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Entrance Exam Score (Optional)</label>
                  <Input
                    type="number"
                    value={formData.entrance_score}
                    onChange={(e) => setFormData({...formData, entrance_score: e.target.value})}
                    placeholder="150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Check Eligibility</Button>
              </form>
            </div>

            {/* Results */}
            <div>
              {showResults && results ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-6">Eligibility Results</h2>
                  
                  {Object.entries(results).map(([key, result]) => (
                    <div key={key} className={`border-2 rounded-lg p-4 ${getColor(result)}`}>
                      <div className="flex items-start gap-4">
                        {getIcon(result)}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg capitalize mb-1">{key}</h3>
                          <p className="text-sm text-gray-700">{result.reason}</p>
                          {result.eligible && result.confidence < 100 && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-600 mb-1">Confidence: {result.confidence}%</div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{ width: `${result.confidence}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> This is an indicative eligibility check. Please verify specific requirements with individual colleges and universities.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <FiAlertCircle className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Fill in your details to check eligibility</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;