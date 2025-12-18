import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog post');
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-1">Manage your blog articles</p>
        </div>
        <Link to="/admin/blogs/new">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <FiPlus className="mr-2" /> Add Blog Post
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBlogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {blog.featured_image && (
                      <img src={blog.featured_image} alt="" className="w-12 h-12 rounded object-cover" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{blog.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{blog.excerpt?.substring(0, 60)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {blog.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{blog.author}</td>
                <td className="px-6 py-4 text-gray-600">{blog.views?.toLocaleString() || 0}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    blog.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {blog.is_featured ? 'Featured' : 'Regular'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <FiEye size={18} />
                    </button>
                    <Link
                      to={`/admin/blogs/edit/${blog.id}`}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
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
        
        {filteredBlogs.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium">No blog posts found</p>
            <p className="mt-1">Create your first blog post to get started</p>
            <Link to="/admin/blogs/new" className="mt-4 inline-block">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <FiPlus className="mr-2" /> Add Blog Post
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsManagement;
