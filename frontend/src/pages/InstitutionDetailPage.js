import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CollegeDetailPage from './CollegeDetailPage';
import { generateSlug } from '../utils/slugify';

/**
 * Wrapper component that handles the URL structure:
 * /colleges/{number}-{slug} e.g., /colleges/001-iit-bombay
 * /university/{number}-{slug} e.g., /university/002-mumbai-university
 * /schools/{number}-{slug} e.g., /schools/003-dps-rampurhat
 * 
 * Extracts the numeric ID (serial_number) and finds the institution
 */
const InstitutionDetailPage = () => {
  const params = useParams();
  // Support both idSlug (legacy) and seg1 (new router)
  const idSlug = params.idSlug || params.seg1;
  const location = useLocation();
  const navigate = useNavigate();
  const [institutionId, setInstitutionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determine institution type from URL (plural paths)
  const getInstitutionType = () => {
    const path = location.pathname;
    if (path.startsWith('/colleges/')) return 'College';
    if (path.startsWith('/university/')) return 'University';
    if (path.startsWith('/schools/')) return 'School';
    return 'College';
  };
  
  const institutionType = getInstitutionType();
  
  // Parse URL to extract numeric ID and slug
  // Format: {number}-{slug} e.g., "001-iit-bombay" OR slug-only e.g., "iit-bombay"
  const parseIdSlug = () => {
    if (!idSlug) return { numericId: null, slug: null, isValidFormat: false, isSlugOnly: false };
    
    // Accept format: {number}-{slug} with dash separator
    // e.g., "001-iit-bombay" -> numericId: "001", slug: "iit-bombay"
    const numericDashMatch = idSlug.match(/^(\d+)-(.+)$/);
    if (numericDashMatch) {
      return {
        numericId: numericDashMatch[1],
        slug: numericDashMatch[2],
        isValidFormat: true,
        isSlugOnly: false
      };
    }
    
    // Accept slug-only format (no numeric prefix)
    // e.g., "iit-bombay", "iim-ahmedabad"
    if (idSlug && !idSlug.match(/^\d+$/)) {
      return {
        numericId: null,
        slug: idSlug,
        isValidFormat: true,
        isSlugOnly: true
      };
    }
    
    // Invalid format (just a number or empty)
    return {
      numericId: null,
      slug: null,
      isValidFormat: false,
      isSlugOnly: false
    };
  };
  
  useEffect(() => {
    const resolveInstitution = async () => {
      setLoading(true);
      setError(null);
      
      const { numericId, slug, isValidFormat, isSlugOnly } = parseIdSlug();
      
      // Reject invalid URL format
      if (!isValidFormat) {
        setError('Invalid URL format');
        setLoading(false);
        return;
      }
      
      try {
        // If slug-only format, try to fetch by slug directly
        if (isSlugOnly && slug) {
          const response = await api.get(`/colleges/${slug}`);
          if (response.data && response.data.id) {
            setInstitutionId(response.data.id);
            setLoading(false);
            return;
          }
        }
        
        // Search by serial_number (numeric prefix format)
        if (numericId) {
          // Fetch all institutions including drafts - serial_number is unique across all
          const response = await api.get(`/colleges?limit=500&include_drafts=true`);
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
          <p className="text-gray-600 mb-4">The institution you are looking for does not exist or may have been moved.</p>
          <button
            onClick={() => { window.location.href = '/colleges'; }}
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
