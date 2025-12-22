import React, { useState } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import { ALL_INDIA_EXAMS, INDIA_CITIES } from '../constants/indiaData';

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

  // Filter data
  const courseOptions = [
    'ME/M.Tech', 'MBA/PGDM', 'B.Sc', 'M.Sc', 'BE/B.Tech', 'BA', 'MA', 'BBA/BMS', 
    'B.Com', 'BCA', 'MCA', 'B.Ed', 'MD', 'B.Des', 'M.Des', 'LLB', 'LLM'
  ];

  const stateOptions = [
    'Maharashtra', 'Delhi NCR', 'Uttar Pradesh', 'Tamil Nadu', 'Karnataka', 
    'Rajasthan', 'Gujarat', 'Madhya Pradesh', 'West Bengal', 'Haryana'
  ];

  // Use comprehensive city list from constants
  const cityOptions = INDIA_CITIES;

  // Use comprehensive exam list from constants
  const examOptions = ALL_INDIA_EXAMS;

  const programTypeOptions = ['Full Time', 'Part Time', 'Both'];

  // Sample courses data
  const courses = [
    {
      id: 1,
      name: 'Bachelor of Commerce [B.Com]',
      duration: '3 Years',
      type: 'Degree',
      mode: 'On Campus',
      level: 'Graduation',
      programType: 'Full Time',
      eligibility: '10+2',
      exam: 'TS DOST',
      description: 'BCom is a 3-year undergraduate course for students who have cleared 12th standard with a major in Commerce. The full form of BCom is Bachelor of Commerce. BCom Admissions are based on merit as well as entrance exams such as CUET, PU CET, NPAT, etc.',
      jobRoles: ['Chartered Accountant', 'Accounting Analyst', 'Equity Analyst', 'Financial Analyst'],
      collegesCount: 3574
    },
    {
      id: 2,
      name: 'Bachelor of Computer Applications [BCA]',
      duration: '3 Years',
      type: 'Degree',
      mode: 'On Campus',
      level: 'Graduation',
      programType: 'Full Time',
      eligibility: '10+2',
      exam: 'CUET',
      description: 'BCA – Bachelor of Computer Applications – is a 3-year long degree that can be pursued after completion of 10+2. BCA is available in Regular, Distance, and online format.',
      jobRoles: ['Software Developer', 'Technical Analyst'],
      collegesCount: 3390
    },
    {
      id: 3,
      name: 'Bachelor of Business Administration [BBA]',
      duration: '3 Years',
      type: 'Degree',
      mode: 'On Campus',
      level: 'Graduation',
      programType: 'Full Time',
      eligibility: '10+2',
      exam: 'CUET',
      description: 'The Bachelor of Business Administration (BBA) course is a 3-year undergraduate program ideal for students exploring careers in business management.',
      jobRoles: ['Financial Analyst', 'Marketing Executive', 'Business Analyst', 'Risk Control Analyst'],
      collegesCount: 3220
    },
    {
      id: 4,
      name: 'Master of Business Administration [MBA]',
      duration: '2 Years',
      type: 'Degree',
      mode: 'On Campus',
      level: 'Post Graduation',
      programType: 'Full Time',
      eligibility: 'Graduation',
      exam: 'CAT',
      description: 'An MBA is a master\'s degree in business and management. It teaches how to run a business, lead people, and make important decisions.',
      jobRoles: ['Human Resources Manager', 'Operations Manager', 'Marketing Manager', 'Relationship Manager'],
      collegesCount: 2739
    },
    {
      id: 5,
      name: 'Bachelor of Technology [B.Tech] (Computer Science and Engineering)',
      duration: '4 Years',
      type: 'Degree',
      mode: 'On Campus',
      level: 'Graduation',
      programType: 'Full Time',
      eligibility: '10+2',
      exam: 'JEE Main',
      description: 'BTech CSE is a 4 year UG course that studies practical and theoretical knowledge of computer hardware and software.',
      jobRoles: ['Project Coordinator', 'Applications Engineer', 'Solutions Engineer', 'Senior SAP Consultant'],
      collegesCount: 2428
    }
  ];

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

                  <div className="mb-4">
                    <span className="text-sm font-semibold text-gray-700">Popular Job Roles: </span>
                    <span className="text-sm text-gray-600">{course.jobRoles.join(', ')}</span>
                  </div>

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
