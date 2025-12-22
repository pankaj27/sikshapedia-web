import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiAward, FiSearch } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';
import AdmissionPartnerBadge from '../components/AdmissionPartnerBadge';
import AdmissionBookingModal from '../components/AdmissionBookingModal';

import { Link } from '../components/CustomLink';
const CollegeAdmissionPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Master location data
  const [masterStates, setMasterStates] = useState([]);
  const [masterCities, setMasterCities] = useState([]);

  const collegeTypes = ['All', 'Engineering', 'Medical', 'Management', 'Law', 'Arts & Science'];
  
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
    : ['All States', 'Delhi', 'Maharashtra', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Rajasthan'];
  
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
  }, [selectedType, selectedState, selectedCity]);
  
  useEffect(() => {
    // Reset city when state changes
    setSelectedCity('all');
  }, [selectedState]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      
      // Fetch ONLY admission partners
      const response = await api.get('/admission/partners', {
        params: { entity_type: 'college' }
      });
      
      let partnersData = response.data.partners || [];
      
      // Apply filters
      if (selectedState && selectedState !== 'all' && selectedState !== 'All States') {
        partnersData = partnersData.filter(p => p.state === selectedState);
      }
      if (selectedCity && selectedCity !== 'all' && selectedCity !== 'All Cities') {
        partnersData = partnersData.filter(p => p.city === selectedCity);
      }
      
      if (partnersData.length > 0) {
        // Transform partner data to admission format
        let admissionsData = partnersData.map(college => ({
          id: college.id,
          name: college.name,
          slug: college.slug,
          location: { 
            city: college.city || 'Unknown', 
            state: college.state || 'Unknown' 
          },
          type: college.type || 'General',
          courses: college.courses_offered?.slice(0, 3) || [],
          average_fees: college.average_fees || 0,
          admission_date: college.admission_deadline || '',
          deadline: college.admission_deadline || '',
          seats: college.total_seats || 0,
          rating: college.rating || 0,
          description: college.short_description || college.description || '',
          is_admission_open: college.is_admission_open || false,
          is_admission_partner: college.is_admission_partner || false,
          logo: college.logo,
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
        // No fallback - show empty state
        setAdmissions([]);
      }
    } catch (error) {
      console.error('Error fetching admissions:', error);
      // No fallback - show empty state
      setAdmissions([]);
      
      setAdmissions(filteredData);
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
        title="College Admissions 2026 - Apply Now | admissionbuddy"
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
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <div className="bg-white/95 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                        {formatDate(admission.admission_date)}
                      </div>
                      <AdmissionPartnerBadge size="sm" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 space-y-1">
                      <Button 
                        onClick={() => {
                          setSelectedInstitution({
                            id: admission.id,
                            name: admission.name,
                            type: 'college',
                            city: admission.location?.city,
                            state: admission.location?.state
                          });
                          setShowBookingModal(true);
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 h-7 text-xs"
                      >
                        🎓 Book Your Seat
                      </Button>
                    </div>
                  </div>

                  {/* Content BELOW */}
                  <div className="p-3">
                    <div className="mb-1">
                      <span className="text-xs font-semibold text-blue-600">
                        {admission.courses.slice(0, 2).join(' | ')}
                      </span>
                    </div>
                    <Link to={admission.serial_number ? `/colleges/${String(admission.serial_number).padStart(3, '0')}-${admission.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : `/colleges/${admission.id}`}>
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

      {/* Admission Booking Modal */}
      <AdmissionBookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedInstitution(null);
        }}
        institution={selectedInstitution}
        institutionType="college"
      />
    </div>
  );
};

export default CollegeAdmissionPage;