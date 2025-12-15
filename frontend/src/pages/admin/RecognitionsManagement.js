import React from 'react';
import GenericManagement from './GenericManagement';

const RecognitionsManagement = () => {
  const fields = [
    { key: 'name', label: 'Recognition Name (Short)', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'full_name', label: 'Full Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'website', label: 'Website', type: 'url' },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'name', label: 'Name' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'website', label: 'Website' },
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
      title="Recognitions"
      endpoint="recognitions"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default RecognitionsManagement;