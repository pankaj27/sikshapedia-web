import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiStar, FiTrash2 } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const ReviewsModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

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
    try {
      await api.patch(`/reviews/${id}/approve`);
      setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/reviews/${id}/reject`);
      setReviews(reviews.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review permanently?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reviews Moderation</h1>
          <p className="text-sm text-gray-600 mt-1">Approve or reject user reviews</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6 border border-gray-100 inline-flex">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <p className="text-gray-500">No reviews found</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{review.review_title || review.review_text?.slice(0, 50) || 'Review'}</h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={16}
                            className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">By:</span> {review.user_name || review.student_name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-blue-600 font-medium mb-3">
                      <span className="text-gray-600 font-normal">Institute:</span> {review.college_name || 'N/A'}
                    </p>
                    {review.review_text && (
                      <p className="text-gray-700 mb-2">{review.review_text}</p>
                    )}
                    {review.detailed_review && (
                      <p className="text-gray-700">{review.detailed_review}</p>
                    )}
                    {(review.pros || review.cons) && (
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        {review.pros && (
                          <div>
                            <span className="text-green-600 font-medium">Pros: </span>
                            <span className="text-gray-600">{review.pros}</span>
                          </div>
                        )}
                        {review.cons && (
                          <div>
                            <span className="text-red-600 font-medium">Cons: </span>
                            <span className="text-gray-600">{review.cons}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      review.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : review.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  {(!review.status || review.status === 'pending') && (
                    <>
                      <Button
                        onClick={() => handleApprove(review.id)}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <FiCheck size={18} />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(review.id)}
                        variant="outline"
                        className="flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <FiX size={18} />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => handleDelete(review.id)}
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-50 ml-auto"
                  >
                    <FiTrash2 size={18} />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReviewsModeration;