/**
 * SearchAutocomplete - Live search with autocomplete dropdown
 * Shows results from Colleges, Universities, Schools, Exams, Courses
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiTrendingUp } from 'react-icons/fi';
import api from '../../api/axios';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Category colors and icons
const categoryConfig = {
  college: { color: 'bg-blue-100 text-blue-700', icon: '🏫', label: 'College' },
  university: { color: 'bg-purple-100 text-purple-700', icon: '🎓', label: 'University' },
  school: { color: 'bg-green-100 text-green-700', icon: '🏫', label: 'School' },
  exam: { color: 'bg-orange-100 text-orange-700', icon: '📝', label: 'Exam' },
  course: { color: 'bg-pink-100 text-pink-700', icon: '📚', label: 'Course' },
};

const SearchAutocomplete = ({ 
  placeholder = "Search colleges, exams, courses...",
  className = "",
  inputClassName = "",
  size = "default" // "default" | "large"
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const debouncedQuery = useDebounce(query, 300);
  
  // Fetch trending searches on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/search/trending');
        setTrending(res.data.trending || []);
      } catch (err) {
        console.error('Failed to fetch trending:', err);
      }
    };
    fetchTrending();
  }, []);
  
  // Fetch autocomplete results
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const res = await api.get(`/search/autocomplete?q=${encodeURIComponent(debouncedQuery)}`);
        setResults(res.data.results || []);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [debouncedQuery]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const items = results.length > 0 ? results : (query.length === 0 ? trending : []);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        const item = items[selectedIndex];
        if (item.url) {
          navigate(item.url);
        } else if (item.term) {
          setQuery(item.term);
          handleSearch(item.term);
        }
        setIsOpen(false);
      } else if (query.trim()) {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  // Navigate to full search page
  const handleSearch = (searchQuery) => {
    if (searchQuery?.trim()) {
      // Use window.location.href for full page navigation
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setIsOpen(false);
    }
  };
  
  // Handle result click - use window.location for proper page navigation
  const handleResultClick = (result) => {
    if (result.url) {
      // Use window.location.href for full page navigation to ensure proper component rendering
      window.location.href = result.url;
    } else if (result.term) {
      setQuery(result.term);
      handleSearch(result.term);
    }
    setIsOpen(false);
  };
  
  const sizeClasses = size === 'large' 
    ? 'h-14 text-lg px-5' 
    : 'h-10 text-sm px-4';
  
  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${size === 'large' ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full ${sizeClasses} pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${inputClassName}`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className={size === 'large' ? 'w-5 h-5' : 'w-4 h-4'} />
          </button>
        )}
      </div>
      
      {/* Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto"
        >
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => {
                const config = categoryConfig[result.type] || categoryConfig.college;
                return (
                  <button
                    key={`${result.type}-${result.id}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-gray-50 transition ${
                      selectedIndex === index ? 'bg-orange-50' : ''
                    }`}
                  >
                    <span className="text-xl">{result.icon || config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{result.name}</div>
                      {result.subtitle && (
                        <div className="text-xs text-gray-500 truncate">{result.subtitle}</div>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${config.color}`}>
                      {config.label}
                    </span>
                    {result.rating && (
                      <span className="text-xs text-yellow-600 flex items-center gap-0.5">
                        ⭐ {result.rating.toFixed(1)}
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* View All Results */}
              {query.trim() && (
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full px-4 py-3 text-center text-orange-600 font-medium hover:bg-orange-50 border-t"
                >
                  View all results for "{query}"
                </button>
              )}
            </div>
          )}
          
          {/* No Results */}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="py-6 text-center text-gray-500">
              <p>No results found for "{query}"</p>
              <button
                onClick={() => handleSearch(query)}
                className="mt-2 text-orange-600 hover:underline text-sm"
              >
                Search anyway →
              </button>
            </div>
          )}
          
          {/* Trending (when empty) */}
          {!loading && query.length === 0 && trending.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <FiTrendingUp className="text-orange-500" />
                Trending Searches
              </div>
              {trending.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(item)}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-gray-50 transition ${
                    selectedIndex === index ? 'bg-orange-50' : ''
                  }`}
                >
                  <FiSearch className="text-gray-400" />
                  <span className="flex-1 text-gray-700">{item.term}</span>
                  <span className="text-xs text-gray-400">{item.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
