import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';

const CollegesListManagement = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, College, School, University
  const [filterStatus, setFilterStatus] = useState('All'); // All, draft, published

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const response = await api.get('/colleges');
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        await api.delete(`/colleges/${id}`);
        alert('College deleted successfully!');
        fetchColleges();
      } catch (error) {
        console.error('Error deleting college:', error);
        alert('Failed to delete college');
      }
    }
  };

  // Count stats
  const draftCount = colleges.filter(c => c.status === 'draft').length;
  const publishedCount = colleges.filter(c => c.status === 'published').length;
  const totalCount = colleges.length;

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location?.state?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || college.institution_type === filterType;
    const matchesStatus = filterStatus === 'All' || college.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Institution Entry</h1>
        </div>
        <Button onClick={() => navigate('/admin/colleges/add')} className="bg-orange-600 hover:bg-orange-700">
          <FiPlus className="mr-2" /> Add New Institution
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <button
          onClick={() => setFilterStatus('All')}
          className={`p-4 rounded-lg border-2 text-left transition-all ${filterStatus === 'All' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          <p className="text-sm text-gray-600">📊 Total Institutions</p>
        </button>
        <button
          onClick={() => setFilterStatus('draft')}
          className={`p-4 rounded-lg border-2 text-left transition-all ${filterStatus === 'draft' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <p className="text-2xl font-bold text-yellow-600">{draftCount}</p>
          <p className="text-sm text-gray-600">📝 Drafts</p>
        </button>
        <button
          onClick={() => setFilterStatus('published')}
          className={`p-4 rounded-lg border-2 text-left transition-all ${filterStatus === 'published' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
          <p className="text-sm text-gray-600">📢 Published</p>
        </button>
        <div className="p-4 rounded-lg border-2 border-gray-200 bg-white">
          <p className="text-2xl font-bold text-blue-600">{filteredColleges.length}</p>
          <p className="text-sm text-gray-600">🔍 Filtered Results</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search institutions by name, city, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="All">All Types</option>
          <option value="College">🎓 Colleges</option>
          <option value="School">🏫 Schools</option>
          <option value="University">🏛️ Universities</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="All">All Status</option>
          <option value="draft">📝 Drafts Only</option>
          <option value="published">📢 Published Only</option>
        </select>
      </div>

      {/* Colleges Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Established
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredColleges.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  {filterStatus === 'draft' ? '📝 No draft institutions found.' : 
                   filterStatus === 'published' ? '📢 No published institutions found.' :
                   'No institutions found. Add your first institution!'}
                </td>
              </tr>
            ) : (
              filteredColleges.map((college) => (
                <tr key={college.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      college.institution_type === 'College' ? 'bg-orange-100 text-orange-800' :
                      college.institution_type === 'School' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {college.institution_type === 'College' ? '🎓 College' : 
                       college.institution_type === 'School' ? '🏫 School' : 
                       '🏛️ University'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {college.images?.[0] ? (
                        <img
                          src={college.images[0]}
                          alt={college.name}
                          className="h-10 w-10 rounded object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-orange-100 flex items-center justify-center mr-3">
                          <span className="text-orange-600 font-bold">
                            {college.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{college.name}</div>
                        <div className="text-xs text-gray-500">{college.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {college.location?.city}, {college.location?.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      college.type === 'Government' ? 'bg-green-100 text-green-800' :
                      college.type === 'Private' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {college.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {college.established || college.established_year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ⭐ {college.rating?.toFixed(1) || '0.0'} ({college.total_reviews || 0})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      college.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {college.status === 'published' ? '📢 Published' : '📝 Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/colleges/edit/${college.id}`)}
                      className="mr-2"
                    >
                      <FiEdit className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(college.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">{colleges.length}</div>
          <div className="text-sm text-gray-600">Total Colleges</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {colleges.filter(c => c.type === 'Government').length}
          </div>
          <div className="text-sm text-gray-600">Government Colleges</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {colleges.filter(c => c.type === 'Private').length}
          </div>
          <div className="text-sm text-gray-600">Private Colleges</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">
            {colleges.filter(c => c.type === 'Deemed').length}
          </div>
          <div className="text-sm text-gray-600">Deemed Universities</div>
        </div>
      </div>
    </div>
  );
};

export default CollegesListManagement;
