import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiTrash2, FiSend, FiCheck } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { generateSlug } from '../../utils/slugify';
import StatusBadge from '../../components/admin/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';

const ExamDetailForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
    application_fee: 0,
    exam_date: '',
    application_start: '',
    application_end: '',
    result_date: '',
    official_website: '',
    exam_duration: '',
    exam_mode: 'Online',
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
    total_applicants: 0,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (id) {
        await api.put(`/exams/${id}`, formData);
        alert('Exam updated successfully!');
      } else {
        await api.post('/exams', formData);
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
        <h1 className="text-3xl font-bold">{id ? 'Edit Exam Details' : 'Add New Exam (Detailed)'}</h1>
        <Button variant="outline" onClick={() => navigate('/admin/exams-detail')}>
          <FiX className="mr-2" /> Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Exam Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., JEE Main"
                className="w-full border rounded px-3 py-2"
              />
            </div>

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
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="e.g., Joint Entrance Examination Main"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exam Type *</label>
              <select
                name="exam_type"
                value={formData.exam_type}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="National">National Level</option>
                <option value="State">State Level</option>
                <option value="University">University Level</option>
                <option value="Institute">Institute Level</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exam Level *</label>
              <select
                name="exam_level"
                value={formData.exam_level}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="UG">Undergraduate</option>
                <option value="PG">Postgraduate</option>
                <option value="PhD">PhD/Doctorate</option>
                <option value="All">All Levels</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Conducting Body *</label>
              <input
                type="text"
                name="conducting_body"
                value={formData.conducting_body}
                onChange={handleChange}
                required
                placeholder="e.g., NTA, State Board"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State (If State Level)</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g., Maharashtra, Karnataka"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exam Mode</label>
              <select
                name="exam_mode"
                value={formData.exam_mode}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Online">Online (CBT)</option>
                <option value="Offline">Offline (Pen & Paper)</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Official Website</label>
              <input
                type="url"
                name="official_website"
                value={formData.official_website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Exam Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Exam Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exam Overview</label>
              <textarea
                name="exam_overview"
                value={formData.exam_overview}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exam Pattern</label>
              <textarea
                name="exam_pattern"
                value={formData.exam_pattern}
                onChange={handleChange}
                rows="4"
                placeholder="Number of sections, types of questions, duration..."
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exam Syllabus</label>
              <textarea
                name="exam_syllabus"
                value={formData.exam_syllabus}
                onChange={handleChange}
                rows="4"
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
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Age Limit</label>
              <input
                type="text"
                name="age_limit"
                value={formData.age_limit}
                onChange={handleChange}
                placeholder="e.g., 17-25 years"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Exam Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Exam Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Marks</label>
              <input
                type="number"
                name="total_marks"
                value={formData.total_marks}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Questions</label>
              <input
                type="number"
                name="total_questions"
                value={formData.total_questions}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exam Duration</label>
              <input
                type="text"
                name="exam_duration"
                value={formData.exam_duration}
                onChange={handleChange}
                placeholder="e.g., 3 hours, 180 minutes"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Application Fee</label>
              <input
                type="number"
                name="application_fee"
                value={formData.application_fee}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Applicants (Yearly)</label>
              <input
                type="number"
                name="total_applicants"
                value={formData.total_applicants}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Marking Scheme</label>
              <input
                type="text"
                name="marking_scheme"
                value={formData.marking_scheme}
                onChange={handleChange}
                placeholder="e.g., +4 for correct answer"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Negative Marking</label>
              <input
                type="text"
                name="negative_marking"
                value={formData.negative_marking}
                onChange={handleChange}
                placeholder="e.g., -1 for incorrect answer"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Important Dates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Application Start Date</label>
              <input
                type="text"
                name="application_start"
                value={formData.application_start}
                onChange={handleChange}
                placeholder="e.g., January 2026"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Application End Date</label>
              <input
                type="text"
                name="application_end"
                value={formData.application_end}
                onChange={handleChange}
                placeholder="e.g., March 2026"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exam Date</label>
              <input
                type="text"
                name="exam_date"
                value={formData.exam_date}
                onChange={handleChange}
                placeholder="e.g., May 2026"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Result Date</label>
              <input
                type="text"
                name="result_date"
                value={formData.result_date}
                onChange={handleChange}
                placeholder="e.g., June 2026"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Arrays */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Additional Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Languages Offered</label>
              {formData.languages_offered?.map((lang, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={lang}
                    onChange={(e) => handleArrayChange('languages_offered', index, e.target.value)}
                    placeholder="e.g., English, Hindi"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('languages_offered', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('languages_offered', '')} size="sm">
                <FiPlus className="mr-2" /> Add Language
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Exam Centers (Cities)</label>
              {formData.exam_centers?.map((center, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={center}
                    onChange={(e) => handleArrayChange('exam_centers', index, e.target.value)}
                    placeholder="e.g., Delhi, Mumbai, Bangalore"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('exam_centers', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('exam_centers', '')} size="sm">
                <FiPlus className="mr-2" /> Add Center
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Accepted By (Colleges/Universities)</label>
              {formData.accepted_by?.map((college, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => handleArrayChange('accepted_by', index, e.target.value)}
                    placeholder="e.g., IITs, NITs, Other Engineering Colleges"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('accepted_by', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('accepted_by', '')} size="sm">
                <FiPlus className="mr-2" /> Add Institution
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preparation Tips</label>
              {formData.preparation_tips?.map((tip, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => handleArrayChange('preparation_tips', index, e.target.value)}
                    placeholder="e.g., Focus on NCERT books"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('preparation_tips', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('preparation_tips', '')} size="sm">
                <FiPlus className="mr-2" /> Add Tip
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
            <span className="text-sm font-medium">Mark as Popular Exam</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/exams-detail')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="bg-orange-600 hover:bg-orange-700">
            <FiSave className="mr-2" />
            {saving ? 'Saving...' : id ? 'Update Exam' : 'Create Exam'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExamDetailForm;
