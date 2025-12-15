import React from 'react';
import GenericManagement from './GenericManagement';

const BoardsManagement = () => {
  const fields = [
    { key: 'name', label: 'Board Name', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'country', label: 'Country', type: 'text', required: true },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'name', label: 'Board Name' },
    { key: 'country', label: 'Country' },
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
      title="Boards (Schools)"
      endpoint="boards"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default BoardsManagement;