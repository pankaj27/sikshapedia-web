import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiBookOpen, FiAward } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FeaturedSponsoredSection } from '../components/SponsoredAds';

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    fetchExams();
  }, [selectedStream, selectedLevel]);

  const fetchExams = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStream) params.append('stream', selectedStream);
      if (selectedLevel) params.append('exam_level', selectedLevel);
      
      const response = await api.get(`/exams?${params.toString()}`);
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchExams();
      return;
    }
    try {
      const response = await api.get(`/exams?search=${encodeURIComponent(searchQuery)}`);
      setExams(response.data);
    } catch (error) {
      console.error('Error searching exams:', error);
    }
  };

  const streams = ['Engineering', 'Medical', 'Management', 'Law', 'Design'];
  const levels = ['National', 'State', 'University'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Entrance Exams Guide</h1>
          <p className="text-xl text-center mb-8">Comprehensive information about all major entrance exams</p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Search exams (JEE, NEET, CAT, etc.)"
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
              <label className="block text-sm font-medium mb-2">Exam Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Exams List */}
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
          ) : exams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No exams found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <Link
                  key={exam.id}
                  to={`/exams/${exam.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{exam.name}</h3>
                    <p className="text-blue-100 text-sm">{exam.full_name}</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <FiBookOpen className="text-orange-600" />
                      <span>{exam.streams.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <FiAward className="text-orange-600" />
                      <span>{exam.exam_level} Level</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <FiCalendar className="text-orange-600" />
                      <span>Exam Date: {exam.exam_date || 'TBA'}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{exam.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm font-semibold text-gray-700">₹{exam.application_fee?.General || 'N/A'}</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">View Details</Button>
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

export default ExamsPage;