import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiDollarSign, FiAward, FiCalendar, FiExternalLink, FiCheckCircle, FiFilter, FiUsers } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';
import { FeaturedSponsoredSection } from '../components/SponsoredAds';

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scholarships');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedType, selectedLevel]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'scholarships') {
        const params = new URLSearchParams();
        if (selectedType) params.append('type', selectedType);
        if (selectedLevel) params.append('level', selectedLevel);
        const response = await api.get(`/scholarships?${params.toString()}`);
        setScholarships(response.data);
      } else {
        const params = new URLSearchParams();
        if (selectedType) params.append('type', selectedType);
        const response = await api.get(`/loans?${params.toString()}`);
        setLoans(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }
    try {
      const response = await api.get(`/scholarships?search=${encodeURIComponent(searchQuery)}`);
      setScholarships(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Financial Aid</h1>
          <p className="text-xl text-center mb-8">Find scholarships and education loans</p>
          
          {activeTab === 'scholarships' && (
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 bg-white text-gray-900"
                />
                <Button type="submit" size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <FiSearch className="mr-2" /> Search
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('scholarships')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'scholarships'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <FiAward className="inline mr-2" />
              Scholarships
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'loans'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <FiDollarSign className="inline mr-2" />
              Education Loans
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      {activeTab === 'scholarships' && (
        <section className="bg-gray-100 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white"
                >
                  <option value="">All Types</option>
                  <option value="Merit-based">Merit-based</option>
                  <option value="Need-based">Need-based</option>
                  <option value="Sports">Sports</option>
                  <option value="Research">Research</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white"
                >
                  <option value="">All Levels</option>
                  <option value="UG">Undergraduate</option>
                  <option value="PG">Postgraduate</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'loans' && (
        <section className="bg-gray-100 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedType('')}
                className={`px-4 py-2 rounded-full ${
                  selectedType === '' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'
                }`}
              >
                All
              </button>
              {['Bank', 'NBFC', 'Government'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full ${
                    selectedType === type ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Colleges for Scholarships */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <FeaturedSponsoredSection 
            placementId="scholarship_featured"
            title="Colleges with Best Scholarship Programs"
            subtitle="Explore institutions offering merit and need-based scholarships"
            bgColor="from-yellow-50 via-amber-50 to-orange-50"
            headerColor="from-yellow-500 to-amber-500"
            linkColor="text-yellow-600"
            viewAllLink="/india-colleges"
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : activeTab === 'scholarships' ? (
            <div className="space-y-6">
              {scholarships.length === 0 ? (
                <p className="text-center text-gray-500">No scholarships found</p>
              ) : (
                scholarships.map((scholarship) => (
                  <div key={scholarship.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{scholarship.name}</h3>
                        <p className="text-gray-600 mb-2">By {scholarship.provider}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {scholarship.type}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {scholarship.level}
                          </span>
                          {scholarship.countries.map((country, idx) => (
                            <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{scholarship.amount}</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{scholarship.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">Eligibility:</h4>
                        <p className="text-sm text-gray-700">{scholarship.eligibility}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Application Deadline:</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <FiCalendar className="text-orange-600" />
                          <span>{scholarship.application_deadline}</span>
                        </div>
                      </div>
                    </div>

                    {scholarship.website && (
                      <a href={scholarship.website} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <FiExternalLink className="mr-2" /> Apply Now
                        </Button>
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {loans.length === 0 ? (
                <p className="text-center text-gray-500">No loan providers found</p>
              ) : (
                loans.map((loan) => (
                  <div key={loan.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{loan.name}</h3>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {loan.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Up to</div>
                        <div className="text-2xl font-bold text-green-600">{loan.max_amount}</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{loan.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Interest Rate</p>
                        <p className="font-semibold">{loan.interest_rate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Tenure</p>
                        <p className="font-semibold">{loan.loan_tenure}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Processing Fee</p>
                        <p className="font-semibold">{loan.processing_fee}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Contact</p>
                        <p className="font-semibold text-sm">{loan.contact.phone}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Special Features:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {loan.special_features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    {loan.website && (
                      <a href={loan.website} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <FiExternalLink className="mr-2" /> Learn More
                        </Button>
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ScholarshipsPage;
