import React from 'react';
import GenericManagement from './GenericManagement';

const RankingsManagement = () => {
  const fields = [
    { key: 'name', label: 'Ranking Name', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'year', label: 'Year', type: 'number', required: true },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'name', label: 'Ranking Name' },
    { key: 'year', label: 'Year' },
    { key: 'category', label: 'Category' },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  return (
    <GenericManagement
      title="Rankings"
      endpoint="rankings"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default RankingsManagement;