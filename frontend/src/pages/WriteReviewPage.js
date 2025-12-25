import React, { useState, useEffect, useRef } from 'react';
import { FiStar, FiUpload, FiCheckCircle, FiAward, FiSearch, FiAlertCircle, FiX, FiFile } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
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
    min_review_characters: 50,
    bonus_review_characters: 200
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
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pageSettings, setPageSettings] = useState(defaultSettings);
  const [prefilledFromUrl, setPrefilledFromUrl] = useState(false);
  const [isFromQR, setIsFromQR] = useState(false);
  const [qrLinkCode, setQrLinkCode] = useState('');
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

  // Use ref to track if URL params have been processed (prevents infinite loop)
  const urlParamsProcessed = useRef(false);

  // Handle URL params for pre-filling institute info (when coming from college detail page or QR code)
  useEffect(() => {
    // Only run once
    if (urlParamsProcessed.current) return;
    
    const instituteId = searchParams.get('instituteId');
    const instituteName = searchParams.get('instituteName');
    const instituteType = searchParams.get('instituteType');
    const fromQR = searchParams.get('fromQR') === 'true';
    const linkCode = searchParams.get('linkCode');

    if (instituteId && instituteName) {
      urlParamsProcessed.current = true; // Mark as processed FIRST to prevent re-runs
      
      // Auto-detect type from institute name if not provided in URL
      let detectedType = instituteType;
      if (!detectedType || detectedType === '' || detectedType === 'null') {
        const nameLower = (instituteName || '').toLowerCase();
        
        if (nameLower.includes('school') || nameLower.includes('vidyalaya') || nameLower.includes('vidya mandir')) {
          detectedType = 'school';
        } else if (nameLower.includes('university') || nameLower.includes('vishwavidyalaya') || nameLower.includes('vishwa vidyalaya')) {
          detectedType = 'university';
        } else if (nameLower.includes('coaching') || nameLower.includes('classes') || nameLower.includes('tutorial')) {
          detectedType = 'coaching';
        } else {
          detectedType = 'college';
        }
      }
      
      setFormData(prev => ({
        ...prev,
        instituteId: instituteId,
        instituteName: instituteName,
        instituteType: detectedType
      }));
      setPrefilledFromUrl(true);
      
      // If from QR, lock the institute selection
      if (fromQR) {
        setIsFromQR(true);
        if (linkCode) {
          setQrLinkCode(linkCode);
        }
      }
    }
  }, []); // Empty dependency array - run only once on mount

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

  // Search institutes when user types - search ALL types at once
  useEffect(() => {
    const searchInstitutes = async () => {
      if (instituteSearch.length < 2) {
        setInstitutes([]);
        return;
      }
      
      setSearchLoading(true);
      try {
        // Use unified search API to search all institute types
        const response = await api.get(`/institutes/search?search=${encodeURIComponent(instituteSearch)}&type=all&limit=15`);
        const data = Array.isArray(response.data) ? response.data : [];
        setInstitutes(data);
      } catch (error) {
        console.error('Error searching institutes:', error);
        // Fallback to colleges endpoint
        try {
          const fallbackResponse = await api.get(`/colleges?search=${encodeURIComponent(instituteSearch)}&limit=10`);
          const fallbackData = Array.isArray(fallbackResponse.data) ? fallbackResponse.data : fallbackResponse.data.colleges || [];
          setInstitutes(fallbackData.map(c => ({ ...c, type: 'college' })));
        } catch {
          setInstitutes([]);
        }
      } finally {
        setSearchLoading(false);
      }
    };

    const debounce = setTimeout(searchInstitutes, 300);
    return () => clearTimeout(debounce);
  }, [instituteSearch]);

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
    // Auto-detect institute type from the search result
    const rawType = (institute.type || institute.institution_type || '').toLowerCase();
    const nameLower = (institute.name || '').toLowerCase();
    
    // Determine normalized type - check rawType first, then name
    let normalizedType = 'college'; // default
    
    if (rawType.includes('school') || nameLower.includes('school') || nameLower.includes('vidyalaya') || nameLower.includes('vidya mandir')) {
      normalizedType = 'school';
    } else if (rawType.includes('university') || nameLower.includes('university') || nameLower.includes('vishwavidyalaya')) {
      normalizedType = 'university';
    } else if (rawType.includes('coaching') || nameLower.includes('coaching') || nameLower.includes('classes') || nameLower.includes('tutorial')) {
      normalizedType = 'coaching';
    } else if (rawType.includes('college') || nameLower.includes('college') || nameLower.includes('institute')) {
      normalizedType = 'college';
    }
    
    console.log('Selected institute:', institute.name, 'Raw type:', rawType, 'Normalized:', normalizedType);
    
    setFormData(prev => ({
      ...prev,
      instituteName: institute.name,
      instituteId: institute.id,
      instituteType: normalizedType  // Auto-set type
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
        review_title: formData.reviewTitle,
        pros: formData.likes,
        cons: formData.dislikes,
        review_text: formData.detailedReview,
        facilities_rating: formData.facilities,
        graduation_year: formData.graduationYear,
        is_verified_student: !!formData.verificationDocument,
        verification_document: formData.verificationDocument,
        photos: []
      };

      const response = await api.post('/reviews', reviewData);
      
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
              {/* Ad placeholder - would be replaced with actual ad content */}
              <div className="w-full h-[150px] bg-gray-100 rounded mb-2 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Advertisement</span>
              </div>
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
              
              {/* Show locked institute info when from QR */}
              {isFromQR && formData.instituteName ? (
                <div className="space-y-4">
                  {/* Locked Institute Display */}
                  <div className={`border-2 rounded-lg p-4 ${
                    formData.instituteType === 'school' ? 'bg-green-50 border-green-200' :
                    formData.instituteType === 'university' ? 'bg-purple-50 border-purple-200' :
                    formData.instituteType === 'coaching' ? 'bg-orange-50 border-orange-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        formData.instituteType === 'school' ? 'bg-green-100' :
                        formData.instituteType === 'university' ? 'bg-purple-100' :
                        formData.instituteType === 'coaching' ? 'bg-orange-100' :
                        'bg-blue-100'
                      }`}>
                        <span className="text-2xl">{
                          formData.instituteType === 'school' ? '🏫' :
                          formData.instituteType === 'university' ? '🏛️' :
                          formData.instituteType === 'coaching' ? '📚' :
                          '🎓'
                        }</span>
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-medium uppercase tracking-wide ${
                          formData.instituteType === 'school' ? 'text-green-600' :
                          formData.instituteType === 'university' ? 'text-purple-600' :
                          formData.instituteType === 'coaching' ? 'text-orange-600' :
                          'text-blue-600'
                        }`}>
                          {formData.instituteType === 'school' ? 'School' : 
                           formData.instituteType === 'university' ? 'University' : 
                           formData.instituteType === 'coaching' ? 'Coaching Institute' : 'College'}
                        </p>
                        <h3 className="text-lg font-bold text-gray-900">{formData.instituteName}</h3>
                      </div>
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        <FiCheckCircle size={12} />
                        Verified via QR
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      You scanned the QR code for this institute. The institute is pre-selected and cannot be changed.
                    </p>
                  </div>

                  {/* Course Selection - Still editable */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Course <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => handleInputChange('course', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      style={{ color: formData.course ? '#111827' : '#6B7280' }}
                    >
                      <option value="">Select your course</option>
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
                    disabled={!formData.course}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10 text-sm font-semibold disabled:bg-gray-300"
                  >
                    Continue to Write Review
                  </Button>
                </div>
              ) : (
                /* Regular institute selection for non-QR flow */
                <div className="space-y-4">
                  {/* Institute Name Search - Primary field now */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Search Your Institute <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type college, school or university name..."
                        value={formData.instituteName || instituteSearch}
                        onChange={(e) => {
                          setInstituteSearch(e.target.value);
                          setShowInstituteDropdown(true);
                          if (!e.target.value) {
                            setFormData(prev => ({ ...prev, instituteName: '', instituteId: '', instituteType: '' }));
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
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{inst.name}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    inst.type === 'school' ? 'bg-green-100 text-green-700' :
                                    inst.type === 'university' ? 'bg-purple-100 text-purple-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {inst.type === 'school' ? 'School' : 
                                     inst.type === 'university' ? 'University' : 'College'}
                                  </span>
                                </div>
                                {(inst.location || inst.city) && (
                                  <div className="text-xs text-gray-500">
                                    {inst.location?.city || inst.city}{inst.location?.state || inst.state ? `, ${inst.location?.state || inst.state}` : ''}
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
                    <p className="text-xs text-gray-500 mt-0.5">Search colleges, schools, and universities</p>
                  </div>

                  {/* Show auto-detected institute type after selection */}
                  {formData.instituteName && formData.instituteType && (
                    <div className={`border rounded-lg p-3 ${
                      formData.instituteType === 'school' ? 'bg-green-50 border-green-200' :
                      formData.instituteType === 'university' ? 'bg-purple-50 border-purple-200' :
                      formData.instituteType === 'coaching' ? 'bg-orange-50 border-orange-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${
                          formData.instituteType === 'school' ? 'text-green-700' :
                          formData.instituteType === 'university' ? 'text-purple-700' :
                          formData.instituteType === 'coaching' ? 'text-orange-700' :
                          'text-blue-700'
                        }`}>
                          <span className="font-medium">Institute Type:</span> {
                            formData.instituteType === 'school' ? '🏫 School' :
                            formData.instituteType === 'university' ? '🏛️ University' :
                            formData.instituteType === 'coaching' ? '📚 Coaching Institute' :
                            '🎓 College'
                          }
                        </span>
                        <span className={`text-xs ${
                          formData.instituteType === 'school' ? 'text-green-500' :
                          formData.instituteType === 'university' ? 'text-purple-500' :
                          formData.instituteType === 'coaching' ? 'text-orange-500' :
                          'text-blue-500'
                        }`}>(Auto-detected)</span>
                      </div>
                    </div>
                  )}

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
              )}
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Step 2: Write Your Review</h2>
              
              {/* Live Points Calculator */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-xl">🎯</span> Points You'll Earn
                  </h3>
                  <div className="text-2xl font-bold text-orange-600">
                    {formData.detailedReview.length >= 200 ? '100' : '50'} pts
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-gray-700">Write a review</span>
                    </span>
                    <span className="font-semibold text-green-600">+50 pts</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        formData.detailedReview.length >= 200 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {formData.detailedReview.length >= 200 ? '✓' : '○'}
                      </span>
                      <span className={formData.detailedReview.length >= 200 ? 'text-gray-700' : 'text-gray-500'}>
                        Detailed review (200+ chars)
                      </span>
                    </span>
                    <span className={`font-semibold ${formData.detailedReview.length >= 200 ? 'text-green-600' : 'text-gray-400'}`}>
                      +50 pts
                    </span>
                  </div>
                </div>
                {formData.detailedReview.length < 200 && (
                  <p className="text-xs text-orange-600 mt-3 bg-orange-100 px-3 py-1.5 rounded-lg">
                    💡 Write {200 - formData.detailedReview.length} more characters to unlock +50 bonus points!
                  </p>
                )}
              </div>
              
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
                    <span className="text-green-600">👍 Pros</span> - What did you like? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Highlight the positive aspects - good faculty, placements, infrastructure, etc."
                    value={formData.likes}
                    onChange={(e) => handleInputChange('likes', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>

                {/* Cons - What Needs Improvement */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <span className="text-red-600">👎 Cons</span> - What needs improvement?
                  </label>
                  <textarea
                    placeholder="Areas for improvement - facilities, management, etc."
                    value={formData.dislikes}
                    onChange={(e) => handleInputChange('dislikes', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  ></textarea>
                </div>

                {/* Detailed Review with Progress Bar */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Detailed Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Share your complete experience - placements, faculty, infrastructure, etc."
                    value={formData.detailedReview}
                    onChange={(e) => handleInputChange('detailedReview', e.target.value)}
                    rows="4"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      formData.detailedReview.length >= 200 
                        ? 'border-green-300 focus:ring-green-500 bg-green-50' 
                        : formData.detailedReview.length >= 50
                        ? 'border-blue-300 focus:ring-blue-500'
                        : 'border-gray-300 focus:ring-orange-500'
                    }`}
                  ></textarea>
                  
                  {/* Character Progress Bar */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${
                        formData.detailedReview.length >= 200 ? 'text-green-600' : 
                        formData.detailedReview.length >= 50 ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {formData.detailedReview.length >= 200 ? (
                          <span className="flex items-center gap-1">
                            ✅ Bonus unlocked! +50 pts
                          </span>
                        ) : formData.detailedReview.length >= 50 ? (
                          <span>✓ {formData.detailedReview.length}/200 characters (minimum met)</span>
                        ) : (
                          <span>📝 {formData.detailedReview.length}/50 min characters</span>
                        )}
                      </span>
                      {formData.detailedReview.length < 200 && formData.detailedReview.length >= 50 && (
                        <span className="text-xs text-orange-600 font-medium">
                          +50 bonus at 200!
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          formData.detailedReview.length >= 200 
                            ? 'bg-green-500' 
                            : formData.detailedReview.length >= 50
                            ? 'bg-blue-500'
                            : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min((formData.detailedReview.length / 200) * 100, 100)}%` }}
                      ></div>
                    </div>
                    {formData.detailedReview.length >= 200 && (
                      <p className="text-xs text-green-600 mt-1">
                        🎉 Great job! Your detailed review qualifies for bonus points.
                      </p>
                    )}
                    {formData.detailedReview.length < 50 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 50 characters required to proceed
                      </p>
                    )}
                  </div>
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
                    disabled={!formData.rating || !formData.reviewTitle || !formData.likes || formData.detailedReview.length < pageSettings.points_config.min_review_characters}
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
                    {Array.from({ length: 2026 - 1990 }, (_, i) => 2025 - i).map(year => (
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
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{pageSettings.success_page.title}</h2>
                <p className="text-gray-600 text-lg">
                  {pageSettings.success_page.message}
                </p>
              </div>

              {/* Points Earned Section */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 mb-6 text-white">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FiAward size={32} />
                  <span className="text-4xl font-bold">+{earnedPoints}</span>
                </div>
                <p className="text-orange-100">{pageSettings.success_page.points_label}</p>
                <p className="text-sm text-orange-200 mt-2">
                  {pageSettings.success_page.reward_note.replace('{amount}', (earnedPoints * 0.5).toFixed(0))}
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-3">{pageSettings.success_page.next_steps_title}</h3>
                <div className="space-y-3 text-left">
                  {pageSettings.success_page.next_steps.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-orange-600 font-bold">{step.step_number}.</span>
                      <span className="text-gray-700">{step.text}</span>
                    </div>
                  ))}
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
                  {pageSettings.success_page.button_write_another}
                </Button>
                <Link to="/dashboard?tab=reviews">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    {pageSettings.success_page.button_view_reviews}
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
            <h2 className="text-3xl font-bold text-center mb-8">{pageSettings.benefits_section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pageSettings.benefits_section.cards.map((card, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    {card.icon === 'award' ? <FiAward size={32} /> : card.icon === 'check' ? <FiCheckCircle size={32} /> : <FiStar size={32} />}
                  </div>
                  <h3 className="font-bold mb-2">{card.title}</h3>
                  <p className="text-sm opacity-90">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteReviewPage;
