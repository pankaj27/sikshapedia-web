import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiStar, FiUser, FiDollarSign, FiClock, FiVideo, FiPhone, FiMessageSquare, FiSearch, FiUpload } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const CounselorsManagement = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    photo_url: '',
    specialization: '',
    experience_years: '',
    rating: 4.5,
    total_sessions: 0,
    price_per_session: '',
    available_modes: ['Video'],
    bio: '',
    qualifications: '',
    languages: 'English, Hindi',
    available_slots: [],
    is_active: true
  });

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await api.get('/admin/counselors');
      setCounselors(response.data || []);
    } catch (error) {
      console.error('Error fetching counselors:', error);
      // Try public endpoint as fallback
      try {
        const fallback = await api.get('/counselors');
        setCounselors(fallback.data || []);
      } catch (e) {
        setCounselors([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'available_modes') {
      const modes = formData.available_modes.includes(value)
        ? formData.available_modes.filter(m => m !== value)
        : [...formData.available_modes, value];
      setFormData(prev => ({ ...prev, available_modes: modes }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        experience_years: parseInt(formData.experience_years) || 0,
        price_per_session: parseInt(formData.price_per_session) || 0,
        rating: parseFloat(formData.rating) || 4.5
      };

      if (editingId) {
        await api.put(`/admin/counselors/${editingId}`, payload);
      } else {
        await api.post('/admin/counselors', payload);
      }
      
      fetchCounselors();
      resetForm();
      alert(editingId ? 'Counselor updated successfully!' : 'Counselor added successfully!');
    } catch (error) {
      alert('Error saving counselor: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = (counselor) => {
    setFormData({
      name: counselor.name || '',
      photo_url: counselor.photo_url || '',
      specialization: counselor.specialization || '',
      experience_years: counselor.experience_years || '',
      rating: counselor.rating || 4.5,
      total_sessions: counselor.total_sessions || 0,
      price_per_session: counselor.price_per_session || '',
      available_modes: counselor.available_modes || ['Video'],
      bio: counselor.bio || '',
      qualifications: counselor.qualifications || '',
      languages: counselor.languages || 'English, Hindi',
      available_slots: counselor.available_slots || [],
      is_active: counselor.is_active !== false
    });
    setEditingId(counselor.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this counselor?')) return;
    try {
      await api.delete(`/admin/counselors/${id}`);
      fetchCounselors();
      alert('Counselor deleted successfully!');
    } catch (error) {
      alert('Error deleting counselor');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      photo_url: '',
      specialization: '',
      experience_years: '',
      rating: 4.5,
      total_sessions: 0,
      price_per_session: '',
      available_modes: ['Video'],
      bio: '',
      qualifications: '',
      languages: 'English, Hindi',
      available_slots: [],
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredCounselors = counselors.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'Video': return <FiVideo className="text-blue-500" />;
      case 'Phone': return <FiPhone className="text-green-500" />;
      case 'Chat': return <FiMessageSquare className="text-purple-500" />;
      default: return <FiVideo />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Counselors Management</h1>
            <p className="text-gray-500 text-sm">Manage counselors for the counseling page</p>
          </div>
          <Button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <FiPlus className="mr-2" /> Add Counselor
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search counselors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingId ? 'Edit Counselor' : 'Add New Counselor'}</h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiX size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                    <input
                      type="url"
                      name="photo_url"
                      value={formData.photo_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Specialization</option>
                      <option value="Career Counseling">Career Counseling</option>
                      <option value="College Admission">College Admission</option>
                      <option value="Study Abroad">Study Abroad</option>
                      <option value="Exam Preparation">Exam Preparation</option>
                      <option value="Course Selection">Course Selection</option>
                      <option value="Scholarship Guidance">Scholarship Guidance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years) *</label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="1"
                      max="5"
                      step="0.1"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Sessions</label>
                    <input
                      type="number"
                      name="total_sessions"
                      value={formData.total_sessions}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Session (₹) *</label>
                    <input
                      type="number"
                      name="price_per_session"
                      value={formData.price_per_session}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Modes *</label>
                  <div className="flex gap-4">
                    {['Video', 'Phone', 'Chat'].map(mode => (
                      <label key={mode} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.available_modes.includes(mode)}
                          onChange={() => {
                            const modes = formData.available_modes.includes(mode)
                              ? formData.available_modes.filter(m => m !== mode)
                              : [...formData.available_modes, mode];
                            setFormData(prev => ({ ...prev, available_modes: modes }));
                          }}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="flex items-center gap-1">
                          {getModeIcon(mode)} {mode}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="M.A. Psychology, MBA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="English, Hindi, Tamil"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Brief description of the counselor..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Active (visible on website)</label>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white flex-1">
                    <FiSave className="mr-2" /> {editingId ? 'Update' : 'Save'} Counselor
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Counselors List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : filteredCounselors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <FiUser size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No counselors found. Add your first counselor!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCounselors.map((counselor) => (
              <div key={counselor.id} className={`bg-white rounded-lg border p-4 ${!counselor.is_active ? 'opacity-60' : ''}`}>
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                    {counselor.photo_url ? (
                      <img src={counselor.photo_url} alt={counselor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                        {counselor.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{counselor.name}</h3>
                    <p className="text-sm text-orange-600">{counselor.specialization}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiStar className="text-yellow-400" /> {counselor.rating}
                      </span>
                      <span>•</span>
                      <span>{counselor.experience_years} yrs exp</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {counselor.available_modes?.map(mode => (
                      <span key={mode} className="p-1.5 bg-gray-100 rounded" title={mode}>
                        {getModeIcon(mode)}
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold text-green-600">₹{counselor.price_per_session}/session</span>
                </div>

                <div className="mt-3 pt-3 border-t flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(counselor)}
                    className="flex-1"
                  >
                    <FiEdit2 size={14} className="mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(counselor.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CounselorsManagement;
