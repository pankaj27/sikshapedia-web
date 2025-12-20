/**
 * AdmissionBookingModal - Admission form with payment integration
 * For booking seats at admission partner institutions
 */
import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiUpload, FiCheck, FiAlertCircle, FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiFileText, FiCreditCard } from 'react-icons/fi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import api from '../api/axios';

const AdmissionBookingModal = ({ isOpen, onClose, institution, institutionType = 'college' }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Review, 3: Payment, 4: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [settings, setSettings] = useState(null);
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [institutionDetails, setInstitutionDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  
  const [formData, setFormData] = useState({
    student_name: '',
    father_name: '',
    mother_name: '',
    dob: '',
    address: '',
    state: '',
    city: '',
    pin: '',
    course_or_class: '',
    aadhaar_number: '',
    mobile: '',
    email: '',
    last_qualification: '',
    photo_url: '',
    aadhaar_doc_url: '',
    qualification_doc_url: ''
  });

  const [uploadProgress, setUploadProgress] = useState({
    photo: null,
    aadhaar: null,
    qualification: null
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  // Fetch states and settings
  useEffect(() => {
    if (isOpen && institution) {
      fetchStates();
      fetchInstitutionDetails();
    }
  }, [isOpen, institution]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.state) {
      fetchCities(formData.state);
    }
  }, [formData.state]);

  const fetchStates = async () => {
    try {
      const response = await api.get('/admission/states');
      setStates(response.data.states || []);
    } catch (err) {
      console.error('Failed to fetch states:', err);
    }
  };

  const fetchCities = async (state) => {
    try {
      const response = await api.get(`/admission/cities/${encodeURIComponent(state)}`);
      setCities(response.data.cities || []);
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    }
  };

  const fetchInstitutionDetails = async () => {
    try {
      // Fetch institution details including courses and fees
      const endpoint = institutionType === 'school' ? `/schools/${institution.id}` :
                       institutionType === 'university' ? `/universities/${institution.id}` :
                       `/colleges/${institution.id}`;
      
      const response = await api.get(endpoint);
      const instData = response.data;
      setInstitutionDetails(instData);
      
      // Extract courses/classes based on institution type
      if (institutionType === 'school') {
        // For schools, use classes_offered
        const classes = instData.classes_offered || instData.classes || 
                        ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
                         'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
        setCourses(classes);
      } else {
        // For colleges/universities, use courses
        const courseList = instData.courses?.map(c => typeof c === 'object' ? c.name : c) || 
                          instData.courses_offered || 
                          instData.streams || 
                          ['B.Tech', 'M.Tech', 'MBA', 'BBA', 'BCA', 'MCA'];
        setCourses(courseList);
      }
      
      // Fetch institution-specific fee settings (or fall back to entity defaults)
      await fetchSettings(instData);
    } catch (err) {
      console.error('Failed to fetch institution details:', err);
      // Fall back to default courses
      if (institutionType === 'school') {
        setCourses(['Nursery', 'LKG', 'UKG', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12']);
      } else {
        setCourses(['B.Tech', 'M.Tech', 'MBA', 'BBA', 'BCA', 'MCA', 'B.Com', 'M.Com']);
      }
      await fetchSettings(null);
    }
  };

  const fetchSettings = async (instData) => {
    try {
      // Check if institution has specific fees, otherwise use entity defaults
      if (instData?.admission_fees) {
        setSettings({
          form_fee: instData.admission_fees.form_fee || 1000,
          platform_fee: instData.admission_fees.platform_fee || 250,
          gst_percentage: instData.admission_fees.gst_percentage || 18,
          total: ((instData.admission_fees.form_fee || 1000) + (instData.admission_fees.platform_fee || 250)) * 
                 (1 + (instData.admission_fees.gst_percentage || 18) / 100)
        });
      } else {
        // Fetch entity-specific fee settings as fallback
        const entityType = institutionType || 'college';
        const response = await api.get('/admission/settings', {
          params: { entity_type: entityType }
        });
        setSettings(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      // Default fallback
      setSettings({
        form_fee: institutionType === 'school' ? 500 : institutionType === 'university' ? 1500 : 1000,
        platform_fee: institutionType === 'school' ? 150 : institutionType === 'university' ? 350 : 250,
        gst_percentage: 18
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (100KB max)
    if (file.size > 102400) {
      setError(`File too large. Maximum size is 100KB. Your file is ${(file.size / 1024).toFixed(1)}KB`);
      return;
    }

    setUploadProgress(prev => ({ ...prev, [docType]: 'uploading' }));

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('document_type', docType);

    try {
      const response = await api.post('/admission/upload-document', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const fieldName = docType === 'photo' ? 'photo_url' : 
                       docType === 'aadhaar' ? 'aadhaar_doc_url' : 'qualification_doc_url';
      
      setFormData(prev => ({ ...prev, [fieldName]: response.data.url }));
      setUploadProgress(prev => ({ ...prev, [docType]: 'done' }));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file');
      setUploadProgress(prev => ({ ...prev, [docType]: null }));
    }
  };

  const calculateFees = () => {
    if (!settings) return { formFee: 1000, platformFee: 250, gst: 225, total: 1475 };
    
    const formFee = settings.form_fee || 1000;
    const platformFee = settings.platform_fee || 250;
    const gstPercentage = settings.gst_percentage || 18;
    const subtotal = formFee + platformFee;
    const gst = Math.round(subtotal * gstPercentage / 100);
    const total = subtotal + gst;
    
    return { formFee, platformFee, gst, total, gstPercentage };
  };

  const validateForm = () => {
    const required = [
      'student_name', 'father_name', 'mother_name', 'dob', 'address',
      'state', 'city', 'pin', 'course_or_class', 'aadhaar_number',
      'mobile', 'email', 'last_qualification'
    ];

    for (const field of required) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/_/g, ' ')}`);
        return false;
      }
    }

    // Validate Aadhaar (12 digits)
    if (!/^\d{12}$/.test(formData.aadhaar_number.replace(/\s/g, ''))) {
      setError('Aadhaar number must be 12 digits');
      return false;
    }

    // Validate mobile (10 digits)
    if (!/^\d{10}$/.test(formData.mobile)) {
      setError('Mobile number must be 10 digits');
      return false;
    }

    // Validate PIN (6 digits)
    if (!/^\d{6}$/.test(formData.pin)) {
      setError('PIN code must be 6 digits');
      return false;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check document uploads
    if (!formData.photo_url) {
      setError('Please upload your photo');
      return false;
    }
    if (!formData.aadhaar_doc_url) {
      setError('Please upload Aadhaar document');
      return false;
    }
    if (!formData.qualification_doc_url) {
      setError('Please upload qualification document');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setStep(2); // Go to review step
  };

  const handleCreateBooking = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/admission/booking', {
        institution_id: institution.id,
        institution_type: institutionType,
        institution_name: institution.name,
        ...formData
      });

      setBooking(response.data.booking);
      setStep(3); // Go to payment step
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;
    
    setLoading(true);
    setError('');

    try {
      // Try to create Razorpay order first
      let orderData;
      let useTestPayment = false;
      
      try {
        const orderResponse = await api.post(`/admission/create-order?booking_id=${booking.id}`);
        orderData = orderResponse.data;
      } catch (orderErr) {
        // If Razorpay fails, use test payment
        console.log('Razorpay order failed, using test payment:', orderErr);
        useTestPayment = true;
        const testOrderResponse = await api.post(`/admission/create-test-order/${booking.id}`);
        orderData = testOrderResponse.data;
      }

      if (useTestPayment || orderData.is_test) {
        // Use test payment flow
        const confirmTest = window.confirm(
          `Test Payment Mode\n\n` +
          `Amount: ₹${(orderData.amount / 100).toFixed(2)}\n\n` +
          `Click OK to simulate successful payment.\n` +
          `(Razorpay keys not configured - using test mode)`
        );
        
        if (confirmTest) {
          const testPayment = await api.post(`/admission/complete-test-payment/${booking.id}`);
          if (testPayment.data.success) {
            // Refresh booking data
            const updatedBooking = await api.get(`/admission/my-bookings`);
            const myBooking = updatedBooking.data.bookings?.find(b => b.id === booking.id);
            if (myBooking) {
              setBooking(myBooking);
            }
            setStep(4); // Success
          }
        } else {
          setLoading(false);
        }
        return;
      }

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Admission Buddy',
        description: `Admission Fee - ${institution.name}`,
        order_id: orderData.order_id,
        prefill: orderData.prefill,
        theme: { color: '#F97316' },
        handler: async function (response) {
          // Verify payment
          try {
            const verifyResponse = await api.post('/admission/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              booking_id: booking.id
            });
            
            setBooking(verifyResponse.data.booking);
            setStep(4); // Success
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const fees = calculateFees();

  if (!isOpen) return null;

  // Check if user is logged in
  if (!user) {
    return (
      <div className="fixed left-0 right-0 bottom-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ top: '64px' }} onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
          <div className="text-center">
            <FiAlertCircle className="mx-auto text-orange-500 mb-4" size={48} />
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-gray-600 mb-4">Please login or register to book admission.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.href = '/login'} className="bg-orange-500 hover:bg-orange-600">
                Login
              </Button>
              <Button onClick={() => window.location.href = '/signup'} variant="outline">
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 right-0 bottom-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ top: '64px' }} onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header with Institution Info */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sticky top-0 z-10">
          <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20">
            <FiX size={20} />
          </button>
          
          {/* Institution Logo and Name */}
          <div className="flex items-center gap-3 mb-3">
            {(institutionDetails?.logo || institutionDetails?.logo_url || institution?.logo) ? (
              <img 
                src={institutionDetails?.logo || institutionDetails?.logo_url || institution?.logo} 
                alt={institution?.name}
                className="w-14 h-14 rounded-lg bg-white object-contain p-1"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center text-2xl">
                {institutionType === 'school' ? '🏫' : institutionType === 'university' ? '🏛️' : '🎓'}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-bold leading-tight">{institution?.name}</h2>
              <p className="text-sm text-white/80">
                {institution?.city && institution?.state ? `${institution.city}, ${institution.state}` : 'Book Your Seat'}
              </p>
            </div>
          </div>
          
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {['Form', 'Review', 'Payment', 'Done'].map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step > i + 1 ? 'bg-green-400' : step === i + 1 ? 'bg-white text-green-600' : 'bg-white/30'
                }`}>
                  {step > i + 1 ? <FiCheck /> : i + 1}
                </div>
                {i < 3 && <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-green-400' : 'bg-white/30'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <FiAlertCircle />
              {error}
            </div>
          )}

          {/* Step 1: Form */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiUser className="text-orange-500" /> Student Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                  <Input name="student_name" value={formData.student_name} onChange={handleChange} placeholder="Full Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
                  <Input name="father_name" value={formData.father_name} onChange={handleChange} placeholder="Father's Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name *</label>
                  <Input name="mother_name" value={formData.mother_name} onChange={handleChange} placeholder="Mother's Name" />
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mt-6">
                <FiMapPin className="text-orange-500" /> Address Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <Input name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Select State</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <select name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                  <Input name="pin" value={formData.pin} onChange={handleChange} placeholder="6 digits" maxLength={6} />
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mt-6">
                <FiPhone className="text-orange-500" /> Contact & Course
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <Input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10 digits" maxLength={10} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number *</label>
                  <Input name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} placeholder="12 digits" maxLength={12} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {institutionType === 'school' ? 'Class Applied For' : 'Course Applied For'} *
                  </label>
                  <select 
                    name="course_or_class" 
                    value={formData.course_or_class} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select {institutionType === 'school' ? 'Class' : 'Course'}</option>
                    {courses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {institutionType === 'school' ? 'Last Class Passed' : 'Last Qualification'} *
                </label>
                <Input name="last_qualification" value={formData.last_qualification} onChange={handleChange} 
                  placeholder={institutionType === 'school' ? 'e.g., Class 9 with 85%' : 'e.g., 12th Science with 85%'} />
              </div>

              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mt-6">
                <FiUpload className="text-orange-500" /> Document Upload (Max 100KB each)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors">
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'photo')} className="hidden" id="photo-upload" />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      {uploadProgress.photo === 'done' ? (
                        <span className="text-green-600 flex items-center justify-center gap-1"><FiCheck /> Uploaded</span>
                      ) : uploadProgress.photo === 'uploading' ? (
                        <span className="text-orange-500">Uploading...</span>
                      ) : (
                        <span className="text-gray-500 text-sm">Click to upload</span>
                      )}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors">
                    <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, 'aadhaar')} className="hidden" id="aadhaar-upload" />
                    <label htmlFor="aadhaar-upload" className="cursor-pointer">
                      {uploadProgress.aadhaar === 'done' ? (
                        <span className="text-green-600 flex items-center justify-center gap-1"><FiCheck /> Uploaded</span>
                      ) : uploadProgress.aadhaar === 'uploading' ? (
                        <span className="text-orange-500">Uploading...</span>
                      ) : (
                        <span className="text-gray-500 text-sm">Click to upload</span>
                      )}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors">
                    <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, 'qualification')} className="hidden" id="qual-upload" />
                    <label htmlFor="qual-upload" className="cursor-pointer">
                      {uploadProgress.qualification === 'done' ? (
                        <span className="text-green-600 flex items-center justify-center gap-1"><FiCheck /> Uploaded</span>
                      ) : uploadProgress.qualification === 'uploading' ? (
                        <span className="text-orange-500">Uploading...</span>
                      ) : (
                        <span className="text-gray-500 text-sm">Click to upload</span>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Fee Summary */}
              <div className="bg-orange-50 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Fee Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Form Fee</span><span>₹{fees.formFee}</span></div>
                  <div className="flex justify-between"><span>Platform Fee</span><span>₹{fees.platformFee}</span></div>
                  <div className="flex justify-between"><span>GST ({fees.gstPercentage}%)</span><span>₹{fees.gst}</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span><span className="text-orange-600">₹{fees.total}</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600 mt-4">
                Review Application
              </Button>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Review Your Application</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <p><strong>Student:</strong> {formData.student_name}</p>
                <p><strong>Father:</strong> {formData.father_name}</p>
                <p><strong>Mother:</strong> {formData.mother_name}</p>
                <p><strong>DOB:</strong> {formData.dob}</p>
                <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.pin}</p>
                <p><strong>Mobile:</strong> {formData.mobile}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Aadhaar:</strong> {formData.aadhaar_number}</p>
                <p><strong>Course/Class:</strong> {formData.course_or_class}</p>
                <p><strong>Last Qualification:</strong> {formData.last_qualification}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Payment</span><span className="text-orange-600">₹{fees.total}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Edit
                </Button>
                <Button onClick={handleCreateBooking} disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600">
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && booking && (
            <div className="text-center space-y-4">
              <FiCreditCard className="mx-auto text-orange-500" size={48} />
              <h3 className="font-semibold text-gray-800">Complete Payment</h3>
              <p className="text-gray-600">Application ID: {booking.id}</p>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Amount</span><span className="text-orange-600">₹{booking.total_amount}</span>
                </div>
              </div>

              <Button onClick={handlePayment} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600">
                {loading ? 'Processing...' : 'Pay Now with Razorpay'}
              </Button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FiCheck className="text-green-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-800 text-xl">Application Submitted!</h3>
              <p className="text-gray-600">Your admission application has been submitted successfully.</p>
              <p className="text-sm text-gray-500">Application ID: {booking?.id}</p>
              <p className="text-sm text-gray-500">You will receive a confirmation email shortly.</p>
              
              <div className="flex gap-3 justify-center mt-6">
                <Button onClick={() => window.location.href = '/dashboard'} className="bg-orange-500 hover:bg-orange-600">
                  View My Applications
                </Button>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionBookingModal;
