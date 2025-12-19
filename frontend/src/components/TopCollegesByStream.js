import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';

const TopCollegesByStream = () => {
  const [streamData, setStreamData] = useState([]);
  const [loading, setLoading] = useState(true);

  const streams = [
    { name: 'Engineering', icon: '⚙️', color: 'from-blue-500 to-blue-600', query: 'Engineering' },
    { name: 'Medical', icon: '🏥', color: 'from-red-500 to-red-600', query: 'Medical' },
    { name: 'Management', icon: '💼', color: 'from-green-500 to-green-600', query: 'Management' },
    { name: 'Law', icon: '⚖️', color: 'from-purple-500 to-purple-600', query: 'Law' }
  ];

  // Default colleges for fallback
  const defaultColleges = {
    'Engineering': ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'NIT Trichy'],
    'Medical': ['AIIMS Delhi', 'CMC Vellore', 'JIPMER Puducherry', 'KGMU Lucknow'],
    'Management': ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'XLRI Jamshedpur'],
    'Law': ['NLSIU Bangalore', 'NALSAR Hyderabad', 'NLU Delhi', 'NUJS Kolkata']
  };

  useEffect(() => {
    fetchCollegesByStream();
  }, []);

  const fetchCollegesByStream = async () => {
    try {
      // First try to get admin-selected colleges from featured endpoint
      const featuredRes = await api.get('/colleges/by-stream-featured').catch(() => null);
      
      if (featuredRes?.data) {
        // Use admin-selected data
        const results = streams.map(stream => ({
          ...stream,
          colleges: featuredRes.data[stream.name]?.length > 0 
            ? featuredRes.data[stream.name] 
            : defaultColleges[stream.name]
        }));
        setStreamData(results);
      } else {
        // Fallback: Fetch colleges for each stream from regular endpoint
        const results = await Promise.all(
          streams.map(async (stream) => {
            try {
              const response = await api.get(`/colleges?stream=${stream.query}&limit=4&fields=minimal`);
              return {
                ...stream,
                colleges: response.data?.slice(0, 4).map(c => c.name) || defaultColleges[stream.name]
              };
            } catch (error) {
              return { ...stream, colleges: defaultColleges[stream.name] };
            }
          })
        );
        setStreamData(results);
      }
    } catch (error) {
      console.error('Error fetching colleges by stream:', error);
      setStreamData(streams.map(s => ({ ...s, colleges: defaultColleges[s.name] })));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 rounded-xl h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top Colleges by Stream
          </h2>
          <p className="text-lg text-gray-600">
            Explore best colleges in your preferred field of study
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {streamData.map((stream, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`bg-gradient-to-r ${stream.color} p-6 text-white`}>
                <span className="text-4xl mb-3 block">{stream.icon}</span>
                <h3 className="text-xl font-bold">{stream.name}</h3>
                <p className="text-white/80 text-sm">Top Colleges</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {stream.colleges.map((college, cIdx) => (
                    <li key={cIdx} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                        {cIdx + 1}
                      </span>
                      <span className="text-gray-700 text-sm line-clamp-1">{college}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/colleges?stream=${stream.query}`}
                  className="mt-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm"
                >
                  View All <FiArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/colleges"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
          >
            <FiTrendingUp />
            Explore All Colleges
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopCollegesByStream;
