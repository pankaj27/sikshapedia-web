import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiGlobe, FiMapPin, FiAward } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

import { Link } from '../../components/CustomLink';
const StudyAbroadManagement = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const countries = [...new Set(universities.map(u => u.country))].sort();

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await api.get('/study-abroad');
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return;
    try {
      await api.delete(`/study-abroad/${id}`);
      setUniversities(universities.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting university:', error);
      alert('Failed to delete university');
    }
  };

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || uni.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🌍 Study Abroad Universities</h1>
            <p className="text-gray-500 mt-1">Manage international universities for study abroad</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/study-abroad-settings">
              <Button variant="outline">
                <FiGlobe className="mr-2" /> Page Settings
              </Button>
            </Link>
            <Link to="/admin/study-abroad/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <FiPlus className="mr-2" /> Add University
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FiGlobe className="text-indigo-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{universities.length}</p>
                <p className="text-sm text-gray-500">Total Universities</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiMapPin className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{countries.length}</p>
                <p className="text-sm text-gray-500">Countries</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiAward className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{universities.filter(u => u.ranking?.qs && u.ranking.qs <= 100).length}</p>
                <p className="text-sm text-gray-500">Top 100 QS</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiGlobe className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{universities.filter(u => u.country === 'USA' || u.country === 'UK').length}</p>
                <p className="text-sm text-gray-500">USA & UK</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search universities by name, country, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border rounded-lg px-4 py-2.5 min-w-[200px]"
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rankings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuition</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUniversities.map((uni) => (
                <tr key={uni.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {uni.images?.[0] ? (
                        <img src={uni.images[0]} alt="" className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-indigo-100 flex items-center justify-center">
                          <FiGlobe className="text-indigo-600" size={20} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{uni.name}</p>
                        <p className="text-sm text-gray-500">{uni.website}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{uni.city}</p>
                    <p className="text-sm text-gray-500">{uni.country}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {uni.ranking?.qs && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          QS #{uni.ranking.qs}
                        </span>
                      )}
                      {uni.ranking?.the && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium ml-1">
                          THE #{uni.ranking.the}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {(uni.programs || []).slice(0, 3).join(', ')}
                      {(uni.programs || []).length > 3 && ` +${uni.programs.length - 3}`}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {uni.tuition_fees?.currency || '$'}{uni.tuition_fees?.min || 'N/A'} - {uni.tuition_fees?.max || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">per year</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(`/study-abroad/${uni.id}`, '_blank')}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Preview"
                      >
                        <FiEye size={18} />
                      </button>
                      <Link
                        to={`/admin/study-abroad/edit/${uni.id}`}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(uni.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUniversities.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <FiGlobe className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="text-lg font-medium">No universities found</p>
              <p className="mt-1">Add your first international university</p>
              <Link to="/admin/study-abroad/new" className="mt-4 inline-block">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <FiPlus className="mr-2" /> Add University
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudyAbroadManagement;
