import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiAward, FiSearch } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';

const CollegeAdmissionPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const collegeTypes = ['All', 'Engineering', 'Medical', 'Management', 'Law', 'Arts & Science'];
  
  const states = ['All States', 'Delhi', 'Maharashtra', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Rajasthan'];
  
  const citiesByState = {
    'Delhi': ['All Cities', 'New Delhi', 'South Delhi', 'North Delhi'],
    'Maharashtra': ['All Cities', 'Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'Karnataka': ['All Cities', 'Bangalore', 'Mysore', 'Mangalore', 'Manipal'],
    'Gujarat': ['All Cities', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'Tamil Nadu': ['All Cities', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
    'Uttar Pradesh': ['All Cities', 'Lucknow', 'Kanpur', 'Noida', 'Varanasi'],
    'West Bengal': ['All Cities', 'Kolkata', 'Siliguri', 'Durgapur'],
    'Rajasthan': ['All Cities', 'Jaipur', 'Jodhpur', 'Udaipur', 'Kota']
  };
  
  const availableCities = selectedState === 'all' || selectedState === 'All States' 
    ? ['All Cities'] 
    : citiesByState[selectedState] || ['All Cities'];

  useEffect(() => {
    fetchAdmissions();
  }, [selectedType, selectedState, selectedCity]);
  
  useEffect(() => {
    // Reset city when state changes
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
      
      const response = await api.get(`/colleges?${params.toString()}`);
      setAdmissions(response.data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      // Fallback to mock data with filtering
      let filteredData = generateMockAdmissions();
      
      if (selectedState && selectedState !== 'all' && selectedState !== 'All States') {
        filteredData = filteredData.filter(a => a.location.state === selectedState);
      }
      if (selectedCity && selectedCity !== 'all' && selectedCity !== 'All Cities') {
        filteredData = filteredData.filter(a => a.location.city === selectedCity);
      }
      if (selectedType && selectedType !== 'all') {
        filteredData = filteredData.filter(a => a.type.toLowerCase() === selectedType.toLowerCase());
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
        name: 'Indian Institute of Technology Delhi',
        location: { city: 'New Delhi', state: 'Delhi' },
        type: 'Engineering',
        courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'],
        average_fees: 200000,
        admission_date: '2024-12-20',
        deadline: '2025-01-15',
        seats: 1200,
        rating: 4.7,
        description: 'IIT Delhi offers admission to various UG and PG programs through JEE Advanced and GATE. The institute is known for its excellent placement records and world-class infrastructure.'
      },
      {
        id: 2,
        name: 'All India Institute of Medical Sciences',
        location: { city: 'New Delhi', state: 'Delhi' },
        type: 'Medical',
        courses: ['MBBS', 'MD', 'MS', 'B.Sc Nursing'],
        average_fees: 500,
        admission_date: '2024-12-18',
        deadline: '2025-02-01',
        seats: 800,
        rating: 4.9,
        description: 'AIIMS offers admission based on NEET scores. The institute is India\'s premier medical institution offering world-class medical education and healthcare.'
      },
      {
        id: 3,
        name: 'St. Xavier\'s College Mumbai',
        location: { city: 'Mumbai', state: 'Maharashtra' },
        type: 'Arts & Science',
        courses: ['BA', 'B.Sc', 'B.Com', 'MA', 'M.Sc'],
        average_fees: 50000,
        admission_date: '2024-12-15',
        deadline: '2025-01-30',
        seats: 1500,
        rating: 4.5,
        description: 'St. Xavier\'s College offers undergraduate and postgraduate courses in Arts, Science, and Commerce. Admission is merit-based with entrance tests for certain courses.'
      },
      {
        id: 4,
        name: 'National Law School of India University',
        location: { city: 'Bangalore', state: 'Karnataka' },
        type: 'Law',
        courses: ['BA LLB', 'LLM', 'PhD'],
        average_fees: 250000,
        admission_date: '2024-12-22',
        deadline: '2025-01-20',
        seats: 80,
        rating: 4.8,
        description: 'NLSIU Bangalore offers admission through CLAT for undergraduate law programs. The university is India\'s top law school with excellent faculty and infrastructure.'
      },
      {
        id: 5,
        name: 'Indian Institute of Management Ahmedabad',
        location: { city: 'Ahmedabad', state: 'Gujarat' },
        type: 'Management',
        courses: ['MBA', 'PGDM', 'PhD', 'Executive MBA'],
        average_fees: 2500000,
        admission_date: '2024-12-19',
        deadline: '2025-01-10',
        seats: 395,
        rating: 4.9,
        description: 'IIM Ahmedabad offers admission to MBA based on CAT scores followed by Written Ability Test and Personal Interview. The institute is ranked #1 in India for management education.'
      },
      {
        id: 6,
        name: 'Delhi Technological University',
        location: { city: 'Delhi', state: 'Delhi' },
        type: 'Engineering',
        courses: ['B.Tech', 'M.Tech', 'MBA', 'MCA'],
        average_fees: 150000,
        admission_date: '2024-12-21',
        deadline: '2025-02-05',
        seats: 2000,
        rating: 4.4,
        description: 'DTU offers admission through JEE Main for B.Tech programs. The university is known for its excellent engineering programs and placement opportunities.'
      },
      {
        id: 7,
        name: 'Manipal College of Pharmaceutical Sciences',
        location: { city: 'Manipal', state: 'Karnataka' },
        type: 'Medical',
        courses: ['B.Pharm', 'M.Pharm', 'PharmD', 'PhD'],
        average_fees: 300000,
        admission_date: '2024-12-17',
        deadline: '2025-01-25',
        seats: 600,
        rating: 4.3,
        description: 'Manipal offers admission to pharmacy programs through MUOET. The college has state-of-the-art laboratories and experienced faculty.'
      },
      {
        id: 8,
        name: 'Christ University Bangalore',
        location: { city: 'Bangalore', state: 'Karnataka' },
        type: 'Arts & Science',
        courses: ['BA', 'B.Sc', 'BBA', 'BCA', 'MA', 'M.Sc'],
        average_fees: 180000,
        admission_date: '2024-12-16',
        deadline: '2025-02-10',
        seats: 3000,
        rating: 4.4,
        description: 'Christ University offers admission through entrance test and interview. The university is known for its diverse academic programs and vibrant campus life.'
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
      const response = await api.get(`/colleges?search=${encodeURIComponent(searchQuery)}`);
      setAdmissions(response.data);
    } catch (error) {
      const filtered = generateMockAdmissions().filter(admission =>
        admission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setAdmissions(filtered);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Engineering': 'bg-blue-100 text-blue-700',
      'Medical': 'bg-red-100 text-red-700',
      'Management': 'bg-purple-100 text-purple-700',
      'Law': 'bg-amber-100 text-amber-700',
      'Arts & Science': 'bg-teal-100 text-teal-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getGradient = (index) => {
    const gradients = [
      'from-blue-400 to-cyan-500',
      'from-emerald-400 to-teal-500',
      'from-purple-400 to-pink-500',
      'from-orange-400 to-red-500',
      'from-cyan-400 to-blue-500',
      'from-teal-400 to-emerald-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title="College Admissions 2026 - Apply Now | AdmissionBuddy"
        description="Get admission alerts for top colleges in India. Engineering, Medical, Management, Law admissions open."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
            Get Admission in Best Colleges
          </h1>
          <p className="text-sm md:text-base text-center text-blue-50 mb-4">
            Latest admission alerts and application deadlines
          </p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search by college name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 text-sm bg-white text-gray-900"
                />
                <Button type="submit" className="bg-white text-blue-600 hover:bg-blue-50 h-9 px-4 text-sm whitespace-nowrap">
                  <FiSearch className="mr-1.5" /> Search
                </Button>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="h-9 px-3 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="h-9 px-3 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            {collegeTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type === 'All' ? 'all' : type)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition ${
                  (selectedType === type.toLowerCase() || (type === 'All' && selectedType === 'all'))
                    ? 'bg-blue-600 text-white'
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
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-600">Loading admissions...</p>
            </div>
          ) : admissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-sm text-gray-500">No admissions found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {admissions.map((admission, index) => (
                <div key={admission.id} className="bg-white rounded-lg shadow hover:shadow-md transition p-4">
                  <div className="flex gap-4">
                    {/* Small Square Image */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-32 h-32 rounded bg-gradient-to-br ${getGradient(index)} relative`}>
                        <div className="absolute top-2 left-2 right-2">
                          <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-center">
                            <div className="text-xs font-semibold text-gray-700">
                              {new Date(admission.admission_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            </div>
                            <div className="text-xs font-semibold text-gray-700">
                              {new Date(admission.admission_date).getFullYear()}
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <Link to={`/colleges/${admission.id}`}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-7 text-xs">
                              Apply Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Course Tags */}
                      <div className="mb-2">
                        <span className="text-xs font-semibold text-gray-600">
                          {admission.courses.slice(0, 2).join(' | ')}
                        </span>
                      </div>

                      {/* Title */}
                      <Link to={`/colleges/${admission.id}`}>
                        <h3 className="text-lg font-bold mb-2 hover:text-blue-600 transition leading-tight">
                          {admission.name} Admission 2026: Cutoff, Fees, Courses, Registration, Eligibility, Selection Criteria
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {admission.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination would go here */}
        </div>
      </section>
    </div>
  );
};

export default CollegeAdmissionPage;