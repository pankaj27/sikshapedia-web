import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiGlobe, FiMapPin, FiBook, FiFilter, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AdminLayout from '../../components/admin/AdminLayout';

const ListingPagesManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  const pageTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'india', label: 'India Pages' },
    { value: 'state', label: 'State Pages' },
    { value: 'city', label: 'City Pages' },
    { value: 'stream', label: 'Stream Pages' },
    { value: 'course', label: 'Course Pages' },
    { value: 'type', label: 'Type Pages' },
    { value: 'accreditation', label: 'Accreditation Pages' }
  ];

  const institutionTypes = ['colleges', 'schools', 'universities'];

  useEffect(() => {
    fetchPages();
  }, [filterType]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType !== 'all') {
        params.append('page_type', filterType);
      }
      const response = await api.get(`/listing-pages?${params.toString()}`);
      setPages(response.data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page content?')) return;
    try {
      await api.delete(`/listing-pages/${pageId}`);
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  const handleTogglePublish = async (page) => {
    try {
      await api.put(`/listing-pages/${page.id}`, {
        is_published: !page.is_published
      });
      fetchPages();
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  const filteredPages = pages.filter(page => 
    page.url_slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.page_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.meta_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case 'india': return <FiGlobe className="text-blue-500" />;
      case 'state': return <FiMapPin className="text-green-500" />;
      case 'city': return <FiMapPin className="text-orange-500" />;
      case 'stream': return <FiBook className="text-purple-500" />;
      case 'course': return <FiBook className="text-cyan-500" />;
      case 'type': return <FiFilter className="text-pink-500" />;
      default: return <FiGlobe className="text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'india': return 'bg-blue-100 text-blue-700';
      case 'state': return 'bg-green-100 text-green-700';
      case 'city': return 'bg-orange-100 text-orange-700';
      case 'stream': return 'bg-purple-100 text-purple-700';
      case 'course': return 'bg-cyan-100 text-cyan-700';
      case 'type': return 'bg-pink-100 text-pink-700';
      case 'accreditation': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Listing Pages Content</h1>
            <p className="text-gray-600 text-sm">Manage content for India, State, City, Stream & Course pages</p>
          </div>
          <Link to="/admin/listing-pages/new">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <FiPlus className="mr-2" /> Add Page Content
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by URL or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              {pageTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          {pageTypes.slice(1).map(type => {
            const count = pages.filter(p => p.page_type === type.value).length;
            return (
              <div key={type.value} className="bg-white rounded-lg shadow p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-500">{type.label}</div>
              </div>
            );
          })}
        </div>

        {/* Pages List */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <FiGlobe className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No listing pages found</p>
            <Link to="/admin/listing-pages/new">
              <Button>Create Your First Page</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">URL Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Institution</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Page Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Created By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPages.map(page => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(page.page_type)}
                        <div>
                          <a 
                            href={`/${page.url_slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium text-sm"
                          >
                            /{page.url_slug}
                          </a>
                          {page.state && <div className="text-xs text-gray-400">{page.state}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(page.page_type)}`}>
                        {page.page_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                      {page.institution_type}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium truncate max-w-[200px]">
                        {page.page_title || page.meta_title || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(page)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          page.is_published 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {page.is_published ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                        {page.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/listing-pages/edit/${page.id}`}>
                          <Button variant="outline" size="sm">
                            <FiEdit2 size={14} />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(page.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ListingPagesManagement;
