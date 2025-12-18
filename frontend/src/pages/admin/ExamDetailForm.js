import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiSave, FiX, FiPlus, FiTrash2, FiSend, FiCheck, FiUpload, FiLink, FiFile,
  FiChevronDown, FiChevronRight, FiCalendar, FiBook, FiUsers, FiAward,
  FiFileText, FiClipboard, FiExternalLink, FiDownload, FiEdit2, FiLoader
} from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { generateSlug } from '../../utils/slugify';
import StatusBadge from '../../components/admin/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

// Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = false, icon = null, badge = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-indigo-600">{icon}</span>}
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {badge && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
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

  // Role checks
  const isDataEntry = user?.role === 'data_entry';
  const canApprove = user?.role === 'super_admin' || user?.role === 'content_manager';

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    full_name: '',
    exam_type: 'National',
    exam_level: 'UG',
    conducting_body: '',
    state: '',
    description: '',
    exam_overview: '',
    exam_pattern: '',
    exam_syllabus: '',
    eligibility: '',
    age_limit: '',
    application_fee: { General: 0, OBC: 0, SC_ST: 0 },
    exam_date: '',
    application_start: '',
    application_end: '',
    result_date: '',
    counseling_date: '',
    official_website: '',
    exam_duration: '',
    exam_mode: 'Online',
    streams: [],
    sections: [],
    marking_scheme: '',
    negative_marking: '',
    total_marks: 0,
    total_questions: 0,
    languages_offered: [],
    exam_centers: [],
    accepted_by: [],
    preparation_tips: [],
    previous_year_cutoffs: [],
    important_dates: [],
    question_papers: [],
    study_materials: [],
    important_links: [],
    total_applicants: 0,
    total_seats: 0,
    difficulty_level: 'Medium',
    is_popular: false,
    status: 'draft'
  });

  useEffect(() => {
    if (id) {
      fetchExam();
    }
  }, [id]);

  const fetchExam = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/exams/${id}`);
      setFormData({ ...formData, ...response.data });
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

  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: value }
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleArrayObjectChange = (field, index, key, value) => {
    const newArray = [...formData[field]];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData({ ...formData, [field]: [...formData[field], defaultValue] });
  };

  const addArrayObjectItem = (field, defaultObj) => {
    setFormData({ ...formData, [field]: [...formData[field], defaultObj] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
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
      
      const newArray = [...formData[field]];
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

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        status: saveAsDraft ? 'draft' : formData.status
      };
      
      if (id) {
        await api.put(`/exams/${id}`, dataToSave);
        alert('Exam updated successfully!');
      } else {
        await api.post('/exams', dataToSave);
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
      console.error('Error submitting for review:', error);
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
      alert('Exam approved and published!');
    } catch (error) {
      console.error('Error approving:', error);
      alert('Error approving exam');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setActionLoading(true);
    try {
      await api.post(`/admin/approve/exam/${id}`, { action: 'reject', comment: reason });
      const response = await api.get(`/exams/${id}`);
      setFormData({ ...formData, ...response.data });
      alert('Exam rejected');
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Error rejecting exam');
    } finally {
      setActionLoading(false);
    }
  };

  const streams = ['Engineering', 'Medical', 'Management', 'Law', 'Design', 'Architecture', 'Science', 'Commerce', 'Arts', 'Pharmacy', 'Agriculture'];
  const indianStates = ['All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'];

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
              {/* Approval Actions */}
              {id && formData.status === 'draft' && (
                <Button 
                  type="button" 
                  onClick={handleSubmitForReview}
                  disabled={actionLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FiSend className="mr-2 w-4 h-4" /> Submit for Review
                </Button>
              )}
              {id && formData.status === 'pending' && canApprove && (
                <>
                  <Button 
                    type="button" 
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <FiCheck className="mr-2 w-4 h-4" /> Approve
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleReject}
                    disabled={actionLoading}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <FiX className="mr-2 w-4 h-4" /> Reject
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => navigate('/admin/exams-detail')}>
                <FiX className="mr-2 w-4 h-4" /> Cancel
              </Button>
              <Button 
                onClick={(e) => handleSubmit(e, true)} 
                disabled={saving}
                variant="outline"
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
              >
                {saving ? <FiLoader className="mr-2 w-4 h-4 animate-spin" /> : <FiSave className="mr-2 w-4 h-4" />}
                Save Draft
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {saving ? <FiLoader className="mr-2 w-4 h-4 animate-spin" /> : <FiSave className="mr-2 w-4 h-4" />}
                Save & Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Reason Alert */}
      {formData.status === 'rejected' && formData.rejection_reason && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-start gap-3">
            <FiX className="w-5 h-5 mt-0.5" />
            <div>
              <strong className="font-semibold">Rejection Reason:</strong>
              <p className="mt-1">{formData.rejection_reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        
        {/* Basic Information */}
        <CollapsibleSection title="Basic Information" icon={<FiFileText className="w-5 h-5" />} defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., JEE Main 2025"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="e.g., Joint Entrance Examination Main"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conducting Body</label>
              <input
                type="text"
                name="conducting_body"
                value={formData.conducting_body}
                onChange={handleChange}
                placeholder="e.g., NTA"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
              <select
                name="exam_type"
                value={formData.exam_type}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="National">National Level</option>
                <option value="State">State Level</option>
                <option value="University">University Level</option>
                <option value="Institute">Institute Level</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Level *</label>
              <select
                name="exam_level"
                value={formData.exam_level}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Diploma">Diploma</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State (for State Level)</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Mode</label>
              <select
                name="exam_mode"
                value={formData.exam_mode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Online">Online (CBT)</option>
                <option value="Offline">Offline (Pen & Paper)</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
              <select
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of the exam..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Streams</label>
              <div className="flex flex-wrap gap-2">
                {streams.map(stream => (
                  <label key={stream} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.streams?.includes(stream) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, streams: [...(formData.streams || []), stream] });
                        } else {
                          setFormData({ ...formData, streams: (formData.streams || []).filter(s => s !== stream) });
                        }
                      }}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{stream}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Important Dates */}
        <CollapsibleSection title="Important Dates" icon={<FiCalendar className="w-5 h-5" />} defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Start Date</label>
              <input type="date" name="application_start" value={formData.application_start} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application End Date</label>
              <input type="date" name="application_end" value={formData.application_end} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
              <input type="date" name="exam_date" value={formData.exam_date} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Result Date</label>
              <input type="date" name="result_date" value={formData.result_date} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Counseling Date</label>
              <input type="date" name="counseling_date" value={formData.counseling_date} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        </CollapsibleSection>

        {/* Exam Details */}
        <CollapsibleSection title="Exam Pattern & Details" icon={<FiClipboard className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Duration</label>
              <input type="text" name="exam_duration" value={formData.exam_duration} onChange={handleChange}
                placeholder="e.g., 3 Hours" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
              <input type="number" name="total_marks" value={formData.total_marks} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Questions</label>
              <input type="number" name="total_questions" value={formData.total_questions} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Negative Marking</label>
              <input type="text" name="negative_marking" value={formData.negative_marking} onChange={handleChange}
                placeholder="e.g., -1 per wrong answer" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Pattern (Detailed)</label>
            <textarea name="exam_pattern" value={formData.exam_pattern} onChange={handleChange} rows="4"
              placeholder="Describe the exam pattern, sections, marks distribution..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
            <textarea name="exam_syllabus" value={formData.exam_syllabus} onChange={handleChange} rows="4"
              placeholder="List the syllabus topics..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </CollapsibleSection>

        {/* Application Fees */}
        <CollapsibleSection title="Application Fees" icon={<FiAward className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">General (₹)</label>
              <input type="number" value={formData.application_fee?.General || 0}
                onChange={(e) => handleNestedChange('application_fee', 'General', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OBC (₹)</label>
              <input type="number" value={formData.application_fee?.OBC || 0}
                onChange={(e) => handleNestedChange('application_fee', 'OBC', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SC/ST (₹)</label>
              <input type="number" value={formData.application_fee?.SC_ST || 0}
                onChange={(e) => handleNestedChange('application_fee', 'SC_ST', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        </CollapsibleSection>

        {/* Question Papers Table */}
        <CollapsibleSection title="Question Papers" icon={<FiFile className="w-5 h-5" />} badge={`${formData.question_papers?.length || 0} papers`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Paper Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Shift/Set</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">File Upload</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">External Link</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(formData.question_papers || []).map((paper, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={paper.year || ''}
                        onChange={(e) => handleArrayObjectChange('question_papers', index, 'year', e.target.value)}
                        placeholder="2024"
                        className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={paper.name || ''}
                        onChange={(e) => handleArrayObjectChange('question_papers', index, 'name', e.target.value)}
                        placeholder="JEE Main Paper 1"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={paper.shift || ''}
                        onChange={(e) => handleArrayObjectChange('question_papers', index, 'shift', e.target.value)}
                        placeholder="Morning Shift"
                        className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {paper.file_url ? (
                        <div className="flex items-center gap-2">
                          <a href={paper.file_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1">
                            <FiDownload className="w-4 h-4" />
                            {paper.file_name || 'Download'}
                          </a>
                          <button type="button" onClick={() => handleArrayObjectChange('question_papers', index, 'file_url', '')} className="text-red-500 hover:text-red-700">
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-indigo-600">
                          <FiUpload className="w-4 h-4" />
                          <span className="text-sm">{uploadingFile ? 'Uploading...' : 'Upload PDF'}</span>
                          <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'question_papers', index)} disabled={uploadingFile} />
                        </label>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <HyperlinkInput
                        value={paper.external_link}
                        onChange={(link) => handleArrayObjectChange('question_papers', index, 'external_link', link)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button type="button" onClick={() => removeArrayItem('question_papers', index)} className="text-red-500 hover:text-red-700 p-1">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayObjectItem('question_papers', { year: '', name: '', shift: '', file_url: '', external_link: null })}
            className="mt-4 flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <FiPlus className="w-4 h-4" /> Add Question Paper
          </button>
        </CollapsibleSection>

        {/* Study Materials */}
        <CollapsibleSection title="Study Materials & Resources" icon={<FiBook className="w-5 h-5" />} badge={`${formData.study_materials?.length || 0} items`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Link / File</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(formData.study_materials || []).map((material, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={material.title || ''}
                        onChange={(e) => handleArrayObjectChange('study_materials', index, 'title', e.target.value)}
                        placeholder="Material title"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={material.type || 'PDF'}
                        onChange={(e) => handleArrayObjectChange('study_materials', index, 'type', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="PDF">PDF</option>
                        <option value="Video">Video</option>
                        <option value="Article">Article</option>
                        <option value="Book">Book</option>
                        <option value="Notes">Notes</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={material.description || ''}
                        onChange={(e) => handleArrayObjectChange('study_materials', index, 'description', e.target.value)}
                        placeholder="Brief description"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <HyperlinkInput
                        value={material.link}
                        onChange={(link) => handleArrayObjectChange('study_materials', index, 'link', link)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button type="button" onClick={() => removeArrayItem('study_materials', index)} className="text-red-500 hover:text-red-700 p-1">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayObjectItem('study_materials', { title: '', type: 'PDF', description: '', link: null })}
            className="mt-4 flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <FiPlus className="w-4 h-4" /> Add Study Material
          </button>
        </CollapsibleSection>

        {/* Important Links */}
        <CollapsibleSection title="Important Links" icon={<FiExternalLink className="w-5 h-5" />} badge={`${formData.important_links?.length || 0} links`}>
          <div className="space-y-3">
            {(formData.important_links || []).map((link, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={link.title || ''}
                    onChange={(e) => handleArrayObjectChange('important_links', index, 'title', e.target.value)}
                    placeholder="Link title (e.g., Official Website)"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="url"
                    value={link.url || ''}
                    onChange={(e) => handleArrayObjectChange('important_links', index, 'url', e.target.value)}
                    placeholder="https://example.com"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button type="button" onClick={() => removeArrayItem('important_links', index)} className="text-red-500 hover:text-red-700 p-2">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayObjectItem('important_links', { title: '', url: '' })}
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              <FiPlus className="w-4 h-4" /> Add Important Link
            </button>
          </div>
        </CollapsibleSection>

        {/* Statistics */}
        <CollapsibleSection title="Statistics & Additional Info" icon={<FiUsers className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Applicants</label>
              <input type="number" name="total_applicants" value={formData.total_applicants} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
              <input type="number" name="total_seats" value={formData.total_seats} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Official Website</label>
              <input type="url" name="official_website" value={formData.official_website} onChange={handleChange}
                placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_popular" checked={formData.is_popular} onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Mark as Popular Exam</span>
              </label>
            </div>
          </div>
        </CollapsibleSection>

      </form>
    </div>
  );
};

export default ExamDetailForm;
