import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiDollarSign, FiCalendar, FiAward } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

import { Link } from '../../components/CustomLink';
const ScholarshipsManagement = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await api.get('/scholarships');
      setScholarships(response.data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      await api.delete(`/scholarships/${id}`);
      setScholarships(scholarships.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting scholarship:', error);
      alert('Failed to delete scholarship');
    }
  };

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.scholarship_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">🎓 Scholarships</h1>
            <p className="text-gray-500 mt-1">Manage scholarship entries</p>
          </div>
          <Link to="/admin/scholarships/new">
            <Button className="bg-green-500 hover:bg-green-600">
              <FiPlus className="mr-2" /> Add Scholarship
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiAward className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{scholarships.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiDollarSign className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{scholarships.filter(s => s.is_active).length}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiCalendar className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{scholarships.filter(s => s.is_featured).length}</p>
                <p className="text-sm text-gray-500">Featured</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiAward className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(scholarships.map(s => s.scholarship_type)).size}</p>
                <p className="text-sm text-gray-500">Types</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search scholarships by name, provider, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholarship</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredScholarships.map((scholarship) => (
                <tr key={scholarship.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {scholarship.featured_image ? (
                        <img src={scholarship.featured_image} alt="" className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-green-100 flex items-center justify-center">
                          <FiAward className="text-green-600" size={20} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{scholarship.name}</p>
                        <p className="text-sm text-gray-500">{scholarship.education_level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{scholarship.provider}</p>
                    <p className="text-sm text-gray-500">{scholarship.provider_type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {scholarship.scholarship_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{scholarship.amount || 'Variable'}</p>
                    <p className="text-sm text-gray-500">{scholarship.amount_type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        scholarship.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {scholarship.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {scholarship.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(`/scholarships/${scholarship.slug}`, '_blank')}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <FiEye size={18} />
                      </button>
                      <Link
                        to={`/admin/scholarships/edit/${scholarship.id}`}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(scholarship.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          
          {filteredScholarships.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <FiAward className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="text-lg font-medium">No scholarships found</p>
              <p className="mt-1">Create your first scholarship to get started</p>
              <Link to="/admin/scholarships/new" className="mt-4 inline-block">
                <Button className="bg-green-500 hover:bg-green-600">
                  <FiPlus className="mr-2" /> Add Scholarship
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ScholarshipsManagement;
