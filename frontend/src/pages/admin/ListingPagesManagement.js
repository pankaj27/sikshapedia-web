import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiGlobe, FiMapPin, FiBook, FiFilter, FiEye, FiEyeOff, FiGrid, FiDownload, FiCheck, FiLoader } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AdminLayout from '../../components/admin/AdminLayout';

import { Link } from '../../components/CustomLink';

const ListingPagesManagement = () => {
  const [activeTab, setActiveTab] = useState('pages'); // 'pages' or 'urls'
  const [pages, setPages] = useState([]);
  const [urlStructures, setUrlStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [urlFilterType, setUrlFilterType] = useState('all');
  const [generating, setGenerating] = useState(false);

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

  const urlTypes = [
    { value: 'all', label: 'All URLs' },
    { value: 'college_state', label: 'Colleges (State)' },
    { value: 'college_city', label: 'Colleges (City)' },
    { value: 'college_state_city', label: 'Colleges (State+City)' },
    { value: 'school_state', label: 'Schools (State)' },
    { value: 'school_city', label: 'Schools (City)' },
    { value: 'school_state_city', label: 'Schools (State+City)' },
    { value: 'university_state', label: 'Universities (State)' },
    { value: 'university_city', label: 'Universities (City)' },
    { value: 'university_state_city', label: 'Universities (State+City)' },
    { value: 'stream', label: 'Streams' },
    { value: 'course', label: 'Courses' },
  ];

  useEffect(() => {
    if (activeTab === 'pages') {
      fetchPages();
    } else {
      fetchUrlStructures();
    }
  }, [activeTab, filterType, urlFilterType]);

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

  const fetchUrlStructures = async () => {
    try {
      setLoading(true);
      const params = urlFilterType !== 'all' ? `?type=${urlFilterType}` : '';
      const response = await api.get(`/admin/url-structures${params}`);
      setUrlStructures(response.data || []);
    } catch (error) {
      console.error('Error fetching URL structures:', error);
      setUrlStructures([]);
    } finally {
      setLoading(false);
    }
  };

  const generateUrls = async (urlType) => {
    if (!window.confirm(`Generate all ${urlType} URLs? This will create entries for editing.`)) return;
    
    setGenerating(true);
    try {
      const response = await api.post('/admin/url-structures/generate', { type: urlType });
      alert(`Created ${response.data.count} URLs successfully!`);
      fetchUrlStructures();
    } catch (error) {
      alert('Error generating URLs: ' + (error.response?.data?.detail || error.message));
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteUrl = async (urlId) => {
    if (!window.confirm('Delete this URL structure?')) return;
    try {
      await api.delete(`/admin/url-structures/${urlId}`);
      fetchUrlStructures();
    } catch (error) {
      alert('Error deleting URL');
    }
  };

  const handleToggleUrlActive = async (url) => {
    try {
      await api.put(`/admin/url-structures/${url.id}`, {
        is_active: !url.is_active
      });
      fetchUrlStructures();
    } catch (error) {
      console.error('Error updating URL:', error);
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

  const filteredUrls = urlStructures.filter(url =>
    url.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.link?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case 'india': return <FiGlobe className="text-blue-500" />;
      case 'state': 
      case 'college_state':
      case 'school_state': return <FiMapPin className="text-green-500" />;
      case 'city': 
      case 'college_city':
      case 'school_city': return <FiMapPin className="text-orange-500" />;
      case 'stream': return <FiBook className="text-purple-500" />;
      case 'course': return <FiBook className="text-cyan-500" />;
      case 'type': return <FiFilter className="text-pink-500" />;
      default: return <FiGlobe className="text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'india': return 'bg-blue-100 text-blue-700';
      case 'state': 
      case 'college_state':
      case 'school_state': return 'bg-green-100 text-green-700';
      case 'city': 
      case 'college_city':
      case 'school_city': return 'bg-orange-100 text-orange-700';
      case 'college_state_city':
      case 'school_state_city': return 'bg-teal-100 text-teal-700';
      case 'stream': return 'bg-purple-100 text-purple-700';
      case 'course': return 'bg-cyan-100 text-cyan-700';
      case 'type': return 'bg-pink-100 text-pink-700';
      case 'accreditation': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // URL Stats
  const urlStats = urlTypes.slice(1).map(type => ({
    ...type,
    count: urlStructures.filter(u => u.type === type.value).length
  }));

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Listing Pages Management</h1>
            <p className="text-gray-600 text-sm">Manage page content and URL structures</p>
          </div>
          {activeTab === 'pages' && (
            <Link to="/admin/listing-pages/new">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <FiPlus className="mr-2" /> Add Page Content
              </Button>
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'pages' 
                ? 'bg-orange-600 text-white' 
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            <FiBook className="inline mr-2" />
            Page Content
          </button>
          <button
            onClick={() => setActiveTab('urls')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'urls' 
                ? 'bg-orange-600 text-white' 
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            <FiGlobe className="inline mr-2" />
            URL Structures
          </button>
        </div>

        {/* Page Content Tab */}
        {activeTab === 'pages' && (
          <>
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
                            <a 
                              href={`/${page.url_slug}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium text-sm"
                            >
                              /{page.url_slug}
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(page.page_type)}`}>
                            {page.page_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{page.institution_type}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{page.page_title}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleTogglePublish(page)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
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
                          <div className="flex gap-2">
                            <Link to={`/admin/listing-pages/edit/${page.id}`}>
                              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                <FiEdit2 size={16} />
                              </button>
                            </Link>
                            <button 
                              onClick={() => handleDelete(page.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* URL Structures Tab */}
        {activeTab === 'urls' && (
          <>
            {/* URL Generator Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
              <h3 className="font-bold text-lg mb-4">Generate URL Structures</h3>
              <p className="text-sm text-gray-600 mb-4">Click to bulk-generate URL structures. You can edit them after generation.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={() => generateUrls('college_state')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiMapPin className="mr-2 text-green-500" />}
                  Colleges (State)
                </Button>
                <Button
                  onClick={() => generateUrls('college_city')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiMapPin className="mr-2 text-orange-500" />}
                  Colleges (City)
                </Button>
                <Button
                  onClick={() => generateUrls('college_state_city')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiGrid className="mr-2 text-teal-500" />}
                  Colleges (State+City)
                </Button>
                <Button
                  onClick={() => generateUrls('school_state')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiMapPin className="mr-2 text-green-500" />}
                  Schools (State)
                </Button>
                <Button
                  onClick={() => generateUrls('school_city')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiMapPin className="mr-2 text-orange-500" />}
                  Schools (City)
                </Button>
                <Button
                  onClick={() => generateUrls('school_state_city')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiGrid className="mr-2 text-teal-500" />}
                  Schools (State+City)
                </Button>
                <Button
                  onClick={() => generateUrls('university_state')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiMapPin className="mr-2 text-blue-500" />}
                  Universities (State)
                </Button>
                <Button
                  onClick={() => generateUrls('university_city')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiMapPin className="mr-2 text-indigo-500" />}
                  Universities (City)
                </Button>
                <Button
                  onClick={() => generateUrls('university_state_city')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiGrid className="mr-2 text-violet-500" />}
                  Universities (State+City)
                </Button>
                <Button
                  onClick={() => generateUrls('stream')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiBook className="mr-2 text-purple-500" />}
                  Streams
                </Button>
                <Button
                  onClick={() => generateUrls('course')}
                  disabled={generating}
                  variant="outline"
                  className="justify-start"
                >
                  {generating ? <FiLoader className="animate-spin mr-2" /> : <FiBook className="mr-2 text-cyan-500" />}
                  Courses
                </Button>
              </div>
            </div>

            {/* URL Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search URLs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={urlFilterType}
                  onChange={(e) => setUrlFilterType(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                >
                  {urlTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* URL Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
              {urlStats.map(stat => (
                <div key={stat.value} className="bg-white rounded-lg shadow p-3 text-center">
                  <div className="text-xl font-bold text-gray-800">{stat.count}</div>
                  <div className="text-xs text-gray-500 truncate">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* URL List */}
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto"></div>
              </div>
            ) : filteredUrls.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-10 text-center">
                <FiGlobe className="mx-auto text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No URL structures found. Use the generator above to create them.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">URL</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUrls.map((url, idx) => (
                      <tr key={url.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{url.display_order || idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-sm">{url.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(url.type)}`}>
                            {url.type?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <a 
                            href={url.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {url.link}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {url.state && url.city ? `${url.city}, ${url.state}` : url.state || url.city || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleUrlActive(url)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                              url.is_active 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {url.is_active ? <FiCheck size={12} /> : <FiEyeOff size={12} />}
                            {url.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => handleDeleteUrl(url.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ListingPagesManagement;
