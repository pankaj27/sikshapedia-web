import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiX, FiPlus, FiMapPin, FiStar, FiDollarSign, FiUsers, FiAward } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const CompareCollegesPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const collegeIds = searchParams.get('colleges')?.split(',').filter(Boolean) || [];
    if (collegeIds.length > 0) {
      fetchColleges(collegeIds);
    }
  }, [searchParams]);

  const fetchColleges = async (ids) => {
    try {
      const colleges = await Promise.all(
        ids.map(id => api.get(`/colleges/${id}`))
      );
      setSelectedColleges(colleges.map(res => res.data));
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await api.get(`/colleges?search=${encodeURIComponent(query)}&limit=5`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const addCollege = (college) => {
    if (selectedColleges.length >= 4) {
      alert('You can compare up to 4 colleges at a time');
      return;
    }
    if (selectedColleges.find(c => c.id === college.id)) {
      alert('College already added for comparison');
      return;
    }
    setSelectedColleges([...selectedColleges, college]);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const removeCollege = (collegeId) => {
    setSelectedColleges(selectedColleges.filter(c => c.id !== collegeId));
  };

  const ComparisonRow = ({ label, values, icon: Icon }) => (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3 font-semibold bg-gray-50 sticky left-0 z-10">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-orange-600" />}
          {label}
        </div>
      </td>
      {values.map((value, idx) => (
        <td key={idx} className="px-4 py-3 text-center">{value || 'N/A'}</td>
      ))}
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/admissionbuddy-logo.png" alt="AdmissionBuddy" className="h-10" />
            </Link>
            <div className="flex gap-4">
              <Link to="/"><Button variant="ghost">Home</Button></Link>
              <Link to="/colleges"><Button variant="ghost">Colleges</Button></Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 text-center">Compare Colleges</h1>
          <p className="text-xl text-center">Side-by-side comparison of colleges</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Add College Section */}
        {selectedColleges.length < 4 && (
          <div className=\"mb-6\">
            {!showSearch ? (
              <Button onClick={() => setShowSearch(true)} className=\"bg-orange-600 hover:bg-orange-700\">
                <FiPlus className=\"mr-2\" /> Add College to Compare
              </Button>
            ) : (
              <div className=\"bg-white rounded-lg shadow p-4\">
                <div className=\"flex gap-2 mb-3\">
                  <Input
                    placeholder=\"Search colleges...\"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                  />
                  <Button onClick={() => setShowSearch(false)} variant=\"outline\">Cancel</Button>
                </div>
                {searchResults.length > 0 && (
                  <div className=\"space-y-2\">
                    {searchResults.map(college => (
                      <div
                        key={college.id}
                        onClick={() => addCollege(college)}
                        className=\"p-3 hover:bg-gray-50 cursor-pointer rounded border\"
                      >
                        <p className=\"font-semibold\">{college.name}</p>
                        <p className=\"text-sm text-gray-600\">{college.location.city}, {college.location.state}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Comparison Table */}
        {selectedColleges.length === 0 ? (
          <div className=\"bg-white rounded-lg shadow p-12 text-center\">
            <p className=\"text-gray-600 text-lg mb-4\">No colleges selected for comparison</p>
            <Button onClick={() => setShowSearch(true)} className=\"bg-orange-600 hover:bg-orange-700\">
              <FiPlus className=\"mr-2\" /> Add Colleges
            </Button>
          </div>
        ) : (
          <div className=\"bg-white rounded-lg shadow overflow-x-auto\">
            <table className=\"w-full\">
              <thead>
                <tr className=\"border-b bg-gray-50\">
                  <th className=\"px-4 py-3 text-left font-bold sticky left-0 z-20 bg-gray-50\">Criteria</th>
                  {selectedColleges.map(college => (
                    <th key={college.id} className=\"px-4 py-3 text-center min-w-64\">
                      <div className=\"relative\">
                        <button
                          onClick={() => removeCollege(college.id)}
                          className=\"absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600\"
                        >
                          <FiX />
                        </button>
                        <div className=\"h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded mb-2\"></div>
                        <Link to={`/colleges/${college.id}`} className=\"font-bold hover:text-orange-600\">
                          {college.name}
                        </Link>
                        <p className=\"text-sm text-gray-600\">{college.location.city}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <ComparisonRow
                  label=\"Location\"
                  icon={FiMapPin}
                  values={selectedColleges.map(c => `${c.location.city}, ${c.location.state}`)}
                />
                <ComparisonRow
                  label=\"Rating\"
                  icon={FiStar}
                  values={selectedColleges.map(c => c.rating ? `${c.rating} ⭐` : 'N/A')}
                />
                <ComparisonRow
                  label=\"College Type\"
                  values={selectedColleges.map(c => c.type)}
                />
                <ComparisonRow
                  label=\"Average Fees (Annual)\"
                  icon={FiDollarSign}
                  values={selectedColleges.map(c => `₹${(c.average_fees / 100000).toFixed(1)}L`)}
                />
                <ComparisonRow
                  label=\"Total Students\"
                  icon={FiUsers}
                  values={selectedColleges.map(c => c.total_students?.toLocaleString() || 'N/A')}
                />
                <ComparisonRow
                  label=\"NIRF Ranking\"
                  icon={FiAward}
                  values={selectedColleges.map(c => c.ranking?.nirf || 'N/A')}
                />
                <ComparisonRow
                  label=\"Accreditation\"
                  values={selectedColleges.map(c => c.accreditation?.join(', ') || 'N/A')}
                />
                <ComparisonRow
                  label=\"Placements (Avg Package)\"
                  values={selectedColleges.map(c => c.placements?.average_package || 'N/A')}
                />
                <ComparisonRow
                  label=\"Top Recruiters\"
                  values={selectedColleges.map(c => c.placements?.top_recruiters?.slice(0, 3).join(', ') || 'N/A')}
                />
                <ComparisonRow
                  label=\"Established Year\"
                  values={selectedColleges.map(c => c.established || 'N/A')}
                />
                <tr className=\"border-b\">
                  <td className=\"px-4 py-3 font-semibold bg-gray-50 sticky left-0 z-10\">Actions</td>
                  {selectedColleges.map(college => (
                    <td key={college.id} className=\"px-4 py-3 text-center\">
                      <Link to={`/colleges/${college.id}`}>
                        <Button size=\"sm\" className=\"bg-orange-600 hover:bg-orange-700 w-full\">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareCollegesPage;
