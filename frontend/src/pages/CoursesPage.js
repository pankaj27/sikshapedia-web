import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBookOpen, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [selectedStream, selectedDegree]);

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStream) params.append('stream', selectedStream);
      if (selectedDegree) params.append('degree_type', selectedDegree);
      
      const response = await api.get(`/courses?${params.toString()}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchCourses();
      return;
    }
    try {
      const response = await api.get(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error searching courses:', error);
    }
  };

  const streams = ['Engineering', 'Medical', 'Management', 'Science', 'Arts', 'Commerce', 'Law'];
  const degreeTypes = ['UG', 'PG', 'Diploma', 'Certificate'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Explore Courses</h1>
          <p className="text-xl text-center mb-8">Find the perfect course for your career goals</p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Search courses (B.Tech, MBA, MBBS, etc.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 bg-white text-gray-900"
              />
              <Button type="submit" size="lg" className="bg-orange-600 hover:bg-orange-700">
                <FiSearch className="mr-2" /> Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stream</label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Streams</option>
                {streams.map(stream => (
                  <option key={stream} value={stream}>{stream}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Degree Type</label>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Degrees</option>
                {degreeTypes.map(degree => (
                  <option key={degree} value={degree}>{degree}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No courses found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{course.name}</h3>
                    <p className="text-purple-100 text-sm">{course.full_name}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {course.degree_type}
                      </span>
                      <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {course.duration}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <FiBookOpen className="text-orange-600" />
                      <span>{course.stream}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="space-y-2 mb-4">
                      {course.average_salary && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiBriefcase className="text-green-600" />
                          <span>Avg Salary: ₹{(course.average_salary / 100000).toFixed(1)}L</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <FiDollarSign className="text-blue-600" />
                        <span>Avg Fees: ₹{(course.average_fees / 100000).toFixed(1)}L</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm font-semibold text-gray-700">{course.total_colleges || 0} Colleges</span>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">View Details</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;