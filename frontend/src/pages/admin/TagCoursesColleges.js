import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const TagCoursesColleges = () => {
  const [tags, setTags] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    college_id: '',
    fees: '',
    duration: '',
    seats: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tagsRes, collegesRes, coursesRes] = await Promise.all([
        api.get('/course-college-tags?limit=1000'),
        api.get('/colleges?limit=1000'),
        api.get('/courses?limit=1000')
      ]);
      setTags(tagsRes.data);
      setColleges(collegesRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/course-college-tags', formData);
      fetchData();
      setShowModal(false);
      setFormData({ course_id: '', college_id: '', fees: '', duration: '', seats: '' });
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Error creating tag');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tagging?')) {
      try {
        await api.delete(`/course-college-tags/${id}`);
        setTags(tags.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    }
  };

  const getCourseName = (courseId) => {
    return courses.find(c => c.id === courseId)?.name || courseId;
  };

  const getCollegeName = (collegeId) => {
    return colleges.find(c => c.id === collegeId)?.name || collegeId;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tag Courses to Colleges</h1>
            <p className="text-sm text-gray-600 mt-1">Associate courses with colleges</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
          >
            <FiPlus size={18} />
            Add New Tag
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : tags.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No tags found</td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{getCourseName(tag.course_id)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getCollegeName(tag.college_id)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tag.fees ? `₹${tag.fees.toLocaleString()}` : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tag.duration || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tag.seats || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => handleDelete(tag.id)}
                        className="text-red-600 hover:text-red-900"
                      >
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Course-College Tag</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course *</label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">College *</label>
                <select
                  value={formData.college_id}
                  onChange={(e) => setFormData({ ...formData, college_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select College</option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>{college.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fees</label>
                <input
                  type="number"
                  value={formData.fees}
                  onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Annual fees"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 4 years"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Seats</label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Total seats"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  onClick={() => { setShowModal(false); setFormData({ course_id: '', college_id: '', fees: '', duration: '', seats: '' }); }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                  Create Tag
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TagCoursesColleges;