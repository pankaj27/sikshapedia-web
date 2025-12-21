import React, { useState, useEffect, useRef } from 'react';
import { FiStar, FiUpload, FiCheckCircle, FiAward, FiSearch, FiAlertCircle, FiX, FiFile } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

import { Link } from '../components/CustomLink';

// Default settings (fallback if API fails)
const defaultSettings = {
  header: {
    title: "Write a Review & Earn ₹300*",
    subtitle: "Share your experience and help thousands of students",
    badge_texts: ["Verified Reviews", "Earn Rewards", "Help Students"]
  },
  points_config: {
    base_points: 50,
    detailed_review_bonus: 50,
    verified_student_bonus: 50,
    photos_bonus: 30,
    min_review_characters: 200
  },
  success_page: {
    title: "Review Submitted Successfully!",
    message: "Thank you for sharing your experience. Your review is being verified and will be published shortly.",
    points_label: "Points Earned!",
    reward_note: "≈ ₹{amount} reward value",
    next_steps_title: "What Happens Next?",
    next_steps: [
      { step_number: 1, text: "Our team will verify your review within 48 hours" },
      { step_number: 2, text: "You'll receive a verification email once approved" },
      { step_number: 3, text: "Points will be added to your account after approval" },
      { step_number: 4, text: "Redeem points for cash via UPI once you have 200+ points" }
    ],
    button_write_another: "Write Another Review",
    button_view_reviews: "View My Reviews"
  },
  benefits_section: {
    title: "Why Write a Review?",
    cards: [
      { title: "Earn Rewards", description: "Get up to ₹300 for every verified review", icon: "award" },
      { title: "Help Students", description: "Guide future students in making informed decisions", icon: "check" },
      { title: "Shape Education", description: "Your feedback helps colleges improve", icon: "star" }
    ]
  }
};

