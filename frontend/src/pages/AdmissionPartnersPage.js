/**
 * AdmissionPartnersPage - Lists admission partner institutions
 * Routes: /admission/schools, /admission/colleges, /admission/universities
 */
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Link } from '../components/CustomLink';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiStar, FiArrowRight, FiFilter, FiSearch } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import AdmissionPartnerBadge from '../components/AdmissionPartnerBadge';
import AdmissionBookingModal from '../components/AdmissionBookingModal';

const AdmissionPartnersPage = () => {
  const { type: paramType } = useParams(); // schools, colleges, universities from /admission-partners/:type
  const location = useLocation();
  
  // Get type from URL path if not from params (for static routes like /admission-partners/colleges)
  const pathSegments = location.pathname.split('/');
  const type = paramType || pathSegments[pathSegments.length - 1] || 'colleges';
  
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const institutionType = type === 'schools' ? 'school' : 
                          type === 'universities' ? 'university' : 'college';

  const pageTitle = type === 'schools' ? 'School Admissions' :
                    type === 'universities' ? 'University Admissions' : 'College Admissions';

  useEffect(() => {
    fetchPartners();
  }, [type]);


  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admission/partners', {
        params: { institution_type: institutionType }
      });
      setPartners(response.data.partners || []);
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookSeat = (institution) => {
    setSelectedInstitution(institution);
    setShowBookingModal(true);
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle} | Admission Buddy</title>
        <meta name="description" content={`Find and apply for ${pageTitle.toLowerCase()} at top institutions in India. Book your seat now!`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{pageTitle}</h1>
            <p className="text-lg text-white/90 mb-6">
              Apply directly to our admission partner {type} and book your seat now!
            </p>
            
            {/* Search */}
            <div className="max-w-xl">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${type}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Found <span className="font-bold text-orange-600">{filteredPartners.length}</span> admission partner {type}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          )}

          {/* No Results */}
          {!loading && filteredPartners.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg">No admission partners found for {type}.</p>
              <p className="text-gray-400 mt-2">Check back later for more options.</p>
            </div>
          )}

          {/* Partners Grid */}
          {!loading && filteredPartners.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    {partner.banner_url || partner.logo_url ? (
                      <img 
                        src={partner.banner_url || partner.logo_url} 
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                        <span className="text-4xl font-bold text-orange-300">
                          {partner.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <AdmissionPartnerBadge 
                        isPartner={true} 
                        isAdmissionOpen={partner.is_admission_open}
                        size="small"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                      {partner.name}
                    </h3>
                    
                    {partner.location && (
                      <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                        <FiMapPin size={14} />
                        {partner.location.city}, {partner.location.state}
                      </p>
                    )}

                    {partner.rating && (
                      <div className="flex items-center gap-1 text-amber-500 mb-3">
                        <FiStar size={14} />
                        <span className="font-medium">{partner.rating}</span>
                      </div>
                    )}

                    {partner.courses && partner.courses.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {partner.courses.slice(0, 3).map((course, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {course}
                          </span>
                        ))}
                        {partner.courses.length > 3 && (
                          <span className="px-2 py-0.5 text-gray-400 text-xs">
                            +{partner.courses.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleBookSeat(partner)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Book Your Seat
                      </Button>
                      <Link 
                        to={`/${institutionType === 'school' ? 'schools' : 'colleges'}/${partner.id}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                      >
                        <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <AdmissionBookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedInstitution(null);
        }}
        institution={selectedInstitution}
        institutionType={institutionType}
      />
    </>
  );
};

export default AdmissionPartnersPage;
