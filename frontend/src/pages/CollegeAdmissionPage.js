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
      params.append('limit', '50');
      
      // Filter by state
      if (selectedState && selectedState !== 'all' && selectedState !== 'All States') {
        params.append('state', selectedState);
      }
      // Filter by city
      if (selectedCity && selectedCity !== 'all' && selectedCity !== 'All Cities') {
        params.append('city', selectedCity);
      }
      
      const response = await api.get(`/colleges?${params.toString()}`);
      let collegesData = response.data || [];
      
      if (collegesData.length > 0) {
        // Transform college data to admission format
        let admissionsData = collegesData.map(college => ({
          id: college.id,
          name: college.name,
          location: { 
            city: college.city || 'Unknown', 
            state: college.state || 'Unknown' 
          },
          type: college.streams?.[0] || college.institution_type || 'General',
          courses: college.courses?.slice(0, 3).map(c => c.name || c) || ['Various Courses'],
          average_fees: college.average_fees || 100000,
          admission_date: college.admission_deadline || new Date().toISOString().split('T')[0],
          deadline: college.admission_deadline || '2025-03-31',
          seats: college.total_seats || 500,
          rating: college.rating || 4.0,
          description: college.short_description || college.description?.substring(0, 150) || `${college.name} offers quality education with excellent facilities.`,
          is_admission_open: college.is_admission_open || false,
          serial_number: college.serial_number
        }));
        
        // Filter by type if selected
        if (selectedType && selectedType !== 'all') {
          admissionsData = admissionsData.filter(a => 
            a.type.toLowerCase().includes(selectedType.toLowerCase())
          );
        }
        
        // Prioritize colleges with admissions open
        admissionsData.sort((a, b) => (b.is_admission_open ? 1 : 0) - (a.is_admission_open ? 1 : 0));
        
        setAdmissions(admissionsData);
      } else {
        // Fallback to mock data if no data from API
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
      }
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
        name: 'Indian Institute of Technology Bombay',
        location: { city: 'Mumbai', state: 'Maharashtra' },
        type: 'Engineering',
        courses: ['B.Tech', 'M.Tech'],
        average_fees: 200000,
        admission_date: '2024-12-20',
        deadline: '2025-01-15',
        seats: 1200,
        rating: 4.7,
        description: 'IIT Bombay is one of the premier engineering institutions in India, known for its academic excellence and state-of-the-art facilities.'
      },
      {
        id: 2,
        name: 'All India Institute of Medical Sciences Delhi',
        location: { city: 'New Delhi', state: 'Delhi' },
        type: 'Medical',
        courses: ['MBBS', 'MD'],
        average_fees: 5000,
        admission_date: '2024-12-18',
        deadline: '2025-02-01',
        seats: 800,
        rating: 4.9,
        description: 'AIIMS Delhi is India\'s premier medical institute, renowned for medical education, research, and patient care.'
      },
      {
        id: 3,
        name: 'Indian Institute of Management Ahmedabad',
        location: { city: 'Ahmedabad', state: 'Gujarat' },
        type: 'Management',
        courses: ['MBA', 'PhD'],
        average_fees: 2500000,
        admission_date: '2024-12-15',
        deadline: '2025-01-30',
        seats: 395,
        rating: 4.9,
        description: 'IIM Ahmedabad is India\'s leading business school, known for its rigorous MBA program and management research.'
      },
      {
        id: 4,
        name: 'National Institute of Technology Trichy',
        location: { city: 'Tiruchirappalli', state: 'Tamil Nadu' },
        type: 'Engineering',
        courses: ['B.Tech', 'M.Tech'],
        average_fees: 150000,
        admission_date: '2024-12-22',
        deadline: '2025-01-20',
        seats: 2000,
        rating: 4.5,
        description: 'NIT Trichy is one of India\'s top National Institutes of Technology, known for engineering excellence.'
      },
      {
        id: 5,
        name: 'Delhi University - St. Stephen\'s College',
        location: { city: 'New Delhi', state: 'Delhi' },
        type: 'Arts & Science',
        courses: ['BA', 'B.Sc'],
        average_fees: 50000,
        admission_date: '2024-12-19',
        deadline: '2025-01-10',
        seats: 500,
        rating: 4.7,
        description: 'St. Stephen\'s College is one of Delhi University\'s most prestigious colleges for arts and sciences.'
      },
      {
        id: 6,
        name: 'National Law School of India University',
        location: { city: 'Bangalore', state: 'Karnataka' },
        type: 'Law',
        courses: ['BA LLB', 'LLM'],
        average_fees: 250000,
        admission_date: '2024-12-21',
        deadline: '2025-02-05',
        seats: 80,
        rating: 4.8,
        description: 'NLSIU Bangalore is India\'s top law school with excellent faculty and infrastructure.'
      },
      {
        id: 7,
        name: 'Jawaharlal Nehru University Delhi',
        location: { city: 'New Delhi', state: 'Delhi' },
        type: 'Arts & Science',
        courses: ['BA', 'MA', 'PhD'],
        average_fees: 20000,
        admission_date: '2024-12-17',
        deadline: '2025-01-25',
        seats: 1000,
        rating: 4.6,
        description: 'JNU is renowned for social sciences, humanities, and scientific research.'
      },
      {
        id: 8,
        name: 'Manipal Institute of Technology',
        location: { city: 'Manipal', state: 'Karnataka' },
        type: 'Engineering',
        courses: ['B.Tech', 'M.Tech'],
        average_fees: 300000,
        admission_date: '2024-12-16',
        deadline: '2025-02-10',
        seats: 1500,
        rating: 4.3,
        description: 'Manipal Institute of Technology offers quality engineering education with modern facilities.'
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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'TBA';
      }
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } catch (error) {
      return 'TBA';
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {admissions.map((admission, index) => (
                <div key={admission.id} className="bg-white rounded shadow hover:shadow-md transition overflow-hidden">
                  {/* Image at TOP */}
                  <div className={`h-40 bg-gradient-to-br ${getGradient(index)} relative`}>
                    <div className="absolute top-2 left-2">
                      <div className="bg-white/95 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                        {formatDate(admission.admission_date)}
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

                  {/* Content BELOW */}
                  <div className="p-3">
                    <div className="mb-1">
                      <span className="text-xs font-semibold text-blue-600">
                        {admission.courses.slice(0, 2).join(' | ')}
                      </span>
                    </div>
                    <Link to={`/colleges/${admission.id}`}>
                      <h3 className="text-sm font-bold mb-1 hover:text-blue-600 transition line-clamp-2">
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

          {/* Pagination would go here */}
        </div>
      </section>
    </div>
  );
};

export default CollegeAdmissionPage;