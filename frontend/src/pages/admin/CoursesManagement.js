import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiBook } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';
import { generateSlug } from '../../utils/slugify';

const CoursesManagement = () => {
  const [items, setItems] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState('');
  const [filterDegree, setFilterDegree] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Get unique streams and degree types for filters
  const { streams, degreeTypes } = useMemo(() => {
    const s = [...new Set(items.map(i => i.stream).filter(Boolean))].sort();
    const d = [...new Set(items.map(i => i.degree_type).filter(Boolean))].sort();
    return { streams: s, degreeTypes: d };
  }, [items]);

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

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStream = !filterStream || item.stream === filterStream;
    const matchesDegree = !filterDegree || item.degree_type === filterDegree;
    return matchesSearch && matchesStream && matchesDegree;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStream('');
    setFilterDegree('');
  };

  const hasActiveFilters = searchTerm || filterStream || filterDegree;

  // Degree type badge styling
  const getDegreeStyle = (type) => {
    const styles = {
      'UG': 'bg-blue-50 text-blue-700 border-blue-200',
      'PG': 'bg-purple-50 text-purple-700 border-purple-200',
      'Diploma': 'bg-orange-50 text-orange-700 border-orange-200',
      'Professional': 'bg-green-50 text-green-700 border-green-200',
      'PG Diploma': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Doctorate': 'bg-red-50 text-red-700 border-red-200',
      'Integrated': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'Super Specialty': 'bg-pink-50 text-pink-700 border-pink-200',
    };
    return styles[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredItems.length} {filteredItems.length === 1 ? 'course' : 'courses'} 
              {hasActiveFilters && ` (filtered from ${items.length})`}
            </p>
          </div>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
            <FiPlus className="mr-2 h-4 w-4" /> Add Course
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by course name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
              >
                <option value="">All Streams</option>
                {streams.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={filterDegree}
                onChange={(e) => setFilterDegree(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[130px]"
              >
                <option value="">All Types</option>
                {degreeTypes.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters} 
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <FiX className="h-4 w-4" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stream</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eligibility</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exams</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                      <span className="text-sm">Loading courses...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <FiBook className="h-8 w-8 mb-2" />
                      <span className="text-sm">No courses found</span>
                      {hasActiveFilters && (
                        <button onClick={clearFilters} className="mt-2 text-blue-600 hover:text-blue-700 text-sm">
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      {item.full_name && item.full_name !== item.name && (
                        <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate" title={item.full_name}>
                          {item.full_name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex text-xs px-2 py-1 rounded-md border font-medium ${getDegreeStyle(item.degree_type)}`}>
                        {item.degree_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.stream || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.duration || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 max-w-[150px] truncate block" title={item.eligibility}>
                        {item.eligibility || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.exams_accepted && item.exams_accepted.length > 0 ? (
                        <span className="text-sm text-gray-600" title={item.exams_accepted.join(', ')}>
                          {item.exams_accepted.slice(0, 2).join(', ')}
                          {item.exams_accepted.length > 2 && ` +${item.exams_accepted.length - 2}`}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree Type *</label>
                  <select
                    value={formData.degree_type || ''}
                    onChange={(e) => setFormData({ ...formData, degree_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="Diploma">Diploma</option>
                    <option value="PG Diploma">PG Diploma</option>
                    <option value="Professional">Professional</option>
                    <option value="Integrated">Integrated</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Super Specialty">Super Specialty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 4 Years"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stream *</label>
                  <input
                    type="text"
                    value={formData.stream || ''}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    placeholder="e.g., Engineering, Medical"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average Fees (Annual)</label>
                  <input
                    type="number"
                    value={formData.average_fees || ''}
                    onChange={(e) => setFormData({ ...formData, average_fees: parseFloat(e.target.value) })}
                    placeholder="e.g., 200000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                  <input
                    type="text"
                    value={formData.eligibility || ''}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    placeholder="e.g., 10+2 with PCM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exams Accepted</label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                    {exams.length === 0 ? (
                      <p className="text-sm text-gray-500">No exams available</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {exams.map((exam) => (
                          <label key={exam.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData.exams_accepted || []).includes(exam.name)}
                              onChange={() => toggleExam(exam.name)}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{exam.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {(formData.exams_accepted || []).length} exam(s) selected
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Brief description of the course..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingItem ? 'Update Course' : 'Create Course'}
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
