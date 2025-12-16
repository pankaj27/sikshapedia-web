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
  
  // Determine institution type from URL (handles both singular and plural)
  const getInstitutionType = () => {
    const path = location.pathname;
    if (path.startsWith('/colleges/') || path.startsWith('/college/')) return 'College';
    if (path.startsWith('/universities/') || path.startsWith('/university/')) return 'University';
    if (path.startsWith('/schools/') || path.startsWith('/school/')) return 'School';
    return 'College';
  };
  
  const institutionType = getInstitutionType();
  
  // Parse URL to extract numeric ID and slug
  // Format: {number}-{slug} e.g., "001-mr-college-of-pharmacy" or "001-indian-institute-of-technology-delhi"
  const parseIdSlug = () => {
    if (!idSlug) return { numericId: null, slug: null };
    
    // Pattern 1: {number}-{slug} with dash separator
    // e.g., "001-mr-college-of-pharmacy" -> numericId: "001", slug: "mr-college-of-pharmacy"
    const numericDashMatch = idSlug.match(/^(\d+)-(.+)$/);
    if (numericDashMatch) {
      return {
        numericId: numericDashMatch[1],
        slug: numericDashMatch[2]
      };
    }
    
    // Pattern 2: Legacy format - full ID like "iit-delhi-001"
    // Try to find institution by this ID directly
    return {
      numericId: null,
      slug: idSlug,
      legacyId: idSlug
    };
  };
  
  useEffect(() => {
    const resolveInstitution = async () => {
      setLoading(true);
      setError(null);
      
      const { numericId, slug, legacyId } = parseIdSlug();
      
      try {
        // Strategy 1: If we have a legacy ID (like "iit-delhi-001"), try it directly
        if (legacyId) {
          try {
            const response = await api.get(`/colleges/${legacyId}`);
            if (response.data) {
              setInstitutionId(legacyId);
              setLoading(false);
              return;
            }
          } catch (err) {
            // Continue to other strategies
          }
        }
        
        // Strategy 2: Search by serial_number (unique for each institution)
        if (numericId) {
          try {
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
              
              // If exact match not found, try matching by numeric ID only within same type
              const numericOnlyMatch = response.data.find(inst => {
                const idNumericMatch = inst.id?.match(/(\d+)$/);
                return idNumericMatch && idNumericMatch[1] === numericId;
              });
              
              if (numericOnlyMatch) {
                setInstitutionId(numericOnlyMatch.id);
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            console.error('Search by numeric ID failed:', err);
          }
        }
        
        // Strategy 3: Search by slug/name only
        if (slug) {
          try {
            const searchTerm = slug.replace(/-/g, ' ').trim();
            if (searchTerm) {
              const response = await api.get(`/colleges?search=${encodeURIComponent(searchTerm)}&institution_type=${institutionType}&limit=5`);
              if (response.data && response.data.length > 0) {
                setInstitutionId(response.data[0].id);
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            console.error('Search by slug failed:', err);
          }
        }
        
        // If all strategies fail
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
            onClick={() => navigate('/india-colleges')}
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
