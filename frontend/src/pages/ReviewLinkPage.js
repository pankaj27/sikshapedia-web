import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiMapPin, FiThumbsUp, FiThumbsDown, FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const StarRating = ({ rating, size = 24, interactive = false, onChange }) => {
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

const ReviewLinkPage = () => {
  const { linkCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [institute, setInstitute] = useState(null);
  const [instituteType, setInstituteType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    rating: 0,
    review_text: '',
    pros: '',
    cons: '',
    placements_rating: 0,
    infrastructure_rating: 0,
    faculty_rating: 0
  });

  useEffect(() => {
    fetchReviewPageData();
    checkLoggedInUser();
  }, [linkCode]);

  const fetchReviewPageData = async () => {
    try {
      const res = await api.get(`/review/${linkCode}`);
      setInstitute(res.data.institute);
      setInstituteType(res.data.institute_type);
    } catch (err) {
      setError(err.response?.data?.detail || 'Review link not found or expired');
    } finally {
      setLoading(false);
    }
  };

  const checkLoggedInUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      // Not logged in
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to submit a review');
      window.location.href = `/login?redirect=/review/${linkCode}`;
      return;
    }
    
    if (formData.rating === 0) {
      alert('Please select an overall rating');
      return;
    }
    
    setSubmitting(true);
    
    try {
      await api.post(`/review/${linkCode}/submit`, {
        ...formData,
        user_id: user.id,
        user_name: user.name
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Link Not Found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your review for {institute?.name} has been submitted successfully. 
            It will be visible after approval.
          </p>
          <Button onClick={() => window.location.href = '/'} className="bg-orange-500 hover:bg-orange-600">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Institute Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            {institute?.logo_url ? (
              <img src={institute.logo_url} alt="" className="w-20 h-20 rounded-lg object-cover border" />
            ) : (
              <div className="w-20 h-20 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-3xl">🏫</span>
              </div>
            )}
            <div>
              <p className="text-sm text-orange-600 font-medium capitalize">{instituteType}</p>
              <h1 className="text-2xl font-bold text-gray-800">{institute?.name}</h1>
              {(institute?.city || institute?.state) && (
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <FiMapPin size={14} />
                  {[institute?.city, institute?.state].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Share Your Experience</h2>
          <p className="text-gray-600 mb-6">Your review helps future students make informed decisions</p>

          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                Please <a href={`/login?redirect=/review/${linkCode}`} className="text-orange-600 font-semibold hover:underline">login</a> to submit your review
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">Overall Rating *</label>
              <div className="flex items-center gap-4">
                <StarRating 
                  rating={formData.rating} 
                  size={36} 
                  interactive 
                  onChange={(r) => setFormData({...formData, rating: r})} 
                />
                <span className="text-lg text-gray-600">
                  {formData.rating > 0 ? `${formData.rating}/5` : 'Select rating'}
                </span>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block font-semibold text-gray-800 mb-2">Your Review</label>
              <textarea
                value={formData.review_text}
                onChange={(e) => setFormData({...formData, review_text: e.target.value})}
                className="w-full border rounded-lg p-4 min-h-[120px] focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Share your detailed experience about academics, campus life, facilities, etc..."
              />
            </div>

            {/* Pros & Cons */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <FiThumbsUp /> Pros
                </label>
                <textarea
                  value={formData.pros}
                  onChange={(e) => setFormData({...formData, pros: e.target.value})}
                  className="w-full border border-green-200 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-green-500"
                  placeholder="What did you like?"
                />
              </div>
              <div>
                <label className="block font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <FiThumbsDown /> Cons
                </label>
                <textarea
                  value={formData.cons}
                  onChange={(e) => setFormData({...formData, cons: e.target.value})}
                  className="w-full border border-red-200 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-red-500"
                  placeholder="What could be improved?"
                />
              </div>
            </div>

            {/* Category Ratings */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-4">Rate Specific Aspects (Optional)</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Placements</span>
                  <StarRating 
                    rating={formData.placements_rating} 
                    size={24} 
                    interactive 
                    onChange={(r) => setFormData({...formData, placements_rating: r})} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Infrastructure</span>
                  <StarRating 
                    rating={formData.infrastructure_rating} 
                    size={24} 
                    interactive 
                    onChange={(r) => setFormData({...formData, infrastructure_rating: r})} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Faculty</span>
                  <StarRating 
                    rating={formData.faculty_rating} 
                    size={24} 
                    interactive 
                    onChange={(r) => setFormData({...formData, faculty_rating: r})} 
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button 
              type="submit" 
              disabled={submitting || !user}
              className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Powered by AdmissionBuddy
        </p>
      </div>
    </div>
  );
};

export default ReviewLinkPage;
