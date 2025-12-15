import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiUpload, FiCheckCircle, FiAward } from 'react-icons/fi';
import { Button } from '../components/ui/button';

const WriteReviewPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    instituteType: '',
    instituteName: '',
    course: '',
    rating: 0,
    reviewTitle: '',
    likes: '',
    dislikes: '',
    detailedReview: '',
    facilities: {
      infrastructure: 0,
      faculty: 0,
      placement: 0,
      hostel: 0,
      campus: 0
    },
    name: '',
    email: '',
    graduationYear: '',
    verificationDocument: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFacilityRating = (facility, rating) => {
    setFormData(prev => ({
      ...prev,
      facilities: { ...prev.facilities, [facility]: rating }
    }));
  };

  const renderStars = (rating, onRatingChange) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={24}
            className={`cursor-pointer transition-colors ${
              star <= rating ? 'fill-orange-500 text-orange-500' : 'text-gray-300'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b py-2">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Write a Review</span>
          </div>
        </div>
      </div>

      {/* Header - Compact */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2">Write a Review & Earn ₹300*</h1>
            <p className="text-base mb-3">Share your experience and help thousands of students</p>
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-1.5">
                <FiCheckCircle size={16} />
                <span>Verified Reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiAward size={16} />
                <span>Earn Rewards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiCheckCircle size={16} />
                <span>Help Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator - Compact */}
      <div className="bg-white border-b py-3">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {['Select Institute', 'Write Review', 'Personal Details', 'Submit'].map((label, idx) => (
                <div key={idx} className="flex items-center flex-1">
                  <div className={`flex items-center gap-2 ${idx > 0 ? 'flex-1' : ''}`}>
                    {idx > 0 && (
                      <div className={`flex-1 h-0.5 ${step > idx + 1 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                    )}
                    <div className={`flex flex-col items-center ${idx > 0 ? 'flex-shrink-0' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        step > idx + 1 ? 'bg-orange-500 text-white' : 
                        step === idx + 1 ? 'bg-orange-500 text-white' : 
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {step > idx + 1 ? '✓' : idx + 1}
                      </div>
                      <span className="text-[10px] mt-0.5 font-medium text-gray-700">{label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Sidebar Advertisement */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Top Ad */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4 text-white text-center sticky top-20">
              <p className="text-xs uppercase mb-2">Advertisement</p>
              <h3 className="font-bold text-sm mb-2">Get Expert Counseling</h3>
              <p className="text-xs mb-3 opacity-90">Free career guidance</p>
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 text-xs py-2">
                Book Now
              </Button>
            </div>

            {/* Middle Ad */}
            <div className="bg-white rounded-lg border-2 border-orange-300 p-3 text-center">
              <p className="text-xs text-orange-600 uppercase mb-2">Sponsored</p>
              <img src="https://via.placeholder.com/200x150?text=Ad+Space" alt="Ad" className="w-full rounded mb-2" />
              <p className="text-xs text-gray-600">Your ad here</p>
            </div>

            {/* Bottom Ad */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-4 text-white text-center">
              <h3 className="font-bold text-sm mb-2">College Predictor</h3>
              <p className="text-xs mb-3 opacity-90">Know your admission chances</p>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 text-xs py-2">
                Predict Now
              </Button>
            </div>
          </aside>

          {/* Main Form */}
          <div className="lg:col-span-3">
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Step 1: Select Your Institute</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Institute Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.instituteType}
                    onChange={(e) => handleInputChange('instituteType', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Institute Type</option>
                    <option value="college">College/University</option>
                    <option value="school">School</option>
                    <option value="coaching">Coaching Institute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Institute Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Search and select your institute"
                    value={formData.instituteName}
                    onChange={(e) => handleInputChange('instituteName', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-0.5">Start typing to search from our database</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., B.Tech Computer Science"
                    value={formData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.instituteType || !formData.instituteName || !formData.course}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10 text-sm font-semibold disabled:bg-gray-300"
                >
                  Next: Write Review
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Step 2: Write Your Review</h2>
              
              <div className="space-y-4">
                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Overall Rating <span className="text-red-500">*</span>
                  </label>
                  {renderStars(formData.rating, (rating) => handleInputChange('rating', rating))}
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Review Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Summarize your experience in one line"
                    value={formData.reviewTitle}
                    onChange={(e) => handleInputChange('reviewTitle', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    maxLength="100"
                  />
                  <p className="text-xs text-gray-500 mt-0.5">{formData.reviewTitle.length}/100 characters</p>
                </div>

                {/* What You Liked */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    What did you like? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Highlight the positive aspects"
                    value={formData.likes}
                    onChange={(e) => handleInputChange('likes', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>

                {/* What Needs Improvement */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    What needs improvement?
                  </label>
                  <textarea
                    placeholder="Areas for improvement"
                    value={formData.dislikes}
                    onChange={(e) => handleInputChange('dislikes', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>

                {/* Detailed Review */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Detailed Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Share your complete experience - placements, faculty, infrastructure, etc."
                    value={formData.detailedReview}
                    onChange={(e) => handleInputChange('detailedReview', e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-0.5">Minimum 200 characters required</p>
                </div>

                {/* Facility Ratings */}
                <div className="border-t pt-4">
                  <h3 className="font-bold text-base mb-3">Rate Different Aspects</h3>
                  <div className="space-y-2.5">
                    {[
                      { key: 'infrastructure', label: 'Infrastructure' },
                      { key: 'faculty', label: 'Faculty' },
                      { key: 'placement', label: 'Placements' },
                      { key: 'hostel', label: 'Hostel Facilities' },
                      { key: 'campus', label: 'Campus Life' }
                    ].map((facility) => (
                      <div key={facility.key} className="flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-700">{facility.label}</span>
                        {renderStars(formData.facilities[facility.key], (rating) => handleFacilityRating(facility.key, rating))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-10 text-sm"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!formData.rating || !formData.reviewTitle || !formData.likes || formData.detailedReview.length < 200}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-10 text-sm disabled:bg-gray-300"
                  >
                    Next: Personal Details
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Step 3: Personal Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-0.5">We'll send reward details to this email</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Year of Graduation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Year</option>
                    {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Upload Verification Document (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors cursor-pointer">
                    <FiUpload className="mx-auto mb-1 text-gray-400" size={24} />
                    <p className="text-xs text-gray-600 mb-0.5">Click to upload ID Card, Marksheet, or Certificate</p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Your review will be published after verification. 
                    Document helps in faster processing.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-10 text-sm"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={!formData.name || !formData.email || !formData.graduationYear}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-10 text-sm disabled:bg-gray-300"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="text-green-600" size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Review Submitted Successfully!</h2>
                <p className="text-gray-600 text-lg">
                  Thank you for sharing your experience. Your review is being verified and will be published shortly.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-3">What Happens Next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex gap-3">
                    <span className="text-orange-600 font-bold">1.</span>
                    <span className="text-gray-700">Our team will verify your review within 48 hours</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-orange-600 font-bold">2.</span>
                    <span className="text-gray-700">You'll receive a verification email once approved</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-orange-600 font-bold">3.</span>
                    <span className="text-gray-700">Your reward of ₹300 will be processed within 7 days</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  Write Another Review
                </Button>
                <Link to="/">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Why Write a Review?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiAward size={32} />
                </div>
                <h3 className="font-bold mb-2">Earn Rewards</h3>
                <p className="text-sm opacity-90">Get up to ₹300 for every verified review</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiCheckCircle size={32} />
                </div>
                <h3 className="font-bold mb-2">Help Students</h3>
                <p className="text-sm opacity-90">Guide future students in making informed decisions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiStar size={32} />
                </div>
                <h3 className="font-bold mb-2">Shape Education</h3>
                <p className="text-sm opacity-90">Your feedback helps colleges improve</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteReviewPage;
