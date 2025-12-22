import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiAward, FiSearch } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';
import AdmissionPartnerBadge from '../components/AdmissionPartnerBadge';
import AdmissionBookingModal from '../components/AdmissionBookingModal';

import { Link } from '../components/CustomLink';
const SchoolAdmissionPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Master location data
  const [masterStates, setMasterStates] = useState([]);
  const [masterCities, setMasterCities] = useState([]);

  const boards = ['All', 'CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'];
  
  // Fetch master location data
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
        setMasterCities((citiesRes.data || []).filter(c => c.status === 'active'));
      } catch (error) {
        console.error('Error fetching master locations:', error);
      }
    };
    fetchMasterData();
  }, []);
  
  const states = masterStates.length > 0 
    ? ['All States', ...masterStates]
    : ['All States', 'Delhi', 'Maharashtra', 'Uttarakhand', 'Rajasthan', 'Karnataka', 'Tamil Nadu'];
  
  // Get cities for selected state from master data
  const getAvailableCities = () => {
    if (selectedState === 'all' || selectedState === 'All States') {
      return ['All Cities'];
    }
    if (masterCities.length > 0) {
      const stateCities = masterCities
        .filter(c => c.state === selectedState)
        .map(c => c.name)
        .sort();
      return ['All Cities', ...stateCities];
    }
    return ['All Cities'];
  };
  
  const availableCities = getAvailableCities();

  useEffect(() => {
    fetchAdmissions();
  }, [selectedBoard, selectedState, selectedCity]);
  
  useEffect(() => {
    setSelectedCity('all');
  }, [selectedState]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      
      // Fetch ONLY admission partners
      const response = await api.get('/admission/partners', {
        params: { entity_type: 'school' }
      });
      
      let partnersData = response.data.partners || [];
      
      // Apply filters
      if (selectedBoard && selectedBoard !== 'all') {
        partnersData = partnersData.filter(p => p.board === selectedBoard);
      }
      if (selectedState && selectedState !== 'all' && selectedState !== 'All States') {
        partnersData = partnersData.filter(p => p.state === selectedState);
      }
      if (selectedCity && selectedCity !== 'all' && selectedCity !== 'All Cities') {
        partnersData = partnersData.filter(p => p.city === selectedCity);
      }
      
      const transformedData = partnersData.map(school => ({
        id: school.id,
        name: school.name,
        slug: school.slug,
        location: { city: school.city || 'Unknown', state: school.state || 'Unknown' },
        board: school.board || '',
        classes: school.classes_offered || [],
        average_fees: school.annual_fee || 0,
        admission_date: school.admission_deadline || '',
        deadline: school.admission_deadline || '',
        students: school.total_students || 0,
        rating: school.rating || 0,
        description: school.short_description || school.description || '',
        is_admission_partner: school.is_admission_partner || false,
        logo: school.logo
      }));
      setAdmissions(transformedData);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      // No fallback - show empty state
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // No mock data - return empty array
  const generateMockAdmissions = () => [];

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
        title="School Admissions 2026 - Apply Now | admissionbuddy"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {admissions.map((admission, index) => (
                <div key={admission.id} className="bg-white rounded shadow hover:shadow-md transition overflow-hidden">
                  {/* Image at TOP */}
                  <div className={`h-40 bg-gradient-to-br ${getGradient(index)} relative`}>
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <div className="bg-white/95 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                        {new Date(admission.admission_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </div>
                      <AdmissionPartnerBadge size="sm" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 space-y-1">
                      <Button 
                        onClick={() => {
                          setSelectedInstitution({
                            id: admission.id,
                            name: admission.name,
                            type: 'school',
                            city: admission.location?.city,
                            state: admission.location?.state
                          });
                          setShowBookingModal(true);
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 h-7 text-xs"
                      >
                        🏫 Book Your Seat
                      </Button>
                    </div>
                  </div>

                  {/* Content BELOW */}
                  <div className="p-3">
                    <div className="mb-1">
                      <span className="text-xs font-semibold text-pink-600">
                        {admission.board}
                      </span>
                    </div>
                    <Link to={`/schools/${admission.id}`}>
                      <h3 className="text-sm font-bold mb-1 hover:text-pink-600 transition line-clamp-2">
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

      {/* Admission Booking Modal */}
      <AdmissionBookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedInstitution(null);
        }}
        institution={selectedInstitution}
        institutionType="school"
      />
    </div>
  );
};

export default SchoolAdmissionPage;