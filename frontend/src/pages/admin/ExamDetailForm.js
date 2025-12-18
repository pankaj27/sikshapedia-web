import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiSave, FiX, FiPlus, FiTrash2, FiSend, FiCheck, FiUpload, FiLink, FiFile,
  FiChevronDown, FiChevronRight, FiCalendar, FiBook, FiUsers, FiAward,
  FiFileText, FiClipboard, FiExternalLink, FiDownload, FiEdit2, FiLoader,
  FiImage, FiVideo, FiList, FiGrid, FiMove, FiCopy, FiSettings
} from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { generateSlug } from '../../utils/slugify';
import StatusBadge from '../../components/admin/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';

// Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = false, icon = null, badge = null, color = 'indigo' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const colorClasses = {
    indigo: 'border-indigo-200 bg-indigo-50',
    purple: 'border-purple-200 bg-purple-50',
    teal: 'border-teal-200 bg-teal-50',
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    orange: 'border-orange-200 bg-orange-50',
    rose: 'border-rose-200 bg-rose-50',
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${isOpen ? colorClasses[color] : ''}`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className={`text-${color}-600`}>{icon}</span>}
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {badge && <span className={`text-xs bg-${color}-100 text-${color}-700 px-2 py-0.5 rounded-full font-medium`}>{badge}</span>}
        </div>
        {isOpen ? <FiChevronDown className="w-5 h-5 text-gray-500" /> : <FiChevronRight className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

// Hyperlink Input Component
const HyperlinkInput = ({ value, onChange, placeholder = "Enter URL..." }) => {
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [linkText, setLinkText] = useState(value?.text || '');
  const [linkUrl, setLinkUrl] = useState(value?.url || '');

  const handleSave = () => {
    onChange({ text: linkText, url: linkUrl });
    setShowLinkEditor(false);
  };

  return (
    <div className="relative">
      {value?.url ? (
        <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <FiLink className="text-blue-600 w-4 h-4" />
          <a href={value.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex-1 truncate">
            {value.text || value.url}
          </a>
          <button type="button" onClick={() => setShowLinkEditor(true)} className="text-gray-500 hover:text-gray-700">
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => onChange(null)} className="text-red-500 hover:text-red-700">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowLinkEditor(true)}
          className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors w-full"
        >
          <FiLink className="w-4 h-4" />
          <span className="text-sm">Add Hyperlink</span>
        </button>
      )}

      {showLinkEditor && (
        <div className="absolute z-10 top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-lg w-80">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Link Text</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Display text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" size="sm" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                Save Link
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setShowLinkEditor(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ExamDetailForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const canApprove = user?.role === 'super_admin' || user?.role === 'content_manager';

  // Fetch quick entry exams for dropdown
  const [quickEntryExams, setQuickEntryExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    const fetchQuickEntryExams = async () => {
      try {
        const response = await api.get('/exams');
        setQuickEntryExams(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoadingExams(false);
      }
    };
    fetchQuickEntryExams();
  }, []);

  const getDefaultFormData = () => ({
    name: '',
    slug: '',
    full_name: '',
    exam_type: 'National',
    exam_level: 'UG',
    conducting_body: '',
    state: '',
    description: '',
    // Exam Pattern & Details
    exam_pattern: '',
    exam_syllabus: '',
    eligibility: '',
    age_limit: '',
    application_fee: { General: 0, OBC: 0, SC_ST: 0 },
    // Important Dates
    exam_date: '',
    application_start: '',
    application_end: '',
    result_date: '',
    counseling_date: '',
    // Exam Config
    exam_duration: '',
    exam_mode: 'Online',
    total_marks: 0,
    total_questions: 0,
    negative_marking: '',
    marking_scheme: '',
    languages_offered: [],
    // Categories & Streams
    streams: [],
    sections: [],
    // Official Info
    official_website: '',
    exam_centers: [],
    accepted_by: [],
    // Preparation
    preparation_tips: [],
    previous_year_cutoffs: [],
    // Question Papers Table
    question_papers: [],
    // Study Materials
    study_materials: [],
    // Important Links
    important_links: [],
    // Statistics
    total_applicants: 0,
    total_seats: 0,
    difficulty_level: 'Medium',
    is_popular: false,
    // SEO Content Section
    seo_intro: '',
    seo_full_content: '',
    // TOC (Table of Contents)
    seo_toc: [],
    // Tables Builder
    seo_tables: [],
    // Images with Title & Alt
    seo_images: [],
    // Video
    seo_video_url: '',
    seo_video_title: '',
    seo_video_description: '',
    // FAQs
    seo_faqs: [],
    // Menu Configuration
    menu_config: {
      use_custom_menu: false,
      auto_from_toc: true,
      items: [
        { id: 'overview', label: 'Overview', icon: 'info', enabled: true, order: 0, content: '', page_heading: '', meta_title: '', meta_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } } },
        { id: 'dates', label: 'Important Dates', icon: 'calendar', enabled: true, order: 1, content: '', page_heading: '', meta_title: '', meta_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } } },
        { id: 'eligibility', label: 'Eligibility', icon: 'check', enabled: true, order: 2, content: '', page_heading: '', meta_title: '', meta_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } } },
        { id: 'application', label: 'Application', icon: 'form', enabled: true, order: 3, content: '', page_heading: '', meta_title: '', meta_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } } },
        { id: 'pattern', label: 'Exam Pattern', icon: 'pattern', enabled: true, order: 4, content: '', page_heading: '', meta_title: '', meta_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } } },
        { id: 'syllabus', label: 'Syllabus', icon: 'book', enabled: true, order: 5, content: '', page_heading: '', meta_title: '', meta_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } } },
        { id: 'preparation', label: 'Preparation', icon: 'prep', enabled: true, order: 6, content: '', page_heading: '', meta_title: '', meta_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } } },
        { id: 'cutoff', label: 'Cutoff', icon: 'cutoff', enabled: true, order: 7, content: '', page_heading: '', meta_title: '', meta_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } } },
        { id: 'result', label: 'Result', icon: 'result', enabled: true, order: 8, content: '', page_heading: '', meta_title: '', meta_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } } },
        { id: 'counseling', label: 'Counseling', icon: 'counseling', enabled: true, order: 9, content: '', page_heading: '', meta_title: '', meta_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } } },
      ]
    },
    // SEO Meta Tags
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    canonical_url: '',
    robots_meta: 'index, follow',
    schema_type: 'Event',
    // Media
    logo_url: '',
    content_images: [],
    content_videos: [],
    status: 'draft'
  });

  const [formData, setFormData] = useState(getDefaultFormData());

  useEffect(() => {
    if (id) {
      fetchExam();
    }
  }, [id]);

  const fetchExam = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/exams-detail/${id}`);
      setFormData({ ...getDefaultFormData(), ...response.data });
    } catch (error) {
      console.error('Error fetching exam:', error);
      alert('Failed to fetch exam details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'name' && (!formData.slug || formData.slug === generateSlug(formData.name))) {
      setFormData({ ...formData, [name]: value, slug: generateSlug(value) });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: value }
    });
  };

  const handleArrayObjectChange = (field, index, key, value) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayObjectItem = (field, defaultObj) => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), defaultObj] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  // File upload handler
  const handleFileUpload = async (e, field, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newArray = [...(formData[field] || [])];
      newArray[index] = { 
        ...newArray[index], 
        file_url: response.data.url,
        file_name: file.name,
        file_size: (file.size / 1024).toFixed(2) + ' KB'
      };
      setFormData({ ...formData, [field]: newArray });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    try {
      const response = await api.post('/upload/image?type=exam', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newImage = {
        url: response.data.url,
        title: '',
        alt: '',
        caption: ''
      };
      setFormData({
        ...formData,
        seo_images: [...(formData.seo_images || []), newImage]
      });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
    e.target.value = '';
  };

  // Update Menu Item
  const updateMenuItem = (index, key, value) => {
    const newItems = [...(formData.menu_config?.items || [])];
    newItems[index] = { ...newItems[index], [key]: value };
    setFormData({
      ...formData,
      menu_config: { ...formData.menu_config, items: newItems }
    });
  };

  // Move Menu Item
  const moveMenuItem = (index, direction) => {
    const newItems = [...(formData.menu_config?.items || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newItems.length) return;
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    newItems.forEach((item, i) => item.order = i);
    setFormData({
      ...formData,
      menu_config: { ...formData.menu_config, items: newItems }
    });
  };

  // Add Custom Menu Item
  const addMenuItem = () => {
    const newItem = {
      id: `custom-${Date.now()}`,
      label: 'New Section',
      icon: 'custom',
      enabled: true,
      order: (formData.menu_config?.items || []).length,
      content: '',
      page_heading: '',
      meta_title: '',
      meta_description: '',
      toc: [],
      tables: [],
      images: [],
      videos: [],
      faqs: [],
      widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get expert guidance' }, related_exams: { enabled: false, exams: [] } }
    };
    setFormData({
      ...formData,
      menu_config: {
        ...formData.menu_config,
        items: [...(formData.menu_config?.items || []), newItem]
      }
    });
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = { ...formData, status: saveAsDraft ? 'draft' : 'pending' };
      
      if (id) {
        await api.put(`/exams-detail/${id}`, dataToSave);
        alert('Exam updated successfully!');
      } else {
        await api.post('/exams-detail', dataToSave);
        alert('Exam created successfully!');
      }
      navigate('/admin/exams-detail');
    } catch (error) {
      console.error('Error saving exam:', error);
      alert(`Failed to save exam: ${error.response?.data?.detail || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    setActionLoading(true);
    try {
      await api.post(`/admin/submit-for-review/exam/${id}`);
      const response = await api.get(`/exams/${id}`);
      setFormData({ ...formData, ...response.data });
      alert('Exam submitted for review!');
    } catch (error) {
      alert('Error submitting for review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.post(`/admin/approve/exam/${id}`, { action: 'approve', comment: 'Approved' });
      const response = await api.get(`/exams/${id}`);
      setFormData({ ...formData, ...response.data });
      alert('Exam approved!');
    } catch (error) {
      alert('Error approving exam');
    } finally {
      setActionLoading(false);
    }
  };

  const streams = ['Engineering', 'Medical', 'Management', 'Law', 'Design', 'Architecture', 'Science', 'Commerce', 'Arts', 'Pharmacy', 'Agriculture'];
  const indianStates = ['All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? 'Edit Exam' : 'Add New Exam'}
              </h1>
              {id && formData.status && <StatusBadge status={formData.status} />}
            </div>
            <div className="flex items-center gap-3">
              {id && formData.status === 'draft' && (
                <Button type="button" onClick={handleSubmitForReview} disabled={actionLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <FiSend className="mr-2 w-4 h-4" /> Submit for Review
                </Button>
              )}
              {id && formData.status === 'pending' && canApprove && (
                <Button type="button" onClick={handleApprove} disabled={actionLoading} className="bg-green-600 hover:bg-green-700 text-white">
                  <FiCheck className="mr-2 w-4 h-4" /> Approve
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/admin/exams-detail')}>
                <FiX className="mr-2 w-4 h-4" /> Cancel
              </Button>
              <Button onClick={(e) => handleSubmit(e, true)} disabled={saving} variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                {saving ? <FiLoader className="mr-2 w-4 h-4 animate-spin" /> : <FiSave className="mr-2 w-4 h-4" />}
                Save Draft
              </Button>
              <Button onClick={handleSubmit} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                {saving ? <FiLoader className="mr-2 w-4 h-4 animate-spin" /> : <FiSave className="mr-2 w-4 h-4" />}
                Save & Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        
        {/* Basic Information */}
        <CollapsibleSection title="Basic Information" icon={<FiFileText className="w-5 h-5" />} defaultOpen={true} color="indigo">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam from Quick Entry *</label>
              <select
                value={formData.name}
                onChange={(e) => {
                  const selectedExam = quickEntryExams.find(exam => exam.name === e.target.value);
                  if (selectedExam) {
                    setFormData({
                      ...formData,
                      name: selectedExam.name,
                      slug: generateSlug(selectedExam.name),
                      full_name: selectedExam.full_name || selectedExam.name,
                      conducting_body: selectedExam.conducting_body || '',
                      exam_type: selectedExam.exam_type || 'National',
                      exam_level: selectedExam.exam_level || 'UG',
                      streams: selectedExam.streams || [],
                      exam_mode: selectedExam.mode || 'Online',
                      description: selectedExam.description || ''
                    });
                  }
                }}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Select Exam from Quick Entry List --</option>
                {loadingExams ? (
                  <option disabled>Loading exams...</option>
                ) : (
                  quickEntryExams.map(exam => (
                    <option key={exam.id} value={exam.name}>{exam.name} {exam.full_name ? `(${exam.full_name})` : ''}</option>
                  ))
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">Select an exam from Quick Entry list. Details will auto-populate.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug (Auto-generated)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-100 text-gray-600 cursor-not-allowed" />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from exam name</p>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required placeholder="e.g., Joint Entrance Examination Main"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conducting Body</label>
              <input type="text" name="conducting_body" value={formData.conducting_body} onChange={handleChange} placeholder="e.g., NTA"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
              <select name="exam_type" value={formData.exam_type} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                <option value="National">National Level</option>
                <option value="State">State Level</option>
                <option value="University">University Level</option>
                <option value="Institute">Institute Level</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Level *</label>
              <select name="exam_level" value={formData.exam_level} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Diploma">Diploma</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State (for State Level)</label>
              <select name="state" value={formData.state} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                <option value="">Select State</option>
                {indianStates.map(state => (<option key={state} value={state}>{state}</option>))}
              </select>
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Brief description..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Streams</label>
              <div className="flex flex-wrap gap-2">
                {streams.map(stream => (
                  <label key={stream} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50">
                    <input type="checkbox" checked={formData.streams?.includes(stream) || false}
                      onChange={(e) => {
                        if (e.target.checked) setFormData({ ...formData, streams: [...(formData.streams || []), stream] });
                        else setFormData({ ...formData, streams: (formData.streams || []).filter(s => s !== stream) });
                      }} className="w-4 h-4 text-indigo-600 rounded" />
                    <span className="text-sm text-gray-700">{stream}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Media Section - Logo, Images, Videos */}
        <CollapsibleSection title="Media (Logo, Images & Videos)" icon={<FiImage className="w-5 h-5" />} defaultOpen={true} color="purple">
          <div className="space-y-6">
            
            {/* Exam Logo Upload */}
            <div className="border-2 border-purple-300 rounded-xl p-5 bg-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-purple-800 flex items-center gap-2">
                    🏷️ Exam Logo
                  </h3>
                  <p className="text-xs text-purple-600 mt-1">Upload exam logo. Recommended: 200x200px, Max 500KB</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Preview */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 border-2 border-dashed border-purple-300 rounded-xl flex items-center justify-center bg-white overflow-hidden">
                    {formData.logo_url ? (
                      <img 
                        src={formData.logo_url.startsWith('/api') ? formData.logo_url : `/api${formData.logo_url}`} 
                        alt="Exam Logo" 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Logo'; }}
                      />
                    ) : (
                      <div className="text-center text-purple-400">
                        <FiImage className="w-12 h-12 mx-auto mb-2" />
                        <span className="text-xs">No logo uploaded</span>
                      </div>
                    )}
                  </div>
                  {formData.logo_url && (
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, logo_url: ''})}
                      className="mt-2 text-xs text-red-600 hover:text-red-700"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
                
                {/* Logo Upload Controls */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
                    <label className="flex items-center justify-center w-full h-24 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-purple-50 transition-colors">
                      <div className="flex flex-col items-center">
                        <FiUpload className="w-6 h-6 text-purple-500 mb-1" />
                        <span className="text-sm text-purple-600">Click to upload</span>
                        <span className="text-xs text-gray-500">PNG, JPG, WebP (Max 500KB)</span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/png,image/jpeg,image/webp"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 500 * 1024) {
                            alert('Logo file size must be under 500KB. Please compress your image.');
                            return;
                          }
                          setUploadingImage(true);
                          const uploadFormData = new FormData();
                          uploadFormData.append('file', file);
                          try {
                            const response = await api.post('/upload/image?type=logo', uploadFormData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            setFormData({...formData, logo_url: response.data.url});
                          } catch (error) {
                            alert('Failed to upload logo');
                          } finally {
                            setUploadingImage(false);
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                  
                  {/* Logo Size Guidelines */}
                  <div className="bg-white border border-purple-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-purple-800 mb-2">📐 Size Guidelines:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• <strong>Recommended:</strong> 200x200 pixels (square)</li>
                      <li>• <strong>Max File Size:</strong> 500KB</li>
                      <li>• <strong>Formats:</strong> PNG (transparent), JPG, WebP</li>
                      <li>• <strong>Tip:</strong> Use <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">TinyPNG</a> to compress</li>
                    </ul>
                  </div>
                  
                  {/* Or Enter URL */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Or Enter Logo URL</label>
                    <input
                      type="url"
                      value={formData.logo_url || ''}
                      onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                      placeholder="https://example.com/logo.png"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Images with Alt Tag Generation */}
            <div className="border-2 border-blue-300 rounded-xl p-5 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-blue-800 flex items-center gap-2">
                    🖼️ Content Images
                  </h3>
                  <p className="text-xs text-blue-600 mt-1">Upload images with SEO alt tags. Recommended: 1200x800px for content images</p>
                </div>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">{formData.content_images?.length || 0} images</span>
              </div>
              
              {/* Image Upload */}
              <div className="mb-4">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors">
                  <div className="flex flex-col items-center">
                    <FiUpload className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-sm text-blue-600 font-medium">Click to upload content image</span>
                    <span className="text-xs text-gray-500">PNG, JPG, WebP (Max 2MB) - Recommended: 1200x800px</span>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) {
                        alert('Image file size must be under 2MB');
                        return;
                      }
                      setUploadingImage(true);
                      const uploadFormData = new FormData();
                      uploadFormData.append('file', file);
                      try {
                        const response = await api.post('/upload/image?type=content', uploadFormData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        const newImage = {
                          url: response.data.url,
                          title: '',
                          alt: '',
                          caption: '',
                          width: '',
                          height: ''
                        };
                        setFormData({
                          ...formData,
                          content_images: [...(formData.content_images || []), newImage]
                        });
                      } catch (error) {
                        alert('Failed to upload image');
                      } finally {
                        setUploadingImage(false);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              {/* Uploaded Images List */}
              {(formData.content_images || []).length > 0 && (
                <div className="space-y-4">
                  {(formData.content_images || []).map((image, index) => (
                    <div key={index} className="bg-white rounded-lg border border-blue-200 p-4">
                      <div className="flex gap-4">
                        {/* Image Preview */}
                        <div className="w-36 h-28 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                          <img 
                            src={image.url?.startsWith('/api') ? image.url : `/api${image.url}`} 
                            alt={image.alt || 'Content Image'} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/144x112?text=Image'; }}
                          />
                        </div>
                        
                        {/* Image Details */}
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Image Title</label>
                              <input
                                type="text"
                                value={image.title || ''}
                                onChange={(e) => {
                                  const newImages = [...(formData.content_images || [])];
                                  newImages[index].title = e.target.value;
                                  setFormData({...formData, content_images: newImages});
                                }}
                                placeholder="Image title"
                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Alt Text (SEO) 
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = [...(formData.content_images || [])];
                                    const autoAlt = `${formData.name} ${image.title || 'exam image'} - Admissionbuddy`;
                                    newImages[index].alt = autoAlt;
                                    setFormData({...formData, content_images: newImages});
                                  }}
                                  className="ml-2 text-blue-600 hover:text-blue-700 text-xs"
                                >
                                  ⚡ Auto-generate
                                </button>
                              </label>
                              <input
                                type="text"
                                value={image.alt || ''}
                                onChange={(e) => {
                                  const newImages = [...(formData.content_images || [])];
                                  newImages[index].alt = e.target.value;
                                  setFormData({...formData, content_images: newImages});
                                }}
                                placeholder="Alt text for accessibility & SEO"
                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Caption (optional)</label>
                            <input
                              type="text"
                              value={image.caption || ''}
                              onChange={(e) => {
                                const newImages = [...(formData.content_images || [])];
                                newImages[index].caption = e.target.value;
                                setFormData({...formData, content_images: newImages});
                              }}
                              placeholder="Image caption"
                              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const imgHtml = `<figure class="content-image"><img src="${image.url}" alt="${image.alt || ''}" title="${image.title || ''}" />${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}</figure>`;
                                navigator.clipboard.writeText(imgHtml);
                                alert('Image HTML copied!');
                              }}
                              className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200"
                            >
                              📋 Copy HTML
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = (formData.content_images || []).filter((_, i) => i !== index);
                                setFormData({...formData, content_images: newImages});
                              }}
                              className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded hover:bg-red-200"
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload with SEO Alt Tag */}
            <div className="border-2 border-orange-300 rounded-xl p-5 bg-orange-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-orange-800 flex items-center gap-2">
                    🎬 Videos
                  </h3>
                  <p className="text-xs text-orange-600 mt-1">Add YouTube/Vimeo videos with SEO-optimized titles and descriptions</p>
                </div>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">{formData.content_videos?.length || 0} videos</span>
              </div>

              {/* Add Video Form */}
              <div className="bg-white border border-orange-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube/Vimeo Embed)</label>
                    <input
                      type="url"
                      id="new-video-url"
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use embed URL: youtube.com/embed/... or player.vimeo.com/video/...</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Title (SEO)
                      <button
                        type="button"
                        onClick={() => {
                          const titleInput = document.getElementById('new-video-title');
                          if (titleInput) {
                            titleInput.value = `${formData.name} ${new Date().getFullYear()} - Complete Guide Video | Admissionbuddy`;
                          }
                        }}
                        className="ml-2 text-orange-600 hover:text-orange-700 text-xs"
                      >
                        ⚡ Auto-generate
                      </button>
                    </label>
                    <input
                      type="text"
                      id="new-video-title"
                      placeholder="Video title for SEO"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Alt/Description (SEO)
                      <button
                        type="button"
                        onClick={() => {
                          const descInput = document.getElementById('new-video-desc');
                          if (descInput) {
                            descInput.value = `Watch complete guide on ${formData.name} ${new Date().getFullYear()} covering exam pattern, syllabus, preparation tips and more | Admissionbuddy`;
                          }
                        }}
                        className="ml-2 text-orange-600 hover:text-orange-700 text-xs"
                      >
                        ⚡ Auto-generate
                      </button>
                    </label>
                    <input
                      type="text"
                      id="new-video-desc"
                      placeholder="Video description for accessibility & SEO"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL (optional)</label>
                    <input
                      type="url"
                      id="new-video-thumb"
                      placeholder="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        const url = document.getElementById('new-video-url')?.value;
                        const title = document.getElementById('new-video-title')?.value;
                        const desc = document.getElementById('new-video-desc')?.value;
                        const thumb = document.getElementById('new-video-thumb')?.value;
                        
                        if (!url) {
                          alert('Please enter a video URL');
                          return;
                        }
                        
                        const newVideo = {
                          url: url,
                          title: title || '',
                          description: desc || '',
                          thumbnail: thumb || '',
                          alt: desc || title || ''
                        };
                        
                        setFormData({
                          ...formData,
                          content_videos: [...(formData.content_videos || []), newVideo]
                        });
                        
                        // Clear inputs
                        document.getElementById('new-video-url').value = '';
                        document.getElementById('new-video-title').value = '';
                        document.getElementById('new-video-desc').value = '';
                        document.getElementById('new-video-thumb').value = '';
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      <FiPlus className="inline mr-2" /> Add Video
                    </button>
                  </div>
                </div>
              </div>

              {/* Added Videos List */}
              {(formData.content_videos || []).length > 0 && (
                <div className="space-y-3">
                  {(formData.content_videos || []).map((video, index) => (
                    <div key={index} className="bg-white border border-orange-200 rounded-lg p-4">
                      <div className="flex gap-4">
                        {/* Video Preview */}
                        <div className="w-48 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                          <iframe
                            src={video.url}
                            title={video.title || 'Video'}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        
                        {/* Video Details */}
                        <div className="flex-1">
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600">Title</label>
                              <input
                                type="text"
                                value={video.title || ''}
                                onChange={(e) => {
                                  const newVideos = [...(formData.content_videos || [])];
                                  newVideos[index].title = e.target.value;
                                  setFormData({...formData, content_videos: newVideos});
                                }}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600">
                                Alt/Description (SEO)
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newVideos = [...(formData.content_videos || [])];
                                    newVideos[index].description = `Watch ${formData.name} video guide - ${video.title || 'exam preparation'} | Admissionbuddy`;
                                    newVideos[index].alt = newVideos[index].description;
                                    setFormData({...formData, content_videos: newVideos});
                                  }}
                                  className="ml-2 text-orange-600 hover:text-orange-700 text-xs"
                                >
                                  ⚡ Auto-generate
                                </button>
                              </label>
                              <input
                                type="text"
                                value={video.description || ''}
                                onChange={(e) => {
                                  const newVideos = [...(formData.content_videos || [])];
                                  newVideos[index].description = e.target.value;
                                  newVideos[index].alt = e.target.value;
                                  setFormData({...formData, content_videos: newVideos});
                                }}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                const videoHtml = `<figure class="video-embed"><iframe src="${video.url}" title="${video.title || ''}" alt="${video.alt || video.description || ''}" frameborder="0" allowfullscreen></iframe>${video.description ? `<figcaption>${video.description}</figcaption>` : ''}</figure>`;
                                navigator.clipboard.writeText(videoHtml);
                                alert('Video HTML copied!');
                              }}
                              className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                            >
                              📋 Copy HTML
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newVideos = (formData.content_videos || []).filter((_, i) => i !== index);
                                setFormData({...formData, content_videos: newVideos});
                              }}
                              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </CollapsibleSection>

        {/* SEO & Meta Tags (Main Page) */}
        <CollapsibleSection title="SEO & Meta Tags (Main Page)" icon={<FiSettings className="w-5 h-5" />} color="rose">
          <p className="text-sm text-gray-600 mb-4">
            Configure meta tags for search engines and social media sharing. These improve search visibility and click-through rates.
          </p>
          <div className="space-y-4">
            {/* Meta Title */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Meta Title</label>
                <span className={`text-xs ${(formData.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.meta_title?.length || 0}/60 characters
                </span>
              </div>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                placeholder="e.g., JEE Main 2025 - Exam Date, Application, Eligibility | Admissionbuddy"
                className={`w-full border-2 rounded-lg px-3 py-2 ${(formData.meta_title?.length || 0) > 60 ? 'border-red-300' : 'border-gray-200'}`}
                maxLength={70}
              />
              <p className="text-xs text-gray-500 mt-1">Appears in browser tab and search results. Keep under 60 characters for best display.</p>
              <button
                type="button"
                onClick={() => {
                  const autoTitle = `${formData.name} ${new Date().getFullYear()} - Exam Date, Application | Admissionbuddy`;
                  setFormData({...formData, meta_title: autoTitle.substring(0, 60)});
                }}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Auto-generate from exam name
              </button>
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Meta Description</label>
                <span className={`text-xs ${(formData.meta_description?.length || 0) > 160 ? 'text-red-500' : (formData.meta_description?.length || 0) > 150 ? 'text-yellow-500' : 'text-gray-500'}`}>
                  {formData.meta_description?.length || 0}/160 characters
                </span>
              </div>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                placeholder="e.g., Get complete details on JEE Main 2025 exam date, application form, eligibility, syllabus, exam pattern, cutoff & result. Apply now through Admissionbuddy."
                rows="3"
                className={`w-full border-2 rounded-lg px-3 py-2 ${(formData.meta_description?.length || 0) > 160 ? 'border-red-300' : 'border-gray-200'}`}
                maxLength={170}
              />
              <p className="text-xs text-gray-500 mt-1">Search result snippet. Keep between 150-160 characters for optimal display.</p>
              <button
                type="button"
                onClick={() => {
                  const autoDesc = `Get complete details on ${formData.name} ${new Date().getFullYear()} exam date, application form, eligibility, syllabus, pattern & result | Admissionbuddy`;
                  setFormData({...formData, meta_description: autoDesc.substring(0, 160)});
                }}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Auto-generate description
              </button>
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block text-sm font-medium mb-1">Meta Keywords</label>
              <input
                type="text"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleChange}
                placeholder="e.g., JEE Main 2025, exam date, application form, eligibility, syllabus, cutoff"
                className="w-full border rounded-lg px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated keywords relevant to this exam.</p>
              <button
                type="button"
                onClick={() => {
                  const keywords = [
                    formData.name,
                    formData.full_name,
                    'exam date ' + new Date().getFullYear(),
                    'application form',
                    'eligibility',
                    'syllabus',
                    'exam pattern',
                    'cutoff',
                    'result'
                  ].filter(Boolean).join(', ');
                  setFormData({...formData, meta_keywords: keywords});
                }}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Auto-generate keywords
              </button>
            </div>

            {/* Divider - Open Graph */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">📱 Open Graph (Social Media)</h3>
            </div>

            {/* OG Title */}
            <div>
              <label className="block text-sm font-medium mb-1">OG Title (Social Share Title)</label>
              <input
                type="text"
                name="og_title"
                value={formData.og_title}
                onChange={handleChange}
                placeholder="Leave empty to use Meta Title"
                className="w-full border rounded-lg px-3 py-2"
              />
              <button
                type="button"
                onClick={() => setFormData({...formData, og_title: formData.meta_title})}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Copy from Meta Title
              </button>
            </div>

            {/* OG Description */}
            <div>
              <label className="block text-sm font-medium mb-1">OG Description (Social Share Description)</label>
              <textarea
                name="og_description"
                value={formData.og_description}
                onChange={handleChange}
                placeholder="Leave empty to use Meta Description"
                rows="2"
                className="w-full border rounded-lg px-3 py-2"
              />
              <button
                type="button"
                onClick={() => setFormData({...formData, og_description: formData.meta_description})}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Copy from Meta Description
              </button>
            </div>

            {/* OG Image */}
            <div>
              <label className="block text-sm font-medium mb-1">OG Image URL (Social Share Thumbnail)</label>
              <input
                type="url"
                name="og_image_url"
                value={formData.og_image_url}
                onChange={handleChange}
                placeholder="https://example.com/og-image.jpg (1200x630 px recommended)"
                className="w-full border rounded-lg px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x630 pixels for optimal display on social media.</p>
            </div>

            {/* Divider - Advanced SEO */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">⚙️ Advanced SEO Settings</h3>
            </div>

            {/* Canonical URL */}
            <div>
              <label className="block text-sm font-medium mb-1">Canonical URL</label>
              <input
                type="url"
                name="canonical_url"
                value={formData.canonical_url}
                onChange={handleChange}
                placeholder="Leave empty to auto-generate from slug"
                className="w-full border rounded-lg px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Prevents duplicate content issues. Auto-generated if left empty.</p>
            </div>

            {/* Robots Meta */}
            <div>
              <label className="block text-sm font-medium mb-1">Robots Meta</label>
              <select
                name="robots_meta"
                value={formData.robots_meta || 'index, follow'}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="index, follow">index, follow (Recommended)</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Controls how search engines index this page.</p>
            </div>

            {/* Schema Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Schema Type (Rich Snippets)</label>
              <select
                name="schema_type"
                value={formData.schema_type || 'Event'}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Event">Event (Default for Exams)</option>
                <option value="EducationalOrganization">EducationalOrganization</option>
                <option value="Course">Course</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Helps search engines understand the type of content for rich results.</p>
            </div>

            {/* SEO Preview */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">👁️ Search Result Preview</h3>
              <div className="bg-white border rounded-lg p-4 max-w-2xl">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                  {formData.meta_title || formData.name || 'Exam Title'}
                </div>
                <div className="text-green-700 text-sm truncate">
                  admissionbuddy.co › exams › {formData.slug || 'exam-slug'}
                </div>
                <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {formData.meta_description || 'Meta description will appear here. Add a compelling description to improve click-through rates.'}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Important Dates */}
        <CollapsibleSection title="Important Dates" icon={<FiCalendar className="w-5 h-5" />} defaultOpen={true} color="orange">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Application Start</label>
              <input type="date" name="application_start" value={formData.application_start} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Application End</label>
              <input type="date" name="application_end" value={formData.application_end} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
              <input type="date" name="exam_date" value={formData.exam_date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Result Date</label>
              <input type="date" name="result_date" value={formData.result_date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Counseling Date</label>
              <input type="date" name="counseling_date" value={formData.counseling_date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
          </div>
        </CollapsibleSection>

        {/* Exam Pattern & Details */}
        <CollapsibleSection title="Exam Pattern & Details" icon={<FiClipboard className="w-5 h-5" />} color="green">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Exam Mode</label>
              <select name="exam_mode" value={formData.exam_mode} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                <option value="Online">Online (CBT)</option><option value="Offline">Offline (Pen & Paper)</option><option value="Both">Both</option>
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input type="text" name="exam_duration" value={formData.exam_duration} onChange={handleChange} placeholder="3 Hours" className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
              <input type="number" name="total_marks" value={formData.total_marks} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Questions</label>
              <input type="number" name="total_questions" value={formData.total_questions} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Marking Scheme</label>
              <input type="text" name="marking_scheme" value={formData.marking_scheme} onChange={handleChange} placeholder="+4 for correct" className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Negative Marking</label>
              <input type="text" name="negative_marking" value={formData.negative_marking} onChange={handleChange} placeholder="-1 for wrong" className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
          </div>
          <div className="mt-4"><label className="block text-sm font-medium text-gray-700 mb-1">Exam Pattern (Detailed)</label>
            <textarea name="exam_pattern" value={formData.exam_pattern} onChange={handleChange} rows="4" placeholder="Describe sections, marks distribution..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
          <div className="mt-4"><label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
            <textarea name="exam_syllabus" value={formData.exam_syllabus} onChange={handleChange} rows="4" placeholder="List syllabus topics..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
        </CollapsibleSection>

        {/* Application Fees */}
        <CollapsibleSection title="Application Fees" icon={<FiAward className="w-5 h-5" />} color="rose">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">General (₹)</label>
              <input type="number" value={formData.application_fee?.General || 0} onChange={(e) => handleNestedChange('application_fee', 'General', parseInt(e.target.value) || 0)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">OBC (₹)</label>
              <input type="number" value={formData.application_fee?.OBC || 0} onChange={(e) => handleNestedChange('application_fee', 'OBC', parseInt(e.target.value) || 0)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">SC/ST (₹)</label>
              <input type="number" value={formData.application_fee?.SC_ST || 0} onChange={(e) => handleNestedChange('application_fee', 'SC_ST', parseInt(e.target.value) || 0)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
          </div>
        </CollapsibleSection>

        {/* Question Papers Table */}
        <CollapsibleSection title="Question Papers" icon={<FiFile className="w-5 h-5" />} badge={`${formData.question_papers?.length || 0} papers`} color="purple">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase border-b border-purple-200">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase border-b border-purple-200">Paper Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase border-b border-purple-200">Shift/Set</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase border-b border-purple-200">File Upload</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase border-b border-purple-200">External Link</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-purple-800 uppercase border-b border-purple-200 w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(formData.question_papers || []).map((paper, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3"><input type="text" value={paper.year || ''} onChange={(e) => handleArrayObjectChange('question_papers', index, 'year', e.target.value)} placeholder="2024" className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm" /></td>
                    <td className="px-4 py-3"><input type="text" value={paper.name || ''} onChange={(e) => handleArrayObjectChange('question_papers', index, 'name', e.target.value)} placeholder="JEE Main Paper 1" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></td>
                    <td className="px-4 py-3"><input type="text" value={paper.shift || ''} onChange={(e) => handleArrayObjectChange('question_papers', index, 'shift', e.target.value)} placeholder="Morning" className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm" /></td>
                    <td className="px-4 py-3">
                      {paper.file_url ? (
                        <div className="flex items-center gap-2">
                          <a href={paper.file_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"><FiDownload className="w-4 h-4" />{paper.file_name || 'Download'}</a>
                          <button type="button" onClick={() => handleArrayObjectChange('question_papers', index, 'file_url', '')} className="text-red-500 hover:text-red-700"><FiX className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-indigo-600">
                          <FiUpload className="w-4 h-4" /><span className="text-sm">{uploadingFile ? 'Uploading...' : 'Upload PDF'}</span>
                          <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'question_papers', index)} disabled={uploadingFile} />
                        </label>
                      )}
                    </td>
                    <td className="px-4 py-3"><HyperlinkInput value={paper.external_link} onChange={(link) => handleArrayObjectChange('question_papers', index, 'external_link', link)} /></td>
                    <td className="px-4 py-3 text-center"><button type="button" onClick={() => removeArrayItem('question_papers', index)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => addArrayObjectItem('question_papers', { year: '', name: '', shift: '', file_url: '', external_link: null })}
            className="mt-4 flex items-center gap-2 px-4 py-2 border border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-500 hover:bg-purple-50">
            <FiPlus className="w-4 h-4" /> Add Question Paper
          </button>
        </CollapsibleSection>

        {/* Menu Configuration */}
        <CollapsibleSection title="Menu Configuration & Page Content" icon={<FiGrid className="w-5 h-5" />} badge={`${(formData.menu_config?.items || []).filter(i => i.enabled).length} items`} color="blue">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Page Builder:</strong> Each menu item becomes a separate page/tab. Add content, SEO, images, videos for each.
            </p>
          </div>
          
          {/* Menu Items List */}
          <div className="space-y-4">
            {(formData.menu_config?.items || []).sort((a, b) => a.order - b.order).map((item, index) => (
              <div key={item.id} className={`rounded-xl border-2 overflow-hidden ${item.enabled ? 'border-blue-300 bg-white' : 'border-gray-300 bg-gray-50 opacity-70'}`}>
                {/* Item Header */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => moveMenuItem(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-blue-600 disabled:opacity-30 p-0.5"><FiChevronDown className="w-3 h-3 rotate-180" /></button>
                    <button type="button" onClick={() => moveMenuItem(index, 'down')} disabled={index === (formData.menu_config?.items || []).length - 1} className="text-gray-400 hover:text-blue-600 disabled:opacity-30 p-0.5"><FiChevronDown className="w-3 h-3" /></button>
                  </div>
                  <input type="checkbox" checked={item.enabled} onChange={(e) => updateMenuItem(index, 'enabled', e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">{index + 1}</div>
                  <input type="text" value={item.label} onChange={(e) => updateMenuItem(index, 'label', e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold" placeholder="Menu Label" />
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border font-mono">/{item.id}</span>
                  <button type="button" onClick={() => {
                    const el = document.getElementById(`menu-content-${item.id}`);
                    if (el) el.classList.toggle('hidden');
                  }} className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg text-xs font-medium">
                    📝 Edit Content
                  </button>
                  {item.id.startsWith('custom-') && (
                    <button type="button" onClick={() => {
                      const newItems = (formData.menu_config?.items || []).filter(i => i.id !== item.id);
                      setFormData({ ...formData, menu_config: { ...formData.menu_config, items: newItems } });
                    }} className="text-red-500 hover:bg-red-50 p-2 rounded"><FiTrash2 className="w-4 h-4" /></button>
                  )}
                </div>
                
                {/* Item Content Editor (Collapsible) */}
                <div id={`menu-content-${item.id}`} className="hidden p-4 bg-gray-50 border-t space-y-4">
                  {/* Page Heading & SEO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">📌 Page Heading (H1)</label>
                      <input type="text" value={item.page_heading || ''} onChange={(e) => updateMenuItem(index, 'page_heading', e.target.value)}
                        placeholder={`e.g., ${formData.name} - ${item.label}`} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        🔍 Meta Title
                        <button type="button" onClick={() => updateMenuItem(index, 'meta_title', `${formData.name} ${item.label} ${new Date().getFullYear()} | Admissionbuddy`)} className="ml-2 text-blue-600 text-xs">⚡ Auto</button>
                      </label>
                      <input type="text" value={item.meta_title || ''} onChange={(e) => updateMenuItem(index, 'meta_title', e.target.value)}
                        placeholder="SEO title for this page" className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        📝 Meta Description
                        <button type="button" onClick={() => updateMenuItem(index, 'meta_description', `Get complete ${item.label.toLowerCase()} details for ${formData.name} ${new Date().getFullYear()} | Admissionbuddy`)} className="ml-2 text-blue-600 text-xs">⚡ Auto</button>
                      </label>
                      <textarea value={item.meta_description || ''} onChange={(e) => updateMenuItem(index, 'meta_description', e.target.value)}
                        placeholder="SEO description for this page" rows="2" className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">📄 Page Content (HTML supported)</label>
                    <textarea value={item.content || ''} onChange={(e) => updateMenuItem(index, 'content', e.target.value)}
                      placeholder="Write the main content for this page... HTML is supported." rows="6" className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
                  </div>

                  {/* TOC for this page */}
                  <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-purple-800">📑 Table of Contents</label>
                      <button type="button" onClick={() => {
                        const newToc = [...(item.toc || []), { title: 'New Section', anchor: `section-${Date.now()}`, content: '' }];
                        updateMenuItem(index, 'toc', newToc);
                      }} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">+ Add Section</button>
                    </div>
                    
                    {(item.toc || []).length > 0 ? (
                      <div className="space-y-2">
                        {(item.toc || []).map((tocItem, tocIndex) => (
                          <div key={tocIndex} className="bg-white border rounded p-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-400 w-4">{tocIndex + 1}.</span>
                              <input
                                type="text"
                                value={tocItem.title || ''}
                                onChange={(e) => {
                                  const newToc = [...(item.toc || [])];
                                  newToc[tocIndex].title = e.target.value;
                                  newToc[tocIndex].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                  updateMenuItem(index, 'toc', newToc);
                                }}
                                placeholder="Section Title"
                                className="flex-1 border rounded px-2 py-1 text-xs"
                              />
                              <span className="text-xs text-gray-400 font-mono">#{tocItem.anchor}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newToc = (item.toc || []).filter((_, i) => i !== tocIndex);
                                  updateMenuItem(index, 'toc', newToc);
                                }}
                                className="text-red-400 hover:text-red-600 p-1"
                              >
                                <FiTrash2 size={12} />
                              </button>
                            </div>
                            <textarea
                              value={tocItem.content || ''}
                              onChange={(e) => {
                                const newToc = [...(item.toc || [])];
                                newToc[tocIndex].content = e.target.value;
                                updateMenuItem(index, 'toc', newToc);
                              }}
                              placeholder="Section content (HTML supported)..."
                              rows="2"
                              className="w-full border rounded px-2 py-1 text-xs mt-1"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No TOC sections. Click &quot;+ Add Section&quot; to add.</p>
                    )}
                    
                    {/* TOC Preview */}
                    {(item.toc || []).length > 0 && (
                      <div className="mt-2 p-2 bg-purple-100 rounded border border-purple-200">
                        <p className="text-xs text-purple-700 mb-1">TOC Preview:</p>
                        <div className="flex flex-wrap gap-1">
                          {(item.toc || []).map((t, ti) => (
                            <span key={ti} className="text-xs bg-white px-2 py-0.5 rounded border text-purple-800">
                              {t.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tables for this page */}
                  <div className="border border-teal-200 rounded-lg p-3 bg-teal-50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-teal-800">📊 Tables</label>
                      <button type="button" onClick={() => {
                        const newTables = [...(item.tables || []), { title: '', headers: ['Column 1', 'Column 2', 'Column 3'], rows: [['', '', ''], ['', '', '']] }];
                        updateMenuItem(index, 'tables', newTables);
                      }} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">+ Add Table</button>
                    </div>
                    
                    {(item.tables || []).length > 0 ? (
                      <div className="space-y-3">
                        {(item.tables || []).map((table, tableIndex) => (
                          <div key={tableIndex} className="bg-white border border-teal-200 rounded p-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="bg-teal-100 text-teal-800 text-xs font-bold px-1.5 py-0.5 rounded">T{tableIndex + 1}</span>
                                <input
                                  type="text"
                                  value={table.title || ''}
                                  onChange={(e) => {
                                    const newTables = [...(item.tables || [])];
                                    newTables[tableIndex].title = e.target.value;
                                    updateMenuItem(index, 'tables', newTables);
                                  }}
                                  placeholder="Table Title"
                                  className="border rounded px-2 py-0.5 text-xs w-40"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newTables = [...(item.tables || [])];
                                    newTables[tableIndex].headers.push('New Col');
                                    newTables[tableIndex].rows.forEach(row => row.push(''));
                                    updateMenuItem(index, 'tables', newTables);
                                  }}
                                  className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded hover:bg-teal-100"
                                >
                                  +Col
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newTables = [...(item.tables || [])];
                                    newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
                                    updateMenuItem(index, 'tables', newTables);
                                  }}
                                  className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded hover:bg-teal-100"
                                >
                                  +Row
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newTables = (item.tables || []).filter((_, ti) => ti !== tableIndex);
                                    updateMenuItem(index, 'tables', newTables);
                                  }}
                                  className="text-xs text-red-500 hover:text-red-700 px-1"
                                >
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            </div>
                            
                            {/* Table Editor */}
                            <div className="overflow-x-auto max-h-48">
                              <table className="w-full border-collapse text-xs">
                                <thead>
                                  <tr>
                                    {(table.headers || []).map((header, colIndex) => (
                                      <th key={colIndex} className="border border-teal-200 bg-teal-50 p-0.5">
                                        <div className="flex items-center">
                                          <input
                                            type="text"
                                            value={header}
                                            onChange={(e) => {
                                              const newTables = [...(item.tables || [])];
                                              newTables[tableIndex].headers[colIndex] = e.target.value;
                                              updateMenuItem(index, 'tables', newTables);
                                            }}
                                            className="w-full border-0 bg-transparent font-semibold text-center text-teal-800 text-xs px-1"
                                            placeholder="Header"
                                          />
                                          {table.headers.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newTables = [...(item.tables || [])];
                                                newTables[tableIndex].headers.splice(colIndex, 1);
                                                newTables[tableIndex].rows.forEach(row => row.splice(colIndex, 1));
                                                updateMenuItem(index, 'tables', newTables);
                                              }}
                                              className="text-red-400 hover:text-red-600 text-xs"
                                            >
                                              ×
                                            </button>
                                          )}
                                        </div>
                                      </th>
                                    ))}
                                    <th className="w-6"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(table.rows || []).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                      {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="border border-teal-200 p-0.5">
                                          <input
                                            type="text"
                                            value={cell}
                                            onChange={(e) => {
                                              const newTables = [...(item.tables || [])];
                                              newTables[tableIndex].rows[rowIndex][cellIndex] = e.target.value;
                                              updateMenuItem(index, 'tables', newTables);
                                            }}
                                            className="w-full border-0 text-center text-xs px-1"
                                            placeholder="-"
                                          />
                                        </td>
                                      ))}
                                      <td className="border border-teal-200 p-0.5 text-center">
                                        {table.rows.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newTables = [...(item.tables || [])];
                                              newTables[tableIndex].rows = newTables[tableIndex].rows.filter((_, ri) => ri !== rowIndex);
                                              updateMenuItem(index, 'tables', newTables);
                                            }}
                                            className="text-red-400 hover:text-red-600 text-xs"
                                          >
                                            ×
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            {/* Insert to Content Button */}
                            <div className="mt-2 flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const tableHtml = `<table class="data-table">\n  <caption>${table.title || 'Table'}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
                                  updateMenuItem(index, 'content', (item.content || '') + '\n\n' + tableHtml);
                                  alert('Table inserted into Page Content!');
                                }}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
                              >
                                <FiEdit2 size={10} /> Insert to Content
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const tableHtml = `<table class="data-table">\n  <caption>${table.title || 'Table'}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
                                  navigator.clipboard.writeText(tableHtml);
                                  alert('Table HTML copied!');
                                }}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1"
                              >
                                📋 Copy HTML
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No tables. Click &quot;+ Add Table&quot; to create data tables for this page.</p>
                    )}
                    
                    {/* Quick Table Templates */}
                    {(!item.tables || item.tables.length === 0) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500">Quick add:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...(item.tables || []), {
                              title: 'Exam Dates',
                              headers: ['Event', 'Start Date', 'End Date'],
                              rows: [['Application Start', '', ''], ['Exam Date', '', ''], ['Result', '', '']]
                            }];
                            updateMenuItem(index, 'tables', newTables);
                          }}
                          className="text-xs bg-white border border-teal-300 text-teal-700 px-2 py-0.5 rounded hover:bg-teal-50"
                        >
                          📅 Dates Table
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...(item.tables || []), {
                              title: 'Eligibility Criteria',
                              headers: ['Category', 'Requirement'],
                              rows: [['Education', ''], ['Age Limit', ''], ['Nationality', '']]
                            }];
                            updateMenuItem(index, 'tables', newTables);
                          }}
                          className="text-xs bg-white border border-teal-300 text-teal-700 px-2 py-0.5 rounded hover:bg-teal-50"
                        >
                          ✅ Eligibility Table
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...(item.tables || []), {
                              title: 'Exam Pattern',
                              headers: ['Section', 'Questions', 'Marks', 'Duration'],
                              rows: [['Subject 1', '', '', ''], ['Subject 2', '', '', ''], ['Total', '', '', '']]
                            }];
                            updateMenuItem(index, 'tables', newTables);
                          }}
                          className="text-xs bg-white border border-teal-300 text-teal-700 px-2 py-0.5 rounded hover:bg-teal-50"
                        >
                          📝 Pattern Table
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Images for this page */}
                  <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-blue-800">🖼️ Images</label>
                      <label className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 cursor-pointer">
                        + Upload Image
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const uploadFormData = new FormData();
                            uploadFormData.append('file', file);
                            const response = await api.post('/upload/image?type=content', uploadFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
                            const newImages = [...(item.images || []), { url: response.data.url, title: '', alt: `${formData.name} ${item.label} - Admissionbuddy`, caption: '' }];
                            updateMenuItem(index, 'images', newImages);
                          } catch (error) { alert('Upload failed'); }
                          e.target.value = '';
                        }} />
                      </label>
                    </div>
                    
                    {(item.images || []).length > 0 ? (
                      <div className="space-y-2">
                        {(item.images || []).map((img, imgIndex) => (
                          <div key={imgIndex} className="bg-white p-2 rounded border flex gap-3">
                            <img src={img.url?.startsWith('/api') ? img.url : `/api${img.url}`} alt="" className="w-20 h-20 object-cover rounded flex-shrink-0" />
                            <div className="flex-1 space-y-1">
                              <div>
                                <label className="block text-xs text-gray-500">Title</label>
                                <input type="text" value={img.title || ''} onChange={(e) => {
                                  const newImages = [...(item.images || [])];
                                  newImages[imgIndex].title = e.target.value;
                                  updateMenuItem(index, 'images', newImages);
                                }} placeholder="Image title" className="w-full border rounded px-2 py-1 text-xs" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500">
                                  Alt Text (SEO)
                                  <button type="button" onClick={() => {
                                    const newImages = [...(item.images || [])];
                                    newImages[imgIndex].alt = `${formData.name} ${item.label} ${img.title || ''} - Admissionbuddy`.trim();
                                    updateMenuItem(index, 'images', newImages);
                                  }} className="ml-2 text-blue-600 text-xs">⚡ Auto</button>
                                </label>
                                <input type="text" value={img.alt || ''} onChange={(e) => {
                                  const newImages = [...(item.images || [])];
                                  newImages[imgIndex].alt = e.target.value;
                                  updateMenuItem(index, 'images', newImages);
                                }} placeholder="Alt text for SEO" className="w-full border rounded px-2 py-1 text-xs" />
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const imgHtml = `<figure class="content-image"><img src="${img.url}" alt="${img.alt || ''}" title="${img.title || ''}" />${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}</figure>`;
                                    updateMenuItem(index, 'content', (item.content || '') + '\n\n' + imgHtml);
                                    alert('Image inserted into content!');
                                  }}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded hover:bg-blue-200"
                                >
                                  Insert to Content
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const imgHtml = `<img src="${img.url}" alt="${img.alt || ''}" title="${img.title || ''}" />`;
                                    navigator.clipboard.writeText(imgHtml);
                                    alert('Image HTML copied!');
                                  }}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded hover:bg-gray-200"
                                >
                                  📋 Copy
                                </button>
                                <button type="button" onClick={() => {
                                  const newImages = (item.images || []).filter((_, i) => i !== imgIndex);
                                  updateMenuItem(index, 'images', newImages);
                                }} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded hover:bg-red-200">
                                  🗑️ Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No images. Upload images to add to this page.</p>
                    )}
                  </div>

                  {/* Videos for this page */}
                  <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-orange-800">🎬 Videos</label>
                      <button type="button" onClick={() => {
                        const url = prompt('Enter YouTube/Vimeo embed URL:');
                        if (url) {
                          const newVideos = [...(item.videos || []), { url, title: '', description: '', alt: `${formData.name} ${item.label} video | Admissionbuddy` }];
                          updateMenuItem(index, 'videos', newVideos);
                        }
                      }} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200">+ Add Video</button>
                    </div>
                    
                    {(item.videos || []).length > 0 ? (
                      <div className="space-y-2">
                        {(item.videos || []).map((vid, vidIndex) => (
                          <div key={vidIndex} className="bg-white p-2 rounded border">
                            <div className="flex gap-3">
                              {/* Video Preview */}
                              <div className="w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-900">
                                <iframe
                                  src={vid.url}
                                  title={vid.title || 'Video'}
                                  className="w-full h-full"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                              
                              {/* Video Details */}
                              <div className="flex-1 space-y-1">
                                <div>
                                  <label className="block text-xs text-gray-500">Title</label>
                                  <input type="text" value={vid.title || ''} onChange={(e) => {
                                    const newVideos = [...(item.videos || [])];
                                    newVideos[vidIndex].title = e.target.value;
                                    updateMenuItem(index, 'videos', newVideos);
                                  }} placeholder="Video title" className="w-full border rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500">
                                    Alt/Description (SEO)
                                    <button type="button" onClick={() => {
                                      const newVideos = [...(item.videos || [])];
                                      newVideos[vidIndex].alt = `Watch ${formData.name} ${item.label} video - ${vid.title || 'guide'} | Admissionbuddy`;
                                      newVideos[vidIndex].description = newVideos[vidIndex].alt;
                                      updateMenuItem(index, 'videos', newVideos);
                                    }} className="ml-2 text-orange-600 text-xs">⚡ Auto</button>
                                  </label>
                                  <input type="text" value={vid.alt || ''} onChange={(e) => {
                                    const newVideos = [...(item.videos || [])];
                                    newVideos[vidIndex].alt = e.target.value;
                                    newVideos[vidIndex].description = e.target.value;
                                    updateMenuItem(index, 'videos', newVideos);
                                  }} placeholder="Alt/Description for SEO" className="w-full border rounded px-2 py-1 text-xs" />
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const videoHtml = `<figure class="video-embed"><iframe src="${vid.url}" title="${vid.title || ''}" alt="${vid.alt || ''}" frameborder="0" allowfullscreen></iframe>${vid.description ? `<figcaption>${vid.description}</figcaption>` : ''}</figure>`;
                                      updateMenuItem(index, 'content', (item.content || '') + '\n\n' + videoHtml);
                                      alert('Video inserted into content!');
                                    }}
                                    className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded hover:bg-orange-200"
                                  >
                                    Insert to Content
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const videoHtml = `<iframe src="${vid.url}" title="${vid.title || ''}" frameborder="0" allowfullscreen></iframe>`;
                                      navigator.clipboard.writeText(videoHtml);
                                      alert('Video HTML copied!');
                                    }}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded hover:bg-gray-200"
                                  >
                                    📋 Copy
                                  </button>
                                  <button type="button" onClick={() => {
                                    const newVideos = (item.videos || []).filter((_, i) => i !== vidIndex);
                                    updateMenuItem(index, 'videos', newVideos);
                                  }} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded hover:bg-red-200">
                                    🗑️ Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No videos. Add YouTube/Vimeo embed URLs.</p>
                    )}
                  </div>

                  {/* FAQs for this page */}
                  <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-green-800">❓ FAQs ({(item.faqs || []).length})</label>
                      <button type="button" onClick={() => {
                        const newFaqs = [...(item.faqs || []), { question: '', answer: '' }];
                        updateMenuItem(index, 'faqs', newFaqs);
                      }} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">+ Add FAQ</button>
                    </div>
                    
                    {(item.faqs || []).length > 0 ? (
                      <div className="space-y-2">
                        {(item.faqs || []).map((faq, faqIndex) => (
                          <div key={faqIndex} className="bg-white p-2 rounded border">
                            <div className="flex items-start gap-2 mb-1">
                              <span className="text-xs text-green-600 font-bold flex-shrink-0">Q{faqIndex + 1}:</span>
                              <input type="text" value={faq.question || ''} onChange={(e) => {
                                const newFaqs = [...(item.faqs || [])];
                                newFaqs[faqIndex].question = e.target.value;
                                updateMenuItem(index, 'faqs', newFaqs);
                              }} placeholder="Enter question..." className="flex-1 border rounded px-2 py-1 text-xs" />
                              <button type="button" onClick={() => {
                                const newFaqs = (item.faqs || []).filter((_, i) => i !== faqIndex);
                                updateMenuItem(index, 'faqs', newFaqs);
                              }} className="text-red-400 hover:text-red-600 p-1"><FiTrash2 size={12} /></button>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-blue-600 font-bold flex-shrink-0">A:</span>
                              <textarea value={faq.answer || ''} onChange={(e) => {
                                const newFaqs = [...(item.faqs || [])];
                                newFaqs[faqIndex].answer = e.target.value;
                                updateMenuItem(index, 'faqs', newFaqs);
                              }} placeholder="Enter answer..." rows="2" className="flex-1 border rounded px-2 py-1 text-xs" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No FAQs. Click &quot;+ Add FAQ&quot; to add questions.</p>
                    )}
                    
                    {/* Quick FAQ Templates */}
                    {(!item.faqs || item.faqs.length === 0) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500">Quick add:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = [
                              { question: `What is ${formData.name || 'this exam'}?`, answer: '' },
                              { question: `What is the eligibility for ${formData.name || 'this exam'}?`, answer: '' },
                              { question: `What is the exam pattern for ${formData.name || 'this exam'}?`, answer: '' },
                              { question: `When will ${formData.name || 'this exam'} ${new Date().getFullYear()} be conducted?`, answer: '' }
                            ];
                            updateMenuItem(index, 'faqs', newFaqs);
                          }}
                          className="text-xs bg-white border border-green-300 text-green-700 px-2 py-0.5 rounded hover:bg-green-50"
                        >
                          📝 Common Exam FAQs
                        </button>
                      </div>
                    )}
                    
                    {/* FAQ Schema Info */}
                    {(item.faqs || []).length > 0 && (
                      <div className="mt-2 p-2 bg-green-100 rounded border border-green-200 text-xs text-green-700">
                        💡 FAQs will generate FAQ Schema markup for better SEO.
                      </div>
                    )}
                  </div>

                  {/* Sidebar Widgets Section */}
                  <div className="border border-indigo-200 rounded-lg p-3 bg-indigo-50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-indigo-800">🧩 Sidebar Widgets</label>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Configure which widgets appear in the sidebar of this page</p>
                    
                    <div className="space-y-2">
                      {/* Quick Facts Widget */}
                      <div className="bg-white border rounded p-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={item.widgets?.quick_facts?.enabled ?? true}
                              onChange={(e) => {
                                const newItems = [...(formData.menu_config?.items || [])];
                                if (!newItems[index].widgets) newItems[index].widgets = {};
                                if (!newItems[index].widgets.quick_facts) newItems[index].widgets.quick_facts = {};
                                newItems[index].widgets.quick_facts.enabled = e.target.checked;
                                setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                              }}
                              className="rounded text-indigo-500"
                            />
                            <span className="font-medium">📊 Quick Facts</span>
                          </label>
                          <span className="text-xs text-gray-400">Shows exam stats</span>
                        </div>
                      </div>
                      
                      {/* Quick Navigation Widget */}
                      <div className="bg-white border rounded p-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={item.widgets?.quick_nav?.enabled ?? true}
                              onChange={(e) => {
                                const newItems = [...(formData.menu_config?.items || [])];
                                if (!newItems[index].widgets) newItems[index].widgets = {};
                                if (!newItems[index].widgets.quick_nav) newItems[index].widgets.quick_nav = {};
                                newItems[index].widgets.quick_nav.enabled = e.target.checked;
                                setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                              }}
                              className="rounded text-indigo-500"
                            />
                            <span className="font-medium">📑 Quick Navigation</span>
                          </label>
                          <span className="text-xs text-gray-400">Menu links sidebar</span>
                        </div>
                      </div>
                      
                      {/* Contact CTA Widget */}
                      <div className="bg-white border rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={item.widgets?.contact_cta?.enabled ?? true}
                              onChange={(e) => {
                                const newItems = [...(formData.menu_config?.items || [])];
                                if (!newItems[index].widgets) newItems[index].widgets = {};
                                if (!newItems[index].widgets.contact_cta) newItems[index].widgets.contact_cta = {};
                                newItems[index].widgets.contact_cta.enabled = e.target.checked;
                                setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                              }}
                              className="rounded text-indigo-500"
                            />
                            <span className="font-medium">📞 Contact CTA</span>
                          </label>
                          <span className="text-xs text-gray-400">Need Help? box</span>
                        </div>
                        {item.widgets?.contact_cta?.enabled && (
                          <div className="ml-5 mt-1 space-y-1">
                            <input
                              type="text"
                              value={item.widgets?.contact_cta?.title || 'Need Help?'}
                              onChange={(e) => {
                                const newItems = [...(formData.menu_config?.items || [])];
                                if (!newItems[index].widgets) newItems[index].widgets = {};
                                if (!newItems[index].widgets.contact_cta) newItems[index].widgets.contact_cta = { enabled: true };
                                newItems[index].widgets.contact_cta.title = e.target.value;
                                setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                              }}
                              placeholder="CTA Title"
                              className="w-full border rounded px-2 py-0.5 text-xs"
                            />
                            <input
                              type="text"
                              value={item.widgets?.contact_cta?.subtitle || 'Get expert guidance'}
                              onChange={(e) => {
                                const newItems = [...(formData.menu_config?.items || [])];
                                if (!newItems[index].widgets.contact_cta) newItems[index].widgets.contact_cta = { enabled: true };
                                newItems[index].widgets.contact_cta.subtitle = e.target.value;
                                setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                              }}
                              placeholder="CTA Subtitle"
                              className="w-full border rounded px-2 py-0.5 text-xs"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Related Exams Widget */}
                      <div className="bg-white border rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={item.widgets?.related_exams?.enabled ?? false}
                              onChange={(e) => {
                                const newItems = [...(formData.menu_config?.items || [])];
                                if (!newItems[index].widgets) newItems[index].widgets = {};
                                if (!newItems[index].widgets.related_exams) newItems[index].widgets.related_exams = { enabled: false, exams: [] };
                                newItems[index].widgets.related_exams.enabled = e.target.checked;
                                setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                              }}
                              className="rounded text-indigo-500"
                            />
                            <span className="font-medium">🔗 Related Exams</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...(formData.menu_config?.items || [])];
                              if (!newItems[index].widgets) newItems[index].widgets = {};
                              if (!newItems[index].widgets.related_exams) newItems[index].widgets.related_exams = { enabled: true, exams: [] };
                              newItems[index].widgets.related_exams.exams.push({ name: '', url: '' });
                              setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                            }}
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            + Add Exam
                          </button>
                        </div>
                        {item.widgets?.related_exams?.enabled && item.widgets?.related_exams?.exams?.length > 0 && (
                          <div className="ml-5 mt-1 space-y-1">
                            {item.widgets.related_exams.exams.map((exam, examIndex) => (
                              <div key={examIndex} className="flex gap-1">
                                <input
                                  type="text"
                                  value={exam.name || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    newItems[index].widgets.related_exams.exams[examIndex].name = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder="Exam Name"
                                  className="flex-1 border rounded px-2 py-0.5 text-xs"
                                />
                                <input
                                  type="text"
                                  value={exam.url || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    newItems[index].widgets.related_exams.exams[examIndex].url = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder="/exams/jee-main"
                                  className="flex-1 border rounded px-2 py-0.5 text-xs font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    newItems[index].widgets.related_exams.exams = newItems[index].widgets.related_exams.exams.filter((_, i) => i !== examIndex);
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  className="text-red-400 hover:text-red-600 px-1"
                                >
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Download Widget */}
                      <div className="bg-white border rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={item.widgets?.download_widget?.enabled ?? false}
                              onChange={(e) => {
                                const newItems = [...(formData.menu_config?.items || [])];
                                if (!newItems[index].widgets) newItems[index].widgets = {};
                                if (!newItems[index].widgets.download_widget) newItems[index].widgets.download_widget = { enabled: false, title: 'Download Resources', files: [] };
                                newItems[index].widgets.download_widget.enabled = e.target.checked;
                                setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                              }}
                              className="rounded text-indigo-500"
                            />
                            <span className="font-medium">📥 Download Widget</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...(formData.menu_config?.items || [])];
                              if (!newItems[index].widgets) newItems[index].widgets = {};
                              if (!newItems[index].widgets.download_widget) newItems[index].widgets.download_widget = { enabled: true, title: 'Download Resources', files: [] };
                              newItems[index].widgets.download_widget.files.push({ name: '', url: '', type: 'pdf' });
                              setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                            }}
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            + Add File
                          </button>
                        </div>
                        {item.widgets?.download_widget?.enabled && (
                          <div className="ml-5 mt-1 space-y-1">
                            <input
                              type="text"
                              value={item.widgets?.download_widget?.title || 'Download Resources'}
                              onChange={(e) => {
                                const newItems = [...(formData.menu_config?.items || [])];
                                if (!newItems[index].widgets.download_widget) newItems[index].widgets.download_widget = { enabled: true, title: '', files: [] };
                                newItems[index].widgets.download_widget.title = e.target.value;
                                setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                              }}
                              placeholder="Widget Title"
                              className="w-full border rounded px-2 py-0.5 text-xs mb-1"
                            />
                            {(item.widgets?.download_widget?.files || []).map((file, fileIndex) => (
                              <div key={fileIndex} className="flex gap-1">
                                <input
                                  type="text"
                                  value={file.name || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    newItems[index].widgets.download_widget.files[fileIndex].name = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder="File Name"
                                  className="flex-1 border rounded px-2 py-0.5 text-xs"
                                />
                                <input
                                  type="text"
                                  value={file.url || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    newItems[index].widgets.download_widget.files[fileIndex].url = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder="File URL"
                                  className="flex-1 border rounded px-2 py-0.5 text-xs font-mono"
                                />
                                <select
                                  value={file.type || 'pdf'}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    newItems[index].widgets.download_widget.files[fileIndex].type = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  className="border rounded px-1 py-0.5 text-xs"
                                >
                                  <option value="pdf">PDF</option>
                                  <option value="doc">DOC</option>
                                  <option value="zip">ZIP</option>
                                  <option value="other">Other</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    newItems[index].widgets.download_widget.files = newItems[index].widgets.download_widget.files.filter((_, i) => i !== fileIndex);
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  className="text-red-400 hover:text-red-600 px-1"
                                >
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button type="button" onClick={addMenuItem} className="mt-4 flex items-center gap-2 px-4 py-2 border border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-500 hover:bg-blue-50 w-full justify-center">
            <FiPlus className="w-4 h-4" /> Add Custom Menu Item
          </button>
        </CollapsibleSection>

        {/* SEO Content Section */}
        <CollapsibleSection title="SEO Content" icon={<FiBook className="w-5 h-5" />} color="teal">
          <div className="space-y-6">
            {/* SEO Intro */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Introduction</label>
              <textarea name="seo_intro" value={formData.seo_intro} onChange={handleChange} rows="3" placeholder="Short intro paragraph for SEO..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
            </div>

            {/* SEO Full Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Full Content (HTML Supported)</label>
              <textarea name="seo_full_content" value={formData.seo_full_content} onChange={handleChange} rows="8" placeholder="Full SEO content with HTML..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm" />
            </div>

            {/* Table of Contents Builder */}
            <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-purple-800">📑 Table of Contents Builder</label>
                  <p className="text-xs text-purple-600">Create clickable TOC sections with content</p>
                </div>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">{formData.seo_toc?.length || 0} sections</span>
              </div>
              
              <div className="space-y-3 mb-4">
                {(formData.seo_toc || []).map((item, index) => (
                  <div key={index} className="bg-white rounded-lg border-2 border-purple-200 p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-800 rounded-full font-bold text-sm flex-shrink-0">{index + 1}</div>
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div><label className="block text-xs text-gray-600 mb-1">Section Title *</label>
                            <input type="text" value={item.title || ''} onChange={(e) => {
                              const newToc = [...(formData.seo_toc || [])];
                              newToc[index].title = e.target.value;
                              newToc[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 50);
                              setFormData({...formData, seo_toc: newToc});
                            }} placeholder="e.g., Exam Overview" className="w-full border-2 border-purple-200 rounded px-2 py-1.5 text-sm" /></div>
                          <div><label className="block text-xs text-gray-600 mb-1">Anchor ID</label>
                            <input type="text" value={item.anchor || ''} onChange={(e) => {
                              const newToc = [...(formData.seo_toc || [])];
                              newToc[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                              setFormData({...formData, seo_toc: newToc});
                            }} placeholder="exam-overview" className="w-full border rounded px-2 py-1.5 text-sm font-mono bg-gray-50" /></div>
                        </div>
                        <div><label className="block text-xs text-gray-600 mb-1">Section Content *</label>
                          <textarea value={item.content || ''} onChange={(e) => {
                            const newToc = [...(formData.seo_toc || [])];
                            newToc[index].content = e.target.value;
                            setFormData({...formData, seo_toc: newToc});
                          }} placeholder="Write content for this section..." rows="4" className="w-full border rounded px-2 py-1.5 text-sm" /></div>
                        <button type="button" onClick={() => {
                          const html = `<h2 id="${item.anchor}">${item.title}</h2>\n<div class="toc-section">\n${item.content}\n</div>`;
                          navigator.clipboard.writeText(html);
                          alert('Section HTML copied!');
                        }} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">📋 Copy Section HTML</button>
                      </div>
                      <button type="button" onClick={() => setFormData({...formData, seo_toc: (formData.seo_toc || []).filter((_, i) => i !== index)})} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button type="button" onClick={() => setFormData({...formData, seo_toc: [...(formData.seo_toc || []), { title: '', anchor: '', content: '' }]})}
                className="text-sm text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded border border-purple-300 flex items-center gap-1"><FiPlus /> Add TOC Section</button>
              
              {/* Quick Add Templates */}
              <div className="mt-4 p-3 bg-white border border-purple-200 rounded-lg">
                <p className="text-xs font-medium text-purple-800 mb-2">💡 Quick Add Sections:</p>
                <div className="flex flex-wrap gap-2">
                  {['About', 'Eligibility', 'Application Process', 'Exam Pattern', 'Syllabus', 'Preparation Tips', 'Cutoff', 'Result', 'Counseling', 'FAQs'].map((template, i) => (
                    <button key={i} type="button" onClick={() => {
                      const anchor = template.toLowerCase().replace(/\s+/g, '-');
                      if (!(formData.seo_toc || []).some(t => t.anchor === anchor)) {
                        setFormData({...formData, seo_toc: [...(formData.seo_toc || []), { title: template, anchor, content: '' }]});
                      }
                    }} className="text-xs bg-purple-50 border border-purple-200 text-purple-700 px-2 py-1 rounded hover:bg-purple-100">+ {template}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Builder */}
            <div className="border-2 border-teal-300 rounded-lg p-4 bg-teal-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-teal-800">📊 Table Builder</label>
                  <p className="text-xs text-teal-600">Create tables for cutoffs, exam pattern, dates, etc.</p>
                </div>
                <span className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded">{formData.seo_tables?.length || 0} tables</span>
              </div>

              <div className="space-y-4 mb-4">
                {(formData.seo_tables || []).map((table, tableIndex) => (
                  <div key={tableIndex} className="bg-white rounded-lg border-2 border-teal-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded">Table {tableIndex + 1}</span>
                        <input type="text" value={table.title || ''} onChange={(e) => {
                          const newTables = [...(formData.seo_tables || [])];
                          newTables[tableIndex].title = e.target.value;
                          setFormData({...formData, seo_tables: newTables});
                        }} placeholder="Table Title" className="border rounded px-2 py-1 text-sm w-48" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => {
                          const newTables = [...(formData.seo_tables || [])];
                          newTables[tableIndex].headers.push('New Column');
                          newTables[tableIndex].rows.forEach(row => row.push(''));
                          setFormData({...formData, seo_tables: newTables});
                        }} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">+ Column</button>
                        <button type="button" onClick={() => {
                          const newTables = [...(formData.seo_tables || [])];
                          newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
                          setFormData({...formData, seo_tables: newTables});
                        }} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200">+ Row</button>
                        <button type="button" onClick={() => setFormData({...formData, seo_tables: (formData.seo_tables || []).filter((_, i) => i !== tableIndex)})}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">Delete</button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr>
                            {(table.headers || []).map((header, colIndex) => (
                              <th key={colIndex} className="border border-teal-200 bg-teal-100 p-1">
                                <div className="flex items-center gap-1">
                                  <input type="text" value={header} onChange={(e) => {
                                    const newTables = [...(formData.seo_tables || [])];
                                    newTables[tableIndex].headers[colIndex] = e.target.value;
                                    setFormData({...formData, seo_tables: newTables});
                                  }} className="w-full border-0 bg-transparent font-semibold text-center text-teal-800 focus:outline-none" placeholder="Header" />
                                  {table.headers.length > 1 && (
                                    <button type="button" onClick={() => {
                                      const newTables = [...(formData.seo_tables || [])];
                                      newTables[tableIndex].headers.splice(colIndex, 1);
                                      newTables[tableIndex].rows.forEach(row => row.splice(colIndex, 1));
                                      setFormData({...formData, seo_tables: newTables});
                                    }} className="text-red-500 hover:text-red-700 text-xs">×</button>
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
                                  <input type="text" value={cell} onChange={(e) => {
                                    const newTables = [...(formData.seo_tables || [])];
                                    newTables[tableIndex].rows[rowIndex][colIndex] = e.target.value;
                                    setFormData({...formData, seo_tables: newTables});
                                  }} className="w-full border-0 bg-transparent px-1" placeholder="Cell" />
                                </td>
                              ))}
                              <td className="w-8">{table.rows.length > 1 && (
                                <button type="button" onClick={() => {
                                  const newTables = [...(formData.seo_tables || [])];
                                  newTables[tableIndex].rows.splice(rowIndex, 1);
                                  setFormData({...formData, seo_tables: newTables});
                                }} className="text-red-500 hover:text-red-700 text-xs p-1">×</button>
                              )}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => {
                        const tableHtml = `<table class="data-table"><caption>${table.title}</caption><thead><tr>${table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
                        navigator.clipboard.writeText(tableHtml);
                        alert('Table HTML copied!');
                      }} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200">📋 Copy HTML</button>
                      <button type="button" onClick={() => {
                        const tableHtml = `<table class="data-table"><caption>${table.title}</caption><thead><tr>${table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
                        setFormData({...formData, seo_full_content: (formData.seo_full_content || '') + '\n\n' + tableHtml});
                        alert('Table added to content!');
                      }} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200">⚡ Insert into Content</button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => setFormData({...formData, seo_tables: [...(formData.seo_tables || []), { title: '', headers: ['Column 1', 'Column 2', 'Column 3'], rows: [['', '', ''], ['', '', '']] }]})}
                className="text-sm text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded border border-teal-300 flex items-center gap-1"><FiPlus /> Add New Table</button>

              {/* Quick Table Templates */}
              <div className="mt-4 p-3 bg-white border border-teal-200 rounded-lg">
                <p className="text-xs font-medium text-teal-800 mb-2">💡 Quick Add Templates:</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setFormData({...formData, seo_tables: [...(formData.seo_tables || []), { title: 'Important Dates', headers: ['Event', 'Date', 'Status'], rows: [['Application Start', '', 'Upcoming'], ['Application End', '', ''], ['Exam Date', '', ''], ['Result', '', '']] }]})}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100">+ Important Dates</button>
                  <button type="button" onClick={() => setFormData({...formData, seo_tables: [...(formData.seo_tables || []), { title: 'Exam Pattern', headers: ['Section', 'Questions', 'Marks', 'Duration'], rows: [['Section A', '', '', ''], ['Section B', '', '', '']] }]})}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100">+ Exam Pattern</button>
                  <button type="button" onClick={() => setFormData({...formData, seo_tables: [...(formData.seo_tables || []), { title: 'Cutoff Marks', headers: ['Category', 'Opening Rank', 'Closing Rank'], rows: [['General', '', ''], ['OBC', '', ''], ['SC/ST', '', '']] }]})}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100">+ Cutoff</button>
                  <button type="button" onClick={() => setFormData({...formData, seo_tables: [...(formData.seo_tables || []), { title: 'Application Fee', headers: ['Category', 'Fee (₹)', 'Payment Mode'], rows: [['General/OBC', '', 'Online'], ['SC/ST/PwD', '', 'Online']] }]})}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100">+ Application Fee</button>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800">🖼️ Content Images</label>
                  <p className="text-xs text-blue-600">Add images with title & alt text</p>
                </div>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">{formData.seo_images?.length || 0} images</span>
              </div>

              <div className="mb-4">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors">
                  <div className="flex flex-col items-center justify-center py-4">
                    <FiUpload className="w-6 h-6 text-blue-500 mb-1" />
                    <p className="text-sm text-blue-600">{uploadingImage ? 'Uploading...' : 'Click to upload image'}</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              </div>

              {formData.seo_images?.length > 0 && (
                <div className="space-y-3">
                  {formData.seo_images.map((image, index) => (
                    <div key={index} className="bg-white rounded-lg border p-3">
                      <div className="flex gap-4">
                        <div className="w-32 h-24 flex-shrink-0">
                          <img src={image.url?.startsWith('/api') ? image.url : `/api${image.url}`} alt={image.alt || 'Image'} className="w-full h-full object-cover rounded border"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/128x96?text=Image'; }} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div><label className="block text-xs text-gray-600 mb-1">Image Title</label>
                              <input type="text" value={image.title || ''} onChange={(e) => {
                                const newImages = [...formData.seo_images];
                                newImages[index].title = e.target.value;
                                setFormData({...formData, seo_images: newImages});
                              }} placeholder="Image title" className="w-full border rounded px-2 py-1 text-sm" /></div>
                            <div><label className="block text-xs text-gray-600 mb-1">Alt Text</label>
                              <input type="text" value={image.alt || ''} onChange={(e) => {
                                const newImages = [...formData.seo_images];
                                newImages[index].alt = e.target.value;
                                setFormData({...formData, seo_images: newImages});
                              }} placeholder="Alt text for accessibility" className="w-full border rounded px-2 py-1 text-sm" /></div>
                          </div>
                          <div><label className="block text-xs text-gray-600 mb-1">Caption</label>
                            <input type="text" value={image.caption || ''} onChange={(e) => {
                              const newImages = [...formData.seo_images];
                              newImages[index].caption = e.target.value;
                              setFormData({...formData, seo_images: newImages});
                            }} placeholder="Image caption" className="w-full border rounded px-2 py-1 text-sm" /></div>
                          <button type="button" onClick={() => {
                            const imgHtml = `<figure><img src="${image.url}" alt="${image.alt || ''}" title="${image.title || ''}" />${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}</figure>`;
                            navigator.clipboard.writeText(imgHtml);
                            alert('Image HTML copied!');
                          }} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">📋 Copy HTML</button>
                        </div>
                        <button type="button" onClick={() => setFormData({...formData, seo_images: formData.seo_images.filter((_, i) => i !== index)})} className="text-red-500 hover:bg-red-50 p-1 rounded self-start"><FiTrash2 /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
              <label className="block text-sm font-medium text-orange-800 mb-2">🎬 Video Embed</label>
              <p className="text-xs text-orange-600 mb-3">YouTube or video embed URL with title & description</p>
              <div className="space-y-2">
                <div><label className="block text-xs text-gray-700 mb-1">Video URL</label>
                  <input type="url" name="seo_video_url" value={formData.seo_video_url} onChange={handleChange} placeholder="https://youtube.com/embed/..." className="w-full border rounded px-3 py-2" /></div>
                <div><label className="block text-xs text-gray-700 mb-1">Video Title</label>
                  <input type="text" name="seo_video_title" value={formData.seo_video_title || ''} onChange={handleChange} placeholder="Video title for accessibility" className="w-full border-2 border-orange-200 rounded px-3 py-2 text-sm" /></div>
                <div><label className="block text-xs text-gray-700 mb-1">Video Description</label>
                  <textarea name="seo_video_description" value={formData.seo_video_description || ''} onChange={handleChange} placeholder="Brief description..." rows="2" className="w-full border rounded px-3 py-2 text-sm" /></div>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <label className="block text-sm font-medium mb-2">SEO FAQs</label>
              <div className="space-y-3">
                {(formData.seo_faqs || []).map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-2">
                      <div><label className="block text-xs font-medium mb-1">Question {index + 1}</label>
                        <input type="text" value={faq.question || ''} onChange={(e) => {
                          const newFaqs = [...(formData.seo_faqs || [])];
                          newFaqs[index].question = e.target.value;
                          setFormData({...formData, seo_faqs: newFaqs});
                        }} placeholder="Question..." className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-xs font-medium mb-1">Answer</label>
                        <textarea value={faq.answer || ''} onChange={(e) => {
                          const newFaqs = [...(formData.seo_faqs || [])];
                          newFaqs[index].answer = e.target.value;
                          setFormData({...formData, seo_faqs: newFaqs});
                        }} placeholder="Answer..." rows="3" className="w-full border rounded px-3 py-2" /></div>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => setFormData({...formData, seo_faqs: (formData.seo_faqs || []).filter((_, i) => i !== index)})} className="mt-2">
                      <FiTrash2 className="mr-2" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" size="sm" onClick={() => setFormData({...formData, seo_faqs: [...(formData.seo_faqs || []), { question: '', answer: '' }]})} className="mt-3">
                <FiPlus className="mr-2" /> Add FAQ
              </Button>
            </div>
          </div>
        </CollapsibleSection>

        {/* Important Links */}
        <CollapsibleSection title="Important Links" icon={<FiExternalLink className="w-5 h-5" />} badge={`${formData.important_links?.length || 0} links`}>
          <div className="space-y-3">
            {(formData.important_links || []).map((link, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" value={link.title || ''} onChange={(e) => handleArrayObjectChange('important_links', index, 'title', e.target.value)} placeholder="Link title" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <input type="url" value={link.url || ''} onChange={(e) => handleArrayObjectChange('important_links', index, 'url', e.target.value)} placeholder="https://..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <button type="button" onClick={() => removeArrayItem('important_links', index)} className="text-red-500 hover:text-red-700 p-2"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayObjectItem('important_links', { title: '', url: '' })}
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600">
              <FiPlus className="w-4 h-4" /> Add Important Link
            </button>
          </div>
        </CollapsibleSection>

        {/* Statistics */}
        <CollapsibleSection title="Statistics & Info" icon={<FiUsers className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Applicants</label>
              <input type="number" name="total_applicants" value={formData.total_applicants} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
              <input type="number" name="total_seats" value={formData.total_seats} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Official Website</label>
              <input type="url" name="official_website" value={formData.official_website} onChange={handleChange} placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5" /></div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_popular" checked={formData.is_popular} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
              </label>
            </div>
          </div>
        </CollapsibleSection>

      </form>
    </div>
  );
};

export default ExamDetailForm;
