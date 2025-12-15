import React from 'react';
import GenericManagement from './GenericManagement';

const SubStreamsManagement = () => {
  const fields = [
    { key: 'stream_id', label: 'Parent Stream ID', type: 'text', required: true },
    { key: 'name', label: 'Sub-Stream Name', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'display_order', label: 'Display Order', type: 'number', required: true },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'stream_id', label: 'Parent Stream' },
    { key: 'display_order', label: 'Order' },
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
      title="Sub-Streams"
      endpoint="sub-streams"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default SubStreamsManagement;