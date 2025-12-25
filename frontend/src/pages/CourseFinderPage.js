import React, { useState, useEffect } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import { ALL_INDIA_EXAMS, INDIA_CITIES, INDIA_STATES } from '../constants/indiaData';
import api from '../api/axios';

import { Link } from '../components/CustomLink';
const CourseFinderPage = () => {
  const [activeFilterTab, setActiveFilterTab] = useState('course');
  const [selectedFilters, setSelectedFilters] = useState({
    courses: [],
    states: [],
    cities: [],
    exams: [],
    programTypes: []
  });
  const [openFilterPanel, setOpenFilterPanel] = useState(null);
  
  // State and city data from API
  const [stateOptions, setStateOptions] = useState(INDIA_STATES);
  const [cityOptions, setCityOptions] = useState(INDIA_CITIES);
  const [examOptions, setExamOptions] = useState(ALL_INDIA_EXAMS);
  
  // Fetch states, cities and exams from API
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const [statesRes, citiesRes, examsRes] = await Promise.all([
          api.get('/locations/all-states'),
          api.get('/locations/all-cities'),
          api.get('/exams?limit=500')
        ]);
        
        if (statesRes.data?.length > 0) {
          setStateOptions(statesRes.data.map(s => s.name));
        }
        if (citiesRes.data?.length > 0) {
          setCityOptions(citiesRes.data.map(c => c.name));
        }
        if (examsRes.data?.length > 0) {
          setExamOptions(examsRes.data.map(e => e.name));
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
        // Fallback to constants already set
      }
    };
    fetchLocationData();
  }, []);

  // Filter data
  const courseOptions = [
    'ME/M.Tech', 'MBA/PGDM', 'B.Sc', 'M.Sc', 'BE/B.Tech', 'BA', 'MA', 'BBA/BMS', 
    'B.Com', 'BCA', 'MCA', 'B.Ed', 'MD', 'B.Des', 'M.Des', 'LLB', 'LLM'
  ];

  const programTypeOptions = ['Full Time', 'Part Time', 'Both'];

  // Sample courses data
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses?limit=20');
        setCourses(response.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = (category) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: []
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      courses: [],
      states: [],
      cities: [],
      exams: [],
      programTypes: []
    });
  };

  const renderFilterPanel = (title, options, category) => {
    const isOpen = openFilterPanel === category;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => setOpenFilterPanel(isOpen ? null : category)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">{title}</h3>
            {selectedFilters[category].length > 0 && (
              <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                {selectedFilters[category].length}
              </span>
            )}
          </div>
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {isOpen && (
          <div className="px-4 pb-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {options.map((option, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={selectedFilters[category].includes(option)}
                    onChange={() => toggleFilter(category, option)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {selectedFilters[category].length > 0 && (
              <button
                onClick={() => clearFilters(category)}
                className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Course Finder</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">List of Top courses in Indian Colleges 2025</h1>
        </div>
      </div>

      {/* Top Filter Tabs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-6">
          <div className="text-sm text-gray-600 py-2">Top Filters</div>
          <div className="flex gap-2 overflow-x-auto pb-3">
            <button
              onClick={() => setActiveFilterTab('course')}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeFilterTab === 'course'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Course
            </button>
            <button
              onClick={() => setActiveFilterTab('state')}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeFilterTab === 'state'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              State
            </button>
            <button
              onClick={() => setActiveFilterTab('city')}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeFilterTab === 'city'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              City
            </button>
            <button
              onClick={() => setActiveFilterTab('exam')}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeFilterTab === 'exam'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Entrance/Exam Accepted
            </button>
            <button
              onClick={() => setActiveFilterTab('programType')}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeFilterTab === 'programType'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Program Type
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-80 flex-shrink-0">
            {renderFilterPanel('Course', courseOptions, 'courses')}
            {renderFilterPanel('State', stateOptions, 'states')}
            {renderFilterPanel('City', cityOptions, 'cities')}
            {renderFilterPanel('Entrance/Exam Accepted', examOptions, 'exams')}
            {renderFilterPanel('Program Type', programTypeOptions, 'programTypes')}

            {(selectedFilters.courses.length > 0 || 
              selectedFilters.states.length > 0 || 
              selectedFilters.cities.length > 0 || 
              selectedFilters.exams.length > 0 || 
              selectedFilters.programTypes.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Course Cards */}
          <main className="flex-1">
            <div className="space-y-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <Link to={`/courses/detail/${course.id}`}>
                    <h2 className="text-xl font-bold text-blue-600 hover:underline mb-3">
                      {course.name}
                    </h2>
                  </Link>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="px-3 py-1 bg-gray-100 rounded">{course.duration}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded">{course.type}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded">{course.mode}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded">{course.level}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded">{course.programType}</span>
                  </div>

                  <div className="flex items-center gap-6 text-sm mb-4">
                    <div>
                      <span className="text-gray-600">Course Eligibility: </span>
                      <span className="font-semibold text-gray-800">{course.eligibility}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Entrance Exam: </span>
                      <Link to={`/exams/${course.exam}`} className="font-semibold text-blue-600 hover:underline">
                        {course.exam}
                      </Link>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{course.description}</p>

                  {course.jobRoles && course.jobRoles.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-semibold text-gray-700">Popular Job Roles: </span>
                      <span className="text-sm text-gray-600">{course.jobRoles.join(', ')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/course-finder?course_id=${course.id}`}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View {course.collegesCount} colleges
                    </Link>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseFinderPage;
