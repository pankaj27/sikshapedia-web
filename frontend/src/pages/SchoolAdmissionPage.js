import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiAward, FiSearch } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';

const SchoolAdmissionPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const boards = ['All', 'CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'];
  
  const states = ['All States', 'Delhi', 'Maharashtra', 'Uttarakhand', 'Rajasthan', 'Karnataka', 'Tamil Nadu'];
  
  const citiesByState = {
    'Delhi': ['All Cities', 'New Delhi', 'South Delhi', 'North Delhi'],
    'Maharashtra': ['All Cities', 'Mumbai', 'Pune', 'Nagpur'],
    'Uttarakhand': ['All Cities', 'Dehradun', 'Nainital', 'Roorkee'],
    'Rajasthan': ['All Cities', 'Jaipur', 'Jodhpur', 'Udaipur'],
    'Karnataka': ['All Cities', 'Bangalore', 'Mysore', 'Mangalore'],
    'Tamil Nadu': ['All Cities', 'Chennai', 'Coimbatore', 'Madurai']
  };
  
  const availableCities = selectedState === 'all' || selectedState === 'All States' 
    ? ['All Cities'] 
    : citiesByState[selectedState] || ['All Cities'];

  useEffect(() => {
    fetchAdmissions();
  }, [selectedBoard, selectedState, selectedCity]);
  
  useEffect(() => {
    setSelectedCity('all');
  }, [selectedState]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBoard && selectedBoard !== 'all') {
        params.append('board', selectedBoard);
      }
      if (selectedState && selectedState !== 'all' && selectedState !== 'All States') {
        params.append('state', selectedState);
      }
      if (selectedCity && selectedCity !== 'all' && selectedCity !== 'All Cities') {
        params.append('city', selectedCity);
      }
      
      const response = await api.get(`/schools?${params.toString()}`);
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
      if (selectedBoard && selectedBoard !== 'all') {
        filteredData = filteredData.filter(a => a.board === selectedBoard);
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
        name: 'Delhi Public School RK Puram',
        location: { city: 'New Delhi', state: 'Delhi' },
        board: 'CBSE',
        classes: ['Pre-Primary', 'Primary', 'Secondary', 'Senior Secondary'],
        average_fees: 150000,
        admission_date: '2024-12-15',
        deadline: '2025-01-31',
        students: 3500,
        rating: 4.8,
        description: 'DPS RK Puram offers admission from Nursery to Class XII. The school follows CBSE curriculum and is known for academic excellence and holistic development.'
      },
      {
        id: 2,
        name: 'The Doon School',
        location: { city: 'Dehradun', state: 'Uttarakhand' },
        board: 'ICSE',
        classes: ['Class VI to XII'],
        average_fees: 800000,
        admission_date: '2024-12-10',
        deadline: '2025-01-15',
        students: 550,
        rating: 4.9,
        description: 'The Doon School is India\'s premier boys\' boarding school offering ICSE and ISC education. Admission is through entrance test and interview.'
      },
      {
        id: 3,
        name: 'Dhirubhai Ambani International School',
        location: { city: 'Mumbai', state: 'Maharashtra' },
        board: 'IB',
        classes: ['Pre-Primary to Grade XII'],
        average_fees: 600000,
        admission_date: '2024-12-20',
        deadline: '2025-02-10',
        students: 1200,
        rating: 4.7,
        description: 'DAIS offers International Baccalaureate (IB) curriculum. The school is known for its world-class infrastructure and innovative teaching methods.'
      },
      {
        id: 4,
        name: 'Modern School Barakhamba Road',
        location: { city: 'New Delhi', state: 'Delhi' },
        board: 'CBSE',
        classes: ['Nursery to Class XII'],
        average_fees: 120000,
        admission_date: '2024-12-18',
        deadline: '2025-01-25',
        students: 2800,
        rating: 4.6,
        description: 'Modern School offers CBSE education with emphasis on academics, sports, and co-curricular activities. The school has excellent faculty and facilities.'
      },
      {
        id: 5,
        name: 'The Bishop\'s School',
        location: { city: 'Pune', state: 'Maharashtra' },
        board: 'ICSE',
        classes: ['Pre-Primary to Class XII'],
        average_fees: 200000,
        admission_date: '2024-12-12',
        deadline: '2025-01-20',
        students: 1500,
        rating: 4.7,
        description: 'The Bishop\'s School offers ICSE/ISC education with focus on all-round development. The school has a rich heritage and excellent academic record.'
      },
      {
        id: 6,
        name: 'Maharani Gayatri Devi Girls\' School',
        location: { city: 'Jaipur', state: 'Rajasthan' },
        board: 'CBSE',
        classes: ['Class VI to XII'],
        average_fees: 500000,
        admission_date: '2024-12-08',
        deadline: '2025-01-10',
        students: 350,
        rating: 4.8,
        description: 'MGD is India\'s premier girls\' boarding school. The school offers CBSE curriculum with focus on leadership and character building.'
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
      const response = await api.get(`/schools?search=${encodeURIComponent(searchQuery)}`);
      setAdmissions(response.data);
    } catch (error) {
      const filtered = generateMockAdmissions().filter(admission =>
        admission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.board.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setAdmissions(filtered);
    }
  };

  const getBoardColor = (board) => {
    const colors = {
      'CBSE': 'bg-blue-100 text-blue-700',
      'ICSE': 'bg-green-100 text-green-700',
      'State Board': 'bg-purple-100 text-purple-700',
      'IB': 'bg-orange-100 text-orange-700',
      'IGCSE': 'bg-teal-100 text-teal-700'
    };
    return colors[board] || 'bg-gray-100 text-gray-700';
  };

  const getGradient = (index) => {
    const gradients = [
      'from-rose-400 to-pink-500',
      'from-violet-400 to-purple-500',
      'from-sky-400 to-blue-500',
      'from-emerald-400 to-teal-500',
      'from-amber-400 to-orange-500',
      'from-fuchsia-400 to-pink-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title="School Admissions 2026 - Apply Now | AdmissionBuddy"
        description="Get admission alerts for top schools in India. CBSE, ICSE, IB school admissions open."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
            Get Admission in Best Schools
          </h1>
          <p className="text-sm md:text-base text-center text-pink-50 mb-4">
            Latest school admission alerts and application deadlines
          </p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search by school name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 text-sm bg-white text-gray-900"
                />
                <Button type="submit" className="bg-white text-pink-600 hover:bg-pink-50 h-9 px-4 text-sm whitespace-nowrap">
                  <FiSearch className="mr-1.5" /> Search
                </Button>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="h-9 px-3 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
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
                  className="h-9 px-3 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

      {/* Board Filter */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {boards.map(board => (
              <button
                key={board}
                onClick={() => setSelectedBoard(board === 'All' ? 'all' : board)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition ${
                  (selectedBoard === board || (board === 'All' && selectedBoard === 'all'))
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {board}
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
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-600">Loading admissions...</p>
            </div>
          ) : admissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-sm text-gray-500">No admissions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {admissions.map((admission, index) => (
                <div key={admission.id} className="bg-white rounded shadow hover:shadow-md transition">
                  <div className="flex">
                    {/* Small Image LEFT */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-40 h-32 bg-gradient-to-br ${getGradient(index)} relative`}>
                        <div className="absolute top-2 left-2">
                          <div className="bg-white/95 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                            {new Date(admission.admission_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <Link to={`/schools/${admission.id}`}>
                            <Button className="w-full bg-pink-600 hover:bg-pink-700 h-7 text-xs">
                              Apply Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Content RIGHT */}
                    <div className="flex-1 p-3">
                      <div className="mb-1">
                        <span className="text-xs font-semibold text-pink-600">
                          {admission.board}
                        </span>
                      </div>
                      <Link to={`/schools/${admission.id}`}>
                        <h3 className="text-base font-bold mb-1 hover:text-pink-600 transition">
                          {admission.name} Admission 2026: Application, Dates
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {admission.description}
                      </p>
                    </div>
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

export default SchoolAdmissionPage;