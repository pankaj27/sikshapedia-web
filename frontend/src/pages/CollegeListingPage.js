import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiFilter, FiX } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const CollegeListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    type: searchParams.get('type') || '',
    course: searchParams.get('course') || '',
    min_fees: searchParams.get('min_fees') || '',
    max_fees: searchParams.get('max_fees') || '',
    sort_by: searchParams.get('sort_by') || 'name',
  });

  useEffect(() => {
    fetchColleges();
  }, [searchParams]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/colleges?${params.toString()}`);
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const newFilters = {
      search: '',
      city: '',
      state: '',
      type: '',
      course: '',
      min_fees: '',
      max_fees: '',
      sort_by: 'name',
    };
    setFilters(newFilters);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="text-2xl font-bold text-blue-600" data-testid="logo">
              Sikshapedia
            </Link>
            <div className="flex-1 max-w-2xl flex gap-2">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search colleges..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
              <Button onClick={applyFilters} data-testid="search-button">Search</Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
              data-testid="filter-toggle"
            >
              <FiFilter /> Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-lg" data-testid="filters-panel">
          <div className="container mx-auto max-w-7xl px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Input
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  data-testid="filter-city"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Input
                  placeholder="Enter state"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  data-testid="filter-state"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger data-testid="filter-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Deemed">Deemed University</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Course</label>
                <Input
                  placeholder="e.g., BTech, MBA"
                  value={filters.course}
                  onChange={(e) => handleFilterChange('course', e.target.value)}
                  data-testid="filter-course"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Min Fees (₹)</label>
                <Input
                  type="number"
                  placeholder="Min fees"
                  value={filters.min_fees}
                  onChange={(e) => handleFilterChange('min_fees', e.target.value)}
                  data-testid="filter-min-fees"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Max Fees (₹)</label>
                <Input
                  type="number"
                  placeholder="Max fees"
                  value={filters.max_fees}
                  onChange={(e) => handleFilterChange('max_fees', e.target.value)}
                  data-testid="filter-max-fees"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={filters.sort_by} onValueChange={(value) => handleFilterChange('sort_by', value)}>
                  <SelectTrigger data-testid="filter-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="average_fees">Fees</SelectItem>
                    <SelectItem value="ranking">Ranking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={applyFilters} data-testid="apply-filters-button">Apply Filters</Button>
              <Button variant="outline" onClick={clearFilters} data-testid="clear-filters-button">
                <FiX className="mr-2" /> Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" data-testid="results-title">
            {loading ? 'Loading...' : `${colleges.length} Colleges Found`}
          </h1>
          {filters.search && (
            <p className="text-gray-600">Results for "{filters.search}"</p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border animate-pulse">
                <div className="flex gap-4">
                  <div className="w-32 h-32 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-12" data-testid="no-results">
            <p className="text-gray-600 text-lg">No colleges found matching your criteria.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {colleges.map((college) => (
              <Link
                key={college.id}
                to={`/colleges/${college.id}`}
                className="bg-white rounded-lg p-6 border hover:shadow-lg transition-shadow"
                data-testid={`college-item-${college.id}`}
              >
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center flex-shrink-0">
                    {college.images?.[0] ? (
                      <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <div className="text-white text-3xl font-bold">
                        {college.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h2 className="text-xl font-bold mb-1">{college.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <FiMapPin className="text-blue-600" />
                          <span>{college.location?.city}, {college.location?.state}</span>
                          <span className="mx-2">•</span>
                          <span className="text-blue-600 font-medium">{college.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <FiStar className="text-yellow-500" />
                          <span className="font-bold">{college.rating || 'N/A'}</span>
                          <span className="text-sm text-gray-500">({college.total_reviews})</span>
                        </div>
                        {college.ranking && (
                          <div className="text-sm text-gray-600">Rank #{college.ranking}</div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 line-clamp-2">{college.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">
                          <span className="font-semibold">{college.total_courses}</span> Courses
                        </span>
                        <span className="text-gray-600">
                          Established <span className="font-semibold">{college.established_year}</span>
                        </span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        ₹{(college.average_fees / 100000).toFixed(1)}L/year
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeListingPage;
