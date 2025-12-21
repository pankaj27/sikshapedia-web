import { useState, useEffect } from 'react';
import api from '../api/axios';

/**
 * Custom hook to fetch master location data (states and cities)
 * Returns states, cities, and helper functions for managing location dropdowns
 */
const useMasterLocations = () => {
  const [states, setStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setLoading(true);
        const [statesRes, citiesRes] = await Promise.all([
          api.get('/locations/all-states'),
          api.get('/locations/all-cities')
        ]);
        
        // Filter only active states and extract names
        const activeStates = (statesRes.data || [])
          .filter(s => s.status === 'active')
          .map(s => s.name)
          .sort();
        setStates(activeStates);
        
        // Store all cities with state info
        const activeCities = (citiesRes.data || [])
          .filter(c => c.status === 'active');
        setAllCities(activeCities);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching master locations:', err);
        setError(err.message);
        // Set fallback data
        setStates([]);
        setAllCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  /**
   * Get cities for a specific state
   * @param {string} stateName - The state name to get cities for
   * @returns {string[]} - Array of city names
   */
  const getCitiesForState = (stateName) => {
    if (!stateName) return [];
    return allCities
      .filter(c => c.state === stateName)
      .map(c => c.name)
      .sort();
  };

  /**
   * Get cities grouped by state (for compatibility with old citiesByState format)
   * @returns {Object} - Object with state names as keys and city arrays as values
   */
  const getCitiesByState = () => {
    const grouped = {};
    allCities.forEach(city => {
      if (!grouped[city.state]) {
        grouped[city.state] = [];
      }
      grouped[city.state].push(city.name);
    });
    // Sort cities within each state
    Object.keys(grouped).forEach(state => {
      grouped[state].sort();
    });
    return grouped;
  };

  return {
    states,
    allCities,
    loading,
    error,
    getCitiesForState,
    getCitiesByState
  };
};

export default useMasterLocations;
