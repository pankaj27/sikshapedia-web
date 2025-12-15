import React from 'react';
import GenericManagement from './GenericManagement';

const BlogsManagement = () => {
  const fields = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text', required: true },
    { key: 'author', label: 'Author', type: 'text', required: true },
    { key: 'featured_image', label: 'Featured Image URL', type: 'url', required: true },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea', required: true, rows: 3 },
    { key: 'content', label: 'Content', type: 'textarea', required: true, rows: 10 },
    { key: 'tags', label: 'Tags (comma-separated)', type: 'text' },
    { key: 'is_featured', label: 'Featured', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'author', label: 'Author' },
    { key: 'views', label: 'Views', render: (value) => value?.toLocaleString() || 0 },
    { 
      key: 'is_featured', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Featured' : 'Regular'}
        </span>
      )
    },
  ];

  return (
    <GenericManagement
      title="Blogs"
      endpoint="blogs"
      fields={fields}
      displayFields={displayFields}
      searchField="title"
    />
  );
};

export default BlogsManagement;