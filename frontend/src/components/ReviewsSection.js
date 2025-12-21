import React, { useState, useEffect } from 'react';
import { FiStar, FiThumbsUp, FiThumbsDown, FiUser, FiCalendar, FiEdit3, FiHeart } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from './ui/button';
import LoginPromptModal from './LoginPromptModal';

const StarRating = ({ rating, size = 16, interactive = false, onChange }) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          className={`cursor-${interactive ? 'pointer' : 'default'} transition-colors ${
            (interactive ? hover || rating : rating) >= star
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange && onChange(star)}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review, onLikeUpdate }) => {
  const [likes, setLikes] = useState(review.likes || 0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Check if user already liked this review
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!isLoggedIn) return;
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/reviews/${review.id}/likes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLiked(response.data.liked);
        setLikes(response.data.likes);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    checkLikeStatus();
  }, [review.id, isLoggedIn]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    setLikeLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/reviews/${review.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikes(response.data.likes);
      setLiked(response.data.liked);
      if (onLikeUpdate) onLikeUpdate(review.id, response.data.likes);
    } catch (error) {
      console.error('Error liking review:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <FiUser className="text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{review.user_name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar size={12} />
                <span>{formatDate(review.created_at)}</span>
              </div>
            </div>
          </div>
          <StarRating rating={review.rating} />
        </div>
        
        {review.review_text && (
          <p className="text-gray-700 mb-3">{review.review_text}</p>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {review.pros && (
            <div className="flex items-start gap-2">
              <FiThumbsUp className="text-green-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-700">Pros</p>
                <p className="text-gray-600">{review.pros}</p>
              </div>
            </div>
          )}
          {review.cons && (
            <div className="flex items-start gap-2">
              <FiThumbsDown className="text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-700">Cons</p>
                <p className="text-gray-600">{review.cons}</p>
              </div>
            </div>
          )}
        </div>
        
        {(review.placements_rating || review.infrastructure_rating || review.faculty_rating) && (
          <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-sm">
            {review.placements_rating && (
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Placements:</span>
                <StarRating rating={review.placements_rating} size={12} />
              </div>
            )}
            {review.infrastructure_rating && (
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Infrastructure:</span>
                <StarRating rating={review.infrastructure_rating} size={12} />
              </div>
            )}
            {review.faculty_rating && (
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Faculty:</span>
                <StarRating rating={review.faculty_rating} size={12} />
              </div>
            )}
          </div>
        )}

        {/* Like Button */}
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              liked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiHeart size={16} className={liked ? 'fill-red-500 text-red-500' : ''} />
            <span>{likes > 0 ? `${likes} ${likes === 1 ? 'Like' : 'Likes'}` : 'Like'}</span>
          </button>
          <span className="text-xs text-gray-400">
            {liked ? 'You liked this review' : 'Helpful?'}
          </span>
        </div>
      </div>

      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
      />
    </>
  );
};

const WriteReviewModal = ({ isOpen, onClose, entityId, entityType, entityName, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    review_text: '',
    pros: '',
    cons: '',
    placements_rating: 0,
    infrastructure_rating: 0,
    faculty_rating: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setError('Please select an overall rating');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/reviews', {
        college_id: entityId,
        entity_type: entityType,
        ...formData
      });
      onSuccess && onSuccess();
      onClose();
      setFormData({ rating: 0, review_text: '', pros: '', cons: '', placements_rating: 0, infrastructure_rating: 0, faculty_rating: 0 });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Write a Review</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          
          <p className="text-gray-600 mb-4">Share your experience at {entityName}</p>
          
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Overall Rating *</label>
              <StarRating rating={formData.rating} size={32} interactive onChange={(r) => setFormData({...formData, rating: r})} />
            </div>
            
            <div>
              <label className="block font-medium mb-2">Your Review</label>
              <textarea
                value={formData.review_text}
                onChange={(e) => setFormData({...formData, review_text: e.target.value})}
                className="w-full border rounded-lg p-3 min-h-[100px]"
                placeholder="Share your detailed experience..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2 text-green-700">Pros</label>
                <textarea
                  value={formData.pros}
                  onChange={(e) => setFormData({...formData, pros: e.target.value})}
                  className="w-full border rounded-lg p-3 min-h-[80px]"
                  placeholder="What did you like?"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-red-700">Cons</label>
                <textarea
                  value={formData.cons}
                  onChange={(e) => setFormData({...formData, cons: e.target.value})}
                  className="w-full border rounded-lg p-3 min-h-[80px]"
                  placeholder="What could be improved?"
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="font-medium mb-3">Rate Specific Aspects (Optional)</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Placements</span>
                  <StarRating rating={formData.placements_rating} size={20} interactive onChange={(r) => setFormData({...formData, placements_rating: r})} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Infrastructure</span>
                  <StarRating rating={formData.infrastructure_rating} size={20} interactive onChange={(r) => setFormData({...formData, infrastructure_rating: r})} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Faculty</span>
                  <StarRating rating={formData.faculty_rating} size={20} interactive onChange={(r) => setFormData({...formData, faculty_rating: r})} />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600">
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ReviewsSection = ({ entityId, entityType = 'college', entityName, showWriteReview = true }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  // Initialize with token check to avoid flash of login prompt
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const checkLoginStatus = () => {
    // Check for token in localStorage (same as useGuestGate)
    const hasSession = localStorage.getItem('token') || 
                      localStorage.getItem('user_token') ||
                      localStorage.getItem('user') ||
                      document.cookie.includes('session_token');
    setIsLoggedIn(!!hasSession);
  };

  const handleWriteReviewClick = () => {
    // Re-check login status before showing modal
    checkLoginStatus();
    const hasSession = localStorage.getItem('token') || 
                      localStorage.getItem('user_token') ||
                      localStorage.getItem('user');
    if (hasSession) {
      setShowModal(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const fetchReviews = async () => {
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        api.get(`/reviews/college/${entityId}?limit=50`),
        api.get(`/reviews/stats/${entityId}`)
      ]);
      setReviews(reviewsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) fetchReviews();
    checkLoginStatus();
  }, [entityId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reviews & Ratings</h2>
          <p className="text-gray-600">See what students say about {entityName}</p>
        </div>
        {showWriteReview && (
          <Button onClick={handleWriteReviewClick} className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
            <FiEdit3 size={16} />
            Write Review
          </Button>
        )}
      </div>
      
      {stats && stats.total_reviews > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 mb-6">
          <div className="flex flex-wrap items-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">{stats.average_rating}</div>
              <StarRating rating={Math.round(stats.average_rating)} size={20} />
              <p className="text-gray-600 mt-1">{stats.total_reviews} Reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-8 text-sm text-gray-600">{star} ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${stats.total_reviews > 0 ? (stats.rating_breakdown[star] / stats.total_reviews * 100) : 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm text-gray-600">{stats.rating_breakdown[star]}</span>
                </div>
              ))}
            </div>
            {stats.category_ratings && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-28">Placements</span>
                  <StarRating rating={Math.round(stats.category_ratings.placements)} size={14} />
                  <span className="text-sm font-medium">{stats.category_ratings.placements}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-28">Infrastructure</span>
                  <StarRating rating={Math.round(stats.category_ratings.infrastructure)} size={14} />
                  <span className="text-sm font-medium">{stats.category_ratings.infrastructure}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-28">Faculty</span>
                  <StarRating rating={Math.round(stats.category_ratings.faculty)} size={14} />
                  <span className="text-sm font-medium">{stats.category_ratings.faculty}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FiStar className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-600 mb-4">No reviews yet. Be the first to review!</p>
          {showWriteReview && (
            <Button onClick={handleWriteReviewClick} className="bg-orange-500 hover:bg-orange-600">
              Write the First Review
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.slice(0, visibleCount).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          
          {reviews.length > visibleCount && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => setVisibleCount(prev => prev + 5)}>
                Show More Reviews ({reviews.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}
      
      <WriteReviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        entityId={entityId}
        entityType={entityType}
        entityName={entityName}
        onSuccess={fetchReviews}
      />
      
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        action="write a review"
        message="Share your experience and help other students make informed decisions"
      />
    </div>
  );
};

export default ReviewsSection;
export { StarRating, WriteReviewModal };
