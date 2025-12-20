import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from '../components/CustomLink';
import { FiSearch, FiMapPin, FiStar } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const GlobalSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState({ colleges: [], exams: [], courses: [] });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const [collegesRes, examsRes, coursesRes] = await Promise.all([
        api.get(`/colleges?search=${encodeURIComponent(searchQuery)}&limit=10`),
        api.get(`/exams?search=${encodeURIComponent(searchQuery)}&limit=10`),
        api.get(`/courses?search=${encodeURIComponent(searchQuery)}&limit=10`)
      ]);
      
      setResults({
        colleges: collegesRes.data,
        exams: examsRes.data,
        courses: coursesRes.data
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  const totalResults = results.colleges.length + results.exams.length + results.courses.length;

  const filteredResults = () => {
    if (activeFilter === 'all') return results;
    return {
      colleges: activeFilter === 'colleges' ? results.colleges : [],
      exams: activeFilter === 'exams' ? results.exams : [],
      courses: activeFilter === 'courses' ? results.courses : []
    };
  };

  const displayResults = filteredResults();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for colleges, exams, courses..."
              className="h-12 text-lg"
            />
            <Button type="submit" size="lg" className="bg-orange-600 hover:bg-orange-700 px-8">
              <FiSearch className="mr-2" /> Search
            </Button>
          </form>
        </div>

        {query && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
              <p className="text-gray-600">{totalResults} results found</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { key: 'all', label: 'All', count: totalResults },
                { key: 'colleges', label: 'Colleges', count: results.colleges.length },
                { key: 'exams', label: 'Exams', count: results.exams.length },
                { key: 'courses', label: 'Courses', count: results.courses.length }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                    activeFilter === filter.key
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching...</p>
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 text-lg">No results found for "{query}"</p>
                <p className="text-gray-500 mt-2">Try different keywords or browse our categories</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Colleges Results */}
                {displayResults.colleges.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Colleges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayResults.colleges.map((college) => (
                        <Link
                          key={college.id}
                          to={`/colleges/${college.id}`}
                          className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
                        >
                          <h3 className="font-bold text-lg mb-2">{college.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <FiMapPin className="text-orange-600" />
                            <span>{college.location?.city}, {college.location?.state}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <FiStar className="text-yellow-500" />
                              <span className="font-semibold">{college.rating || 'N/A'}</span>
                            </div>
                            <span className="text-orange-600 font-bold">₹{(college.average_fees / 100000).toFixed(1)}L/yr</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exams Results */}
                {displayResults.exams.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Exams</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayResults.exams.map((exam) => (
                        <Link
                          key={exam.id}
                          to={`/exams/${exam.id}`}
                          className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
                        >
                          <h3 className="font-bold text-lg mb-1">{exam.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{exam.full_name}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{exam.exam_level}</span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{exam.streams[0]}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Courses Results */}
                {displayResults.courses.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayResults.courses.map((course) => (
                        <Link
                          key={course.id}
                          to={`/courses/${course.id}`}
                          className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
                        >
                          <h3 className="font-bold text-lg mb-1">{course.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{course.full_name}</p>
                          <div className="flex items-center justify-between">
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">{course.degree_type}</span>
                            <span className="text-orange-600 font-bold">₹{(course.average_fees / 100000).toFixed(1)}L</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-12">
            <FiSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Enter a search query to find colleges, exams, and courses</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchPage;