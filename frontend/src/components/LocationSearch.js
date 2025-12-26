import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiGlobe, FiHome, FiCpu, FiTrendingUp, FiStar, FiBookOpen } from 'react-icons/fi';
import api from '../api/axios';

const LocationSearch = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('state');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Color palette for dynamic items
  const stateColors = [
    'bg-orange-100 text-orange-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-red-100 text-red-700',
    'bg-yellow-100 text-yellow-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700'
  ];

  const countryFlags = {
    'USA': '🇺🇸', 'UK': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺',
    'Germany': '🇩🇪', 'France': '🇫🇷', 'Singapore': '🇸🇬', 'Japan': '🇯🇵',
    'China': '🇨🇳', 'Netherlands': '🇳🇱', 'Ireland': '🇮🇪', 'New Zealand': '🇳🇿',
    'default': '🌍'
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      // Fetch both master data and college count data
      const [masterStatesRes, masterCitiesRes, statesWithCollegesRes, citiesWithCollegesRes, countriesRes] = await Promise.all([
        api.get('/locations/all-states').catch(() => ({ data: [] })),
        api.get('/locations/all-cities').catch(() => ({ data: [] })),
        api.get('/locations/states').catch(() => ({ data: [] })),
        api.get('/locations/cities').catch(() => ({ data: [] })),
        api.get('/locations/countries').catch(() => ({ data: [] }))
      ]);
      
      // Create maps of college counts from existing data
      const stateCollegeCounts = {};
      if (Array.isArray(statesWithCollegesRes.data)) {
        statesWithCollegesRes.data.forEach(s => {
          stateCollegeCounts[s.state || s.name] = s.college_count || s.count || 0;
        });
      }
      
      const cityCollegeCounts = {};
      if (Array.isArray(citiesWithCollegesRes.data)) {
        citiesWithCollegesRes.data.forEach(c => {
          cityCollegeCounts[c.city || c.name] = c.college_count || c.count || 0;
        });
      }
      
      // Process master states - merge with college counts and sort by popularity
      if (Array.isArray(masterStatesRes.data) && masterStatesRes.data.length > 0) {
        const statesWithCounts = masterStatesRes.data
          .filter(s => s.status === 'active')
          .map(s => ({
            name: s.name,
            count: stateCollegeCounts[s.name] || 0
          }))
          .sort((a, b) => b.count - a.count) // Sort by college count (most first)
          .slice(0, 12);
        setStates(statesWithCounts);
      } else {
        setStates(defaultStates);
      }
      
      // Process master cities - merge with college counts and sort by popularity
      if (Array.isArray(masterCitiesRes.data) && masterCitiesRes.data.length > 0) {
        const citiesWithCounts = masterCitiesRes.data
          .filter(c => c.status === 'active')
          .map(c => ({
            name: c.name,
            state: c.state,
            count: cityCollegeCounts[c.name] || 0
          }))
          .sort((a, b) => b.count - a.count) // Sort by college count (most first)
          .slice(0, 16);
        setCities(citiesWithCounts);
      } else {
        setCities(defaultCities);
      }
      
      // Process countries - use API data or fallback
      const countriesData = Array.isArray(countriesRes.data) && countriesRes.data.length > 0 
        ? countriesRes.data.slice(0, 12) 
        : defaultCountries;
      setCountries(countriesData);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setStates(defaultStates);
      setCities(defaultCities);
      setCountries(defaultCountries);
    } finally {
      setLoading(false);
    }
  };

  // Default data for fallback
  const defaultStates = [
    { name: 'Maharashtra', count: 2000 },
    { name: 'Tamil Nadu', count: 1800 },
    { name: 'Karnataka', count: 1500 },
    { name: 'Uttar Pradesh', count: 1400 },
    { name: 'Delhi', count: 1200 },
    { name: 'West Bengal', count: 1000 }
  ];

  const defaultCities = [
    { name: 'Mumbai', state: 'Maharashtra' },
    { name: 'Delhi', state: 'Delhi' },
    { name: 'Bangalore', state: 'Karnataka' },
    { name: 'Hyderabad', state: 'Telangana' },
    { name: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Pune', state: 'Maharashtra' },
    { name: 'Kolkata', state: 'West Bengal' },
    { name: 'Ahmedabad', state: 'Gujarat' }
  ];

  const defaultCountries = [
    { name: 'USA', count: 500 },
    { name: 'UK', count: 400 },
    { name: 'Canada', count: 350 },
    { name: 'Australia', count: 300 },
    { name: 'Germany', count: 250 },
    { name: 'France', count: 200 }
  ];

  const handleLocationClick = (type, value) => {
    // Navigate to combined institutes page for states/cities
    const slug = value.toLowerCase().replace(/\s+/g, '-');
    if (type === 'state' || type === 'city') {
      window.location.href = `/institutes/${slug}`;
    } else if (type === 'country') {
      window.location.href = `/study-abroad/${slug}/`;
    }
  };

  const formatCount = (count) => {
    if (!count) return '';
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K+`;
    return `${count}+`;
  };

  const iconComponents = { FiHome, FiMapPin, FiCpu, FiTrendingUp, FiStar, FiBookOpen };
  const iconKeys = Object.keys(iconComponents);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-100 rounded-lg h-24"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Colleges by Location
          </h2>
          <p className="text-lg text-gray-600">
            Explore colleges across India and study abroad opportunities worldwide
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab('state')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'state'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiMapPin className="inline mr-2" />
              By State
            </button>
            <button
              onClick={() => setActiveTab('city')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'city'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiMapPin className="inline mr-2" />
              By City
            </button>
            <button
              onClick={() => setActiveTab('country')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'country'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiGlobe className="inline mr-2" />
              Study Abroad
            </button>
          </div>
        </div>

        {/* States Content */}
        {activeTab === 'state' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {states.map((state, idx) => (
              <button
                key={idx}
                onClick={() => handleLocationClick('state', state.name || state.state)}
                className={`${stateColors[idx % stateColors.length]} p-4 rounded-lg hover:shadow-lg transition-all text-center`}
              >
                <div className="font-bold text-lg mb-1">{state.name || state.state}</div>
                <div className="text-sm">{formatCount(state.count || state.college_count)} Colleges</div>
              </button>
            ))}
          </div>
        )}

        {/* Cities Content */}
        {activeTab === 'city' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {cities.map((city, idx) => {
              const IconComponent = iconComponents[iconKeys[idx % iconKeys.length]];
              return (
                <button
                  key={idx}
                  onClick={() => handleLocationClick('city', city.name)}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all text-center group"
                >
                  <div className="flex justify-center mb-2">
                    <IconComponent className="text-3xl text-orange-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="font-semibold text-gray-900 group-hover:text-orange-600">
                    {city.name}
                  </div>
                  <div className="text-xs text-gray-500">{city.state}</div>
                </button>
              );
            })}
          </div>
        )}

        {/* Countries Content */}
        {activeTab === 'country' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {countries.map((country, idx) => {
              const countryName = country.name || country.country;
              return (
                <button
                  key={idx}
                  onClick={() => handleLocationClick('country', countryName)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all text-center group"
                >
                  <div className="text-4xl mb-2">{countryFlags[countryName] || countryFlags['default']}</div>
                  <div className="font-bold text-lg text-gray-900 group-hover:text-orange-600">
                    {countryName}
                  </div>
                  <div className="text-sm text-gray-600">{formatCount(country.count || country.university_count)} Universities</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationSearch;