const WriteReviewPage = () => {
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pageSettings, setPageSettings] = useState(defaultSettings);
  const [formData, setFormData] = useState({
    instituteType: '',
    instituteName: '',
    instituteId: '',
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

  // Search and dropdown states
  const [instituteSearch, setInstituteSearch] = useState('');
  const [institutes, setInstitutes] = useState([]);
  const [showInstituteDropdown, setShowInstituteDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Fetch page settings on mount
  useEffect(() => {
    const fetchPageSettings = async () => {
      try {
        const response = await api.get('/write-review-settings');
        if (response.data) {
          setPageSettings(response.data);
        }
      } catch (error) {
        console.error('Error fetching page settings:', error);
        // Use default settings on error
      }
    };
    fetchPageSettings();
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await api.get('/user/profile');
        const profile = response.data;
        setUserProfile(profile);
        
        // Pre-fill name and email from profile
        setFormData(prev => ({
          ...prev,
          name: profile.name || profile.full_name || '',
          email: profile.email || ''
        }));
        
        // Check if name is missing
        if (!profile.name && !profile.full_name) {
          setShowNamePrompt(true);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // If user is logged in via context, use that data
        if (user) {
          setFormData(prev => ({
            ...prev,
            name: user.name || user.full_name || '',
            email: user.email || ''
          }));
          if (!user.name && !user.full_name) {
            setShowNamePrompt(true);
          }
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user]);

  // Search institutes when user types
  useEffect(() => {
    const searchInstitutes = async () => {
      if (instituteSearch.length < 2) {
        setInstitutes([]);
        return;
      }
      
      setSearchLoading(true);
      try {
        const type = formData.instituteType || 'college';
        let endpoint = '/colleges';
        if (type === 'school') endpoint = '/schools';
        
        const response = await api.get(`${endpoint}?search=${encodeURIComponent(instituteSearch)}&limit=10`);
        const data = Array.isArray(response.data) ? response.data : response.data.colleges || response.data.schools || [];
        setInstitutes(data);
      } catch (error) {
        console.error('Error searching institutes:', error);
        setInstitutes([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounce = setTimeout(searchInstitutes, 300);
    return () => clearTimeout(debounce);
  }, [instituteSearch, formData.instituteType]);

  // Fetch courses when institute is selected
  useEffect(() => {
    const fetchCourses = async () => {
      if (!formData.instituteId) {
        setCourses([]);
        return;
      }

      setCoursesLoading(true);
      try {
        const response = await api.get(`/colleges/${formData.instituteId}`);
        const collegeData = response.data;
        
        // Extract courses from college data
        let coursesData = [];
        if (collegeData.courses && Array.isArray(collegeData.courses)) {
          coursesData = collegeData.courses.map(c => c.name || c.course_name || c);
        } else if (collegeData.programs && Array.isArray(collegeData.programs)) {
          coursesData = collegeData.programs.map(p => p.name || p);
        }
        
        // If no courses found, use common courses
        if (coursesData.length === 0) {
          coursesData = ['B.Tech', 'M.Tech', 'MBA', 'BBA', 'B.Com', 'M.Com', 'BA', 'MA', 'B.Sc', 'M.Sc', 'BCA', 'MCA', 'MBBS', 'BDS', 'LLB', 'LLM', 'B.Pharm', 'M.Pharm'];
        }
        
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback courses
        setCourses(['B.Tech', 'M.Tech', 'MBA', 'BBA', 'B.Com', 'M.Com', 'BA', 'MA', 'B.Sc', 'M.Sc', 'BCA', 'MCA']);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [formData.instituteId]);

  const handleInstituteSelect = (institute) => {
    setFormData(prev => ({
      ...prev,
      instituteName: institute.name,
      instituteId: institute.id
    }));
    setInstituteSearch('');
    setShowInstituteDropdown(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFacilityRating = (facility, rating) => {
    setFormData(prev => ({
      ...prev,
      facilities: { ...prev.facilities, [facility]: rating }
    }));
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploadedFile({
        name: file.name,
        url: response.data.url || response.data.file_url,
        size: file.size
      });

      setFormData(prev => ({
        ...prev,
        verificationDocument: response.data.url || response.data.file_url
      }));
    } catch (error) {
      console.error('Upload error:', error);
      // Still show the file locally even if upload fails
      setUploadedFile({
        name: file.name,
        size: file.size,
        localFile: file
      });
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, verificationDocument: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Submit review to backend
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [earnedPoints, setEarnedPoints] = useState(0);

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const reviewData = {
        college_id: formData.instituteId,
        college_name: formData.instituteName,
        course: formData.course,
        rating: formData.rating,
        title: formData.reviewTitle,
        review: `${formData.likes}\n\nDislikes: ${formData.dislikes}\n\nDetailed Review: ${formData.detailedReview}`,
        facilities_rating: formData.facilities,
        graduation_year: formData.graduationYear,
        is_verified_student: !!formData.verificationDocument,
        verification_document: formData.verificationDocument,
        photos: []
      };

      const response = await api.post('/user/reviews', reviewData);
      
      setEarnedPoints(response.data.points_earned || 50);
      setStep(4);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error.response?.data?.detail || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
            <h1 className="text-3xl font-bold mb-2">{pageSettings.header.title}</h1>
            <p className="text-base mb-3">{pageSettings.header.subtitle}</p>
            <div className="flex items-center justify-center gap-6 text-xs">
              {pageSettings.header.badge_texts.map((badge, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  {index === 0 ? <FiCheckCircle size={16} /> : index === 1 ? <FiAward size={16} /> : <FiCheckCircle size={16} />}
                  <span>{badge}</span>
                </div>
              ))}
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

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Institute Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search and select your institute"
                      value={formData.instituteName || instituteSearch}
                      onChange={(e) => {
                        setInstituteSearch(e.target.value);
                        setShowInstituteDropdown(true);
                        if (!e.target.value) {
                          setFormData(prev => ({ ...prev, instituteName: '', instituteId: '' }));
                        }
                      }}
                      onFocus={() => setShowInstituteDropdown(true)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      style={{ color: formData.instituteName ? '#111827' : '#6B7280', fontWeight: formData.instituteName ? '500' : '400' }}
                    />
                    {searchLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {showInstituteDropdown && (instituteSearch.length >= 2 || institutes.length > 0) && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {institutes.length > 0 ? (
                          institutes.map(inst => (
                            <div
                              key={inst.id}
                              onClick={() => handleInstituteSelect(inst)}
                              className="px-3 py-2 cursor-pointer hover:bg-orange-50 border-b border-gray-100 last:border-0"
                              style={{ color: '#111827' }}
                            >
                              <div className="font-medium">{inst.name}</div>
                              {inst.location && (
                                <div className="text-xs text-gray-500">
                                  {inst.location.city}, {inst.location.state}
                                </div>
                              )}
                            </div>
                          ))
                        ) : instituteSearch.length >= 2 && !searchLoading ? (
                          <div className="px-3 py-3 text-gray-500 text-sm">
                            No institutes found. Try a different search term.
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Start typing to search from our database</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    disabled={!formData.instituteId}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${!formData.instituteId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    style={{ color: formData.course ? '#111827' : '#6B7280' }}
                  >
                    <option value="">{formData.instituteId ? 'Select your course' : 'Select institute first'}</option>
                    {courses.map((course, idx) => (
                      <option key={idx} value={course}>{course}</option>
                    ))}
                  </select>
                  {coursesLoading && (
                    <p className="text-xs text-orange-500 mt-0.5">Loading courses...</p>
                  )}
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
              
              {/* Prompt to save name if missing */}
              {showNamePrompt && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <FiAlertCircle className="text-orange-500 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Complete Your Profile</p>
                    <p className="text-xs text-orange-700 mt-1">
                      Your name is not saved in your profile. Please enter your name below and we'll save it to your profile.
                    </p>
                    <Link to="/dashboard?tab=profile" className="text-xs text-orange-600 hover:underline mt-1 inline-block">
                      Go to Profile Settings →
                    </Link>
                  </div>
                </div>
              )}
              
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
                    style={{ color: '#111827', fontWeight: formData.name ? '500' : '400' }}
                  />
                  {userProfile?.name && (
                    <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                      <FiCheckCircle size={12} /> Auto-filled from your profile
                    </p>
                  )}
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
                    readOnly={!!userProfile?.email}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${userProfile?.email ? 'bg-gray-50' : ''}`}
                    style={{ color: '#111827', fontWeight: formData.email ? '500' : '400' }}
                  />
                  {userProfile?.email ? (
                    <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                      <FiCheckCircle size={12} /> From your profile (cannot be changed)
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-0.5">We'll send reward details to this email</p>
                  )}
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
                  
                  {!uploadedFile ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors cursor-pointer"
                    >
                      {uploading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
                          <p className="text-xs text-orange-600">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <FiUpload className="mx-auto mb-1 text-gray-400" size={24} />
                          <p className="text-xs text-gray-600 mb-0.5">Click to upload ID Card, Marksheet, or Certificate</p>
                          <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                        </>
                      )}
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                      />
                    </div>
                  ) : (
                    <div className="border border-green-300 bg-green-50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FiFile className="text-green-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={removeUploadedFile}
                        className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                        title="Remove file"
                      >
                        <FiX className="text-red-500" size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Your review will be published after verification. 
                    Document helps in faster processing.
                  </p>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <FiAlertCircle className="text-red-500" />
                    <p className="text-sm text-red-700">{submitError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-10 text-sm"
                    disabled={submitting}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={!formData.name || !formData.email || !formData.graduationYear || submitting}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-10 text-sm disabled:bg-gray-300"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Review'
                    )}
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

              {/* Points Earned Section */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 mb-6 text-white">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FiAward size={32} />
                  <span className="text-4xl font-bold">+{earnedPoints}</span>
                </div>
                <p className="text-orange-100">Points Earned!</p>
                <p className="text-sm text-orange-200 mt-2">
                  ≈ ₹{(earnedPoints * 0.5).toFixed(0)} reward value
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
                    <span className="text-gray-700">Points will be added to your account after approval</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-orange-600 font-bold">4.</span>
                    <span className="text-gray-700">Redeem points for cash via UPI once you have 200+ points</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      instituteType: '',
                      instituteName: '',
                      instituteId: '',
                      course: '',
                      rating: 0,
                      reviewTitle: '',
                      likes: '',
                      dislikes: '',
                      detailedReview: '',
                      facilities: { infrastructure: 0, faculty: 0, placement: 0, hostel: 0, campus: 0 },
                      name: userProfile?.name || '',
                      email: userProfile?.email || '',
                      graduationYear: '',
                      verificationDocument: null
                    });
                    setUploadedFile(null);
                    setEarnedPoints(0);
                  }}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  Write Another Review
                </Button>
                <Link to="/dashboard?tab=reviews">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    View My Reviews
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
