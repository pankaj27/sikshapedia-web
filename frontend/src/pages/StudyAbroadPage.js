import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiGlobe, FiDollarSign, FiAward } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const StudyAbroadPage = () => {
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    fetchCountries();
    fetchUniversities();
  }, [selectedCountry]);

  const fetchCountries = async () => {
    try {
      const response = await api.get('/study-abroad/countries/list');
      setCountries(response.data.countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchUniversities = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCountry) params.append('country', selectedCountry);
      
      const response = await api.get(`/study-abroad?${params.toString()}`);
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchUniversities();
      return;
    }
    try {
      const response = await api.get(`/study-abroad?search=${encodeURIComponent(searchQuery)}`);
      setUniversities(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">Study Abroad</h1>
          <p className="text-base md:text-lg text-center mb-6">Explore top universities around the world</p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 text-sm bg-white text-gray-900"
              />
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 h-9 px-4 text-sm">
                <FiSearch className="mr-2" /> Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Countries Filter */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCountry('')}
              className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition ${
                selectedCountry === '' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Countries
            </button>
            {countries.map(country => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition ${
                  selectedCountry === country ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Universities Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                </div>
              ))}
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No universities found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {universities.map((uni) => (
                <div key={uni.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-24 relative">
                    <div className="absolute top-3 right-3">
                      <span className="bg-white text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold">
                        #{uni.ranking.world}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold mb-2">{uni.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                      <FiMapPin className="text-orange-600 text-sm" />
                      <span>{uni.city}, {uni.country}</span>
                    </div>
                    <p className="text-xs text-gray-700 mb-3 line-clamp-2">{uni.description}</p>
                    
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Tuition:</span>
                        <span className="font-semibold">{uni.tuition_fees.currency} {uni.tuition_fees.min.toLocaleString()}/yr</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Acceptance:</span>
                        <span className="font-semibold">{uni.acceptance_rate}%</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {uni.programs.slice(0, 3).map((program, idx) => (
                        <span key={idx} className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">
                          {program}
                        </span>
                      ))}
                    </div>

                    <a href={uni.website} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-8 text-xs">
                        <FiGlobe className="mr-1.5 text-xs" /> Visit Website
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudyAbroadPage;