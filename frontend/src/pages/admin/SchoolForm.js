import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import api from '../../api/axios';

const SchoolForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    board: 'CBSE',
    school_type: 'Private',
    medium: 'English',
    city: '',
    state: '',
    address: '',
    pincode: '',
    established_year: new Date().getFullYear(),
    classes_offered: [],
    streams_offered: [],
    total_students: 0,
    student_teacher_ratio: '',
    facilities: [],
    admission_fee: 0,
    annual_fee: 0,
    rating: 0,
    phone: '',
    email: '',
    website: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchSchool();
    }
  }, [id]);

  const fetchSchool = async () => {
    try {
      const response = await api.get(`/schools/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching school:', error);
      alert('Error loading school data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/schools/${id}`, formData);
      } else {
        await api.post('/schools', formData);
      }
      navigate('/admin/schools');
    } catch (error) {
      console.error('Error saving school:', error);
      alert('Error saving school');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayInput = (field, value) => {
    setFormData({
      ...formData,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/schools" className="text-gray-600 hover:text-gray-900">
              <FiArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit School' : 'Add New School'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Fill in the school details below
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">School Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL) *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="school-name-city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Board *</label>
                  <select
                    value={formData.board}
                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="IB">IB</option>
                    <option value="IGCSE">IGCSE</option>
                    <option value="NIOS">NIOS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">School Type *</label>
                  <select
                    value={formData.school_type}
                    onChange={(e) => setFormData({ ...formData, school_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="International">International</option>
                    <option value="Public">Public</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medium *</label>
                  <select
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Regional Language">Regional Language</option>
                    <option value="Bilingual">Bilingual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Established Year</label>
                  <input
                    type="number"
                    value={formData.established_year}
                    onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            {/* Fees & Stats */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Fees & Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Admission Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.admission_fee}
                    onChange={(e) => setFormData({ ...formData, admission_fee: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.annual_fee}
                    onChange={(e) => setFormData({ ...formData, annual_fee: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (0-5)</label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    step="0.1"
                    min="0"
                    max="5"
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Facilities (comma-separated)</h3>
              <textarea
                value={formData.facilities.join(', ')}
                onChange={(e) => handleArrayInput('facilities', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Library, Computer Lab, Sports Ground, Swimming Pool"
                rows="2"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t">
              <Link to="/admin/schools" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
              >
                <FiSave size={18} />
                {loading ? 'Saving...' : isEdit ? 'Update School' : 'Create School'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolForm;