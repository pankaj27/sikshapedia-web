import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiEye, FiFileText, FiLayout, FiSearch } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

import { Link } from '../../components/CustomLink';
const STATIC_PAGES = [
  { slug: 'about', name: 'About Us', path: '/about', icon: '📄' },
  { slug: 'contact', name: 'Contact Us', path: '/contact', icon: '📞' },
  { slug: 'privacy', name: 'Privacy Policy', path: '/privacy', icon: '🔒' },
  { slug: 'terms', name: 'Terms of Service', path: '/terms', icon: '📋' },
  { slug: 'admission-schools', name: 'School Admissions', path: '/admission/schools', icon: '🏫' },
  { slug: 'admission-colleges', name: 'College Admissions', path: '/admission/colleges', icon: '🎓' },
];

const StaticPagesManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await api.get('/static-pages');
      const existingPages = response.data;
      
      // Merge with static pages list
      const mergedPages = STATIC_PAGES.map(staticPage => {
        const existing = existingPages.find(p => p.slug === staticPage.slug);
        return {
          ...staticPage,
          ...existing,
          configured: !!existing,
        };
      });
      
      setPages(mergedPages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setPages(STATIC_PAGES.map(p => ({ ...p, configured: false })));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">📄 Static Pages</h1>
            <p className="text-gray-500 mt-1">Manage content, SEO, and widgets for static pages</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiFileText className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{pages.length}</p>
                <p className="text-sm text-gray-500">Total Pages</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiLayout className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{pages.filter(p => p.configured).length}</p>
                <p className="text-sm text-gray-500">Configured</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiSearch className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{pages.filter(p => p.meta_title).length}</p>
                <p className="text-sm text-gray-500">SEO Configured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <div key={page.slug} className="bg-white rounded-lg border hover:shadow-md transition overflow-hidden">
              <div className={`h-2 ${page.configured ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{page.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{page.name}</h3>
                      <p className="text-sm text-gray-500">{page.path}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    page.configured 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {page.configured ? 'Configured' : 'Default'}
                  </span>
                </div>

                {page.configured && (
                  <div className="mb-4 text-sm">
                    <p className="text-gray-600 line-clamp-2">
                      {page.hero_subtitle || page.meta_description || 'No description set'}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t">
                  <Link to={`/admin/static-pages/edit/${page.slug}`} className="flex-1">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                      <FiEdit2 className="mr-2" size={14} />
                      {page.configured ? 'Edit Page' : 'Configure'}
                    </Button>
                  </Link>
                  <a href={page.path} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <FiEye size={14} />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-purple-50 border border-purple-100 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-2">💡 How to use Static Pages</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Click "Configure" to set up page content, hero section, and SEO</li>
            <li>• Add widgets like FAQ, CTA Cards, Stats, and Rich Text blocks</li>
            <li>• SEO fields auto-generate but can be customized</li>
            <li>• Changes are saved and reflected on the live site immediately</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StaticPagesManagement;
