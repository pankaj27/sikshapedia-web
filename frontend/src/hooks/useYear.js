import { useState, useEffect, createContext, useContext } from 'react';
import api from '../api/axios';

// Context for year data
const YearContext = createContext(null);

// Default year data (fallback)
const getDefaultYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Academic year logic: July onwards = next year admissions
  const year = currentMonth >= 7 ? currentYear + 1 : currentYear;
  const nextYear = year + 1;
  
  return {
    year,
    year_short: String(year).slice(-2),
    next_year: nextYear,
    next_year_short: String(nextYear).slice(-2),
    academic_year: `${year}-${String(nextYear).slice(-2)}`,
    admission_text: `Admissions ${year}`,
    mode: 'auto'
  };
};

// Provider component
export const YearProvider = ({ children }) => {
  const [yearData, setYearData] = useState(getDefaultYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await api.get('/year-settings');
        if (response.data) {
          setYearData(response.data);
        }
      } catch (error) {
        console.error('Error fetching year settings:', error);
        // Use default fallback
      } finally {
        setLoading(false);
      }
    };

    fetchYear();
  }, []);

  return (
    <YearContext.Provider value={{ ...yearData, loading }}>
      {children}
    </YearContext.Provider>
  );
};

// Hook to use year data
export const useYear = () => {
  const context = useContext(YearContext);
  if (context === null) {
    // Return default if used outside provider
    return { ...getDefaultYear(), loading: false };
  }
  return context;
};

// Utility function to format strings with year
export const formatWithYear = (template, yearData) => {
  if (!template || !yearData) return template;
  
  return template
    .replace(/{year}/g, yearData.year)
    .replace(/{year_short}/g, yearData.year_short)
    .replace(/{next_year}/g, yearData.next_year)
    .replace(/{next_year_short}/g, yearData.next_year_short)
    .replace(/{academic_year}/g, yearData.academic_year)
    .replace(/{admission_text}/g, yearData.admission_text)
    .replace(/2024/g, yearData.year) // Replace hardcoded 2024
    .replace(/2025/g, yearData.year); // Replace hardcoded 2025
};

export default useYear;
