import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiX } from 'react-icons/fi';

/**
 * SearchableSelect - A dropdown with search functionality
 * @param {Array} options - Array of options (strings or {value, label} objects)
 * @param {string} value - Selected value
 * @param {function} onChange - Callback when value changes (receives value directly OR event object)
 * @param {string} placeholder - Placeholder text
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {React.ReactNode} icon - Icon to show on the left
 * @param {string} className - Additional classes
 */
const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select...', 
  searchPlaceholder = 'Search...',
  icon,
  className = '',
  required = false,
  name = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to {value, label} format
  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Filter options based on search
  const filteredOptions = normalizedOptions.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Get display label for selected value
  const selectedOption = normalizedOptions.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small delay to ensure dropdown is rendered before focusing
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    // Support both direct value setter and event-based onChange
    if (typeof onChange === 'function') {
      // Check if onChange expects an event object (form-style) or direct value
      // Try direct value first (simpler pattern)
      onChange(optionValue);
    }
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof onChange === 'function') {
      onChange('');
    }
  };

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Hidden input for form validation */}
      <input
        type="hidden"
        name={name}
        value={value || ''}
        required={required}
      />
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        onTouchEnd={handleToggle}
        className={`w-full flex items-center gap-2 px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all text-left ${
          !value ? 'text-gray-400' : 'text-gray-900'
        }`}
      >
        {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
        <span className="flex-1 truncate">{displayLabel || placeholder}</span>
        {value && (
          <span 
            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0 cursor-pointer" 
            onClick={handleClear}
            onTouchEnd={handleClear}
          >
            <FiX className="w-4 h-4" />
          </span>
        )}
        <FiChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto overscroll-contain">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                No results found
              </div>
            ) : (
              filteredOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleSelect(opt.value);
                  }}
                  className={`w-full px-4 py-3 text-sm text-left hover:bg-orange-50 active:bg-orange-100 transition-colors ${
                    value === opt.value ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
