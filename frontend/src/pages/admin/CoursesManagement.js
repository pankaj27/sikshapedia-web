import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiFilter } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';
import { generateSlug } from '../../utils/slugify';

// Badge color mapping for degree types
const degreeColors = {
  'UG': 'bg-blue-100 text-blue-700',
  'PG': 'bg-purple-100 text-purple-700',
  'Diploma': 'bg-amber-100 text-amber-700',
  'Professional': 'bg-emerald-100 text-emerald-700',
  'PG Diploma': 'bg-indigo-100 text-indigo-700',
  'Doctorate': 'bg-red-100 text-red-700',
  'Integrated': 'bg-cyan-100 text-cyan-700',
  'Super Specialty': 'bg-pink-100 text-pink-700',
};

// Stream color mapping
const streamColors = {
  'Engineering': 'bg-slate-100 text-slate-700',
  'Medical': 'bg-rose-100 text-rose-700',
  'Management': 'bg-violet-100 text-violet-700',
  'Science': 'bg-teal-100 text-teal-700',
  'Commerce': 'bg-orange-100 text-orange-700',
  'Arts': 'bg-fuchsia-100 text-fuchsia-700',
  'Law': 'bg-yellow-100 text-yellow-800',
};

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

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Compact Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Courses</h1>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {filteredItems.length} of {items.length}
            </span>
          </div>
          <Button onClick={handleAdd} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs">
            <FiPlus className="mr-1 h-3 w-3" /> Add New
          </Button>
        </div>

        {/* Compact Filters Row */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-lg">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStream}
            onChange={(e) => setFilterStream(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Streams</option>
            {streams.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterDegree}
            onChange={(e) => setFilterDegree(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Degrees</option>
            {degreeTypes.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <FiX className="h-3 w-3" /> Clear
            </button>
          )}
        </div>

        {/* Compact Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-16">Duration</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Stream</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Eligibility</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Exams</th>
                  <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="7" className="px-3 py-8 text-center text-xs text-gray-500">Loading...</td></tr>
                ) : filteredItems.length === 0 ? (
                  <tr><td colSpan="7" className="px-3 py-8 text-center text-xs text-gray-500">No courses found</td></tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-1.5">
                        <div className="text-xs font-medium text-gray-900">{item.name}</div>
                        {item.full_name && item.full_name !== item.name && (
                          <div className="text-[10px] text-gray-400 truncate max-w-[180px]" title={item.full_name}>
                            {item.full_name}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        <span className={`inline-flex text-[10px] px-1.5 py-0.5 rounded font-medium ${degreeColors[item.degree_type] || 'bg-gray-100 text-gray-600'}`}>
                          {item.degree_type}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-[11px] text-gray-600">{item.duration}</td>
                      <td className="px-3 py-1.5">
                        <span className={`inline-flex text-[10px] px-1.5 py-0.5 rounded ${streamColors[item.stream] || 'bg-gray-100 text-gray-600'}`}>
                          {item.stream}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-[11px] text-gray-500 max-w-[120px] truncate" title={item.eligibility}>
                        {item.eligibility || '-'}
                      </td>
                      <td className="px-3 py-1.5">
                        {item.exams_accepted && item.exams_accepted.length > 0 ? (
                          <div className="flex flex-wrap gap-0.5">
                            {item.exams_accepted.slice(0, 2).map((exam, i) => (
                              <span key={i} className="text-[9px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                                {exam}
                              </span>
                            ))}
                            {item.exams_accepted.length > 2 && (
                              <span className="text-[9px] text-gray-400">+{item.exams_accepted.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => handleEdit(item)} 
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <FiEdit size={13} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={13} />
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
