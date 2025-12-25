import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiCheck, FiX, FiStar, FiImage, FiChevronLeft, FiChevronRight, FiFileText, FiExternalLink } from 'react-icons/fi';
import api from '../../api/axios';

const PendingReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/rewards/pending-reviews?limit=${limit}&offset=${page * limit}`);
      setReviews(response.data.reviews);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleAction = async (reviewId, action) => {
    setProcessing(reviewId);
    try {
      await api.post(`/admin/rewards/reviews/${reviewId}/action`, { action });
      // Remove from list
      setReviews(reviews.filter(r => r.id !== reviewId));
      setTotal(prev => prev - 1);
    } catch (error) {
      console.error('Error processing review:', error);
      alert('Error processing review');
    } finally {
      setProcessing(null);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading && reviews.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pending Reviews</h1>
            <p className="text-gray-500">{total} reviews waiting for approval</p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">All caught up!</h2>
            <p className="text-gray-500">No pending reviews to approve.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">
                          {review.user_name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{review.user_name}</p>
                        <p className="text-sm text-gray-500">{review.user_email}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-gray-600 font-medium">{review.rating}/5</span>
                      </div>
                    </div>

                    {/* College Name */}
                    <p className="text-sm text-blue-600 font-medium mb-2">
                      📍 {review.college_name}
                    </p>

                    {/* Review Title & Content */}
                    {review.title && (
                      <h3 className="font-semibold text-gray-800 mb-2">{review.title}</h3>
                    )}
                    <p className="text-gray-600 mb-3">{review.review || review.review_text}</p>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      {review.pros && (
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-1">✓ Pros</p>
                          {Array.isArray(review.pros) ? (
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {review.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-600">{review.pros}</p>
                          )}
                        </div>
                      )}
                      {review.cons && (
                        <div>
                          <p className="text-sm font-medium text-red-600 mb-1">✗ Cons</p>
                          {Array.isArray(review.cons) ? (
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {review.cons.map((con, i) => <li key={i}>{con}</li>)}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-600">{review.cons}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <FiImage className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{review.photos.length} photo(s) attached</span>
                      </div>
                    )}

                    {/* Points Info */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        🎯 {review.points_earned || 50} points will be awarded
                      </span>
                      {review.is_verified_student && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          ✓ Verified Student
                        </span>
                      )}
                      <span className="text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => handleAction(review.id, 'approve')}
                      disabled={processing === review.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                    >
                      {processing === review.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <FiCheck className="w-4 h-4" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleAction(review.id, 'reject')}
                      disabled={processing === review.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                    >
                      <FiX className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <FiChevronLeft /> Previous
            </button>
            <span className="text-gray-600">
              Page {page + 1} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * limit >= total}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PendingReviews;
