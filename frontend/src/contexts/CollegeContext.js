import React, { createContext, useContext, useState } from 'react';

/**
 * CollegeContext - Shares college data between CollegeDetailPage and AutoApplyPopup
 * 
 * This context allows the AutoApplyPopup to access college-specific data
 * (name, logo, courses) that has already been loaded by CollegeDetailPage,
 * avoiding the need for additional API calls or DOM manipulation hacks.
 */

const CollegeContext = createContext(null);

export const CollegeProvider = ({ children }) => {
  const [currentCollege, setCurrentCollege] = useState(null);

  // Set college data when CollegeDetailPage loads
  const setCollegeData = (collegeData) => {
    if (collegeData) {
      setCurrentCollege({
        id: collegeData.id,
        name: collegeData.name,
        logo_url: collegeData.logo_url,
        // Extract course names from the courses array
        courses: extractCourseNames(collegeData.courses || []),
        institution_type: collegeData.institution_type || 'college'
      });
    } else {
      setCurrentCollege(null);
    }
  };

  // Clear college data when leaving the page
  const clearCollegeData = () => {
    setCurrentCollege(null);
  };

  return (
    <CollegeContext.Provider value={{ currentCollege, setCollegeData, clearCollegeData }}>
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollegeContext = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    // Return a default object if not within provider (for non-college pages)
    return { currentCollege: null, setCollegeData: () => {}, clearCollegeData: () => {} };
  }
  return context;
};

/**
 * Extract course names from courses array
 * Handles both legacy (string array) and new format (object array)
 */
const extractCourseNames = (courses) => {
  if (!courses || !Array.isArray(courses)) return [];
  
  return courses.map(course => {
    if (typeof course === 'string') {
      return course;
    }
    // For object format, try to get the name
    return course.name || course.course_name || course.title || '';
  }).filter(Boolean).sort();
};

export default CollegeContext;
