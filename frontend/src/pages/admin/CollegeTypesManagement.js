import React from 'react';
import GenericManagement from './GenericManagement';

const CollegeTypesManagement = () => {
  const fields = [
    { key: 'name', label: 'Type Name', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'name', label: 'Type Name' },
    { key: 'slug', label: 'Slug' },
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
      title="College Types"
      endpoint="college-types"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default CollegeTypesManagement;