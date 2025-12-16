import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CollegeDetailPage from './CollegeDetailPage';

/**
 * Wrapper component that handles the new URL structure:
 * /college/{id}-{slug}
 * /university/{id}-{slug}
 * /school/{id}-{slug}
 * 
 * Extracts the ID and passes it to CollegeDetailPage
 */
const InstitutionDetailPage = () => {
  const { idSlug } = useParams();
  const navigate = useNavigate();
  
  // Extract ID from the id-slug pattern
  const extractId = () => {
    if (!idSlug) return null;
    
    // Pattern: {id}-{slug} where id can be numeric or alphanumeric
    const match = idSlug.match(/^([a-zA-Z0-9-]+?)(?:-([a-z].*))?$/);
    
    if (match) {
      // Check if it starts with a number (traditional id-slug pattern)
      const numericMatch = idSlug.match(/^(\d+)-(.+)$/);
      if (numericMatch) {
        return numericMatch[1];
      }
      
      // Otherwise, it might be the full ID (like iit-delhi-001)
      // In this case, try to find the institution by the full idSlug
      return idSlug;
    }
    
    return idSlug;
  };
  
  const institutionId = extractId();
  
  // Pass the ID to CollegeDetailPage (which handles the actual data fetching)
  // We're reusing CollegeDetailPage since it already handles all institution types
  return <CollegeDetailPage overrideId={institutionId} />;
};

export default InstitutionDetailPage;
