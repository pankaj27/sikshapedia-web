import React, { useState, useEffect } from 'react';
import { FiTrash2, FiMessageCircle, FiUser, FiCalendar, FiFlag, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const CommentsModeration = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, flagged
  const [expandedComment, setExpandedComment] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await api.get('/admin/comments?limit=200');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Make sure you are logged in as admin.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return comment.is_flagged;
    return true;
  });

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Comments Management</h1>
          <p className="text-sm text-gray-600 mt-1">View and moderate user comments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Total Comments</p>
            <p className="text-2xl font-bold text-purple-600">{comments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Flagged</p>
            <p className="text-2xl font-bold text-red-600">
              {comments.filter(c => c.is_flagged).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">With Replies</p>
            <p className="text-2xl font-bold text-green-600">
              {comments.filter(c => c.replies?.length > 0).length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6 border border-gray-100 inline-flex">
          {['all', 'flagged'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'all' ? 'All Comments' : 'Flagged'}
            </button>
          ))}
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <p className="text-gray-500">Loading comments...</p>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <FiMessageCircle className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No comments found</p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div key={comment.id} className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
                comment.is_flagged ? 'border-red-200' : 'border-gray-100'
              }`}>
                {/* Comment Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {comment.is_flagged && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                            <FiFlag size={12} /> Flagged
                          </span>
                        )}
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {comment.entity_type_label || comment.entity_type || 'Unknown'}
                        </span>
                        <span className="text-sm font-medium text-purple-600">
                          {comment.entity_name || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{comment.text}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiUser size={14} /> {comment.user_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar size={14} /> {formatDate(comment.created_at)}
                        </span>
                        {comment.replies?.length > 0 && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {comment.replies.length} replies
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {comment.replies?.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedComment(
                            expandedComment === comment.id ? null : comment.id
                          )}
                        >
                          {expandedComment === comment.id ? (
                            <FiChevronUp size={18} />
                          ) : (
                            <FiChevronDown size={18} />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <FiTrash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Replies (Expandable) */}
                {expandedComment === comment.id && comment.replies?.length > 0 && (
                  <div className="bg-gray-50 border-t px-6 py-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Replies:</h4>
                    <div className="space-y-3">
                      {comment.replies.map((reply, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-gray-700 mb-2">{reply.text}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FiUser size={12} /> {reply.user_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiCalendar size={12} /> {formatDate(reply.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CommentsModeration;
