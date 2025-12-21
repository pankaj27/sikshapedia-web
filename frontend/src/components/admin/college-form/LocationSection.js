import React, { useState, useEffect } from 'react';
import { FiMapPin, FiLoader } from 'react-icons/fi';
import api from '../../../api/axios';

/**
 * Location Section Component
 * Reusable component for managing location details with master data
 */
const LocationSection = ({ formData, setFormData, handleChange, availableCities, setAvailableCities }) => {
  const [masterStates, setMasterStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch master data on mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [statesRes, citiesRes] = await Promise.all([
          api.get('/locations/all-states'),
          api.get('/locations/all-cities')
        ]);
        
        const activeStates = (statesRes.data || [])
          .filter(s => s.status === 'active')
          .map(s => s.name)
          .sort();
        setMasterStates(activeStates);
        
        const activeCities = (citiesRes.data || [])
          .filter(c => c.status === 'active');
        setAllCities(activeCities);
      } catch (error) {
        console.error('Error fetching master locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  // Update available cities when state changes
  useEffect(() => {
    if (formData.location?.state && allCities.length > 0) {
      const stateCities = allCities
        .filter(c => c.state === formData.location.state)
        .map(c => c.name)
        .sort();
      if (setAvailableCities) {
        setAvailableCities(stateCities);
      }
    }
  }, [formData.location?.state, allCities, setAvailableCities]);

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        state: selectedState,
        city: '' // Reset city when state changes
      }
    });
  };

  const handleLocationChange = (field, value) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [field]: value
      }
    });
  };

  // Get cities for current state from allCities
  const currentCities = formData.location?.state 
    ? allCities.filter(c => c.state === formData.location.state).map(c => c.name).sort()
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label className="block text-sm font-medium mb-1">
            <FiMapPin className="inline mr-1" /> State *
          </label>
          <select
            value={formData.location?.state || ''}
            onChange={handleStateChange}
            className="w-full border rounded px-3 py-2"
            required
            disabled={loading}
          >
            <option value="">
              {loading ? 'Loading states...' : 'Select State'}
            </option>
            {masterStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">City *</label>
          <select
            value={formData.location?.city || ''}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            disabled={loading || !formData.location?.state}
          >
            <option value="">
              {!formData.location?.state ? 'Select state first' : 'Select City'}
            </option>
            {(availableCities || currentCities).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Address</label>
          <textarea
            value={formData.location?.address || ''}
            onChange={(e) => handleLocationChange('address', e.target.value)}
            placeholder="Enter complete address"
            rows="2"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium mb-1">Pincode</label>
          <input
            type="text"
            value={formData.location?.pincode || ''}
            onChange={(e) => handleLocationChange('pincode', e.target.value)}
            placeholder="e.g., 110001"
            className="w-full border rounded px-3 py-2"
            maxLength={6}
          />
        </div>
      </div>

      {/* Google Maps Link */}
      <div>
        <label className="block text-sm font-medium mb-1">Google Maps Link</label>
        <input
          type="url"
          value={formData.location?.map_link || ''}
          onChange={(e) => handleLocationChange('map_link', e.target.value)}
          placeholder="https://maps.google.com/..."
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Latitude</label>
          <input
            type="text"
            value={formData.location?.latitude || ''}
            onChange={(e) => handleLocationChange('latitude', e.target.value)}
            placeholder="e.g., 28.6139"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Longitude</label>
          <input
            type="text"
            value={formData.location?.longitude || ''}
            onChange={(e) => handleLocationChange('longitude', e.target.value)}
            placeholder="e.g., 77.2090"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

// Export empty arrays as fallback for backward compatibility
const indianStates = [];
const citiesByState = {};

export { indianStates, citiesByState };
export default LocationSection;
