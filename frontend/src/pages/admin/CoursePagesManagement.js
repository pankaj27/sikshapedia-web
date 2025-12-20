import React, { useState, useEffect } from 'react';
import { Link } from '../../components/CustomLink';
import { FiEdit2, FiLoader, FiEye, FiRefreshCw, FiGrid, FiLayers, FiAward, FiCheck, FiX } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const CoursePagesManagement = () => {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [resetting, setResetting] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/course-pages');
      setPages(response.data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (pageId) => {
    if (!window.confirm(`Reset "${pageId}" to default settings? This will remove all custom changes.`)) {
      return;
    }
    try {
      setResetting(pageId);
      await api.post(`/course-pages/${pageId}/reset`);
      await fetchPages();
      alert('Page reset to defaults successfully!');
    } catch (error) {
      console.error('Error resetting page:', error);
      alert('Failed to reset page');
    } finally {
      setResetting(null);
    }
  };

  const getPageTypeIcon = (type) => {
    switch (type) {
      case 'stream': return <FiGrid className="w-4 h-4" />;
      case 'level': return <FiLayers className="w-4 h-4" />;
      case 'degree': return <FiAward className="w-4 h-4" />;
      default: return <FiGrid className="w-4 h-4" />;
    }
  };

  const getPageTypeLabel = (type) => {
    switch (type) {
      case 'stream': return 'Stream';
      case 'level': return 'Level';
      case 'degree': return 'Degree';
      default: return 'Other';
    }
  };

  const getPageTypeBadgeColor = (type) => {
    switch (type) {
      case 'stream': return 'bg-blue-100 text-blue-700';
      case 'level': return 'bg-purple-100 text-purple-700';
      case 'degree': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Group pages by type
  const groupedPages = pages.reduce((acc, page) => {
    const type = page.page_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(page);
    return acc;
  }, {});

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <FiLoader className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Listing Pages</h1>
              <p className="text-gray-500 mt-1">Manage content for all 15 course listing pages</p>
            </div>
            <Button variant="outline" onClick={fetchPages}>
              <FiRefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600">
                <FiGrid className="w-5 h-5" />
                <span className="font-semibold">Stream Pages</span>
              </div>
              <div className="text-2xl font-bold text-blue-700 mt-1">
                {groupedPages.stream?.length || 0}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 text-purple-600">
                <FiLayers className="w-5 h-5" />
                <span className="font-semibold">Level Pages</span>
              </div>
              <div className="text-2xl font-bold text-purple-700 mt-1">
                {groupedPages.level?.length || 0}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 text-green-600">
                <FiAward className="w-5 h-5" />
                <span className="font-semibold">Degree Pages</span>
              </div>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {groupedPages.degree?.length || 0}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <FiCheck className="w-5 h-5" />
                <span className="font-semibold">Total Pages</span>
              </div>
              <div className="text-2xl font-bold text-gray-700 mt-1">
                {pages.length}
              </div>
            </div>
          </div>
        </div>

        {/* Pages Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Page</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{page.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{page.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{page.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getPageTypeBadgeColor(page.page_type)}`}>
                        {getPageTypeIcon(page.page_type)}
                        {getPageTypeLabel(page.page_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                        /courses/{page.id}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      {page.is_active !== false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <FiCheck className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          <FiX className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/courses/${page.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview Page"
                        >
                          <FiEye className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/admin/course-pages/edit/${page.id}`}
                          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Page"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleReset(page.id)}
                          disabled={resetting === page.id}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Reset to Default"
                        >
                          {resetting === page.id ? (
                            <FiLoader className="w-4 h-4 animate-spin" />
                          ) : (
                            <FiRefreshCw className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-semibold text-amber-800 mb-2">How it works</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• <strong>Stream Pages</strong>: Filter courses by field (Engineering, Medical, etc.)</li>
            <li>• <strong>Level Pages</strong>: Filter by education level (After 10th, After 12th)</li>
            <li>• <strong>Degree Pages</strong>: Filter by degree type (Diploma, PG, PhD)</li>
            <li>• Each page shows courses based on its filter configuration</li>
            <li>• Reset button reverts page to default settings</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CoursePagesManagement;
