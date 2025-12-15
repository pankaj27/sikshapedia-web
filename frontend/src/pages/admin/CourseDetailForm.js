import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { generateSlug } from '../../utils/slugify';

const CourseDetailForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [streams, setStreams] = useState([]);
  const [subStreams, setSubStreams] = useState([]);
  const [exams, setExams] = useState([]);

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
  });

  useEffect(() => {
    fetchDropdownData();
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchDropdownData = async () => {
    try {
      const [streamsRes, subStreamsRes, examsRes] = await Promise.all([
        api.get('/streams'),
        api.get('/sub-streams'),
        api.get('/exams')
      ]);
      setStreams(streamsRes.data);
      setSubStreams(subStreamsRes.data);
      setExams(examsRes.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (id) {
        await api.put(`/courses/${id}`, formData);
        alert('Course updated successfully!');
      } else {
        await api.post('/courses', formData);
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
        <h1 className="text-3xl font-bold">{id ? 'Edit Course Details' : 'Add New Course (Detailed)'}</h1>
        <Button variant="outline" onClick={() => navigate('/admin/courses-detail')}>
          <FiX className="mr-2" /> Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Course Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., B.Tech Computer Science Engineering"
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
