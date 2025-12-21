import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CollegeDetailPage from './CollegeDetailPage';
import { generateSlug } from '../utils/slugify';

/**
 * Wrapper component that handles multiple URL formats:
 * 
 * Supported formats:
 * 1. Direct ID: /colleges/ff787707-1dcb-4b24-86df-4229604fbae4 (UUID)
 * 2. Slug: /colleges/iit-bombay-eng (slug field)
 * 3. Custom ID: /colleges/iit-bombay-002 (custom string ID)
 * 4. Serial number format: /colleges/001-iit-bombay (serial_number-slug)
 * 
 * The component tries multiple resolution strategies to find the institution.
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
  
  // Parse URL to extract possible identifiers
  const parseIdSlug = () => {
    if (!idSlug) return { rawId: null, numericPrefix: null, slugPart: null };
    
    // Check for serial number format: {number}-{slug} e.g., "001-iit-bombay"
    const numericPrefixMatch = idSlug.match(/^(\d+)-(.+)$/);
    if (numericPrefixMatch) {
      return {
        rawId: idSlug,
        numericPrefix: numericPrefixMatch[1],
        slugPart: numericPrefixMatch[2]
      };
    }
    
    // Not serial number format - could be UUID, slug, or custom ID
    return {
      rawId: idSlug,
      numericPrefix: null,
      slugPart: null
    };
  };
  
  useEffect(() => {
    const resolveInstitution = async () => {
      setLoading(true);
      setError(null);
      
      if (!idSlug) {
        setError('No institution identifier provided');
        setLoading(false);
        return;
      }
      
      const { rawId, numericPrefix } = parseIdSlug();
      
      try {
        // Strategy 1: Try direct lookup by ID first (fastest)
        try {
          const directResponse = await api.get(`/colleges/${rawId}`);
          if (directResponse.data && directResponse.data.id) {
            setInstitutionId(directResponse.data.id);
            setLoading(false);
            return;
          }
        } catch (directErr) {
          // Direct lookup failed, try other strategies
          console.log('Direct ID lookup failed, trying other strategies...');
        }
        
        // Strategy 2: Search in institution list by ID, slug, or serial_number
        const response = await api.get(`/colleges?institution_type=${institutionType}&limit=200`);
        if (response.data && response.data.length > 0) {
          let institution = null;
          
          // Try matching by ID directly
          institution = response.data.find(inst => inst.id === rawId);
          
          // Try matching by slug
          if (!institution) {
            institution = response.data.find(inst => inst.slug === rawId);
          }
          
          // If serial number format, try matching by serial_number
          if (!institution && numericPrefix) {
            const serialNum = parseInt(numericPrefix, 10);
            institution = response.data.find(inst => inst.serial_number === serialNum);
          }
          
          if (institution) {
            setInstitutionId(institution.id);
            setLoading(false);
            return;
          }
        }
        
        // If still not found, try fetching all types (maybe institution_type mismatch)
        const allResponse = await api.get(`/colleges?limit=500`);
        if (allResponse.data && allResponse.data.length > 0) {
          let institution = allResponse.data.find(inst => 
            inst.id === rawId || inst.slug === rawId
          );
          
          if (institution) {
            setInstitutionId(institution.id);
            setLoading(false);
            return;
          }
        }
        
        // If not found anywhere
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
