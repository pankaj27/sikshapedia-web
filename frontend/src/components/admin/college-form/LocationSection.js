import React from 'react';
import { FiMapPin } from 'react-icons/fi';

// Indian States and Cities data
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const citiesByState = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry', 'Kakinada', 'Kadapa', 'Anantapur'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Gulbarga', 'Shimoga', 'Davangere', 'Tumkur', 'Bellary'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Navi Mumbai'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukkudi'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Noida'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand', 'Nadiad'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Udaipur', 'Ajmer', 'Bhilwara', 'Alwar', 'Sikar', 'Bharatpur'],
  // Add more states as needed - keeping subset for file size
};

/**
 * Location Section Component
 * Reusable component for managing location details
 */
const LocationSection = ({ formData, setFormData, handleChange, availableCities, setAvailableCities }) => {
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const cities = citiesByState[selectedState] || [];
    if (setAvailableCities) {
      setAvailableCities(cities);
    }
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
          >
            <option value="">Select State</option>
            {indianStates.map(state => (
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
          >
            <option value="">Select City</option>
            {(availableCities || citiesByState[formData.location?.state] || []).map(city => (
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

export { indianStates, citiesByState };
export default LocationSection;
