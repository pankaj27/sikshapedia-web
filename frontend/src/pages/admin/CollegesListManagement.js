import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiDownload, FiEye } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const CollegesListManagement = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      // Admin needs to see all colleges including drafts
      const response = await api.get('/colleges?include_drafts=true&limit=500');
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/colleges/${id}`);
        fetchColleges();
      } catch (error) {
        console.error('Error deleting college:', error);
        alert('Failed to delete');
      }
    }
  };

  // Stats
  const draftCount = colleges.filter(c => c.status === 'draft' || !c.status).length;
  const publishedCount = colleges.filter(c => c.status === 'published').length;
  const collegeCount = colleges.filter(c => c.institution_type === 'College').length;
  const schoolCount = colleges.filter(c => c.institution_type === 'School').length;
  const universityCount = colleges.filter(c => c.institution_type === 'University').length;

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location?.state?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || college.institution_type === filterType;
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'draft' ? (!college.status || college.status === 'draft') : college.status === filterStatus);
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900">Institution Entry</h1>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{colleges.length} total</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => {}}>
              <FiDownload className="w-4 h-4 mr-1" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/colleges/simple/new')} className="border-green-500 text-green-600 hover:bg-green-50">
              <FiPlus className="w-4 h-4 mr-1" /> Simple Form
            </Button>
            <Button size="sm" onClick={() => navigate('/admin/colleges/add')} className="bg-orange-600 hover:bg-orange-700 text-white">
              <FiPlus className="w-4 h-4 mr-1" /> Add New
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-4 py-2 bg-gray-50 border-t flex items-center gap-3 text-xs overflow-x-auto">
          <button
            onClick={() => setFilterStatus('All')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${filterStatus === 'All' ? 'bg-orange-100 text-orange-700 font-medium' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            📊 All <span className="font-bold">{colleges.length}</span>
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${filterStatus === 'draft' ? 'bg-yellow-100 text-yellow-700 font-medium' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            📝 Drafts <span className="font-bold">{draftCount}</span>
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${filterStatus === 'published' ? 'bg-green-100 text-green-700 font-medium' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            📢 Published <span className="font-bold">{publishedCount}</span>
          </button>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <button
            onClick={() => setFilterType('College')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${filterType === 'College' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            🎓 Colleges <span className="font-bold">{collegeCount}</span>
          </button>
          <button
            onClick={() => setFilterType('School')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${filterType === 'School' ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            🏫 Schools <span className="font-bold">{schoolCount}</span>
          </button>
          <button
            onClick={() => setFilterType('University')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${filterType === 'University' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            🏛️ Universities <span className="font-bold">{universityCount}</span>
          </button>
          {(filterType !== 'All' || filterStatus !== 'All') && (
            <button
              onClick={() => { setFilterType('All'); setFilterStatus('All'); }}
              className="text-red-600 hover:underline ml-2"
            >
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2 border-t bg-white flex items-center gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, city, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <span className="text-xs text-gray-500">{filteredColleges.length} results</span>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-3 py-2 text-left">Institution</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-center">Rating</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredColleges.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-8 text-center text-gray-500">
                    {searchTerm ? `No results for "${searchTerm}"` : 
                     filterStatus === 'draft' ? '📝 No draft institutions' : 
                     filterStatus === 'published' ? '📢 No published institutions' :
                     'No institutions found'}
                  </td>
                </tr>
              ) : (
                filteredColleges.map((college) => (
                  <tr key={college.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-orange-600 font-bold text-xs">{college.name?.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{college.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{college.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-gray-700">{college.location?.city || '-'}</p>
                      <p className="text-xs text-gray-400">{college.location?.state || '-'}</p>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        college.institution_type === 'College' ? 'bg-blue-50 text-blue-700' :
                        college.institution_type === 'School' ? 'bg-purple-50 text-purple-700' :
                        'bg-indigo-50 text-indigo-700'
                      }`}>
                        {college.institution_type === 'College' ? '🎓' : college.institution_type === 'School' ? '🏫' : '🏛️'} {college.institution_type || 'College'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        college.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {college.status === 'published' ? '📢' : '📝'} {college.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="text-gray-600">⭐ {college.rating?.toFixed(1) || '0.0'}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => window.open(`/colleges/${college.slug}`, '_blank')}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Preview"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/colleges/edit/${college.id}`)}
                          className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(college.id, college.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CollegesListManagement;
