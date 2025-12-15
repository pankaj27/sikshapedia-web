import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';

const CollegeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const getDefaultFormData = () => ({
    name: '',
    slug: '',
    location: { city: '', state: '', address: '' },
    established: '',
    established_year: new Date().getFullYear(),
    type: 'Government',
    affiliation: '',
    recognized_by: [],
    affiliated_to: '',
    memberships: [],
    nirf_ranking: null,
    india_today_ranking: null,
    outlook_ranking: null,
    rankings: [],
    average_fees: 0,
    total_courses: 0,
    courses: [],
    facilities: [],
    hostel_info: { available: false, fee_per_semester: 0, description: '' },
    campus_size: '',
    campus_images: [],
    campus_video_url: '',
    contact_info: { phone: '', email: '', website: '' },
    images: [],
    videos: [],
    brochure_url: '',
    virtual_tour_url: '',
    description: '',
    highlights: [],
    admission_process: '',
    admission_dates: [],
    seo_intro: '',
    seo_full_content: '',
    seo_video_url: '',
    seo_faqs: [],
    accreditations: [],
    approvals: [],
    placement: {
      highest: 0,
      average: 0,
      percentage: 0,
      students_participated: 0,
      companies_participated: 0,
      total_offers: 0,
      top_recruiters: []
    },
    cutoff_data: [],
    scholarships: [],
    updates: [],
    total_students: 0,
    rating: 0,
    total_reviews: 0
  });

  const [formData, setFormData] = useState(getDefaultFormData());

  useEffect(() => {
    if (id) {
      fetchCollege();
    }
  }, [id]);

  const fetchCollege = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/colleges/${id}`);
      const collegeData = response.data;
      
      // Ensure all arrays are properly initialized
      const normalizedData = {
        ...getDefaultFormData(),
        ...collegeData,
        recognized_by: Array.isArray(collegeData.recognized_by) ? collegeData.recognized_by : [],
        memberships: Array.isArray(collegeData.memberships) ? collegeData.memberships : [],
        rankings: Array.isArray(collegeData.rankings) ? collegeData.rankings : [],
        courses: Array.isArray(collegeData.courses) ? collegeData.courses : [],
        facilities: Array.isArray(collegeData.facilities) ? collegeData.facilities : [],
        campus_images: Array.isArray(collegeData.campus_images) ? collegeData.campus_images : [],
        images: Array.isArray(collegeData.images) ? collegeData.images : [],
        videos: Array.isArray(collegeData.videos) ? collegeData.videos : [],
        highlights: Array.isArray(collegeData.highlights) ? collegeData.highlights : [],
        admission_dates: Array.isArray(collegeData.admission_dates) ? collegeData.admission_dates : [],
        accreditations: Array.isArray(collegeData.accreditations) ? collegeData.accreditations : [],
        approvals: Array.isArray(collegeData.approvals) ? collegeData.approvals : [],
        cutoff_data: Array.isArray(collegeData.cutoff_data) ? collegeData.cutoff_data : [],
        scholarships: Array.isArray(collegeData.scholarships) ? collegeData.scholarships : [],
        updates: Array.isArray(collegeData.updates) ? collegeData.updates : [],
        location: collegeData.location || { city: '', state: '', address: '' },
        contact_info: collegeData.contact_info || { phone: '', email: '', website: '' },
        placement: {
          highest: collegeData.placement?.highest || 0,
          average: collegeData.placement?.average || 0,
          percentage: collegeData.placement?.percentage || 0,
          students_participated: collegeData.placement?.students_participated || 0,
          companies_participated: collegeData.placement?.companies_participated || 0,
          total_offers: collegeData.placement?.total_offers || 0,
          top_recruiters: Array.isArray(collegeData.placement?.top_recruiters) ? collegeData.placement.top_recruiters : []
        }
      };
      
      setFormData(normalizedData);
    } catch (error) {
      console.error('Error fetching college:', error);
      alert('Failed to fetch college details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const addArrayItem = (field, defaultValue = '') => {
    setFormData({ ...formData, [field]: [...formData[field], defaultValue] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const addCourse = () => {
    setFormData({
      ...formData,
      courses: [
        ...formData.courses,
        { name: '', duration: '', first_year_fee: 0, total_fee: 0, eligibility: '', selection_criteria: '' }
      ]
    });
  };

  const updateCourse = (index, field, value) => {
    const newCourses = [...formData.courses];
    newCourses[index][field] = value;
    setFormData({ ...formData, courses: newCourses });
  };

  const removeCourse = (index) => {
    setFormData({ ...formData, courses: formData.courses.filter((_, i) => i !== index) });
  };

  const addFacility = () => {
    setFormData({
      ...formData,
      facilities: [...formData.facilities, { name: '', description: '', icon: '' }]
    });
  };

  const updateFacility = (index, field, value) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index][field] = value;
    setFormData({ ...formData, facilities: newFacilities });
  };

  const removeFacility = (index) => {
    setFormData({ ...formData, facilities: formData.facilities.filter((_, i) => i !== index) });
  };

  const addRanking = () => {
    setFormData({
      ...formData,
      rankings: [...formData.rankings, { agency: '', year: new Date().getFullYear(), category: '', rank: null }]
    });
  };

  const updateRanking = (index, field, value) => {
    const newRankings = [...formData.rankings];
    newRankings[index][field] = value;
    setFormData({ ...formData, rankings: newRankings });
  };

  const removeRanking = (index) => {
    setFormData({ ...formData, rankings: formData.rankings.filter((_, i) => i !== index) });
  };

  const addScholarship = () => {
    setFormData({
      ...formData,
      scholarships: [...formData.scholarships, { name: '', description: '', amount: '' }]
    });
  };

  const updateScholarship = (index, field, value) => {
    const newScholarships = [...formData.scholarships];
    newScholarships[index][field] = value;
    setFormData({ ...formData, scholarships: newScholarships });
  };

  const removeScholarship = (index) => {
    setFormData({ ...formData, scholarships: formData.scholarships.filter((_, i) => i !== index) });
  };

  const addAdmissionDate = () => {
    setFormData({
      ...formData,
      admission_dates: [...formData.admission_dates, { event: '', date: '' }]
    });
  };

  const updateAdmissionDate = (index, field, value) => {
    const newDates = [...formData.admission_dates];
    newDates[index][field] = value;
    setFormData({ ...formData, admission_dates: newDates });
  };

  const removeAdmissionDate = (index) => {
    setFormData({ ...formData, admission_dates: formData.admission_dates.filter((_, i) => i !== index) });
  };

  const addCutoff = () => {
    setFormData({
      ...formData,
      cutoff_data: [
        ...formData.cutoff_data,
        { course: '', opening_rank: null, closing_rank_current: null, closing_rank_previous: null, year: new Date().getFullYear() }
      ]
    });
  };

  const updateCutoff = (index, field, value) => {
    const newCutoffs = [...formData.cutoff_data];
    newCutoffs[index][field] = value;
    setFormData({ ...formData, cutoff_data: newCutoffs });
  };

  const removeCutoff = (index) => {
    setFormData({ ...formData, cutoff_data: formData.cutoff_data.filter((_, i) => i !== index) });
  };

  const addUpdate = () => {
    setFormData({
      ...formData,
      updates: [...formData.updates, { date: '', title: '', content: '' }]
    });
  };

  const updateUpdate = (index, field, value) => {
    const newUpdates = [...formData.updates];
    newUpdates[index][field] = value;
    setFormData({ ...formData, updates: newUpdates });
  };

  const removeUpdate = (index) => {
    setFormData({ ...formData, updates: formData.updates.filter((_, i) => i !== index) });
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      seo_faqs: [...formData.seo_faqs, { question: '', answer: '' }]
    });
  };

  const updateFAQ = (index, field, value) => {
    const newFAQs = [...formData.seo_faqs];
    newFAQs[index][field] = value;
    setFormData({ ...formData, seo_faqs: newFAQs });
  };

  const removeFAQ = (index) => {
    setFormData({ ...formData, seo_faqs: formData.seo_faqs.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (id) {
        await api.put(`/colleges/${id}`, formData);
        alert('College updated successfully!');
      } else {
        await api.post('/colleges', formData);
        alert('College created successfully!');
      }
      navigate('/admin/colleges');
    } catch (error) {
      console.error('Error saving college:', error);
      alert(`Failed to save college: ${error.response?.data?.detail || error.message}`);
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
        <h1 className="text-3xl font-bold">{id ? 'Edit College' : 'Add New College'}</h1>
        <Button variant="outline" onClick={() => navigate('/admin/colleges')}>
          <FiX className="mr-2" /> Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">College Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Deemed">Deemed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Established Year *</label>
              <input
                type="number"
                name="established_year"
                value={formData.established_year}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Established (Text)</label>
              <input
                type="text"
                name="established"
                value={formData.established}
                onChange={handleChange}
                placeholder="e.g., 1961"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Affiliated To</label>
              <input
                type="text"
                name="affiliated_to"
                value={formData.affiliated_to}
                onChange={handleChange}
                placeholder="e.g., Mumbai University"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Campus Size</label>
              <input
                type="text"
                name="campus_size"
                value={formData.campus_size}
                onChange={handleChange}
                placeholder="e.g., 550 acres"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Students</label>
              <input
                type="number"
                name="total_students"
                value={formData.total_students}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <input
                type="text"
                value={formData.location.state}
                onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Full Address</label>
              <textarea
                value={formData.location.address || ''}
                onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                rows="2"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Description & Highlights</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Highlights</label>
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('highlights', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('highlights', '')} size="sm">
                <FiPlus className="mr-2" /> Add Highlight
              </Button>
            </div>
          </div>
        </div>

        {/* Recognition & Accreditation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recognition & Accreditation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Recognized By</label>
              {formData.recognized_by.map((org, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => handleArrayChange('recognized_by', index, e.target.value)}
                    placeholder="e.g., UGC, AICTE, NBA"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('recognized_by', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('recognized_by', '')} size="sm">
                <FiPlus className="mr-2" /> Add Recognition
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Memberships</label>
              {formData.memberships.map((membership, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={membership}
                    onChange={(e) => handleArrayChange('memberships', index, e.target.value)}
                    placeholder="e.g., AIU, ACU"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('memberships', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('memberships', '')} size="sm">
                <FiPlus className="mr-2" /> Add Membership
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Accreditations</label>
              {formData.accreditations.map((accr, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={accr}
                    onChange={(e) => handleArrayChange('accreditations', index, e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('accreditations', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('accreditations', '')} size="sm">
                <FiPlus className="mr-2" /> Add Accreditation
              </Button>
            </div>
          </div>
        </div>

        {/* Rankings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Rankings</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">NIRF Ranking</label>
              <input
                type="number"
                name="nirf_ranking"
                value={formData.nirf_ranking || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">India Today Ranking</label>
              <input
                type="number"
                name="india_today_ranking"
                value={formData.india_today_ranking || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Outlook Ranking</label>
              <input
                type="number"
                name="outlook_ranking"
                value={formData.outlook_ranking || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Detailed Rankings</label>
            {formData.rankings.map((ranking, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Agency"
                  value={ranking.agency}
                  onChange={(e) => updateRanking(index, 'agency', e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={ranking.year}
                  onChange={(e) => updateRanking(index, 'year', parseInt(e.target.value))}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={ranking.category}
                  onChange={(e) => updateRanking(index, 'category', e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Rank"
                  value={ranking.rank}
                  onChange={(e) => updateRanking(index, 'rank', parseInt(e.target.value))}
                  className="border rounded px-3 py-2"
                />
                <Button type="button" variant="outline" onClick={() => removeRanking(index)}>
                  <FiTrash2 />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addRanking} size="sm">
              <FiPlus className="mr-2" /> Add Ranking
            </Button>
          </div>
        </div>

        {/* Courses & Fees */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Courses & Fees</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Average Fees (Annual) *</label>
            <input
              type="number"
              name="average_fees"
              value={formData.average_fees}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Courses</label>
            {formData.courses.map((course, index) => (
              <div key={index} className="border rounded p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={course.name}
                    onChange={(e) => updateCourse(index, 'name', e.target.value)}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={course.duration}
                    onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="First Year Fee"
                    value={course.first_year_fee}
                    onChange={(e) => updateCourse(index, 'first_year_fee', parseFloat(e.target.value))}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Total Fee"
                    value={course.total_fee}
                    onChange={(e) => updateCourse(index, 'total_fee', parseFloat(e.target.value))}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Eligibility"
                    value={course.eligibility}
                    onChange={(e) => updateCourse(index, 'eligibility', e.target.value)}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Selection Criteria"
                    value={course.selection_criteria}
                    onChange={(e) => updateCourse(index, 'selection_criteria', e.target.value)}
                    className="border rounded px-3 py-2"
                  />
                </div>
                <Button type="button" variant="outline" onClick={() => removeCourse(index)}>
                  <FiTrash2 className="mr-2" /> Remove Course
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addCourse} size="sm">
              <FiPlus className="mr-2" /> Add Course
            </Button>
          </div>
        </div>

        {/* Admission Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Admission Details</h2>
          <div className="mb-4">
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
            <label className="block text-sm font-medium mb-2">Admission Dates</label>
            {formData.admission_dates.map((date, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Event"
                  value={date.event}
                  onChange={(e) => updateAdmissionDate(index, 'event', e.target.value)}
                  className="border rounded px-3 py-2 col-span-2"
                />
                <input
                  type="text"
                  placeholder="Date"
                  value={date.date}
                  onChange={(e) => updateAdmissionDate(index, 'date', e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeAdmissionDate(index)}
                  className="col-span-3"
                >
                  <FiTrash2 className="mr-2" /> Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addAdmissionDate} size="sm">
              <FiPlus className="mr-2" /> Add Admission Date
            </Button>
          </div>
        </div>

        {/* Cutoff Data */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Cutoff Data</h2>
          {formData.cutoff_data.map((cutoff, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 mb-2">
              <input
                type="text"
                placeholder="Course"
                value={cutoff.course}
                onChange={(e) => updateCutoff(index, 'course', e.target.value)}
                className="border rounded px-3 py-2 col-span-2"
              />
              <input
                type="number"
                placeholder="Opening Rank"
                value={cutoff.opening_rank}
                onChange={(e) => updateCutoff(index, 'opening_rank', parseInt(e.target.value))}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Closing Current"
                value={cutoff.closing_rank_current}
                onChange={(e) => updateCutoff(index, 'closing_rank_current', parseInt(e.target.value))}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Closing Previous"
                value={cutoff.closing_rank_previous}
                onChange={(e) => updateCutoff(index, 'closing_rank_previous', parseInt(e.target.value))}
                className="border rounded px-3 py-2"
              />
              <Button type="button" variant="outline" onClick={() => removeCutoff(index)}>
                <FiTrash2 />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addCutoff} size="sm">
            <FiPlus className="mr-2" /> Add Cutoff
          </Button>
        </div>

        {/* Placement Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Placement Details</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Highest Package (INR)</label>
              <input
                type="number"
                value={formData.placement.highest}
                onChange={(e) => handleNestedChange('placement', 'highest', parseFloat(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Average Package (INR)</label>
              <input
                type="number"
                value={formData.placement.average}
                onChange={(e) => handleNestedChange('placement', 'average', parseFloat(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Placement Percentage</label>
              <input
                type="number"
                value={formData.placement.percentage}
                onChange={(e) => handleNestedChange('placement', 'percentage', parseFloat(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Students Participated</label>
              <input
                type="number"
                value={formData.placement.students_participated}
                onChange={(e) => handleNestedChange('placement', 'students_participated', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Companies Participated</label>
              <input
                type="number"
                value={formData.placement.companies_participated}
                onChange={(e) => handleNestedChange('placement', 'companies_participated', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Offers</label>
              <input
                type="number"
                value={formData.placement.total_offers}
                onChange={(e) => handleNestedChange('placement', 'total_offers', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Top Recruiters</label>
            {formData.placement.top_recruiters.map((recruiter, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={recruiter}
                  onChange={(e) => {
                    const newRecruiters = [...formData.placement.top_recruiters];
                    newRecruiters[index] = e.target.value;
                    setFormData({
                      ...formData,
                      placement: { ...formData.placement, top_recruiters: newRecruiters }
                    });
                  }}
                  className="flex-1 border rounded px-3 py-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newRecruiters = formData.placement.top_recruiters.filter((_, i) => i !== index);
                    setFormData({
                      ...formData,
                      placement: { ...formData.placement, top_recruiters: newRecruiters }
                    });
                  }}
                >
                  <FiTrash2 />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  placement: {
                    ...formData.placement,
                    top_recruiters: [...formData.placement.top_recruiters, '']
                  }
                });
              }}
              size="sm"
            >
              <FiPlus className="mr-2" /> Add Recruiter
            </Button>
          </div>
        </div>

        {/* Scholarships */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Scholarships</h2>
          {formData.scholarships.map((scholarship, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input
                  type="text"
                  placeholder="Scholarship Name"
                  value={scholarship.name}
                  onChange={(e) => updateScholarship(index, 'name', e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={scholarship.amount}
                  onChange={(e) => updateScholarship(index, 'amount', e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <textarea
                  placeholder="Description"
                  value={scholarship.description}
                  onChange={(e) => updateScholarship(index, 'description', e.target.value)}
                  className="border rounded px-3 py-2 col-span-2"
                  rows="2"
                />
              </div>
              <Button type="button" variant="outline" onClick={() => removeScholarship(index)}>
                <FiTrash2 className="mr-2" /> Remove Scholarship
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addScholarship} size="sm">
            <FiPlus className="mr-2" /> Add Scholarship
          </Button>
        </div>

        {/* Facilities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Facilities</h2>
          {formData.facilities.map((facility, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 mb-2">
                <input
                  type="text"
                  placeholder="Facility Name"
                  value={facility.name}
                  onChange={(e) => updateFacility(index, 'name', e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Icon (emoji or text)"
                  value={facility.icon}
                  onChange={(e) => updateFacility(index, 'icon', e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <textarea
                  placeholder="Description"
                  value={facility.description}
                  onChange={(e) => updateFacility(index, 'description', e.target.value)}
                  className="border rounded px-3 py-2 col-span-3"
                  rows="2"
                />
              </div>
              <Button type="button" variant="outline" onClick={() => removeFacility(index)}>
                <FiTrash2 className="mr-2" /> Remove Facility
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addFacility} size="sm">
            <FiPlus className="mr-2" /> Add Facility
          </Button>
        </div>

        {/* Updates & News */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Updates & News</h2>
          {formData.updates.map((update, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input
                  type="text"
                  placeholder="Date"
                  value={update.date}
                  onChange={(e) => updateUpdate(index, 'date', e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={update.title}
                  onChange={(e) => updateUpdate(index, 'title', e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <textarea
                  placeholder="Content"
                  value={update.content}
                  onChange={(e) => updateUpdate(index, 'content', e.target.value)}
                  className="border rounded px-3 py-2 col-span-2"
                  rows="2"
                />
              </div>
              <Button type="button" variant="outline" onClick={() => removeUpdate(index)}>
                <FiTrash2 className="mr-2" /> Remove Update
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addUpdate} size="sm">
            <FiPlus className="mr-2" /> Add Update
          </Button>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={formData.contact_info.phone}
                onChange={(e) => handleNestedChange('contact_info', 'phone', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.contact_info.email}
                onChange={(e) => handleNestedChange('contact_info', 'email', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                value={formData.contact_info.website}
                onChange={(e) => handleNestedChange('contact_info', 'website', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Media & Resources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Media & Resources</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Logo/Banner Images (URLs)</label>
              {formData.images.map((img, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleArrayChange('images', index, e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('images', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('images', '')} size="sm">
                <FiPlus className="mr-2" /> Add Image
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Campus Gallery Images (URLs)</label>
              {formData.campus_images.map((img, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleArrayChange('campus_images', index, e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('campus_images', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('campus_images', '')} size="sm">
                <FiPlus className="mr-2" /> Add Campus Image
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Campus Video URL</label>
              <input
                type="url"
                name="campus_video_url"
                value={formData.campus_video_url}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brochure URL</label>
              <input
                type="url"
                name="brochure_url"
                value={formData.brochure_url}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Virtual Tour URL</label>
              <input
                type="url"
                name="virtual_tour_url"
                value={formData.virtual_tour_url}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/colleges')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <FiSave className="mr-2" />
            {saving ? 'Saving...' : id ? 'Update College' : 'Create College'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CollegeForm;
