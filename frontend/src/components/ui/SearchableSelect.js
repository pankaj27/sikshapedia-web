import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiX } from 'react-icons/fi';

/**
 * SearchableSelect - A dropdown with search/filter functionality
 * 
 * Props:
 * - options: Array of strings or objects with { value, label }
 * - value: Currently selected value
 * - onChange: Callback when value changes
 * - placeholder: Placeholder text
 * - disabled: Whether the select is disabled
 * - required: Whether the field is required
 * - className: Additional CSS classes
 * - allowCustom: Allow typing custom values not in the list
 */
const SearchableSelect = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select...',
  disabled = false,
  required = false,
  className = '',
  allowCustom = false,
  label = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options to { value, label } format
  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Filter options based on search term
  const filteredOptions = normalizedOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display label for current value
  const displayValue = normalizedOptions.find(opt => opt.value === value)?.label || value || '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && listRef.current && filteredOptions.length > 0) {
      const highlightedElement = listRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen, filteredOptions.length]);

  // Handle search term change - reset highlight
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setHighlightedIndex(0);
  };

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions.length > 0) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else if (allowCustom && searchTerm) {
          handleSelect(searchTerm);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      default:
        break;
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Main button/input area */}
      <div
        className={`flex items-center border rounded-lg px-3 py-2 cursor-pointer transition-colors ${
          disabled 
            ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
            : isOpen 
              ? 'border-orange-500 ring-2 ring-orange-200' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <div className="flex items-center flex-1 gap-2">
            <FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Search ${label || placeholder}...`}
              className="flex-1 outline-none bg-transparent text-sm"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <span className={`flex-1 text-sm ${!displayValue ? 'text-gray-400' : 'text-gray-900'}`}>
            {displayValue || placeholder}
          </span>
        )}
        
        <div className="flex items-center gap-1 ml-2">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <FiX className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Hidden input for form validation */}
      {required && (
        <input
          type="text"
          value={value}
          required={required}
          className="sr-only"
          tabIndex={-1}
          onChange={() => {}}
        />
      )}

      {/* Dropdown list */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul ref={listRef} className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                    index === highlightedIndex
                      ? 'bg-orange-50 text-orange-700'
                      : option.value === value
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500 text-center">
                {allowCustom && searchTerm ? (
                  <button
                    type="button"
                    onClick={() => handleSelect(searchTerm)}
                    className="text-orange-600 hover:underline"
                  >
                    Add &ldquo;{searchTerm}&rdquo;
                  </button>
                ) : (
                  'No results found'
                )}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
