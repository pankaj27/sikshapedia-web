import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import { generateSlug } from '../../utils/slugify';

const AddCollege = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    location: { city: '', state: '', country: 'India' },
    established_year: new Date().getFullYear(),
    type: 'Government',
    affiliation: '',
    nirf_ranking: '',
    average_fees: '',
    description: '',
    contact_info: { phone: '', email: '', website: '', address: '' },
    facilities: [],
    highlights: [],
    accreditations: [],
    images: [],
    courses: []
  });

  const [facilityInput, setFacilityInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [accreditationInput, setAccreditationInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const [courseForm, setCourseForm] = useState({
    name: '',
    degree_type: '',
    duration: '',
    fees: '',
    total_fees: '',
    seats: '',
    eligibility: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [name]: value }
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact_info: { ...prev.contact_info, [name]: value }
    }));
  };

  const addToList = (listName, value, clearInput) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [listName]: [...prev[listName], value.trim()]
      }));
      clearInput('');
    }
  };

  const removeFromList = (listName, index) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  const addCourse = () => {
    if (courseForm.name && courseForm.fees) {
      const course = {
        ...courseForm,
        fees: parseFloat(courseForm.fees),
        total_fees: parseFloat(courseForm.total_fees) || parseFloat(courseForm.fees),
        seats: courseForm.seats ? parseInt(courseForm.seats) : null
      };
      setFormData(prev => ({
        ...prev,
        courses: [...prev.courses, course]
      }));
      setCourseForm({
        name: '',
        degree_type: '',
        duration: '',
        fees: '',
        total_fees: '',
        seats: '',
        eligibility: ''
      });
    }
  };

  const removeCourse = (index) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        average_fees: parseFloat(formData.average_fees),
        established_year: parseInt(formData.established_year),
        nirf_ranking: formData.nirf_ranking ? parseInt(formData.nirf_ranking) : null
      };

      await api.post('/colleges', submitData);
      alert('College added successfully!');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add college');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                <FiArrowLeft className="text-2xl" />
              </Link>
              <h1 className="text-xl font-bold">Add New College</h1>
            </div>
            <Button onClick={handleSubmit} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? 'Saving...' : 'Save College'}
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>College Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  placeholder="e.g., IIT Bombay"
                />
              </div>
              <div className="col-span-2">
                <Label>Slug (URL-friendly name)</Label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Auto-generated from name"
                />
              </div>
              <div>
                <Label>Established Year *</Label>
                <Input
                  type="number"
                  name="established_year"
                  value={formData.established_year}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Type *</Label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Deemed">Deemed University</option>
                </select>
              </div>
              <div>
                <Label>Affiliation</Label>
                <Input
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleInputChange}
                  placeholder="e.g., Autonomous, UGC"
                />
              </div>
              <div>
                <Label>NIRF Ranking</Label>
                <Input
                  type="number"
                  name="nirf_ranking"
                  value={formData.nirf_ranking}
                  onChange={handleInputChange}
                  placeholder="e.g., 1, 2, 3..."
                />
              </div>
              <div>
                <Label>Average Fees (per year) *</Label>
                <Input
                  type="number"
                  name="average_fees"
                  value={formData.average_fees}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 200000"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>City *</Label>
                <Input
                  name="city"
                  value={formData.location.city}
                  onChange={handleLocationChange}
                  required
                  placeholder="e.g., Mumbai"
                />
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  name="state"
                  value={formData.location.state}
                  onChange={handleLocationChange}
                  required
                  placeholder="e.g., Maharashtra"
                />
              </div>
              <div>
                <Label>Country *</Label>
                <Input
                  name="country"
                  value={formData.location.country}
                  onChange={handleLocationChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              required
              placeholder="Write a detailed description about the college..."
            />
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.contact_info.phone}
                  onChange={handleContactChange}
                  placeholder="+91-xxx-xxx-xxxx"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.contact_info.email}
                  onChange={handleContactChange}
                  placeholder="info@college.edu"
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  name="website"
                  value={formData.contact_info.website}
                  onChange={handleContactChange}
                  placeholder="https://college.edu"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  name="address"
                  value={formData.contact_info.address}
                  onChange={handleContactChange}
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Facilities</h2>
            <div className="flex gap-2 mb-3">
              <Input
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                placeholder="Add facility (e.g., Library, Hostel)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('facilities', facilityInput, setFacilityInput))}
              />
              <Button type="button" onClick={() => addToList('facilities', facilityInput, setFacilityInput)}>
                <FiPlus />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.facilities.map((facility, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2">
                  {facility}
                  <button type="button" onClick={() => removeFromList('facilities', index)} className="text-blue-900 hover:text-red-600">
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Highlights</h2>
            <div className="flex gap-2 mb-3">
              <Input
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="Add highlight"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('highlights', highlightInput, setHighlightInput))}
              />
              <Button type="button" onClick={() => addToList('highlights', highlightInput, setHighlightInput)}>
                <FiPlus />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="flex-1">{highlight}</span>
                  <button type="button" onClick={() => removeFromList('highlights', index)} className="text-red-600">
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Accreditations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Accreditations</h2>
            <div className="flex gap-2 mb-3">
              <Input
                value={accreditationInput}
                onChange={(e) => setAccreditationInput(e.target.value)}
                placeholder="Add accreditation (e.g., NAAC A++)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('accreditations', accreditationInput, setAccreditationInput))}
              />
              <Button type="button" onClick={() => addToList('accreditations', accreditationInput, setAccreditationInput)}>
                <FiPlus />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.accreditations.map((acc, index) => (
                <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2">
                  {acc}
                  <button type="button" onClick={() => removeFromList('accreditations', index)} className="text-green-900 hover:text-red-600">
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Images (URLs)</h2>
            <div className="flex gap-2 mb-3">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Add image URL"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('images', imageInput, setImageInput))}
              />
              <Button type="button" onClick={() => addToList('images', imageInput, setImageInput)}>
                <FiPlus />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {formData.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt="College" className="w-full h-24 object-cover rounded" onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Image'} />
                  <button
                    type="button"
                    onClick={() => removeFromList('images', index)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Courses</h2>
            <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Course Name</Label>
                  <Input
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                    placeholder="e.g., BTech Computer Science"
                  />
                </div>
                <div>
                  <Label>Degree Type</Label>
                  <Input
                    value={courseForm.degree_type}
                    onChange={(e) => setCourseForm({...courseForm, degree_type: e.target.value})}
                    placeholder="e.g., BTech, MTech, MBA"
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                    placeholder="e.g., 4 years"
                  />
                </div>
                <div>
                  <Label>Annual Fees</Label>
                  <Input
                    type="number"
                    value={courseForm.fees}
                    onChange={(e) => setCourseForm({...courseForm, fees: e.target.value})}
                    placeholder="e.g., 200000"
                  />
                </div>
                <div>
                  <Label>Total Fees</Label>
                  <Input
                    type="number"
                    value={courseForm.total_fees}
                    onChange={(e) => setCourseForm({...courseForm, total_fees: e.target.value})}
                    placeholder="Total program fees"
                  />
                </div>
                <div>
                  <Label>Seats</Label>
                  <Input
                    type="number"
                    value={courseForm.seats}
                    onChange={(e) => setCourseForm({...courseForm, seats: e.target.value})}
                    placeholder="e.g., 120"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Eligibility</Label>
                  <Input
                    value={courseForm.eligibility}
                    onChange={(e) => setCourseForm({...courseForm, eligibility: e.target.value})}
                    placeholder="e.g., JEE Advanced qualified"
                  />
                </div>
              </div>
              <Button type="button" onClick={addCourse} variant="outline" className="w-full">
                <FiPlus className="mr-2" /> Add Course
              </Button>
            </div>

            {/* Course List */}
            <div className="space-y-2">
              {formData.courses.map((course, index) => (
                <div key={index} className="border rounded p-3 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{course.name}</div>
                    <div className="text-sm text-gray-600">
                      {course.degree_type} • {course.duration} • ₹{course.fees.toLocaleString()}/year
                    </div>
                  </div>
                  <button type="button" onClick={() => removeCourse(index)} className="text-red-600">
                    <FiX className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link to="/admin">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? 'Saving...' : 'Save College'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollege;
