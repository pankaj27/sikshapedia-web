import React from 'react';
import GenericManagement from './GenericManagement';

const LoansManagement = () => {
  const fields = [
    { key: 'name', label: 'Loan Name', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'provider', label: 'Provider (Bank/NBFC)', type: 'text', required: true },
    { key: 'loan_amount_min', label: 'Minimum Loan Amount', type: 'number' },
    { key: 'loan_amount_max', label: 'Maximum Loan Amount', type: 'number' },
    { key: 'interest_rate', label: 'Interest Rate (%)', type: 'number', step: '0.01' },
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
      key: 'loan_amount_max', 
      label: 'Max Amount',
      render: (value) => value ? `₹${(value/100000).toFixed(2)}L` : 'N/A'
    },
    { 
      key: 'interest_rate', 
      label: 'Interest Rate',
      render: (value) => value ? `${value}%` : 'N/A'
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
      title="Education Loans"
      endpoint="loans"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default LoansManagement;