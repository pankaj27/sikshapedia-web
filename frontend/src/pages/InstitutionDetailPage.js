import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CollegeDetailPage from './CollegeDetailPage';

/**
 * Wrapper component that handles the URL structure:
 * /colleges/{number}-{slug} e.g., /colleges/001-iit-bombay
 * /university/{number}-{slug} e.g., /university/002-mumbai-university
 * /schools/{number}-{slug} e.g., /schools/003-dps-rampurhat
 */
const InstitutionDetailPage = () => {
  const params = useParams();
  const idSlug = params.idSlug || params.seg1;
  const location = useLocation();
  const [institutionId, setInstitutionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use ref to track if we've already resolved
  const hasResolved = useRef(false);
  
  // Determine institution type from URL
  const institutionType = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/colleges/')) return 'College';
    if (path.startsWith('/university/')) return 'University';
    if (path.startsWith('/schools/')) return 'School';
    return 'College';
  }, [location.pathname]);
  
  useEffect(() => {
    // Only run once
    if (hasResolved.current) return;
    hasResolved.current = true;
    
    const resolveInstitution = async () => {
      if (!idSlug) {
        setError('No ID provided');
        setLoading(false);
        return;
      }
      
      // Parse numeric prefix: "017-slug" -> numericId="017", slug="slug"
      const match = idSlug.match(/^(\d+)-(.+)$/);
      const numericId = match ? match[1] : null;
      const slug = match ? match[2] : idSlug;
      
      const apiEndpoint = institutionType === 'School' ? '/schools' : '/colleges';
      
      try {
        // First try numeric ID (serial_number)
        if (numericId) {
          try {
            const numResponse = await api.get(`${apiEndpoint}/${parseInt(numericId, 10)}`);
            if (numResponse.data?.id) {
              setInstitutionId(numResponse.data.id);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Fall through to slug lookup
          }
        }
        
        // Try slug
        try {
          const slugResponse = await api.get(`${apiEndpoint}/${slug}`);
          if (slugResponse.data?.id) {
            setInstitutionId(slugResponse.data.id);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Fall through to error
        }
        
        // Try full idSlug as-is
        try {
          const fullResponse = await api.get(`${apiEndpoint}/${idSlug}`);
          if (fullResponse.data?.id) {
            setInstitutionId(fullResponse.data.id);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Not found
        }
        
        setError('Institution not found');
        setLoading(false);
        
      } catch (err) {
        setError('Failed to load institution');
        setLoading(false);
      }
    };
    
    resolveInstitution();
  }, []); // Empty deps - run once on mount
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Not Found</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return <CollegeDetailPage id={institutionId} institutionType={institutionType} />;
};

export default InstitutionDetailPage;
