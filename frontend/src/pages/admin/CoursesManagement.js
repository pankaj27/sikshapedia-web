import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';
import { generateSlug } from '../../utils/slugify';

const CoursesManagement = () => {
  const [items, setItems] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchItems();
    fetchExams();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/courses?limit=500');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams?limit=500');
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/courses/${editingItem.id}`, formData);
      } else {
        await api.post('/courses', formData);
      }
      fetchItems();
      setShowModal(false);
      setFormData({});
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      exams_accepted: item.exams_accepted || []
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ exams_accepted: [], cutoffs: [] });
    setShowModal(true);
  };

  const toggleExam = (examName) => {
    const currentExams = formData.exams_accepted || [];
    if (currentExams.includes(examName)) {
      setFormData({
        ...formData,
        exams_accepted: currentExams.filter(e => e !== examName)
      });
    } else {
      setFormData({
        ...formData,
        exams_accepted: [...currentExams, examName]
      });
    }
  };

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses (Quick Entry)</h1>
            <p className="text-gray-600 mt-1">Manage courses</p>
          </div>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
            <FiPlus className="mr-2" /> Add New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Degree Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stream</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eligibility</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exams</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-4 text-center">Loading...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-4 text-center">No items found</td></tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.degree_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stream}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.eligibility}>
                      {item.eligibility || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.exams_accepted && item.exams_accepted.length > 0 
                        ? item.exams_accepted.slice(0, 2).join(', ') + (item.exams_accepted.length > 2 ? '...' : '')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-3">
                        <FiEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: generateSlug(e.target.value)
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Degree Type *</label>
                <select
                  value={formData.degree_type || ''}
                  onChange={(e) => setFormData({ ...formData, degree_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Degree Type</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Integrated">Integrated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration *</label>
                <input
                  type="text"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 4 years"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stream *</label>
                <input
                  type="text"
                  value={formData.stream || ''}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  placeholder="e.g., Engineering, Medical"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exams Accepted</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                  {exams.length === 0 ? (
                    <p className="text-sm text-gray-500">No exams available</p>
                  ) : (
                    exams.map((exam) => (
                      <label key={exam.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={(formData.exams_accepted || []).includes(exam.name)}
                          onChange={() => toggleExam(exam.name)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{exam.name} - {exam.full_name}</span>
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {(formData.exams_accepted || []).length} exam(s)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Eligibility</label>
                <textarea
                  value={formData.eligibility || ''}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Average Fees (Annual)</label>
                <input
                  type="number"
                  value={formData.average_fees || ''}
                  onChange={(e) => setFormData({ ...formData, average_fees: parseFloat(e.target.value) })}
                  placeholder="e.g., 200000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CoursesManagement;
