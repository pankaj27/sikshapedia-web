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

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const [statesRes, citiesRes, countriesRes] = await Promise.all([
        api.get('/locations/states'),
        api.get('/locations/cities'),
        api.get('/locations/countries')
      ]);
      setStates(Array.isArray(statesRes.data) ? statesRes.data.slice(0, 15) : []);
      setCities(Array.isArray(citiesRes.data) ? citiesRes.data.slice(0, 20) : []);
      setCountries(Array.isArray(countriesRes.data) ? countriesRes.data.slice(0, 12) : []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = (type, value) => {
    if (type === 'state') {
      navigate(`/colleges?state=${encodeURIComponent(value)}`);
    } else if (type === 'city') {
      navigate(`/colleges?city=${encodeURIComponent(value)}`);
    } else if (type === 'country') {
      navigate(`/study-abroad?country=${encodeURIComponent(value)}`);
    }
  };

  const topStates = [
    { name: 'Maharashtra', count: '2000+', color: 'bg-orange-100 text-orange-700' },
    { name: 'Tamil Nadu', count: '1800+', color: 'bg-blue-100 text-blue-700' },
    { name: 'Karnataka', count: '1500+', color: 'bg-green-100 text-green-700' },
    { name: 'Uttar Pradesh', count: '1400+', color: 'bg-purple-100 text-purple-700' },
    { name: 'Delhi', count: '1200+', color: 'bg-red-100 text-red-700' },
    { name: 'West Bengal', count: '1000+', color: 'bg-yellow-100 text-yellow-700' }
  ];

  const topCities = [
    { name: 'Mumbai', state: 'Maharashtra', icon: 'FiHome' },
    { name: 'Delhi', state: 'Delhi', icon: 'FiMapPin' },
    { name: 'Bangalore', state: 'Karnataka', icon: 'FiCpu' },
    { name: 'Hyderabad', state: 'Telangana', icon: 'FiTrendingUp' },
    { name: 'Chennai', state: 'Tamil Nadu', icon: 'FiStar' },
    { name: 'Pune', state: 'Maharashtra', icon: 'FiBookOpen' },
    { name: 'Kolkata', state: 'West Bengal', icon: 'FiMapPin' },
    { name: 'Ahmedabad', state: 'Gujarat', icon: 'FiTrendingUp' }
  ];

  const topCountries = [
    { name: 'USA', count: '500+', flag: '🇺🇸' },
    { name: 'UK', count: '400+', flag: '🇬🇧' },
    { name: 'Canada', count: '350+', flag: '🇨🇦' },
    { name: 'Australia', count: '300+', flag: '🇦🇺' },
    { name: 'Germany', count: '250+', flag: '🇩🇪' },
    { name: 'France', count: '200+', flag: '🇫🇷' }
  ];

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

        {/* Content */}
        {activeTab === 'state' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topStates.map((state, idx) => (
              <button
                key={idx}
                onClick={() => handleLocationClick('state', state.name)}
                className={`${state.color} p-4 rounded-lg hover:shadow-lg transition-all text-center`}
              >
                <div className="font-bold text-lg mb-1">{state.name}</div>
                <div className="text-sm">{state.count} Colleges</div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'city' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {topCities.map((city, idx) => {
              const iconComponents = { FiHome, FiMapPin, FiCpu, FiTrendingUp, FiStar, FiBookOpen };
              const IconComponent = iconComponents[city.icon] || FiMapPin;
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

        {activeTab === 'country' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topCountries.map((country, idx) => (
              <button
                key={idx}
                onClick={() => handleLocationClick('country', country.name)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all text-center group"
              >
                <div className="text-4xl mb-2">{country.flag}</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-orange-600">
                  {country.name}
                </div>
                <div className="text-sm text-gray-600">{country.count} Universities</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationSearch;
