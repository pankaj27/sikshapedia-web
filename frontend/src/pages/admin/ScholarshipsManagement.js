import React from 'react';
import GenericManagement from './GenericManagement';

const ScholarshipsManagement = () => {
  const fields = [
    { key: 'name', label: 'Scholarship Name', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'provider', label: 'Provider', type: 'text', required: true },
    { key: 'amount', label: 'Amount', type: 'number' },
    { 
      key: 'amount_type', 
      label: 'Amount Type', 
      type: 'select',
      options: [
        { value: 'Fixed', label: 'Fixed' },
        { value: 'Variable', label: 'Variable' },
        { value: 'Percentage', label: 'Percentage' },
      ]
    },
    { key: 'eligibility', label: 'Eligibility', type: 'textarea', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'how_to_apply', label: 'How to Apply', type: 'textarea', required: true },
    { key: 'website', label: 'Website', type: 'url' },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'name', label: 'Name' },
    { key: 'provider', label: 'Provider' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (value, item) => value ? `₹${value.toLocaleString()} (${item.amount_type})` : 'Variable'
    },
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
      title="Scholarships"
      endpoint="scholarships"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default ScholarshipsManagement;