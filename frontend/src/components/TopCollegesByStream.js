import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp } from 'react-icons/fi';

const TopCollegesByStream = () => {
  const streams = [
    {
      name: 'Engineering',
      icon: '⚙️',
      colleges: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'NIT Trichy'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Medical',
      icon: '🏥',
      colleges: ['AIIMS Delhi', 'CMC Vellore', 'JIPMER Puducherry', 'KGMU Lucknow'],
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Management',
      icon: '💼',
      colleges: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'XLRI Jamshedpur'],
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Law',
      icon: '⚖️',
      colleges: ['NLSIU Bangalore', 'NALSAR Hyderabad', 'NLU Delhi', 'NUJS Kolkata'],
      color: 'from-purple-500 to-purple-600'
    }
  ];

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
          {streams.map((stream, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`bg-gradient-to-r ${stream.color} p-6 text-white`}>
                <div className="text-4xl mb-2">{stream.icon}</div>
                <h3 className="text-2xl font-bold">{stream.name}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {stream.colleges.map((college, cidx) => (
                    <li key={cidx} className="flex items-center text-gray-700">
                      <FiTrendingUp className="text-orange-600 mr-2" size={16} />
                      <span className="text-sm">{college}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/colleges?type=${stream.name}`}
                  className="mt-4 block text-center bg-gray-100 hover:bg-orange-600 hover:text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  View All →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCollegesByStream;