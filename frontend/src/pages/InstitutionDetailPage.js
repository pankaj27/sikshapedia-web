import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CollegeDetailPage from './CollegeDetailPage';

/**
 * Wrapper component that handles the new URL structure:
 * /college/{id}-{slug} or /college/{slug-with-id}
 * /university/{id}-{slug} or /university/{slug-with-id}
 * /school/{id}-{slug} or /school/{slug-with-id}
 * 
 * Extracts the ID and passes it to CollegeDetailPage
 */
const InstitutionDetailPage = () => {
  const { idSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [institutionId, setInstitutionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determine institution type from URL
  const getInstitutionType = () => {
    const path = location.pathname;
    if (path.startsWith('/college/')) return 'College';
    if (path.startsWith('/university/')) return 'University';
    if (path.startsWith('/school/')) return 'School';
    return 'College';
  };
  
  // Extract ID from the id-slug pattern
  const extractId = () => {
    if (!idSlug) return null;
    
    // Pattern 1: {numeric-id}-{slug} (e.g., "123-iit-delhi")
    const numericMatch = idSlug.match(/^(\d+)-(.+)$/);
    if (numericMatch) {
      return numericMatch[1];
    }
    
    // Pattern 2: Full ID with dashes (e.g., "iit-delhi-001", "aiims-delhi-001")
    // This is the most common pattern in the current data
    return idSlug;
  };
  
  useEffect(() => {
    const resolveInstitution = async () => {
      setLoading(true);
      setError(null);
      
      const extractedId = extractId();
      
      if (!extractedId) {
        setError('Invalid institution URL');
        setLoading(false);
        return;
      }
      
      try {
        // Try to fetch the institution directly by ID
        const response = await api.get(`/colleges/${extractedId}`);
        if (response.data) {
          setInstitutionId(extractedId);
          setLoading(false);
          return;
        }
      } catch (err) {
        // If direct ID fetch fails, try to find by slug
        try {
          // Search for institution by slug pattern
          const searchResponse = await api.get(`/colleges?search=${extractedId.replace(/-/g, ' ')}&limit=1`);
          if (searchResponse.data && searchResponse.data.length > 0) {
            setInstitutionId(searchResponse.data[0].id);
            setLoading(false);
            return;
          }
        } catch (searchErr) {
          console.error('Search failed:', searchErr);
        }
      }
      
      // If all attempts fail
      setError('Institution not found');
      setLoading(false);
    };
    
    resolveInstitution();
  }, [idSlug]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{error}</h1>
          <p className="text-gray-600 mb-4">The institution you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/india-colleges')}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Browse Colleges
          </button>
        </div>
      </div>
    );
  }
  
  // Pass the ID to CollegeDetailPage (which handles the actual data fetching)
  // We're reusing CollegeDetailPage since it already handles all institution types
  return <CollegeDetailPage overrideId={institutionId} />;
};

export default InstitutionDetailPage;
