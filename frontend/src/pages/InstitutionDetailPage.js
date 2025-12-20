import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CollegeDetailPage from './CollegeDetailPage';
import { generateSlug } from '../utils/slugify';

/**
 * Wrapper component that handles the new URL structure:
 * /college/{number}{slug} e.g., /college/123mr-college-of-pharmacy
 * /university/{number}{slug} e.g., /university/456mumbai-university
 * /school/{number}{slug} e.g., /school/789dps-rampurhat
 * 
 * Extracts the numeric ID and finds the institution
 */
const InstitutionDetailPage = () => {
  const { idSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [institutionId, setInstitutionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determine institution type from URL (plural paths)
  const getInstitutionType = () => {
    const path = location.pathname;
    if (path.startsWith('/colleges/')) return 'College';
    if (path.startsWith('/universities/')) return 'University';
    if (path.startsWith('/schools/')) return 'School';
    return 'College';
  };
  
  const institutionType = getInstitutionType();
  
  // Parse URL to extract numeric ID and slug
  // ONLY accepts new format: {number}-{slug} e.g., "012-aiims-delhi"
  // Old format like "aiims-delhi-001" is NOT supported
  const parseIdSlug = () => {
    if (!idSlug) return { numericId: null, slug: null, isValidFormat: false };
    
    // ONLY accept format: {number}-{slug} with dash separator
    // e.g., "012-aiims-delhi" -> numericId: "012", slug: "aiims-delhi"
    const numericDashMatch = idSlug.match(/^(\d+)-(.+)$/);
    if (numericDashMatch) {
      return {
        numericId: numericDashMatch[1],
        slug: numericDashMatch[2],
        isValidFormat: true
      };
    }
    
    // Invalid format - old URLs like "aiims-delhi-001" are no longer supported
    return {
      numericId: null,
      slug: null,
      isValidFormat: false
    };
  };
  
  useEffect(() => {
    const resolveInstitution = async () => {
      setLoading(true);
      setError(null);
      
      const { numericId, isValidFormat } = parseIdSlug();
      
      // Reject invalid URL format (old URLs like "aiims-delhi-001")
      if (!isValidFormat) {
        setError('Invalid URL format');
        setLoading(false);
        return;
      }
      
      try {
        // Search by serial_number (unique for each institution)
        if (numericId) {
          // Fetch institutions filtered by institution_type
          const response = await api.get(`/colleges?institution_type=${institutionType}&limit=100`);
          if (response.data && response.data.length > 0) {
            // Find institution by serial_number (padded numeric ID)
            const serialNum = parseInt(numericId, 10);
            const institution = response.data.find(inst => inst.serial_number === serialNum);
            
            if (institution) {
              setInstitutionId(institution.id);
              setLoading(false);
              return;
            }
          }
        }
        
        // If not found
        setError('Institution not found');
        setLoading(false);
        
      } catch (err) {
        console.error('Error resolving institution:', err);
        setError('Failed to load institution');
        setLoading(false);
      }
    };
    
    resolveInstitution();
  }, [idSlug, location.pathname, institutionType]);
  
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
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{error}</h1>
          <p className="text-gray-600 mb-4">The institution you're looking for doesn't exist or may have been moved.</p>
          <button
            onClick={() => { window.location.href = '/india-colleges'; }}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Browse All Colleges
          </button>
        </div>
      </div>
    );
  }
  
  // Pass the ID to CollegeDetailPage (which handles the actual data fetching)
  return <CollegeDetailPage overrideId={institutionId} />;
};

export default InstitutionDetailPage;
