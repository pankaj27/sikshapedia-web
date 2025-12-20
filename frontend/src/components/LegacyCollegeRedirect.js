import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { getInstitutionDetailUrl } from '../utils/urlHelpers';

/**
 * Redirects old /colleges/:id URLs to new SEO-friendly URLs
 * Old: /colleges/nlsiu-bangalore-001
 * New: /university/001national-law-school-of-india-university
 */
const LegacyCollegeRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirectToNewUrl = async () => {
      try {
        // Fetch the institution to get its type and name
        const response = await api.get(`/colleges/${id}`);
        if (response.data) {
          const institution = response.data;
          const newUrl = getInstitutionDetailUrl(
            institution.institution_type || 'college',
            institution.id,
            institution.name,
            institution.location?.city,
            institution.serial_number
          );
          // Redirect to new URL (replace history to avoid back button issues)
          navigate(newUrl, { replace: true });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to redirect:', err);
        setError(true);
      }
    };

    redirectToNewUrl();
  }, [id, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Institution Not Found</h1>
          <p className="text-gray-600 mb-4">The institution you're looking for doesn't exist.</p>
          <button
            onClick={() => window.location.href = '/india-colleges')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Browse All Colleges
          </button>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to new URL...</p>
      </div>
    </div>
  );
};

export default LegacyCollegeRedirect;
