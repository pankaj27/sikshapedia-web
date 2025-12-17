import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiSend, FiCheck, FiX } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import api from '../../api/axios';
import { generateSlug } from '../../utils/slugify';
import StatusBadge from '../../components/admin/StatusBadge';
import ContentApprovalActions from '../../components/admin/ContentApprovalActions';
import { useAuth } from '../../contexts/AuthContext';

const NewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Admission',
    summary: '',
    content: '',
    featured_image: '',
    author: '',
    tags: [],
    published: true,
    featured: false,
    status: 'draft'
  });

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Check user role
  const isDataEntry = user?.role === 'data_entry';
  const canApprove = user?.role === 'super_admin' || user?.role === 'content_manager';

  useEffect(() => {
    if (isEdit) {
      fetchNews();
    }
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await api.get(`/news/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = { 
        ...formData,
        status: saveAsDraft ? 'draft' : formData.status
      };
      
      if (isEdit) {
        await api.put(`/news/${id}`, dataToSave);
      } else {
        await api.post('/news', dataToSave);
      }
      navigate('/admin/news');
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Error saving news');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    setActionLoading(true);
    try {
      await api.post(`/submit-for-review/news/${id}`);
      await fetchNews();
      alert('News submitted for review!');
    } catch (error) {
      console.error('Error submitting for review:', error);
      alert('Error submitting for review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.post(`/approve/news/${id}`);
      await fetchNews();
      alert('News approved and published!');
    } catch (error) {
      console.error('Error approving:', error);
      alert('Error approving news');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setActionLoading(true);
    try {
      await api.post(`/reject/news/${id}`, { reason });
      await fetchNews();
      alert('News rejected');
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Error rejecting news');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/news" className="text-gray-600 hover:text-gray-900">
                <FiArrowLeft size={24} />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit News' : 'Publish News'}</h1>
                  {isEdit && formData.status && <StatusBadge status={formData.status} />}
                </div>
                <p className="text-sm text-gray-600 mt-1">Fill in the news article details</p>
              </div>
            </div>
            
            {/* Approval Actions */}
            {isEdit && (
              <div className="flex items-center gap-2">
                {formData.status === 'draft' && (
                  <Button 
                    type="button" 
                    onClick={handleSubmitForReview}
                    disabled={actionLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <FiSend className="mr-2" /> Submit for Review
                  </Button>
                )}
                {formData.status === 'pending' && canApprove && (
                  <>
                    <Button 
                      type="button" 
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <FiCheck className="mr-2" /> Approve
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleReject}
                      disabled={actionLoading}
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <FiX className="mr-2" /> Reject
                    </Button>
                  </>
                )}
                {formData.status === 'rejected' && formData.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm text-red-700">
                    <strong>Rejection reason:</strong> {formData.rejection_reason}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({ 
                      ...formData, 
                      title,
                      slug: !formData.slug || formData.slug === generateSlug(formData.title) ? generateSlug(title) : formData.slug
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug (URL) *
                  <span className="text-xs text-gray-500 ml-2">(Auto-generated)</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="Admission">Admission</option>
                  <option value="Exams">Exams</option>
                  <option value="Results">Results</option>
                  <option value="Events">Events</option>
                  <option value="Policy">Policy</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Summary *</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="CBSE, Board Exams, 2025"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Link to="/admin/news" className="flex-1">
                <Button variant="outline" className="w-full">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading} className="flex-1 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2">
                <FiSave size={18} />
                {loading ? 'Saving...' : isEdit ? 'Update News' : 'Publish News'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsForm;