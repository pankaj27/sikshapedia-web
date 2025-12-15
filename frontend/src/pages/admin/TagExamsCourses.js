import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const TagExamsCourses = () => {
  const [tags, setTags] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    exam_id: '',
    course_id: '',
    is_mandatory: false,
    cutoff_score: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tagsRes, examsRes, coursesRes] = await Promise.all([
        api.get('/exam-course-tags?limit=1000'),
        api.get('/exams?limit=1000'),
        api.get('/courses?limit=1000')
      ]);
      setTags(tagsRes.data);
      setExams(examsRes.data);
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
      await api.post('/exam-course-tags', formData);
      fetchData();
      setShowModal(false);
      setFormData({ exam_id: '', course_id: '', is_mandatory: false, cutoff_score: '' });
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Error creating tag');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tagging?')) {
      try {
        await api.delete(`/exam-course-tags/${id}`);
        setTags(tags.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    }
  };

  const getExamName = (examId) => {
    return exams.find(e => e.id === examId)?.name || examId;
  };

  const getCourseName = (courseId) => {
    return courses.find(c => c.id === courseId)?.name || courseId;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tag Exams to Courses</h1>
            <p className="text-sm text-gray-600 mt-1">Associate exams with courses</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mandatory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cutoff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : tags.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No tags found</td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{getExamName(tag.exam_id)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getCourseName(tag.course_id)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tag.is_mandatory ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tag.is_mandatory ? 'Mandatory' : 'Optional'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tag.cutoff_score || 'N/A'}</td>
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Exam-Course Tag</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam *</label>
                <select
                  value={formData.exam_id}
                  onChange={(e) => setFormData({ ...formData, exam_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Exam</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>
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
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_mandatory}
                    onChange={(e) => setFormData({ ...formData, is_mandatory: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Is Mandatory Exam</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cutoff Score</label>
                <input
                  type="number"
                  value={formData.cutoff_score}
                  onChange={(e) => setFormData({ ...formData, cutoff_score: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimum cutoff score"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  onClick={() => { setShowModal(false); setFormData({ exam_id: '', course_id: '', is_mandatory: false, cutoff_score: '' }); }}
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

export default TagExamsCourses;