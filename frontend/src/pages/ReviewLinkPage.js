import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';

const ReviewLinkPage = () => {
  const { linkCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        // Fetch institute data from QR link
        const res = await api.get(`/review/${linkCode}`);
        const institute = res.data.institute;
        const instituteType = res.data.institute_type;

        // Track link view
        try {
          await api.post(`/review/${linkCode}/track-view`);
        } catch (e) {
          // Ignore tracking errors
        }

        // Redirect to WriteReviewPage with pre-filled institute data
        const params = new URLSearchParams({
          instituteId: institute.id,
          instituteName: institute.name,
          instituteType: instituteType || 'college',
          fromQR: 'true',
          linkCode: linkCode
        });

        // Redirect to write-review page with parameters
        navigate(`/write-review?${params.toString()}`, { replace: true });
        
      } catch (err) {
        setError(err.response?.data?.detail || 'Review link not found or expired');
        setLoading(false);
      }
    };

    fetchAndRedirect();
  }, [linkCode, navigate]);

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

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Loading...</h1>
        <p className="text-gray-600">Preparing your review form</p>
      </div>
    </div>
  );
};

export default ReviewLinkPage;
