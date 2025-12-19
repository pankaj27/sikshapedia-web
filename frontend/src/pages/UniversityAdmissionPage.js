import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiAward, FiSearch } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';

const UniversityAdmissionPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const universityTypes = ['All', 'Central', 'State', 'Deemed', 'Private'];
  
  const states = ['All States', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Uttar Pradesh', 'West Bengal'];
  
  const citiesByState = {
    'Delhi': ['All Cities', 'New Delhi'],
    'Maharashtra': ['All Cities', 'Mumbai', 'Pune'],
    'Tamil Nadu': ['All Cities', 'Chennai', 'Coimbatore'],
    'Karnataka': ['All Cities', 'Bangalore', 'Mysore', 'Manipal'],
    'Uttar Pradesh': ['All Cities', 'Lucknow', 'Noida', 'Varanasi'],
    'West Bengal': ['All Cities', 'Kolkata', 'Durgapur']
  };
  
  const availableCities = selectedState === 'all' || selectedState === 'All States' 
    ? ['All Cities'] 
    : citiesByState[selectedState] || ['All Cities'];

  useEffect(() => {
    fetchAdmissions();
  }, [selectedType, selectedState, selectedCity]);
  
  useEffect(() => {
    setSelectedCity('all');
  }, [selectedState]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType && selectedType !== 'all') {
        params.append('type', selectedType);
      }
      if (selectedState && selectedState !== 'all' && selectedState !== 'All States') {
        params.append('state', selectedState);
      }
      if (selectedCity && selectedCity !== 'all' && selectedCity !== 'All Cities') {
        params.append('city', selectedCity);
      }
      
      const response = await api.get(`/universities?${params.toString()}`);
      setAdmissions(response.data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      let filteredData = generateMockAdmissions();
      
      if (selectedState && selectedState !== 'all' && selectedState !== 'All States') {
        filteredData = filteredData.filter(a => a.location.state === selectedState);
      }
      if (selectedCity && selectedCity !== 'all' && selectedCity !== 'All Cities') {
        filteredData = filteredData.filter(a => a.location.city === selectedCity);
      }
      if (selectedType && selectedType !== 'all') {
        filteredData = filteredData.filter(a => a.type === selectedType);
      }
      
      setAdmissions(filteredData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAdmissions = () => {
    return [
      {
        id: 1,
        name: 'Delhi University',
        location: { city: 'New Delhi', state: 'Delhi' },
        type: 'Central',
        courses: ['UG', 'PG', 'PhD', 'Diploma'],
        average_fees: 50000,
        admission_date: '2024-12-22',
        deadline: '2025-02-15',
        students: 132000,
        rating: 4.6,
        description: 'Delhi University offers admission through CUET for undergraduate courses. The university has 77 affiliated colleges offering diverse programs in arts, science, and commerce.'
      },
      {
        id: 2,
        name: 'Jawaharlal Nehru University',
        location: { city: 'New Delhi', state: 'Delhi' },
        type: 'Central',
        courses: ['MA', 'M.Sc', 'MCA', 'MBA', 'PhD'],
        average_fees: 300,
        admission_date: '2024-12-20',
        deadline: '2025-01-30',
        students: 8500,
        rating: 4.8,
        description: 'JNU offers admission through entrance tests for various postgraduate and doctoral programs. Known for its excellence in social sciences, languages, and sciences.'
      },
      {
        id: 3,
        name: 'Anna University',
        location: { city: 'Chennai', state: 'Tamil Nadu' },
        type: 'State',
        courses: ['B.E', 'B.Tech', 'M.E', 'M.Tech', 'MBA', 'MCA'],
        average_fees: 50000,
        admission_date: '2024-12-18',
        deadline: '2025-02-05',
        students: 75000,
        rating: 4.4,
        description: 'Anna University offers engineering and technology programs. Admission is through TNEA counseling for UG and TANCET for PG programs.'
      },
      {
        id: 4,
        name: 'Manipal Academy of Higher Education',
        location: { city: 'Manipal', state: 'Karnataka' },
        type: 'Deemed',
        courses: ['MBBS', 'B.Tech', 'BDS', 'B.Pharm', 'MBA'],
        average_fees: 400000,
        admission_date: '2024-12-15',
        deadline: '2025-01-25',
        students: 28000,
        rating: 4.5,
        description: 'Manipal offers admission through MUOET for various programs. The university is known for its medical, engineering, and management programs.'
      },
      {
        id: 5,
        name: 'Amity University Noida',
        location: { city: 'Noida', state: 'Uttar Pradesh' },
        type: 'Private',
        courses: ['B.Tech', 'BBA', 'B.Com', 'MBA', 'LLB'],
        average_fees: 200000,
        admission_date: '2024-12-25',
        deadline: '2025-02-20',
        students: 35000,
        rating: 4.2,
        description: 'Amity University offers admission through entrance test and merit. The university provides diverse programs with modern infrastructure and industry connections.'
      },
      {
        id: 6,
        name: 'Banaras Hindu University',
        location: { city: 'Varanasi', state: 'Uttar Pradesh' },
        type: 'Central',
        courses: ['BA', 'B.Sc', 'B.Com', 'MA', 'M.Sc', 'PhD'],
        average_fees: 5000,
        admission_date: '2024-12-10',
        deadline: '2025-01-20',
        students: 30000,
        rating: 4.7,
        description: 'BHU offers admission through BHU UET/PET. One of India\'s oldest and most prestigious universities with comprehensive academic programs.'
      },
      {
        id: 7,
        name: 'Savitribai Phule Pune University',
        location: { city: 'Pune', state: 'Maharashtra' },
        type: 'State',
        courses: ['BA', 'B.Sc', 'B.Com', 'MA', 'M.Sc', 'MBA'],
        average_fees: 30000,
        admission_date: '2024-12-16',
        deadline: '2025-02-10',
        students: 450000,
        rating: 4.3,
        description: 'SPPU is one of India\'s largest universities with over 800 affiliated colleges. Admission is merit-based and through entrance tests.'
      }
    ];
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchAdmissions();
      return;
    }
    try {
      const response = await api.get(`/universities?search=${encodeURIComponent(searchQuery)}`);
      setAdmissions(response.data);
    } catch (error) {
      const filtered = generateMockAdmissions().filter(admission =>
        admission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (admission.type || admission.university_type || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setAdmissions(filtered);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Central': 'bg-indigo-100 text-indigo-700',
      'State': 'bg-emerald-100 text-emerald-700',
      'Deemed': 'bg-purple-100 text-purple-700',
      'Private': 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getGradient = (index) => {
    const gradients = [
      'from-indigo-400 to-purple-500',
      'from-green-400 to-emerald-500',
      'from-blue-400 to-indigo-500',
      'from-purple-400 to-fuchsia-500',
      'from-teal-400 to-cyan-500',
      'from-orange-400 to-amber-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title="University Admissions 2026 - Apply Now | AdmissionBuddy"
        description="Get admission alerts for top universities in India. Central, State, Deemed university admissions open."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
            Get Admission in Best Universities
          </h1>
          <p className="text-sm md:text-base text-center text-purple-50 mb-4">
            Latest university admission alerts and application deadlines
          </p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search by university name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 text-sm bg-white text-gray-900"
                />
                <Button type="submit" className="bg-white text-purple-600 hover:bg-purple-50 h-9 px-4 text-sm whitespace-nowrap">
                  <FiSearch className="mr-1.5" /> Search
                </Button>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="h-9 px-3 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {states.map(state => (
                    <option key={state} value={state === 'All States' ? 'all' : state}>
                      {state}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={selectedState === 'all' || selectedState === 'All States'}
                  className="h-9 px-3 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {availableCities.map(city => (
                    <option key={city} value={city === 'All Cities' ? 'all' : city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Type Filter */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {universityTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type === 'All' ? 'all' : type)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition ${
                  (selectedType === type || (type === 'All' && selectedType === 'all'))
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions List */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-600">Loading admissions...</p>
            </div>
          ) : admissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-sm text-gray-500">No admissions found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {admissions.map((admission, index) => (
                <div key={admission.id} className="bg-white rounded shadow hover:shadow-md transition overflow-hidden">
                  {/* Image at TOP */}
                  <div className={`h-40 bg-gradient-to-br ${getGradient(index)} relative`}>
                    <div className="absolute top-2 left-2">
                      <div className="bg-white/95 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                        {new Date(admission.admission_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <Link to={`/universities/${admission.id}`}>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 h-7 text-xs">
                          Apply Now
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Content BELOW */}
                  <div className="p-3">
                    <div className="mb-1">
                      <span className="text-xs font-semibold text-purple-600">
                        {(admission.courses || admission.streams || []).slice(0, 2).join(' | ')}
                      </span>
                    </div>
                    <Link to={`/universities/${admission.id}`}>
                      <h3 className="text-sm font-bold mb-1 hover:text-purple-600 transition line-clamp-2">
                        {admission.name} Admission 2026
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {admission.description}
                    </p>
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

export default UniversityAdmissionPage;