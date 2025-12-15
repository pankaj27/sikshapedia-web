import React from 'react';
import GenericManagement from './GenericManagement';

const CitiesManagement = () => {
  const fields = [
    { key: 'name', label: 'City Name', type: 'text', required: true },
    { key: 'state', label: 'State', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { key: 'image_url', label: 'City Image URL', type: 'url' },
    { key: 'total_colleges', label: 'Total Colleges', type: 'number', required: true },
    { key: 'is_featured', label: 'Featured', type: 'checkbox' },
    { key: 'display_order', label: 'Display Order', type: 'number', required: true },
  ];

  const displayFields = [
    { key: 'name', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'total_colleges', label: 'Colleges', render: (value) => value?.toLocaleString() || 0 },
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
      title="Cities"
      endpoint="cities"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default CitiesManagement;