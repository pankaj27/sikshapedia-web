import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiStar, FiTrash2, FiUser, FiCalendar, FiBook, FiMessageSquare, FiThumbsUp, FiThumbsDown, FiFilter, FiEye, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const ReviewsModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [expandedReview, setExpandedReview] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews?limit=100');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.patch(`/reviews/${id}/approve`);
      setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Failed to approve review');
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (id) => {
    setSelectedReviewId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!selectedReviewId) return;
    setActionLoading(selectedReviewId);
    try {
      await api.patch(`/reviews/${selectedReviewId}/reject`, { reason: rejectReason });
      setReviews(reviews.map(r => r.id === selectedReviewId ? { ...r, status: 'rejected', rejection_reason: rejectReason } : r));
      setRejectModalOpen(false);
      setSelectedReviewId(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting review:', error);
      alert('Failed to reject review');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    setActionLoading(id);
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !review.status || review.status === 'pending';
    return review.status === filter;
  });

  // Calculate stats
  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending' || !r.status).length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length
  };

  const toggleExpand = (id) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={14}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">{rating}/5</span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reviews Moderation</h1>
          <p className="text-sm text-gray-600 mt-1">Approve or reject user-submitted reviews. Points are awarded only after approval.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div 
            onClick={() => setFilter('all')}
            className={`bg-white rounded-xl shadow-sm p-4 border-2 cursor-pointer transition-all hover:shadow-md ${filter === 'all' ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiMessageSquare className="text-blue-600" size={22} />
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => setFilter('pending')}
            className={`bg-white rounded-xl shadow-sm p-4 border-2 cursor-pointer transition-all hover:shadow-md ${filter === 'pending' ? 'border-yellow-500 bg-yellow-50' : 'border-transparent'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiEye className="text-yellow-600" size={22} />
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => setFilter('approved')}
            className={`bg-white rounded-xl shadow-sm p-4 border-2 cursor-pointer transition-all hover:shadow-md ${filter === 'approved' ? 'border-green-500 bg-green-50' : 'border-transparent'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheck className="text-green-600" size={22} />
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => setFilter('rejected')}
            className={`bg-white rounded-xl shadow-sm p-4 border-2 cursor-pointer transition-all hover:shadow-md ${filter === 'rejected' ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FiX className="text-red-600" size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Info Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredReviews.length}</span> {filter === 'all' ? 'total' : filter} reviews
            </span>
          </div>
          {filter === 'pending' && stats.pending > 0 && (
            <span className="text-sm text-yellow-600 font-medium bg-yellow-50 px-3 py-1 rounded-full">
              {stats.pending} review{stats.pending > 1 ? 's' : ''} awaiting moderation
            </span>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageSquare className="text-gray-400" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No {filter === 'all' ? '' : filter} reviews</h3>
              <p className="text-gray-500 text-sm">
                {filter === 'pending' ? 'All reviews have been moderated!' : `There are no ${filter} reviews yet.`}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div 
                key={review.id} 
                className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 transition-all ${
                  review.status === 'approved' ? 'border-green-500' : 
                  review.status === 'rejected' ? 'border-red-500' : 
                  'border-yellow-500'
                }`}
              >
                {/* Review Header - Always Visible */}
                <div 
                  className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(review.id)}
                >
                  <div className="flex items-start justify-between">
                    {/* Left: Review Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 truncate">
                          {review.review_title || review.review_text?.slice(0, 40) + '...' || 'Review'}
                        </h3>
                        {renderStars(review.rating)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <FiUser size={14} className="text-gray-400" />
                          {review.user_name || 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiBook size={14} className="text-gray-400" />
                          <span className="text-blue-600 font-medium">{review.college_name || 'N/A'}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiCalendar size={14} className="text-gray-400" />
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Status & Expand */}
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        review.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : review.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {review.status === 'approved' ? '✓ Approved' : review.status === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                      </span>
                      {expandedReview === review.id ? (
                        <FiChevronUp className="text-gray-400" size={20} />
                      ) : (
                        <FiChevronDown className="text-gray-400" size={20} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedReview === review.id && (
                  <div className="px-5 pb-5 border-t bg-gray-50">
                    <div className="pt-4 space-y-4">
                      {/* Course & Points Info */}
                      {(review.course || review.points_earned) && (
                        <div className="flex items-center gap-4 text-sm">
                          {review.course && (
                            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                              Course: {review.course}
                            </span>
                          )}
                          {review.points_earned && (
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                              Points: {review.points_earned}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Pros & Cons */}
                      {(review.pros || review.cons) && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {review.pros && (
                            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                              <div className="flex items-center gap-2 mb-2">
                                <FiThumbsUp className="text-green-600" size={16} />
                                <span className="font-semibold text-green-700 text-sm">Pros</span>
                              </div>
                              <p className="text-gray-700 text-sm">{review.pros}</p>
                            </div>
                          )}
                          {review.cons && (
                            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                              <div className="flex items-center gap-2 mb-2">
                                <FiThumbsDown className="text-red-600" size={16} />
                                <span className="font-semibold text-red-700 text-sm">Cons</span>
                              </div>
                              <p className="text-gray-700 text-sm">{review.cons}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Full Review Text */}
                      {review.review_text && (
                        <div className="bg-white rounded-lg p-4 border">
                          <p className="text-sm font-medium text-gray-500 mb-2">Full Review</p>
                          <p className="text-gray-700">{review.review_text}</p>
                        </div>
                      )}

                      {/* Rejection Reason (if rejected) */}
                      {review.status === 'rejected' && review.rejection_reason && (
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <p className="text-sm font-semibold text-red-700 mb-1">Rejection Reason:</p>
                          <p className="text-red-600 text-sm">{review.rejection_reason}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-4 border-t">
                        {(!review.status || review.status === 'pending') && (
                          <>
                            <Button
                              onClick={(e) => { e.stopPropagation(); handleApprove(review.id); }}
                              disabled={actionLoading === review.id}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5"
                            >
                              {actionLoading === review.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FiCheck size={18} />
                              )}
                              Approve & Award Points
                            </Button>
                            <Button
                              onClick={(e) => { e.stopPropagation(); openRejectModal(review.id); }}
                              disabled={actionLoading === review.id}
                              variant="outline"
                              className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 px-5"
                            >
                              <FiX size={18} />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {review.status === 'rejected' && (
                          <Button
                            onClick={(e) => { e.stopPropagation(); handleApprove(review.id); }}
                            disabled={actionLoading === review.id}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5"
                          >
                            {actionLoading === review.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiCheck size={18} />
                            )}
                            Approve Instead
                          </Button>
                        )}

                        <Button
                          onClick={(e) => { e.stopPropagation(); handleDelete(review.id); }}
                          disabled={actionLoading === review.id}
                          variant="outline"
                          className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 ml-auto"
                        >
                          <FiTrash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Reject Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Review</h3>
              <p className="text-sm text-gray-600 mb-4">
                Optionally provide a reason for rejection. This will be visible to the user.
              </p>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason (optional)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={3}
              />
              
              <div className="flex items-center gap-3 mt-4">
                <Button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
                <Button
                  onClick={() => { setRejectModalOpen(false); setSelectedReviewId(null); }}
                  variant="outline"
                  className="flex-1 border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReviewsModeration;
