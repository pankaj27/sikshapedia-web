import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiX, FiPlus, FiMapPin, FiStar, FiDollarSign, FiUsers, FiAward } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

import { Link } from '../components/CustomLink';
const CompareCollegesPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [compareType, setCompareType] = useState('colleges'); // colleges, schools, universities

  useEffect(() => {
    // Check URL params for type and IDs
    const type = searchParams.get('type') || 'colleges';
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    
    setCompareType(type);
    if (ids.length > 0) {
      fetchItems(type, ids);
    }
  }, [searchParams]);

  const fetchItems = async (type, ids) => {
    try {
      const endpoint = type === 'colleges' ? '/colleges' : type === 'schools' ? '/schools' : '/universities';
      const items = await Promise.all(
        ids.map(id => api.get(`${endpoint}/${id}`))
      );
      setSelectedItems(items.map(res => res.data));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const endpoint = compareType === 'colleges' ? '/colleges' : compareType === 'schools' ? '/schools' : '/universities';
      const response = await api.get(`${endpoint}?search=${encodeURIComponent(query)}&limit=5`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const addItem = (item) => {
    if (selectedItems.length >= 4) {
      alert(`You can compare up to 4 ${compareType} at a time`);
      return;
    }
    if (selectedItems.find(c => c.id === item.id)) {
      alert(`${getTypeSingular()} already added for comparison`);
      return;
    }
    setSelectedItems([...selectedItems, item]);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter(c => c.id !== itemId));
  };

  const getTypeSingular = () => {
    return compareType === 'colleges' ? 'College' : compareType === 'schools' ? 'School' : 'University';
  };

  const getTypePlural = () => {
    return compareType === 'colleges' ? 'Colleges' : compareType === 'schools' ? 'Schools' : 'Universities';
  };

  const ComparisonRow = ({ label, values, icon: Icon }) => (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-3 py-2 text-xs font-semibold bg-gray-50 sticky left-0 z-10">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="text-orange-600 text-sm" />}
          {label}
        </div>
      </td>
      {values.map((value, idx) => (
        <td key={idx} className="px-3 py-2 text-xs text-center">{value || 'N/A'}</td>
      ))}
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">Compare {getTypePlural()}</h1>
          <p className="text-sm md:text-base text-center mb-4">Side-by-side comparison</p>
          
          {/* Type Selector */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setCompareType('colleges');
                setSelectedItems([]);
                setSearchResults([]);
              }}
              className={`px-3 py-1.5 text-xs rounded-full transition ${
                compareType === 'colleges' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              Colleges
            </button>
            <button
              onClick={() => {
                setCompareType('schools');
                setSelectedItems([]);
                setSearchResults([]);
              }}
              className={`px-3 py-1.5 text-xs rounded-full transition ${
                compareType === 'schools' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              Schools
            </button>
            <button
              onClick={() => {
                setCompareType('universities');
                setSelectedItems([]);
                setSearchResults([]);
              }}
              className={`px-3 py-1.5 text-xs rounded-full transition ${
                compareType === 'universities' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              Universities
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {selectedItems.length < 4 && (
          <div className="mb-4">
            {!showSearch ? (
              <Button onClick={() => setShowSearch(true)} className="bg-orange-600 hover:bg-orange-700 h-8 text-xs">
                <FiPlus className="mr-1.5 text-xs" /> Add {getTypeSingular()} to Compare
              </Button>
            ) : (
              <div className="bg-white rounded-lg shadow p-3">
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder={`Search ${compareType}...`}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                    className="h-8 text-sm"
                  />
                  <Button onClick={() => setShowSearch(false)} variant="outline" className="h-8 text-xs">Cancel</Button>
                </div>
                {searchResults.length > 0 && (
                  <div className="space-y-1.5">
                    {searchResults.map(item => (
                      <div
                        key={item.id}
                        onClick={() => addItem(item)}
                        className="p-2 hover:bg-gray-50 cursor-pointer rounded border"
                      >
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.location?.city}, {item.location?.state}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-sm text-gray-600 mb-3">No {compareType} selected for comparison</p>
            <Button onClick={() => setShowSearch(true)} className="bg-orange-600 hover:bg-orange-700 h-8 text-xs">
              <FiPlus className="mr-1.5" /> Add {getTypePlural()}
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-bold sticky left-0 z-20 bg-gray-50">Criteria</th>
                  {selectedItems.map(item => (
                    <th key={item.id} className="px-3 py-2 text-center min-w-48">
                      <div className="relative">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX className="text-xs" />
                        </button>
                        <div className="h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded mb-2"></div>
                        <Link 
                          to={`/${compareType}/${item.id}`} 
                          className="text-sm font-bold hover:text-orange-600 line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-600 mt-1">{item.location?.city}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <ComparisonRow
                  label="Location"
                  icon={FiMapPin}
                  values={selectedItems.map(c => `${c.location?.city}, ${c.location?.state}`)}
                />
                <ComparisonRow
                  label="Rating"
                  icon={FiStar}
                  values={selectedItems.map(c => c.rating ? `${c.rating} ⭐` : 'N/A')}
                />
                <ComparisonRow
                  label="Type"
                  values={selectedItems.map(c => c.type || 'N/A')}
                />
                <ComparisonRow
                  label="Average Fees (Annual)"
                  icon={FiDollarSign}
                  values={selectedItems.map(c => c.average_fees ? `₹${(c.average_fees / 100000).toFixed(1)}L` : 'N/A')}
                />
                <ComparisonRow
                  label="Total Students"
                  icon={FiUsers}
                  values={selectedItems.map(c => c.total_students?.toLocaleString() || 'N/A')}
                />
                <ComparisonRow
                  label="NIRF Ranking"
                  icon={FiAward}
                  values={selectedItems.map(c => c.ranking?.nirf || 'N/A')}
                />
                <ComparisonRow
                  label="Accreditation"
                  values={selectedItems.map(c => c.accreditation?.join(', ') || 'N/A')}
                />
                <ComparisonRow
                  label="Placements (Avg Package)"
                  values={selectedItems.map(c => c.placements?.average_package || 'N/A')}
                />
                <ComparisonRow
                  label="Top Recruiters"
                  values={selectedItems.map(c => c.placements?.top_recruiters?.slice(0, 3).join(', ') || 'N/A')}
                />
                <ComparisonRow
                  label="Established Year"
                  values={selectedItems.map(c => c.established || 'N/A')}
                />
                <tr className="border-b">
                  <td className="px-3 py-2 text-xs font-semibold bg-gray-50 sticky left-0 z-10">Actions</td>
                  {selectedItems.map(item => (
                    <td key={item.id} className="px-3 py-2 text-center">
                      <Link to={`/${compareType}/${item.id}`}>
                        <Button className="bg-orange-600 hover:bg-orange-700 w-full h-7 text-xs">
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
