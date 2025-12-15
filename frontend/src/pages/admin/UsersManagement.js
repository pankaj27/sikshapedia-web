import React from 'react';
import GenericManagement from './GenericManagement';

const UsersManagement = () => {
  const fields = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'is_premium', label: 'Premium User', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'is_premium', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Premium' : 'Free'}
        </span>
      )
    },
    { key: 'created_at', label: 'Joined', render: (value) => new Date(value).toLocaleDateString() },
  ];

  return (
    <GenericManagement
      title="Users Management"
      endpoint="users"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default UsersManagement;