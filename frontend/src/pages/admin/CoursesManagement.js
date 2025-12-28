import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiBook, FiChevronDown } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';
import { generateSlug } from '../../utils/slugify';

const CoursesManagement = () => {
  const [items, setItems] = useState([]);
  const [exams, setExams] = useState([]);
  const [allStreams, setAllStreams] = useState([]);  // New - streams from API
  const [allSubStreams, setAllSubStreams] = useState([]);  // New - sub-streams from API
  const [filteredSubStreams, setFilteredSubStreams] = useState([]);  // Filtered by selected stream
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState('');
  const [filterDegree, setFilterDegree] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const { streams, degreeTypes } = useMemo(() => {
    const s = [...new Set(items.map(i => i.stream_name || i.stream).filter(Boolean))].sort();
    const d = [...new Set(items.map(i => i.degree_type).filter(Boolean))].sort();
    return { streams: s, degreeTypes: d };
  }, [items]);

  useEffect(() => {
    fetchItems();
    fetchExams();
    fetchStreams();
    fetchSubStreams();
  }, []);

  // Filter sub-streams when stream changes in form
  useEffect(() => {
    if (formData.stream_id) {
      const filtered = allSubStreams.filter(s => s.stream_id === formData.stream_id);
      setFilteredSubStreams(filtered);
    } else {
      setFilteredSubStreams([]);
    }
  }, [formData.stream_id, allSubStreams]);

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

  const fetchStreams = async () => {
    try {
      const response = await api.get('/streams?limit=100');
      setAllStreams(response.data);
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  };

  const fetchSubStreams = async () => {
    try {
      const response = await api.get('/sub-streams?limit=500');
      setAllSubStreams(response.data);
    } catch (error) {
      console.error('Error fetching sub-streams:', error);
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
    setFormData({ ...item, exams_accepted: item.exams_accepted || [] });
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
      setFormData({ ...formData, exams_accepted: currentExams.filter(e => e !== examName) });
    } else {
      setFormData({ ...formData, exams_accepted: [...currentExams, examName] });
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStream = !filterStream || item.stream === filterStream || item.stream_name === filterStream;
    const matchesDegree = !filterDegree || item.degree_type === filterDegree;
    return matchesSearch && matchesStream && matchesDegree;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStream('');
    setFilterDegree('');
  };

  const hasActiveFilters = searchTerm || filterStream || filterDegree;

  const getDegreeStyle = (type) => {
    const styles = {
      'UG': 'bg-blue-500 text-white',
      'PG': 'bg-purple-500 text-white',
      'Diploma': 'bg-amber-500 text-white',
      'Professional': 'bg-emerald-500 text-white',
      'PG Diploma': 'bg-indigo-500 text-white',
      'Doctorate': 'bg-red-500 text-white',
      'Integrated': 'bg-cyan-500 text-white',
      'Super Specialty': 'bg-pink-500 text-white',
    };
    return styles[type] || 'bg-gray-500 text-white';
  };

  return (
    <AdminLayout>
      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Courses</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage all courses • {filteredItems.length} {hasActiveFilters ? `of ${items.length}` : 'total'}
              </p>
            </div>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <FiPlus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <select
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
              >
                <option value="">All Streams</option>
                {streams.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={filterDegree}
                onChange={(e) => setFilterDegree(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[130px]"
              >
                <option value="">All Types</option>
                {degreeTypes.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters} 
                  className="px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <FiX className="h-4 w-4" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stream</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Eligibility</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Exams</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <div className="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full mb-3"></div>
                      <span className="text-sm">Loading courses...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <FiBook className="h-12 w-12 mb-3 text-gray-300" />
                      <span className="text-sm font-medium text-gray-500">No courses found</span>
                      <span className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</span>
                      {hasActiveFilters && (
                        <button onClick={clearFilters} className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      {item.full_name && item.full_name !== item.name && (
                        <div className="text-xs text-gray-400 mt-0.5 max-w-[220px] truncate" title={item.full_name}>
                          {item.full_name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${getDegreeStyle(item.degree_type)}`}>
                        {item.degree_type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{item.stream || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{item.duration || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600 block max-w-[140px] truncate" title={item.eligibility}>
                        {item.eligibility || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {item.exams_accepted && item.exams_accepted.length > 0 ? (
                        <span className="text-sm text-gray-600" title={item.exams_accepted.join(', ')}>
                          {item.exams_accepted.slice(0, 2).join(', ')}
                          {item.exams_accepted.length > 2 && <span className="text-gray-400"> +{item.exams_accepted.length - 2}</span>}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
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

        {/* Footer */}
        {!loading && filteredItems.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Showing {filteredItems.length} course{filteredItems.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., B.Tech, MBA, MBBS"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Degree Type *</label>
                  <select
                    value={formData.degree_type || ''}
                    onChange={(e) => setFormData({ ...formData, degree_type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration *</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 4 Years"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stream *</label>
                  <select
                    value={formData.stream_id || ''}
                    onChange={(e) => {
                      const selectedStream = allStreams.find(s => s.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        stream_id: e.target.value,
                        stream: selectedStream?.name || '',
                        sub_stream_id: '' // Reset sub-stream when stream changes
                      });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Stream</option>
                    {allStreams.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sub-Stream</label>
                  <select
                    value={formData.sub_stream_id || ''}
                    onChange={(e) => setFormData({ ...formData, sub_stream_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.stream_id}
                  >
                    <option value="">{formData.stream_id ? 'Select Sub-Stream' : 'First select a stream'}</option>
                    {filteredSubStreams.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  {formData.stream_id && filteredSubStreams.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">No sub-streams available for this stream</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Average Fees (Annual)</label>
                  <input
                    type="number"
                    value={formData.average_fees || ''}
                    onChange={(e) => setFormData({ ...formData, average_fees: parseFloat(e.target.value) })}
                    placeholder="e.g., 200000"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Eligibility</label>
                  <input
                    type="text"
                    value={formData.eligibility || ''}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    placeholder="e.g., 10+2 with PCM"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Exams Accepted</label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-44 overflow-y-auto bg-gray-50">
                    {exams.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No exams available</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {exams.map((exam) => (
                          <label key={exam.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded transition-colors">
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
                  <p className="text-xs text-gray-500 mt-1.5">
                    {(formData.exams_accepted || []).length} exam(s) selected
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Brief description of the course..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="px-5">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5">
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
