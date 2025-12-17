import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiTrash2, FiSend, FiCheck, FiChevronDown, FiChevronRight, FiBook, FiInfo, FiFileText, FiDollarSign, FiBriefcase, FiAward, FiUsers, FiMapPin, FiMail, FiHelpCircle, FiBookmark, FiHome, FiBarChart2, FiImage, FiCalendar, FiMessageSquare, FiVideo, FiUpload, FiLoader } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineLibrary } from 'react-icons/hi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { generateSlug } from '../../utils/slugify';
import StatusBadge from '../../components/admin/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';

// Menu icon options
const menuIconOptions = [
  { id: 'info', label: 'Info', icon: <FiInfo size={16} /> },
  { id: 'overview', label: 'Overview', icon: <FiHome size={16} /> },
  { id: 'syllabus', label: 'Syllabus', icon: <FiBook size={16} /> },
  { id: 'eligibility', label: 'Eligibility', icon: <FiFileText size={16} /> },
  { id: 'admission', label: 'Admission', icon: <HiOutlineAcademicCap size={16} /> },
  { id: 'fees', label: 'Fees', icon: <FiDollarSign size={16} /> },
  { id: 'career', label: 'Career', icon: <FiBriefcase size={16} /> },
  { id: 'colleges', label: 'Colleges', icon: <HiOutlineLibrary size={16} /> },
  { id: 'salary', label: 'Salary', icon: <HiOutlineCurrencyRupee size={16} /> },
  { id: 'comparison', label: 'Comparison', icon: <FiBarChart2 size={16} /> },
  { id: 'faq', label: 'FAQ', icon: <FiHelpCircle size={16} /> },
  { id: 'reviews', label: 'Reviews', icon: <FiMessageSquare size={16} /> },
  { id: 'default', label: 'Default', icon: <FiBookmark size={16} /> },
];

const getMenuIconById = (iconId) => {
  const found = menuIconOptions.find(opt => opt.id === iconId);
  return found ? found.icon : <FiBookmark size={16} />;
};

// Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = false, icon = null, badge = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {badge && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{badge}</span>}
        </div>
        {isOpen ? <FiChevronDown className="w-4 h-4 text-gray-500" /> : <FiChevronRight className="w-4 h-4 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

const CourseDetailForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [streams, setStreams] = useState([]);
  const [subStreams, setSubStreams] = useState([]);
  const [exams, setExams] = useState([]);
  const [coursesList, setCoursesList] = useState([]); // List of courses from Quick Entry

  // Role checks
  const isDataEntry = user?.role === 'data_entry';
  const canApprove = user?.role === 'super_admin' || user?.role === 'content_manager';

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    full_name: '',
    degree_type: 'UG',
    duration: '',
    stream_id: '',
    sub_stream_ids: [],
    exam_ids: [],
    description: '',
    description_toc: [], // [{title, anchor, content, image, video}]
    description_tables: [], // [{title, headers: [], rows: [[]]}]
    description_images: [], // [{url, caption}]
    description_videos: [], // [{url, title}]
    overview: '',
    eligibility: '',
    admission_process: '',
    selection_criteria: '',
    career_prospects: '',
    top_colleges: [],
    average_fees: 0,
    salary_range: { min: 0, max: 0 },
    course_syllabus: [],
    subjects: [],
    skills_acquired: [],
    job_opportunities: [],
    popular_specializations: [],
    is_popular: false,
    total_colleges_offering: 0,
    status: 'draft',
    base_course_id: '', // Reference to the course from Quick Entry
    // SEO Fields
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    seo_intro: '',
    seo_full_content: '',
    seo_toc: [], // Table of Contents [{title, anchor, content, image, video}]
    seo_tables: [], // [{title, headers: [], rows: [[]]}]
    seo_images: [], // [{url, caption}]
    seo_videos: [], // [{url, title}]
    // Menu Configuration
    menu_config: {
      use_custom_menu: false,
      auto_from_toc: false,
      items: []
    }
  });

  const [uploadingImage, setUploadingImage] = useState(null); // Track which TOC index is uploading image
  const [uploadingVideo, setUploadingVideo] = useState(null); // Track which TOC index is uploading video
  const [uploadingSeoImage, setUploadingSeoImage] = useState(false);
  const [uploadingSeoVideo, setUploadingSeoVideo] = useState(false);

  useEffect(() => {
    fetchDropdownData();
    if (id) {
      fetchCourse();
    }
  }, [id]);

  // Handle image upload for TOC section
  const handleTocImageUpload = async (file, tocIndex) => {
    if (!file) return;
    setUploadingImage(tocIndex);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newToc = [...(formData.seo_toc || [])];
      newToc[tocIndex].image = response.data.url;
      setFormData({ ...formData, seo_toc: newToc });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(null);
    }
  };

  // Handle video upload for TOC section
  const handleTocVideoUpload = async (file, tocIndex) => {
    if (!file) return;
    setUploadingVideo(tocIndex);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newToc = [...(formData.seo_toc || [])];
      newToc[tocIndex].video = response.data.url;
      setFormData({ ...formData, seo_toc: newToc });
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setUploadingVideo(null);
    }
  };

  // Handle SEO content image upload
  const handleSeoImageUpload = async (file) => {
    if (!file) return;
    setUploadingSeoImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ 
        ...formData, 
        seo_images: [...(formData.seo_images || []), { url: response.data.url, caption: '' }]
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingSeoImage(false);
    }
  };

  // Handle SEO content video upload
  const handleSeoVideoUpload = async (file) => {
    if (!file) return;
    setUploadingSeoVideo(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ 
        ...formData, 
        seo_videos: [...(formData.seo_videos || []), { url: response.data.url, title: '' }]
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setUploadingSeoVideo(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [streamsRes, subStreamsRes, examsRes, coursesRes] = await Promise.all([
        api.get('/streams'),
        api.get('/sub-streams'),
        api.get('/exams'),
        api.get('/courses?limit=500') // Fetch all courses from Quick Entry
      ]);
      setStreams(streamsRes.data);
      setSubStreams(subStreamsRes.data);
      setExams(examsRes.data);
      setCoursesList(coursesRes.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  // Handle course selection from dropdown
  const handleCourseSelect = (e) => {
    const selectedCourseId = e.target.value;
    if (!selectedCourseId) {
      // Reset to empty if no course selected
      setFormData({
        ...formData,
        name: '',
        slug: '',
        full_name: '',
        degree_type: 'UG',
        duration: '',
        eligibility: '',
        base_course_id: ''
      });
      return;
    }
    
    const selectedCourse = coursesList.find(c => c.id === selectedCourseId);
    if (selectedCourse) {
      setFormData({
        ...formData,
        name: selectedCourse.name,
        slug: selectedCourse.slug || generateSlug(selectedCourse.name),
        full_name: selectedCourse.full_name || '',
        degree_type: selectedCourse.degree_type || 'UG',
        duration: selectedCourse.duration || '',
        eligibility: selectedCourse.eligibility || '',
        base_course_id: selectedCourse.id // Store reference to the base course
      });
    }
  };

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${id}`);
      setFormData({ ...formData, ...response.data });
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'name' && (!formData.slug || formData.slug === generateSlug(formData.name))) {
      setFormData({ 
        ...formData, 
        [name]: value,
        slug: generateSlug(value)
      });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData({ ...formData, [field]: [...formData[field], defaultValue] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setFormData({ ...formData, [field]: newValues });
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        status: saveAsDraft ? 'draft' : formData.status
      };
      
      if (id) {
        await api.put(`/courses/${id}`, dataToSave);
        alert('Course updated successfully!');
      } else {
        await api.post('/courses', dataToSave);
        alert('Course created successfully!');
      }
      navigate('/admin/courses-detail');
    } catch (error) {
      console.error('Error saving course:', error);
      alert(`Failed to save course: ${error.response?.data?.detail || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    setActionLoading(true);
    try {
      await api.post(`/admin/submit-for-review/course/${id}`);
      const response = await api.get(`/courses-detail/${id}`);
      setFormData({ ...formData, ...response.data });
      alert('Course submitted for review!');
    } catch (error) {
      console.error('Error submitting for review:', error);
      alert('Error submitting for review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.post(`/admin/approve/course/${id}`, { action: 'approve', comment: 'Approved' });
      const response = await api.get(`/courses-detail/${id}`);
      setFormData({ ...formData, ...response.data });
      alert('Course approved and published!');
    } catch (error) {
      console.error('Error approving:', error);
      alert('Error approving course');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setActionLoading(true);
    try {
      await api.post(`/admin/approve/course/${id}`, { action: 'reject', comment: reason });
      const response = await api.get(`/courses-detail/${id}`);
      setFormData({ ...formData, ...response.data });
      alert('Course rejected');
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Error rejecting course');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{id ? 'Edit Course Details' : 'Add New Course (Detailed)'}</h1>
          {id && formData.status && <StatusBadge status={formData.status} />}
        </div>
        <div className="flex items-center gap-2">
          {/* Approval Actions */}
          {id && formData.status === 'draft' && (
            <Button 
              type="button" 
              onClick={handleSubmitForReview}
              disabled={actionLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FiSend className="mr-2" /> Submit for Review
            </Button>
          )}
          {id && formData.status === 'pending' && canApprove && (
            <>
              <Button 
                type="button" 
                onClick={handleApprove}
                disabled={actionLoading}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <FiCheck className="mr-2" /> Approve
              </Button>
              <Button 
                type="button" 
                onClick={handleReject}
                disabled={actionLoading}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <FiX className="mr-2" /> Reject
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => navigate('/admin/courses-detail')}>
            <FiX className="mr-2" /> Cancel
          </Button>
        </div>
      </div>

      {/* Rejection Reason Alert */}
      {formData.status === 'rejected' && formData.rejection_reason && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <strong>Rejection Reason:</strong> {formData.rejection_reason}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Course Name *</label>
              <select
                value={formData.base_course_id || ''}
                onChange={handleCourseSelect}
                required
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select a Course --</option>
                {coursesList.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} {course.full_name ? `(${course.full_name})` : ''} - {course.degree_type}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select from courses created in Quick Entry. {coursesList.length} courses available.
              </p>
            </div>

            {formData.name && (
              <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {formData.name} 
                  {formData.full_name && ` • ${formData.full_name}`}
                  {formData.degree_type && ` • ${formData.degree_type}`}
                  {formData.duration && ` • ${formData.duration}`}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL) *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g., Bachelor of Technology in Computer Science"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Degree Type *</label>
              <select
                name="degree_type"
                value={formData.degree_type}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
                <option value="PhD">PhD/Doctorate</option>
                <option value="PG Diploma">PG Diploma</option>
                <option value="Professional">Professional</option>
                <option value="Integrated">Integrated</option>
                <option value="Super Specialty">Super Specialty</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="e.g., 4 Years"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Average Fees (Annual)</label>
              <input
                type="number"
                name="average_fees"
                value={formData.average_fees}
                onChange={handleChange}
                placeholder="e.g., 200000"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Colleges Offering</label>
              <input
                type="number"
                name="total_colleges_offering"
                value={formData.total_colleges_offering}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Stream & Exam Tagging */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Category & Tagging</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stream *</label>
              <select
                name="stream_id"
                value={formData.stream_id}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Stream</option>
                {streams.map(stream => (
                  <option key={stream.id} value={stream.id}>{stream.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sub-Streams (Select Multiple)</label>
              <div className="border rounded p-3 max-h-48 overflow-y-auto">
                {subStreams
                  .filter(ss => ss.stream_id === formData.stream_id)
                  .map(subStream => (
                    <label key={subStream.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sub_stream_ids?.includes(subStream.id)}
                        onChange={() => handleMultiSelect('sub_stream_ids', subStream.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{subStream.name}</span>
                    </label>
                  ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Related Exams (Select Multiple)</label>
              <div className="border rounded p-3 max-h-48 overflow-y-auto">
                {exams.map(exam => (
                  <label key={exam.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.exam_ids?.includes(exam.id)}
                      onChange={() => handleMultiSelect('exam_ids', exam.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{exam.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Course Details</h2>
          <div className="space-y-4">
            {/* Description with Rich Content */}
            <CollapsibleSection title="Description *" icon="📝" defaultOpen={true} badge={`${formData.description_toc?.length || 0} sections`}>
              <div className="space-y-4">
                {/* Main Description Text */}
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Brief description of the course..."
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Description TOC Builder */}
                <div className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-indigo-800">📑 Table of Contents</label>
                      <p className="text-xs text-indigo-600">Build content sections for description</p>
                    </div>
                    <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded">
                      {formData.description_toc?.length || 0} sections
                    </span>
                  </div>

                  {/* TOC Items */}
                  <div className="space-y-3 mb-4">
                    {(formData.description_toc || []).map((item, index) => (
                      <div key={index} className="bg-white rounded-lg border-2 border-indigo-200 p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Section Title *</label>
                                <input
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const newToc = [...(formData.description_toc || [])];
                                    newToc[index].title = e.target.value;
                                    newToc[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 50);
                                    setFormData({...formData, description_toc: newToc});
                                  }}
                                  placeholder="e.g., What is this course?"
                                  className="w-full border-2 border-indigo-200 rounded px-2 py-1.5 text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Anchor ID</label>
                                <input
                                  type="text"
                                  value={item.anchor || ''}
                                  onChange={(e) => {
                                    const newToc = [...(formData.description_toc || [])];
                                    newToc[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                    setFormData({...formData, description_toc: newToc});
                                  }}
                                  placeholder="auto-generated"
                                  className="w-full border rounded px-2 py-1.5 text-sm font-mono bg-gray-50"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Content *</label>
                              <textarea
                                value={item.content || ''}
                                onChange={(e) => {
                                  const newToc = [...(formData.description_toc || [])];
                                  newToc[index].content = e.target.value;
                                  setFormData({...formData, description_toc: newToc});
                                }}
                                placeholder="Write content... HTML supported."
                                rows="3"
                                className="w-full border rounded px-2 py-1.5 text-sm"
                              />
                            </div>
                            {/* Image & Video for this section */}
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-indigo-100">
                              {/* Image */}
                              <div>
                                <label className="block text-xs text-gray-600 mb-1"><FiImage className="inline mr-1" /> Image</label>
                                {item.image ? (
                                  <div className="relative">
                                    <img src={item.image} alt="" className="w-full h-20 object-cover rounded border" />
                                    <button type="button" onClick={() => {
                                      const newToc = [...(formData.description_toc || [])];
                                      newToc[index].image = '';
                                      setFormData({...formData, description_toc: newToc});
                                    }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><FiX size={10} /></button>
                                  </div>
                                ) : (
                                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-indigo-300 rounded cursor-pointer hover:bg-indigo-100">
                                    <FiUpload className="text-indigo-400" size={16} />
                                    <span className="text-xs text-indigo-600">Upload</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const fd = new FormData();
                                        fd.append('file', file);
                                        const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
                                        const newToc = [...(formData.description_toc || [])];
                                        newToc[index].image = res.data.url;
                                        setFormData({...formData, description_toc: newToc});
                                      }
                                    }} />
                                  </label>
                                )}
                              </div>
                              {/* Video URL */}
                              <div>
                                <label className="block text-xs text-gray-600 mb-1"><FiVideo className="inline mr-1" /> Video URL</label>
                                <input
                                  type="text"
                                  value={item.video || ''}
                                  onChange={(e) => {
                                    const newToc = [...(formData.description_toc || [])];
                                    newToc[index].video = e.target.value;
                                    setFormData({...formData, description_toc: newToc});
                                  }}
                                  placeholder="YouTube/Video URL"
                                  className="w-full border-2 border-indigo-200 rounded px-2 py-1.5 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                          <button type="button" onClick={() => {
                            setFormData({...formData, description_toc: (formData.description_toc || []).filter((_, i) => i !== index)});
                          }} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><FiTrash2 /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => {
                    setFormData({...formData, description_toc: [...(formData.description_toc || []), { title: '', anchor: '', content: '', image: '', video: '' }]});
                  }} className="text-sm text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded border border-indigo-300 flex items-center gap-1">
                    <FiPlus /> Add Section
                  </button>
                </div>

                {/* Description Table Builder */}
                <div className="border-2 border-teal-300 rounded-lg p-4 bg-teal-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-teal-800">📊 Tables</label>
                      <p className="text-xs text-teal-600">Add data tables</p>
                    </div>
                    <span className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded">
                      {formData.description_tables?.length || 0} tables
                    </span>
                  </div>
                  <div className="space-y-4 mb-4">
                    {(formData.description_tables || []).map((table, tableIndex) => (
                      <div key={tableIndex} className="bg-white rounded-lg border-2 border-teal-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <input type="text" value={table.title || ''} onChange={(e) => {
                            const newTables = [...(formData.description_tables || [])];
                            newTables[tableIndex].title = e.target.value;
                            setFormData({...formData, description_tables: newTables});
                          }} placeholder="Table Title" className="border rounded px-2 py-1 text-sm w-48" />
                          <div className="flex gap-1">
                            <button type="button" onClick={() => {
                              const newTables = [...(formData.description_tables || [])];
                              newTables[tableIndex].headers.push('Column');
                              newTables[tableIndex].rows.forEach(row => row.push(''));
                              setFormData({...formData, description_tables: newTables});
                            }} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">+ Col</button>
                            <button type="button" onClick={() => {
                              const newTables = [...(formData.description_tables || [])];
                              newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
                              setFormData({...formData, description_tables: newTables});
                            }} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">+ Row</button>
                            <button type="button" onClick={() => {
                              setFormData({...formData, description_tables: (formData.description_tables || []).filter((_, i) => i !== tableIndex)});
                            }} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Delete</button>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr>
                                {(table.headers || []).map((header, colIndex) => (
                                  <th key={colIndex} className="border border-teal-200 bg-teal-100 p-1">
                                    <input type="text" value={header} onChange={(e) => {
                                      const newTables = [...(formData.description_tables || [])];
                                      newTables[tableIndex].headers[colIndex] = e.target.value;
                                      setFormData({...formData, description_tables: newTables});
                                    }} className="w-full border-0 bg-transparent font-semibold text-center text-teal-800 text-xs" placeholder="Header" />
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(table.rows || []).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {row.map((cell, colIndex) => (
                                    <td key={colIndex} className="border border-teal-200 p-1">
                                      <input type="text" value={cell} onChange={(e) => {
                                        const newTables = [...(formData.description_tables || [])];
                                        newTables[tableIndex].rows[rowIndex][colIndex] = e.target.value;
                                        setFormData({...formData, description_tables: newTables});
                                      }} className="w-full border-0 text-xs" />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => {
                    setFormData({...formData, description_tables: [...(formData.description_tables || []), { title: '', headers: ['Column 1', 'Column 2'], rows: [['', '']] }]});
                  }} className="text-sm text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded border border-teal-300 flex items-center gap-1">
                    <FiPlus /> Add Table
                  </button>
                </div>

                {/* Description Images */}
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800">🖼️ Images</label>
                      <p className="text-xs text-blue-600">Add images for description</p>
                    </div>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      {formData.description_images?.length || 0} images
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {(formData.description_images || []).map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img.url} alt="" className="w-full h-20 object-cover rounded-lg border-2 border-blue-200" />
                        <button type="button" onClick={() => {
                          setFormData({...formData, description_images: (formData.description_images || []).filter((_, i) => i !== index)});
                        }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><FiX size={10} /></button>
                        <input type="text" value={img.caption || ''} onChange={(e) => {
                          const newImages = [...(formData.description_images || [])];
                          newImages[index].caption = e.target.value;
                          setFormData({...formData, description_images: newImages});
                        }} placeholder="Caption" className="w-full mt-1 text-xs border rounded px-2 py-1" />
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100">
                      <FiUpload className="text-blue-400" size={18} />
                      <span className="text-xs text-blue-600">Add Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const fd = new FormData();
                          fd.append('file', file);
                          const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
                          setFormData({...formData, description_images: [...(formData.description_images || []), { url: res.data.url, caption: '' }]});
                        }
                      }} />
                    </label>
                  </div>
                </div>

                {/* Description Videos (URL only) */}
                <div className="border-2 border-rose-300 rounded-lg p-4 bg-rose-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-rose-800">🎬 Videos</label>
                      <p className="text-xs text-rose-600">Add video URLs</p>
                    </div>
                    <span className="text-xs bg-rose-200 text-rose-800 px-2 py-1 rounded">
                      {formData.description_videos?.length || 0} videos
                    </span>
                  </div>
                  {(formData.description_videos || []).length > 0 && (
                    <div className="space-y-2 mb-4">
                      {(formData.description_videos || []).map((vid, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white rounded border-2 border-rose-200 p-2">
                          <FiVideo className="text-rose-500" size={18} />
                          <input type="text" value={vid.title || ''} onChange={(e) => {
                            const newVideos = [...(formData.description_videos || [])];
                            newVideos[index].title = e.target.value;
                            setFormData({...formData, description_videos: newVideos});
                          }} placeholder="Title" className="border rounded px-2 py-1 text-sm w-32" />
                          <input type="text" value={vid.url || ''} onChange={(e) => {
                            const newVideos = [...(formData.description_videos || [])];
                            newVideos[index].url = e.target.value;
                            setFormData({...formData, description_videos: newVideos});
                          }} placeholder="Video URL" className="flex-1 border rounded px-2 py-1 text-sm font-mono" />
                          <button type="button" onClick={() => {
                            setFormData({...formData, description_videos: (formData.description_videos || []).filter((_, i) => i !== index)});
                          }} className="text-red-500 p-1"><FiTrash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input type="text" placeholder="Paste YouTube/Video URL" className="flex-1 border-2 border-rose-200 rounded px-3 py-2 text-sm" id="desc-video-url-input" />
                    <button type="button" onClick={() => {
                      const input = document.getElementById('desc-video-url-input');
                      if (input.value) {
                        setFormData({...formData, description_videos: [...(formData.description_videos || []), { url: input.value, title: '' }]});
                        input.value = '';
                      }
                    }} className="px-3 py-2 bg-rose-600 text-white text-sm rounded hover:bg-rose-700 flex items-center gap-1">
                      <FiPlus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <div>
              <label className="block text-sm font-medium mb-1">Overview</label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows="4"
                placeholder="Detailed course overview..."
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Eligibility Criteria</label>
              <textarea
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., 10+2 with 60% marks in PCM"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Admission Process</label>
              <textarea
                name="admission_process"
                value={formData.admission_process}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Selection Criteria</label>
              <textarea
                name="selection_criteria"
                value={formData.selection_criteria}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Career Prospects</label>
              <textarea
                name="career_prospects"
                value={formData.career_prospects}
                onChange={handleChange}
                rows="4"
                placeholder="Career opportunities and growth prospects..."
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Salary Range */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Salary Range</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Salary (Annual)</label>
              <input
                type="number"
                value={formData.salary_range?.min || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  salary_range: { ...formData.salary_range, min: parseInt(e.target.value) }
                })}
                placeholder="e.g., 300000"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Maximum Salary (Annual)</label>
              <input
                type="number"
                value={formData.salary_range?.max || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  salary_range: { ...formData.salary_range, max: parseInt(e.target.value) }
                })}
                placeholder="e.g., 1500000"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Arrays - Subjects, Skills, Jobs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Course Components</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subjects</label>
              {formData.subjects?.map((subject, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => handleArrayChange('subjects', index, e.target.value)}
                    placeholder="e.g., Data Structures, Algorithms"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('subjects', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('subjects', '')} size="sm">
                <FiPlus className="mr-2" /> Add Subject
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Skills Acquired</label>
              {formData.skills_acquired?.map((skill, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange('skills_acquired', index, e.target.value)}
                    placeholder="e.g., Problem Solving, Programming"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('skills_acquired', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('skills_acquired', '')} size="sm">
                <FiPlus className="mr-2" /> Add Skill
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Opportunities</label>
              {formData.job_opportunities?.map((job, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={job}
                    onChange={(e) => handleArrayChange('job_opportunities', index, e.target.value)}
                    placeholder="e.g., Software Engineer, Data Scientist"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('job_opportunities', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('job_opportunities', '')} size="sm">
                <FiPlus className="mr-2" /> Add Job Role
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Popular Specializations</label>
              {formData.popular_specializations?.map((spec, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => handleArrayChange('popular_specializations', index, e.target.value)}
                    placeholder="e.g., Machine Learning, Web Development"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('popular_specializations', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('popular_specializations', '')} size="sm">
                <FiPlus className="mr-2" /> Add Specialization
              </Button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_popular"
              checked={formData.is_popular}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm font-medium">Mark as Popular Course</span>
          </label>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* MENU CONFIGURATION SECTION                                                      */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <CollapsibleSection title="Menu Configuration" icon="🧭" defaultOpen={false}>
          <p className="text-sm text-gray-600 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            💡 Choose how the course detail page menu will be structured. This affects navigation on the frontend.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Default Menu */}
            <label className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
              !formData.menu_config?.use_custom_menu && !formData.menu_config?.auto_from_toc 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}>
              <input
                type="radio"
                name="menu_mode"
                checked={!formData.menu_config?.use_custom_menu && !formData.menu_config?.auto_from_toc}
                onChange={() => setFormData({
                  ...formData,
                  menu_config: { ...formData.menu_config, use_custom_menu: false, auto_from_toc: false }
                })}
                className="absolute top-4 right-4"
              />
              <div className="text-2xl mb-2">🔧</div>
              <p className="font-bold text-gray-800">Default Menu</p>
              <p className="text-xs text-gray-600 mt-1">Standard menu from form sections</p>
            </label>
            
            {/* Auto from TOC */}
            <label className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.menu_config?.auto_from_toc 
                ? 'border-green-500 bg-green-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}>
              <input
                type="radio"
                name="menu_mode"
                checked={formData.menu_config?.auto_from_toc}
                onChange={() => setFormData({
                  ...formData,
                  menu_config: { ...formData.menu_config, use_custom_menu: false, auto_from_toc: true }
                })}
                className="absolute top-4 right-4"
              />
              <div className="text-2xl mb-2">🔗</div>
              <p className="font-bold text-gray-800">Auto from TOC</p>
              <p className="text-xs text-gray-600 mt-1">Menu from TOC sections</p>
            </label>
            
            {/* Custom Menu */}
            <label className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.menu_config?.use_custom_menu 
                ? 'border-orange-500 bg-orange-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-orange-300'
            }`}>
              <input
                type="radio"
                name="menu_mode"
                checked={formData.menu_config?.use_custom_menu}
                onChange={() => setFormData({
                  ...formData,
                  menu_config: { ...formData.menu_config, use_custom_menu: true, auto_from_toc: false }
                })}
                className="absolute top-4 right-4"
              />
              <div className="text-2xl mb-2">✏️</div>
              <p className="font-bold text-gray-800">Custom Menu</p>
              <p className="text-xs text-gray-600 mt-1">Define custom menu items</p>
            </label>
          </div>

          {/* Custom Menu Items Builder */}
          {formData.menu_config?.use_custom_menu && (
            <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50 mt-4">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-orange-800">📋 Custom Menu Items</label>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                  {formData.menu_config?.items?.length || 0} items
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                {(formData.menu_config?.items || []).map((item, index) => (
                  <div key={index} className="bg-white rounded-lg border border-orange-200 p-3">
                    <div className="flex items-center gap-3">
                      <select
                        value={item.icon || 'default'}
                        onChange={(e) => {
                          const newItems = [...(formData.menu_config?.items || [])];
                          newItems[index].icon = e.target.value;
                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                        }}
                        className="border rounded px-2 py-1.5 text-sm w-32"
                      >
                        {menuIconOptions.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={item.label || ''}
                        onChange={(e) => {
                          const newItems = [...(formData.menu_config?.items || [])];
                          newItems[index].label = e.target.value;
                          newItems[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                        }}
                        placeholder="Menu Label"
                        className="flex-1 border rounded px-2 py-1.5 text-sm"
                      />
                      <input
                        type="text"
                        value={item.anchor || ''}
                        onChange={(e) => {
                          const newItems = [...(formData.menu_config?.items || [])];
                          newItems[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                        }}
                        placeholder="anchor-id"
                        className="w-32 border rounded px-2 py-1.5 text-sm font-mono bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = (formData.menu_config?.items || []).filter((_, i) => i !== index);
                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={() => {
                  const newItems = [...(formData.menu_config?.items || []), { label: '', anchor: '', icon: 'default' }];
                  setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                }}
                className="text-sm text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded border border-orange-300 flex items-center gap-1"
              >
                <FiPlus /> Add Menu Item
              </button>
            </div>
          )}
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* SEO & META TAGS SECTION                                                         */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <CollapsibleSection title="SEO & Meta Tags" icon="🏷️" defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Meta Title</label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title || ''}
                onChange={handleChange}
                placeholder="e.g., B.Tech Course 2024 - Eligibility, Fees, Top Colleges, Syllabus"
                className="w-full border rounded px-3 py-2"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.meta_title || '').length}/60 characters</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea
                name="meta_description"
                value={formData.meta_description || ''}
                onChange={handleChange}
                placeholder="Brief description for search engines (150-160 characters recommended)"
                className="w-full border rounded px-3 py-2"
                rows="2"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.meta_description || '').length}/160 characters</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Meta Keywords</label>
              <input
                type="text"
                name="meta_keywords"
                value={formData.meta_keywords || ''}
                onChange={handleChange}
                placeholder="e.g., btech, engineering, computer science, admission 2024"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* SEO CONTENT SECTION WITH TOC & TABLES                                           */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <CollapsibleSection title="SEO Content (Detail Page)" icon="🔍" defaultOpen={false} badge={`${formData.seo_toc?.length || 0} sections`}>
          <p className="text-sm text-gray-600 mb-4">
            This content appears on the course detail page for better SEO and user engagement.
          </p>
          
          <div className="space-y-6">
            {/* SEO Intro */}
            <div>
              <label className="block text-sm font-medium mb-1">SEO Intro (Short Preview)</label>
              <textarea
                name="seo_intro"
                value={formData.seo_intro || ''}
                onChange={handleChange}
                rows="3"
                placeholder="Brief introduction about this course (3-4 lines visible before 'Read More')"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Table of Contents Builder */}
            <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-purple-800">📑 Table of Contents</label>
                  <p className="text-xs text-purple-600">Build clickable TOC sections for the course page</p>
                </div>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                  {formData.seo_toc?.length || 0} sections
                </span>
              </div>

              {/* TOC Items */}
              <div className="space-y-3 mb-4">
                {(formData.seo_toc || []).map((item, index) => (
                  <div key={index} className="bg-white rounded-lg border-2 border-purple-200 p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-800 rounded-full font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Section Title *</label>
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => {
                                const newToc = [...(formData.seo_toc || [])];
                                newToc[index].title = e.target.value;
                                newToc[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 50);
                                setFormData({...formData, seo_toc: newToc});
                              }}
                              placeholder="e.g., Course Overview"
                              className="w-full border-2 border-purple-200 rounded px-2 py-1.5 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Anchor ID (auto)</label>
                            <input
                              type="text"
                              value={item.anchor || ''}
                              onChange={(e) => {
                                const newToc = [...(formData.seo_toc || [])];
                                newToc[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                setFormData({...formData, seo_toc: newToc});
                              }}
                              placeholder="course-overview"
                              className="w-full border rounded px-2 py-1.5 text-sm font-mono bg-gray-50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Section Content *</label>
                          <textarea
                            value={item.content || ''}
                            onChange={(e) => {
                              const newToc = [...(formData.seo_toc || [])];
                              newToc[index].content = e.target.value;
                              setFormData({...formData, seo_toc: newToc});
                            }}
                            placeholder="Write detailed content for this section... HTML tags supported."
                            rows="4"
                            className="w-full border rounded px-2 py-1.5 text-sm"
                          />
                        </div>

                        {/* Image & Video Upload for this TOC Section */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-100">
                          {/* Image Upload */}
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              <FiImage className="inline mr-1" /> Section Image
                            </label>
                            {item.image ? (
                              <div className="relative">
                                <img src={item.image} alt="Section" className="w-full h-24 object-cover rounded border" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newToc = [...(formData.seo_toc || [])];
                                    newToc[index].image = '';
                                    setFormData({...formData, seo_toc: newToc});
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs"
                                >
                                  <FiX size={12} />
                                </button>
                              </div>
                            ) : (
                              <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-purple-300 rounded cursor-pointer hover:bg-purple-50 transition-colors ${uploadingImage === index ? 'opacity-50' : ''}`}>
                                {uploadingImage === index ? (
                                  <FiLoader className="animate-spin text-purple-500" size={20} />
                                ) : (
                                  <>
                                    <FiUpload className="text-purple-400 mb-1" size={18} />
                                    <span className="text-xs text-purple-600">Upload Image</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleTocImageUpload(e.target.files[0], index)}
                                  disabled={uploadingImage === index}
                                />
                              </label>
                            )}
                          </div>

                          {/* Video URL */}
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              <FiVideo className="inline mr-1" /> Section Video
                            </label>
                            {item.video ? (
                              <div className="relative bg-gray-900 rounded p-3">
                                <div className="flex items-center gap-2 text-white">
                                  <FiVideo size={20} />
                                  <span className="text-xs truncate flex-1">{item.video}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newToc = [...(formData.seo_toc || [])];
                                    newToc[index].video = '';
                                    setFormData({...formData, seo_toc: newToc});
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs"
                                >
                                  <FiX size={12} />
                                </button>
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={item.video || ''}
                                onChange={(e) => {
                                  const newToc = [...(formData.seo_toc || [])];
                                  newToc[index].video = e.target.value;
                                  setFormData({...formData, seo_toc: newToc});
                                }}
                                placeholder="Paste YouTube/video URL"
                                className="w-full border-2 border-purple-200 rounded px-2 py-2 text-sm"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            seo_toc: (formData.seo_toc || []).filter((_, i) => i !== index)
                          });
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Section Button */}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    seo_toc: [...(formData.seo_toc || []), { title: '', anchor: '', content: '', image: '', video: '' }]
                  });
                }}
                className="text-sm text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded border border-purple-300 flex items-center gap-1"
              >
                <FiPlus /> Add TOC Section
              </button>

              {/* Quick Add Templates */}
              <div className="mt-4 p-3 bg-white border border-purple-200 rounded-lg">
                <p className="text-xs font-medium text-purple-800 mb-2">💡 Quick Add Common Sections:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { title: 'Course Overview', anchor: 'course-overview' },
                    { title: 'Eligibility Criteria', anchor: 'eligibility-criteria' },
                    { title: 'Admission Process', anchor: 'admission-process' },
                    { title: 'Fee Structure', anchor: 'fee-structure' },
                    { title: 'Syllabus', anchor: 'syllabus' },
                    { title: 'Career Prospects', anchor: 'career-prospects' },
                    { title: 'Top Colleges', anchor: 'top-colleges' },
                    { title: 'Salary Trends', anchor: 'salary-trends' },
                    { title: 'Course Comparison', anchor: 'course-comparison' },
                    { title: 'FAQs', anchor: 'faqs' },
                  ].map((template, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const exists = (formData.seo_toc || []).some(t => t.anchor === template.anchor);
                        if (!exists) {
                          setFormData({
                            ...formData,
                            seo_toc: [...(formData.seo_toc || []), { ...template, content: '' }]
                          });
                        }
                      }}
                      className="text-xs bg-purple-50 border border-purple-200 text-purple-700 px-2 py-1 rounded hover:bg-purple-100"
                    >
                      + {template.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* TOC Preview */}
              {formData.seo_toc?.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">👁️ TOC Preview</h4>
                  <div className="bg-white border rounded p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Table of Contents</p>
                    <ul className="space-y-1">
                      {formData.seo_toc.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center justify-center">{index + 1}</span>
                          <span className="text-sm text-blue-600">{item.title || 'Untitled'}</span>
                          <span className="text-xs text-gray-400">#{item.anchor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const tocHtml = `<nav class="table-of-contents">\n  <h3>Table of Contents</h3>\n  <ul>\n${formData.seo_toc.map(item => `    <li><a href="#${item.anchor}">${item.title}</a></li>`).join('\n')}\n  </ul>\n</nav>\n\n`;
                      const sectionsHtml = formData.seo_toc.map(item => 
                        `<section id="${item.anchor}">\n  <h2>${item.title}</h2>\n  <div class="section-content">\n    ${item.content || ''}\n  </div>\n</section>`
                      ).join('\n\n');
                      setFormData({...formData, seo_full_content: tocHtml + sectionsHtml});
                      alert('SEO Full Content auto-filled with TOC and sections!');
                    }}
                    className="mt-3 w-full text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2"
                  >
                    ⚡ Auto-Fill SEO Content with TOC & Sections
                  </button>
                </div>
              )}
            </div>

            {/* SEO Full Content */}
            <div>
              <label className="block text-sm font-medium mb-1">SEO Full Content</label>
              <textarea
                name="seo_full_content"
                value={formData.seo_full_content || ''}
                onChange={handleChange}
                rows="8"
                placeholder="Detailed SEO content with HTML formatting..."
                className="w-full border rounded px-3 py-2 font-mono text-sm"
              />
            </div>

            {/* Table Builder */}
            <div className="border-2 border-teal-300 rounded-lg p-4 bg-teal-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-teal-800">📊 Table Builder</label>
                  <p className="text-xs text-teal-600">Create tables for fees, comparison, syllabus, etc.</p>
                </div>
                <span className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded">
                  {formData.seo_tables?.length || 0} tables
                </span>
              </div>

              {/* Existing Tables */}
              <div className="space-y-4 mb-4">
                {(formData.seo_tables || []).map((table, tableIndex) => (
                  <div key={tableIndex} className="bg-white rounded-lg border-2 border-teal-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded">Table {tableIndex + 1}</span>
                        <input
                          type="text"
                          value={table.title || ''}
                          onChange={(e) => {
                            const newTables = [...(formData.seo_tables || [])];
                            newTables[tableIndex].title = e.target.value;
                            setFormData({...formData, seo_tables: newTables});
                          }}
                          placeholder="Table Title"
                          className="border rounded px-2 py-1 text-sm w-48"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...(formData.seo_tables || [])];
                            newTables[tableIndex].headers.push('Column');
                            newTables[tableIndex].rows.forEach(row => row.push(''));
                            setFormData({...formData, seo_tables: newTables});
                          }}
                          className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200"
                        >
                          + Column
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...(formData.seo_tables || [])];
                            newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
                            setFormData({...formData, seo_tables: newTables});
                          }}
                          className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200"
                        >
                          + Row
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              seo_tables: (formData.seo_tables || []).filter((_, i) => i !== tableIndex)
                            });
                          }}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Table Editor */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr>
                            {(table.headers || []).map((header, colIndex) => (
                              <th key={colIndex} className="border border-teal-200 bg-teal-100 p-1">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={header}
                                    onChange={(e) => {
                                      const newTables = [...(formData.seo_tables || [])];
                                      newTables[tableIndex].headers[colIndex] = e.target.value;
                                      setFormData({...formData, seo_tables: newTables});
                                    }}
                                    className="w-full border-0 bg-transparent font-semibold text-center text-teal-800 focus:outline-none"
                                    placeholder="Header"
                                  />
                                  {table.headers.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newTables = [...(formData.seo_tables || [])];
                                        newTables[tableIndex].headers.splice(colIndex, 1);
                                        newTables[tableIndex].rows.forEach(row => row.splice(colIndex, 1));
                                        setFormData({...formData, seo_tables: newTables});
                                      }}
                                      className="text-red-500 text-xs"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              </th>
                            ))}
                            <th className="w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {(table.rows || []).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, colIndex) => (
                                <td key={colIndex} className="border border-teal-200 p-1">
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => {
                                      const newTables = [...(formData.seo_tables || [])];
                                      newTables[tableIndex].rows[rowIndex][colIndex] = e.target.value;
                                      setFormData({...formData, seo_tables: newTables});
                                    }}
                                    className="w-full border-0 text-sm focus:outline-none px-1"
                                    placeholder="-"
                                  />
                                </td>
                              ))}
                              <td className="border border-teal-200 p-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newTables = [...(formData.seo_tables || [])];
                                    newTables[tableIndex].rows.splice(rowIndex, 1);
                                    setFormData({...formData, seo_tables: newTables});
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Copy Table HTML */}
                    <button
                      type="button"
                      onClick={() => {
                        const html = `<table class="data-table">\n  <caption>${table.title || ''}</caption>\n  <thead>\n    <tr>${table.headers.map(h => `<th>${h}</th>`).join('')}</tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('\n')}\n  </tbody>\n</table>`;
                        navigator.clipboard.writeText(html);
                        alert('Table HTML copied!');
                      }}
                      className="mt-2 text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200"
                    >
                      📋 Copy Table HTML
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Table Button */}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    seo_tables: [...(formData.seo_tables || []), { title: '', headers: ['Column 1', 'Column 2'], rows: [['', '']] }]
                  });
                }}
                className="text-sm text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded border border-teal-300 flex items-center gap-1"
              >
                <FiPlus /> Add Table
              </button>
            </div>

            {/* SEO Images Gallery */}
            <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800">🖼️ Image Gallery</label>
                  <p className="text-xs text-blue-600">Add images for this course page</p>
                </div>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  {formData.seo_images?.length || 0} images
                </span>
              </div>

              {/* Existing Images */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {(formData.seo_images || []).map((img, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={img.url} 
                      alt={img.caption || `Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          seo_images: (formData.seo_images || []).filter((_, i) => i !== index)
                        });
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={12} />
                    </button>
                    <input
                      type="text"
                      value={img.caption || ''}
                      onChange={(e) => {
                        const newImages = [...(formData.seo_images || [])];
                        newImages[index].caption = e.target.value;
                        setFormData({...formData, seo_images: newImages});
                      }}
                      placeholder="Caption"
                      className="w-full mt-1 text-xs border rounded px-2 py-1"
                    />
                  </div>
                ))}

                {/* Upload New Image */}
                <label className={`flex flex-col items-center justify-center h-24 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors ${uploadingSeoImage ? 'opacity-50' : ''}`}>
                  {uploadingSeoImage ? (
                    <FiLoader className="animate-spin text-blue-500" size={24} />
                  ) : (
                    <>
                      <FiUpload className="text-blue-400 mb-1" size={20} />
                      <span className="text-xs text-blue-600">Add Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleSeoImageUpload(e.target.files[0])}
                    disabled={uploadingSeoImage}
                  />
                </label>
              </div>

              {/* URL Input for Image */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or paste image URL and click Add"
                  className="flex-1 border rounded px-3 py-2 text-sm"
                  id="seo-image-url-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('seo-image-url-input');
                    if (input.value) {
                      setFormData({
                        ...formData,
                        seo_images: [...(formData.seo_images || []), { url: input.value, caption: '' }]
                      });
                      input.value = '';
                    }
                  }}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* SEO Videos Gallery */}
            <div className="border-2 border-rose-300 rounded-lg p-4 bg-rose-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-rose-800">🎬 Video Gallery</label>
                  <p className="text-xs text-rose-600">Add YouTube or video embed URLs</p>
                </div>
                <span className="text-xs bg-rose-200 text-rose-800 px-2 py-1 rounded">
                  {formData.seo_videos?.length || 0} videos
                </span>
              </div>

              {/* Existing Videos */}
              {(formData.seo_videos || []).length > 0 && (
                <div className="space-y-3 mb-4">
                  {(formData.seo_videos || []).map((vid, index) => (
                    <div key={index} className="bg-white rounded-lg border-2 border-rose-200 p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-lg flex-shrink-0">
                          <FiVideo className="text-white" size={20} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={vid.title || ''}
                            onChange={(e) => {
                              const newVideos = [...(formData.seo_videos || [])];
                              newVideos[index].title = e.target.value;
                              setFormData({...formData, seo_videos: newVideos});
                            }}
                            placeholder="Video Title"
                            className="w-full border rounded px-3 py-1.5 text-sm"
                          />
                          <input
                            type="text"
                            value={vid.url || ''}
                            onChange={(e) => {
                              const newVideos = [...(formData.seo_videos || [])];
                              newVideos[index].url = e.target.value;
                              setFormData({...formData, seo_videos: newVideos});
                            }}
                            placeholder="Video URL"
                            className="w-full border rounded px-3 py-1.5 text-xs font-mono text-gray-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              seo_videos: (formData.seo_videos || []).filter((_, i) => i !== index)
                            });
                          }}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Video URL */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube or video URL"
                  className="flex-1 border-2 border-rose-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  id="seo-video-url-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('seo-video-url-input');
                    if (input.value) {
                      setFormData({
                        ...formData,
                        seo_videos: [...(formData.seo_videos || []), { url: input.value, title: '' }]
                      });
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 flex items-center gap-2"
                >
                  <FiPlus size={16} /> Add Video
                </button>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/courses-detail')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="bg-orange-600 hover:bg-orange-700">
            <FiSave className="mr-2" />
            {saving ? 'Saving...' : id ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseDetailForm;
